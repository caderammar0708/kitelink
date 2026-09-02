import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    CalendarCheck,
    ChevronDown,
    ChevronUp,
    Compass,
    GraduationCap,
    Mail,
    MapPin,
    PlusCircle,
    Sparkles,
    Star,
    User,
    Wind,
} from 'lucide-react';
import { useState } from 'react';

interface Client {
    id: number;
    name: string;
    email: string;
}

interface Booking {
    id: number;
    client_id?: number;
    client?: Client;
    date: string;
    time?: string;
    lesson_type?: string;
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | string;
    price?: number;
    location?: string;
    notes?: string;
}

interface Stats {
    upcoming?: number;
    students_taught?: number;
    average_rating?: number;
    total_bookings?: number;
    completed?: number;
    earnings?: number;
}

interface InstructorData {
    id: number;
    bio?: string;
    experience_years?: number;
    location?: string;
    certifications?: string;
    hourly_rate?: number;
    profile_photo?: string;
    is_freelance?: boolean;
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
    const [expandedBookingId, setExpandedBookingId] = useState<number | null>(null);

    const toggleBooking = (id: number) => {
        setExpandedBookingId(expandedBookingId === id ? null : id);
    };

    // Fallback/calculated stats
    const upcomingCount = stats?.upcoming ?? bookings.filter((b) => b.status === 'confirmed').length;
    const studentsCount = stats?.students_taught ?? (stats?.completed ? Math.max(stats.completed, 12) : 0);
    const avgRating = stats?.average_rating ?? 4.9;

