<?php

use App\Models\AdminAction;
use App\Models\Booking;
use App\Models\Instructor;
use App\Models\School;
use App\Models\SchoolPackage;
use App\Models\User;

test('pending school viewing dashboard sees verification pending page', function () {
    $user = User::factory()->create(['role' => 'school']);
    $school = School::create([
        'user_id' => $user->id,
        'name' => 'Pending Kite School',
        'registration_number' => 'REG-999',
        'contact_name' => 'Elena Drake',
        'phone' => '+34 600 000 000',
        'location' => 'Tarifa, Spain',
        'status' => 'pending',
    ]);

    $response = $this->actingAs($user)->get('/school/dashboard');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('auth/VerificationPending')
        ->where('role', 'school')
        ->where('application.name', 'Pending Kite School')
        ->where('application.status', 'pending')
    );
});

test('approved school can view school dashboard with overview stats', function () {
    $user = User::factory()->create(['role' => 'school']);
    $school = School::create([
        'user_id' => $user->id,
        'name' => 'Approved Kite Pro Academy',
        'registration_number' => 'REG-100',
        'contact_name' => 'Elena Drake',
        'status' => 'approved',
        'is_active' => true,
    ]);

    // Create 2 instructors under this school
    $instructor1User = User::factory()->create(['role' => 'instructor']);
    $instructor1 = Instructor::create([
        'user_id' => $instructor1User->id,
        'school_id' => $school->id,
        'status' => 'approved',
        'is_freelance' => false,
        'is_active' => true,
    ]);

    $instructor2User = User::factory()->create(['role' => 'instructor']);
    $instructor2 = Instructor::create([
        'user_id' => $instructor2User->id,
        'school_id' => $school->id,
        'status' => 'approved',
        'is_freelance' => false,
        'is_active' => true,
    ]);

    // Create a completed booking for instructor 1
    $client = User::factory()->create(['role' => 'client']);
    Booking::create([
        'student_id' => $client->id,
        'instructor_id' => $instructor1->id,
        'school_id' => $school->id,
        'date' => now()->toDateString(),
        'time' => '10:00:00',
        'hours' => 2,
        'status' => 'completed',
        'total_price' => 240.00,
    ]);

    $response = $this->actingAs($user)->get('/school/dashboard');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('school/Dashboard')
        ->where('stats.total_instructors', 2)
        ->where('stats.total_bookings', 1)
        ->where('stats.monthly_revenue', 240)
    );
});

test('admin can view school approvals and approve a pending school', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $schoolUser = User::factory()->create(['role' => 'school']);
    $school = School::create([
        'user_id' => $schoolUser->id,
        'name' => 'Canary Winds',
        'registration_number' => 'ES-B123456',
        'contact_name' => 'Mateo Silva',
        'email' => 'mateo@canarywinds.com',
        'phone' => '+34 928 111 222',
        'location' => 'Fuerteventura, Spain',
        'status' => 'pending',
    ]);

    $this->actingAs($admin);

    // Admin approvals page displays schools
    $response = $this->get('/admin/approvals');
    $response->assertOk();

    // Approve school
    $approveResponse = $this->post("/admin/approvals/schools/{$school->id}/approve");
    $approveResponse->assertSessionHas('success');

    $school->refresh();
    expect($school->status)->toBe('approved')
        ->and($school->reviewed_by)->toBe($admin->id);

    // Verify audit log
    $audit = AdminAction::where('action', 'approve')
        ->where('target_id', $school->id)
        ->first();
    expect($audit)->not->toBeNull();
});

test('admin can reject a pending school with reason', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $schoolUser = User::factory()->create(['role' => 'school']);
    $school = School::create([
        'user_id' => $schoolUser->id,
        'name' => 'Rejected School',
        'registration_number' => 'INVALID-00',
        'contact_name' => 'Fake Owner',
        'status' => 'pending',
    ]);

    $this->actingAs($admin);

    $rejectResponse = $this->post("/admin/approvals/schools/{$school->id}/reject", [
        'reason' => 'Business registration number could not be validated with local authorities.',
    ]);
    $rejectResponse->assertSessionHas('success');

    $school->refresh();
    expect($school->status)->toBe('rejected')
        ->and($school->rejection_reason)->toBe('Business registration number could not be validated with local authorities.');
});

