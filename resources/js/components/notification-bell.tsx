import { type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Bell, Briefcase, Calendar, Check, MessageSquare, Star, Wind } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export interface NotificationItem {
    id: string;
    type: string;
    data: {
        type?: string;
        title?: string;
        message?: string;
        link?: string;
        [key: string]: unknown;
    };
    read_at: string | null;
    created_at: string;
    created_at_human: string;
}

export function NotificationBell({ className = '' }: { className?: string }) {
    const { auth } = usePage<SharedData>().props;
    const soundEnabled = auth?.user?.notification_sound_enabled !== false;

    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [isMarkingAll, setIsMarkingAll] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const knownIdsRef = useRef<Set<string>>(new Set());
    const isFirstFetchRef = useRef(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Helper to get request headers with CSRF tokens
    const getHeaders = (): Record<string, string> => {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        };

        const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        if (metaTag && metaTag.content) {
            headers['X-CSRF-TOKEN'] = metaTag.content;
        }

        const match = document.cookie.match(new RegExp('(^|;\\s*)XSRF-TOKEN=([^;]+)'));
        if (match) {
            headers['X-XSRF-TOKEN'] = decodeURIComponent(match[2]);
        }

        return headers;
    };

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio('/sounds/notification.mp3');
        audioRef.current.volume = 0.5;
    }, []);

    // Helper to play notification sound
    const playChime = () => {
        if (!soundEnabled) return;
        try {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {
                    // Browser autoplay policy might prevent play until user interaction
                });
            }
        } catch {
            // Ignore audio error
        }
    };

    // Fetch notifications from backend
    const fetchNotifications = async () => {
        try {
            const res = await fetch(`/notifications?_t=${Date.now()}`, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    Pragma: 'no-cache',
                },
            });

            if (!res.ok) return;

            const data = await res.json();
            const fetchedList: NotificationItem[] = data.notifications || [];

            // Detect if any new unread notification has arrived
            let hasNewArrival = false;
            if (!isFirstFetchRef.current) {
                for (const item of fetchedList) {
                    if (!knownIdsRef.current.has(item.id) && !item.read_at) {
                        hasNewArrival = true;
                        break;
                    }
                }
            }

            // Update known IDs
            for (const item of fetchedList) {
                knownIdsRef.current.add(item.id);
            }

            setNotifications(fetchedList);
            const serverHasUnread = data.has_unread ?? fetchedList.some((n) => !n.read_at);
            setHasUnread(serverHasUnread);

            if (hasNewArrival) {
                playChime();
            }

            isFirstFetchRef.current = false;
        } catch {
            // Background fetch error - silent retry
        }
    };

    // Initial fetch and poll every 25 seconds
    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 25000);

        return () => clearInterval(interval);
    }, [soundEnabled]);

    // Listen to Inertia finish navigation event to automatically sync read states
    useEffect(() => {
        const unregister = router.on('finish', () => {
            fetchNotifications();
        });
        return () => unregister();
    }, []);

    // Re-fetch when tab becomes visible again
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchNotifications();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    // Toggle dropdown open/close and re-fetch if opening
    const toggleOpen = () => {
        const next = !open;
        setOpen(next);
        if (next) {
            fetchNotifications();
        }
    };

    // Mark single notification as read & navigate
    const handleNotificationClick = async (item: NotificationItem) => {
        setOpen(false);

        // Optimistically mark as read in local state immediately
        const nextList = notifications.map((n) =>
            n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n,
        );
        setNotifications(nextList);
        setHasUnread(nextList.some((n) => !n.read_at));

        if (!item.read_at) {
            try {
                await fetch(`/notifications/${item.id}/read`, {
                    method: 'POST',
                    headers: getHeaders(),
                    keepalive: true,
                });
            } catch (err) {
                console.error('Failed to mark notification as read:', err);
            }
        }

        const targetLink = item.data.link;
        if (targetLink) {
            router.visit(targetLink);
        }
    };

    // Mark all as read
    const handleMarkAllAsRead = async () => {
        setIsMarkingAll(true);
        // Optimistically mark all as read immediately
        const nextList = notifications.map((n) => ({
            ...n,
            read_at: new Date().toISOString(),
        }));
        setNotifications(nextList);
        setHasUnread(false);

        try {
            await fetch('/notifications/read-all', {
                method: 'POST',
                headers: getHeaders(),
                keepalive: true,
            });
            // Re-sync with server
            await fetchNotifications();
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        } finally {
            setIsMarkingAll(false);
        }
    };

    // Render type-specific icon
    const renderIcon = (type?: string) => {
        switch (type) {
            case 'message':
                return (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
                        <MessageSquare className="h-4 w-4" />
                    </div>
                );
            case 'booking':
                return (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                        <Calendar className="h-4 w-4" />
                    </div>
                );
            case 'review':
                return (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                        <Star className="h-4 w-4 fill-amber-400/30" />
                    </div>
                );
            case 'hire_request':
                return (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                        <Briefcase className="h-4 w-4" />
                    </div>
                );
            default:
                return (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                        <Bell className="h-4 w-4" />
                    </div>
                );
        }
    };

    return (
        <div ref={dropdownRef} className={`relative inline-block ${className}`}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={toggleOpen}
                className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus:outline-none"
                aria-label="View notifications"
            >
                <Bell className="h-4 w-4" />

                {/* Red Pulse Dot for Unread Notifications */}
                {hasUnread && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-[#070b12]" />
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-[#0c1220]/95 p-0 shadow-2xl backdrop-blur-2xl ring-1 ring-black/40 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">Notifications</span>
                            {hasUnread && (
                                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                                    New
                                </span>
                            )}
                        </div>

                        {hasUnread && (
                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                disabled={isMarkingAll}
                                className="flex cursor-pointer items-center gap-1 text-[11px] font-medium text-slate-400 transition hover:text-sky-400 disabled:opacity-50"
                            >
                                <Check className="h-3 w-3" />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[380px] divide-y divide-white/5 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-400 mb-2">
                                    <Wind className="h-5 w-5" />
                                </div>
                                <p className="text-xs font-medium text-slate-300">No notifications yet</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    We'll notify you here when bookings, messages, or updates arrive.
                                </p>
                            </div>
                        ) : (
                            notifications.map((item) => {
                                const isUnread = !item.read_at;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleNotificationClick(item)}
                                        className={`flex w-full cursor-pointer items-start gap-3 p-3.5 text-left transition ${
                                            isUnread
                                                ? 'border-l-2 border-[#3b82f6] bg-blue-500/[0.08] hover:bg-blue-500/[0.14]'
                                                : 'opacity-75 hover:opacity-100 hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        {renderIcon(item.data.type || item.type)}

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p
                                                    className={`truncate text-xs ${
                                                        isUnread ? 'font-semibold text-white' : 'font-medium text-slate-300'
                                                    }`}
                                                >
                                                    {item.data.title || 'Notification'}
                                                </p>
                                                {isUnread && (
                                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                                                )}
                                            </div>

                                            <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-400 leading-relaxed">
                                                {item.data.message || ''}
                                            </p>

                                            <p className="mt-1 text-[10px] text-slate-500">
                                                {item.created_at_human}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
