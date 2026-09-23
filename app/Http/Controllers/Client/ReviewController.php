<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Review;
use App\Notifications\ReviewNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Submit a review for a completed booking.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'booking_id' => ['required', 'exists:bookings,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        /** @var Booking $booking */
        $booking = Booking::with('instructor.user')->findOrFail($validated['booking_id']);

        abort_unless($booking->student_id === $user->id, 403, 'Unauthorized booking review.');
        abort_unless($booking->status === 'completed', 422, 'Reviews can only be submitted for completed sessions.');

        $review = Review::updateOrCreate(
            ['booking_id' => $booking->id],
            [
                'student_id' => $user->id,
                'instructor_id' => $booking->instructor_id,
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
            ]
        );

        $instructorUser = $booking->instructor?->user;
        if ($instructorUser) {
            $instructorUser->notify(new ReviewNotification($review));
        }

        return back()->with('status', 'Review submitted successfully! Thank you for your feedback.');
    }
}
