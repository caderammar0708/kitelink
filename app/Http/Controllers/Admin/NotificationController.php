<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display all admin notifications.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->latest()
            ->paginate(15)
            ->through(function ($n) {
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

        return Inertia::render('admin/Notifications', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotifications()->count(),
        ]);
    }
}
