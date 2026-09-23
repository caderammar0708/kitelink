<?php

use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Instructor;
use App\Models\User;
use App\Notifications\BookingStatusChangedNotification;
use App\Notifications\NewBookingNotification;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\Notification;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
});

test('client can view their bookings list', function () {
    $client = User::factory()->create(['role' => 'client']);
    $otherClient = User::factory()->create(['role' => 'client']);

    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $clientBooking = Booking::create([
        'instructor_id' => $instructor->id,
        'student_id' => $client->id,
        'date' => now()->addDays(2)->toDateString(),
        'time' => '09:00 - 11:00',
        'students_count' => 1,
        'lesson_type' => 'Beginner Zero to Hero',
        'total_price' => 150.00,
        'status' => 'pending',
    ]);

    $otherBooking = Booking::create([
        'instructor_id' => $instructor->id,
        'student_id' => $otherClient->id,
        'date' => now()->addDays(5)->toDateString(),
        'time' => '14:00 - 16:00',
        'students_count' => 2,
        'lesson_type' => 'Waterstart',
        'total_price' => 220.00,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($client)->get('/client/bookings');

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('client/Bookings')
            ->has('bookings', 1)
            ->where('bookings.0.id', $clientBooking->id)
            ->where('bookings.0.lesson_type', 'Beginner Zero to Hero')
        );
});

test('client receives notification when instructor accepts or declines booking', function () {
    Notification::fake();

    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $client = User::factory()->create(['role' => 'client']);
    $booking = Booking::create([
        'instructor_id' => $instructor->id,
        'student_id' => $client->id,
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

    Notification::assertSentTo($client, BookingStatusChangedNotification::class, function ($notification) use ($booking) {
        return $notification->booking->status === 'confirmed' && $notification->booking->id === $booking->id;
    });

    $this->actingAs($instructorUser)
        ->from('/instructor/bookings')
        ->post("/instructor/bookings/{$booking->id}/decline")
        ->assertRedirect('/instructor/bookings');

    Notification::assertSentTo($client, BookingStatusChangedNotification::class, function ($notification) use ($booking) {
        return $notification->booking->status === 'cancelled' && $notification->booking->id === $booking->id;
    });
});

test('instructor receives notification when student creates booking', function () {
    Notification::fake();

    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'hourly_rate' => 60,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $client = User::factory()->create(['role' => 'client']);

    $response = $this->actingAs($client)->post(route('bookings.store'), [
        'instructor_id' => $instructor->id,
        'date' => now()->addDays(4)->toDateString(),
        'time' => '10:00 - 12:00',
        'students_count' => 1,
        'lesson_type' => 'Beginner',
        'total_price' => 120,
    ]);

    $response->assertSessionHas('booking_id');

    Notification::assertSentTo($instructorUser, NewBookingNotification::class);
});

test('client can start a conversation and message an instructor', function () {
    $client = User::factory()->create(['role' => 'client']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $response = $this->actingAs($client)
        ->post(route('client.messages.start'), ['instructor_id' => $instructor->id]);

    $conversation = Conversation::first();
    expect($conversation)->not->toBeNull();
    $response->assertRedirect(route('client.messages', ['conversation' => $conversation->id]));

    $messageResponse = $this->actingAs($client)
        ->from(route('client.messages.show', $conversation->id))
        ->post(route('client.messages.store', $conversation->id), [
            'body' => 'Hello instructor, excited for the lesson!',
        ]);

    $messageResponse->assertRedirect(route('client.messages.show', $conversation->id));
    $this->assertDatabaseHas('messages', [
        'conversation_id' => $conversation->id,
        'sender_id' => $client->id,
        'body' => 'Hello instructor, excited for the lesson!',
    ]);
});

test('client can leave a review only for completed bookings', function () {
    $client = User::factory()->create(['role' => 'client']);
    $otherClient = User::factory()->create(['role' => 'client']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);
    $instructor = Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $booking = Booking::create([
        'instructor_id' => $instructor->id,
        'student_id' => $client->id,
        'date' => now()->addDays(2)->toDateString(),
        'time' => '09:00 - 11:00',
        'students_count' => 1,
        'lesson_type' => 'Beginner Zero to Hero',
        'total_price' => 150.00,
        'status' => 'pending',
    ]);

    // Review on pending booking should fail with 422
    $this->actingAs($client)
        ->post(route('client.reviews.store'), [
            'booking_id' => $booking->id,
            'rating' => 5,
            'comment' => 'Great lesson before it happened?!',
        ])
        ->assertStatus(422);

    // Another client trying to review should fail with 403
    $this->actingAs($otherClient)
        ->post(route('client.reviews.store'), [
            'booking_id' => $booking->id,
            'rating' => 5,
            'comment' => 'Not my booking!',
        ])
        ->assertForbidden();

    // Mark booking as completed
    $booking->update(['status' => 'completed']);

    // Review on completed booking should succeed
    $this->actingAs($client)
        ->from('/client/bookings')
        ->post(route('client.reviews.store'), [
            'booking_id' => $booking->id,
            'rating' => 5,
            'comment' => 'Amazing instructor! Learned so much.',
        ])
        ->assertRedirect('/client/bookings')
        ->assertSessionHas('status');

    $this->assertDatabaseHas('reviews', [
        'booking_id' => $booking->id,
        'instructor_id' => $instructor->id,
        'student_id' => $client->id,
        'rating' => 5,
        'comment' => 'Amazing instructor! Learned so much.',
    ]);
});
