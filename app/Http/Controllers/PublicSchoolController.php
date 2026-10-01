<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicSchoolController extends Controller
{
    /**
     * Display a listing of public approved kite centers / schools.
     */
    public function index(Request $request): Response
    {
        $query = School::with([
            'user',
            'instructors' => function ($q) {
                $q->where('status', 'approved')
                    ->where('is_active', true)
                    ->with('user');
            },
        ])
            ->where('status', 'approved')
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('user_id')
                    ->orWhereHas('user', function ($uq) {
                        $uq->where('is_suspended', false);
                    });
            });

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('contact_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('location') && $request->input('location') !== 'all') {
            $query->where('location', 'like', '%'.$request->input('location').'%');
        }

        $schools = $query->latest()->get();

        return Inertia::render('schools/Index', [
            'schools' => $schools,
            'filters' => [
                'search' => $request->input('search', ''),
                'location' => $request->input('location', 'all'),
            ],
        ]);
    }

    /**
     * Display the specified kite center's public profile.
     */
    public function show(Request $request, School $school): Response
    {
        abort_if($school->status !== 'approved' || ! $school->is_active, 404);

        if ($school->user && $school->user->is_suspended) {
            abort(404);
        }

        $school->load([
            'user',
            'packages' => function ($q) {
                $q->where('is_active', true)->latest();
            },
            'instructors' => function ($q) {
                $q->where('status', 'approved')
                    ->where('is_active', true)
                    ->with([
                        'user',
                        'reviews' => function ($rq) {
                            $rq->where('is_hidden', false)
                                ->with('student')
                                ->latest();
                        },
                    ]);
            },
        ]);

        // Aggregate verified reviews across the school's approved instructors
        $reviews = $school->instructors
            ->flatMap(function ($instructor) {
                return $instructor->reviews->map(function ($review) use ($instructor) {
                    $review->instructor_name = $instructor->user?->name ?? 'Instructor';
                    $review->instructor_photo = $instructor->profile_photo ?? $instructor->user?->profile_picture;

                    return $review;
                });
            })
            ->sortByDesc('created_at')
            ->values();

        return Inertia::render('schools/Show', [
            'school' => $school,
            'reviews' => $reviews,
        ]);
    }
}
