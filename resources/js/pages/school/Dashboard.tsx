import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Award,
    Building2,
    Calendar,
    CalendarCheck,
    CheckCircle2,
    ChevronRight,
    Clock,
    DollarSign,
    GraduationCap,
    MapPin,
    Package,
    PlusCircle,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    User,
    UserCheck,
    Users,
} from 'lucide-react';
import React from 'react';

interface SchoolData {
    id: number;
    name: string;
    location?: string | null;
    description?: string | null;
    contact_name?: string | null;
    phone?: string | null;
    website?: string | null;
    registration_number?: string | null;
    logo?: string | null;
    facilities?: string[] | null;
    gear_list?: string[] | null;
    photos?: string[] | null;
    certifications?: string | null;
    is_active?: boolean;
}

interface CoachData {
    id: number;
    bio?: string | null;
    certifications?: string | null;
    hourly_rate?: number | null;
    experience_years?: number | null;
    phone?: string | null;
    user?: {
        id: number;
        name: string;
        email: string;
        profile_picture?: string | null;
    };
}

interface BookingData {
    id: number;
    date: string;
    time?: string | null;
    lesson_type?: string | null;
    total_price?: number | null;
    status: string;
    student?: {
        name: string;
        email: string;
        profile_picture?: string | null;
    };
    instructor?: {
        user?: {
            name: string;
        };
    };
}

interface DashboardProps {
    school: SchoolData;
    stats: {
        total_instructors: number;
        total_bookings: number;
        monthly_revenue: number;
        upcoming_lessons: number;
        pending_requests: number;
        completed_lessons: number;
    };
    profileCompletion: number;
    recentBookings: BookingData[];
    rosterPreview: CoachData[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'School Dashboard', href: '/school/dashboard' },
];

