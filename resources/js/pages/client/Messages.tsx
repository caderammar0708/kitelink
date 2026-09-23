import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePoll } from '@inertiajs/react';
import {
    Award,
    Check,
    CheckCheck,
    Compass,
    MessageSquare,
    Search,
    Send,
    Sparkles,
    User,
    Wind,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface OtherUser {
    id: number;
    name: string;
    avatar?: string;
    role: string;
}

interface LastMessage {
    body: string;
    created_at: string;
    is_mine: boolean;
}

interface ConversationItem {
    id: number;
    type: 'client' | 'school' | string;
    other_user: OtherUser;
    last_message?: LastMessage;
    unread_count: number;
    last_message_at?: string;
}

interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    body: string;
    read_at?: string;
    created_at: string;
    sender?: { id: number; name: string; profile_picture?: string };
}

interface MessagesProps {
    conversations?: ConversationItem[];
    activeConversationId?: number | null;
    messages?: Message[];
    otherUser?: OtherUser | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Messages',
        href: '/client/messages',
    },
];

export default function Messages({
    conversations = [],
    activeConversationId,
    messages = [],
    otherUser,
}: MessagesProps) {
    // Automatically poll every 10s for incoming chat messages
    usePoll(10000);

    const [searchQuery, setSearchQuery] = useState('');
    const [inputMessage, setInputMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const filteredConversations = conversations.filter((c) => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                c.other_user?.name?.toLowerCase().includes(q) ||
                c.last_message?.body?.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const handleSelectConversation = (convId: number) => {
        router.get(route('client.messages.show', convId), {}, { preserveState: true });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !activeConversationId || sending) return;

        setSending(true);
        router.post(
            route('client.messages.store', activeConversationId),
            { body: inputMessage },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setInputMessage('');
                },
                onFinish: () => setSending(false),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Direct Messages - KiteLink" />

            <div className="relative min-h-full p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* 2-Column Chat Box Window */}
                <div className="grid h-[calc(100vh-14rem)] min-h-[550px] grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl md:grid-cols-12">
                    {/* Left Sidebar (4 cols on desktop) */}
                    <div className="flex flex-col border-b border-white/10 md:col-span-4 md:border-r md:border-b-0">
                        {/* Header & Search */}
                        <div className="border-b border-white/10 p-4">
                            <h2 className="flex items-center gap-2 text-base font-bold text-white">
                                <MessageSquare className="h-5 w-5 text-[#5bb4ff]" />
                                Direct Messages
                            </h2>

                            {/* Search */}
                            <div className="relative mt-3">
                                <Search className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search instructors or messages..."
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-2 pr-3 pl-8 text-xs text-white placeholder-slate-500 transition-all focus:border-[#3b82f6] focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                            {filteredConversations.length === 0 ? (
                                <div className="p-8 text-center text-xs text-slate-400">
                                    <MessageSquare className="mx-auto mb-2 h-7 w-7 text-slate-600" />
                                    <p className="font-semibold text-slate-300">No Conversations Yet</p>
                                    <p className="mt-1 text-slate-500">
                                        Book a lesson with an instructor to start chatting about spot conditions, equipment, and lesson times.
                                    </p>
                                </div>
                            ) : (
                                filteredConversations.map((conv) => {
                                    const isActive = conv.id === activeConversationId;
                                    return (
                                        <button
                                            key={conv.id}
                                            type="button"
                                            onClick={() => handleSelectConversation(conv.id)}
                                            className={`flex w-full cursor-pointer items-start gap-3 p-3.5 text-left transition-all ${
                                                isActive
                                                    ? 'border-l-2 border-[#3b82f6] bg-white/[0.08]'
                                                    : 'hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            {/* Avatar */}
                                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-sm">
                                                {conv.other_user?.avatar ? (
                                                    <img
                                                        src={conv.other_user.avatar}
                                                        alt={conv.other_user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1f6eff]/20 to-[#5bb4ff]/10 text-sm font-bold text-[#8acbff]">
                                                        {conv.other_user?.name?.charAt(0) || 'I'}
                                                    </div>
                                                )}
                                                {conv.unread_count > 0 && (
                                                    <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#070b12] bg-[#3b82f6]" />
                                                )}
                                            </div>

                                            {/* Preview Details */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="truncate text-xs font-bold text-white sm:text-sm">
                                                        {conv.other_user?.name || 'Instructor'}
                                                    </h3>
                                                    {conv.last_message?.created_at && (
                                                        <span className="text-[10px] text-slate-400">
                                                            {conv.last_message.created_at}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                                                    {conv.last_message ? (
                                                        <>
                                                            {conv.last_message.is_mine && (
                                                                <span className="text-[#8acbff]">You: </span>
                                                            )}
                                                            {conv.last_message.body}
                                                        </>
                                                    ) : (
                                                        <span className="italic text-slate-500">No messages yet</span>
                                                    )}
                                                </p>
                                            </div>

                                            {/* Unread Count Badge */}
                                            {conv.unread_count > 0 && (
                                                <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#3b82f6] px-1.5 text-[10px] font-bold text-white">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Chat Panel (8 cols on desktop) */}
                    <div className="flex flex-col md:col-span-8">
                        {activeConversationId && otherUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] p-4 px-6 backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-sm">
                                            {otherUser.avatar ? (
                                                <img
                                                    src={otherUser.avatar}
                                                    alt={otherUser.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-[#1f6eff]/20 text-sm font-bold text-[#8acbff]">
                                                    {otherUser.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white sm:text-base">
                                                {otherUser.name}
                                            </h3>
                                            <div className="flex items-center gap-1.5">
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8acbff]">
                                                    <Award className="h-3 w-3" />
                                                    Certified Instructor
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="hidden items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 sm:inline-flex">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                            Active Chat
                                        </span>
                                    </div>
                                </div>

                                {/* Messages Stream */}
                                <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
                                    {messages.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center p-6 text-center text-xs text-slate-400">
                                            <Sparkles className="mb-2 h-8 w-8 text-[#5bb4ff]" />
                                            <p className="text-sm font-bold text-white">Start the Conversation</p>
                                            <p className="mt-1 max-w-sm text-slate-400">
                                                Say hi to {otherUser.name}! Coordinate lesson location, equipment rental, or wind forecasts.
                                            </p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isMine = msg.sender_id !== otherUser.id;
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex items-end gap-2.5 ${
                                                        isMine ? 'justify-end' : 'justify-start'
                                                    }`}
                                                >
                                                    {!isMine && (
                                                        <div className="h-7 w-7 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                                                            {otherUser.avatar ? (
                                                                <img
                                                                    src={otherUser.avatar}
                                                                    alt={otherUser.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#8acbff]">
                                                                    {otherUser.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div
                                                        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs shadow-md backdrop-blur-md sm:max-w-[70%] sm:text-sm ${
                                                            isMine
                                                                ? 'rounded-br-xs bg-gradient-to-r from-[#1f6eff] to-[#3b82f6] text-white shadow-blue-600/30'
                                                                : 'rounded-bl-xs border border-white/10 bg-white/[0.08] text-slate-100'
                                                        }`}
                                                    >
                                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                                                        <div
                                                            className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                                                                isMine ? 'text-blue-200' : 'text-slate-400'
                                                            }`}
                                                        >
                                                            <span>
                                                                {new Date(msg.created_at).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </span>
                                                            {isMine && (
                                                                <>
                                                                    {msg.read_at ? (
                                                                        <CheckCheck className="h-3 w-3 text-sky-200" />
                                                                    ) : (
                                                                        <Check className="h-3 w-3 text-blue-200" />
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Composer */}
                                <form
                                    onSubmit={handleSendMessage}
                                    className="border-t border-white/10 bg-white/[0.02] p-3 backdrop-blur-md sm:p-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            placeholder={`Message ${otherUser.name}...`}
                                            className="flex-1 rounded-2xl border border-white/15 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-500 shadow-inner backdrop-blur-md transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none sm:text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!inputMessage.trim() || sending}
                                            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 hover:from-[#5bb4ff] hover:to-[#2e7bff] disabled:opacity-50 sm:text-sm"
                                        >
                                            <Send className="h-4 w-4" />
                                            <span className="hidden sm:inline">Send</span>
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-xs text-slate-400">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5bb4ff]/30 bg-gradient-to-br from-[#1f6eff]/20 to-[#5bb4ff]/10 text-[#5bb4ff] shadow-lg">
                                    <MessageSquare className="h-8 w-8" />
                                </div>
                                <h3 className="text-base font-bold text-white sm:text-lg">
                                    Select a Conversation
                                </h3>
                                <p className="mt-1 max-w-sm text-slate-400">
                                    Select an instructor from the left list or click "Message Instructor" on any of your confirmed bookings to open a chat.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
