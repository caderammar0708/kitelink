<?php

use App\Models\Booking;
use App\Models\Instructor;
use App\Models\Review;
use App\Models\School;
use App\Models\SchoolPackage;
use App\Models\User;

test('guest can visit public landing page without authentication', function () {
    $response = $this->get('/');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('welcome'));
});

test('guest can access public schools listing page and see only approved active schools', function () {
    $user1 = User::factory()->create(['role' => 'school']);
    $approvedSchool = School::create([
        'user_id' => $user1->id,
        'name' => 'Kalpitiya Wind Academy',
        'location' => 'Kalpitiya, Sri Lanka',
        'description' => 'World class kitesurfing center on the lagoon.',
        'certifications' => 'IKO Affiliated Center',
        'facilities' => ['Gear Storage', 'Rescue Boat', 'Compressor'],
        'status' => 'approved',
        'is_active' => true,
    ]);

    $user2 = User::factory()->create(['role' => 'school']);
    $pendingSchool = School::create([
        'user_id' => $user2->id,
        'name' => 'Pending Lagoon Center',
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'pending',
        'is_active' => true,
    ]);

    $user3 = User::factory()->create(['role' => 'school']);
    $inactiveSchool = School::create([
        'user_id' => $user3->id,
        'name' => 'Inactive Surf Academy',
        'location' => 'Tarifa, Spain',
        'status' => 'approved',
        'is_active' => false,
    ]);

    $response = $this->get('/schools');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('schools/Index')
        ->has('schools', 1)
        ->where('schools.0.id', $approvedSchool->id)
        ->where('schools.0.name', 'Kalpitiya Wind Academy')
    );
});

test('public schools listing filters by search query and location', function () {
    $user1 = User::factory()->create(['role' => 'school']);
    School::create([
        'user_id' => $user1->id,
        'name' => 'Tarifa Kite Pro',
        'location' => 'Tarifa, Spain',
        'description' => 'Spanish wind capital kiteschool.',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $user2 = User::factory()->create(['role' => 'school']);
    School::create([
        'user_id' => $user2->id,
        'name' => 'Kalpitiya Dream Kiting',
        'location' => 'Kalpitiya, Sri Lanka',
        'description' => 'Flat water paradise.',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $response = $this->get('/schools?search=Tarifa');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('schools/Index')
        ->has('schools', 1)
        ->where('schools.0.name', 'Tarifa Kite Pro')
    );

    $responseLocation = $this->get('/schools?location=Kalpitiya');
    $responseLocation->assertOk();
    $responseLocation->assertInertia(fn ($page) => $page
        ->component('schools/Index')
        ->has('schools', 1)
        ->where('schools.0.name', 'Kalpitiya Dream Kiting')
    );
});

test('guest can access public school profile page with instructor roster and reviews', function () {
    $schoolUser = User::factory()->create(['role' => 'school']);
    $school = School::create([
        'user_id' => $schoolUser->id,
        'name' => 'Ocean Breeze Kiteschool',
        'location' => 'Dakhla, Morocco',
        'description' => 'Lagoon and wave kitesurfing center with modern gear.',
        'facilities' => ['Showers', 'Repair Shop', 'Restaurant'],
        'certifications' => 'VDWS, IKO Center',
        'status' => 'approved',
        'is_active' => true,
    ]);

    // Attach instructor to school
    $instructorUser = User::factory()->create(['role' => 'instructor', 'name' => 'Youssef El Amrani']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'school_id' => $school->id,
        'bio' => 'IKO Senior Instructor with 8 years experience.',
        'certifications' => 'IKO Level 2',
        'hourly_rate' => 70,
        'is_active' => true,
        'status' => 'approved',
    ]);

    // Add review for instructor
    $studentUser = User::factory()->create(['role' => 'client', 'name' => 'Alice Waters']);
    Review::create([
        'student_id' => $studentUser->id,
        'instructor_id' => $instructor->id,
        'rating' => 5,
        'comment' => 'Fantastic lessons at Ocean Breeze with Youssef! Highly recommended.',
        'is_hidden' => false,
    ]);

    $response = $this->get("/schools/{$school->id}");

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('schools/Show')
        ->where('school.id', $school->id)
        ->where('school.name', 'Ocean Breeze Kiteschool')
        ->has('school.instructors', 1)
        ->where('school.instructors.0.id', $instructor->id)
        ->has('reviews', 1)
        ->where('reviews.0.rating', 5)
        ->where('reviews.0.comment', 'Fantastic lessons at Ocean Breeze with Youssef! Highly recommended.')
    );
});

test('unapproved or inactive school profile returns 404', function () {
    $pendingSchool = School::create([
        'name' => 'Secret Spot School',
        'location' => 'Unknown',
        'status' => 'pending',
        'is_active' => true,
    ]);

    $this->get("/schools/{$pendingSchool->id}")->assertNotFound();

    $inactiveSchool = School::create([
        'name' => 'Closed School',
        'location' => 'Unknown',
        'status' => 'approved',
        'is_active' => false,
    ]);

    $this->get("/schools/{$inactiveSchool->id}")->assertNotFound();
});

test('legacy /kite-centers route redirects to /schools', function () {
    $response = $this->get('/kite-centers');
    $response->assertRedirect(route('schools.index'));
});

test('public instructor discovery remains accessible and unaffected', function () {
    $instructorUser = User::factory()->create(['role' => 'instructor', 'name' => 'Carlos Wind']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Tarifa, Spain',
        'bio' => 'Freestyle specialist',
        'certifications' => 'IKO Level 1',
        'hourly_rate' => 60,
        'is_active' => true,
        'status' => 'approved',
    ]);

    $response = $this->get('/instructors');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('instructors/Index'));

    $showResponse = $this->get("/instructors/{$instructor->id}");
    $showResponse->assertOk();
    $showResponse->assertInertia(fn ($page) => $page->component('instructors/Show'));
});

