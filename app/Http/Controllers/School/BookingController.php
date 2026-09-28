<?php

namespace App\Http\Controllers\School;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\School;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Display all bookings made across the entire school roster.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        $tab = $request->query('tab', 'all');
        $instructorFilter = $request->query('instructor');
        $search = $request->query('search');

        $instructors = $school->instructors()->with('user:id,name')->get();
        $instructorIds = $instructors->pluck('id');

        $baseQuery = Booking::where(function ($q) use ($instructorIds, $school) {
            if ($instructorIds->isNotEmpty()) {
                $q->whereIn('instructor_id', $instructorIds);
            }
            $q->orWhere('school_id', $school->id);
        });

        // Tab counts
        $counts = [
            'all' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('status', 'pending')->count(),
            'confirmed' => (clone $baseQuery)->where('status', 'confirmed')->count(),
            'completed' => (clone $baseQuery)->where('status', 'completed')->count(),
            'cancelled' => (clone $baseQuery)->where('status', 'cancelled')->count(),
        ];

        $query = (clone $baseQuery)
            ->with(['student:id,name,email,phone,profile_picture', 'instructor.user:id,name,profile_picture']);

        if ($tab !== 'all') {
            $query->where('status', $tab);
        }

        if (! empty($instructorFilter)) {
            $query->where('instructor_id', $instructorFilter);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('lesson_type', 'like', "%{$search}%")
                    ->orWhereHas('student', function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $bookings = $query->orderBy('date', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('school/Bookings', [
            'school' => $school,
            'bookings' => $bookings,
            'instructors' => $instructors,
            'counts' => $counts,
            'filters' => [
                'tab' => $tab,
                'instructor' => $instructorFilter,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Update booking status (confirm, complete, cancel).
     */
    public function updateStatus(Request $request, Booking $booking): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        $instructorIds = $school->instructors()->pluck('id');
        $authorized = $booking->school_id === $school->id || $instructorIds->contains($booking->instructor_id);
        abort_unless($authorized, 403);

        $validated = $request->validate([
            'status' => ['required', 'in:confirmed,completed,cancelled'],
            'cancellation_reason' => ['nullable', 'string', 'max:500'],
        ]);

        $booking->update([
            'status' => $validated['status'],
            'cancellation_reason' => $validated['cancellation_reason'] ?? $booking->cancellation_reason,
        ]);

        return back()->with('success', "Booking status updated to {$validated['status']}.");
    }
}
