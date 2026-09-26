import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    Check,
    CheckCheck,
    MessageSquare,
    Search,
    Send,
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
    type: 'client' | 'school';
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
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
    {
        title: 'Messages & Chat',
        href: '/instructor/messages',
    },
];

export default function Messages({
    conversations = [],
    activeConversationId,
    messages = [],
    otherUser,
}: MessagesProps) {
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'client' | 'school'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [inputMessage, setInputMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const filteredConversations = conversations.filter((c) => {
        if (selectedFilter !== 'all' && c.type !== selectedFilter) return false;
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
        router.get(route('instructor.messages.show', convId), {}, { preserveState: true });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !activeConversationId || sending) return;

        setSending(true);
        router.post(
            route('instructor.messages.store', activeConversationId),
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
            <Head title="Instructor Inbox & Messages - KiteLink" />

            <div className="relative min-h-full p-4 text-slate-800 selection:bg-blue-600/30 selection:text-blue-900 dark:text-slate-100 dark:selection:bg-[#3b82f6]/30 dark:selection:text-white sm:p-6 lg:p-8">
                {/* 2-Column Chat Box Window */}
                <div className="grid h-[calc(100vh-14rem)] min-h-[550px] grid-cols-1 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl md:grid-cols-12">
                    {/* Left Sidebar (4 cols on desktop) */}
                    <div className="flex flex-col border-b border-slate-200 dark:border-white/10 md:col-span-4 md:border-r md:border-b-0">
                        {/* Header & Filter Tags */}
                        <div className="border-b border-slate-200 p-4 dark:border-white/10">
                            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-[#5bb4ff]" />
                                Direct Messages
                            </h2>

                            {/* Search */}
                            <div className="relative mt-3">
                                <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search chats..."
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2 pr-3 pl-8 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500"
                                />
                            </div>

                            {/* Filter Tags */}
                            <div className="mt-3 flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setSelectedFilter('all')}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                                        selectedFilter === 'all'
                                            ? 'bg-blue-600 text-white shadow-xs dark:bg-[#1f6eff]'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFilter('client')}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                                        selectedFilter === 'client'
                                            ? 'bg-blue-600 text-white shadow-xs dark:bg-[#1f6eff]'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                >
                                    Clients
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFilter('school')}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                                        selectedFilter === 'school'
                                            ? 'bg-blue-600 text-white shadow-xs dark:bg-[#1f6eff]'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                >
                                    Kite Schools
                                </button>
                            </div>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                            {filteredConversations.length === 0 ? (
                                <div className="p-8 text-center text-xs text-slate-500">
                                    No conversations found.
                                </div>
                            ) : (
                                filteredConversations.map((conv) => {
                                    const isSelected = activeConversationId === conv.id;
                                    const isSchool = conv.type === 'school';

                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => handleSelectConversation(conv.id)}
                                            className={`flex cursor-pointer items-center justify-between p-3.5 transition ${
                                                isSelected
                                                    ? 'border-l-2 border-blue-600 bg-blue-50/80 dark:border-[#5bb4ff] dark:bg-[#1f6eff]/20'
                                                    : 'hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="relative">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-blue-600 dark:border-white/15 dark:bg-slate-800 dark:text-[#8acbff]">
                                                        {conv.other_user?.avatar ? (
                                                            <img
                                                                src={conv.other_user.avatar}
                                                                alt={conv.other_user?.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            conv.other_user?.name?.charAt(0) || 'U'
                                                        )}
                                                    </div>
                                                    {isSchool && (
                                                        <div
                                                            className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[9px] text-white"
                                                            title="Kite School"
                                                        >
                                                            <Building2 className="h-2.5 w-2.5" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="truncate text-xs font-bold text-slate-900 dark:text-white">
                                                            {conv.other_user?.name || 'User'}
                                                        </span>
                                                    </div>
                                                    <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                                                        {conv.last_message?.body || 'Start conversation...'}
                                                    </p>
                                                </div>
                                            </div>

                                            {conv.unread_count > 0 && (
                                                <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white dark:bg-[#1f6eff]">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Active Chat Thread (8 cols) */}
                    <div className="flex flex-col bg-slate-50/40 dark:bg-slate-950/20 md:col-span-8">
                        {activeConversationId && otherUser ? (
                            <>
                                {/* Active Chat Top Bar */}
                                <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.02]">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-blue-600 dark:border-white/15 dark:bg-slate-800 dark:text-[#8acbff]">
                                            {otherUser.avatar ? (
                                                <img src={otherUser.avatar} alt={otherUser.name} className="h-full w-full object-cover" />
                                            ) : (
                                                otherUser.name?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{otherUser.name}</h3>
                                            <span className="text-[11px] text-slate-500 capitalize dark:text-slate-400">
                                                {otherUser.role === 'school' ? 'Kite Center Partner' : 'Student Rider'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Bubble Scroll Area */}
                                <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
                                    {messages.length === 0 ? (
                                        <div className="flex h-full items-center justify-center text-center text-xs text-slate-500">
                                            Send a message to start communicating.
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isMine = msg.sender_id !== otherUser.id;

                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-xs rounded-2xl p-3.5 text-xs sm:max-w-md ${
                                                            isMine
                                                                ? 'rounded-br-xs bg-gradient-to-r from-blue-600 to-[#1f6eff] text-white shadow-sm'
                                                                : 'rounded-bl-xs border border-slate-200 bg-white text-slate-900 shadow-xs dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-100'
                                                        }`}
                                                    >
                                                        <p className="leading-relaxed">{msg.body}</p>
                                                        <div
                                                            className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                                                                isMine ? 'text-blue-100' : 'text-slate-400'
                                                            }`}
                                                        >
                                                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            {isMine && (
                                                                msg.read_at ? <CheckCheck className="h-3 w-3 text-sky-200" /> : <Check className="h-3 w-3 text-blue-100" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Chat Input Bar */}
                                <form
                                    onSubmit={handleSendMessage}
                                    className="border-t border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.02] sm:p-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            placeholder="Type your reply here..."
                                            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 shadow-xs focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!inputMessage.trim() || sending}
                                            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-[#1f6eff] text-white shadow-sm transition hover:scale-105 disabled:opacity-40"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 shadow-xs dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500">
                                    <MessageSquare className="h-7 w-7" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select a conversation</h3>
                                <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                                    Choose a client or school on the left to view messages and reply in real time.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
