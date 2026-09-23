<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Display the authenticated client's bookings.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $bookings = Booking::where('student_id', $user->id)
            ->with([
                'instructor.user:id,name,email,profile_picture',
                'instructor.school:id,name,location',
                'review',
            ])
            ->orderByRaw("CASE 
                WHEN status = 'pending' THEN 1 
                WHEN status = 'confirmed' THEN 2 
                WHEN status = 'completed' THEN 3 
                WHEN status = 'cancelled' THEN 4 
                ELSE 5 
            END")
            ->orderBy('date', 'desc')
            ->get();

        $counts = [
            'all' => $bookings->count(),
            'pending' => $bookings->where('status', 'pending')->count(),
            'confirmed' => $bookings->where('status', 'confirmed')->count(),
            'completed' => $bookings->where('status', 'completed')->count(),
            'cancelled' => $bookings->where('status', 'cancelled')->count(),
        ];

        $highlightId = $request->query('highlight');
        if ($highlightId) {
            $user->unreadNotifications
                ->filter(fn ($n) => ($n->data['booking_id'] ?? null) == $highlightId)
                ->each->markAsRead();
        }

        return Inertia::render('client/Bookings', [
            'bookings' => $bookings,
            'counts' => $counts,
            'highlightId' => $highlightId,
        ]);
    }
}
