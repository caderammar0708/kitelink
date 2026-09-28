import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Bell,
    Check,
    CheckCheck,
    CheckCircle2,
    Clock,
    FileCheck,
    Info,
    MessageSquare,
    Shield,
    Sparkles,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

interface NotificationItem {
    id: string;
    type: string;
    data: {
        title?: string;
        message?: string;
        link?: string;
        type?: string;
    };
    read_at?: string | null;
    created_at: string;
    created_at_human?: string;
}

interface NotificationsProps {
    notifications: {
        data: NotificationItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    unreadCount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Notifications', href: '/admin/notifications' },
];

export default function AdminNotifications({ notifications, unreadCount }: NotificationsProps) {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const handleMarkAllRead = () => {
        router.post('/notifications/read-all', {}, { preserveScroll: true });
    };

    const handleMarkSingleRead = (id: string, link?: string) => {
        router.post(`/notifications/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                if (link) router.visit(link);
            },
        });
    };

    const items = notifications.data.filter((n) => {
        if (filter === 'unread') return !n.read_at;
        return true;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Notifications - KiteLink" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Notifications
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            System alerts, registration notifications, and verification events.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                            >
                                <CheckCheck className="h-4 w-4 text-blue-500" />
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setFilter('all')}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                            filter === 'all'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        All Notifications ({notifications.total})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter('unread')}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                            filter === 'unread'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        Unread ({unreadCount})
                    </button>
                </div>

                {/* Notification List */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3 dark:bg-white/5">
                                <Bell className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No notifications found</p>
                            <p className="text-xs text-slate-500 mt-1">You are all caught up with administrative updates.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {items.map((n) => {
                                const isUnread = !n.read_at;
                                return (
                                    <div
                                        key={n.id}
                                        className={`flex items-start justify-between gap-4 p-4 transition ${
                                            isUnread
                                                ? 'bg-blue-50/50 dark:bg-blue-950/15'
                                                : 'hover:bg-slate-50/60 dark:hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                                isUnread
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                                    : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400'
                                            }`}>
                                                <Bell className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className={`text-xs sm:text-sm ${isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                                        {n.data.title || 'System Notification'}
                                                    </h3>
                                                    {isUnread && (
                                                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                                                    )}
                                                </div>

                                                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    {n.data.message || ''}
                                                </p>

                                                <span className="mt-2 block text-[10px] text-slate-400">
                                                    {n.created_at_human || new Date(n.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {n.data.link && (
                                                <Link
                                                    href={n.data.link}
                                                    onClick={() => !n.read_at && handleMarkSingleRead(n.id)}
                                                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-blue-400 dark:hover:bg-white/10"
                                                >
                                                    View &rarr;
                                                </Link>
                                            )}

                                            {isUnread && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleMarkSingleRead(n.id)}
                                                    className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
