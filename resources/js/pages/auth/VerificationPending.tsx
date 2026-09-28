import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Building2,
    CheckCircle2,
    Clock,
    FileText,
    LogOut,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    Send,
    Shield,
    ShieldCheck,
    Sparkles,
    User,
} from 'lucide-react';
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
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#070b12] font-sans text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white">
            {/* Background Image Overlay */}
            <img
                src="https://media.istockphoto.com/id/588369448/photo/kite-surfing-man-in-the-caribbean.jpg?s=1024x1024&w=is&k=20&c=jFqNdOMzlvtr-0QOAspQHODed554keOuClit63vzl2M="
                alt="Ocean Background"
                className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover brightness-[0.35] contrast-[1.1] saturate-[1.2]"
            />

            {/* Dark Radial Gradient */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background: 'radial-gradient(circle at 50% 20%, rgba(10, 30, 60, 0.85) 0%, rgba(7, 11, 18, 0.96) 100%)',
                }}
            />

            {/* Top Navigation Bar without sidebar */}
            <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
                <Link href={route('home')} className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#5bb4ff]/40 bg-gradient-to-br from-[#1f6eff]/30 to-[#5bb4ff]/15 shadow-[0_0_12px_rgba(91,180,255,0.3)]">
                        <i className="fas fa-wind text-lg text-[#5bb4ff] drop-shadow-[0_0_8px_rgba(91,180,255,0.6)] transition-transform group-hover:rotate-6" />
                    </div>
                    <span className="bg-gradient-to-r from-[#b8e6ff] via-[#8acbff] to-[#4da6ff] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
                        KiteLink
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                        Signed in as {application.email}
                    </span>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-200"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
                {/* Hero Status Card */}
                <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.08] p-6 shadow-2xl shadow-black/70 backdrop-blur-2xl transition-all sm:p-10">
                    <div className="flex flex-col items-center text-center">
                        {/* Status Icon */}
                        {isRejected ? (
                            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/20 text-rose-400 ring-8 ring-rose-500/10 shadow-lg shadow-rose-900/30">
                                <AlertCircle className="h-10 w-10 animate-pulse" />
                            </div>
                        ) : (
                            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/20 text-amber-300 ring-8 ring-amber-500/10 shadow-lg shadow-amber-900/30">
                                <Clock className="h-10 w-10 animate-pulse" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                    <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-400" />
                                </span>
                            </div>
                        )}

                        {/* Status Pill Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold tracking-wide uppercase text-slate-200">
                            {isRejected ? (
                                <>
                                    <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                                    <span>Action Required: Revisions Requested</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="h-3.5 w-3.5 text-amber-400" />
                                    <span>Verification In Progress</span>
                                </>
                            )}
                        </div>

                        {/* Heading */}
                        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                            {isRejected
                                ? 'Application Needs Revision'
                                : 'Application Submitted'}
                        </h1>

                        {/* Reassuring Body Text */}
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                            {isRejected
                                ? `The KiteLink verification team reviewed your ${isSchool ? 'school' : 'instructor'} application and requested updates before granting approval.`
                                : `Thanks for registering with KiteLink. Our team is reviewing your ${isSchool ? 'school' : 'instructor'} application and will notify you by email once it's approved. This usually takes 1–2 business days.`}
                        </p>

                        {/* Rejection Feedback Box */}
                        {isRejected && application.rejection_reason && (
                            <div className="mt-6 w-full rounded-2xl border border-rose-500/30 bg-rose-950/40 p-5 text-left backdrop-blur-md">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                                    <div className="space-y-1">
                                        <h2 className="text-sm font-bold text-rose-200">Feedback from Reviewer:</h2>
                                        <p className="text-sm leading-relaxed text-rose-300/90 whitespace-pre-line">
                                            {application.rejection_reason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => router.reload()}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 hover:border-white/30"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Check Status
                            </button>

                            {isRejected && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500"
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
                    <div className="mt-8 rounded-3xl border border-blue-500/30 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
                        <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                            <Send className="h-5 w-5 text-blue-400" />
                            <h2 className="text-lg font-bold text-white">Update & Resubmit Application</h2>
                        </div>

                        <form onSubmit={handleResubmit} className="space-y-4">
                            {isSchool ? (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">School / Business Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.school_name}
                                            onChange={(e) => setData('school_name', e.target.value)}
                                            className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        />
                                        {errors.school_name && <p className="text-xs text-rose-400">{errors.school_name}</p>}
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-300">Business Registration Number</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.registration_number}
                                                onChange={(e) => setData('registration_number', e.target.value)}
                                                className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                            />
                                            {errors.registration_number && <p className="text-xs text-rose-400">{errors.registration_number}</p>}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-300">Contact Person Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.contact_name}
                                                onChange={(e) => setData('contact_name', e.target.value)}
                                                className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                            />
                                            {errors.contact_name && <p className="text-xs text-rose-400">{errors.contact_name}</p>}
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                            />
                                            {errors.phone && <p className="text-xs text-rose-400">{errors.phone}</p>}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-300">Location (City / Area)</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                            />
                                            {errors.location && <p className="text-xs text-rose-400">{errors.location}</p>}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        />
                                        {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        />
                                        {errors.phone && <p className="text-xs text-rose-400">{errors.phone}</p>}
                                    </div>
                                </>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-400 hover:to-indigo-500 disabled:opacity-50"
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
                    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl">
                        <h2 className="flex items-center gap-2 text-base font-bold text-white">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            What happens next
                        </h2>
                        <ul className="mt-4 space-y-4 text-xs sm:text-sm text-slate-300">
                            <li className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 ring-1 ring-blue-500/40">
                                    1
                                </span>
                                <div>
                                    <strong className="block text-white">
                                        {isSchool ? 'Details Verification' : 'Instructor Review'}
                                    </strong>
                                    <span className="text-slate-400">
                                        {isSchool
                                            ? 'We review your registration number, business credentials, and location details.'
                                            : 'We verify your contact information and coaching credentials.'}
                                    </span>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 ring-1 ring-blue-500/40">
                                    2
                                </span>
                                <div>
                                    <strong className="block text-white">Approval Email</strong>
                                    <span className="text-slate-400">
                                        You'll receive an email notification once your application has been reviewed and approved.
                                    </span>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 ring-1 ring-blue-500/40">
                                    3
                                </span>
                                <div>
                                    <strong className="block text-white">Complete Your Profile</strong>
                                    <span className="text-slate-400">
                                        {isSchool
                                            ? 'Log in to your School Dashboard to add facilities, kite gear, photos, and invite coaches to your roster.'
                                            : 'Log in to your Instructor Dashboard to set your rates, spots, teaching bio, and accept lessons.'}
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Submitted Details Snapshot */}
                    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-xl backdrop-blur-xl">
                        <h2 className="flex items-center gap-2 text-base font-bold text-white">
                            <FileText className="h-5 w-5 text-blue-400" />
                            Submitted Application
                        </h2>

                        <div className="mt-4 divide-y divide-white/10 text-xs sm:text-sm">
                            {isSchool ? (
                                <>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-400">School Name:</span>
                                        <span className="font-semibold text-white">{application.school_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-400">Reg. Number:</span>
                                        <span className="font-semibold text-white">{application.registration_number || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-400">Contact Person:</span>
                                        <span className="font-semibold text-white">{application.contact_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-400">Location:</span>
                                        <span className="font-semibold text-white">{application.location || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-400">Phone:</span>
                                        <span className="font-semibold text-white">{application.phone || 'N/A'}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-400">Full Name:</span>
                                        <span className="font-semibold text-white">{application.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-400">Email:</span>
                                        <span className="font-semibold text-white">{application.email}</span>
                                    </div>
                                    <div className="flex justify-between py-2.5">
                                        <span className="text-slate-400">Phone:</span>
                                        <span className="font-semibold text-white">{application.phone || 'N/A'}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between py-2.5">
                                <span className="text-slate-400">Current Status:</span>
                                <span className={`font-bold capitalize ${isRejected ? 'text-rose-400' : 'text-amber-400'}`}>
                                    {application.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-2 text-xs text-slate-400">
                            Need urgent help? Reach out at{' '}
                            <a href="mailto:support@kitelink.com" className="text-blue-400 underline hover:text-blue-300">
                                support@kitelink.com
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="relative z-10 border-t border-white/5 py-6 text-center text-xs text-white/40">
                <p>&copy; {new Date().getFullYear()} KiteLink. All rights reserved.</p>
            </footer>
        </div>
    );
}
