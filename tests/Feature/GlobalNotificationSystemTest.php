<?php

use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Instructor;
use App\Models\User;
use App\Notifications\MessageReceivedNotification;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);
});

test('authenticated user can fetch recent notifications as json', function () {
    $user = User::factory()->create(['role' => 'client']);

    // Seed 2 notifications for this user
    DB::table('notifications')->insert([
        [
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\NewBookingNotification',
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => json_encode([
                'type' => 'booking',
                'title' => 'Booking Confirmed',
                'message' => 'Your session is confirmed.',
                'link' => '/client/bookings',
            ]),
            'read_at' => null,
            'created_at' => now()->subMinutes(10),
            'updated_at' => now()->subMinutes(10),
        ],
        [
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\MessageReceivedNotification',
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => json_encode([
                'type' => 'message',
                'title' => 'Alex sent you a message',
                'message' => 'See you on the water!',
                'link' => '/client/messages/1',
            ]),
            'read_at' => now()->subMinutes(2),
            'created_at' => now()->subMinutes(5),
            'updated_at' => now()->subMinutes(2),
        ],
    ]);

    $response = $this->actingAs($user)
        ->getJson('/notifications');

    $response->assertOk()
        ->assertJsonStructure([
            'notifications' => [
                '*' => ['id', 'type', 'data', 'read_at', 'created_at', 'created_at_human'],
            ],
            'unread_count',
            'has_unread',
        ])
        ->assertJson([
            'unread_count' => 1,
            'has_unread' => true,
        ]);
});

