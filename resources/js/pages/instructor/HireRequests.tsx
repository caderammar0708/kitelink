import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    Handshake,
    MapPin,
    MessageSquare,
    Send,
    Sparkles,
    X,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface School {
    id: number;
    name: string;
    location?: string;
    description?: string;
}

interface HireRequest {
    id: number;
    school_id: number;
    school?: School;
    proposed_start: string;
    proposed_end: string;
    proposed_rate: number;
    location?: string;
    message?: string;
    status: 'pending' | 'accepted' | 'declined' | 'countered' | string;
    counter_rate?: number;
    counter_message?: string;
    created_at: string;
}

interface HireRequestsProps {
    hireRequests?: HireRequest[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
    {
        title: 'School Hire Requests',
        href: '/instructor/hire-requests',
    },
];

export default function HireRequests({ hireRequests = [] }: HireRequestsProps) {
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [counterModalRequest, setCounterModalRequest] = useState<HireRequest | null>(null);
    const [counterRate, setCounterRate] = useState('');
    const [counterNote, setCounterNote] = useState('');

    const handleAccept = (id: number) => {
        setActionLoading(id);
        router.post(
            route('instructor.hire-requests.accept', id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setActionLoading(null),
            }
        );
    };

    const handleDecline = (id: number) => {
        setActionLoading(id);
        router.post(
            route('instructor.hire-requests.decline', id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setActionLoading(null),
            }
        );
    };

    const handleSendCounter = (e: React.FormEvent) => {
        e.preventDefault();
        if (!counterModalRequest || !counterRate) return;

        setActionLoading(counterModalRequest.id);
        router.post(
            route('instructor.hire-requests.counter', counterModalRequest.id),
            {
                counter_rate: counterRate,
                counter_message: counterNote,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCounterModalRequest(null);
                    setCounterRate('');
                    setCounterNote('');
                },
                onFinish: () => setActionLoading(null),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="School Hire Requests - KiteLink" />

            <div className="relative min-h-full space-y-6 p-4 text-slate-900 selection:bg-blue-600/30 selection:text-blue-900 sm:p-6 lg:p-8 dark:text-slate-100 dark:selection:bg-[#3b82f6]/30 dark:selection:text-white">
                {/* Header Banner */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            <Briefcase className="h-7 w-7 text-blue-600 dark:text-[#38bdf8]" />
                            Kite School Hire Offers
                        </h1>
                        <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                            Certified kite centers and camps can invite you to teach full-time or seasonal camps
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-[#8acbff]">
                        <Handshake className="h-4 w-4" />
                        Verified School Contracts
                    </div>
                </div>

                {/* Hire Requests Grid */}
                {hireRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-16 text-center shadow-sm dark:border-white/10 dark:bg-slate-950/20">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-[#38bdf8]/30 dark:bg-gradient-to-br dark:from-[#0284c7]/20 dark:to-[#38bdf8]/10 dark:text-[#38bdf8]">
                            <Briefcase className="h-7 w-7" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No School Hire Offers Yet</h3>
                        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                            Partner kite schools browse certified instructors for seasonal camps. New contracts and invitations will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {hireRequests.map((req) => {
                            const isPending = req.status === 'pending';
                            const isAccepted = req.status === 'accepted';
                            const isCountered = req.status === 'countered';

                            return (
                                <div
                                    key={req.id}
                                    className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-slate-300 sm:p-6 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:backdrop-blur-xl dark:hover:border-white/20"
                                >
                                    <div className="space-y-4">
                                        {/* School Title & Status */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 shadow-sm dark:border-sky-500/40 dark:bg-sky-950/60 dark:text-[#38bdf8]">
                                                    <Building2 className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                        {req.school?.name || 'Kite Center'}
                                                    </h3>
                                                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                        <MapPin className="h-3 w-3 text-blue-500 dark:text-[#38bdf8]" />
                                                        {req.location || req.school?.location || 'Kalpitiya, Sri Lanka'}
                                                    </span>
                                                </div>
                                            </div>

                                            <span
                                                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                    isPending
                                                        ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300'
                                                        : isAccepted
                                                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300'
                                                          : isCountered
                                                            ? 'border-blue-300 bg-blue-50 text-blue-800 dark:border-sky-500/40 dark:bg-sky-500/15 dark:text-sky-300'
                                                            : 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-300'
                                                }`}
                                            >
                                                {req.status}
                                            </span>
                                        </div>

                                        {/* Contract Period & Rate */}
                                        <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3 text-xs dark:border-white/5 dark:bg-slate-950/40">
                                            <div>
                                                <span className="block text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                                                    Contract Dates
                                                </span>
                                                <span className="mt-0.5 flex items-center gap-1 font-semibold text-slate-900 dark:text-white">
                                                    <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                                    {req.proposed_start} → {req.proposed_end}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="block text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                                                    Offered Compensation
                                                </span>
                                                <span className="mt-0.5 flex items-center gap-1 font-extrabold text-emerald-600 dark:text-emerald-400">
                                                    <DollarSign className="h-3.5 w-3.5" />
                                                    ${req.proposed_rate} / day
                                                </span>
                                            </div>
                                        </div>

                                        {/* Message from School */}
                                        {req.message && (
                                            <div className="text-xs text-slate-700 dark:text-slate-300">
                                                <span className="font-semibold text-slate-500 dark:text-slate-400">School Note: </span>
                                                "{req.message}"
                                            </div>
                                        )}

                                        {/* Counter Offer details if present */}
                                        {isCountered && req.counter_rate && (
                                            <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-2.5 text-xs text-blue-900 dark:border-sky-500/30 dark:bg-sky-950/30 dark:text-sky-200">
                                                <span className="font-bold">Your Counter-Offer:</span> ${req.counter_rate}/day
                                                {req.counter_message && ` • "${req.counter_message}"`}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    {isPending && (
                                        <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCounterModalRequest(req);
                                                    setCounterRate(String(req.proposed_rate));
                                                }}
                                                className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/10"
                                            >
                                                Counter-Offer
                                            </button>

                                            <button
                                                type="button"
                                                disabled={actionLoading === req.id}
                                                onClick={() => handleDecline(req.id)}
                                                className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
                                            >
                                                Decline
                                            </button>

                                            <button
                                                type="button"
                                                disabled={actionLoading === req.id}
                                                onClick={() => handleAccept(req.id)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50"
                                            >
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                Accept Offer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Counter-Offer Modal */}
            {counterModalRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md dark:bg-black/75">
                    <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 dark:border-white/20 dark:bg-[#070b12] dark:text-slate-100">
                        <button
                            type="button"
                            onClick={() => setCounterModalRequest(null)}
                            className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Send Counter-Offer to {counterModalRequest.school?.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Propose a revised daily rate or include lodging/gear requirements.
                        </p>

                        <form onSubmit={handleSendCounter} className="mt-4 space-y-4 text-xs">
                            <div>
                                <label className="block text-[11px] font-semibold uppercase text-slate-700 dark:text-slate-300">
                                    Proposed Daily Rate ($ USD / day)
                                </label>
                                <div className="relative mt-1">
                                    <DollarSign className="absolute top-2.5 left-3 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={counterRate}
                                        onChange={(e) => setCounterRate(e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 bg-white py-2 pr-3 pl-8 text-xs text-slate-900 focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:focus:border-[#3b82f6]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold uppercase text-slate-700 dark:text-slate-300">
                                    Optional Note to School Manager
                                </label>
                                <textarea
                                    rows={3}
                                    value={counterNote}
                                    onChange={(e) => setCounterNote(e.target.value)}
                                    placeholder="e.g. Rate includes IKO insurance and VDWS gear support. Requires lagoon airport shuttle."
                                    className="mt-1 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-500 dark:focus:border-[#3b82f6]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setCounterModalRequest(null)}
                                    className="rounded-xl px-3 py-2 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:scale-105 dark:from-[#4ba9ff] dark:to-[#1f6eff]"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    Submit Counter-Offer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
