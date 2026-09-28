<?php

namespace App\Http\Controllers\School;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Notifications\MessageReceivedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    /**
     * Display school conversation list and active chat.
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

        return Inertia::render('school/Messages', [
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

        return Inertia::render('school/Messages', [
            'conversations' => $this->formatConversations($conversations, $user->id),
            'activeConversationId' => $conversation->id,
            'messages' => $messages,
            'otherUser' => $otherUser,
        ]);
    }

    /**
     * Send a new message.
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
     * Start a conversation with a user (client or instructor).
     */
    public function start(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'recipient_id' => ['required', 'exists:users,id'],
            'initial_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $recipient = User::findOrFail($validated['recipient_id']);

        $conversation = Conversation::where(function ($q) use ($user, $recipient) {
            $q->where('participant_one_id', $user->id)
                ->where('participant_two_id', $recipient->id);
        })->orWhere(function ($q) use ($user, $recipient) {
            $q->where('participant_one_id', $recipient->id)
                ->where('participant_two_id', $user->id);
        })->first();

        if (! $conversation) {
            $conversation = Conversation::create([
                'participant_one_id' => $user->id,
                'participant_two_id' => $recipient->id,
                'type' => $recipient->role === 'instructor' ? 'instructor' : 'client',
                'last_message_at' => now(),
            ]);
        }

        if (! empty($validated['initial_message'])) {
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $user->id,
                'body' => $validated['initial_message'],
            ]);

            $recipient->notify(new MessageReceivedNotification($message, $conversation));
        }

        return redirect()->route('school.messages.show', $conversation);
    }

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
