<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\InstructorAvailability;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AvailabilityController extends Controller
{
    /**
     * Display the instructor availability calendar.
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

        $month = (int) $request->query('month', now()->month);
        $year = (int) $request->query('year', now()->year);

        $startOfMonth = Carbon::createFromDate($year, $month, 1)->startOfMonth()->toDateString();
        $endOfMonth = Carbon::createFromDate($year, $month, 1)->endOfMonth()->toDateString();

        $availabilities = InstructorAvailability::where('instructor_id', $instructor->id)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->get();

        $confirmedBookings = $instructor->bookings()
            ->where('status', 'confirmed')
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->with('student:id,name')
            ->get(['id', 'date', 'time', 'lesson_type', 'student_id']);

        return Inertia::render('instructor/Availability', [
            'availabilities' => $availabilities,
            'confirmedBookings' => $confirmedBookings,
            'month' => $month,
            'year' => $year,
        ]);
    }

    /**
     * Save availability slots.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        /** @var Instructor $instructor */
        $instructor = $user->instructor()->firstOrFail();

        $validated = $request->validate([
            'dates' => ['required', 'array'],
            'dates.*' => ['required', 'date_format:Y-m-d'],
            'start_time' => ['nullable', 'string'],
            'end_time' => ['nullable', 'string'],
            'is_available' => ['required', 'boolean'],
        ]);

        foreach ($validated['dates'] as $date) {
            InstructorAvailability::updateOrCreate(
                [
                    'instructor_id' => $instructor->id,
                    'date' => $date,
                ],
                [
                    'start_time' => $validated['start_time'] ?? '08:00',
                    'end_time' => $validated['end_time'] ?? '18:00',
                    'is_available' => $validated['is_available'],
                ]
            );
        }

        return back()->with('status', 'Availability updated successfully!');
    }

    /**
     * Remove an availability slot.
     */
    public function destroy(Request $request, InstructorAvailability $availability): RedirectResponse
    {
        $user = $request->user();
        /** @var Instructor $instructor */
        $instructor = $user->instructor()->firstOrFail();

        abort_unless($availability->instructor_id === $instructor->id, 403);

        $availability->delete();

        return back()->with('status', 'Availability slot removed.');
    }
}
