import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Award,
    CalendarCheck,
    Check,
    DollarSign,
    GraduationCap,
    LoaderCircle,
    Mail,
    Phone,
    Plus,
    PlusCircle,
    Search,
    Shield,
    Trash2,
    User,
    UserCheck,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface SchoolData {
    id: number;
    name: string;
}

interface CoachItem {
    id: number;
    school_id?: number | null;
    certifications?: string | null;
    hourly_rate?: number | null;
    experience_years?: number | null;
    phone?: string | null;
    bio?: string | null;
    bookings_count?: number;
    user?: {
        id: number;
        name: string;
        email: string;
        phone?: string | null;
        profile_picture?: string | null;
    };
}

interface InstructorsProps {
    school: SchoolData;
    roster: CoachItem[];
    availableInstructors: CoachItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'School Dashboard', href: '/school/dashboard' },
    { title: 'Manage Instructors', href: '/school/instructors' },
];

export default function Instructors({ school, roster, availableInstructors }: InstructorsProps) {
    // Modals state
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [coachToRemove, setCoachToRemove] = useState<CoachItem | null>(null);

    // Invite existing instructor form
    const inviteForm = useForm({
        email: '',
        instructor_id: '',
    });

    // Create new coach directly form
    const createForm = useForm({
        name: '',
        email: '',
        phone: '',
        certifications: 'IKO Level 1 Instructor',
        hourly_rate: '65',
        experience_years: '2',
        bio: '',
    });

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        inviteForm.post('/school/instructors/invite', {
            preserveScroll: true,
            onSuccess: () => {
                setShowInviteModal(false);
                inviteForm.reset();
            },
        });
    };

    const handleQuickAdd = (instructorId: number) => {
        router.post(
            '/school/instructors/invite',
            { instructor_id: instructorId },
            { preserveScroll: true }
        );
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/school/instructors/coach', {
            preserveScroll: true,
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const handleRemoveCoach = () => {
        if (!coachToRemove) return;
        router.delete(`/school/instructors/${coachToRemove.id}`, {
            preserveScroll: true,
            onFinish: () => setCoachToRemove(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Instructors - KiteLink" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300">
                            <Users className="h-3.5 w-3.5" />
                            Coaching Staff & Roster
                        </div>
                        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Manage School Instructors
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Add, invite, and manage certified instructors on the {school.name} team roster.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setShowInviteModal(true)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-purple-700 transition hover:bg-purple-100 dark:border-purple-900/40 dark:bg-purple-950/20 dark:text-purple-300 dark:hover:bg-purple-900/30"
                        >
                            <UserCheck className="h-4 w-4" />
                            Invite Existing Coach
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-purple-500/25 transition hover:bg-purple-500 active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Add New Coach Directly
                        </button>
                    </div>
                </div>

                {/* Current Roster Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Current Roster
                            </h2>
                            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-extrabold text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                                {roster.length} {roster.length === 1 ? 'Coach' : 'Coaches'}
                            </span>
                        </div>
                    </div>

                    {roster.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-white/10">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 mb-4 dark:bg-white/5 dark:text-purple-400">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                No Instructors on Your Roster Yet
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                                Build your school team! You can invite existing registered KiteLink instructors or add a coach profile directly.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(true)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                                >
                                    Invite by Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(true)}
                                    className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-500"
                                >
                                    Add New Coach Directly
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {roster.map((coach) => {
                                const coachName = coach.user?.name ?? 'Instructor';
                                const coachEmail = coach.user?.email ?? 'N/A';
                                const coachPhone = coach.phone || coach.user?.phone;
                                const avatar = coach.user?.profile_picture;

                                return (
                                    <div
                                        key={coach.id}
                                        className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-purple-200 hover:shadow-md dark:border-white/10 dark:bg-[#0c1220] dark:hover:border-purple-500/20"
                                    >
                                        <div className="space-y-4">
                                            {/* Top Card Row */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    {avatar ? (
                                                        <img
                                                            src={avatar}
                                                            alt={coachName}
                                                            className="h-12 w-12 rounded-2xl object-cover ring-2 ring-purple-100 dark:ring-white/10"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-base font-bold text-white shadow-sm">
                                                            {coachName.charAt(0)}
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                                                            {coachName}
                                                        </h3>
                                                        <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-semibold">
                                                            <Award className="h-3 w-3" />
                                                            {coach.certifications || 'Certified Instructor'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => setCoachToRemove(coach)}
                                                    title="Remove from roster"
                                                    className="rounded-xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Contact & Rate pills */}
                                            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                    <span className="truncate">{coachEmail}</span>
                                                </div>
                                                {coachPhone && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                        <span>{coachPhone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bio snippet if available */}
                                            {coach.bio && (
                                                <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                                    {coach.bio}
                                                </p>
                                            )}
                                        </div>

                                        {/* Bottom Footer Info */}
                                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:divide-white/5 dark:border-white/5">
                                            <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                                                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                                ${coach.hourly_rate ?? 60} / hour
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                                <CalendarCheck className="h-3.5 w-3.5 text-blue-500" />
                                                {coach.bookings_count ?? 0} lessons
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Available Freelance Instructors Directory to Invite */}
                {availableInstructors.length > 0 && (
                    <div className="mt-6 space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Available Freelance Instructors
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Certified instructors on KiteLink currently available to join a school roster
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {availableInstructors.map((cand) => (
                                <div
                                    key={cand.id}
                                    className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c1220]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
                                            {cand.user?.name ? cand.user.name.charAt(0) : 'I'}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="font-bold text-sm text-slate-900 dark:text-white">
                                                {cand.user?.name ?? 'Instructor'}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {cand.certifications || 'Certified Coach'}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleQuickAdd(cand.id)}
                                        className="inline-flex items-center gap-1 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 transition dark:bg-purple-950/30 dark:text-purple-300 dark:hover:bg-purple-900/40"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add to Roster
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL 1: Invite Existing Coach by Email */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <UserCheck className="h-4 w-4 text-purple-600" />
                                Invite Existing KiteLink Coach
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowInviteModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleInviteSubmit} className="mt-4 space-y-4">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Enter the registered email address of a certified KiteLink instructor to attach them to your school roster.
                            </p>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Instructor Account Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={inviteForm.data.email}
                                    onChange={(e) => inviteForm.setData('email', e.target.value)}
                                    placeholder="coach@example.com"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                                {inviteForm.errors.email && (
                                    <p className="text-xs text-rose-500">{inviteForm.errors.email}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={inviteForm.processing}
                                    className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-50"
                                >
                                    {inviteForm.processing ? 'Adding...' : 'Add Coach to Roster'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: Add New Coach Directly */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-white/10">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <PlusCircle className="h-4 w-4 text-purple-600" />
                                Add Coach Directly to Roster
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Coach Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="e.g. Alex Rivera"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                    {createForm.errors.name && <p className="text-xs text-rose-500">{createForm.errors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Coach Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={createForm.data.email}
                                        onChange={(e) => createForm.setData('email', e.target.value)}
                                        placeholder="alex@school.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                    {createForm.errors.email && <p className="text-xs text-rose-500">{createForm.errors.email}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={createForm.data.phone}
                                        onChange={(e) => createForm.setData('phone', e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Certifications
                                    </label>
                                    <input
                                        type="text"
                                        value={createForm.data.certifications}
                                        onChange={(e) => createForm.setData('certifications', e.target.value)}
                                        placeholder="IKO Level 2, VDWS, First Aid Certified"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Hourly Rate ($/h)
                                    </label>
                                    <input
                                        type="number"
                                        value={createForm.data.hourly_rate}
                                        onChange={(e) => createForm.setData('hourly_rate', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Years Experience
                                    </label>
                                    <input
                                        type="number"
                                        value={createForm.data.experience_years}
                                        onChange={(e) => createForm.setData('experience_years', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Short Teaching Bio
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={createForm.data.bio}
                                        onChange={(e) => createForm.setData('bio', e.target.value)}
                                        placeholder="Specializes in foil, freestyle, and beginner radio coaching..."
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Creating Coach...' : 'Add Coach to School'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: Remove Confirmation */}
            {coachToRemove && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0c1220]">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Remove from Roster?
                        </h3>
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Are you sure you want to remove <strong>{coachToRemove.user?.name}</strong> from the {school.name} team roster? Their account will revert to a freelance instructor profile.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setCoachToRemove(null)}
                                className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleRemoveCoach}
                                className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-sm"
                            >
                                Yes, Remove Coach
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
