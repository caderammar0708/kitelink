<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAction;
use App\Models\Instructor;
use App\Notifications\ProfileStatusUpdatedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstructorController extends Controller
{
    /**
     * Display a listing of instructors for administration.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');

        $query = Instructor::with(['user', 'school', 'reviewer'])
            ->withCount('bookings');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('location', 'like', "%{$search}%")
                    ->orWhere('certifications', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $instructors = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('admin/Instructors', [
            'instructors' => $instructors,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'counts' => [
                'total' => Instructor::count(),
                'approved' => Instructor::where('status', 'approved')->count(),
                'pending' => Instructor::where('status', 'pending')->count(),
                'suspended' => Instructor::where('status', 'suspended')->count(),
            ],
        ]);
    }

    /**
     * Suspend an instructor.
     */
    public function suspend(Request $request, Instructor $instructor): RedirectResponse
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $admin = $request->user();
        $reason = $request->input('reason', 'Account suspended by administrator.');

        $instructor->status = 'suspended';
        $instructor->save();

        if ($instructor->user) {
            $instructor->user->is_suspended = true;
            $instructor->user->save();
            $instructor->user->notify(new ProfileStatusUpdatedNotification('suspended', $reason, 'instructor'));
        }

        AdminAction::record($admin, 'suspend', $instructor, "Suspended instructor account: {$reason}", ['reason' => $reason]);

        return back()->with('success', "Instructor {$instructor->user?->name} has been suspended.");
    }

    /**
     * Reactivate a suspended instructor.
     */
    public function reactivate(Request $request, Instructor $instructor): RedirectResponse
    {
        $admin = $request->user();

        $instructor->status = 'approved';
        $instructor->save();

        if ($instructor->user) {
            $instructor->user->is_suspended = false;
            $instructor->user->save();
            $instructor->user->notify(new ProfileStatusUpdatedNotification('reactivated', null, 'instructor'));
        }

        AdminAction::record($admin, 'reactivate', $instructor, 'Reactivated instructor account');

        return back()->with('success', "Instructor {$instructor->user?->name} has been reactivated.");
    }

    /**
     * Soft delete an instructor.
     */
    public function destroy(Request $request, Instructor $instructor): RedirectResponse
    {
        $admin = $request->user();
        $instructorName = $instructor->user?->name ?? 'Instructor';

        AdminAction::record($admin, 'delete', $instructor, "Deleted instructor {$instructorName}");

        $instructor->delete();

        return back()->with('success', "Instructor {$instructorName} was removed.");
    }
}
