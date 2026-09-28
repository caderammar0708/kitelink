import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CalendarCheck,
    CheckCircle2,
    DollarSign,
    Eye,
    Filter,
    GraduationCap,
    Search,
    User,
    X,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';

interface BookingItem {
    id: number;
    date: string;
    time: string;
    students_count: number;
    lesson_type: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    cancellation_reason?: string | null;
    notes?: string | null;
    created_at: string;
    student?: {
        id: number;
        name: string;
        email: string;
        profile_picture?: string | null;
    };
    instructor?: {
        id: number;
        user?: {
            id: number;
            name: string;
            email: string;
            profile_picture?: string | null;
        };
    };
    review?: {
        id: number;
        rating: number;
        comment: string;
    };
}

interface BookingsProps {
    bookings: {
        data: BookingItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    instructorsList: Array<{ id: number; name: string }>;
    filters: {
        status: string;
        search: string;
        instructor_id: string;
        start_date: string;
        end_date: string;
    };
    counts: {
        total: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Bookings', href: '/admin/bookings' },
];

export default function Bookings({ bookings, instructorsList, filters, counts }: BookingsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [instructorId, setInstructorId] = useState(filters.instructor_id || 'all');
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
    const [cancelModalBooking, setCancelModalBooking] = useState<BookingItem | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    const applyFilters = (custom?: Partial<typeof filters>) => {
        router.get(
            '/admin/bookings',
            {
                status: custom?.status ?? statusFilter,
                search: custom?.search ?? search,
                instructor_id: custom?.instructor_id ?? instructorId,
                start_date: custom?.start_date ?? startDate,
                end_date: custom?.end_date ?? endDate,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleCancelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!cancelModalBooking) return;

        setIsCancelling(true);
        router.post(
            `/admin/bookings/${cancelModalBooking.id}/cancel`,
            { reason: cancelReason },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsCancelling(false);
                    setCancelModalBooking(null);
                    setCancelReason('');
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bookings Control - KiteLink Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Bookings Management
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Monitor lesson schedules, student-instructor reservations, and handle cancellation interventions.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                            {counts.total} Bookings ({counts.confirmed} Confirmed, {counts.completed} Completed, {counts.pending} Pending)
                        </span>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Status Pills */}
                        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
                            {(['all', 'confirmed', 'completed', 'pending', 'cancelled'] as const).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter(s);
                                        applyFilters({ status: s });
                                    }}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                                        statusFilter === s
                                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Instructor Dropdown Filter */}
                        <select
                            value={instructorId}
                            onChange={(e) => {
                                setInstructorId(e.target.value);
                                applyFilters({ instructor_id: e.target.value });
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                        >
                            <option value="all">All Instructors</option>
                            {instructorsList.map((inst) => (
                                <option key={inst.id} value={inst.id}>
                                    {inst.name}
                                </option>
                            ))}
                        </select>

                        {/* Date Range Inputs */}
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>From:</span>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    applyFilters({ start_date: e.target.value });
                                }}
                                className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                            />
                            <span>To:</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    applyFilters({ end_date: e.target.value });
                                }}
                                className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="relative mt-2">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by student, instructor, or booking ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-400">
                                    <th className="py-3.5 px-4">Booking #</th>
                                    <th className="py-3.5 px-4">Student</th>
                                    <th className="py-3.5 px-4">Instructor</th>
                                    <th className="py-3.5 px-4">Date & Time</th>
                                    <th className="py-3.5 px-4">Type</th>
                                    <th className="py-3.5 px-4">Total</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs dark:divide-white/5">
                                {bookings.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-slate-500">
                                            No bookings found matching filters.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.data.map((b) => (
                                        <tr key={b.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                                                #{b.id}
                                            </td>

                                            <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                                                {b.student?.name || 'N/A'}
                                            </td>

                                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                                                {b.instructor?.user?.name || 'N/A'}
                                            </td>

                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                                                {b.date} • {b.time}
                                            </td>

                                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                                                {b.lesson_type || 'Standard'}
                                            </td>

                                            <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                                                ${b.total_price}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                                                        b.status === 'confirmed'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                            : b.status === 'completed'
                                                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                              : b.status === 'cancelled'
                                                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                    }`}
                                                >
                                                    {b.status}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedBooking(b)}
                                                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>

                                                    {b.status !== 'cancelled' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setCancelModalBooking(b);
                                                                setCancelReason('');
                                                            }}
                                                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                            title="Admin Cancel Booking"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {bookings.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-white/5">
                            <span className="text-xs text-slate-500">
                                Page {bookings.current_page} of {bookings.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {bookings.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                  ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                                                  : 'opacity-40 text-slate-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Booking #{selectedBooking.id}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setSelectedBooking(null)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 text-xs sm:text-sm">
                            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                                <div>
                                    <span className="text-slate-500">Student:</span>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {selectedBooking.student?.name}
                                    </p>
                                    <p className="text-[11px] text-slate-500">{selectedBooking.student?.email}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Instructor:</span>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {selectedBooking.instructor?.user?.name}
                                    </p>
                                    <p className="text-[11px] text-slate-500">{selectedBooking.instructor?.user?.email}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Date & Time:</span>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {selectedBooking.date} at {selectedBooking.time}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Total Price:</span>
                                    <p className="font-extrabold text-slate-900 dark:text-white text-base">
                                        ${selectedBooking.total_price}
                                    </p>
                                </div>
                            </div>

                            {selectedBooking.cancellation_reason && (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
                                    <span className="font-bold">Cancellation Reason:</span> {selectedBooking.cancellation_reason}
                                </div>
                            )}

                            {selectedBooking.notes && (
                                <div>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">Client Notes:</span>
                                    <p className="mt-1 text-slate-600 dark:text-slate-400">{selectedBooking.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedBooking(null)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {cancelModalBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
                            <h2 className="text-base font-bold text-rose-600 dark:text-rose-400">
                                Cancel Booking #{cancelModalBooking.id}
                            </h2>
                            <button
                                type="button"
                                onClick={() => setCancelModalBooking(null)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCancelSubmit} className="mt-4 space-y-4">
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                                Are you sure you want to cancel this booking between{' '}
                                <strong>{cancelModalBooking.student?.name}</strong> and{' '}
                                <strong>{cancelModalBooking.instructor?.user?.name}</strong>? Both parties will be notified.
                            </p>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Reason for cancellation (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="e.g. Cancelled due to weather advisory or student request."
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCancelModalBooking(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                                >
                                    Go Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCancelling}
                                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
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
