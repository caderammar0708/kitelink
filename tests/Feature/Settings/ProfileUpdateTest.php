<?php

use App\Models\Instructor;
use App\Models\User;

test('client settings page is displayed for client user', function () {
    $user = User::factory()->create(['role' => 'client']);

    $response = $this
        ->actingAs($user)
        ->get('/client/settings');

    $response->assertOk();
});

test('instructor settings page is displayed for instructor user', function () {
    $user = User::factory()->create(['role' => 'instructor']);
    Instructor::create([
        'user_id' => $user->id,
        'status' => 'approved',
        'is_active' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->get('/instructor/settings');

    $response->assertOk();
});

test('/settings redirects to role-specific settings page', function () {
    $client = User::factory()->create(['role' => 'client']);
    $this->actingAs($client)
        ->get('/settings')
        ->assertRedirect(route('client.settings'));

    $instructor = User::factory()->create(['role' => 'instructor']);
    $this->actingAs($instructor)
        ->get('/settings')
        ->assertRedirect(route('instructor.settings'));
});

test('client profile information can be updated', function () {
    $user = User::factory()->create(['role' => 'client']);

    $response = $this
        ->actingAs($user)
        ->post('/client/settings/profile', [
            'name' => 'Updated Client Name',
            'email' => 'client_updated@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $user->refresh();

    expect($user->name)->toBe('Updated Client Name');
    expect($user->email)->toBe('client_updated@example.com');
});

test('instructor profile information can be updated', function () {
    $user = User::factory()->create(['role' => 'instructor']);

    $response = $this
        ->actingAs($user)
        ->post('/instructor/settings/profile', [
            'name' => 'Updated Instructor Name',
            'email' => 'instructor_updated@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $user->refresh();

    expect($user->name)->toBe('Updated Instructor Name');
    expect($user->email)->toBe('instructor_updated@example.com');
});

test('client user can delete their account from settings', function () {
    $user = User::factory()->create(['role' => 'client']);

    $response = $this
        ->actingAs($user)
        ->post('/client/settings/destroy', [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/');

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create(['role' => 'client']);

    $response = $this
        ->actingAs($user)
        ->from('/client/settings')
        ->post('/client/settings/destroy', [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect('/client/settings');

    expect($user->fresh())->not->toBeNull();
});
