<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrowseInstructorController extends Controller
{
    /**
     * Browse other verified instructors across popular global spots.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $search = $request->query('search');
        $country = $request->query('country');

        $query = Instructor::query()
            ->where('user_id', '!=', $user->id)
            ->where('is_active', true)
            ->with(['user:id,name,profile_picture', 'reviews:id,instructor_id,rating']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('location', 'like', "%{$search}%")
                    ->orWhere('certifications', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($country && $country !== 'All Spots') {
            $query->where('location', 'like', "%{$country}%");
        }

        $instructors = $query->get()->map(function (Instructor $ins) {
            $reviewCount = $ins->reviews->count();
            $avgRating = $reviewCount > 0 ? round((float) $ins->reviews->avg('rating'), 1) : 4.9;

            return [
                'id' => $ins->id,
                'name' => $ins->user?->name ?? 'Instructor',
                'avatar' => $ins->profile_photo ?: $ins->user?->profile_picture,
                'location' => $ins->location,
                'certifications' => $ins->certifications,
                'experience_years' => $ins->experience_years,
                'hourly_rate' => $ins->hourly_rate ? (float) $ins->hourly_rate : null,
                'rating' => $avgRating,
                'review_count' => $reviewCount,
            ];
        });

        return Inertia::render('instructor/Browse', [
            'instructors' => $instructors,
            'filters' => [
                'search' => $search,
                'country' => $country,
            ],
        ]);
    }
}
