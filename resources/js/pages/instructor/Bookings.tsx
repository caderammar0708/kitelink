import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    CalendarCheck,
    CheckCircle2,
    Clock,
    DollarSign,
    Filter,
    Mail,
    MapPin,
    MessageSquare,
    Search,
    User,
    Users,
    Wind,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface Client {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
}

interface Booking {
    id: number;
    student_id?: number;
    student?: Client;
    date: string;
    time?: string;
    students_count?: number;
    lesson_type?: string;
    total_price?: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | string;
    notes?: string;
    location?: string;
}

interface BookingsProps {
    bookings?: Booking[];
    tab: 'pending' | 'upcoming' | 'completed' | 'cancelled';
    counts: {
        pending: number;
        upcoming: number;
        completed: number;
        cancelled: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
    {
        title: 'Bookings Management',
        href: '/instructor/bookings',
    },
];

export default function Bookings({ bookings = [], tab = 'pending', counts }: BookingsProps) {
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleTabChange = (newTab: string) => {
        router.get(route('instructor.bookings'), { tab: newTab }, { preserveState: true });
    };

    const handleAccept = (bookingId: number) => {
        setActionLoading(bookingId);
        router.post(
            route('instructor.bookings.accept', bookingId),
            {},
            {
                preserveScroll: true,
                onFinish: () => setActionLoading(null),
            }
        );
    };

    const handleDecline = (bookingId: number) => {
        setActionLoading(bookingId);
        router.post(
            route('instructor.bookings.decline', bookingId),
            {},
            {
                preserveScroll: true,
                onFinish: () => setActionLoading(null),
            }
        );
    };

    const filteredBookings = bookings.filter((b) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
            b.student?.name?.toLowerCase().includes(q) ||
            b.student?.email?.toLowerCase().includes(q) ||
            b.lesson_type?.toLowerCase().includes(q) ||
            b.date?.includes(q)
        );
    });

    const tabs = [
        { key: 'pending', label: 'Pending Requests', count: counts.pending, color: 'text-amber-400' },
        { key: 'upcoming', label: 'Upcoming Confirmed', count: counts.upcoming, color: 'text-blue-400' },
        { key: 'completed', label: 'Completed Lessons', count: counts.completed, color: 'text-emerald-400' },
        { key: 'cancelled', label: 'Cancelled', count: counts.cancelled, color: 'text-rose-400' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Instructor Bookings - KiteLink" />

            <div className="relative min-h-full space-y-6 p-4 text-slate-800 selection:bg-blue-600/30 selection:text-blue-900 dark:text-slate-100 dark:selection:bg-[#3b82f6]/30 dark:selection:text-white sm:p-6 lg:p-8">
                {/* Header Banner */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            <CalendarCheck className="h-7 w-7 text-blue-600 dark:text-[#5bb4ff]" />
                            Bookings Management
                        </h1>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                            Manage lesson requests, review student details, and track your completed kitesurfing sessions
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/instructor/availability"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.12]"
                        >
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                            Open Calendar Dates
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 dark:border-white/10">
                    {tabs.map((t) => {
                        const isActive = tab === t.key;
                        return (
                            <button
                                type="button"
                                key={t.key}
                                onClick={() => handleTabChange(t.key)}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm cursor-pointer ${
                                    isActive
                                        ? 'border border-blue-200 bg-blue-50 text-blue-700 shadow-sm dark:border-[#5bb4ff]/40 dark:bg-[#1f6eff]/20 dark:text-white'
                                        : 'border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.04] dark:hover:text-slate-200'
                                }`}
                            >
                                <span>{t.label}</span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                        isActive ? 'bg-blue-100 text-blue-700 dark:bg-[#5bb4ff]/30 dark:text-white' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400'
                                    }`}
                                >
                                    {t.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by student, email, date, lesson type..."
                            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-900 placeholder-slate-400 shadow-xs focus:border-blue-600 focus:outline-none dark:border-white/10 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500"
                        />
                    </div>

                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Showing {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
                    </span>
                </div>

                {/* Bookings List Cards */}
                {filteredBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-16 text-center shadow-xs dark:border-white/10 dark:bg-slate-950/20">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 shadow-sm dark:border-[#5bb4ff]/30 dark:bg-gradient-to-br dark:from-[#1f6eff]/20 dark:to-[#5bb4ff]/10 dark:text-[#5bb4ff]">
                            <CalendarCheck className="h-7 w-7" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No {tab} bookings found</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {tab === 'pending'
                                ? 'You have responded to all incoming student inquiries.'
                                : `No bookings currently in the ${tab} state.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => {
                            const isPending = booking.status === 'pending';
                            const isUpcoming = booking.status === 'confirmed';

                            return (
                                <div
                                    key={booking.id}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:hover:border-white/20 dark:hover:bg-white/[0.07] sm:p-6"
                                >
                                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                                        {/* Left: Student Info & Lesson Details */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-sm font-bold text-blue-600 shadow-sm dark:border-white/15 dark:bg-slate-800 dark:text-[#8acbff]">
                                                {booking.student?.profile_picture ? (
                                                    <img
                                                        src={booking.student.profile_picture}
                                                        alt={booking.student?.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    booking.student?.name?.charAt(0) || 'S'
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                        {booking.student?.name || 'Student Rider'}
                                                    </h3>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        ({booking.student?.email || 'email not provided'})
                                                    </span>
                                                    <span
                                                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                            isPending
                                                                ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300'
                                                                : isUpcoming
                                                                  ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300'
                                                                  : booking.status === 'completed'
                                                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300'
                                                                    : 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-300'
                                                        }`}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                                                    <span className="flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                                                        <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                                        <strong>{booking.date}</strong>
                                                    </span>
                                                    {booking.time && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                                            {booking.time}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Wind className="h-3.5 w-3.5 text-sky-600 dark:text-[#38bdf8]" />
                                                        {booking.lesson_type || 'Private Coaching'}
                                                    </span>
                                                    {booking.students_count && booking.students_count > 1 && (
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3.5 w-3.5 text-blue-600 dark:text-[#8acbff]" />
                                                            {booking.students_count} Students
                                                        </span>
                                                    )}
                                                    {booking.location && (
                                                        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                                            <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                                            {booking.location}
                                                        </span>
                                                    )}
                                                </div>

                                                {booking.notes && (
                                                    <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700 dark:border-transparent dark:bg-slate-950/40 dark:text-slate-300">
                                                        <span className="font-semibold text-slate-500 dark:text-slate-400">Student Note: </span>
                                                        {booking.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Price & Action Buttons */}
                                        <div className="flex flex-col items-end justify-between gap-3 border-t border-slate-200 pt-4 dark:border-white/10 lg:border-t-0 lg:pt-0">
                                            <div className="text-right">
                                                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                                                    Session Total
                                                </span>
                                                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                                    ${booking.total_price ?? 65}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link
                                                    href="/instructor/messages"
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10"
                                                >
                                                    <MessageSquare className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                                    Message
                                                </Link>

                                                {isPending && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={actionLoading === booking.id}
                                                            onClick={() => handleAccept(booking.id)}
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Accept
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={actionLoading === booking.id}
                                                            onClick={() => handleDecline(booking.id)}
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Decline
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
