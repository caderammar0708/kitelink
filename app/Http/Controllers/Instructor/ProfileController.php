<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the instructor profile edit form.
     */
    public function edit(Request $request): Response
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

        return Inertia::render('instructor/Profile', [
            'instructor' => $instructor,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the instructor profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'bio' => ['nullable', 'string', 'max:2000'],
            'certifications' => ['nullable', 'string', 'max:255'],
            'experience_years' => ['nullable', 'integer', 'min:0', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:2048'],
        ]);

        /** @var Instructor $instructor */
        $instructor = $user->instructor()->first();
        if (! $instructor) {
            $instructor = new Instructor(['user_id' => $user->id]);
        }

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $avatarUrl = '/storage/'.$path;
            $user->profile_picture = $avatarUrl;
            $instructor->profile_photo = $avatarUrl;
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->save();

        $instructor->bio = $validated['bio'] ?? null;
        $instructor->certifications = $validated['certifications'] ?? null;
        $instructor->experience_years = isset($validated['experience_years']) && $validated['experience_years'] !== '' ? (int) $validated['experience_years'] : null;
        $instructor->location = $validated['location'] ?? null;
        $instructor->hourly_rate = isset($validated['hourly_rate']) && $validated['hourly_rate'] !== '' ? (float) $validated['hourly_rate'] : null;
        $instructor->save();

        return back()->with('status', 'Profile updated successfully!');
    }
}
