<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RevenueController extends Controller
{
    /**
     * Display instructor earnings and revenue history.
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

        $completedBookings = $instructor->bookings()
            ->where('status', 'completed')
            ->with('student:id,name')
            ->orderBy('date', 'desc')
            ->get();

        $startOfMonth = now()->startOfMonth()->toDateString();

        $totalEarned = (float) $completedBookings->sum('total_price');
        $thisMonth = (float) $completedBookings->where('date', '>=', $startOfMonth)->sum('total_price');
        $pendingPayout = (float) $instructor->bookings()
            ->where('status', 'confirmed')
            ->sum('total_price');

        $transactions = $completedBookings->map(function ($b) {
            return [
                'id' => $b->id,
                'date' => $b->date ? Carbon::parse($b->date)->format('M d, Y') : '',
                'client' => $b->student?->name ?? 'Guest Student',
                'amount' => (float) $b->total_price,
                'lesson_type' => $b->lesson_type ?? 'Kitesurfing Lesson',
                'status' => 'Completed',
            ];
        })->values();

        return Inertia::render('instructor/Revenue', [
            'totalEarned' => $totalEarned,
            'thisMonth' => $thisMonth,
            'pendingPayout' => $pendingPayout,
            'transactions' => $transactions,
        ]);
    }
}
