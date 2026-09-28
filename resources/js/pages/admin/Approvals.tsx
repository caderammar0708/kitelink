import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Award,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    ExternalLink,
    Eye,
    FileCheck,
    FileText,
    Filter,
    GraduationCap,
    HelpCircle,
    MapPin,
    MessageSquare,
    Search,
    Send,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    User,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface ApprovalItem {
    id: number;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    rejection_reason?: string | null;
    reviewed_at?: string | null;
    certification_proof?: string | null;
    certifications?: string | null;
    license_number?: string | null;
    experience_years?: number | null;
    location?: string | null;
    bio?: string | null;
    name?: string; // For school
    registration_number?: string | null;
    contact_name?: string | null;
    phone?: string | null;
    created_at: string;
    profile_photo?: string | null;
    logo?: string | null;
    user?: {
        id: number;
        name: string;
        email: string;
        phone?: string | null;
        profile_picture?: string | null;
        created_at: string;
    };
    reviewer?: {
        name: string;
    };
}

interface ApprovalsProps {
    items: {
        data: ApprovalItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    tab: 'instructors' | 'schools';
    filters: {
        status: string;
        search: string;
    };
    counts: {
        instructor_pending: number;
        school_pending: number;
        total_pending: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Approvals Queue', href: '/admin/approvals' },
];

export default function Approvals({ items, tab, filters, counts }: ApprovalsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [activeTab, setActiveTab] = useState<'instructors' | 'schools'>(tab);
    const [statusFilter, setStatusFilter] = useState(filters.status || 'pending');

    // Reject Modal state
    const [rejectItem, setRejectItem] = useState<ApprovalItem | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    // Request Info Modal state
    const [infoItem, setInfoItem] = useState<ApprovalItem | null>(null);
    const [infoMessage, setInfoMessage] = useState('');
    const [isSendingInfo, setIsSendingInfo] = useState(false);

    // Document Preview Modal state
    const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

    // Filter update helper
    const applyFilters = (newTab?: 'instructors' | 'schools', newStatus?: string, newSearch?: string) => {
        router.get(
            '/admin/approvals',
            {
                tab: newTab ?? activeTab,
                status: newStatus ?? statusFilter,
                search: newSearch ?? searchTerm,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleTabChange = (t: 'instructors' | 'schools') => {
        setActiveTab(t);
        applyFilters(t, statusFilter, searchTerm);
    };

    const handleStatusChange = (s: string) => {
        setStatusFilter(s);
        applyFilters(activeTab, s, searchTerm);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(activeTab, statusFilter, searchTerm);
    };

    // Actions
    const handleApprove = (item: ApprovalItem) => {
        const routeName =
            activeTab === 'instructors'
                ? `/admin/approvals/instructors/${item.id}/approve`
                : `/admin/approvals/schools/${item.id}/approve`;

        if (confirm(`Are you sure you want to approve this ${activeTab === 'instructors' ? 'instructor' : 'school'} application?`)) {
            router.post(routeName, {}, { preserveScroll: true });
        }
    };

    const submitReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectItem || !rejectReason.trim()) return;

        setIsRejecting(true);
        const routeName =
            activeTab === 'instructors'
                ? `/admin/approvals/instructors/${rejectItem.id}/reject`
                : `/admin/approvals/schools/${rejectItem.id}/reject`;

        router.post(
            routeName,
            { reason: rejectReason },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsRejecting(false);
                    setRejectItem(null);
                    setRejectReason('');
                },
            }
        );
    };

    const submitRequestInfo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!infoItem || !infoMessage.trim()) return;

        setIsSendingInfo(true);
        const routeName =
            activeTab === 'instructors'
                ? `/admin/approvals/instructors/${infoItem.id}/request-info`
                : `/admin/approvals/schools/${infoItem.id}/request-info`;

