<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\Client\BookingController as ClientBookingController;
use App\Http\Controllers\Client\MessageController as ClientMessageController;
use App\Http\Controllers\Client\ReviewController as ClientReviewController;
use App\Http\Controllers\Client\SettingsController as ClientSettingsController;
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
use App\Http\Controllers\NotificationController as GlobalNotificationController;
use App\Http\Controllers\WeatherController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/join', function () {
    return Inertia::render('join');
})->name('join');

// Public Weather API (Meteosource proxy with rate limiting)
Route::get('/api/weather', [WeatherController::class, 'getWeather'])->middleware('throttle:60,1')->name('api.weather');
Route::get('/api/weather/search-locations', [WeatherController::class, 'searchLocations'])->middleware('throttle:60,1')->name('api.weather.search');

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

    // Client Dashboard & Features
    Route::get('/client/bookings', [ClientBookingController::class, 'index'])->name('client.bookings');
    Route::get('/bookings', fn () => redirect()->route('client.bookings'));

    Route::get('/client/messages', [ClientMessageController::class, 'index'])->name('client.messages');
    Route::post('/client/messages/start', [ClientMessageController::class, 'start'])->name('client.messages.start');
    Route::get('/client/messages/{conversation}', [ClientMessageController::class, 'show'])->whereNumber('conversation')->name('client.messages.show');
    Route::post('/client/messages/{conversation}', [ClientMessageController::class, 'store'])->whereNumber('conversation')->name('client.messages.store');

    Route::post('/client/reviews', [ClientReviewController::class, 'store'])->name('client.reviews.store');

    // Global Notifications
    Route::get('/notifications', [GlobalNotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/read-all', [GlobalNotificationController::class, 'markAllAsRead'])->name('notifications.readAll');
    Route::post('/notifications/{id}/read', [GlobalNotificationController::class, 'markAsRead'])->name('notifications.read');

    // Client Settings
    Route::get('/client/settings', [ClientSettingsController::class, 'index'])->name('client.settings');
    Route::post('/client/settings/profile', [ClientSettingsController::class, 'updateProfile'])->name('client.settings.profile');
    Route::post('/client/settings/password', [ClientSettingsController::class, 'updatePassword'])->name('client.settings.password');
    Route::post('/client/settings/notifications', [ClientSettingsController::class, 'updateNotifications'])->name('client.settings.notifications');
    Route::post('/client/settings/destroy', [ClientSettingsController::class, 'destroyAccount'])->name('client.settings.destroy');

    // Unified Role-Aware Settings Redirect
    Route::get('/settings', function (Request $request) {
        if ($request->user()->role === 'instructor') {
            return redirect()->route('instructor.settings');
        }

        return redirect()->route('client.settings');
    })->name('settings');

    // Legacy aliases redirecting to unified settings
    Route::get('/settings/profile', fn () => redirect()->route('settings'));
    Route::get('/settings/password', fn () => redirect()->route('settings'));
    Route::get('/settings/appearance', fn () => redirect()->route('settings'));

    // Weather Dashboard
    Route::get('/weather', [WeatherController::class, 'index'])->name('weather');
    Route::get('/client/weather', [WeatherController::class, 'index'])->name('client.weather');
    Route::get('/instructor/weather', [WeatherController::class, 'index'])->name('instructor.weather');
    Route::get('/school/weather', [WeatherController::class, 'index'])->name('school.weather');
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
    Route::match(['patch', 'post'], '/profile/availability-status', [InstructorProfileController::class, 'updateAvailabilityStatus'])
        ->name('profile.availabilityStatus');

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
    Route::post('/settings/profile', [InstructorSettingsController::class, 'updateProfile'])
        ->name('settings.profile');
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

require __DIR__.'/auth.php';
