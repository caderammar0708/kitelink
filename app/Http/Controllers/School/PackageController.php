<?php

namespace App\Http\Controllers\School;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\SchoolPackage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    /**
     * Display a listing of packages for the school.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        $packages = $school->packages()->latest()->get();

        return Inertia::render('school/Packages', [
            'school' => $school,
            'packages' => $packages,
        ]);
    }

    /**
     * Store a newly created package for the school.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:course,rental,camp,private',
            'duration_label' => 'required|string|max:100',
            'price' => 'required|numeric|min:0|max:999999',
            'description' => 'nullable|string|max:2000',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        $features = array_values(array_filter($validated['features'] ?? []));

        $school->packages()->create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'duration_label' => $validated['duration_label'],
            'price' => $validated['price'],
            'description' => $validated['description'] ?? null,
            'features' => $features,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return back()->with('status', 'Package created successfully.');
    }

    /**
     * Update the specified package.
     */
    public function update(Request $request, SchoolPackage $package): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        if ($package->school_id !== $school->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:course,rental,camp,private',
            'duration_label' => 'required|string|max:100',
            'price' => 'required|numeric|min:0|max:999999',
            'description' => 'nullable|string|max:2000',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        $features = array_values(array_filter($validated['features'] ?? []));

        $package->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'duration_label' => $validated['duration_label'],
            'price' => $validated['price'],
            'description' => $validated['description'] ?? null,
            'features' => $features,
            'is_active' => $validated['is_active'] ?? $package->is_active,
        ]);

        return back()->with('status', 'Package updated successfully.');
    }

    /**
     * Toggle the active status of a package.
     */
    public function toggle(Request $request, SchoolPackage $package): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        if ($package->school_id !== $school->id) {
            abort(403);
        }

        $package->update([
            'is_active' => ! $package->is_active,
        ]);

        return back()->with('status', 'Package status updated.');
    }

    /**
     * Remove the specified package.
     */
    public function destroy(Request $request, SchoolPackage $package): RedirectResponse
    {
        $user = $request->user();
        /** @var School $school */
        $school = $user->school()->firstOrFail();

        if ($package->school_id !== $school->id) {
            abort(403);
        }

        $package->delete();

        return back()->with('status', 'Package deleted successfully.');
    }
}
