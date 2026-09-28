<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAction;
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
     * Display all platform bookings.
     */
    public function index(Request $request): Response
    {
        $status = $request->input('status', 'all');
        $search = $request->input('search', '');
        $instructorId = $request->input('instructor_id', 'all');
        $startDate = $request->input('start_date', '');
        $endDate = $request->input('end_date', '');

        $query = Booking::with([
            'student:id,name,email,profile_picture',
            'instructor.user:id,name,email,profile_picture',
            'review',
        ]);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($instructorId !== 'all' && ! empty($instructorId)) {
            $query->where('instructor_id', $instructorId);
        }

        if (! empty($startDate)) {
            $query->where('date', '>=', $startDate);
        }

        if (! empty($endDate)) {
            $query->where('date', '<=', $endDate);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('id', $search)
                    ->orWhere('lesson_type', 'like', "%{$search}%")
                    ->orWhereHas('student', function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('instructor.user', function ($iq) use ($search) {
                        $iq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $bookings = $query->latest('date')->paginate(12)->withQueryString();

        $instructorsList = Instructor::with('user:id,name')
            ->get()
            ->map(fn ($i) => ['id' => $i->id, 'name' => $i->user?->name ?? "Instructor #{$i->id}"]);

        return Inertia::render('admin/Bookings', [
            'bookings' => $bookings,
            'instructorsList' => $instructorsList,
            'filters' => [
                'status' => $status,
                'search' => $search,
                'instructor_id' => $instructorId,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'counts' => [
                'total' => Booking::count(),
                'pending' => Booking::where('status', 'pending')->count(),
                'confirmed' => Booking::where('status', 'confirmed')->count(),
                'completed' => Booking::where('status', 'completed')->count(),
                'cancelled' => Booking::where('status', 'cancelled')->count(),
            ],
        ]);
    }

    /**
     * Cancel a booking as admin.
     */
    public function cancel(Request $request, Booking $booking): RedirectResponse
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $admin = $request->user();
        $reason = $request->input('reason', 'Cancelled by platform administrator.');

        $booking->status = 'cancelled';
        $booking->cancellation_reason = $reason;
        $booking->save();

        if ($booking->student) {
            $booking->student->notify(new BookingStatusChangedNotification($booking));
        }

        AdminAction::record($admin, 'cancel_booking', $booking, "Cancelled booking #{$booking->id}: {$reason}", ['reason' => $reason]);

        return back()->with('success', "Booking #{$booking->id} has been cancelled.");
    }
}
