<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Instructor;
use App\Models\SchoolPackage;
use App\Notifications\NewBookingNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Store a newly created booking in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'instructor_id' => 'nullable|required_without:package_id|exists:instructors,id',
            'package_id' => 'nullable|required_without:instructor_id|exists:school_packages,id',
            'school_id' => 'nullable|exists:schools,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'nullable|string|max:50',
            'students_count' => 'nullable|integer|min:1|max:10',
            'lesson_type' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
        ]);

        $studentsCount = (int) ($validated['students_count'] ?? 1);
        $time = $validated['time'] ?? '10:00 AM - Flexible';

        // 1. Package Booking Flow (School offering)
        if (! empty($validated['package_id'])) {
            $package = SchoolPackage::with(['school.user'])->findOrFail($validated['package_id']);

            if (! $package->is_active) {
                return back()->withErrors(['package_id' => 'This package is currently not available for booking.']);
            }

            if (! $package->school || ! $package->school->is_active || $package->school->status !== 'approved') {
                return back()->withErrors(['package_id' => 'The kite center offering this package is not currently accepting bookings.']);
            }

            $totalPrice = (float) $package->price * $studentsCount;
            $lessonType = $validated['lesson_type'] ?? "{$package->name} ({$package->duration_label})";

            $booking = Booking::create([
                'student_id' => $request->user()->id,
                'instructor_id' => $validated['instructor_id'] ?? null,
                'school_id' => $package->school_id,
                'package_id' => $package->id,
                'date' => $validated['date'],
                'time' => $time,
                'students_count' => $studentsCount,
                'lesson_type' => $lessonType,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            // Notify school owner
            if ($package->school->user) {
                $package->school->user->notify(new NewBookingNotification($booking));
            }

            return back()
                ->with('status', 'Package booking request submitted successfully! The kite center will review and confirm your reservation.')
                ->with('success', 'Package booking request submitted successfully! The kite center will review and confirm your reservation.')
                ->with('booking_id', $booking->id);
        }

        // 2. Instructor Direct Booking Flow
        $instructor = Instructor::with('user')->findOrFail($validated['instructor_id']);

        if (! $instructor->is_active || $instructor->status !== 'approved') {
            return back()->withErrors(['instructor_id' => 'This instructor is currently not accepting new bookings.']);
        }

        $hourlyRate = (float) ($instructor->hourly_rate ?? 65.00);
        $totalPrice = $hourlyRate * 2 * $studentsCount; // default 2-hour session

        $booking = Booking::create([
            'student_id' => $request->user()->id,
            'instructor_id' => $instructor->id,
            'school_id' => $instructor->school_id,
            'date' => $validated['date'],
            'time' => $time,
            'students_count' => $studentsCount,
            'lesson_type' => $validated['lesson_type'] ?? 'Beginner 1-on-1 Lesson (2h)',
            'total_price' => $totalPrice,
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        if ($instructor->user) {
            $instructor->user->notify(new NewBookingNotification($booking));
        }

        return back()
            ->with('status', 'Booking request submitted successfully! Your instructor will confirm your session shortly.')
            ->with('booking_id', $booking->id);
    }
}
