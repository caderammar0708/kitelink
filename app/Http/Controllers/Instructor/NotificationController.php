<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display all system notifications.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $notifications = $user->notifications()->latest()->get()->map(function ($n) {
            return [
                'id' => (string) $n->id,
                'type' => $n->type,
                'data' => is_string($n->data) ? json_decode($n->data, true) : (array) $n->data,
                'read_at' => $n->read_at?->toISOString(),
                'created_at' => $n->created_at?->toISOString(),
            ];
        });

        return Inertia::render('instructor/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications()->count(),
        ]);
    }

    /**
     * Mark single or all notifications as read.
     */
    public function markAsRead(Request $request): RedirectResponse
    {
        $user = $request->user();
        $ids = $request->input('ids');

        if (! empty($ids) && is_array($ids)) {
            $user->unreadNotifications()->whereIn('id', $ids)->update(['read_at' => now()]);
        } else {
            $user->unreadNotifications()->update(['read_at' => now()]);
        }

        return back()->with('status', 'Notifications updated.');
    }
}
