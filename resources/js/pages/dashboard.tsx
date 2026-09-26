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
            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Hero Card */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-indigo-50/40 p-6 shadow-sm backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-gradient-to-r dark:from-blue-950/40 dark:via-slate-900/60 dark:to-slate-950/70 dark:shadow-2xl">
                    <div className="pointer-events-none absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-[#3b82f6]/10 blur-3xl" />
                    <div className="relative z-10 max-w-2xl space-y-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                            <Sparkles className="h-3.5 w-3.5" />
                            Welcome to KiteLink
                        </span>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Discover Certified Kitesurf Instructors Worldwide
                        </h1>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300/80">
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
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] sm:text-sm dark:border-white/15 dark:bg-white/[0.08] dark:text-slate-200 dark:hover:bg-white/[0.14] dark:hover:text-white"
                            >
                                <CalendarCheck className="h-4 w-4 text-[#1f6eff] dark:text-[#5bb4ff]" />
                                My Bookings
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Link
                        href="/instructors"
                        className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:hover:border-[#5bb4ff]/40 dark:hover:bg-white/[0.08]"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 transition-transform group-hover:scale-110 dark:border-[#3b82f6]/30 dark:bg-[#3b82f6]/15 dark:text-[#5bb4ff]">
                            <Compass className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-[#8acbff]">Find Instructors</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Search certified instructors across 40+ countries and book lessons directly.</p>
                    </Link>

                    <Link
                        href="/client/bookings"
                        className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:hover:border-[#38bdf8]/40 dark:hover:bg-white/[0.08]"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-600 transition-transform group-hover:scale-110 dark:border-[#38bdf8]/30 dark:bg-[#38bdf8]/15 dark:text-[#38bdf8]">
                            <CalendarCheck className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-[#8acbff]">My Bookings</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">View status of your lesson requests, confirmed sessions, and leave instructor reviews.</p>
                    </Link>

                    <Link
                        href="/client/messages"
                        className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:hover:border-indigo-400/40 dark:hover:bg-white/[0.08]"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110 dark:border-indigo-400/30 dark:bg-indigo-400/15 dark:text-indigo-400">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">Direct Messages</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Chat directly with your confirmed coaches about session timing, gear, and spots.</p>
                    </Link>

                    <Link
                        href="/client/settings"
                        className="group rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:hover:border-amber-400/40 dark:hover:bg-white/[0.08]"
                    >
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 transition-transform group-hover:scale-110 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-400">
                            <Settings className="h-6 w-6" />
                        </div>
                        <h3 className="mb-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-300">Account Settings</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Update your profile credentials, password, and communication preferences.</p>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
