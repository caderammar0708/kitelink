import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Calendar,
    CalendarCheck,
    Check,
    CheckCircle2,
    Clock,
    DollarSign,
    Filter,
    Mail,
    Phone,
    Search,
    User,
    Users,
    X,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';

interface Client {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    profile_picture?: string | null;
}

interface InstructorSummary {
    id: number;
    user?: {
        id: number;
        name: string;
        profile_picture?: string | null;
    };
}

interface BookingItem {
    id: number;
    date: string;
    time?: string | null;
    students_count?: number;
    lesson_type?: string | null;
    total_price?: number | null;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | string;
    notes?: string | null;
    cancellation_reason?: string | null;
    student?: Client;
    instructor?: InstructorSummary;
}

interface BookingsProps {
    school: {
        id: number;
        name: string;
    };
    bookings: {
        data: BookingItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    instructors: InstructorSummary[];
    counts: {
        all: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
    filters: {
        tab: string;
        instructor?: string | null;
        search?: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'School Dashboard', href: '/school/dashboard' },
    { title: 'School Bookings', href: '/school/bookings' },
];

export default function Bookings({ school, bookings, instructors, counts, filters }: BookingsProps) {
    const [currentTab, setCurrentTab] = useState(filters.tab || 'all');
    const [instructorFilter, setInstructorFilter] = useState(filters.instructor || '');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Cancel modal state
    const [bookingToCancel, setBookingToCancel] = useState<BookingItem | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    const applyFilter = (newTab?: string, newInstructor?: string, newSearch?: string) => {
        router.get(
            '/school/bookings',
            {
                tab: newTab ?? currentTab,
                instructor: newInstructor ?? instructorFilter,
                search: newSearch ?? searchQuery,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleTabChange = (t: string) => {
        setCurrentTab(t);
        applyFilter(t, instructorFilter, searchQuery);
    };

    const handleInstructorChange = (instId: string) => {
        setInstructorFilter(instId);
        applyFilter(currentTab, instId, searchQuery);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter(currentTab, instructorFilter, searchQuery);
    };

    const handleUpdateStatus = (bookingId: number, status: 'confirmed' | 'completed') => {
        router.post(
            `/school/bookings/${bookingId}/status`,
            { status },
            { preserveScroll: true }
        );
    };

    const handleCancelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bookingToCancel) return;

        setIsCancelling(true);
        router.post(
            `/school/bookings/${bookingToCancel.id}/status`,
            {
                status: 'cancelled',
                cancellation_reason: cancelReason,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsCancelling(false);
                    setBookingToCancel(null);
                    setCancelReason('');
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="School Bookings - KiteLink" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header */}
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300">
                        <CalendarCheck className="h-3.5 w-3.5" />
                        School-Wide Bookings
                    </div>
                    <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                        All School Bookings
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        View and manage lessons booked across all coaches on the {school.name} roster.
                    </p>
                </div>

                {/* Filters & Tabs Bar */}
                <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between dark:border-white/10 dark:bg-[#0c1220]">
                    {/* Status Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-100 p-1 dark:bg-white/5">
                        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((tabKey) => {
                            const count = counts[tabKey] || 0;
                            const isActive = currentTab === tabKey;

                            return (
                                <button
                                    key={tabKey}
                                    type="button"
                                    onClick={() => handleTabChange(tabKey)}
                                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition ${
                                        isActive
                                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    <span>{tabKey}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                                            isActive
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
                                                : 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-400'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Instructor dropdown filter & search */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Instructor dropdown */}
                        <div className="relative min-w-[180px]">
                            <select
                                value={instructorFilter}
                                onChange={(e) => handleInstructorChange(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                            >
                                <option value="">All Coaches on Roster</option>
                                {instructors.map((inst) => (
                                    <option key={inst.id} value={inst.id}>
                                        Coach: {inst.user?.name ?? `Instructor #${inst.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative min-w-[200px]">
                            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search student or lesson..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                            />
                        </form>
                    </div>
                </div>

                {/* Bookings Cards Listing */}
                {bookings.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-white/10">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-4 dark:bg-white/5 dark:text-purple-400">
                            <CalendarCheck className="h-8 w-8" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            No Bookings Found
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                            There are no bookings matching the selected filters in your school calendar.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3.5">
                        {bookings.data.map((booking) => {
                            const studentName = booking.student?.name ?? 'Student';
                            const coachName = booking.instructor?.user?.name ?? 'Assigned Coach';
                            const isPending = booking.status === 'pending';
                            const isConfirmed = booking.status === 'confirmed';
                            const isCompleted = booking.status === 'completed';
                            const isCancelled = booking.status === 'cancelled';

                            return (
                                <div
                                    key={booking.id}
                                    className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-slate-300 dark:border-white/10 dark:bg-[#0c1220]"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        {/* Student & Coach info */}
                                        <div className="flex items-start gap-3.5">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-base font-bold text-white shadow-sm">
                                                {studentName.charAt(0)}
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                                        {studentName}
                                                    </h3>

                                                    {/* Status Badge */}
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                                                            isPending
                                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                                : isConfirmed
                                                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                                  : isCompleted
                                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                                                        }`}
                                                    >
                                                        {booking.status}
                                                    </span>

                                                    {/* Assigned Coach Pill */}
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/30 dark:text-purple-300">
                                                        <User className="h-3 w-3" />
                                                        Coach: {coachName}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                                    {booking.student?.email && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Mail className="h-3 w-3 text-slate-400" />
                                                            {booking.student.email}
                                                        </span>
                                                    )}
                                                    {booking.student?.phone && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Phone className="h-3 w-3 text-slate-400" />
                                                            {booking.student.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lesson Specs & Price */}
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm">
                                            <div>
                                                <span className="block text-slate-400 text-[11px]">Date & Time</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                                    {booking.date} {booking.time ? `@ ${booking.time}` : ''}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="block text-slate-400 text-[11px]">Lesson Type</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {booking.lesson_type || 'Private Coaching'}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="block text-slate-400 text-[11px]">Price</span>
                                                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                                    ${booking.total_price ?? 0}
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 pt-1 lg:pt-0">
                                                {isPending && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                                        className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-500"
                                                    >
                                                        <Check className="h-3.5 w-3.5" />
                                                        Confirm
                                                    </button>
                                                )}

                                                {isConfirmed && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500"
                                                    >
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Mark Completed
                                                    </button>
                                                )}

                                                {!isCancelled && !isCompleted && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setBookingToCancel(booking)}
                                                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cancellation Reason alert if cancelled */}
                                    {isCancelled && booking.cancellation_reason && (
                                        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-800 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-300">
                                            <strong>Cancellation Reason:</strong> {booking.cancellation_reason}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Cancel Booking Modal */}
            {bookingToCancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Cancel Booking?
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Provide a reason for the client regarding this cancellation (e.g. no wind, stormy conditions, instructor illness).
                        </p>

                        <form onSubmit={handleCancelSubmit} className="mt-4 space-y-3">
                            <textarea
                                rows={3}
                                required
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Explain reason for cancellation..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-rose-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                            />

                            <div className="flex justify-end gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setBookingToCancel(null)}
                                    className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
                                >
                                    Go Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCancelling}
                                    className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-sm disabled:opacity-50"
                                >
                                    {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
