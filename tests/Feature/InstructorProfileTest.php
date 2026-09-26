<?php

use App\Models\Booking;
use App\Models\Instructor;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('guests cannot view instructor dashboard or profile', function () {
    $this->get('/instructor/dashboard')->assertRedirect('/login');
    $this->get('/instructor/profile')->assertRedirect('/login');
});

test('non-instructor users cannot access instructor portal', function () {
    $user = User::factory()->create(['role' => 'client']);

    $this->actingAs($user)
        ->get('/instructor/dashboard')
        ->assertForbidden();

    $this->actingAs($user)
        ->get('/instructor/profile')
        ->assertForbidden();
});

test('instructor users can view instructor dashboard', function () {
    $instructorUser = User::factory()->create(['role' => 'instructor']);

    $this->actingAs($instructorUser)
        ->get('/instructor/dashboard')
        ->assertOk();
});

test('instructor users accessing dashboard are redirected to instructor dashboard', function () {
    $instructorUser = User::factory()->create(['role' => 'instructor']);

    $this->actingAs($instructorUser)
        ->get('/dashboard')
        ->assertRedirect(route('instructor.dashboard'));
});

test('instructor users can view and update their profile with avatar', function () {
    Storage::fake('public');

    $instructorUser = User::factory()->create(['role' => 'instructor']);

    $this->actingAs($instructorUser)
        ->get('/instructor/profile')
        ->assertOk();

    $avatar = UploadedFile::fake()->create('avatar.jpg', 100, 'image/jpeg');

    $response = $this->actingAs($instructorUser)
        ->post('/instructor/profile', [
            'name' => 'Updated Instructor Name',
            'email' => 'updated@example.com',
            'bio' => 'Experienced kite coach with 10 years on the water.',
            'certifications' => 'IKO Level 2, VDWS Pro',
            'experience_years' => 10,
            'location' => 'Kalpitiya, Sri Lanka',
            'hourly_rate' => 75.00,
            'avatar' => $avatar,
        ]);

    $response->assertSessionHas('status', 'Profile updated successfully!');
    $response->assertRedirect();

    $instructorUser->refresh();

    expect($instructorUser->name)->toBe('Updated Instructor Name');
    expect($instructorUser->email)->toBe('updated@example.com');
    expect($instructorUser->profile_picture)->not->toBeNull();

    $instructorRecord = $instructorUser->instructor;
    expect($instructorRecord->bio)->toBe('Experienced kite coach with 10 years on the water.');
    expect($instructorRecord->certifications)->toBe('IKO Level 2, VDWS Pro');
    expect($instructorRecord->experience_years)->toBe(10);
    expect($instructorRecord->location)->toBe('Kalpitiya, Sri Lanka');
    expect((float) $instructorRecord->hourly_rate)->toBe(75.00);
});

test('join page can be rendered', function () {
    $this->get('/join')->assertOk();
});

test('users can register with school role', function () {
    $response = $this->post('/register', [
        'name' => 'Kite Paradise School',
        'email' => 'school@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'school',
    ]);

    $this->assertAuthenticated();
    $user = User::where('email', 'school@example.com')->first();
    expect($user->role)->toBe('school');
});

test('public users can view instructors index and detail pages', function () {
    $instructorUser = User::factory()->create(['role' => 'instructor', 'name' => 'John Kite Coach']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'hourly_rate' => 70,
        'bio' => 'IKO Senior Coach with 10 years experience.',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $this->get('/instructors')->assertOk();
    $this->get('/instructors/'.$instructor->id)->assertOk();
});

test('public instructors index only shows active and approved instructors', function () {
    $activeUser = User::factory()->create(['role' => 'instructor', 'name' => 'Active Approved Coach']);
    $activeInstructor = Instructor::create([
        'user_id' => $activeUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $pausedUser = User::factory()->create(['role' => 'instructor', 'name' => 'Paused Coach']);
    $pausedInstructor = Instructor::create([
        'user_id' => $pausedUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => false,
    ]);

    $pendingUser = User::factory()->create(['role' => 'instructor', 'name' => 'Pending Coach']);
    $pendingInstructor = Instructor::create([
        'user_id' => $pendingUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'pending',
        'is_active' => true,
    ]);

    $response = $this->get('/instructors');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('instructors/Index')
        ->has('instructors', 1)
        ->where('instructors.0.id', $activeInstructor->id)
    );
});

test('authenticated client can book a lesson with an active approved instructor', function () {
    $client = User::factory()->create(['role' => 'client']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Tarifa, Spain',
        'hourly_rate' => 80,
        'status' => 'approved',
        'is_active' => true,
    ]);

    $response = $this->actingAs($client)->post('/bookings', [
        'instructor_id' => $instructor->id,
        'date' => now()->addDays(2)->format('Y-m-d'),
        'time' => '11:00 AM - 01:00 PM (Midday Session)',
        'students_count' => 2,
        'lesson_type' => 'Beginner 1-on-1 Lesson (2h)',
        'notes' => 'Complete beginner looking for equipment safety and waterstart.',
    ]);

    $response->assertSessionHas('status');

    $this->assertDatabaseHas('bookings', [
        'student_id' => $client->id,
        'instructor_id' => $instructor->id,
        'students_count' => 2,
        'status' => 'pending',
    ]);
});

test('authenticated client cannot book a lesson with a paused instructor', function () {
    $client = User::factory()->create(['role' => 'client']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Tarifa, Spain',
        'hourly_rate' => 80,
        'status' => 'approved',
        'is_active' => false,
    ]);

    $response = $this->actingAs($client)->post('/bookings', [
        'instructor_id' => $instructor->id,
        'date' => now()->addDays(2)->format('Y-m-d'),
        'time' => '11:00 AM - 01:00 PM (Midday Session)',
        'students_count' => 2,
        'lesson_type' => 'Beginner 1-on-1 Lesson (2h)',
    ]);

    $response->assertSessionHasErrors(['instructor_id']);

    $this->assertDatabaseMissing('bookings', [
        'student_id' => $client->id,
        'instructor_id' => $instructor->id,
    ]);
});

