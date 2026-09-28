<?php

use App\Models\AdminAction;
use App\Models\Instructor;
use App\Models\PlatformSetting;
use App\Models\User;
use Illuminate\Support\Facades\Notification;

test('guests are redirected from admin routes to login', function () {
    $this->get('/admin/dashboard')->assertRedirect('/login');
    $this->get('/admin/approvals')->assertRedirect('/login');
});

test('non-admin users cannot access admin routes and receive 403', function () {
    $client = User::factory()->create(['role' => 'client']);
    $this->actingAs($client);

    $this->get('/admin/dashboard')->assertForbidden();
    $this->get('/admin/approvals')->assertForbidden();
    $this->get('/admin/instructors')->assertForbidden();
    $this->get('/admin/settings')->assertForbidden();
});

test('admin can access admin dashboard and subpages', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $this->get('/admin/dashboard')->assertOk();
    $this->get('/admin/approvals')->assertOk();
    $this->get('/admin/instructors')->assertOk();
    $this->get('/admin/schools')->assertOk();
    $this->get('/admin/clients')->assertOk();
    $this->get('/admin/bookings')->assertOk();
    $this->get('/admin/reviews')->assertOk();
    $this->get('/admin/settings')->assertOk();
    $this->get('/admin/messages')->assertOk();
});

test('admin login redirects directly to admin dashboard', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'password' => bcrypt('AdminSecret123!'),
    ]);

    $response = $this->post('/login', [
        'email' => $admin->email,
        'password' => 'AdminSecret123!',
    ]);

    $response->assertRedirect('/admin/dashboard');
});

test('admin can approve an instructor application with audit log and notification', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'status' => 'pending',
    ]);

    $this->actingAs($admin);

    $response = $this->post("/admin/approvals/instructors/{$instructor->id}/approve");
    $response->assertSessionHas('success');

    $instructor->refresh();
    expect($instructor->status)->toBe('approved')
        ->and($instructor->reviewed_by)->toBe($admin->id)
        ->and($instructor->reviewed_at)->not->toBeNull();

    // Check audit log
    $audit = AdminAction::where('action', 'approve')
        ->where('target_id', $instructor->id)
        ->first();
    expect($audit)->not->toBeNull()
        ->and($audit->admin_id)->toBe($admin->id);

    // Check notification in database
    expect($instructorUser->notifications()->count())->toBe(1);
});

test('admin can reject an instructor application with reason and audit log', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'status' => 'pending',
    ]);

    $this->actingAs($admin);

    $response = $this->post("/admin/approvals/instructors/{$instructor->id}/reject", [
        'reason' => 'Proof document illegible. Please re-upload.',
    ]);
    $response->assertSessionHas('success');

    $instructor->refresh();
    expect($instructor->status)->toBe('rejected')
        ->and($instructor->rejection_reason)->toBe('Proof document illegible. Please re-upload.')
        ->and($instructor->reviewed_by)->toBe($admin->id);

    // Check notification in database
    $notification = $instructorUser->notifications()->first();
    expect($notification)->not->toBeNull()
        ->and($notification->data['reason'])->toBe('Proof document illegible. Please re-upload.');
});

test('rejected instructor editing profile automatically resubmits application to pending', function () {
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'status' => 'rejected',
        'rejection_reason' => 'Missing license document',
    ]);

    $this->actingAs($instructorUser);

    $response = $this->post('/instructor/profile', [
        'name' => $instructorUser->name,
        'email' => $instructorUser->email,
        'bio' => 'Updated bio with credentials',
        'certifications' => 'IKO Level 2 Certified #4928',
        'location' => 'Tarifa, Spain',
    ]);

    $response->assertSessionHas('status');

    $instructor->refresh();
    expect($instructor->status)->toBe('pending')
        ->and($instructor->rejection_reason)->toBeNull();
});

test('admin can suspend and reactivate an instructor', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'status' => 'approved',
    ]);

    $this->actingAs($admin);

    // Suspend
    $this->post("/admin/instructors/{$instructor->id}/suspend");
    $instructor->refresh();
    $instructorUser->refresh();

    expect($instructor->status)->toBe('suspended')
        ->and($instructorUser->is_suspended)->toBeTrue();

    // Reactivate
    $this->post("/admin/instructors/{$instructor->id}/reactivate");
    $instructor->refresh();
    $instructorUser->refresh();

    expect($instructor->status)->toBe('approved')
        ->and($instructorUser->is_suspended)->toBeFalse();
});

test('suspended users cannot authenticate', function () {
    $user = User::factory()->create([
        'password' => bcrypt('Password123!'),
        'is_suspended' => true,
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'Password123!',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('admin can update platform settings', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin);

    $response = $this->post('/admin/settings', [
        'platform_name' => 'KiteLink Global',
        'support_email' => 'help@kitelink.com',
        'contact_phone' => '+1 (555) 000-1111',
        'require_instructor_approval' => true,
        'require_school_approval' => true,
        'booking_commission_percentage' => 12.5,
        'allow_public_registration' => true,
    ]);

    $response->assertSessionHas('success');

    expect(PlatformSetting::get('platform_name'))->toBe('KiteLink Global')
        ->and(PlatformSetting::get('support_email'))->toBe('help@kitelink.com')
        ->and(PlatformSetting::get('booking_commission_percentage'))->toBe('12.5');
});

test('public registration rejects admin role', function () {
    $response = $this->post('/register', [
        'name' => 'Fake Admin',
        'email' => 'fakeadmin@test.com',
        'password' => 'SecretPassword123!',
        'password_confirmation' => 'SecretPassword123!',
        'role' => 'admin',
    ]);

    $response->assertSessionHasErrors('role');
    $this->assertDatabaseMissing('users', ['email' => 'fakeadmin@test.com']);
});

test('admin can view instructor license number in approvals list to verify against issuing body', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $instructorUser = User::factory()->create(['role' => 'instructor', 'name' => 'Kite Master Leo']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'license_number' => 'IKO-LEVEL2-998811',
        'status' => 'pending',
    ]);

    $this->actingAs($admin);

    $response = $this->get('/admin/approvals?tab=instructors');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/Approvals')
        ->where('items.data.0.license_number', 'IKO-LEVEL2-998811')
    );
});
