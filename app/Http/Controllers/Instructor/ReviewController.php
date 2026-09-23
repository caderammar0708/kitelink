<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Display instructor reviews and feedback.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        /** @var Instructor $instructor */
        $instructor = $user->instructor()->first();
        if (! $instructor) {
            $instructor = Instructor::create([
                'user_id' => $user->id,
                'status' => 'approved',
                'is_freelance' => true,
                'is_active' => true,
            ]);
        }

        $reviews = $instructor->reviews()
            ->with('student:id,name,profile_picture')
            ->latest()
            ->get();

        $totalReviews = $reviews->count();
        $averageRating = $totalReviews > 0 ? round((float) $reviews->avg('rating'), 1) : 5.0;

        $ratingDistribution = [
            5 => $reviews->where('rating', 5)->count(),
            4 => $reviews->where('rating', 4)->count(),
            3 => $reviews->where('rating', 3)->count(),
            2 => $reviews->where('rating', 2)->count(),
            1 => $reviews->where('rating', 1)->count(),
        ];

        return Inertia::render('instructor/Reviews', [
            'reviews' => $reviews,
            'averageRating' => $averageRating,
            'totalReviews' => $totalReviews,
            'ratingDistribution' => $ratingDistribution,
        ]);
    }

    /**
     * Reply to a student review.
     */
    public function reply(Request $request, Review $review): RedirectResponse
    {
        $user = $request->user();
        /** @var Instructor $instructor */
        $instructor = $user->instructor()->firstOrFail();

        abort_unless($review->instructor_id === $instructor->id, 403);

        $validated = $request->validate([
            'instructor_reply' => ['required', 'string', 'max:1000'],
        ]);

        $review->update([
            'instructor_reply' => $validated['instructor_reply'],
            'replied_at' => now(),
        ]);

        return back()->with('status', 'Reply posted successfully!');
    }
}
