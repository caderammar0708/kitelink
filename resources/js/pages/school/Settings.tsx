import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    Check,
    Eye,
    EyeOff,
    Key,
    Lock,
    Mail,
    Phone,
    Power,
    Save,
    Settings as SettingsIcon,
    Shield,
    Sparkles,
    User,
    Volume2,
} from 'lucide-react';
import React, { useState } from 'react';

interface SchoolData {
    id: number;
    name: string;
    is_active: boolean;
}

interface UserData {
    name: string;
    email: string;
    phone?: string | null;
    notification_sound_enabled: boolean;
}

interface SettingsProps {
    school: SchoolData;
    user: UserData;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'School Dashboard', href: '/school/dashboard' },
    { title: 'School Settings', href: '/school/settings' },
];

export default function Settings({ school, user }: SettingsProps) {
    // 1. Profile Info Form
    const profileForm = useForm({
        contact_name: user.name || '',
        phone: user.phone || '',
    });

    // 2. Password Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // 3. Email Form
    const emailForm = useForm({
        email: user.email || '',
    });

    // 4. Notifications Form
    const notificationsForm = useForm({
        notification_sound_enabled: user.notification_sound_enabled,
    });

    // 5. Deactivate Form
    const deactivateForm = useForm({});

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/school/settings/profile', { preserveScroll: true });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post('/school/settings/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        emailForm.post('/school/settings/email', { preserveScroll: true });
    };

    const handleToggleSound = (enabled: boolean) => {
        notificationsForm.setData('notification_sound_enabled', enabled);
        notificationsForm.post('/school/settings/notifications', { preserveScroll: true });
    };

    const handleToggleListing = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            confirm(
                school.is_active
                    ? 'Are you sure you want to deactivate your public school listing? Clients will not be able to find your school in discovery until reactivated.'
                    : 'Reactivate your school listing on public discovery?'
            )
        ) {
            deactivateForm.post('/school/settings/deactivate', { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="School Settings - KiteLink" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header */}
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300">
                        <SettingsIcon className="h-3.5 w-3.5" />
                        Account & Center Settings
                    </div>
                    <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                        School Settings
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Manage your school account credentials, notification sound alerts, and public listing status.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Card 1: Manager Contact Details */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-1">
                            <User className="h-4 w-4 text-purple-500" />
                            Manager Contact Information
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Update the contact name and primary phone for school correspondence.
                        </p>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Contact Person Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={profileForm.data.contact_name}
                                    onChange={(e) => profileForm.setData('contact_name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                                {profileForm.errors.contact_name && (
                                    <p className="text-xs text-rose-500">{profileForm.errors.contact_name}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Primary Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileForm.data.phone}
                                    onChange={(e) => profileForm.setData('phone', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                                {profileForm.errors.phone && (
                                    <p className="text-xs text-rose-500">{profileForm.errors.phone}</p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-500 disabled:opacity-50"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    {profileForm.recentlySuccessful ? 'Saved!' : 'Save Contact'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Card 2: Email Address */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-1">
                            <Mail className="h-4 w-4 text-blue-500" />
                            Account Email Address
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            The email address used to log into KiteLink and receive booking notices.
                        </p>

                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Login Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={emailForm.data.email}
                                    onChange={(e) => emailForm.setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                                {emailForm.errors.email && (
                                    <p className="text-xs text-rose-500">{emailForm.errors.email}</p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={emailForm.processing}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    {emailForm.recentlySuccessful ? 'Updated!' : 'Update Email'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Card 3: Change Password */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-1">
                            <Lock className="h-4 w-4 text-indigo-500" />
                            Security & Password
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Ensure your school manager account is using a secure password.
                        </p>

                        <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Current Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        required
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 pr-10 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-2.5 text-slate-400"
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordForm.errors.current_password && (
                                    <p className="text-xs text-rose-500">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        New Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            required
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 pr-10 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-2.5 text-slate-400"
                                        >
                                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {passwordForm.errors.password && (
                                        <p className="text-xs text-rose-500">{passwordForm.errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Confirm New Password *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-500 disabled:opacity-50"
                                >
                                    <Key className="h-3.5 w-3.5" />
                                    {passwordForm.recentlySuccessful ? 'Password Changed!' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Card 4: Notification Preferences & Listing Toggle */}
                    <div className="space-y-6">
                        {/* Audio Chime Notification Toggle */}
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-1">
                                <Volume2 className="h-4 w-4 text-amber-500" />
                                Notification Chimes & Sounds
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Play an audible chime sound when a new school lesson booking or student message arrives.
                            </p>

                            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        Audio Notification Sound
                                    </span>
                                    <p className="text-[11px] text-slate-500">
                                        {notificationsForm.data.notification_sound_enabled
                                            ? 'Sound chime is enabled for instant alerts'
                                            : 'Sound chime is currently muted'}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleToggleSound(!notificationsForm.data.notification_sound_enabled)}
                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        notificationsForm.data.notification_sound_enabled ? 'bg-purple-600' : 'bg-slate-200 dark:bg-white/20'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                            notificationsForm.data.notification_sound_enabled ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Listing Visibility & Deactivation */}
                        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-1">
                                <Power className="h-4 w-4 text-rose-500" />
                                School Listing Visibility
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Control whether your school is actively shown in public search and discovery or temporarily paused.
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                            Public Discovery Status
                                        </span>
                                        <span className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                                            school.is_active
                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                        }`}>
                                            {school.is_active ? 'Active & Discoverable' : 'Listing Paused'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">
                                        {school.is_active
                                            ? 'Students worldwide can discover your school and book lessons with your team.'
                                            : 'Your school is hidden from public discovery. You can reactivate anytime.'}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleToggleListing}
                                    disabled={deactivateForm.processing}
                                    className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                                        school.is_active
                                            ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-500'
                                    }`}
                                >
                                    {school.is_active ? 'Pause Listing' : 'Reactivate Listing'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
