<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\SchoolHireRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HireRequestController extends Controller
{
    /**
     * Display school contract and hire offers.
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

        $hireRequests = $instructor->hireRequests()
            ->with('school:id,name,location,description')
            ->latest()
            ->get();

        return Inertia::render('instructor/HireRequests', [
            'hireRequests' => $hireRequests,
        ]);
    }

    /**
     * Accept a school hire offer.
     */
    public function accept(Request $request, SchoolHireRequest $hireRequest): RedirectResponse
    {
        $user = $request->user();
        /** @var Instructor $instructor */
        $instructor = $user->instructor()->firstOrFail();

        abort_unless($hireRequest->instructor_id === $instructor->id, 403);

        $hireRequest->update(['status' => 'accepted']);

        return back()->with('status', 'Contract offer accepted successfully!');
    }

    /**
     * Decline a school hire offer.
     */
    public function decline(Request $request, SchoolHireRequest $hireRequest): RedirectResponse
    {
        $user = $request->user();
        /** @var Instructor $instructor */
        $instructor = $user->instructor()->firstOrFail();

        abort_unless($hireRequest->instructor_id === $instructor->id, 403);

        $hireRequest->update(['status' => 'declined']);

        return back()->with('status', 'Contract offer declined.');
    }

    /**
     * Send a counter-offer to the school.
     */
    public function counter(Request $request, SchoolHireRequest $hireRequest): RedirectResponse
    {
        $user = $request->user();
        /** @var Instructor $instructor */
        $instructor = $user->instructor()->firstOrFail();

        abort_unless($hireRequest->instructor_id === $instructor->id, 403);

        $validated = $request->validate([
            'counter_rate' => ['required', 'numeric', 'min:1'],
            'counter_message' => ['nullable', 'string', 'max:1000'],
        ]);

        $hireRequest->update([
            'status' => 'countered',
            'counter_rate' => $validated['counter_rate'],
            'counter_message' => $validated['counter_message'] ?? null,
        ]);

        return back()->with('status', 'Counter-offer submitted successfully!');
    }
}