test('user can mark single notification as read', function () {
    $user = User::factory()->create(['role' => 'client']);
    $notificationId = (string) Str::uuid();

    DB::table('notifications')->insert([
        'id' => $notificationId,
        'type' => 'App\\Notifications\\NewBookingNotification',
        'notifiable_type' => User::class,
        'notifiable_id' => $user->id,
        'data' => json_encode([
            'type' => 'booking',
            'title' => 'Booking Update',
            'message' => 'Update details.',
            'link' => '/client/bookings',
        ]),
        'read_at' => null,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->actingAs($user)
        ->postJson("/notifications/{$notificationId}/read");

    $response->assertOk()
        ->assertJson(['success' => true]);

    $dbNotification = DB::table('notifications')->where('id', $notificationId)->first();
    expect($dbNotification->read_at)->not->toBeNull();
});

test('user can mark all notifications as read', function () {
    $user = User::factory()->create(['role' => 'instructor']);

    for ($i = 0; $i < 3; $i++) {
        DB::table('notifications')->insert([
            'id' => (string) Str::uuid(),
            'type' => 'App\\Notifications\\NewBookingNotification',
            'notifiable_type' => User::class,
            'notifiable_id' => $user->id,
            'data' => json_encode([
                'type' => 'booking',
                'title' => 'Request '.$i,
                'message' => 'Details',
                'link' => '/instructor/bookings',
            ]),
            'read_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    expect($user->unreadNotifications()->count())->toBe(3);

    $response = $this->actingAs($user)
        ->postJson('/notifications/read-all');

    $response->assertOk()
        ->assertJson(['success' => true]);

    expect($user->unreadNotifications()->count())->toBe(0);
});

test('sending client message dispatches MessageReceivedNotification to instructor', function () {
    Notification::fake();

    $client = User::factory()->create(['role' => 'client']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);

    $conversation = Conversation::create([
        'participant_one_id' => $client->id,
        'participant_two_id' => $instructorUser->id,
        'type' => 'client',
        'last_message_at' => now(),
    ]);

    $response = $this->actingAs($client)
        ->from("/client/messages/{$conversation->id}")
        ->post("/client/messages/{$conversation->id}", [
            'body' => 'Hi instructor, do you provide wetsuits?',
        ]);

    $response->assertRedirect("/client/messages/{$conversation->id}");

    Notification::assertSentTo($instructorUser, MessageReceivedNotification::class, function ($notification) use ($conversation) {
        $data = $notification->toArray($notification->message->sender);

        return $notification->conversation->id === $conversation->id
            && $data['type'] === 'message'
            && str_contains($data['message'], 'do you provide wetsuits');
    });
});

test('client can update notification_sound_enabled in profile', function () {
    $client = User::factory()->create([
        'role' => 'client',
        'notification_sound_enabled' => true,
    ]);

    $this->actingAs($client)
        ->patch('/settings/profile', [
            'name' => 'Updated Client',
            'email' => $client->email,
            'notification_sound_enabled' => false,
        ])
        ->assertRedirect('/settings/profile');

    expect($client->refresh()->notification_sound_enabled)->toBeFalse();

    $this->actingAs($client)
        ->patch('/settings/profile', [
            'name' => 'Updated Client',
            'email' => $client->email,
            'notification_sound_enabled' => true,
        ])
        ->assertRedirect('/settings/profile');

    expect($client->refresh()->notification_sound_enabled)->toBeTrue();
});

test('instructor can update notification_sound_enabled in settings', function () {
    $instructorUser = User::factory()->create([
        'role' => 'instructor',
        'notification_sound_enabled' => true,
    ]);
    Instructor::create([
        'user_id' => $instructorUser->id,
        'location' => 'Kalpitiya, Sri Lanka',
        'status' => 'approved',
        'is_active' => true,
    ]);

    $this->actingAs($instructorUser)
        ->from('/instructor/settings')
        ->post('/instructor/settings/notifications', [
            'notification_sound_enabled' => false,
        ])
        ->assertRedirect('/instructor/settings');

    expect($instructorUser->refresh()->notification_sound_enabled)->toBeFalse();
});

test('viewing a conversation automatically marks its message notifications as read in database', function () {
    $client = User::factory()->create(['role' => 'client']);
    $instructorUser = User::factory()->create(['role' => 'instructor']);

    $conversation = Conversation::create([
        'participant_one_id' => $client->id,
        'participant_two_id' => $instructorUser->id,
        'type' => 'client',
        'last_message_at' => now(),
    ]);

    $notificationId = (string) Str::uuid();
    DB::table('notifications')->insert([
        'id' => $notificationId,
        'type' => MessageReceivedNotification::class,
        'notifiable_type' => User::class,
        'notifiable_id' => $client->id,
        'data' => json_encode([
            'type' => 'message',
            'title' => 'New message',
            'message' => 'Hello student!',
            'conversation_id' => $conversation->id,
            'link' => "/client/messages/{$conversation->id}",
        ]),
        'read_at' => null,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    expect($client->unreadNotifications()->count())->toBe(1);

    // Client visits the conversation thread
    $this->actingAs($client)
        ->get("/client/messages/{$conversation->id}")
        ->assertOk();

    expect($client->fresh()->unreadNotifications()->count())->toBe(0);

    $dbNotification = DB::table('notifications')->where('id', $notificationId)->first();
    expect($dbNotification->read_at)->not->toBeNull();
});

test('viewing client bookings with highlight marks that booking notification as read in database', function () {
    $client = User::factory()->create(['role' => 'client']);
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
        'time' => '10:00 - 12:00',
        'students_count' => 1,
        'lesson_type' => 'Beginner',
        'total_price' => 120.00,
        'status' => 'confirmed',
    ]);

    $notificationId = (string) Str::uuid();
    DB::table('notifications')->insert([
        'id' => $notificationId,
        'type' => BookingStatusChangedNotification::class,
        'notifiable_type' => User::class,
        'notifiable_id' => $client->id,
        'data' => json_encode([
            'type' => 'booking',
            'title' => 'Booking Confirmed',
            'message' => 'Confirmed',
            'booking_id' => $booking->id,
            'link' => "/client/bookings?highlight={$booking->id}",
        ]),
        'read_at' => null,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    expect($client->unreadNotifications()->count())->toBe(1);

    $this->actingAs($client)
        ->get("/client/bookings?highlight={$booking->id}")
        ->assertOk();

    expect($client->fresh()->unreadNotifications()->count())->toBe(0);

    $dbNotification = DB::table('notifications')->where('id', $notificationId)->first();
    expect($dbNotification->read_at)->not->toBeNull();
});