test('instructor show page passes null existingBooking when user is guest or has no active booking', function () {
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'hourly_rate' => 70,
    ]);

    // Guest
    $this->get(route('instructors.show', $instructor))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('instructors/Show')
            ->where('existingBooking', null)
        );

    // Authenticated client with no bookings
    $client = User::factory()->create(['role' => 'client']);
    $this->actingAs($client)
        ->get(route('instructors.show', $instructor))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('instructors/Show')
            ->where('existingBooking', null)
        );
});

test('instructor show page passes active existingBooking when client has pending or confirmed booking', function () {
    $client = User::factory()->create(['role' => 'client']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'El Gouna, Egypt',
        'hourly_rate' => 90,
    ]);

    $booking = Booking::create([
        'student_id' => $client->id,
        'instructor_id' => $instructor->id,
        'date' => now()->addDays(3)->toDateString(),
        'time' => '08:30 AM - 10:30 AM (Morning Breeze)',
        'students_count' => 1,
        'lesson_type' => 'Beginner 1-on-1 Lesson (2h)',
        'total_price' => 180.00,
        'status' => 'pending',
    ]);

    $this->actingAs($client)
        ->get(route('instructors.show', $instructor))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('instructors/Show')
            ->where('existingBooking.id', $booking->id)
            ->where('existingBooking.status', 'pending')
        );

    // Cancelled or completed bookings should not be returned as existing active booking
    $booking->update(['status' => 'cancelled']);

    $this->actingAs($client)
        ->get(route('instructors.show', $instructor))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('instructors/Show')
            ->where('existingBooking', null)
        );
});

test('instructor can toggle listing availability status via patch request', function () {
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'is_active' => true,
    ]);

    // Pause listing
    $response = $this->actingAs($instructorUser)
        ->patch('/instructor/profile/availability-status', [
            'is_active' => false,
        ]);

    $response->assertSessionHas('status', 'Listing is now paused (Offline).');
    $instructor->refresh();
    expect($instructor->is_active)->toBeFalse();

    // Re-activate listing
    $response = $this->actingAs($instructorUser)
        ->patch('/instructor/profile/availability-status', [
            'is_active' => true,
        ]);

    $response->assertSessionHas('status', 'Listing is now active (Online).');
    $instructor->refresh();
    expect($instructor->is_active)->toBeTrue();
});

test('public instructor detail page displays saved profile fields accurately', function () {
    $instructorUser = User::factory()->create([
        'role' => 'instructor',
        'name' => 'Carlos Kitepro',
        'profile_picture' => '/storage/avatars/carlos.jpg',
    ]);

    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'bio' => 'Dedicated instructor specialized in wave riding and hydrofoiling.',
        'certifications' => 'IKO Level 3 Senior Coach',
        'experience_years' => 8,
        'location' => 'Tarifa, Spain',
        'languages' => ['English', 'Spanish', 'German'],
        'hourly_rate' => 85.00,
        'daily_rate' => 320.00,
        'profile_photo' => '/storage/avatars/carlos.jpg',
        'is_active' => true,
    ]);

    $this->get(route('instructors.show', $instructor))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('instructors/Show')
            ->where('instructor.id', $instructor->id)
            ->where('instructor.user.name', 'Carlos Kitepro')
            ->where('instructor.bio', 'Dedicated instructor specialized in wave riding and hydrofoiling.')
            ->where('instructor.certifications', 'IKO Level 3 Senior Coach')
            ->where('instructor.experience_years', 8)
            ->where('instructor.location', 'Tarifa, Spain')
            ->where('instructor.languages', ['English', 'Spanish', 'German'])
            ->where('instructor.hourly_rate', '85.00')
            ->where('instructor.daily_rate', '320.00')
            ->where('instructor.is_active', true)
        );
});
