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
                'is_active' => true,
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
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'daily_rate' => ['nullable', 'numeric', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,gif', 'max:2048'],
            'cert_document' => ['nullable', 'file', 'mimes:pdf,jpeg,png,jpg,webp', 'max:5120'],
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

        if ($request->hasFile('cert_document')) {
            $certPath = $request->file('cert_document')->store('certifications', 'public');
            // Store certificate note or path in certifications metadata
            $certDocUrl = '/storage/'.$certPath;
            if (! empty($validated['certifications'])) {
                $instructor->certifications = $validated['certifications'];
            }
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->save();

        $instructor->bio = $validated['bio'] ?? null;
        $instructor->certifications = $validated['certifications'] ?? null;
        $instructor->experience_years = isset($validated['experience_years']) && $validated['experience_years'] !== '' ? (int) $validated['experience_years'] : null;
        $instructor->location = $validated['location'] ?? null;
        $instructor->languages = $validated['languages'] ?? [];
        $instructor->hourly_rate = isset($validated['hourly_rate']) && $validated['hourly_rate'] !== '' ? (float) $validated['hourly_rate'] : null;
        $instructor->daily_rate = isset($validated['daily_rate']) && $validated['daily_rate'] !== '' ? (float) $validated['daily_rate'] : null;
        $instructor->is_active = $request->boolean('is_active', true);
        $instructor->save();

        return back()->with('status', 'Profile updated successfully!');
    }
}
