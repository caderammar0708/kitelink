<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Display client account and preference settings.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('client/Settings', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'notification_sound_enabled' => (bool) ($user->notification_sound_enabled ?? true),
            ],
            'status' => session('status'),
        ]);
    }

    /**
     * Update client profile details (name and email).
     */
    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,'.$user->id],
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        return back()->with('status', 'Profile details updated successfully!');
    }

    /**
     * Update client account password.
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

        return back()->with('status', 'Password updated successfully!');
    }

    /**
     * Update client notification sound and alert preferences.
     */
    public function updateNotifications(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'notification_sound_enabled' => ['nullable', 'boolean'],
        ]);

        if ($request->has('notification_sound_enabled')) {
            $request->user()->update([
                'notification_sound_enabled' => (bool) $validated['notification_sound_enabled'],
            ]);
        }

        return back()->with('status', 'Notification preferences saved successfully!');
    }

    /**
     * Permanently delete client account.
     */
    public function destroyAccount(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
