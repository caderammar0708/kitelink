import Logo from '@/components/logo';
import TechBackground from '@/components/tech-background';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Clock, FileText, LogOut, RefreshCw, Send, Shield } from 'lucide-react';
import React, { useState } from 'react';

interface ApplicationData {
    id?: number;
    status: 'pending' | 'rejected' | 'suspended' | string;
    rejection_reason?: string | null;
    school_name?: string;
    registration_number?: string | null;
    contact_name?: string | null;
    name?: string;
    email: string;
    phone?: string | null;
    location?: string | null;
    created_at?: string;
}

interface VerificationPendingProps {
    role: 'instructor' | 'school';
    application: ApplicationData;
    status?: string;
}

export default function VerificationPending({ role, application }: VerificationPendingProps) {
    const isSchool = role === 'school';
    const isRejected = application.status === 'rejected';

    // State for editing if rejected
    const [isEditing, setIsEditing] = useState(isRejected);

    // Resubmit form
    const { data, setData, post, processing, errors } = useForm({
        school_name: application.school_name || application.name || '',
        registration_number: application.registration_number || '',
        contact_name: application.contact_name || application.name || '',
        name: application.name || application.contact_name || '',
        phone: application.phone || '',
        location: application.location || '',
    });

    const handleResubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('verification.pending.resubmit'), {
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white transition-colors duration-300 dark:bg-[#070b12] dark:text-slate-100">
            {/* Ambient Tech Aura Background (matches Landing Page) */}
            <TechBackground />

            {/* Top Navigation Bar without sidebar */}
            <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
                <Link href={route('home')} className="transition-transform duration-300 hover:scale-105">
                    <Logo size="md" />
                </Link>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-700 shadow-2xs dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:inline-flex">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
                        Signed in as {application.email}
                    </span>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-md transition-all duration-200 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:border-white/15 dark:bg-white/[0.07] dark:text-slate-200 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/20 dark:hover:text-rose-200"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
                {/* Hero Status Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-2xl transition-all sm:p-10 dark:border-white/15 dark:bg-white/[0.08] dark:shadow-2xl dark:shadow-black/70">
                    <div className="flex flex-col items-center text-center">
                        {/* Status Icon */}
                        {isRejected ? (
                            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/15 text-rose-600 shadow-lg ring-8 ring-rose-500/10 dark:bg-rose-500/20 dark:text-rose-400 dark:ring-rose-500/10">
                                <AlertCircle className="h-10 w-10 animate-pulse" />
                            </div>
                        ) : (
                            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/15 text-amber-600 shadow-lg ring-8 ring-amber-500/10 dark:bg-amber-500/20 dark:text-amber-300 dark:ring-amber-500/10">
                                <Clock className="h-10 w-10 animate-pulse" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                    <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-400" />
                                </span>
                            </div>
                        )}

                        {/* Status Pill Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3.5 py-1 text-xs font-semibold tracking-wide text-slate-700 uppercase dark:border-white/15 dark:bg-white/5 dark:text-slate-200">
                            {isRejected ? (
                                <>
                                    <AlertCircle className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                                    <span>Action Required: Revisions Requested</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                                    <span>Verification In Progress</span>
                                </>
                            )}
                        </div>

                        {/* Heading */}
                        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
                            {isRejected ? 'Application Needs Revision' : 'Application Submitted'}
                        </h1>

                        {/* Reassuring Body Text */}
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                            {isRejected
                                ? `The Winduo verification team reviewed your ${isSchool ? 'school' : 'instructor'} application and requested updates before granting approval.`
                                : `Thanks for registering with Winduo. Our team is reviewing your ${isSchool ? 'school' : 'instructor'} application and will notify you by email once it's approved. This usually takes 1–2 business days.`}
                        </p>

                        {/* Rejection Feedback Box */}
                        {isRejected && application.rejection_reason && (
                            <div className="mt-6 w-full rounded-2xl border border-rose-500/30 bg-rose-50 p-5 text-left backdrop-blur-md dark:bg-rose-950/40">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                                    <div className="space-y-1">
                                        <h2 className="text-sm font-bold text-rose-800 dark:text-rose-200">Feedback from Reviewer:</h2>
                                        <p className="text-sm leading-relaxed whitespace-pre-line text-rose-700 dark:text-rose-300/90">{application.rejection_reason}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.reload()}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-md transition hover:bg-slate-50 hover:text-slate-900 sm:text-sm dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/20"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Check Status
                            </button>

                            {isRejected && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/25 transition hover:shadow-blue-500/40 sm:text-sm dark:from-[#4ba9ff] dark:to-[#1f6eff] dark:shadow-blue-600/30"
                                >
                                    <FileText className="h-4 w-4" />
                                    {isEditing ? 'Hide Edit Form' : 'Edit & Resubmit Application'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit & Resubmit Form (If Rejected or Editing) */}
                {isRejected && isEditing && (
                    <div className="mt-8 rounded-3xl border border-blue-200 bg-white/95 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-2xl sm:p-8 dark:border-blue-500/30 dark:bg-white/[0.08] dark:shadow-2xl">
                        <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-white/10">
                            <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Update & Resubmit Application</h2>
                        </div>

                        <form onSubmit={handleResubmit} className="space-y-4">
                            {isSchool ? (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">School / Business Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.school_name}
                                            onChange={(e) => setData('school_name', e.target.value)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white dark:focus:border-blue-500"
                                        />
                                        {errors.school_name && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.school_name}</p>}
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Business Registration Number</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.registration_number}
                                                onChange={(e) => setData('registration_number', e.target.value)}
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white dark:focus:border-blue-500"
                                            />
                                            {errors.registration_number && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.registration_number}</p>}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Contact Person Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.contact_name}
                                                onChange={(e) => setData('contact_name', e.target.value)}
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white dark:focus:border-blue-500"
                                            />
                                            {errors.contact_name && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.contact_name}</p>}
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white dark:focus:border-blue-500"
                                            />
                                            {errors.phone && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.phone}</p>}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location (City / Area)</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white dark:focus:border-blue-500"
                                            />
                                            {errors.location && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.location}</p>}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white dark:focus:border-blue-500"
                                        />
                                        {errors.name && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-black/40 dark:text-white dark:focus:border-blue-500"
                                        />
                                        {errors.phone && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.phone}</p>}
                                    </div>
                                </>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition hover:shadow-blue-500/40 disabled:opacity-50 dark:from-[#4ba9ff] dark:to-[#1f6eff] dark:shadow-blue-600/30"
                                >
                                    {processing ? 'Submitting Revisions...' : 'Resubmit Application for Approval'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* What Happens Next & Application Summary Cards */}
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {/* What happens next mini list */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-xl">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                            What happens next
                        </h2>
                        <ul className="mt-4 space-y-4 text-xs text-slate-700 sm:text-sm dark:text-slate-300">
                            <li className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 ring-1 ring-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:ring-blue-500/40">
                                    1
                                </span>
                                <div>
                                    <strong className="block text-slate-900 dark:text-white">{isSchool ? 'Details Verification' : 'Instructor Review'}</strong>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        {isSchool
                                            ? 'We review your registration number, business credentials, and location details.'
                                            : 'We verify your contact information and coaching credentials.'}
                                    </span>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 ring-1 ring-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:ring-blue-500/40">
                                    2
                                </span>
                                <div>
                                    <strong className="block text-slate-900 dark:text-white">Approval Email</strong>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        You'll receive an email notification once your application has been reviewed and approved.
                                    </span>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 ring-1 ring-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:ring-blue-500/40">
                                    3
                                </span>
                                <div>
                                    <strong className="block text-slate-900 dark:text-white">Complete Your Profile</strong>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        {isSchool
                                            ? 'Log in to your School Dashboard to add facilities, kite gear, photos, and invite coaches to your roster.'
                                            : 'Log in to your Instructor Dashboard to set your rates, spots, teaching bio, and accept lessons.'}
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Submitted Details Snapshot */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-xl">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Submitted Application
                        </h2>

                        <div className="mt-4 divide-y divide-slate-200 text-xs sm:text-sm dark:divide-white/10">
                            {isSchool ? (
                                <>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-slate-400">School Name:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{application.school_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-slate-400">Reg. Number:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{application.registration_number || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-slate-400">Contact Person:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{application.contact_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-slate-400">Location:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{application.location || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{application.phone || 'N/A'}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-slate-400">Full Name:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{application.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-slate-400">Email:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{application.email}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                                        <span className="font-semibold text-slate-900 dark:text-white">{application.phone || 'N/A'}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between py-2.5">
                                <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
                                <span className={`font-bold capitalize ${isRejected ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                    {application.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
                            Need urgent help? Reach out at{' '}
                            <a href="mailto:support@kitelink.com" className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                support@kitelink.com
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="relative z-10 border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 dark:border-white/5 dark:text-white/40">
                <p>&copy; {new Date().getFullYear()} Winduo. All rights reserved.</p>
            </footer>
        </div>
    );
}
