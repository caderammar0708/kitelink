<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\Instructor\AvailabilityController;
use App\Http\Controllers\Instructor\BookingController as InstructorBookingController;
use App\Http\Controllers\Instructor\BrowseInstructorController;
use App\Http\Controllers\Instructor\DashboardController as InstructorDashboardController;
use App\Http\Controllers\Instructor\HireRequestController;
use App\Http\Controllers\Instructor\MessageController;
use App\Http\Controllers\Instructor\NotificationController;
use App\Http\Controllers\Instructor\ProfileController as InstructorProfileController;
use App\Http\Controllers\Instructor\RevenueController;
use App\Http\Controllers\Instructor\ReviewController;
use App\Http\Controllers\Instructor\SettingsController as InstructorSettingsController;
use App\Http\Controllers\InstructorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/join', function () {
    return Inertia::render('join');
})->name('join');

// Public Instructor Discovery
Route::get('/instructors', [InstructorController::class, 'index'])->name('instructors.index');
Route::get('/instructors/{instructor}', [InstructorController::class, 'show'])->name('instructors.show');

// Authenticated Routes
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        if ($request->user()->role === 'instructor') {
            return redirect()->route('instructor.dashboard');
        }

        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
});

// Instructor Portal
Route::middleware(['auth', 'instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    // 1. Dashboard
    Route::get('/dashboard', [InstructorDashboardController::class, 'index'])
        ->name('dashboard');

    // 2. Profile
    Route::get('/profile', [InstructorProfileController::class, 'edit'])
        ->name('profile');
    Route::post('/profile', [InstructorProfileController::class, 'update'])
        ->name('profile.update');

    // 3. Availability Calendar
    Route::get('/availability', [AvailabilityController::class, 'index'])
        ->name('availability');
    Route::post('/availability', [AvailabilityController::class, 'store'])
        ->name('availability.store');
    Route::delete('/availability/{availability}', [AvailabilityController::class, 'destroy'])
        ->name('availability.destroy');

    // 4. Bookings
    Route::get('/bookings', [InstructorBookingController::class, 'index'])
        ->name('bookings');
    Route::post('/bookings/{booking}/accept', [InstructorBookingController::class, 'accept'])
        ->name('bookings.accept');
    Route::post('/bookings/{booking}/decline', [InstructorBookingController::class, 'decline'])
        ->name('bookings.decline');

    // 5. Revenue & Earnings
    Route::get('/revenue', [RevenueController::class, 'index'])
        ->name('revenue');

    // 6. Reviews
    Route::get('/reviews', [ReviewController::class, 'index'])
        ->name('reviews');
    Route::post('/reviews/{review}/reply', [ReviewController::class, 'reply'])
        ->name('reviews.reply');

    // 7. Messages
    Route::get('/messages', [MessageController::class, 'index'])
        ->name('messages');
    Route::get('/messages/{conversation}', [MessageController::class, 'show'])
        ->name('messages.show');
    Route::post('/messages/{conversation}', [MessageController::class, 'store'])
        ->name('messages.store');

    // 8. School Hire Requests
    Route::get('/hire-requests', [HireRequestController::class, 'index'])
        ->name('hire-requests');
    Route::post('/hire-requests/{hireRequest}/accept', [HireRequestController::class, 'accept'])
        ->name('hire-requests.accept');
    Route::post('/hire-requests/{hireRequest}/decline', [HireRequestController::class, 'decline'])
        ->name('hire-requests.decline');
    Route::post('/hire-requests/{hireRequest}/counter', [HireRequestController::class, 'counter'])
        ->name('hire-requests.counter');

    // 9. Browse Other Instructors
    Route::get('/browse', [BrowseInstructorController::class, 'index'])
        ->name('browse');

    // 10. Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications');
    Route::post('/notifications/read', [NotificationController::class, 'markAsRead'])
        ->name('notifications.read');

    // 11. Settings
    Route::get('/settings', [InstructorSettingsController::class, 'index'])
        ->name('settings');
    Route::post('/settings/password', [InstructorSettingsController::class, 'updatePassword'])
        ->name('settings.password');
    Route::post('/settings/email', [InstructorSettingsController::class, 'updateEmail'])
        ->name('settings.email');
    Route::post('/settings/notifications', [InstructorSettingsController::class, 'updateNotificationPreferences'])
        ->name('settings.notifications');
    Route::post('/settings/deactivate', [InstructorSettingsController::class, 'deactivate'])
        ->name('settings.deactivate');
});

// Fallback alias for legacy /instructor/{id}
Route::get('/instructor/{instructor}', [InstructorController::class, 'show'])->whereNumber('instructor');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
