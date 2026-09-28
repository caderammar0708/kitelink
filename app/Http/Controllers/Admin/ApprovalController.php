<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAction;
use App\Models\Instructor;
use App\Models\School;
use App\Notifications\ProfileStatusUpdatedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalController extends Controller
{
    /**
     * Display the pending & reviewed approvals list for instructors and schools.
     */
    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'instructors'); // 'instructors' | 'schools'
        $status = $request->input('status', 'pending'); // 'pending' | 'approved' | 'rejected' | 'all'
        $search = $request->input('search', '');

        // Counts for badge notifications
        $instructorPendingCount = Instructor::where('status', 'pending')->count();
        $schoolPendingCount = School::where('status', 'pending')->count();

        if ($tab === 'schools') {
            $query = School::with(['user', 'reviewer']);

            if ($status !== 'all') {
                $query->where('status', $status);
            }

            if (! empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('registration_number', 'like', "%{$search}%")
                        ->orWhere('contact_name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            }

            $items = $query->latest()->paginate(10)->withQueryString();
        } else {
            $query = Instructor::with(['user', 'school', 'reviewer']);

            if ($status !== 'all') {
                $query->where('status', $status);
            }

            if (! empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('location', 'like', "%{$search}%")
                        ->orWhere('license_number', 'like', "%{$search}%")
                        ->orWhere('certifications', 'like', "%{$search}%")
                        ->orWhere('bio', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            }

            $items = $query->latest()->paginate(10)->withQueryString();
        }

        return Inertia::render('admin/Approvals', [
            'items' => $items,
            'tab' => $tab,
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
            'counts' => [
                'instructor_pending' => $instructorPendingCount,
                'school_pending' => $schoolPendingCount,
                'total_pending' => $instructorPendingCount + $schoolPendingCount,
            ],
        ]);
    }

    /**
     * Approve an instructor profile.
     */
    public function approveInstructor(Request $request, Instructor $instructor): RedirectResponse
    {
        $admin = $request->user();

        $instructor->status = 'approved';
        $instructor->rejection_reason = null;
        $instructor->reviewed_by = $admin->id;
        $instructor->reviewed_at = now();
        $instructor->save();

        if ($instructor->user) {
            $instructor->user->notify(new ProfileStatusUpdatedNotification('approved', null, 'instructor'));
        }

        AdminAction::record($admin, 'approve', $instructor, 'Approved instructor profile application');

        return back()->with('success', "Instructor {$instructor->user?->name} approved successfully.");
    }

    /**
     * Reject an instructor profile with a reason.
     */
    public function rejectInstructor(Request $request, Instructor $instructor): RedirectResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:1500'],
        ]);

        $admin = $request->user();
        $reason = $request->input('reason');

        $instructor->status = 'rejected';
        $instructor->rejection_reason = $reason;
        $instructor->reviewed_by = $admin->id;
        $instructor->reviewed_at = now();
        $instructor->save();

        if ($instructor->user) {
            $instructor->user->notify(new ProfileStatusUpdatedNotification('rejected', $reason, 'instructor'));
        }

        AdminAction::record($admin, 'reject', $instructor, "Rejected instructor profile with reason: {$reason}", ['reason' => $reason]);

        return back()->with('success', 'Instructor profile rejected. Feedback notification has been sent.');
    }

    /**
     * Request more information from an instructor.
     */
    public function requestInfoInstructor(Request $request, Instructor $instructor): RedirectResponse
    {
        $request->validate([
            'message' => ['required', 'string', 'max:1500'],
        ]);

        $admin = $request->user();
        $message = $request->input('message');

        if ($instructor->user) {
            $instructor->user->notify(new ProfileStatusUpdatedNotification('info_requested', $message, 'instructor'));
        }

        AdminAction::record($admin, 'request_info', $instructor, "Requested more information: {$message}", ['message' => $message]);

        return back()->with('success', 'Information request sent to instructor.');
    }

    /**
     * Approve a school profile.
     */
    public function approveSchool(Request $request, School $school): RedirectResponse
    {
        $admin = $request->user();

        $school->status = 'approved';
        $school->rejection_reason = null;
        $school->reviewed_by = $admin->id;
        $school->reviewed_at = now();
        $school->save();

        if ($school->user) {
            $school->user->notify(new ProfileStatusUpdatedNotification('approved', null, 'school'));
        }

        AdminAction::record($admin, 'approve', $school, 'Approved school profile application');

        return back()->with('success', "School {$school->name} approved successfully.");
    }

    /**
     * Reject a school profile with a reason.
     */
    public function rejectSchool(Request $request, School $school): RedirectResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:1500'],
        ]);

        $admin = $request->user();
        $reason = $request->input('reason');

        $school->status = 'rejected';
        $school->rejection_reason = $reason;
        $school->reviewed_by = $admin->id;
        $school->reviewed_at = now();
        $school->save();

        if ($school->user) {
            $school->user->notify(new ProfileStatusUpdatedNotification('rejected', $reason, 'school'));
        }

        AdminAction::record($admin, 'reject', $school, "Rejected school profile with reason: {$reason}", ['reason' => $reason]);

        return back()->with('success', 'School profile rejected and feedback notification sent.');
    }

    /**
     * Request more information from a school.
     */
    public function requestInfoSchool(Request $request, School $school): RedirectResponse
    {
        $request->validate([
            'message' => ['required', 'string', 'max:1500'],
        ]);

        $admin = $request->user();
        $message = $request->input('message');

        if ($school->user) {
            $school->user->notify(new ProfileStatusUpdatedNotification('info_requested', $message, 'school'));
        }

        AdminAction::record($admin, 'request_info', $school, "Requested info for school: {$message}", ['message' => $message]);

        return back()->with('success', 'Information request sent to school.');
    }
}
