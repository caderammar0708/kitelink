<?php

namespace App\Http\Controllers\School;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the form for editing the school profile.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        return Inertia::render('school/Profile', [
            'school' => $school,
        ]);
    }

    /**
     * Update the school profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'location' => ['required', 'string', 'max:255'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'max:255'],
            'facilities' => ['nullable', 'array'],
            'facilities.*' => ['string', 'max:100'],
            'gear_list' => ['nullable', 'array'],
            'gear_list.*' => ['string', 'max:200'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['string', 'max:1000'],
            'certifications' => ['nullable'],
            'logo' => ['nullable', 'string', 'max:1000'],
        ]);

        $certifications = $validated['certifications'] ?? null;
        if (is_array($certifications)) {
            $certifications = implode(', ', $certifications);
        }

        $school->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'],
            'contact_name' => $validated['contact_name'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'website' => $validated['website'] ?? null,
            'facilities' => $validated['facilities'] ?? [],
            'gear_list' => $validated['gear_list'] ?? [],
            'photos' => $validated['photos'] ?? [],
            'certifications' => $certifications,
            'logo' => $validated['logo'] ?? null,
        ]);

        if (! empty($validated['contact_name'])) {
            $user->update([
                'name' => $validated['contact_name'],
                'phone' => $validated['phone'] ?? $user->phone,
            ]);
        }

        return back()
            ->with('status', 'School profile updated successfully.')
            ->with('success', 'School profile updated successfully.');
    }
}
