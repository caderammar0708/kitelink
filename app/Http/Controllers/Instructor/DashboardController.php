<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the instructor dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        /** @var Instructor $instructor */
        $instructor = $user->instructor()->with(['school', 'user'])->first();

        if (! $instructor) {
            $instructor = Instructor::create([
                'user_id' => $user->id,
                'status' => 'approved',
                'is_freelance' => true,
                'is_active' => true,
            ]);
            $instructor->load(['school', 'user']);
        }

        // Calculate profile completion
        $profileFields = [
            'name' => ! empty($user->name),
            'email' => ! empty($user->email),
            'avatar' => ! empty($user->profile_picture) || ! empty($instructor->profile_photo),
            'bio' => ! empty($instructor->bio),
            'certifications' => ! empty($instructor->certifications),
            'experience_years' => ! empty($instructor->experience_years),
            'location' => ! empty($instructor->location),
            'languages' => ! empty($instructor->languages),
            'hourly_rate' => ! empty($instructor->hourly_rate),
            'daily_rate' => ! empty($instructor->daily_rate),
        ];
        $completedCount = count(array_filter($profileFields));
        $profileCompletion = round(($completedCount / count($profileFields)) * 100);

        $bookingsCollection = $instructor->bookings()
            ->with('student:id,name,email,profile_picture')
            ->orderBy('date', 'desc')
            ->get();

        $startOfMonth = now()->startOfMonth()->toDateString();

        $stats = [
            'upcoming' => $bookingsCollection->where('status', 'confirmed')->where('date', '>=', now()->toDateString())->count(),
            'pending_requests' => $bookingsCollection->where('status', 'pending')->count(),
            'students_taught' => $bookingsCollection->where('status', 'completed')->pluck('student_id')->unique()->count(),
            'average_rating' => round($instructor->reviews()->avg('rating') ?: 4.9, 1),
            'total_bookings' => $bookingsCollection->count(),
            'completed' => $bookingsCollection->where('status', 'completed')->count(),
            'total_earnings' => (float) $bookingsCollection->where('status', 'completed')->sum('total_price'),
            'monthly_revenue' => (float) $bookingsCollection->where('status', 'completed')->where('date', '>=', $startOfMonth)->sum('total_price'),
            'profile_completion' => $profileCompletion,
            'hire_requests_count' => $instructor->hireRequests()->where('status', 'pending')->count(),
        ];

        return Inertia::render('instructor/Dashboard', [
            'instructor' => $instructor,
            'bookings' => $bookingsCollection->take(10)->values(),
            'stats' => $stats,
        ]);
    }
}
