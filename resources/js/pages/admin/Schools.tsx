import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Building2,
    Eye,
    Globe,
    MapPin,
    Phone,
    Power,
    Search,
    Trash2,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface SchoolItem {
    id: number;
    name: string;
    slug?: string | null;
    location?: string | null;
    description?: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    phone?: string | null;
    website?: string | null;
    logo?: string | null;
    created_at: string;
    instructors_count: number;
    user?: {
        name: string;
        email: string;
    };
}

interface SchoolsProps {
    schools: {
        data: SchoolItem[];
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
    { title: 'Schools', href: '/admin/schools' },
];

export default function Schools({ schools, filters, counts }: SchoolsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(null);

    const applyFilter = (newStatus?: string, newSearch?: string) => {
        router.get(
            '/admin/schools',
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

    const handleSuspend = (school: SchoolItem) => {
        const isSuspended = school.status === 'suspended';
        const actionText = isSuspended ? 'reactivate' : 'suspend';
        if (confirm(`Are you sure you want to ${actionText} ${school.name}?`)) {
            const url = isSuspended
                ? `/admin/schools/${school.id}/reactivate`
                : `/admin/schools/${school.id}/suspend`;
            router.post(url, {}, { preserveScroll: true });
        }
    };

    const handleDelete = (school: SchoolItem) => {
        if (confirm(`Are you sure you want to delete ${school.name}? It will be soft deleted.`)) {
            router.delete(`/admin/schools/${school.id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kite Schools Management - KiteLink Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Kite Schools & Centers
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Manage partner kitesurf schools, centers, and affiliated instructors.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                            {counts.total} Centers ({counts.approved} Approved, {counts.suspended} Suspended)
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
                            placeholder="Search by school name, location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
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
                                    <th className="py-3.5 px-4">School / Center</th>
                                    <th className="py-3.5 px-4">Location</th>
                                    <th className="py-3.5 px-4">Instructors</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs dark:divide-white/5">
                                {schools.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500">
                                            No schools found matching criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    schools.data.map((sc) => {
                                        const isSuspended = sc.status === 'suspended';
                                        return (
                                            <tr key={sc.id} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-sm font-bold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                                            {sc.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white">
                                                                {sc.name}
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                                {sc.user?.email || 'No email attached'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                                                    {sc.location || 'Not set'}
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                                                    {sc.instructors_count} instructors
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                                                            sc.status === 'approved'
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                : sc.status === 'pending'
                                                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                                                  : sc.status === 'suspended'
                                                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                                                                    : 'bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        {sc.status}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedSchool(sc)}
                                                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleSuspend(sc)}
                                                            className={`rounded-lg p-1.5 transition ${
                                                                isSuspended
                                                                    ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                                                    : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                                            }`}
                                                            title={isSuspended ? 'Reactivate School' : 'Suspend School'}
                                                        >
                                                            <Power className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(sc)}
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
                    {schools.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-white/5">
                            <span className="text-xs text-slate-500">
                                Page {schools.current_page} of {schools.last_page}
                            </span>
                            <div className="flex items-center gap-1">
                                {schools.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                                            link.active
                                                ? 'bg-purple-600 text-white'
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

            {/* School Detail Modal */}
            {selectedSchool && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Kite School Details
                            </h2>
                            <button
                                type="button"
                                onClick={() => setSelectedSchool(null)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-lg font-bold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                    {selectedSchool.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                        {selectedSchool.name}
                                    </h3>
                                    <p className="text-slate-500">{selectedSchool.user?.email || 'No email'}</p>
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                                        Status: {selectedSchool.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                                <div>
                                    <span className="text-slate-500">Location:</span>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {selectedSchool.location || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-slate-500">Instructors:</span>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {selectedSchool.instructors_count} instructors
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300">Description:</span>
                                <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                    {selectedSchool.description || 'No description provided.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedSchool(null)}
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
