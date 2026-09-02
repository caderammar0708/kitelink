import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    Briefcase,
    Calendar,
    CalendarCheck,
    CheckCircle2,
    Clock,
    Compass,
    DollarSign,
    GraduationCap,
    Mail,
    MapPin,
    MessageSquare,
    PlusCircle,
    Sparkles,
    Star,
    TrendingUp,
    User,
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
    lesson_type?: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | string;
    total_price?: number;
    price?: number;
    location?: string;
    notes?: string;
}

interface Stats {
    upcoming?: number;
    pending_requests?: number;
    students_taught?: number;
    average_rating?: number;
    total_bookings?: number;
    completed?: number;
    total_earnings?: number;
    monthly_revenue?: number;
    profile_completion?: number;
    hire_requests_count?: number;
}

interface InstructorData {
    id: number;
    bio?: string;
    experience_years?: number;
    location?: string;
    certifications?: string;
    hourly_rate?: number;
    daily_rate?: number;
    profile_photo?: string;
    is_freelance?: boolean;
    is_active?: boolean;
    school?: { name: string };
    user?: { name: string; email: string; profile_picture?: string };
}

interface DashboardProps {
    instructor?: InstructorData;
    bookings?: Booking[];
    stats?: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
];

export default function Dashboard({ instructor, bookings = [], stats }: DashboardProps) {
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const instructorName = instructor?.user?.name ?? 'Instructor';
    const instructorLocation = instructor?.location || 'Kalpitiya, Sri Lanka';
    const certifications = instructor?.certifications || 'IKO Certified';

    const upcomingCount = stats?.upcoming ?? bookings.filter((b) => b.status === 'confirmed').length;
    const pendingCount = stats?.pending_requests ?? bookings.filter((b) => b.status === 'pending').length;
    const monthlyRev = stats?.monthly_revenue ?? 0;
    const avgRating = stats?.average_rating ?? 4.9;
    const profileProgress = stats?.profile_completion ?? 80;

    const handleAcceptBooking = (id: number) => {
        setActionLoading(id);
        router.post(route('instructor.bookings.accept', id), {}, {
            preserveScroll: true,
            onFinish: () => setActionLoading(null),
        });
    };

    const handleDeclineBooking = (id: number) => {
        setActionLoading(id);
        router.post(route('instructor.bookings.decline', id), {}, {
            preserveScroll: true,
            onFinish: () => setActionLoading(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Instructor Dashboard - KiteLink" />

            <div className="relative min-h-full space-y-6 p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* Hero / Greeting Glass Banner */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
                    <div className="pointer-events-none absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-[#3b82f6]/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div className="flex items-center gap-4">
                            <div className="group relative">
                                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#5bb4ff]/40 bg-slate-900 shadow-[0_0_20px_rgba(91,180,255,0.25)] sm:h-20 sm:w-20">
                                    {instructor?.profile_photo || instructor?.user?.profile_picture ? (
                                        <img
                                            src={instructor.profile_photo || instructor.user?.profile_picture}
                                            alt={instructorName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="bg-gradient-to-br from-[#b8e6ff] to-[#4da6ff] bg-clip-text text-2xl font-bold text-transparent">
                                            {instructorName.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className={`absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-[#070b12] ${
                                        instructor?.is_active !== false ? 'bg-emerald-500' : 'bg-slate-500'
                                    }`}
                                    title={instructor?.is_active !== false ? 'Online & Available' : 'Paused'}
                                />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                                        Welcome back, {instructorName}!
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#5bb4ff]/30 bg-[#5bb4ff]/15 px-2.5 py-0.5 text-xs font-semibold text-[#8acbff]">
                                        <Sparkles className="h-3 w-3" />
                                        {certifications}
                                    </span>
                                </div>
                                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400 sm:text-sm">
                                    <span className="flex items-center gap-1 text-slate-300">
                                        <MapPin className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                        {instructorLocation}
                                    </span>
                                    <span>•</span>
                                    <span>{instructor?.is_freelance ? 'Freelance Coach' : instructor?.school?.name || 'School Partner'}</span>
                                    {instructor?.hourly_rate && (
                                        <>
                                            <span>•</span>
                                            <span className="font-medium text-emerald-400">${instructor.hourly_rate}/hr</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/instructor/availability"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-2.5 text-xs font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:bg-white/[0.12] hover:text-white sm:text-sm"
                            >
                                <Calendar className="h-4 w-4 text-[#5bb4ff]" />
                                Set Calendar
                            </Link>
                            <Link
                                href="/instructor/profile"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-[1.02] hover:from-[#5bb4ff] hover:to-[#2e7bff] active:scale-[0.98] sm:text-sm"
                            >
                                <User className="h-4 w-4" />
                                Edit Profile
                            </Link>
                        </div>
                    </div>

                    {/* Profile Completion Bar */}
                    <div className="mt-6 border-t border-white/10 pt-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-slate-300">
                                <Award className="h-4 w-4 text-[#5bb4ff]" />
                                Profile Completion
                            </span>
                            <span className="font-bold text-[#8acbff]">{profileProgress}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
                            <div
                                className="h-full bg-gradient-to-r from-[#1f6eff] to-[#38bdf8] transition-all duration-500"
                                style={{ width: `${profileProgress}%` }}
                            />
                        </div>
                        {profileProgress < 100 && (
                            <p className="mt-1.5 text-[11px] text-slate-400">
                                Tip: Add languages, daily rates, and certification docs in <Link href="/instructor/profile" className="text-[#5bb4ff] underline">My Profile</Link> to reach 100% and get more student inquiries.
                            </p>
                        )}
                    </div>
                </div>

                {/* Hire Request Alert Banner (if any pending) */}
                {Boolean(stats?.hire_requests_count && stats.hire_requests_count > 0) && (
                    <div className="flex items-center justify-between rounded-2xl border border-sky-500/30 bg-sky-950/30 p-4 shadow-lg backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-[#38bdf8]">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">
                                    You have {stats?.hire_requests_count} new School Hire Request{stats?.hire_requests_count > 1 ? 's' : ''}!
                                </h4>
                                <p className="text-xs text-slate-300">A partner kite center sent you a teaching contract offer.</p>
                            </div>
                        </div>
                        <Link
                            href="/instructor/hire-requests"
                            className="shrink-0 rounded-xl bg-[#0284c7] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0369a1]"
                        >
                            Review Offers
                        </Link>
                    </div>
                )}

                {/* 5 Core Summary Widgets */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-5">
                    {/* 1. Monthly Revenue */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 hover:bg-white/[0.08]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Monthly Revenue</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/15 text-emerald-400 transition-transform group-hover:scale-110">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">${monthlyRev}</span>
                            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                                <TrendingUp className="h-3 w-3" />
                                This month earnings
                            </p>
                        </div>
                    </div>

                    {/* 2. Upcoming Lessons */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#5bb4ff]/40 hover:bg-white/[0.08]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Upcoming Lessons</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/15 text-[#5bb4ff] transition-transform group-hover:scale-110">
                                <CalendarCheck className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{upcomingCount}</span>
                            <p className="mt-1 text-xs text-slate-400">Confirmed sessions</p>
                        </div>
                    </div>

                    {/* 3. Pending Requests */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.08]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Pending Requests</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/15 text-amber-400 transition-transform group-hover:scale-110">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{pendingCount}</span>
                            <p className="mt-1 text-xs text-amber-400">{pendingCount > 0 ? 'Action required' : 'All responded'}</p>
                        </div>
                    </div>

                    {/* 4. Average Rating */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.08]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Avg Rating</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/15 text-amber-400 transition-transform group-hover:scale-110">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{avgRating}</span>
                            <p className="mt-1 text-xs text-slate-400">From student reviews</p>
                        </div>
                    </div>

                    {/* 5. Total Students */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#38bdf8]/40 hover:bg-white/[0.08]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Students Taught</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/15 text-[#38bdf8] transition-transform group-hover:scale-110">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                {stats?.students_taught ?? stats?.completed ?? 0}
                            </span>
                            <p className="mt-1 text-xs text-slate-400">Unique riders trained</p>
                        </div>
                    </div>
                </div>

                {/* Quick Action Navigation Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <Link
                        href="/instructor/bookings?tab=pending"
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition-all hover:border-[#5bb4ff]/40 hover:bg-white/[0.08]"
                    >
                        <CalendarCheck className="h-5 w-5 text-[#5bb4ff]" />
                        <div className="text-left">
                            <p className="text-xs font-bold text-white">Bookings Hub</p>
                            <p className="text-[11px] text-slate-400">Manage all sessions</p>
                        </div>
                    </Link>

                    <Link
                        href="/instructor/revenue"
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition-all hover:border-emerald-400/40 hover:bg-white/[0.08]"
                    >
                        <DollarSign className="h-5 w-5 text-emerald-400" />
                        <div className="text-left">
                            <p className="text-xs font-bold text-white">Earnings & Payouts</p>
                            <p className="text-[11px] text-slate-400">Invoices & banking</p>
                        </div>
                    </Link>

                    <Link
                        href="/instructor/messages"
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition-all hover:border-[#38bdf8]/40 hover:bg-white/[0.08]"
                    >
                        <MessageSquare className="h-5 w-5 text-[#38bdf8]" />
                        <div className="text-left">
                            <p className="text-xs font-bold text-white">Inbox & Chat</p>
                            <p className="text-[11px] text-slate-400">Clients & schools</p>
                        </div>
                    </Link>

                    <Link
                        href="/instructor/browse"
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 transition-all hover:border-indigo-400/40 hover:bg-white/[0.08]"
                    >
                        <Compass className="h-5 w-5 text-indigo-400" />
                        <div className="text-left">
                            <p className="text-xs font-bold text-white">Coach Network</p>
                            <p className="text-[11px] text-slate-400">Browse instructors</p>
                        </div>
                    </Link>
                </div>

                {/* Recent Bookings Section */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
                                <Calendar className="h-5 w-5 text-[#5bb4ff]" />
                                Recent Booking Inquiries
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                                Review new incoming requests or track upcoming confirmed lessons
                            </p>
                        </div>

                        <Link
                            href="/instructor/bookings"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5bb4ff] hover:text-[#8acbff] hover:underline"
                        >
                            View All Bookings ({bookings.length}) →
                        </Link>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/20 px-4 py-12 text-center sm:py-16">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#5bb4ff]/30 bg-gradient-to-br from-[#1f6eff]/20 to-[#5bb4ff]/10 text-[#5bb4ff] shadow-lg">
                                <Wind className="h-7 w-7 animate-pulse" />
                            </div>
                            <h3 className="text-base font-bold text-white">No Bookings Yet</h3>
                            <p className="mt-1 mb-5 max-w-md text-xs text-slate-400">
                                Once riders book sessions from your profile, you will receive real-time notifications and manage them right here.
                            </p>
                            <Link
                                href="/instructor/availability"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2 text-xs font-semibold text-white shadow-md hover:scale-[1.02]"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Set Your Open Dates
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                                        <th className="px-3 pb-3">Student</th>
                                        <th className="px-3 pb-3">Date & Time</th>
                                        <th className="px-3 pb-3">Lesson Type</th>
                                        <th className="px-3 pb-3">Price</th>
                                        <th className="px-3 pb-3">Status</th>
                                        <th className="px-3 pb-3 text-right">Quick Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {bookings.map((booking) => {
                                        const statusBadge = getStatusBadge(booking.status);
                                        const isPending = booking.status === 'pending';

                                        return (
                                            <tr key={booking.id} className="group transition-colors hover:bg-white/[0.04]">
                                                <td className="px-3 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-800 text-xs font-bold text-[#8acbff]">
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
                                                        <div>
                                                            <span className="block text-sm font-semibold text-white">
                                                                {booking.student?.name || 'Student'}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400">
                                                                {booking.student?.email || 'Rider'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3.5 text-xs text-slate-300">
                                                    <div className="flex items-center gap-1.5 font-medium">
                                                        <Calendar className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                        {booking.date}
                                                    </div>
                                                    {booking.time && <span className="text-[11px] text-slate-400">{booking.time}</span>}
                                                </td>
                                                <td className="px-3 py-3.5 text-xs text-slate-300">
                                                    {booking.lesson_type || 'Kitesurf Coaching'}
                                                </td>
                                                <td className="px-3 py-3.5 text-xs font-bold text-emerald-400">
                                                    ${booking.total_price ?? booking.price ?? instructor?.hourly_rate ?? 65}
                                                </td>
                                                <td className="px-3 py-3.5">
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadge.className}`}>
                                                        {statusBadge.label}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3.5 text-right">
                                                    {isPending ? (
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                disabled={actionLoading === booking.id}
                                                                onClick={() => handleAcceptBooking(booking.id)}
                                                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/80 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                                                            >
                                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                                Accept
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={actionLoading === booking.id}
                                                                onClick={() => handleDeclineBooking(booking.id)}
                                                                className="inline-flex items-center gap-1 rounded-lg bg-rose-600/60 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
                                                            >
                                                                <XCircle className="h-3.5 w-3.5" />
                                                                Decline
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <Link
                                                            href="/instructor/bookings"
                                                            className="text-xs text-slate-400 hover:text-white"
                                                        >
                                                            Details →
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function getStatusBadge(status: string) {
    switch (status?.toLowerCase()) {
        case 'confirmed':
            return {
                label: 'Confirmed',
                className: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
            };
        case 'pending':
            return {
                label: 'Pending Request',
                className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            };
        case 'completed':
            return {
                label: 'Completed',
                className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            };
        case 'cancelled':
            return {
                label: 'Cancelled',
                className: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
            };
        default:
            return {
                label: status || 'Active',
                className: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
            };
    }
}