test('public school profile shows active packages and filters out inactive packages', function () {
    $schoolUser = User::factory()->create(['role' => 'school']);
    $school = School::create([
        'user_id' => $schoolUser->id,
        'name' => 'Kalpitiya Wave Academy',
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $activePackage = SchoolPackage::create([
        'school_id' => $school->id,
        'name' => 'Beginner 3-Day Course',
        'type' => 'course',
        'duration_label' => '3 Days',
        'price' => 280.00,
        'description' => 'Comprehensive beginner course with equipment included.',
        'features' => ['Equipment included', 'IKO certification', 'Rescue boat'],
        'is_active' => true,
    ]);

    $inactivePackage = SchoolPackage::create([
        'school_id' => $school->id,
        'name' => 'Archived Off-Season Clinic',
        'type' => 'camp',
        'duration_label' => '2 Weeks',
        'price' => 999.00,
        'description' => 'Inactive clinic.',
        'features' => ['Archived'],
        'is_active' => false,
    ]);

    $response = $this->get("/schools/{$school->id}");
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('schools/Show')
        ->has('school.packages', 1)
        ->where('school.packages.0.id', $activePackage->id)
        ->where('school.packages.0.name', 'Beginner 3-Day Course')
    );
});

test('authenticated client can book a school package', function () {
    $schoolUser = User::factory()->create(['role' => 'school']);
    $school = School::create([
        'user_id' => $schoolUser->id,
        'name' => 'Lagoon Center',
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $package = SchoolPackage::create([
        'school_id' => $school->id,
        'name' => 'Full Day Gear Rental',
        'type' => 'rental',
        'duration_label' => '1 Day',
        'price' => 45.00,
        'description' => 'Full day gear rental.',
        'features' => ['Kite + Board'],
        'is_active' => true,
    ]);

    $client = User::factory()->create(['role' => 'client']);

    $response = $this->actingAs($client)->post('/bookings', [
        'school_id' => $school->id,
        'package_id' => $package->id,
        'date' => now()->addDays(3)->toDateString(),
        'time' => '09:00',
        'notes' => 'Looking forward to rental!',
    ]);

    $response->assertSessionHas('success');

    $booking = Booking::where('student_id', $client->id)
        ->where('school_id', $school->id)
        ->where('package_id', $package->id)
        ->first();

    expect($booking)->not->toBeNull()
        ->and((float) $booking->total_price)->toEqual(45.00)
        ->and($booking->status)->toBe('pending');
});
