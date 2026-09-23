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
    ]);

    $this->get('/instructors')->assertOk();
    $this->get('/instructors/'.$instructor->id)->assertOk();
});

test('authenticated client can book a lesson with an instructor', function () {
    $client = User::factory()->create(['role' => 'client']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Tarifa, Spain',
        'hourly_rate' => 80,
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
