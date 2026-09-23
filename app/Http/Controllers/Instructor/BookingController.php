<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Instructor;
use App\Notifications\BookingStatusChangedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Display the instructor's bookings.
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

        $tab = $request->query('tab', 'pending');
        $today = now()->toDateString();

        if ($tab === 'pending') {
            $user->unreadNotifications
                ->filter(fn ($n) => ($n->data['type'] ?? '') === 'booking')
                ->each->markAsRead();
        }

        $counts = [
            'pending' => $instructor->bookings()->where('status', 'pending')->count(),
            'upcoming' => $instructor->bookings()->where('status', 'confirmed')->where('date', '>=', $today)->count(),
            'completed' => $instructor->bookings()->where('status', 'completed')->count(),
            'cancelled' => $instructor->bookings()->where('status', 'cancelled')->count(),
        ];

        $query = $instructor->bookings()->with('student:id,name,email,profile_picture');

        switch ($tab) {
            case 'upcoming':
                $query->where('status', 'confirmed')->where('date', '>=', $today)->orderBy('date', 'asc');
                break;
            case 'completed':
                $query->where('status', 'completed')->orderBy('date', 'desc');
                break;
            case 'cancelled':
                $query->where('status', 'cancelled')->orderBy('date', 'desc');
                break;
            case 'pending':
            default:
                $tab = 'pending';
                $query->where('status', 'pending')->orderBy('date', 'asc');
                break;
        }

        return Inertia::render('instructor/Bookings', [
            'bookings' => $query->get(),
            'tab' => $tab,
            'counts' => $counts,
        ]);
    }

    /**
     * Accept a booking request.
     */
    public function accept(Request $request, Booking $booking): RedirectResponse
    {
        $user = $request->user();
        /** @var Instructor $instructor */
        $instructor = $user->instructor()->firstOrFail();

        abort_unless($booking->instructor_id === $instructor->id, 403);

        $booking->update(['status' => 'confirmed']);

        $booking->load(['student', 'instructor.user']);
        if ($booking->student) {
            $booking->student->notify(new BookingStatusChangedNotification($booking));
        }

        return back()->with('status', 'Booking accepted successfully!');
    }

    /**
     * Decline a booking request.
     */
    public function decline(Request $request, Booking $booking): RedirectResponse
    {
        $user = $request->user();
        /** @var Instructor $instructor */
        $instructor = $user->instructor()->firstOrFail();

        abort_unless($booking->instructor_id === $instructor->id, 403);

        $booking->update(['status' => 'cancelled']);

        $booking->load(['student', 'instructor.user']);
        if ($booking->student) {
            $booking->student->notify(new BookingStatusChangedNotification($booking));
        }

        return back()->with('status', 'Booking declined.');
    }
}
