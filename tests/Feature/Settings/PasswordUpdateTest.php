<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('client password can be updated in client settings', function () {
    $user = User::factory()->create(['role' => 'client']);

    $response = $this
        ->actingAs($user)
        ->from('/client/settings')
        ->post('/client/settings/password', [
            'current_password' => 'password',
            'password' => 'new-client-password',
            'password_confirmation' => 'new-client-password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/client/settings');

    expect(Hash::check('new-client-password', $user->refresh()->password))->toBeTrue();
});

test('instructor password can be updated in instructor settings', function () {
    $user = User::factory()->create(['role' => 'instructor']);

    $response = $this
        ->actingAs($user)
        ->from('/instructor/settings')
        ->post('/instructor/settings/password', [
            'current_password' => 'password',
            'password' => 'new-instructor-password',
            'password_confirmation' => 'new-instructor-password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/instructor/settings');

    expect(Hash::check('new-instructor-password', $user->refresh()->password))->toBeTrue();
});

test('correct password must be provided to update password', function () {
    $user = User::factory()->create(['role' => 'client']);

    $response = $this
        ->actingAs($user)
        ->from('/client/settings')
        ->post('/client/settings/password', [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response
        ->assertSessionHasErrors('current_password')
        ->assertRedirect('/client/settings');
});