        router.post(
            routeName,
            { message: infoMessage },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsSendingInfo(false);
                    setInfoItem(null);
                    setInfoMessage('');
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Approvals Queue - KiteLink Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Verification & Approval Center
                        </div>
                        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Account Approvals
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Review instructor certifications, verify kite center credentials, approve or reject applications with audit feedback.
                        </p>
                    </div>

                    {/* Pending Count Alert Pill */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                            <span className="flex h-3 w-3">
                                {counts.total_pending > 0 && (
                                    <span className="h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                )}
                            </span>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                Total Pending Review:
                            </span>
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                {counts.total_pending}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs & Filters Bar */}
                <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#0c1220]">
                    {/* Role Tabs */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => handleTabChange('instructors')}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                                activeTab === 'instructors'
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                            }`}
                        >
                            <GraduationCap className="h-4 w-4" />
                            Instructors
                            {counts.instructor_pending > 0 && (
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                        activeTab === 'instructors' ? 'bg-white text-blue-700' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                                    }`}
                                >
                                    {counts.instructor_pending}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTabChange('schools')}
                            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                                activeTab === 'schools'
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                            }`}
                        >
                            <Building2 className="h-4 w-4" />
                            Schools
                            {counts.school_pending > 0 && (
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                        activeTab === 'schools' ? 'bg-white text-purple-700' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                                    }`}
                                >
                                    {counts.school_pending}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Status Filters & Search Form */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Status Pills */}
                        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
                            {(['pending', 'approved', 'rejected', 'all'] as const).map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => handleStatusChange(s)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                                        statusFilter === s
                                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="relative min-w-[200px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                            />
                        </form>
                    </div>
                </div>

                {/* Approvals Cards Listing */}
                {items.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-white/10">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4 dark:bg-white/5">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                            All Caught Up!
                        </h2>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                            There are currently no {statusFilter !== 'all' ? statusFilter : ''} applications in the {activeTab} queue.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.data.map((item) => {
                            const isSchoolTab = activeTab === 'schools';
                            const schoolName = item.name || item.user?.name || 'School';
                            const instructorName = item.user?.name ?? 'Instructor';
                            const displayName = isSchoolTab ? schoolName : instructorName;
                            const email = item.user?.email ?? 'N/A';
                            const phone = item.phone || item.user?.phone || 'N/A';
                            const contactPerson = item.contact_name || item.user?.name || 'N/A';
                            const regNumber = item.registration_number || 'N/A';
                            const avatar = isSchoolTab ? item.logo : (item.user?.profile_picture || item.profile_photo);
                            const isPending = item.status === 'pending';
                            const isApproved = item.status === 'approved';
                            const isRejected = item.status === 'rejected';

                            return (
                                <div
                                    key={item.id}
                                    className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all hover:border-slate-300 dark:border-white/10 dark:bg-[#0c1220]"
                                >
                                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                        {/* Left Profile Info */}
                                        <div className="flex items-start gap-4">
                                            {/* Photo */}
                                            {avatar ? (
                                                <img
                                                    src={avatar}
                                                    alt={displayName}
                                                    className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-white/10"
                                                />
                                            ) : (
                                                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md ${
                                                    isSchoolTab ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                }`}>
                                                    {isSchoolTab ? <Building2 className="h-7 w-7" /> : displayName.charAt(0)}
                                                </div>
                                            )}

                                            {/* Name, Email, Status */}
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {displayName}
                                                    </h2>

                                                    {/* Status Badge */}
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                                                            isPending
                                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                                : isApproved
                                                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                  : isRejected
                                                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                                                                    : 'bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        {isPending && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                                                        {item.status}
                                                    </span>

                                                    {isSchoolTab && regNumber !== 'N/A' && (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/30 dark:text-purple-300">
                                                            <FileText className="h-3 w-3" />
                                                            Reg: {regNumber}
                                                        </span>
                                                    )}

                                                    {!isSchoolTab && item.license_number && (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300">
                                                            <Award className="h-3 w-3" />
                                                            License: {item.license_number}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {email} {phone !== 'N/A' && `• ${phone}`}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    {isSchoolTab && (
                                                        <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                                            <User className="h-3.5 w-3.5 text-purple-500" />
                                                            Contact: {contactPerson}
                                                        </span>
                                                    )}
                                                    {item.location && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                                            {item.location}
                                                        </span>
                                                    )}
                                                    {!isSchoolTab && item.experience_years !== undefined && item.experience_years !== null && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                                            {item.experience_years} years experience
                                                        </span>
                                                    )}
                                                    <span className="text-slate-400">
                                                        Submitted: {new Date(item.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap items-center gap-2 self-start">
                                            {/* Approve Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleApprove(item)}
                                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                                Approve
                                            </button>

                                            {/* Reject Button */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setRejectItem(item);
                                                    setRejectReason('');
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300 dark:hover:bg-rose-900/30"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                                Reject
                                            </button>

                                            {/* Request Info Button */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setInfoItem(item);
                                                    setInfoMessage('');
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                                            >
                                                <HelpCircle className="h-3.5 w-3.5" />
                                                Request Info
                                            </button>
                                        </div>
                                    </div>

                                    {/* Middle Details Box: for Schools vs Instructors */}
                                    {isSchoolTab ? (
                                        <div className="mt-4 grid gap-3 rounded-2xl border border-purple-100 bg-purple-50/40 p-4 text-xs sm:text-sm sm:grid-cols-3 dark:border-purple-900/20 dark:bg-purple-950/10">
                                            <div>
                                                <span className="block text-slate-500 dark:text-slate-400">Business Registration:</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{regNumber}</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-500 dark:text-slate-400">Contact Person:</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{contactPerson}</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-500 dark:text-slate-400">Phone Number:</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{phone}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-xs sm:text-sm lg:grid-cols-3 dark:border-white/5 dark:bg-white/[0.02]">
                                            {/* Certification / License Number & Registry Verification */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                                                    <Award className="h-4 w-4 text-blue-500" />
                                                    Certification / License Number
                                                </div>

                                                <div className="rounded-xl border border-blue-200/90 bg-blue-50/90 p-3 shadow-xs dark:border-blue-900/50 dark:bg-blue-950/30">
                                                    <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                                        License / ID for Verification
                                                    </span>
                                                    <div className="mt-1 font-mono text-sm font-extrabold text-blue-950 dark:text-blue-100">
                                                        {item.license_number ? (
                                                            <span className="tracking-wide select-all">{item.license_number}</span>
                                                        ) : (
                                                            <span className="text-amber-600 font-sans text-xs dark:text-amber-400">Pending profile completion</span>
                                                        )}
                                                    </div>
                                                    <p className="mt-1.5 text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                                                        Verify this ID against IKO/VDWS registry before approving.
                                                    </p>
                                                </div>

                                                {/* Uploaded Proof or Cert Notes */}
                                                <div className="pt-0.5">
                                                    {item.certification_proof ? (
                                                        <a
                                                            href={item.certification_proof}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-300"
                                                        >
                                                            <FileCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                                            View Certification Document
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    ) : item.certifications ? (
                                                        <span className="text-xs text-slate-600 dark:text-slate-400">
                                                            <strong>Certifications:</strong> {item.certifications}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                                                            <AlertCircle className="h-3 w-3" />
                                                            No certificate document attached
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bio / Description */}
                                            <div className="space-y-1 lg:col-span-2">
                                                <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                                                    <FileText className="h-4 w-4 text-indigo-500" />
                                                    Bio / Overview
                                                </div>
                                                <p className="line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                                    {item.bio || 'No bio submitted yet.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rejection / Reviewer Banner (if already reviewed) */}
                                    {isRejected && item.rejection_reason && (
                                        <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
                                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                                            <div>
                                                <span className="font-bold">Rejection reason:</span> {item.rejection_reason}
                                                {item.reviewer && (
                                                    <span className="ml-2 text-rose-700/70 dark:text-rose-300/70">
                                                        (Reviewed by {item.reviewer.name} on{' '}
                                                        {item.reviewed_at ? new Date(item.reviewed_at).toLocaleDateString() : 'N/A'})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {isApproved && item.reviewer && (
                                        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Approved by {item.reviewer.name} on{' '}
                                            {item.reviewed_at ? new Date(item.reviewed_at).toLocaleDateString() : 'N/A'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {items.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-white/10">
                        <span className="text-xs text-slate-500">
                            Showing page {items.current_page} of {items.last_page} ({items.total} total)
                        </span>

                        <div className="flex items-center gap-1">
                            {items.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url
                                              ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                                              : 'opacity-40 text-slate-400'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
                            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                                <AlertCircle className="h-5 w-5" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Reject Application
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setRejectItem(null)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={submitReject} className="mt-4 space-y-4">
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                                Please specify the reason for rejecting{' '}
                                <strong>{rejectItem.user?.name || rejectItem.name}</strong>. This feedback will be sent directly to the user as a notification so they can update their profile and resubmit.
                            </p>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Rejection Reason (Required)
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="e.g. Please upload an official IKO level 1 or VDWS certificate showing your license number and expiry date."
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setRejectItem(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isRejecting || !rejectReason.trim()}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    {isRejecting ? 'Sending...' : 'Confirm Rejection'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Request More Info Modal */}
            {infoItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                <HelpCircle className="h-5 w-5" />
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                    Request More Information
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setInfoItem(null)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={submitRequestInfo} className="mt-4 space-y-4">
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                                Send a direct instruction to{' '}
                                <strong>{infoItem.user?.name || infoItem.name}</strong> asking for specific document clarification or missing details.
                            </p>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Message to applicant
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={infoMessage}
                                    onChange={(e) => setInfoMessage(e.target.value)}
                                    placeholder="e.g. Could you please provide a higher resolution scan of your instructor license?"
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setInfoItem(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSendingInfo || !infoMessage.trim()}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    {isSendingInfo ? 'Sending...' : 'Send Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
