<?php

namespace App\Http\Controllers\School;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the school dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        /** @var School $school */
        $school = $user->school()->with(['instructors.user'])->first();

        if (! $school) {
            $school = School::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'status' => 'approved',
                'is_active' => true,
            ]);
            $school->load(['instructors.user']);
        }

        if ($school->status !== 'approved') {
            return Inertia::render('auth/VerificationPending', [
                'role' => 'school',
                'application' => [
                    'id' => $school->id,
                    'status' => $school->status,
                    'rejection_reason' => $school->rejection_reason,
                    'name' => $school->name,
                    'school_name' => $school->name,
                    'registration_number' => $school->registration_number,
                    'contact_name' => $school->contact_name,
                    'email' => $school->email,
                    'phone' => $school->phone,
                    'location' => $school->location,
                    'created_at' => $school->created_at?->toISOString() ?? $user->created_at->toISOString(),
                ],
            ]);
        }

        $instructors = $school->instructors;
        $instructorIds = $instructors->pluck('id');

        $bookingsQuery = Booking::where(function ($q) use ($instructorIds, $school) {
            if ($instructorIds->isNotEmpty()) {
                $q->whereIn('instructor_id', $instructorIds);
            }
            $q->orWhere('school_id', $school->id);
        });

        $startOfMonth = now()->startOfMonth()->toDateString();

        $stats = [
            'total_instructors' => $instructors->count(),
            'total_bookings' => (clone $bookingsQuery)->count(),
            'monthly_revenue' => (float) (clone $bookingsQuery)
                ->where('status', 'completed')
                ->where('date', '>=', $startOfMonth)
                ->sum('total_price'),
            'upcoming_lessons' => (clone $bookingsQuery)
                ->where('status', 'confirmed')
                ->where('date', '>=', now()->toDateString())
                ->count(),
            'pending_requests' => (clone $bookingsQuery)
                ->where('status', 'pending')
                ->count(),
            'completed_lessons' => (clone $bookingsQuery)
                ->where('status', 'completed')
                ->count(),
        ];

        // Profile completion calculation
        $profileFields = [
            'name' => ! empty($school->name),
            'description' => ! empty($school->description),
            'location' => ! empty($school->location),
            'contact_name' => ! empty($school->contact_name),
            'phone' => ! empty($school->phone),
            'facilities' => ! empty($school->facilities),
            'gear_list' => ! empty($school->gear_list),
            'certifications' => ! empty($school->certifications),
            'photos' => ! empty($school->photos),
            'registration_number' => ! empty($school->registration_number),
        ];
        $completedCount = count(array_filter($profileFields));
        $profileCompletion = round(($completedCount / count($profileFields)) * 100);

        $recentBookings = (clone $bookingsQuery)
            ->with(['student:id,name,email,profile_picture', 'instructor.user:id,name,profile_picture'])
            ->orderBy('date', 'desc')
            ->take(8)
            ->get();

        return Inertia::render('school/Dashboard', [
            'school' => $school,
            'stats' => $stats,
            'profileCompletion' => $profileCompletion,
            'recentBookings' => $recentBookings,
            'rosterPreview' => $instructors->take(6)->values(),
        ]);
    }
}
