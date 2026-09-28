import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowUpRight,
    Award,
    Building2,
    Calendar,
    CalendarCheck,
    CheckCircle2,
    ChevronRight,
    DollarSign,
    GraduationCap,
    MessageSquare,
    Settings,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Star,
    TrendingUp,
    UserCheck,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';

interface Stats {
    total_instructors: number;
    total_schools: number;
    total_clients: number;
    pending_approvals: number;
    total_bookings: number;
    monthly_bookings: number;
    monthly_revenue: number;
    total_revenue: number;
}

interface ChartMonth {
    month: string;
    bookings: number;
    revenue: number;
}

interface SignupMonth {
    month: string;
    signups: number;
}

interface TopInstructor {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    location: string | null;
    bookings_count: number;
    status: string;
    hourly_rate: number | null;
}

interface Registration {
    id: number;
    name: string;
    email: string;
    role: string;
    is_suspended: boolean;
    created_at: string;
    profile_picture: string | null;
}

interface BookingItem {
    id: number;
    date: string;
    time: string;
    lesson_type: string;
    total_price: number;
    status: string;
    student?: {
        name: string;
        email: string;
        profile_picture: string | null;
    };
    instructor?: {
        user?: {
            name: string;
        };
    };
}

interface ReviewItem {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    student?: {
        name: string;
        profile_picture: string | null;
    };
    instructor?: {
        user?: {
            name: string;
        };
    };
}

interface PendingItem {
    id: number;
    status: string;
    name?: string;
    location?: string;
    created_at: string;
    user?: {
        name: string;
        email: string;
        profile_picture: string | null;
    };
}

