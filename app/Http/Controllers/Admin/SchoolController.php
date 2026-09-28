<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAction;
use App\Models\School;
use App\Notifications\ProfileStatusUpdatedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SchoolController extends Controller
{
    /**
     * Display a listing of schools for administration.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');

        $query = School::with(['user', 'reviewer'])
            ->withCount('instructors');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $schools = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('admin/Schools', [
            'schools' => $schools,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'counts' => [
                'total' => School::count(),
                'approved' => School::where('status', 'approved')->count(),
                'pending' => School::where('status', 'pending')->count(),
                'suspended' => School::where('status', 'suspended')->count(),
            ],
        ]);
    }

    /**
     * Suspend a school.
     */
    public function suspend(Request $request, School $school): RedirectResponse
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $admin = $request->user();
        $reason = $request->input('reason', 'School suspended by administrator.');

        $school->status = 'suspended';
        $school->save();

        if ($school->user) {
            $school->user->is_suspended = true;
            $school->user->save();
            $school->user->notify(new ProfileStatusUpdatedNotification('suspended', $reason, 'school'));
        }

        AdminAction::record($admin, 'suspend', $school, "Suspended school: {$reason}", ['reason' => $reason]);

        return back()->with('success', "School {$school->name} has been suspended.");
    }

    /**
     * Reactivate a suspended school.
     */
    public function reactivate(Request $request, School $school): RedirectResponse
    {
        $admin = $request->user();

        $school->status = 'approved';
        $school->save();

        if ($school->user) {
            $school->user->is_suspended = false;
            $school->user->save();
            $school->user->notify(new ProfileStatusUpdatedNotification('reactivated', null, 'school'));
        }

        AdminAction::record($admin, 'reactivate', $school, "Reactivated school {$school->name}");

        return back()->with('success', "School {$school->name} has been reactivated.");
    }

    /**
     * Soft delete a school.
     */
    public function destroy(Request $request, School $school): RedirectResponse
    {
        $admin = $request->user();
        $schoolName = $school->name;

        AdminAction::record($admin, 'delete', $school, "Deleted school {$schoolName}");

        $school->delete();

        return back()->with('success', "School {$schoolName} was removed.");
    }
}
