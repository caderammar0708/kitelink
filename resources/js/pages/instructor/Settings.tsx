import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Lock,
    Mail,
    Save,
    Settings as SettingsIcon,
    Shield,
    Trash2,
    UserX,
} from 'lucide-react';
import React, { useState } from 'react';

interface SettingsProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
    status?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
    {
        title: 'Account Settings',
        href: '/instructor/settings',
    },
];

export default function Settings({ user, status }: SettingsProps) {
    // Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Email Form
    const emailForm = useForm({
        email: user?.email || '',
    });

    // Notification Preferences State
    const [preferences, setPreferences] = useState({
        bookingAlerts: true,
        messageAlerts: true,
        payoutNotifs: true,
        seasonalSpotUpdates: false,
    });
    const [prefSaved, setPrefSaved] = useState(false);

    // Deactivate Form
    const deactivateForm = useForm({
        password: '',
    });
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post(route('instructor.settings.password'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        emailForm.post(route('instructor.settings.email'), {
            preserveScroll: true,
        });
    };

    const handleSavePreferences = () => {
        setPrefSaved(true);
        setTimeout(() => setPrefSaved(false), 3000);
    };

    const handleDeactivate = (e: React.FormEvent) => {
        e.preventDefault();
        deactivateForm.post(route('instructor.settings.deactivate'), {
            preserveScroll: true,
            onSuccess: () => setShowDeactivateModal(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account Settings - KiteLink" />

            <div className="relative mx-auto min-h-full max-w-4xl space-y-6 p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* Header */}
                <div>
                    <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                        <SettingsIcon className="h-7 w-7 text-[#5bb4ff]" />
                        Account &amp; Security Settings
                    </h1>
                    <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                        Manage your password, login credentials, notification channels, and account security
                    </p>
                </div>

                {/* Status banner */}
                {status && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        {status}
                    </div>
                )}

                {/* 1. Change Password */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl sm:p-8">
                    <h2 className="flex items-center gap-2 text-base font-bold text-white">
                        <KeyRound className="h-5 w-5 text-[#5bb4ff]" />
                        Change Password
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                        Ensure your account uses a secure password of at least 8 characters.
                    </p>

                    <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4 text-xs">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-300 uppercase">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-xs text-white focus:border-[#3b82f6] focus:outline-none"
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="mt-1 text-rose-400">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-300 uppercase">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-xs text-white focus:border-[#3b82f6] focus:outline-none"
                                />
                                {passwordForm.errors.password && (
                                    <p className="mt-1 text-rose-400">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-300 uppercase">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-xs text-white focus:border-[#3b82f6] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-5 py-2 text-xs font-bold text-white shadow-md transition hover:scale-105 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>

                {/* 2. Update Email */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl sm:p-8">
                    <h2 className="flex items-center gap-2 text-base font-bold text-white">
                        <Mail className="h-5 w-5 text-[#38bdf8]" />
                        Update Primary Email
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                        Lesson notifications and student messages will be sent to this email.
                    </p>

                    <form onSubmit={handleEmailSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <label className="block text-[11px] font-semibold text-slate-300 uppercase">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={emailForm.data.email}
                                onChange={(e) => emailForm.setData('email', e.target.value)}
                                className="mt-1 w-full rounded-xl border border-white/15 bg-slate-950/40 px-3 py-2 text-xs text-white focus:border-[#3b82f6] focus:outline-none"
                            />
                            {emailForm.errors.email && (
                                <p className="mt-1 text-xs text-rose-400">{emailForm.errors.email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={emailForm.processing}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.08] px-5 py-2 text-xs font-bold text-white transition hover:bg-white/15 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            Save Email
                        </button>
                    </form>
                </div>

                {/* 3. Notification Preferences */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl sm:p-8">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                            <h2 className="flex items-center gap-2 text-base font-bold text-white">
                                <Bell className="h-5 w-5 text-amber-400" />
                                Notification Channels
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400">
                                Choose which updates you want delivered via email and in-app alerts
                            </p>
                        </div>

                        {prefSaved && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" /> Preferences saved!
                            </span>
                        )}
                    </div>

                    <div className="mt-4 space-y-3">
                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-slate-950/30 p-3 text-xs transition hover:bg-white/[0.03]">
                            <div>
                                <span className="font-semibold text-white">New Booking Inquiries &amp; Confirmations</span>
                                <p className="text-[11px] text-slate-400">Get notified instantly when a student requests a coaching session</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.bookingAlerts}
                                onChange={(e) => setPreferences({ ...preferences, bookingAlerts: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-[#1f6eff] focus:ring-0"
                            />
                        </label>

                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-slate-950/30 p-3 text-xs transition hover:bg-white/[0.03]">
                            <div>
                                <span className="font-semibold text-white">Direct Student &amp; School Messages</span>
                                <p className="text-[11px] text-slate-400">Email alerts when a client or partner school sends a chat</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.messageAlerts}
                                onChange={(e) => setPreferences({ ...preferences, messageAlerts: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-[#1f6eff] focus:ring-0"
                            />
                        </label>

                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-slate-950/30 p-3 text-xs transition hover:bg-white/[0.03]">
                            <div>
                                <span className="font-semibold text-white">Payout &amp; Escrow Transfer Confirmations</span>
                                <p className="text-[11px] text-slate-400">Receipts and confirmation whenever lesson funds are deposited</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.payoutNotifs}
                                onChange={(e) => setPreferences({ ...preferences, payoutNotifs: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-[#1f6eff] focus:ring-0"
                            />
                        </label>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSavePreferences}
                            className="rounded-xl border border-white/15 bg-white/[0.08] px-5 py-2 text-xs font-bold text-white transition hover:bg-white/15"
                        >
                            Save Preferences
                        </button>
                    </div>
                </div>

                {/* 4. Danger Zone */}
                <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 shadow-xl backdrop-blur-xl sm:p-8">
                    <h2 className="flex items-center gap-2 text-base font-bold text-rose-400">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                        Deactivating will temporarily hide your public listing from search results.
                    </p>

                    <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h4 className="text-xs font-bold text-white">Deactivate Instructor Profile</h4>
                            <p className="text-[11px] text-slate-400">
                                You can reactivate anytime from your profile settings.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowDeactivateModal(true)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/25"
                        >
                            <UserX className="h-4 w-4" />
                            Deactivate Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Deactivation Modal */}
            {showDeactivateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
                    <div className="relative w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#070b12] p-6 shadow-2xl text-slate-100">
                        <h3 className="text-base font-bold text-white">Confirm Account Deactivation</h3>
                        <p className="mt-1 text-xs text-slate-400">
                            Please enter your current password to pause your instructor listing.
                        </p>

                        <form onSubmit={handleDeactivate} className="mt-4 space-y-3">
                            <input
                                type="password"
                                required
                                placeholder="Enter current password..."
                                value={deactivateForm.data.password}
                                onChange={(e) => deactivateForm.setData('password', e.target.value)}
                                className="w-full rounded-xl border border-white/15 bg-slate-950/60 p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                            />
                            {deactivateForm.errors.password && (
                                <p className="text-xs text-rose-400">{deactivateForm.errors.password}</p>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowDeactivateModal(false)}
                                    className="rounded-xl px-3 py-2 text-xs text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deactivateForm.processing}
                                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
                                >
                                    Confirm Deactivate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