    const instructorName = instructor?.user?.name ?? 'Instructor';
    const instructorLocation = instructor?.location || 'Kalpitiya, Sri Lanka';
    const certifications = instructor?.certifications || 'IKO Certified';

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
                                    className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-[#070b12] bg-emerald-500"
                                    title="Active"
                                />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">Welcome back, {instructorName}!</h1>
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
                                    <span>{instructor?.is_freelance ? 'Freelance Instructor' : instructor?.school?.name || 'Affiliated Pro'}</span>
                                    {instructor?.hourly_rate && (
                                        <>
                                            <span>•</span>
                                            <span className="font-medium text-emerald-400">${instructor.hourly_rate}/hour</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/instructor/profile"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-2.5 text-xs font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:bg-white/[0.12] hover:text-white sm:text-sm"
                            >
                                <User className="h-4 w-4 text-[#5bb4ff]" />
                                Edit Profile
                            </Link>
                            <Link
                                href="/instructors"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-[1.02] hover:from-[#5bb4ff] hover:to-[#2e7bff] active:scale-[0.98] sm:text-sm"
                            >
                                <Compass className="h-4 w-4" />
                                View Public Spots
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Row (3 Glass Cards + Bonus Earnings Card) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    {/* Stat Card 1: Upcoming Bookings */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#5bb4ff]/40 hover:bg-white/[0.08]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Upcoming Bookings</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/15 text-[#5bb4ff] transition-transform group-hover:scale-110">
                                <CalendarCheck className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{upcomingCount}</span>
                            <p className="mt-1 text-xs text-slate-400">Confirmed sessions ahead</p>
                        </div>
                    </div>

                    {/* Stat Card 2: Total Students Taught */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#38bdf8]/40 hover:bg-white/[0.08]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Students Taught</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/15 text-[#38bdf8] transition-transform group-hover:scale-110">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{studentsCount}</span>
                            <p className="mt-1 text-xs text-slate-400">Completed riders & courses</p>
                        </div>
                    </div>

                    {/* Stat Card 3: Average Rating */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.08]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Average Rating</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/15 text-amber-400 transition-transform group-hover:scale-110">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{avgRating}</span>
                            <div className="flex text-xs text-amber-400">★★★★★</div>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">From student reviews</p>
                    </div>

                    {/* Stat Card 4: Total Revenue / Lessons */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 hover:bg-white/[0.08]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Lessons</span>
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/30 bg-emerald-400/15 text-emerald-400 transition-transform group-hover:scale-110">
                                <Wind className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                                {stats?.total_bookings ?? bookings.length}
                            </span>
                            <p className="mt-1 text-xs font-medium text-emerald-400">
                                {stats?.earnings ? `$${stats.earnings} earned` : 'Active schedule'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Upcoming Bookings Section */}
                <div id="bookings" className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
                                <Calendar className="h-5 w-5 text-[#5bb4ff]" />
                                Upcoming & Recent Bookings
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">Manage and review scheduled sessions with your students</p>
                        </div>

                        <span className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-slate-400">
                            Showing {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                        </span>
                    </div>

                    {bookings.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/20 px-4 py-12 text-center sm:py-16">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5bb4ff]/30 bg-gradient-to-br from-[#1f6eff]/20 to-[#5bb4ff]/10 text-[#5bb4ff] shadow-lg">
                                <Wind className="h-8 w-8 animate-pulse" />
                            </div>
                            <h3 className="text-lg font-bold text-white">No Bookings Yet</h3>
                            <p className="mt-1.5 mb-6 max-w-md text-sm text-slate-400">
                                Once students discover your instructor profile and book lessons, their upcoming sessions and details will appear here.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    href="/instructor/profile"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 sm:text-sm"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Complete Your Profile
                                </Link>
                                <Link
                                    href="/instructors"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/[0.14] sm:text-sm"
                                >
                                    <Compass className="h-4 w-4 text-[#5bb4ff]" />
                                    Explore Kite Spots
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Bookings Table */
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                        <th className="px-3 pb-3">Student</th>
                                        <th className="px-3 pb-3">Date & Time</th>
                                        <th className="px-3 pb-3">Lesson Type</th>
                                        <th className="px-3 pb-3">Price</th>
                                        <th className="px-3 pb-3">Status</th>
                                        <th className="px-3 pb-3 text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {bookings.map((booking) => {
                                        const isExpanded = expandedBookingId === booking.id;
                                        const statusBadge = getStatusBadge(booking.status);

                                        return (
                                            <>
                                                <tr
                                                    key={booking.id}
                                                    onClick={() => toggleBooking(booking.id)}
                                                    className="group cursor-pointer transition-colors hover:bg-white/[0.04]"
                                                >
                                                    <td className="px-3 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-600/30 to-sky-400/20 text-xs font-bold text-[#8acbff]">
                                                                {booking.client?.name?.charAt(0) || 'S'}
                                                            </div>
                                                            <div>
                                                                <span className="block text-sm font-semibold text-white">
                                                                    {booking.client?.name || 'Student'}
                                                                </span>
                                                                <span className="text-xs text-slate-400">
                                                                    {booking.client?.email || 'Registered Rider'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-slate-300">
                                                        <div className="flex items-center gap-1.5 font-medium">
                                                            <Calendar className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                            {booking.date}
                                                        </div>
                                                        {booking.time && <span className="mt-0.5 block text-xs text-slate-400">{booking.time}</span>}
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-slate-300">
                                                        <span className="font-medium">{booking.lesson_type || 'Kitesurf Coaching'}</span>
                                                    </td>
                                                    <td className="px-3 py-4 text-sm font-semibold text-emerald-400">
                                                        ${booking.price ?? instructor?.hourly_rate ?? 65}
                                                    </td>
                                                    <td className="px-3 py-4">
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadge.className}`}
                                                        >
                                                            {statusBadge.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-4 text-right">
                                                        <button
                                                            type="button"
                                                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                                                        >
                                                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                        </button>
                                                    </td>
                                                </tr>

                                                {/* Expanded Details Row */}
                                                {isExpanded && (
                                                    <tr className="border-y border-white/10 bg-slate-950/40">
                                                        <td colSpan={6} className="p-4 sm:p-5">
                                                            <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
                                                                <div className="space-y-1">
                                                                    <span className="font-semibold text-slate-400 uppercase">Student Contact</span>
                                                                    <p className="flex items-center gap-1.5 text-white">
                                                                        <Mail className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                                        {booking.client?.email || 'Not provided'}
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span className="font-semibold text-slate-400 uppercase">Location & Spot</span>
                                                                    <p className="flex items-center gap-1.5 text-white">
                                                                        <MapPin className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                                        {booking.location || instructorLocation}
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <span className="font-semibold text-slate-400 uppercase">Session Notes</span>
                                                                    <p className="text-slate-300">
                                                                        {booking.notes || 'No special requirements noted by student.'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
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
                label: 'Pending',
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
