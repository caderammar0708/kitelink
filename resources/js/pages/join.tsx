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
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-[#5bb4ff]/30 bg-[#5bb4ff]/15 px-3 py-0.5 text-[11px] font-bold tracking-wider text-[#8acbff] uppercase backdrop-blur-md">
                        <Sparkles className="h-3 w-3 text-[#5bb4ff]" />
                        Partner with KiteLink
                    </div>
                    <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                        Grow Your Kitesurf Business
                    </h1>
                    <p className="mx-auto max-w-md text-xs text-slate-300/80 sm:text-sm">
                        Choose your path to join our global network of certified instructors and premier kite centers.
                    </p>
                </div>

                {/* Two Balanced Glass Cards */}
                <div className="grid w-full max-w-3xl grid-cols-1 items-stretch gap-5 sm:gap-6 md:grid-cols-2">
                    {/* CARD 1: Become an Instructor */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#5bb4ff]/60 hover:bg-white/[0.09] sm:p-6">
                        <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-[#3b82f6]/10 blur-2xl" />

                        <div className="relative z-10 space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#5bb4ff]/40 bg-gradient-to-br from-[#1f6eff]/30 to-[#5bb4ff]/15 text-[#5bb4ff] shadow-md transition-transform group-hover:scale-105">
                                    <Wind className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold tracking-wider text-[#8acbff] uppercase">Independent Coach</span>
                                    <h2 className="text-lg font-extrabold text-white sm:text-xl">Become an Instructor</h2>
                                </div>
                            </div>

                            {/* Benefits List */}
                            <ul className="space-y-2 pt-1 text-xs text-slate-200">
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#5bb4ff]/40 bg-[#5bb4ff]/20 text-[#5bb4ff]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Get discovered by travelers & riders worldwide</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#5bb4ff]/40 bg-[#5bb4ff]/20 text-[#5bb4ff]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Direct student bookings — 0% commission fees</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#5bb4ff]/40 bg-[#5bb4ff]/20 text-[#5bb4ff]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Set your own calendar, hourly rates & spots</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#5bb4ff]/40 bg-[#5bb4ff]/20 text-[#5bb4ff]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Build reputation with verified student reviews</span>
                                </li>
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <div className="relative z-10 mt-5 border-t border-white/10 pt-4">
                            <Link
                                href={route('register', { role: 'instructor' })}
                                className="group/btn relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2.5 text-center text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.01] hover:from-[#5bb4ff] hover:to-[#2e7bff] hover:shadow-blue-500/50 active:scale-[0.99] sm:text-sm"
                            >
                                <span>Register as Instructor</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* CARD 2: Register Your Kite School */}
                    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#38bdf8]/60 hover:bg-white/[0.09] sm:p-6">
                        <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-[#38bdf8]/10 blur-2xl" />

                        <div className="relative z-10 space-y-4">
                            {/* Card Header */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#38bdf8]/40 bg-gradient-to-br from-[#0284c7]/30 to-[#38bdf8]/15 text-[#38bdf8] shadow-md transition-transform group-hover:scale-105">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold tracking-wider text-[#38bdf8] uppercase">Kite Centers & Camps</span>
                                    <h2 className="text-lg font-extrabold text-white sm:text-xl">Register Your Kite School</h2>
                                </div>
                            </div>

                            {/* Benefits List */}
                            <ul className="space-y-2 pt-1 text-xs text-slate-200">
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/20 text-[#38bdf8]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>List your center and multi-instructor team</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/20 text-[#38bdf8]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Reach international kitesurfers planning trips</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/20 text-[#38bdf8]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Manage course bookings across your coaches</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/20 text-[#38bdf8]">
                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                    </div>
                                    <span>Showcase IKO/VDWS gear, boats & facilities</span>
                                </li>
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <div className="relative z-10 mt-5 border-t border-white/10 pt-4">
                            <Link
                                href={route('register', { role: 'school' })}
                                className="group/btn relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] px-4 py-2.5 text-center text-xs font-bold text-white shadow-lg shadow-sky-600/30 transition-all duration-300 hover:scale-[1.01] hover:from-[#38bdf8] hover:to-[#0369a1] hover:shadow-sky-500/50 active:scale-[0.99] sm:text-sm"
                            >
                                <span>Register Your School</span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Below Cards Note */}
                <div className="mt-5 text-center text-xs text-slate-400">
                    Just want to book a lesson?{' '}
                    <Link
                        href={route('instructors.index')}
                        className="inline-flex items-center gap-0.5 font-semibold text-[#5bb4ff] underline-offset-4 transition-colors hover:text-[#8acbff] hover:underline"
                    >
                        Find an Instructor <ChevronRight className="h-3 w-3" />
                    </Link>{' '}
                    <span className="text-slate-500">(no account required)</span>
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
                className="rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/[0.14] hover:text-white sm:text-sm"
            >
                Sign In
            </Link>
        }
    >
        {page}
    </AuthLayout>
);

export default Join;
