<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Instructor;
use App\Models\Review;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin master dashboard.
     */
    public function index(Request $request): Response
    {
        $startOfMonth = now()->startOfMonth();

        // 1. Stat cards
        $totalInstructors = Instructor::count();
        $totalSchools = School::count();
        $totalClients = User::where('role', 'client')->count();
        $pendingApprovals = Instructor::where('status', 'pending')->count() + School::where('status', 'pending')->count();
        $totalBookings = Booking::count();
        $monthlyBookings = Booking::where('date', '>=', $startOfMonth->toDateString())->count();
        $monthlyRevenue = (float) Booking::where('status', 'completed')
            ->where('date', '>=', $startOfMonth->toDateString())
            ->sum('total_price');
        $totalRevenue = (float) Booking::where('status', 'completed')->sum('total_price');

        // 2. Charts: Bookings per month (past 6 months)
        $bookingsChart = [];
        $signupsChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = now()->subMonths($i);
            $monthKey = $monthDate->format('M Y');
            $mStart = $monthDate->copy()->startOfMonth()->toDateString();
            $mEnd = $monthDate->copy()->endOfMonth()->toDateString();

            $bookingsInMonth = Booking::whereBetween('date', [$mStart, $mEnd])->count();
            $revenueInMonth = (float) Booking::where('status', 'completed')
                ->whereBetween('date', [$mStart, $mEnd])
                ->sum('total_price');

            $signupsInMonth = User::whereBetween('created_at', [$mStart.' 00:00:00', $mEnd.' 23:59:59'])->count();

            $bookingsChart[] = [
                'month' => $monthKey,
                'bookings' => $bookingsInMonth,
                'revenue' => $revenueInMonth,
            ];

            $signupsChart[] = [
                'month' => $monthKey,
                'signups' => $signupsInMonth,
            ];
        }

        // 3. Top Instructors by bookings
        $topInstructors = Instructor::with(['user:id,name,email,profile_picture'])
            ->withCount(['bookings' => function ($q) {
                $q->whereIn('status', ['confirmed', 'completed']);
            }])
            ->orderByDesc('bookings_count')
            ->take(5)
            ->get()
            ->map(function ($inst) {
                return [
                    'id' => $inst->id,
                    'name' => $inst->user?->name ?? 'Unknown',
                    'email' => $inst->user?->email,
                    'avatar' => $inst->user?->profile_picture ?: $inst->profile_photo,
                    'location' => $inst->location,
                    'bookings_count' => $inst->bookings_count,
                    'status' => $inst->status,
                    'hourly_rate' => $inst->hourly_rate,
                ];
            });

        // 4. Recent activities
        $newestRegistrations = User::latest()
            ->take(6)
            ->get(['id', 'name', 'email', 'role', 'is_suspended', 'created_at', 'profile_picture']);

        $latestBookings = Booking::with([
            'student:id,name,email,profile_picture',
            'instructor.user:id,name,profile_picture',
        ])
            ->latest()
            ->take(6)
            ->get();

        $newestReviews = Review::with([
            'student:id,name,profile_picture',
            'instructor.user:id,name',
        ])
            ->latest()
            ->take(5)
            ->get();

        // 5. Urgent Pending Approvals sample
        $pendingInstructors = Instructor::with('user:id,name,email,profile_picture')
            ->where('status', 'pending')
            ->latest()
            ->take(4)
            ->get();

        $pendingSchools = School::where('status', 'pending')
            ->latest()
            ->take(4)
            ->get();

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'total_instructors' => $totalInstructors,
                'total_schools' => $totalSchools,
                'total_clients' => $totalClients,
                'pending_approvals' => $pendingApprovals,
                'total_bookings' => $totalBookings,
                'monthly_bookings' => $monthlyBookings,
                'monthly_revenue' => $monthlyRevenue,
                'total_revenue' => $totalRevenue,
            ],
            'charts' => [
                'bookings_chart' => $bookingsChart,
                'signups_chart' => $signupsChart,
                'top_instructors' => $topInstructors,
            ],
            'recent' => [
                'registrations' => $newestRegistrations,
                'bookings' => $latestBookings,
                'reviews' => $newestReviews,
                'pending_instructors' => $pendingInstructors,
                'pending_schools' => $pendingSchools,
            ],
        ]);
    }
}
