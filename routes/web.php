<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\Instructor\DashboardController as InstructorDashboardController;
use App\Http\Controllers\Instructor\ProfileController as InstructorProfileController;
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
    Route::get('/dashboard', [InstructorDashboardController::class, 'index'])
        ->name('dashboard');
    Route::get('/profile', [InstructorProfileController::class, 'edit'])
        ->name('profile');
    Route::post('/profile', [InstructorProfileController::class, 'update'])
        ->name('profile.update');
});

// Fallback alias for legacy /instructor/{id}
Route::get('/instructor/{instructor}', [InstructorController::class, 'show'])->whereNumber('instructor');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
