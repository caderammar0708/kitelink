<?php

namespace App\Http\Controllers\School;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InstructorRosterController extends Controller
{
    /**
     * Display the school's instructor roster and available candidates.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        $roster = $school->instructors()
            ->with(['user', 'bookings' => fn ($q) => $q->latest()->limit(3)])
            ->withCount('bookings')
            ->latest()
            ->get();

        $availableInstructors = Instructor::with('user:id,name,email,profile_picture,phone')
            ->where(function ($q) use ($school) {
                $q->whereNull('school_id')
                    ->orWhere('school_id', '!=', $school->id);
            })
            ->where('status', 'approved')
            ->limit(25)
            ->get();

        return Inertia::render('school/Instructors', [
            'school' => $school,
            'roster' => $roster,
            'availableInstructors' => $availableInstructors,
        ]);
    }

    /**
     * Invite/link an existing KiteLink instructor to the school roster.
     */
    public function invite(Request $request): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        $validated = $request->validate([
            'instructor_id' => ['nullable', 'exists:instructors,id'],
            'email' => ['nullable', 'email'],
        ]);

        $instructor = null;
        if (! empty($validated['instructor_id'])) {
            $instructor = Instructor::find($validated['instructor_id']);
        } elseif (! empty($validated['email'])) {
            $candidateUser = User::where('email', $validated['email'])->where('role', 'instructor')->first();
            $instructor = $candidateUser?->instructor;
        }

        if (! $instructor) {
            return back()->withErrors(['email' => 'Instructor account not found or is not registered as an instructor.']);
        }

        $instructor->update([
            'school_id' => $school->id,
            'is_freelance' => false,
        ]);

        return back()->with('success', "Instructor {$instructor->user?->name} has joined the {$school->name} roster.");
    }

    /**
     * Directly add a new coach to the school roster.
     */
    public function storeCoach(Request $request): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'certifications' => ['nullable', 'string', 'max:255'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'experience_years' => ['nullable', 'integer', 'min:0'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);

        $tempPassword = Str::random(12);

        $coachUser = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($tempPassword),
            'role' => 'instructor',
        ]);

        Instructor::create([
            'user_id' => $coachUser->id,
            'school_id' => $school->id,
            'certifications' => $validated['certifications'] ?? null,
            'hourly_rate' => $validated['hourly_rate'] ?? 60.00,
            'experience_years' => $validated['experience_years'] ?? 1,
            'bio' => $validated['bio'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'status' => 'approved',
            'is_freelance' => false,
            'is_active' => true,
        ]);

        return back()
            ->with('status', "Coach {$coachUser->name} was created and added to your roster successfully.")
            ->with('success', "Coach {$coachUser->name} was created and added to your roster successfully.");
    }

    /**
     * Remove an instructor from the school roster.
     */
    public function remove(Request $request, Instructor $instructor): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        abort_unless($instructor->school_id === $school->id, 403);

        $instructor->update([
            'school_id' => null,
            'is_freelance' => true,
        ]);

        return back()
            ->with('status', "{$instructor->user?->name} has been removed from the school roster.")
            ->with('success', "{$instructor->user?->name} has been removed from the school roster.");
    }
}
