import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle2,
    DollarSign,
    ExternalLink,
    Eye,
    FileCheck,
    GraduationCap,
    MapPin,
    MoreVertical,
    Power,
    Search,
    ShieldAlert,
    Trash2,
    User,
    UserCheck,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface InstructorItem {
    id: number;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    bio?: string | null;
    certifications?: string | null;
    certification_proof?: string | null;
    experience_years?: number | null;
    location?: string | null;
    hourly_rate?: number | null;
    daily_rate?: number | null;
    is_active: boolean;
    created_at: string;
    bookings_count: number;
    user?: {
        id: number;
        name: string;
        email: string;
        profile_picture?: string | null;
        is_suspended?: boolean;
    };
    school?: {
        id: number;
        name: string;
    };
}

interface InstructorsProps {
    instructors: {
        data: InstructorItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search: string;
        status: string;
    };
    counts: {
        total: number;
        approved: number;
        pending: number;
        suspended: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Instructors', href: '/admin/instructors' },
];

export default function Instructors({ instructors, filters, counts }: InstructorsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [selectedInstructor, setSelectedInstructor] = useState<InstructorItem | null>(null);

    const applyFilter = (newStatus?: string, newSearch?: string) => {
        router.get(
            '/admin/instructors',
            {
                status: newStatus ?? statusFilter,
                search: newSearch ?? search,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter(statusFilter, search);
    };

    const handleSuspend = (instructor: InstructorItem) => {
        const isSuspended = instructor.status === 'suspended';
        const actionText = isSuspended ? 'reactivate' : 'suspend';
        if (confirm(`Are you sure you want to ${actionText} ${instructor.user?.name}?`)) {
            const url = isSuspended
                ? `/admin/instructors/${instructor.id}/reactivate`
                : `/admin/instructors/${instructor.id}/suspend`;
            router.post(url, {}, { preserveScroll: true });
        }
    };

    const handleDelete = (instructor: InstructorItem) => {
        if (confirm(`Are you sure you want to delete ${instructor.user?.name}? This instructor will be soft-deleted.`)) {
            router.delete(`/admin/instructors/${instructor.id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Instructors Management - KiteLink Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Instructor Management
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            View all instructors, monitor bookings, manage suspension, and view certifications.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                            {counts.total} Total Instructors ({counts.approved} Approved, {counts.suspended} Suspended)
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
                        {(['all', 'approved', 'pending', 'suspended'] as const).map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(s);
                                    applyFilter(s, search);
                                }}
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

                    <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, location..."
                            value={search}
                            onChange={(e) => setSearch}
                            onInput={(e: any) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-400">
                                    <th className="py-3.5 px-4">Instructor</th>
                                    <th className="py-3.5 px-4">Location</th>
                                    <th className="py-3.5 px-4">Rate</th>
                                    <th className="py-3.5 px-4">Bookings</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs dark:divide-white/5">
                                {instructors.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500">
                                            No instructors found matching criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    instructors.data.map((inst) => {
                                        const isSuspended = inst.status === 'suspended';
                                        return (
                                            <tr key={inst.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        {inst.user?.profile_picture ? (
                                                            <img
                                                                src={inst.user.profile_picture}
                                                                alt={inst.user?.name}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                                {inst.user?.name?.charAt(0) || 'I'}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white">
                                                                {inst.user?.name || 'Unnamed'}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                                {inst.user?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                                    {inst.location || 'Not set'}
                                                </td>

                                                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                                                    {inst.hourly_rate ? `$${inst.hourly_rate}/hr` : 'Custom'}
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                                                    {inst.bookings_count} lessons
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                                                            inst.status === 'approved'
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                : inst.status === 'pending'
                                                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                                  : inst.status === 'suspended'
                                                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                                                                    : 'bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        {inst.status}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* Detail View Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedInstructor(inst)}
                                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                                                            title="View Profile Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>

                                                        {/* Suspend / Reactivate */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSuspend(inst)}
                                                            className={`rounded-lg p-1.5 transition ${
                                                                isSuspended
                                                                    ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                                                    : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                                            }`}
                                                            title={isSuspended ? 'Reactivate Instructor' : 'Suspend Instructor'}
                                                        >
                                                            <Power className="h-4 w-4" />
                                                        </button>

                                                        {/* Soft Delete */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(inst)}
                                                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                            title="Soft Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {instructors.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-white/5">
                            <span className="text-xs text-slate-500">
                                Page {instructors.current_page} of {instructors.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {instructors.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
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
            </div>

            {/* Profile Detail Slide-over / Modal */}
            {selectedInstructor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Instructor Profile Overview
                            </h2>
                            <button
                                type="button"
                                onClick={() => setSelectedInstructor(null)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                    {selectedInstructor.user?.name?.charAt(0) || 'I'}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        {selectedInstructor.user?.name}
                                    </h3>
                                    <p className="text-slate-500">{selectedInstructor.user?.email}</p>
                                    <span className="inline-block mt-1 font-semibold text-blue-600 dark:text-blue-400">
                                        Status: {selectedInstructor.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                                <div>
                                    <span className="text-slate-500">Location:</span>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {selectedInstructor.location || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Experience:</span>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {selectedInstructor.experience_years ? `${selectedInstructor.experience_years} years` : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Rates:</span>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        ${selectedInstructor.hourly_rate ?? 0}/hr • ${selectedInstructor.daily_rate ?? 0}/day
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Total Bookings:</span>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {selectedInstructor.bookings_count} bookings
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">Certifications:</span>
                                <p className="mt-1 text-slate-600 dark:text-slate-400">
                                    {selectedInstructor.certifications || 'None specified'}
                                </p>
                            </div>

                            {selectedInstructor.certification_proof && (
                                <div>
                                    <a
                                        href={selectedInstructor.certification_proof}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:underline dark:text-blue-400"
                                    >
                                        <FileCheck className="h-4 w-4" />
                                        Open Uploaded Proof Document &rarr;
                                    </a>
                                </div>
                            )}

                            <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">Bio:</span>
                                <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                    {selectedInstructor.bio || 'No biography written.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedInstructor(null)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
