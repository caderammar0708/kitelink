<?php

use App\Models\Instructor;
use App\Models\School;
use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new client users can register and redirect to dashboard', function () {
    $response = $this->post('/register', [
        'name' => 'Test Client',
        'email' => 'client@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'client',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
    expect(User::where('email', 'client@example.com')->first()->role)->toBe('client');
});

test('simplified instructor registration requires exact fields including license_number and redirects to verification pending', function () {
    $response = $this->post('/register', [
        'name' => 'John Instructor',
        'email' => 'instructor_new@example.com',
        'phone' => '+34 612 345 678',
        'license_number' => 'IKO-987654',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'instructor',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('verification.pending'));

    $user = User::where('email', 'instructor_new@example.com')->first();
    expect($user)->not->toBeNull()
        ->and($user->role)->toBe('instructor')
        ->and($user->phone)->toBe('+34 612 345 678');

    $instructor = Instructor::where('user_id', $user->id)->first();
    expect($instructor)->not->toBeNull()
        ->and($instructor->status)->toBe('pending')
        ->and($instructor->phone)->toBe('+34 612 345 678')
        ->and($instructor->license_number)->toBe('IKO-987654');
});

test('instructor registration fails if certification license number is omitted', function () {
    $response = $this->post('/register', [
        'name' => 'John Instructor',
        'email' => 'instructor_no_license@example.com',
        'phone' => '+34 612 345 678',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'instructor',
    ]);

    $response->assertSessionHasErrors('license_number');
    $this->assertGuest();
});

test('simplified school registration asks exact business fields and redirects to verification pending', function () {
    $response = $this->post('/register', [
        'school_name' => 'Tarifa Wind Academy',
        'registration_number' => 'B-12345678',
        'contact_name' => 'Carlos Rodriguez',
        'email' => 'school_new@example.com',
        'phone' => '+34 956 123 456',
        'location' => 'Tarifa, Spain',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'school',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('verification.pending'));

    $user = User::where('email', 'school_new@example.com')->first();
    expect($user)->not->toBeNull()
        ->and($user->role)->toBe('school')
        ->and($user->phone)->toBe('+34 956 123 456');

    $school = School::where('user_id', $user->id)->first();
    expect($school)->not->toBeNull()
        ->and($school->name)->toBe('Tarifa Wind Academy')
        ->and($school->registration_number)->toBe('B-12345678')
        ->and($school->contact_name)->toBe('Carlos Rodriguez')
        ->and($school->phone)->toBe('+34 956 123 456')
        ->and($school->location)->toBe('Tarifa, Spain')
        ->and($school->status)->toBe('pending');
});
