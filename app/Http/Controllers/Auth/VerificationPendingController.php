<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VerificationPendingController extends Controller
{
    /**
     * Display the pending verification page for instructors and schools.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($user->role === 'client') {
            return redirect()->route('dashboard');
        }

        if ($user->role === 'instructor') {
            $instructor = $user->instructor;
            if ($instructor && $instructor->status === 'approved') {
                return redirect()->route('instructor.dashboard');
            }

            return Inertia::render('auth/VerificationPending', [
                'role' => 'instructor',
                'application' => [
                    'id' => $instructor?->id,
                    'status' => $instructor?->status ?? 'pending',
                    'rejection_reason' => $instructor?->rejection_reason,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $instructor?->phone ?? $user->phone,
                    'license_number' => $instructor?->license_number,
                    'created_at' => $instructor?->created_at?->toISOString() ?? $user->created_at->toISOString(),
                ],
            ]);
        }

        if ($user->role === 'school') {
            $school = $user->school;
            if ($school && $school->status === 'approved') {
                return redirect()->route('school.dashboard');
            }

            return Inertia::render('auth/VerificationPending', [
                'role' => 'school',
                'application' => [
                    'id' => $school?->id,
                    'status' => $school?->status ?? 'pending',
                    'rejection_reason' => $school?->rejection_reason,
                    'school_name' => $school?->name ?? 'Kite School',
                    'registration_number' => $school?->registration_number,
                    'contact_name' => $school?->contact_name ?? $user->name,
                    'email' => $user->email,
                    'phone' => $school?->phone ?? $user->phone,
                    'location' => $school?->location,
                    'created_at' => $school?->created_at?->toISOString() ?? $user->created_at->toISOString(),
                ],
            ]);
        }

        return redirect()->route('dashboard');
    }

    /**
     * Resubmit an application after rejection.
     */
    public function resubmit(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->role === 'school') {
            $validated = $request->validate([
                'school_name' => ['required', 'string', 'max:255'],
                'registration_number' => ['required', 'string', 'max:100'],
                'contact_name' => ['required', 'string', 'max:255'],
                'phone' => ['required', 'string', 'max:50'],
                'location' => ['required', 'string', 'max:255'],
            ]);

            $school = $user->school;
            if ($school) {
                $school->update([
                    'name' => $validated['school_name'],
                    'registration_number' => $validated['registration_number'],
                    'contact_name' => $validated['contact_name'],
                    'phone' => $validated['phone'],
                    'location' => $validated['location'],
                    'status' => 'pending',
                    'rejection_reason' => null,
                    'reviewed_by' => null,
                    'reviewed_at' => null,
                ]);

                $user->update([
                    'name' => $validated['contact_name'],
                    'phone' => $validated['phone'],
                ]);
            }

            return back()->with('success', 'Your school application has been updated and resubmitted for admin review.');
        }

        if ($user->role === 'instructor') {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'phone' => ['required', 'string', 'max:50'],
                'license_number' => ['nullable', 'string', 'max:100'],
            ]);

            $instructor = $user->instructor;
            if ($instructor) {
                $instructor->update([
                    'phone' => $validated['phone'],
                    'license_number' => $validated['license_number'] ?? $instructor->license_number,
                    'status' => 'pending',
                    'rejection_reason' => null,
                    'reviewed_by' => null,
                    'reviewed_at' => null,
                ]);

                $user->update([
                    'name' => $validated['name'],
                    'phone' => $validated['phone'],
                ]);
            }

            return back()->with('success', 'Your instructor application has been updated and resubmitted for admin review.');
        }

        return back();
    }
}