interface DashboardProps {
    stats: Stats;
    charts: {
        bookings_chart: ChartMonth[];
        signups_chart: SignupMonth[];
        top_instructors: TopInstructor[];
    };
    recent: {
        registrations: Registration[];
        bookings: BookingItem[];
        reviews: ReviewItem[];
        pending_instructors: PendingItem[];
        pending_schools: PendingItem[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
];

export default function AdminDashboard({ stats, charts, recent }: DashboardProps) {
    const [chartMode, setChartMode] = useState<'bookings' | 'revenue'>('bookings');

    // Chart scale calculations
    const maxBookings = Math.max(...charts.bookings_chart.map((c) => c.bookings), 5);
    const maxRevenue = Math.max(...charts.bookings_chart.map((c) => c.revenue), 500);
    const maxSignups = Math.max(...charts.signups_chart.map((c) => c.signups), 5);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard - KiteLink" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Admin Welcome Hero */}
                <div className="relative overflow-hidden rounded-3xl border border-indigo-200/60 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 shadow-xl sm:p-8 dark:border-white/10 dark:shadow-2xl">
                    <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-300">
                                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                                KiteLink Platform Administration
                            </div>
                            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                Welcome to the Admin Control Center
                            </h1>
                            <p className="text-sm leading-relaxed text-slate-300">
                                Monitor platform health, verify instructor and school credentials, manage bookings, and moderate the global kitesurfing network.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/admin/approvals"
                                className="relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] sm:text-sm"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Review Approvals
                                {stats.pending_approvals > 0 && (
                                    <span className="ml-1 inline-flex h-5 items-center justify-center rounded-full bg-white px-2 text-xs font-extrabold text-amber-700">
                                        {stats.pending_approvals}
                                    </span>
                                )}
                            </Link>

                            <Link
                                href="/admin/settings"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:text-sm"
                            >
                                <Settings className="h-4 w-4" />
                                Platform Settings
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stat Cards Grid (6 Main Stat Cards) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {/* 1. Pending Approvals (Highlighted) */}
                    <Link
                        href="/admin/approvals"
                        className={`group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 ${
                            stats.pending_approvals > 0
                                ? 'border-amber-300 bg-amber-50/90 text-amber-950 hover:border-amber-400 hover:shadow-amber-500/10 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 dark:hover:border-amber-400/50'
                                : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-white/10 dark:bg-[#0c1220]'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Pending Approvals
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                <ShieldAlert className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                {stats.pending_approvals}
                            </span>
                            {stats.pending_approvals > 0 && (
                                <span className="flex h-2 w-2">
                                    <span className="h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                </span>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                            Requires review &rarr;
                        </p>
                    </Link>

                    {/* 2. Total Instructors */}
                    <Link
                        href="/admin/instructors"
                        className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 dark:border-white/10 dark:bg-[#0c1220]"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Instructors
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
                                <GraduationCap className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                            {stats.total_instructors}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Registered instructors
                        </p>
                    </Link>

                    {/* 3. Total Schools */}
                    <Link
                        href="/admin/schools"
                        className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-purple-400 dark:border-white/10 dark:bg-[#0c1220]"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Kite Schools
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                                <Building2 className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                            {stats.total_schools}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Affiliated centers
                        </p>
                    </Link>

                    {/* 4. Total Clients */}
                    <Link
                        href="/admin/clients"
                        className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-400 dark:border-white/10 dark:bg-[#0c1220]"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Clients / Students
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                            {stats.total_clients}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Active learners
                        </p>
                    </Link>

                    {/* 5. Total Bookings */}
                    <Link
                        href="/admin/bookings"
                        className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-400 dark:border-white/10 dark:bg-[#0c1220]"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Total Bookings
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
                                <CalendarCheck className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                            {stats.total_bookings}
                        </div>
                        <p className="mt-1 text-xs text-sky-600 dark:text-sky-400">
                            {stats.monthly_bookings} this month
                        </p>
                    </Link>

                    {/* 6. Monthly / Total Revenue */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Monthly Volume
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400">
                                <DollarSign className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-white">
                            ${stats.monthly_revenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Total: ${stats.total_revenue.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Urgent Approvals Callout (if any pending) */}
                {stats.pending_approvals > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-amber-900 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold">
                                    {stats.pending_approvals} Application{stats.pending_approvals > 1 ? 's' : ''} Awaiting Approval
                                </h2>
                                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                                    New instructors and schools cannot receive bookings or appear in search until reviewed.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin/approvals"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700"
                        >
                            Open Approvals Queue &rarr;
                        </Link>
                    </div>
                )}

                {/* Charts Row */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Chart 1: Bookings & Revenue per Month */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Bookings & Revenue History
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Monthly volume trends across the platform
                                </p>
                            </div>

                            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
                                <button
                                    type="button"
                                    onClick={() => setChartMode('bookings')}
                                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                                        chartMode === 'bookings'
                                            ? 'bg-white text-blue-600 shadow-sm dark:bg-blue-600 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    Bookings
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setChartMode('revenue')}
                                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                                        chartMode === 'revenue'
                                            ? 'bg-white text-blue-600 shadow-sm dark:bg-blue-600 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    Revenue ($)
                                </button>
                            </div>
                        </div>

                        {/* Interactive Bar Chart Representation */}
                        <div className="mt-6 flex h-52 items-end justify-between gap-3 px-2">
                            {charts.bookings_chart.map((item) => {
                                const val = chartMode === 'bookings' ? item.bookings : item.revenue;
                                const max = chartMode === 'bookings' ? maxBookings : maxRevenue;
                                const pct = Math.max(Math.round((val / max) * 100), 8);

                                return (
                                    <div key={item.month} className="group relative flex flex-1 flex-col items-center">
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold text-white shadow-lg whitespace-nowrap z-20 dark:bg-white dark:text-slate-900">
                                            {chartMode === 'bookings' ? `${val} bookings` : `$${val.toLocaleString()}`}
                                        </div>

                                        {/* Bar */}
                                        <div
                                            style={{ height: `${pct}%` }}
                                            className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-300 group-hover:from-blue-500 group-hover:to-indigo-400"
                                        />

                                        {/* Label */}
                                        <span className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-full">
                                            {item.month.split(' ')[0]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chart 2: New Signups per Month */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="border-b border-slate-100 pb-4 dark:border-white/5">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                New User Registrations
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Client, instructor, and school signups past 6 months
                            </p>
                        </div>

                        {/* Signups Bars */}
                        <div className="mt-6 flex h-52 items-end justify-between gap-3 px-2">
                            {charts.signups_chart.map((item) => {
                                const pct = Math.max(Math.round((item.signups / maxSignups) * 100), 8);

                                return (
                                    <div key={item.month} className="group relative flex flex-1 flex-col items-center">
                                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-bold text-white shadow-lg whitespace-nowrap z-20 dark:bg-white dark:text-slate-900">
                                            {item.signups} users
                                        </div>

                                        <div
                                            style={{ height: `${pct}%` }}
                                            className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-emerald-600 to-teal-400 transition-all duration-300 group-hover:from-emerald-500 group-hover:to-teal-300"
                                        />

                                        <span className="mt-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-full">
                                            {item.month.split(' ')[0]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Top Instructors & Recent Activities Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Top Instructors Leaderboard */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-1 dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/5">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Top Instructors
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    By completed & confirmed bookings
                                </p>
                            </div>
                            <Link href="/admin/instructors" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                View all
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100 dark:divide-white/5">
                            {charts.top_instructors.length === 0 ? (
                                <p className="py-6 text-center text-xs text-slate-500">No instructor bookings recorded yet.</p>
                            ) : (
                                charts.top_instructors.map((inst, index) => (
                                    <div key={inst.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-300">
                                                {index + 1}
                                            </span>
                                            {inst.avatar ? (
                                                <img src={inst.avatar} alt={inst.name} className="h-9 w-9 rounded-full object-cover" />
                                            ) : (
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                    {inst.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                                                    {inst.name}
                                                </p>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                                                    {inst.location || 'Location unset'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                {inst.bookings_count} bookings
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Latest Bookings */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-1 dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/5">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Latest Bookings
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Recent platform lesson activity
                                </p>
                            </div>
                            <Link href="/admin/bookings" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                View all
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100 dark:divide-white/5">
                            {recent.bookings.length === 0 ? (
                                <p className="py-6 text-center text-xs text-slate-500">No bookings yet.</p>
                            ) : (
                                recent.bookings.map((b) => (
                                    <div key={b.id} className="py-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                {b.student?.name || 'Client'} &rarr; {b.instructor?.user?.name || 'Instructor'}
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {b.date} • {b.lesson_type || 'Standard Lesson'}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                b.status === 'confirmed'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                    : b.status === 'completed'
                                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                      : b.status === 'cancelled'
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                                            }`}>
                                                {b.status}
                                            </span>
                                            <p className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                                                ${b.total_price}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* New Registrations & Reviews Tabs */}
                    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-1 dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/5">
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Newest Registrations
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Latest community signups
                                </p>
                            </div>
                            <Link href="/admin/clients" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                Directory
                            </Link>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100 dark:divide-white/5">
                            {recent.registrations.map((u) => (
                                <div key={u.id} className="flex items-center justify-between py-2.5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                                                {u.name}
                                            </p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                                                {u.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            u.role === 'instructor'
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                                : u.role === 'school'
                                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                                                  : u.role === 'admin'
                                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                                                    : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
