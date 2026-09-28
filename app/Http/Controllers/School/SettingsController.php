<?php

namespace App\Http\Controllers\School;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display the school settings page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        return Inertia::render('school/Settings', [
            'school' => $school,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? $school->phone,
                'notification_sound_enabled' => (bool) $user->notification_sound_enabled,
            ],
        ]);
    }

    /**
     * Update school manager profile information.
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        $validated = $request->validate([
            'contact_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $user->update([
            'name' => $validated['contact_name'],
            'phone' => $validated['phone'] ?? null,
        ]);

        $school->update([
            'contact_name' => $validated['contact_name'],
            'phone' => $validated['phone'] ?? null,
        ]);

        return back()->with('success', 'Profile information updated successfully.');
    }

    /**
     * Update account password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    /**
     * Update account email.
     */
    public function updateEmail(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
        ]);

        $user->update([
            'email' => $validated['email'],
        ]);

        return back()->with('success', 'Email updated successfully.');
    }

    /**
     * Update notification sound settings.
     */
    public function updateNotifications(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'notification_sound_enabled' => ['required', 'boolean'],
        ]);

        $request->user()->update([
            'notification_sound_enabled' => $validated['notification_sound_enabled'],
        ]);

        return back()->with('success', 'Notification preferences saved.');
    }

    /**
     * Toggle school public listing status (activate / deactivate).
     */
    public function deactivate(Request $request): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        $school->update([
            'is_active' => ! $school->is_active,
        ]);

        $statusMessage = $school->is_active
            ? 'Your school listing has been activated and is visible to clients.'
            : 'Your school listing has been deactivated and is now hidden from public search.';

        return back()->with('success', $statusMessage);
    }
}
