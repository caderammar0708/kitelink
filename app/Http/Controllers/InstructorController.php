<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstructorController extends Controller
{
    /**
     * Display a listing of public certified instructors.
     */
    public function index(Request $request): Response
    {
        $query = Instructor::with(['user', 'school'])
            ->whereHas('user', function ($q) {
                $q->where('role', 'instructor');
            });

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('location', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->filled('location') && $request->input('location') !== 'all') {
            $query->where('location', 'like', '%'.$request->input('location').'%');
        }

        $instructors = $query->latest()->get();

        return Inertia::render('instructors/Index', [
            'instructors' => $instructors,
            'filters' => [
                'search' => $request->input('search', ''),
                'location' => $request->input('location', 'all'),
            ],
        ]);
    }

    /**
     * Display the specified instructor's public profile.
     */
    public function show(Request $request, Instructor $instructor): Response
    {
        $instructor->load(['user', 'school']);

        $user = $request->user();
        $existingBooking = null;

        if ($user) {
            $existingBooking = Booking::where('instructor_id', $instructor->id)
                ->where('student_id', $user->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->latest()
                ->first();
        }

        return Inertia::render('instructors/Show', [
            'instructor' => $instructor,
            'existingBooking' => $existingBooking,
        ]);
    }
}
