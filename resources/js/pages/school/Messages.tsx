import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Building2,
    Check,
    CheckCheck,
    GraduationCap,
    MessageSquare,
    Search,
    Send,
    User,
    Users,
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
    type: 'client' | 'instructor' | string;
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
    activeConversationId?: number;
    messages?: Message[];
    otherUser?: OtherUser;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'School Dashboard', href: '/school/dashboard' },
    { title: 'Messages', href: '/school/messages' },
];

export default function Messages({
    conversations = [],
    activeConversationId,
    messages = [],
    otherUser,
}: MessagesProps) {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'client' | 'instructor'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [inputMessage, setInputMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const filteredConversations = conversations.filter((c) => {
        if (selectedFilter !== 'all') {
            if (selectedFilter === 'instructor' && c.other_user?.role !== 'instructor') return false;
            if (selectedFilter === 'client' && c.other_user?.role === 'instructor') return false;
        }
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
        router.get(`/school/messages/${convId}`, {}, { preserveState: true });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !activeConversationId || sending) return;

        setSending(true);
        router.post(
            `/school/messages/${activeConversationId}`,
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
            <Head title="School Messages - KiteLink" />

            <div className="flex h-[calc(100vh-8.5rem)] flex-1 flex-col gap-4 p-4 text-slate-900 transition-colors duration-200 sm:p-6 dark:text-slate-100">
                <div className="flex h-full flex-1 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                    {/* Left Conversations Sidebar */}
                    <div className="flex w-full flex-col border-r border-slate-100 sm:w-80 md:w-96 dark:border-white/5">
                        {/* Search & Tabs Header */}
                        <div className="p-4 border-b border-slate-100 dark:border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h1 className="text-base font-bold text-slate-900 dark:text-white">
                                    School Messages
                                </h1>
                                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                                    {conversations.length} Threads
                                </span>
                            </div>

                            {/* Search bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search chats..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                            </div>

                            {/* Filter Pills */}
                            <div className="flex items-center gap-1">
                                {(['all', 'client', 'instructor'] as const).map((filterKey) => (
                                    <button
                                        key={filterKey}
                                        type="button"
                                        onClick={() => setSelectedFilter(filterKey)}
                                        className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                                            selectedFilter === filterKey
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        {filterKey === 'all' ? 'All' : filterKey === 'client' ? 'Clients' : 'Instructors'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80 dark:divide-white/5">
                            {filteredConversations.length === 0 ? (
                                <div className="p-8 text-center text-xs text-slate-400">
                                    No conversations found.
                                </div>
                            ) : (
                                filteredConversations.map((c) => {
                                    const isSelected = c.id === activeConversationId;
                                    const other = c.other_user;
                                    const isInstructor = other?.role === 'instructor';

                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => handleSelectConversation(c.id)}
                                            className={`flex w-full items-start gap-3 p-3.5 text-left transition ${
                                                isSelected
                                                    ? 'bg-purple-50/70 dark:bg-purple-950/20'
                                                    : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            {other?.avatar ? (
                                                <img
                                                    src={other.avatar}
                                                    alt={other.name}
                                                    className="h-10 w-10 shrink-0 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-white/10"
                                                />
                                            ) : (
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold text-white shadow-sm ${
                                                    isInstructor ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                }`}>
                                                    {other?.name ? other.name.charAt(0) : 'U'}
                                                </div>
                                            )}

                                            <div className="flex-1 overflow-hidden space-y-0.5">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-xs truncate text-slate-900 dark:text-white">
                                                        {other?.name ?? 'User'}
                                                    </span>
                                                    {c.last_message && (
                                                        <span className="text-[10px] text-slate-400 shrink-0">
                                                            {c.last_message.created_at}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                                                        isInstructor ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                                    }`}>
                                                        {isInstructor ? 'Instructor' : 'Client'}
                                                    </span>

                                                    {c.last_message && (
                                                        <p className="text-[11px] truncate text-slate-500 dark:text-slate-400">
                                                            {c.last_message.body}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {c.unread_count > 0 && (
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-600 text-[10px] font-extrabold text-white">
                                                    {c.unread_count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Active Chat Stream */}
                    <div className="flex flex-1 flex-col">
                        {activeConversationId && otherUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        {otherUser.avatar ? (
                                            <img
                                                src={otherUser.avatar}
                                                alt={otherUser.name}
                                                className="h-10 w-10 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-white/10"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
                                                {otherUser.name.charAt(0)}
                                            </div>
                                        )}

                                        <div>
                                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                                {otherUser.name}
                                            </h2>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                                {otherUser.role} on KiteLink
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Stream */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {messages.length === 0 ? (
                                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                            No messages in this chat yet. Send the first message!
                                        </div>
                                    ) : (
                                        messages.map((m) => {
                                            const isMine = m.sender_id !== otherUser.id;

                                            return (
                                                <div
                                                    key={m.id}
                                                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                                                            isMine
                                                                ? 'bg-purple-600 text-white rounded-tr-none'
                                                                : 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white rounded-tl-none'
                                                        }`}
                                                    >
                                                        {m.body}
                                                    </div>
                                                    <span className="mt-1 text-[10px] text-slate-400">
                                                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Send Input Form */}
                                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-white/5 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !inputMessage.trim()}
                                        className="inline-flex items-center gap-1 rounded-2xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-500 disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>Send</span>
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                                <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
                                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                                    Select a Conversation
                                </h3>
                                <p className="text-xs text-slate-400 max-w-xs mt-1">
                                    Choose a client inquiry or instructor thread from the left to start chatting.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
