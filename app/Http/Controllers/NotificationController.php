<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get the last 20 notifications for the authenticated user.
     */
    public function index(Request $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->latest()
            ->limit(20)
            ->get()
            ->map(function ($n) {
                $data = is_string($n->data) ? json_decode($n->data, true) : (array) $n->data;

                return [
                    'id' => (string) $n->id,
                    'type' => $data['type'] ?? 'default',
                    'data' => $data,
                    'read_at' => $n->read_at?->toISOString(),
                    'created_at' => $n->created_at?->toISOString(),
                    'created_at_human' => $n->created_at?->diffForHumans() ?? '',
                ];
            });

        $unreadCount = $user->unreadNotifications()->count();

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
                'has_unread' => $unreadCount > 0,
            ]);
        }

        if ($user->role === 'instructor') {
            return redirect()->route('instructor.notifications');
        }

        $response = response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
            'has_unread' => $unreadCount > 0,
        ]);

        return $response
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }

    /**
     * Mark a single notification as read.
     */
    public function markAsRead(Request $request, string $id): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        $notification = $user->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->markAsRead();
        } else {
            $user->notifications()->where('id', $id)->update(['read_at' => now()]);
        }

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => true])
                ->header('Cache-Control', 'no-cache, no-store, must-revalidate');
        }

        return back();
    }

    /**
     * Mark all unread notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        $user->unreadNotifications()->update(['read_at' => now()]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['success' => true])
                ->header('Cache-Control', 'no-cache, no-store, must-revalidate');
        }

        return back();
    }
}