test('approved school can update full profile with facilities, gear list, and certifications', function () {
    $user = User::factory()->create(['role' => 'school']);
    $school = School::create([
        'user_id' => $user->id,
        'name' => 'Tarifa Kite Center',
        'status' => 'approved',
    ]);

    $response = $this->actingAs($user)->post('/school/profile', [
        'name' => 'Tarifa Kite Center Pro',
        'description' => 'Premier kitesurfing center on Valdevaqueros beach.',
        'location' => 'Tarifa, Cadiz, Spain',
        'phone' => '+34 956 684 000',
        'contact_name' => 'Captain Kite',
        'facilities' => ['Lockers', 'Hot Showers', 'Rescue Boat', 'Gear Storage'],
        'gear_list' => ['Duotone 2025 Kites', 'North Boards', 'Mystic Harnesses'],
        'certifications' => ['IKO Affiliated Center', 'VDWS Official Station'],
    ]);

    $response->assertSessionHas('status');

    $school->refresh();
    expect($school->name)->toBe('Tarifa Kite Center Pro')
        ->and($school->description)->toBe('Premier kitesurfing center on Valdevaqueros beach.')
        ->and($school->facilities)->toContain('Rescue Boat')
        ->and($school->gear_list)->toContain('Duotone 2025 Kites')
        ->and($school->certifications)->toContain('IKO Affiliated Center');
});

test('school can add new coach to roster and remove coach', function () {
    $user = User::factory()->create(['role' => 'school']);
    $school = School::create([
        'user_id' => $user->id,
        'name' => 'Aegean Kite School',
        'status' => 'approved',
    ]);

    $this->actingAs($user);

    // 1. Add new coach directly
    $coachResponse = $this->post('/school/instructors/coach', [
        'name' => 'Yiannis Coach',
        'email' => 'yiannis@aegeankite.com',
        'phone' => '+30 690 123 4567',
        'certifications' => 'IKO Level 2 Certified',
        'bio' => '10 years instructing in Paros and Rhodes.',
    ]);

    $coachResponse->assertSessionHas('status');

    $coachUser = User::where('email', 'yiannis@aegeankite.com')->first();
    expect($coachUser)->not->toBeNull();

    $instructor = Instructor::where('user_id', $coachUser->id)->first();
    expect($instructor)->not->toBeNull()
        ->and($instructor->school_id)->toBe($school->id)
        ->and($instructor->status)->toBe('approved');

    // 2. Remove coach from roster
    $removeResponse = $this->delete("/school/instructors/{$instructor->id}");
    $removeResponse->assertSessionHas('status');

    $instructor->refresh();
    expect($instructor->school_id)->toBeNull()
        ->and($instructor->is_freelance)->toBeTrue();
});

test('approved school can view, create, edit, toggle, and delete packages', function () {
    $user = User::factory()->create(['role' => 'school']);
    $school = School::create([
        'user_id' => $user->id,
        'name' => 'Kalpitiya Wave Station',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $this->actingAs($user);

    // 1. View packages index
    $indexResponse = $this->get('/school/packages');
    $indexResponse->assertOk();
    $indexResponse->assertInertia(fn ($page) => $page->component('school/Packages')->has('packages', 0));

    // 2. Create a package
    $createResponse = $this->post('/school/packages', [
        'name' => 'Zero to Hero 3-Day Course',
        'type' => 'course',
        'duration_label' => '3 Days',
        'price' => 280.00,
        'description' => 'Comprehensive beginner package with equipment and safety boat.',
        'features' => ['Equipment included', 'IKO Level 1 & 2', 'Rescue boat'],
        'is_active' => true,
    ]);

    $createResponse->assertSessionHas('status');

    $package = SchoolPackage::where('school_id', $school->id)->first();
    expect($package)->not->toBeNull()
        ->and($package->name)->toBe('Zero to Hero 3-Day Course')
        ->and($package->type)->toBe('course')
        ->and($package->features)->toHaveCount(3)
        ->and($package->is_active)->toBeTrue();

    // 3. Update the package
    $updateResponse = $this->put("/school/packages/{$package->id}", [
        'name' => 'Zero to Hero 3-Day Course (Updated)',
        'type' => 'course',
        'duration_label' => '3 Days',
        'price' => 310.00,
        'description' => 'Updated description.',
        'features' => ['Equipment included', 'IKO Level 1 & 2', 'Rescue boat', 'Video analysis'],
        'is_active' => true,
    ]);

    $updateResponse->assertSessionHas('status');
    $package->refresh();
    expect($package->name)->toBe('Zero to Hero 3-Day Course (Updated)')
        ->and((float) $package->price)->toEqual(310.00)
        ->and($package->features)->toHaveCount(4);

    // 4. Toggle package active status
    $toggleResponse = $this->patch("/school/packages/{$package->id}/toggle");
    $toggleResponse->assertSessionHas('status');
    $package->refresh();
    expect($package->is_active)->toBeFalse();

    // 5. Delete package
    $deleteResponse = $this->delete("/school/packages/{$package->id}");
    $deleteResponse->assertSessionHas('status');
    expect(SchoolPackage::find($package->id))->toBeNull();
});