export default function Dashboard({
    school,
    stats,
    profileCompletion,
    recentBookings,
    rosterPreview,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${school.name} - School Dashboard`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 p-6 shadow-sm sm:p-8 dark:border-white/10 dark:from-[#0c1220] dark:via-[#0c1220] dark:to-blue-950/20">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4 sm:gap-5">
                            {school.logo ? (
                                <img
                                    src={school.logo}
                                    alt={school.name}
                                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-purple-500/20 shadow-md"
                                />
                            ) : (
                                <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
                                    <Building2 className="h-8 w-8 sm:h-10 sm:w-10" />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        {school.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                                        <ShieldCheck className="h-3 w-3" />
                                        Verified Center
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    {school.location && (
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                            {school.location}
                                        </span>
                                    )}
                                    {school.contact_name && (
                                        <span className="inline-flex items-center gap-1">
                                            <User className="h-3.5 w-3.5 text-purple-500" />
                                            Contact: {school.contact_name}
                                        </span>
                                    )}
                                    {school.registration_number && (
                                        <span className="inline-flex items-center gap-1">
                                            Reg: {school.registration_number}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/school/instructors"
                                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-purple-500/25 transition hover:bg-purple-500 active:scale-95"
                            >
                                <Users className="h-4 w-4" />
                                Manage Instructors
                            </Link>

                            <Link
                                href="/school/profile"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                            >
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                Edit Center Profile
                            </Link>
                        </div>
                    </div>

                    {/* Profile Completeness Banner (if under 100%) */}
                    {profileCompletion < 100 && (
                        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                                        <Sparkles className="h-4 w-4 text-amber-500" />
                                        Complete your public kite center profile ({profileCompletion}%)
                                    </div>
                                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                                        Add your facilities, photos, IKO/VDWS center status, and gear list to attract more students.
                                    </p>
                                </div>
                                <Link
                                    href="/school/profile"
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700"
                                >
                                    Finish Profile &rarr;
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3 Core Stats Requested by User + Supporting Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Stat 1: Total Instructors on Roster */}
                    <Link
                        href="/school/instructors"
                        className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-purple-300 hover:shadow-md dark:border-white/10 dark:bg-[#0c1220] dark:hover:border-purple-500/30"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Instructors on Roster
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {stats.total_instructors}
                            </span>
                            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold group-hover:underline">
                                View team &rarr;
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Active coaches available for school bookings
                        </p>
                    </Link>

                    {/* Stat 2: Total Bookings across School */}
                    <Link
                        href="/school/bookings"
                        className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-[#0c1220] dark:hover:border-blue-500/30"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Total School Bookings
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                <CalendarCheck className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                {stats.total_bookings}
                            </span>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                                View all &rarr;
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Combined lessons across all school coaches
                        </p>
                    </Link>

                    {/* Stat 3: Monthly Revenue */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Monthly Revenue
                            </span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                ${stats.monthly_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                <TrendingUp className="mr-0.5 h-3.5 w-3.5" /> This month
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                            Completed lesson bookings in {new Date().toLocaleString('default', { month: 'long' })}
                        </p>
                    </div>
                </div>

                {/* Sub-metrics bar */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Upcoming Confirmed</span>
                        <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{stats.upcoming_lessons} lessons</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Pending Requests</span>
                        <div className="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">{stats.pending_requests} pending</div>
                    </div>
                    <div className="col-span-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:col-span-1 dark:border-white/10 dark:bg-[#0c1220]">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed Lessons</span>
                        <div className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed_lessons} taught</div>
                    </div>
                </div>

                {/* Main Content Split: Recent Bookings & Team Roster */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left 2 Cols: Recent Bookings Across School */}
                    <div className="space-y-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Recent School Bookings
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    All lessons booked across your school's coaching staff
                                </p>
                            </div>
                            <Link
                                href="/school/bookings"
                                className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                            >
                                View all ({stats.total_bookings}) &rarr;
                            </Link>
                        </div>

                        {recentBookings.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                <Calendar className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No bookings yet</h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    As clients book lessons with your school coaches, they will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                                <div className="divide-y divide-slate-100 dark:divide-white/5">
                                    {recentBookings.map((b) => (
                                        <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                                                    {b.student?.name ? b.student.name.charAt(0) : 'S'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                                                        {b.student?.name ?? 'Student'}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        Coach: <span className="font-semibold text-purple-600 dark:text-purple-400">{b.instructor?.user?.name ?? 'Unassigned'}</span>
                                                        {b.lesson_type && ` • ${b.lesson_type}`}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto">
                                                <div className="text-right">
                                                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                                                        {b.date} {b.time && `@ ${b.time}`}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        ${b.total_price ?? 0}
                                                    </div>
                                                </div>

                                                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                                                    b.status === 'confirmed'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                        : b.status === 'completed'
                                                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                          : b.status === 'pending'
                                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                            : 'bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-300'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Col: Team Roster Preview */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                    School Coaches
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Instructors on your team roster
                                </p>
                            </div>
                            <Link
                                href="/school/instructors"
                                className="text-xs font-bold text-purple-600 hover:underline dark:text-purple-400"
                            >
                                Manage &rarr;
                            </Link>
                        </div>

                        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                            {rosterPreview.length === 0 ? (
                                <div className="py-6 text-center">
                                    <Users className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                    <p className="text-xs text-slate-500 mb-3">
                                        You haven't added any instructors to your roster yet.
                                    </p>
                                    <Link
                                        href="/school/instructors"
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-purple-500"
                                    >
                                        <PlusCircle className="h-3.5 w-3.5" />
                                        Add First Coach
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {rosterPreview.map((coach) => (
                                        <div
                                            key={coach.id}
                                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3 transition hover:bg-slate-50 dark:border-white/5 dark:bg-white/[0.02]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-xs font-bold text-white">
                                                    {coach.user?.name ? coach.user.name.charAt(0) : 'C'}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {coach.user?.name ?? 'Coach'}
                                                    </div>
                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                                        {coach.certifications || 'Certified Instructor'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                    ${coach.hourly_rate ?? 60}/h
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-2">
                                        <Link
                                            href="/school/instructors"
                                            className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                                        >
                                            <PlusCircle className="h-3.5 w-3.5 text-purple-500" />
                                            Invite or Add Another Coach
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
