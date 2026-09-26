<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Instructor;
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
            'instructor_id' => 'required|exists:instructors,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|string|max:50',
            'students_count' => 'nullable|integer|min:1|max:10',
            'lesson_type' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
        ]);

        $instructor = Instructor::with('user')->findOrFail($validated['instructor_id']);

        if (! $instructor->is_active || $instructor->status !== 'approved') {
            return back()->withErrors(['instructor_id' => 'This instructor is currently not accepting new bookings.']);
        }

        $hourlyRate = (float) ($instructor->hourly_rate ?? 65.00);
        $studentsCount = (int) ($validated['students_count'] ?? 1);
        $totalPrice = $hourlyRate * 2 * $studentsCount; // default 2-hour session

        $booking = Booking::create([
            'student_id' => $request->user()->id,
            'instructor_id' => $instructor->id,
            'date' => $validated['date'],
            'time' => $validated['time'],
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
