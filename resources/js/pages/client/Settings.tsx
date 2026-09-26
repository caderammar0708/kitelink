import AppLayout from '@/layouts/app-layout';
import { type Appearance, useAppearance } from '@/hooks/use-appearance';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    Check,
    CheckCircle2,
    KeyRound,
    Mail,
    Monitor,
    Moon,
    Palette,
    Save,
    Settings as SettingsIcon,
    Sun,
    Trash2,
    User as UserIcon,
} from 'lucide-react';
import React, { useState } from 'react';

interface SettingsProps {
    user: {
        id: number;
        name: string;
        email: string;
        notification_sound_enabled?: boolean;
    };
    status?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Account Settings',
        href: '/client/settings',
    },
];

export default function Settings({ user, status }: SettingsProps) {
    // Theme Appearance State
    const { appearance, updateAppearance } = useAppearance();

    // Profile (Name & Email) Form
    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
    });

    // Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Notification Preferences State
    const [soundEnabled, setSoundEnabled] = useState(user?.notification_sound_enabled ?? true);
    const [preferences, setPreferences] = useState({
        bookingAlerts: true,
        messageAlerts: true,
        promotions: false,
    });
    const [prefSaved, setPrefSaved] = useState(false);

    // Delete Account Form
    const deleteAccountForm = useForm({
        password: '',
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post(route('client.settings.profile'), {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post(route('client.settings.password'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handleToggleSound = (enabled: boolean) => {
        setSoundEnabled(enabled);
        router.post(
            route('client.settings.notifications'),
            {
                notification_sound_enabled: enabled,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setPrefSaved(true);
                    setTimeout(() => setPrefSaved(false), 3000);
                },
            },
        );
    };

    const handleSavePreferences = () => {
        handleToggleSound(soundEnabled);
    };

    const handleDeleteAccount = (e: React.FormEvent) => {
        e.preventDefault();
        deleteAccountForm.post(route('client.settings.destroy'), {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
        });
    };

    const themeOptions: { id: Appearance; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
        {
            id: 'light',
            label: 'Light Mode',
            description: 'Clean, crisp high-contrast daylight theme with bright backdrops.',
            icon: Sun,
        },
        {
            id: 'dark',
            label: 'Dark Mode',
            description: 'Deep obsidian and ocean dark theme, easy on the eyes.',
            icon: Moon,
        },
        {
            id: 'system',
            label: 'System Sync',
            description: 'Automatically matches your operating system display preferences.',
            icon: Monitor,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account Settings - KiteLink" />

            <div className="relative mx-auto min-h-full max-w-4xl space-y-6 p-4 text-slate-800 selection:bg-blue-600/30 selection:text-blue-900 dark:text-slate-100 dark:selection:bg-[#3b82f6]/30 dark:selection:text-white sm:p-6 lg:p-8">
                {/* Header */}
                <div>
                    <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        <SettingsIcon className="h-7 w-7 text-blue-600 dark:text-[#5bb4ff]" />
                        Account &amp; Security Settings
                    </h1>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                        Manage your profile information, password, notification channels, theme appearance, and account
                    </p>
                </div>

                {/* Status banner */}
                {status && (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        {status}
                    </div>
                )}

                {/* 1. Profile Information & Email */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:backdrop-blur-xl sm:p-8">
                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                        <UserIcon className="h-5 w-5 text-blue-600 dark:text-[#38bdf8]" />
                        Profile Information &amp; Email
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Update your account name and email address. Session confirmations and instructor chats will be sent here.
                    </p>

                    <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4 text-xs">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 uppercase dark:text-slate-300">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500 dark:focus:border-[#3b82f6]"
                                />
                                {profileForm.errors.name && (
                                    <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">{profileForm.errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 uppercase dark:text-slate-300">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500 dark:focus:border-[#3b82f6]"
                                />
                                {profileForm.errors.email && (
                                    <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">{profileForm.errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={profileForm.processing}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:brightness-110 active:scale-95 disabled:opacity-50 dark:from-[#4ba9ff] dark:to-[#1f6eff] dark:shadow-blue-600/30"
                            >
                                <Save className="h-4 w-4" />
                                Save Profile
                            </button>
                        </div>
                    </form>
                </div>

                {/* 2. Change Password */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:backdrop-blur-xl sm:p-8">
                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                        <KeyRound className="h-5 w-5 text-blue-600 dark:text-[#5bb4ff]" />
                        Change Password
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Ensure your account uses a secure password of at least 8 characters.
                    </p>

                    <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4 text-xs">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 uppercase dark:text-slate-300">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500 dark:focus:border-[#3b82f6]"
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="mt-1 text-rose-500 dark:text-rose-400">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 uppercase dark:text-slate-300">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500 dark:focus:border-[#3b82f6]"
                                />
                                {passwordForm.errors.password && (
                                    <p className="mt-1 text-rose-500 dark:text-rose-400">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 uppercase dark:text-slate-300">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500 dark:focus:border-[#3b82f6]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={passwordForm.processing}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:brightness-110 active:scale-95 disabled:opacity-50 dark:from-[#4ba9ff] dark:to-[#1f6eff] dark:shadow-blue-600/30"
                            >
                                <Save className="h-4 w-4" />
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>

                {/* 3. Notification Preferences */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:backdrop-blur-xl sm:p-8">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-white/10">
                        <div>
                            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Bell className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                                Notification Channels
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Configure which updates you want delivered via email and in-app alerts
                            </p>
                        </div>

                        {prefSaved && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-4 w-4" /> Preferences saved!
                            </span>
                        )}
                    </div>

                    <div className="mt-4 space-y-3">
                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs transition hover:bg-slate-100/80 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]">
                            <div>
                                <span className="font-semibold text-slate-900 dark:text-white">Audible Notification Sound</span>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Play an audible chime when booking confirmations or messages arrive</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={soundEnabled}
                                onChange={(e) => handleToggleSound(e.target.checked)}
                                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-[#1f6eff] dark:focus:ring-0"
                            />
                        </label>

                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/40 p-3 text-xs transition hover:bg-slate-100/70 dark:border-white/5 dark:bg-slate-950/30 dark:hover:bg-white/[0.03]">
                            <div>
                                <span className="font-semibold text-slate-900 dark:text-white">Lesson Confirmations &amp; Session Updates</span>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Get notified when instructors accept or reschedule your coaching sessions</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.bookingAlerts}
                                onChange={(e) => setPreferences({ ...preferences, bookingAlerts: e.target.checked })}
                                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-[#1f6eff] dark:focus:ring-0"
                            />
                        </label>

                        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/40 p-3 text-xs transition hover:bg-slate-100/70 dark:border-white/5 dark:bg-slate-950/30 dark:hover:bg-white/[0.03]">
                            <div>
                                <span className="font-semibold text-slate-900 dark:text-white">Direct Messages from Coaches</span>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Alerts when an instructor sends you session instructions or chat replies</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.messageAlerts}
                                onChange={(e) => setPreferences({ ...preferences, messageAlerts: e.target.checked })}
                                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-[#1f6eff] dark:focus:ring-0"
                            />
                        </label>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSavePreferences}
                            className="rounded-xl border border-slate-300 bg-slate-100 px-5 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/15"
                        >
                            Save Preferences
                        </button>
                    </div>
                </div>

                {/* 4. Appearance & Theme */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:backdrop-blur-xl sm:p-8">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-white/10">
                        <div>
                            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                                <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                Appearance &amp; Theme
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Choose your interface theme preference for KiteLink
                            </p>
                        </div>

                        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 capitalize dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300">
                            {appearance} Theme Active
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {themeOptions.map(({ id, label, description, icon: Icon }) => {
                            const isSelected = appearance === id;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => updateAppearance(id)}
                                    className={`group relative flex flex-col items-start rounded-2xl border p-4.5 text-left transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? 'border-blue-600 bg-blue-50/80 text-blue-950 shadow-md shadow-blue-600/10 ring-2 ring-blue-600/20 dark:border-[#3b82f6] dark:bg-[#1f6eff]/15 dark:text-white dark:shadow-lg dark:shadow-blue-600/20 dark:ring-[#3b82f6]'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 hover:text-slate-900 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/[0.04] dark:hover:text-white'
                                    }`}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                                                isSelected
                                                    ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-600/30 dark:from-[#4ba9ff] dark:to-[#1f6eff]'
                                                    : 'border border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400'
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        {isSelected && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm dark:bg-[#1f6eff]">
                                                <Check className="h-3 w-3" />
                                            </span>
                                        )}
                                    </div>
                                    <span className="mt-3.5 text-sm font-bold text-slate-900 dark:text-white">{label}</span>
                                    <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{description}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 5. Danger Zone */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 shadow-sm dark:border-rose-500/20 dark:bg-rose-950/10 dark:shadow-xl dark:backdrop-blur-xl sm:p-8">
                    <h2 className="flex items-center gap-2 text-base font-bold text-rose-700 dark:text-rose-400">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </h2>
                    <p className="mt-1 text-xs text-rose-600/80 dark:text-slate-400">
                        Permanently delete your account and remove all personal information, bookings, and messages.
                    </p>

                    <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Delete Account</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                This action is permanent and cannot be undone.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-100 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-200 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-300 dark:hover:bg-rose-500/25"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Account Deletion Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dark:bg-black/75 dark:backdrop-blur-md">
                    <div className="relative w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl text-slate-800 dark:border-rose-500/30 dark:bg-[#070b12] dark:text-slate-100">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Confirm Account Deletion</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Please enter your current password to permanently delete your account. This action cannot be reversed.
                        </p>

                        <form onSubmit={handleDeleteAccount} className="mt-4 space-y-3">
                            <input
                                type="password"
                                required
                                placeholder="Enter your password..."
                                value={deleteAccountForm.data.password}
                                onChange={(e) => deleteAccountForm.setData('password', e.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/60 dark:text-white"
                            />
                            {deleteAccountForm.errors.password && (
                                <p className="text-xs text-rose-500 dark:text-rose-400">{deleteAccountForm.errors.password}</p>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="rounded-xl px-3 py-2 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteAccountForm.processing}
                                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-rose-700"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
