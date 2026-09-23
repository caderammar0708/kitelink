<?php

use App\Models\Booking;
use App\Models\Instructor;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;

test('instructor can access all portal pages', function () {
    $user = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $user->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $this->actingAs($user)->get('/instructor/dashboard')->assertOk();
    $this->actingAs($user)->get('/instructor/bookings')->assertOk();
    $this->actingAs($user)->get('/instructor/availability')->assertOk();
    $this->actingAs($user)->get('/instructor/revenue')->assertOk();
    $this->actingAs($user)->get('/instructor/reviews')->assertOk();
    $this->actingAs($user)->get('/instructor/messages')->assertOk();
    $this->actingAs($user)->get('/instructor/hire-requests')->assertOk();
    $this->actingAs($user)->get('/instructor/browse')->assertOk();
    $this->actingAs($user)->get('/instructor/notifications')->assertOk();
    $this->actingAs($user)->get('/instructor/settings')->assertOk();
});

test('instructor can accept and decline bookings', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);

    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $student = User::factory()->create(['role' => 'client']);
    $booking = Booking::create([
        'instructor_id' => $instructor->id,
        'student_id' => $student->id,
        'date' => now()->addDays(3)->toDateString(),
        'time' => '10:00 - 12:00',
        'students_count' => 1,
        'lesson_type' => 'Waterstart',
        'total_price' => 120.00,
        'status' => 'pending',
    ]);

    $this->actingAs($instructorUser)
        ->from('/instructor/bookings')
        ->post("/instructor/bookings/{$booking->id}/accept")
        ->assertRedirect('/instructor/bookings');

    expect($booking->refresh()->status)->toBe('confirmed');

    $this->actingAs($instructorUser)
        ->from('/instructor/bookings')
        ->post("/instructor/bookings/{$booking->id}/decline")
        ->assertRedirect('/instructor/bookings');

    expect($booking->refresh()->status)->toBe('cancelled');
});
