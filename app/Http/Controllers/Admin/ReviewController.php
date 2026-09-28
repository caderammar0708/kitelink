<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAction;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /**
     * Display all student reviews for moderation.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $rating = $request->input('rating', 'all');
        $visibility = $request->input('visibility', 'all'); // 'all', 'visible', 'hidden'

        $query = Review::with([
            'student:id,name,email,profile_picture',
            'instructor.user:id,name,email,profile_picture',
            'booking:id,date,lesson_type',
        ]);

        if ($visibility === 'visible') {
            $query->where('is_hidden', false);
        } elseif ($visibility === 'hidden') {
            $query->where('is_hidden', true);
        }

        if ($rating !== 'all' && is_numeric($rating)) {
            $query->where('rating', (int) $rating);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('comment', 'like', "%{$search}%")
                    ->orWhere('instructor_reply', 'like', "%{$search}%")
                    ->orWhereHas('student', function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('instructor.user', function ($iq) use ($search) {
                        $iq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $reviews = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('admin/Reviews', [
            'reviews' => $reviews,
            'filters' => [
                'search' => $search,
                'rating' => $rating,
                'visibility' => $visibility,
            ],
            'counts' => [
                'total' => Review::count(),
                'hidden' => Review::where('is_hidden', true)->count(),
                'visible' => Review::where('is_hidden', false)->count(),
            ],
        ]);
    }

    /**
     * Toggle visibility (hide/unhide) of a review.
     */
    public function toggleVisibility(Request $request, Review $review): RedirectResponse
    {
        $admin = $request->user();

        $review->is_hidden = ! $review->is_hidden;
        $review->save();

        $action = $review->is_hidden ? 'hide_review' : 'unhide_review';
        $summary = $review->is_hidden ? "Hidden review #{$review->id}" : "Unhid review #{$review->id}";

        AdminAction::record($admin, $action, $review, $summary);

        $msg = $review->is_hidden ? 'Review is now hidden from public view.' : 'Review has been restored to public view.';

        return back()->with('success', $msg);
    }

    /**
     * Soft delete an inappropriate review.
     */
    public function destroy(Request $request, Review $review): RedirectResponse
    {
        $admin = $request->user();

        AdminAction::record($admin, 'delete_review', $review, "Deleted review #{$review->id} permanently");

        $review->delete();

        return back()->with('success', 'Review was removed successfully.');
    }
}
