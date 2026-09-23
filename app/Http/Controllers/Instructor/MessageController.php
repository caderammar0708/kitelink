<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Notifications\MessageReceivedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /**
     * Display instructor conversation list and initial chat.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $conversations = Conversation::forUser($user->id)
            ->with(['participantOne', 'participantTwo', 'messages' => fn ($q) => $q->latest()->limit(1)])
            ->orderBy('last_message_at', 'desc')
            ->get();

        $formattedConversations = $this->formatConversations($conversations, $user->id);

        $firstConv = $conversations->first();
        $messages = [];
        $otherUser = null;
        $activeId = null;

        if ($firstConv) {
            $activeId = $firstConv->id;
            $firstConv->messages()
                ->where('sender_id', '!=', $user->id)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);

            $user->unreadNotifications
                ->filter(fn ($n) => ($n->data['conversation_id'] ?? null) == $activeId)
                ->each->markAsRead();

            $messages = $firstConv->messages()
                ->with('sender:id,name,profile_picture')
                ->orderBy('created_at', 'asc')
                ->get();

            $other = $firstConv->getOtherParticipant($user->id);
            if ($other) {
                $otherUser = [
                    'id' => $other->id,
                    'name' => $other->name,
                    'avatar' => $other->profile_picture,
                    'role' => $other->role,
                ];
            }
        }

        return Inertia::render('instructor/Messages', [
            'conversations' => $formattedConversations,
            'activeConversationId' => $activeId,
            'messages' => $messages,
            'otherUser' => $otherUser,
        ]);
    }

    /**
     * Show a specific conversation thread.
     */
    public function show(Request $request, Conversation $conversation): Response
    {
        $user = $request->user();

        abort_unless($conversation->participant_one_id === $user->id || $conversation->participant_two_id === $user->id, 403);

        $conversations = Conversation::forUser($user->id)
            ->with(['participantOne', 'participantTwo', 'messages' => fn ($q) => $q->latest()->limit(1)])
            ->orderBy('last_message_at', 'desc')
            ->get();

        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $user->unreadNotifications
            ->filter(fn ($n) => ($n->data['conversation_id'] ?? null) == $conversation->id)
            ->each->markAsRead();

        $messages = $conversation->messages()
            ->with('sender:id,name,profile_picture')
            ->orderBy('created_at', 'asc')
            ->get();

        $other = $conversation->getOtherParticipant($user->id);
        $otherUser = $other ? [
            'id' => $other->id,
            'name' => $other->name,
            'avatar' => $other->profile_picture,
            'role' => $other->role,
        ] : null;

        return Inertia::render('instructor/Messages', [
            'conversations' => $this->formatConversations($conversations, $user->id),
            'activeConversationId' => $conversation->id,
            'messages' => $messages,
            'otherUser' => $otherUser,
        ]);
    }

    /**
     * Send a new message in the conversation.
     */
    public function store(Request $request, Conversation $conversation): RedirectResponse
    {
        $user = $request->user();

        abort_unless($conversation->participant_one_id === $user->id || $conversation->participant_two_id === $user->id, 403);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'body' => $validated['body'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        $recipient = $conversation->getOtherParticipant($user->id);
        if ($recipient) {
            $recipient->notify(new MessageReceivedNotification($message, $conversation));
        }

        return back();
    }

    /**
     * Format conversation collection for frontend.
     */
    private function formatConversations($conversations, int $currentUserId)
    {
        return $conversations->map(function (Conversation $c) use ($currentUserId) {
            $other = $c->getOtherParticipant($currentUserId);
            $lastMsg = $c->messages->first();

            return [
                'id' => $c->id,
                'type' => $c->type ?? 'client',
                'other_user' => [
                    'id' => $other?->id,
                    'name' => $other?->name ?? 'User',
                    'avatar' => $other?->profile_picture,
                    'role' => $other?->role ?? 'client',
                ],
                'last_message' => $lastMsg ? [
                    'body' => $lastMsg->body,
                    'created_at' => $lastMsg->created_at?->diffForHumans() ?? '',
                    'is_mine' => $lastMsg->sender_id === $currentUserId,
                ] : null,
                'unread_count' => $c->messages()->where('sender_id', '!=', $currentUserId)->whereNull('read_at')->count(),
                'last_message_at' => $c->last_message_at?->toISOString(),
            ];
        })->values();
    }
}
