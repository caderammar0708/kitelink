import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CalendarCheck, Compass, MessageSquare, Settings, Sparkles, Wind } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - KiteLink" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-100 sm:p-6 lg:p-8">
                {/* Hero Card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-950/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    <div className="pointer-events-none absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-[#3b82f6]/10 blur-3xl" />
                    <div className="relative z-10 max-w-2xl space-y-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5bb4ff]/30 bg-[#5bb4ff]/15 px-3 py-1 text-xs font-semibold text-[#8acbff]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Welcome to KiteLink
                        </span>
                        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Discover Certified Kitesurf Instructors Worldwide
                        </h1>
                        <p className="text-sm leading-relaxed text-slate-300/80">
                            Connect directly with verified IKO & VDWS instructors, book lessons, explore world-class kite centers, and elevate your
                            riding.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link
                                href="/instructors"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-[1.02] hover:from-[#5bb4ff] hover:to-[#2e7bff] active:scale-[0.98] sm:text-sm"
                            >
                                <Compass className="h-4 w-4" />
                                Browse Instructors
                            </Link>
                            <Link
                                href="/client/bookings"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-xs font-semibold text-slate-200 backdrop-blur-md transition-all duration-200 hover:bg-white/[0.14] hover:text-white active:scale-[0.98] sm:text-sm"
                            >
                                <CalendarCheck className="h-4 w-4 text-[#5bb4ff]" />
                                My Bookings
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Action Glass Cards */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/instructors"
                        className="group rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#5bb4ff]/40 hover:bg-white/[0.08]"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/15 text-[#5bb4ff] transition-transform group-hover:scale-110">
                            <Compass className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-[#8acbff]">Find Instructors</h3>
                        <p className="text-xs text-slate-400">Search certified instructors across 40+ countries and book lessons directly.</p>
                    </Link>

                    <Link
                        href="/client/bookings"
                        className="group rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-[#38bdf8]/40 hover:bg-white/[0.08]"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/15 text-[#38bdf8] transition-transform group-hover:scale-110">
                            <CalendarCheck className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-[#8acbff]">My Bookings</h3>
                        <p className="text-xs text-slate-400">View status of your lesson requests, confirmed sessions, and leave instructor reviews.</p>
                    </Link>

                    <Link
                        href="/client/messages"
                        className="group rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/40 hover:bg-white/[0.08]"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-400/15 text-indigo-400 transition-transform group-hover:scale-110">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-indigo-300">Direct Messages</h3>
                        <p className="text-xs text-slate-400">Chat directly with your confirmed coaches about session timing, gear, and spots.</p>
                    </Link>

                    <Link
                        href="/settings/profile"
                        className="group rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-amber-400/40 hover:bg-white/[0.08]"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/15 text-amber-400 transition-transform group-hover:scale-110">
                            <Settings className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-amber-300">Account Settings</h3>
                        <p className="text-xs text-slate-400">Update your profile credentials, password, and communication preferences.</p>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
