<?php

use App\Models\AuditLog;
use App\Models\Instructor;
use App\Models\PlatformSetting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    //
});

test('it records successful login and logout events in audit log', function () {
    $user = User::factory()->create([
        'email' => 'surfer@example.com',
        'password' => Hash::make('Secret123!'),
        'role' => 'client',
    ]);

    // Perform login
    $response = $this->post('/login', [
        'email' => 'surfer@example.com',
        'password' => 'Secret123!',
    ]);

    $response->assertRedirect();
    $this->assertAuthenticatedAs($user);

    // Verify login event was logged
    $loginAudit = AuditLog::where('event', 'login')
        ->where('user_id', $user->id)
        ->latest()
        ->first();

    expect($loginAudit)->not->toBeNull();
    expect($loginAudit->user_name)->toBe($user->name);
    expect($loginAudit->user_role)->toBe('client');
    expect($loginAudit->description)->toContain('logged in');

    // Perform logout
    $this->post('/logout');

    $logoutAudit = AuditLog::where('event', 'logout')
        ->where('user_id', $user->id)
        ->latest()
        ->first();

    expect($logoutAudit)->not->toBeNull();
    expect($logoutAudit->description)->toContain('logged out');
});

test('it records failed login attempts and never stores password', function () {
    $response = $this->post('/login', [
        'email' => 'unknown_attacker@domain.com',
        'password' => 'SuperSecretHackingPassword123!',
    ]);

    $response->assertSessionHasErrors();

    $failedAudit = AuditLog::where('event', 'login_failed')
        ->where('user_name', 'unknown_attacker@domain.com')
        ->latest()
        ->first();

    expect($failedAudit)->not->toBeNull();
    expect($failedAudit->user_role)->toBe('guest');
    expect($failedAudit->new_values)->toHaveKey('attempted_email');
    expect($failedAudit->new_values['attempted_email'])->toBe('unknown_attacker@domain.com');

    // Crucial check: password must NEVER be in description, old_values or new_values
    expect(json_encode($failedAudit->new_values))->not->toContain('SuperSecretHackingPassword123!');
    expect($failedAudit->description)->not->toContain('SuperSecretHackingPassword123!');
});

test('it records model creation and update diffs via Auditable trait', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    // Create a model
    $setting = PlatformSetting::create([
        'key' => 'test_feature_flag',
        'value' => 'disabled',
        'group' => 'features',
    ]);

    $createAudit = AuditLog::where('auditable_type', PlatformSetting::class)
        ->where('auditable_id', $setting->id)
        ->where('event', 'created')
        ->first();

    expect($createAudit)->not->toBeNull();
    expect($createAudit->user_id)->toBe($admin->id);
    expect($createAudit->new_values)->toHaveKey('key');

    // Update the model
    $setting->update([
        'value' => 'enabled',
    ]);

    $updateAudit = AuditLog::where('auditable_type', PlatformSetting::class)
        ->where('auditable_id', $setting->id)
        ->where('event', 'updated')
        ->first();

    expect($updateAudit)->not->toBeNull();
    expect($updateAudit->old_values['value'])->toBe('disabled');
    expect($updateAudit->new_values['value'])->toBe('enabled');
});

test('it masks sensitive attributes on User updates', function () {
    $user = User::factory()->create([
        'role' => 'client',
        'password' => Hash::make('OldPassword123!'),
    ]);

    $this->actingAs($user);

    $user->update([
        'password' => Hash::make('NewPassword456!'),
    ]);

    $audit = AuditLog::where('auditable_type', User::class)
        ->where('auditable_id', $user->id)
        ->whereIn('event', ['updated', 'password_changed'])
        ->latest()
        ->first();

    expect($audit)->not->toBeNull();
    // Raw password hashes must never be present
    expect($audit->old_values)->not->toHaveKey('password');
    expect($audit->new_values)->not->toHaveKey('password');
});

test('it records explicit named events for admin actions', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $client = User::factory()->create(['role' => 'client', 'is_suspended' => false]);

    $this->actingAs($admin);

    // Admin suspends client
    $response = $this->post("/admin/clients/{$client->id}/suspend");
    $response->assertRedirect();

    $suspendAudit = AuditLog::where('auditable_type', User::class)
        ->where('auditable_id', $client->id)
        ->where('event', 'suspended')
        ->first();

    expect($suspendAudit)->not->toBeNull();
    expect($suspendAudit->user_id)->toBe($admin->id);
    expect($suspendAudit->user_role)->toBe('admin');
});

test('non-admins cannot access audit logs and receive 403', function () {
    $client = User::factory()->create(['role' => 'client']);
    $instructor = User::factory()->create(['role' => 'instructor']);

    // Guest redirected to login
    $this->get('/admin/audit-logs')->assertRedirect('/login');

    // Client gets 403
    $this->actingAs($client)->get('/admin/audit-logs')->assertForbidden();
    $this->actingAs($client)->get('/admin/audit-logs/export')->assertForbidden();

    // Instructor gets 403
    $this->actingAs($instructor)->get('/admin/audit-logs')->assertForbidden();
});

test('admin can access audit log page and export CSV', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get('/admin/audit-logs');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/AuditLogs')->has('logs'));

    $exportResponse = $this->actingAs($admin)->get('/admin/audit-logs/export');
    $exportResponse->assertOk();
    expect($exportResponse->headers->get('content-type'))->toContain('text/csv');
});

test('audit logs are append-only and cannot be updated directly', function () {
    $log = AuditLog::create([
        'event' => 'created',
        'description' => 'Original description',
        'user_name' => 'Test User',
    ]);

    // Updating is blocked by booted() hook
    $log->description = 'Tampered description';
    $saved = $log->save();

    expect($saved)->toBeFalse();
    expect($log->fresh()->description)->toBe('Original description');
});

test('audit:prune command prunes logs older than retention period', function () {
    // Create an old audit log (400 days old)
    DB::table('audit_logs')->insert([
        'event' => 'login',
        'description' => 'Old historical log',
        'created_at' => Carbon::now()->subDays(400)->toDateTimeString(),
        'updated_at' => Carbon::now()->subDays(400)->toDateTimeString(),
    ]);
    DB::table('audit_logs')->insert([
        'event' => 'login',
        'description' => 'Recent log',
        'created_at' => Carbon::now()->subDays(10)->toDateTimeString(),
        'updated_at' => Carbon::now()->subDays(10)->toDateTimeString(),
    ]);

    expect(AuditLog::where('description', 'Old historical log')->exists())->toBeTrue();
    expect(AuditLog::where('description', 'Recent log')->exists())->toBeTrue();

    // Run prune command with 365 days
    $this->artisan('audit:prune', ['--days' => 365])->assertSuccessful();

    expect(AuditLog::where('description', 'Old historical log')->exists())->toBeFalse();
    expect(AuditLog::where('description', 'Recent log')->exists())->toBeTrue();
});
