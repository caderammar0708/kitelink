import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Bell,
    Briefcase,
    CalendarCheck,
    Check,
    CheckCheck,
    DollarSign,
    Info,
    MessageSquare,
    Star,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface NotificationItem {
    id: string;
    type: string;
    data: {
        title?: string;
        message?: string;
        link?: string;
        type?: string;
    };
    read_at?: string;
    created_at: string;
}

interface NotificationsProps {
    notifications?: NotificationItem[];
    unreadCount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
    {
        title: 'Notifications',
        href: '/instructor/notifications',
    },
];

export default function Notifications({ notifications = [], unreadCount = 0 }: NotificationsProps) {
    const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

    const handleMarkAllRead = () => {
        router.post(route('instructor.notifications.read'), {}, { preserveScroll: true });
    };

    const handleMarkSingleRead = (id: string) => {
        router.post(route('instructor.notifications.read'), { ids: [id] }, { preserveScroll: true });
    };

    const filtered = notifications.filter((n) => {
        if (activeFilter === 'unread') return !n.read_at;
        return true;
    });

    const getIcon = (type?: string) => {
        switch (type) {
            case 'booking':
                return <CalendarCheck className="h-4 w-4 text-[#5bb4ff]" />;
            case 'message':
                return <MessageSquare className="h-4 w-4 text-[#38bdf8]" />;
            case 'payout':
                return <DollarSign className="h-4 w-4 text-emerald-400" />;
            case 'hire_request':
                return <Briefcase className="h-4 w-4 text-sky-400" />;
            case 'review':
                return <Star className="h-4 w-4 text-amber-400" />;
            default:
                return <Bell className="h-4 w-4 text-[#5bb4ff]" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Notifications - KiteLink" />

            <div className="relative mx-auto min-h-full max-w-4xl space-y-6 p-4 text-slate-800 selection:bg-blue-600/30 selection:text-blue-900 dark:text-slate-100 dark:selection:bg-[#3b82f6]/30 dark:selection:text-white sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            <Bell className="h-7 w-7 text-blue-600 dark:text-[#5bb4ff]" />
                            System Notifications
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                            Stay up to date with new lesson bookings, student messages, school contracts, and automated payouts
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/15"
                        >
                            <CheckCheck className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                            Mark All as Read ({unreadCount})
                        </button>
                    )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-white/10">
                    <button
                        type="button"
                        onClick={() => setActiveFilter('all')}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeFilter === 'all'
                                ? 'bg-blue-600 text-white shadow-sm dark:bg-[#1f6eff]'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        All Notifications ({notifications.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('unread')}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                            activeFilter === 'unread'
                                ? 'bg-blue-600 text-white shadow-sm dark:bg-[#1f6eff]'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        Unread Only ({unreadCount})
                    </button>
                </div>

                {/* Notifications List */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center dark:border-white/10 dark:bg-slate-950/20">
                        <Bell className="mx-auto mb-3 h-10 w-10 text-slate-400 dark:text-slate-600" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No notifications</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {activeFilter === 'unread'
                                ? 'You have caught up with all your unread alerts.'
                                : 'You currently have no new notifications.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((item) => {
                            const isUnread = !item.read_at;

                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-start justify-between gap-4 rounded-2xl border p-4 transition ${
                                        isUnread
                                            ? 'border-blue-200 bg-blue-50/70 shadow-sm dark:border-[#5bb4ff]/30 dark:bg-[#1f6eff]/10 dark:backdrop-blur-xl'
                                            : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:opacity-80 dark:hover:opacity-100'
                                    }`}
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-xs dark:border-white/15 dark:bg-slate-900/80 dark:shadow-md">
                                            {getIcon(item.data.type)}
                                        </div>

                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">
                                                {item.data.title || 'KiteLink Alert'}
                                            </h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-300">
                                                {item.data.message || 'You have a new update regarding your instructor account.'}
                                            </p>
                                            <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                <span>{new Date(item.created_at).toLocaleString()}</span>
                                                {item.data.link && (
                                                    <Link
                                                        href={item.data.link}
                                                        className="font-semibold text-blue-600 hover:underline dark:text-[#5bb4ff]"
                                                    >
                                                        View Details →
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isUnread && (
                                        <button
                                            type="button"
                                            onClick={() => handleMarkSingleRead(item.id)}
                                            className="rounded-lg p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                            title="Mark as read"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
