<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /**
     * Display a monitor list of platform conversations.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $selectedId = $request->input('conversation_id');

        $query = Conversation::with([
            'participantOne:id,name,email,role,profile_picture',
            'participantTwo:id,name,email,role,profile_picture',
        ])
            ->withCount('messages');

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('participantOne', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('participantTwo', function ($uq) use ($search) {
                    $uq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            });
        }

        $conversations = $query->latest('last_message_at')->paginate(12)->withQueryString();

        $activeConversation = null;
        if ($selectedId) {
            $activeConversation = Conversation::with([
                'participantOne:id,name,email,role,profile_picture',
                'participantTwo:id,name,email,role,profile_picture',
                'messages.sender:id,name,role,profile_picture',
            ])->find($selectedId);
        }

        return Inertia::render('admin/Messages', [
            'conversations' => $conversations,
            'activeConversation' => $activeConversation,
            'filters' => [
                'search' => $search,
            ],
            'totalConversations' => Conversation::count(),
        ]);
    }
}
