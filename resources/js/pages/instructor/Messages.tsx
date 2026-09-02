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

            <div className="relative min-h-full p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* 2-Column Chat Box Window */}
                <div className="grid h-[calc(100vh-14rem)] min-h-[550px] grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl md:grid-cols-12">
                    {/* Left Sidebar (4 cols on desktop) */}
                    <div className="flex flex-col border-b border-white/10 md:col-span-4 md:border-r md:border-b-0">
                        {/* Header & Filter Tags */}
                        <div className="border-b border-white/10 p-4">
                            <h2 className="flex items-center gap-2 text-base font-bold text-white">
                                <MessageSquare className="h-5 w-5 text-[#5bb4ff]" />
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
                                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 py-2 pr-3 pl-8 text-xs text-white placeholder-slate-500 focus:border-[#3b82f6] focus:outline-none"
                                />
                            </div>

                            {/* Filter Tags */}
                            <div className="mt-3 flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setSelectedFilter('all')}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                        selectedFilter === 'all'
                                            ? 'bg-[#1f6eff] text-white'
                                            : 'bg-white/[0.05] text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFilter('client')}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                        selectedFilter === 'client'
                                            ? 'bg-[#1f6eff] text-white'
                                            : 'bg-white/[0.05] text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Clients
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFilter('school')}
                                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                                        selectedFilter === 'school'
                                            ? 'bg-[#1f6eff] text-white'
                                            : 'bg-white/[0.05] text-slate-400 hover:text-slate-200'
                                    }`}
                                >
                                    Kite Schools
                                </button>
                            </div>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
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
                                                    ? 'bg-[#1f6eff]/20 border-l-2 border-[#5bb4ff]'
                                                    : 'hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="relative">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-slate-800 text-xs font-bold text-[#8acbff]">
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
                                                        <span className="truncate text-xs font-bold text-white">
                                                            {conv.other_user?.name || 'User'}
                                                        </span>
                                                    </div>
                                                    <p className="truncate text-[11px] text-slate-400">
                                                        {conv.last_message?.body || 'Start conversation...'}
                                                    </p>
                                                </div>
                                            </div>

                                            {conv.unread_count > 0 && (
                                                <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#1f6eff] px-1 text-[10px] font-bold text-white">
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
                    <div className="flex flex-col md:col-span-8 bg-slate-950/20">
                        {activeConversationId && otherUser ? (
                            <>
                                {/* Active Chat Top Bar */}
                                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-slate-800 text-xs font-bold text-[#8acbff]">
                                            {otherUser.avatar ? (
                                                <img src={otherUser.avatar} alt={otherUser.name} className="h-full w-full object-cover" />
                                            ) : (
                                                otherUser.name?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-white">{otherUser.name}</h3>
                                            <span className="text-[11px] text-slate-400 capitalize">
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
                                                                ? 'rounded-br-xs bg-gradient-to-r from-[#1f6eff] to-[#38bdf8] text-white shadow-md'
                                                                : 'rounded-bl-xs border border-white/10 bg-white/[0.08] text-slate-100 backdrop-blur-md'
                                                        }`}
                                                    >
                                                        <p className="leading-relaxed">{msg.body}</p>
                                                        <div
                                                            className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                                                                isMine ? 'text-white/70' : 'text-slate-400'
                                                            }`}
                                                        >
                                                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            {isMine && (
                                                                msg.read_at ? <CheckCheck className="h-3 w-3 text-white" /> : <Check className="h-3 w-3" />
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
                                    className="border-t border-white/10 bg-white/[0.02] p-3 backdrop-blur-sm sm:p-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            placeholder="Type your reply here..."
                                            className="flex-1 rounded-xl border border-white/15 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#3b82f6] focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!inputMessage.trim() || sending}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] text-white shadow-md transition hover:scale-105 disabled:opacity-40"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-slate-400">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-500">
                                    <MessageSquare className="h-7 w-7" />
                                </div>
                                <h3 className="text-sm font-bold text-white">Select a conversation</h3>
                                <p className="mt-1 max-w-xs text-xs">
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
