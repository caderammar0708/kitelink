import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, FileCheck, FileText, ShieldAlert, Sparkles, User } from 'lucide-react';
import React from 'react';

interface InstructorData {
    id: number;
    status: 'pending' | 'rejected' | 'suspended' | string;
    rejection_reason?: string | null;
    bio?: string | null;
    certifications?: string | null;
    certification_proof?: string | null;
    location?: string | null;
    created_at?: string;
    user?: {
        name: string;
        email: string;
    };
}

export default function AwaitingApproval({ instructor }: { instructor: InstructorData }) {
    const isRejected = instructor.status === 'rejected';
    const isSuspended = instructor.status === 'suspended';

    return (
        <AppLayout breadcrumbs={[{ title: 'Instructor Dashboard', href: '/instructor/dashboard' }]}>
            <Head title={isRejected ? 'Application Needs Revision - KiteLink' : 'Application Under Review - KiteLink'} />

            <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Background ambient decorative glow */}
                <div className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-600/15" />

                {/* Main Status Hero Card */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/90 p-8 shadow-xl backdrop-blur-xl transition-all dark:border-white/10 dark:bg-[#0c1220]/90">
                    <div className="flex flex-col items-center text-center">
                        {/* Status Icon */}
                        {isRejected ? (
                            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/15 text-rose-500 ring-8 ring-rose-500/10 dark:bg-rose-500/20 dark:text-rose-400 dark:ring-rose-500/15">
                                <AlertCircle className="h-10 w-10 animate-bounce" />
                            </div>
                        ) : isSuspended ? (
                            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/15 text-amber-500 ring-8 ring-amber-500/10 dark:bg-amber-500/20 dark:text-amber-400">
                                <ShieldAlert className="h-10 w-10" />
                            </div>
                        ) : (
                            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/15 text-amber-500 ring-8 ring-amber-500/10 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-500/15">
                                <Clock className="h-10 w-10 animate-pulse" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                    <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-500" />
                                </span>
                            </div>
                        )}

                        {/* Title & Tagline */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                            {isRejected ? 'Application Status: Revisions Requested' : 'Application Status: Pending Review'}
                        </div>

                        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            {isRejected ? 'Your Profile Needs Revisions' : 'Awaiting Administrator Approval'}
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                            {isRejected
                                ? 'The KiteLink administration team reviewed your instructor application and requested some updates before approving your public listing.'
                                : 'Thank you for registering as a certified kitesurfing instructor on KiteLink! Our administration team is reviewing your profile and credentials.'}
                        </p>

                        {/* Rejection Reason Notice Box */}
                        {isRejected && instructor.rejection_reason && (
                            <div className="mt-6 w-full max-w-2xl rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-left dark:border-rose-900/50 dark:bg-rose-950/20">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                                    <div>
                                        <h2 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                                            Feedback from Admin:
                                        </h2>
                                        <p className="mt-1 text-sm leading-relaxed text-rose-800 dark:text-rose-300 whitespace-pre-line">
                                            {instructor.rejection_reason}
                                        </p>
                                        <p className="mt-3 text-xs text-rose-700/80 dark:text-rose-400/80">
                                            💡 Please edit your profile to address these points. Once updated and saved, your application will automatically return to pending review.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/instructor/profile"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                <User className="h-4 w-4" />
                                {isRejected ? 'Edit & Resubmit Profile' : 'Edit Profile & Certifications'}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* What happens next & Current Profile Summary Grid */}
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {/* Next Steps Card */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]/70">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            What to Expect Next
                        </h2>
                        <ul className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex items-start gap-2.5">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                                    1
                                </span>
                                <span>
                                    <strong>Admin Review:</strong> Admins check your qualifications (IKO/VDWS/etc.) and profile proof documents.
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                                    2
                                </span>
                                <span>
                                    <strong>Instant Notification:</strong> You'll receive a bell notification and chime as soon as your account is approved.
                                </span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                                    3
                                </span>
                                <span>
                                    <strong>Public Discovery:</strong> Once approved, your profile will be listed in the public instructor directory to accept bookings.
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Submitted Details Snapshot */}
                    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]/70">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                            <FileText className="h-5 w-5 text-blue-500" />
                            Submitted Credentials
                        </h2>

                        <div className="mt-4 divide-y divide-slate-100 text-xs sm:text-sm dark:divide-white/5">
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500 dark:text-slate-400">Certifications:</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                    {instructor.certifications || 'Not provided yet'}
                                </span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500 dark:text-slate-400">Proof Document:</span>
                                <span>
                                    {instructor.certification_proof ? (
                                        <a
                                            href={instructor.certification_proof}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            <FileCheck className="h-3.5 w-3.5" />
                                            View Uploaded Proof
                                        </a>
                                    ) : (
                                        <span className="text-amber-600 dark:text-amber-400">No document attached</span>
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500 dark:text-slate-400">Location:</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                    {instructor.location || 'Not set'}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-2">
                            <Link
                                href="/instructor/profile"
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Update or attach new certification document &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
