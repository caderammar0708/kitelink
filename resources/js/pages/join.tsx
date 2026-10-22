import AuthLayout from '@/layouts/auth-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Building2, Check, ChevronRight, Sparkles, Wind } from 'lucide-react';
import { ReactNode } from 'react';

export function Join() {
    return (
        <>
            <Head title="Join KiteLink - Grow Your Kitesurf Business" />

            <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center">
                {/* Hero Title */}
                <div className="mb-6 max-w-xl space-y-2 text-center sm:mb-8">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-0.5 text-[11px] font-bold tracking-wider text-blue-700 uppercase shadow-xs backdrop-blur-md dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                        <Sparkles className="h-3 w-3 text-blue-600 dark:text-[#5bb4ff]" />
                        Partner with KiteLink
                    </div>
                    <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
                        Grow Your Kitesurf Business
                    </h1>
                    <p className="mx-auto max-w-md text-xs text-slate-600 sm:text-sm dark:text-slate-300/80">
                        Choose your path to join our global network of certified instructors and premier kite centers.
                    </p>
                </div>

                {/* Two Balanced Glass Cards */}
                <div className="grid w-full max-w-3xl grid-cols-1 items-stretch gap-5 sm:gap-6 md:grid-cols-2">
                    {/* CARD 1: Become an Instructor */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 sm:p-6 dark:border-white/15 dark:bg-white/[0.07] dark:shadow-2xl dark:shadow-black/50 dark:hover:border-[#5bb4ff]/60 dark:hover:bg-white/[0.09]">
                        <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-100/60 blur-2xl dark:bg-[#3b82f6]/10" />

                        <div className="relative z-10 space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-blue-600 shadow-sm transition-transform group-hover:scale-105 dark:border-[#5bb4ff]/40 dark:bg-gradient-to-br dark:from-[#1f6eff]/30 dark:to-[#5bb4ff]/15 dark:text-[#5bb4ff]">
                                    <Wind className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold tracking-wider text-blue-600 uppercase dark:text-[#8acbff]">Independent Coach</span>
                                    <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl dark:text-white">Become an Instructor</h2>
                                </div>
                            </div>

                            {/* Benefits List */}
                            <ul className="space-y-2 pt-1 text-xs text-slate-700 dark:text-slate-200">
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 dark:border-[#5bb4ff]/40 dark:bg-[#5bb4ff]/20 dark:text-[#5bb4ff]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Get discovered by travelers & riders worldwide</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 dark:border-[#5bb4ff]/40 dark:bg-[#5bb4ff]/20 dark:text-[#5bb4ff]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Direct student bookings — 0% commission fees</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 dark:border-[#5bb4ff]/40 dark:bg-[#5bb4ff]/20 dark:text-[#5bb4ff]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Set your own calendar, hourly rates & spots</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 dark:border-[#5bb4ff]/40 dark:bg-[#5bb4ff]/20 dark:text-[#5bb4ff]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Build reputation with verified student reviews</span>
                                </li>
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <div className="relative z-10 mt-5 border-t border-slate-100 pt-4 dark:border-white/10">
                            <Link
                                href={route('register', { role: 'instructor' })}
                                className="group/btn relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-center text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-500/40 active:scale-[0.99] sm:text-sm dark:from-[#4ba9ff] dark:to-[#1f6eff] dark:shadow-blue-600/30 dark:hover:from-[#5bb4ff] dark:hover:to-[#2e7bff]"
                            >
                                <span>Register as Instructor</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* CARD 2: Register Your Kite School */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 sm:p-6 dark:border-white/15 dark:bg-white/[0.07] dark:shadow-2xl dark:shadow-black/50 dark:hover:border-[#38bdf8]/60 dark:hover:bg-white/[0.09]">
                        <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-sky-100/60 blur-2xl dark:bg-[#38bdf8]/10" />

                        <div className="relative z-10 space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-gradient-to-br from-sky-500/20 to-blue-500/10 text-sky-600 shadow-sm transition-transform group-hover:scale-105 dark:border-[#38bdf8]/40 dark:bg-gradient-to-br dark:from-[#0284c7]/30 dark:to-[#38bdf8]/15 dark:text-[#38bdf8]">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold tracking-wider text-sky-600 uppercase dark:text-[#38bdf8]">Kite Centers & Camps</span>
                                    <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl dark:text-white">Register Your Kite School</h2>
                                </div>
                            </div>

                            {/* Benefits List */}
                            <ul className="space-y-2 pt-1 text-xs text-slate-700 dark:text-slate-200">
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-600 dark:border-[#38bdf8]/40 dark:bg-[#38bdf8]/20 dark:text-[#38bdf8]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>List your center and multi-instructor team</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-600 dark:border-[#38bdf8]/40 dark:bg-[#38bdf8]/20 dark:text-[#38bdf8]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Reach international kitesurfers planning trips</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-600 dark:border-[#38bdf8]/40 dark:bg-[#38bdf8]/20 dark:text-[#38bdf8]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Manage course bookings across your coaches</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-600 dark:border-[#38bdf8]/40 dark:bg-[#38bdf8]/20 dark:text-[#38bdf8]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Showcase IKO/VDWS gear, boats & facilities</span>
                                </li>
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <div className="relative z-10 mt-5 border-t border-slate-100 pt-4 dark:border-white/10">
                            <Link
                                href={route('register', { role: 'school' })}
                                className="group/btn relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-center text-xs font-bold text-white shadow-md shadow-sky-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-sky-500/40 active:scale-[0.99] sm:text-sm dark:from-[#0ea5e9] dark:to-[#0284c7] dark:shadow-sky-600/30 dark:hover:from-[#38bdf8] dark:hover:to-[#0369a1]"
                            >
                                <span>Register Your School</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Below Cards Note */}
                <div className="mt-5 text-center text-xs text-slate-600 dark:text-slate-400">
                    Just want to book a lesson?{' '}
                    <Link
                        href={route('instructors.index')}
                        className="inline-flex items-center gap-0.5 font-semibold text-blue-600 underline-offset-4 transition-colors hover:text-blue-700 hover:underline dark:text-[#5bb4ff] dark:hover:text-[#8acbff]"
                    >
                        Find an Instructor <ChevronRight className="h-3 w-3" />
                    </Link>{' '}
                    <span className="text-slate-400 dark:text-slate-500">(no account required)</span>
                </div>
            </div>
        </>
    );
}

Join.layout = (page: ReactNode) => (
    <AuthLayout
        headerRight={
            <Link
                href={route('login')}
                className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-md transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 sm:text-sm dark:border-white/15 dark:bg-white/[0.07] dark:text-slate-200 dark:hover:bg-white/[0.14] dark:hover:text-white"
            >
                Sign In
            </Link>
        }
    >
        {page}
    </AuthLayout>
);

export default Join;
