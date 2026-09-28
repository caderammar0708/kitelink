import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Activity,
    Check,
    CheckCircle2,
    DollarSign,
    Lock,
    Mail,
    Phone,
    Save,
    Settings as SettingsIcon,
    Shield,
    ShieldAlert,
    Sliders,
    Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';

interface AuditLogItem {
    id: number;
    action: string;
    target_type: string;
    target_id: number | null;
    target_name: string | null;
    details: {
        summary?: string;
        reason?: string;
        [key: string]: unknown;
    } | null;
    ip_address: string | null;
    created_at: string;
    admin?: {
        name: string;
        email: string;
    };
}

interface SettingsProps {
    settings: {
        platform_name: string;
        support_email: string;
        contact_phone: string;
        require_instructor_approval: boolean;
        require_school_approval: boolean;
        booking_commission_percentage: number;
        allow_public_registration: boolean;
    };
    auditLogs: {
        data: AuditLogItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Settings & Security', href: '/admin/settings' },
];

export default function AdminSettings({ settings, auditLogs }: SettingsProps) {
    const [activeTab, setActiveTab] = useState<'settings' | 'audit'>('settings');

    const { data, setData, post, processing, recentlySuccessful, errors } = useForm({
        platform_name: settings.platform_name || 'KiteLink',
        support_email: settings.support_email || 'support@kitelink.com',
        contact_phone: settings.contact_phone || '+1 (555) 019-2834',
        require_instructor_approval: settings.require_instructor_approval,
        require_school_approval: settings.require_school_approval,
        booking_commission_percentage: settings.booking_commission_percentage,
        allow_public_registration: settings.allow_public_registration,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings', { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Platform Settings & Audit Logs - KiteLink Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Platform Settings & Audit Log
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Configure global platform policies, approval requirements, financial fees, and inspect security audit logs.
                        </p>
                    </div>

                    <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-white/5">
                        <button
                            type="button"
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                                activeTab === 'settings'
                                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <Sliders className="h-4 w-4" />
                            General Rules & Settings
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('audit')}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                                activeTab === 'audit'
                                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            <Shield className="h-4 w-4" />
                            Admin Audit Trail ({auditLogs.total})
                        </button>
                    </div>
                </div>

                {activeTab === 'settings' ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Section 1: Platform Branding & Contact */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-500" />
                                Platform Brand & Contact
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Public support contacts and platform identification.
                            </p>

                            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Platform Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.platform_name}
                                        onChange={(e) => setData('platform_name', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                    {errors.platform_name && <p className="text-xs text-rose-500 mt-1">{errors.platform_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Support Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.support_email}
                                        onChange={(e) => setData('support_email', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                    {errors.support_email && <p className="text-xs text-rose-500 mt-1">{errors.support_email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Support Phone
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Approval Rules */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Shield className="h-4 w-4 text-emerald-500" />
                                Listing & Approval Rules
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Control how new providers enter the public directory.
                            </p>

                            <div className="mt-4 divide-y divide-slate-100 dark:divide-white/5">
                                {/* Require Instructor Approval Toggle */}
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                                            Require Instructor Approval
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            When enabled, newly registered instructors must be reviewed and approved by admin before appearing in public listings.
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={data.require_instructor_approval}
                                        onChange={(e) => setData('require_instructor_approval', e.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Require School Approval Toggle */}
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                                            Require School / Center Approval
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Newly registered schools remain pending until verified.
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={data.require_school_approval}
                                        onChange={(e) => setData('require_school_approval', e.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Allow Public Registration */}
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                                            Allow Public Registrations
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Allow visitors to register new student, instructor, and school accounts.
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={data.allow_public_registration}
                                        onChange={(e) => setData('allow_public_registration', e.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Financial & Commission Settings */}
                        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-teal-500" />
                                Platform Commission
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Platform fee percentage collected on lesson bookings.
                            </p>

                            <div className="mt-4 max-w-xs">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                    Booking Commission Fee (%)
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.5"
                                        value={data.booking_commission_percentage}
                                        onChange={(e) => setData('booking_commission_percentage', parseFloat(e.target.value) || 0)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 pl-3 pr-8 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            {recentlySuccessful && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                                    <Check className="h-3.5 w-3.5" />
                                    Settings saved successfully!
                                </span>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Audit Log Trail Table */
                    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="p-4 border-b border-slate-100 dark:border-white/5">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Security & Administrative Audit Trail
                            </h2>
                            <p className="text-xs text-slate-500">
                                Detailed log of all approvals, rejections, suspensions, and configuration changes.
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-400">
                                        <th className="py-3 px-4">Timestamp</th>
                                        <th className="py-3 px-4">Admin</th>
                                        <th className="py-3 px-4">Action</th>
                                        <th className="py-3 px-4">Target</th>
                                        <th className="py-3 px-4">Summary / Notes</th>
                                        <th className="py-3 px-4 text-right">IP Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs dark:divide-white/5">
                                    {auditLogs.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-slate-500">
                                                No audit actions logged yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        auditLogs.data.map((log) => {
                                            const isApprove = log.action.includes('approve');
                                            const isReject = log.action.includes('reject');
                                            const isSuspend = log.action.includes('suspend');

                                            return (
                                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                                                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>

                                                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                                                        {log.admin?.name || 'System Admin'}
                                                    </td>

                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                                                                isApprove
                                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                    : isReject || isSuspend
                                                                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                                                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                                            }`}
                                                        >
                                                            {log.action.replace('_', ' ')}
                                                        </span>
                                                    </td>

                                                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                                                        {log.target_type}: {log.target_name || `#${log.target_id}`}
                                                    </td>

                                                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                                                        {log.details?.summary || log.details?.reason || JSON.stringify(log.details)}
                                                    </td>

                                                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-400">
                                                        {log.ip_address || '127.0.0.1'}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {auditLogs.last_page > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-white/5">
                                <span className="text-xs text-slate-500">
                                    Page {auditLogs.current_page} of {auditLogs.last_page}
                                </span>
                                <div className="flex items-center gap-1">
                                    {auditLogs.links.map((link, idx) => (
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
                )}
            </div>
        </AppLayout>
    );
}
