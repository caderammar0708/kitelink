<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
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
            ]);
            $instructor->load(['school', 'user']);
        }

        $bookings = [];
        $stats = [
            'upcoming' => 0,
            'students_taught' => 0,
            'average_rating' => 4.9,
            'total_bookings' => 0,
            'completed' => 0,
            'earnings' => 0,
        ];

        if (Schema::hasTable('bookings')) {
            try {
                $bookingsCollection = $instructor->bookings()
                    ->with('client:id,name,email')
                    ->orderBy('date', 'desc')
                    ->get();

                $bookings = $bookingsCollection;
                $stats['total_bookings'] = $bookingsCollection->count();
                $stats['upcoming'] = $bookingsCollection->where('status', 'confirmed')->where('date', '>=', now()->toDateString())->count();
                $stats['completed'] = $bookingsCollection->where('status', 'completed')->count();
                $stats['students_taught'] = $bookingsCollection->where('status', 'completed')->pluck('client_id')->unique()->count();
                $stats['earnings'] = $bookingsCollection->where('status', 'completed')->sum('price');
            } catch (\Throwable $e) {
                // Keep default empty stats if bookings table schema differs
            }
        }

        return Inertia::render('instructor/Dashboard', [
            'instructor' => $instructor,
            'bookings' => $bookings,
            'stats' => $stats,
        ]);
    }
}
