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

            <div className="relative min-h-full space-y-6 p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* Header Banner */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            <CalendarCheck className="h-7 w-7 text-[#5bb4ff]" />
                            Bookings Management
                        </h1>
                        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                            Manage lesson requests, review student details, and track your completed kitesurfing sessions
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/instructor/availability"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/[0.12]"
                        >
                            <Calendar className="h-4 w-4 text-[#5bb4ff]" />
                            Open Calendar Dates
                        </Link>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
                    {tabs.map((t) => {
                        const isActive = tab === t.key;
                        return (
                            <button
                                type="button"
                                key={t.key}
                                onClick={() => handleTabChange(t.key)}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all sm:text-sm ${
                                    isActive
                                        ? 'border border-[#5bb4ff]/40 bg-[#1f6eff]/20 text-white shadow-lg shadow-blue-600/20'
                                        : 'border border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                                }`}
                            >
                                <span>{t.label}</span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                                        isActive ? 'bg-[#5bb4ff]/30 text-white' : 'bg-white/10 text-slate-400'
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
                            className="w-full rounded-xl border border-white/10 bg-slate-950/40 py-2.5 pr-4 pl-10 text-xs text-white placeholder-slate-500 backdrop-blur-sm focus:border-[#3b82f6] focus:outline-none"
                        />
                    </div>

                    <span className="text-xs text-slate-400">
                        Showing {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
                    </span>
                </div>

                {/* Bookings List Cards */}
                {filteredBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/20 px-4 py-16 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#5bb4ff]/30 bg-gradient-to-br from-[#1f6eff]/20 to-[#5bb4ff]/10 text-[#5bb4ff]">
                            <CalendarCheck className="h-7 w-7" />
                        </div>
                        <h3 className="text-base font-bold text-white">No {tab} bookings found</h3>
                        <p className="mt-1 text-xs text-slate-400">
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
                                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.07] sm:p-6"
                                >
                                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                                        {/* Left: Student Info & Lesson Details */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-slate-800 text-sm font-bold text-[#8acbff] shadow-md">
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
                                                    <h3 className="text-base font-bold text-white">
                                                        {booking.student?.name || 'Student Rider'}
                                                    </h3>
                                                    <span className="text-xs text-slate-400">
                                                        ({booking.student?.email || 'email not provided'})
                                                    </span>
                                                    <span
                                                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                            isPending
                                                                ? 'border-amber-500/30 bg-amber-500/15 text-amber-300'
                                                                : isUpcoming
                                                                  ? 'border-blue-500/30 bg-blue-500/15 text-blue-300'
                                                                  : booking.status === 'completed'
                                                                    ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                                                                    : 'border-rose-500/30 bg-rose-500/15 text-rose-300'
                                                        }`}
                                                    >
                                                        {booking.status}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                        <strong>{booking.date}</strong>
                                                    </span>
                                                    {booking.time && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                            {booking.time}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Wind className="h-3.5 w-3.5 text-[#38bdf8]" />
                                                        {booking.lesson_type || 'Private Coaching'}
                                                    </span>
                                                    {booking.students_count && booking.students_count > 1 && (
                                                        <span className="flex items-center gap-1">
                                                            <Users className="h-3.5 w-3.5 text-[#8acbff]" />
                                                            {booking.students_count} Students
                                                        </span>
                                                    )}
                                                    {booking.location && (
                                                        <span className="flex items-center gap-1 text-slate-400">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            {booking.location}
                                                        </span>
                                                    )}
                                                </div>

                                                {booking.notes && (
                                                    <p className="mt-2 rounded-xl bg-slate-950/40 p-2.5 text-xs text-slate-300">
                                                        <span className="font-semibold text-slate-400">Student Note: </span>
                                                        {booking.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Price & Action Buttons */}
                                        <div className="flex flex-col items-end justify-between gap-3 border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0">
                                            <div className="text-right">
                                                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                    Session Total
                                                </span>
                                                <span className="text-2xl font-extrabold text-emerald-400">
                                                    ${booking.total_price ?? 65}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link
                                                    href="/instructor/messages"
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                                                >
                                                    <MessageSquare className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                    Message
                                                </Link>

                                                {isPending && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={actionLoading === booking.id}
                                                            onClick={() => handleAccept(booking.id)}
                                                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Accept
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={actionLoading === booking.id}
                                                            onClick={() => handleDecline(booking.id)}
                                                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
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
