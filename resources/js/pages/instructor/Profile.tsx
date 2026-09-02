import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Award, Camera, CheckCircle2, LoaderCircle, Save, User as UserIcon, Wind } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface InstructorData {
    id: number;
    bio?: string;
    certifications?: string;
    experience_years?: number;
    location?: string;
    hourly_rate?: number;
    profile_photo?: string;
    is_freelance?: boolean;
    school?: { name: string };
    user?: { name: string; email: string; profile_picture?: string };
}

interface ProfileProps {
    instructor?: InstructorData;
    status?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
    {
        title: 'My Profile',
        href: '/instructor/profile',
    },
];

export default function Profile({ instructor, status }: ProfileProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(instructor?.profile_photo || instructor?.user?.profile_picture || null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: instructor?.user?.name || '',
        email: instructor?.user?.email || '',
        bio: instructor?.bio || '',
        certifications: instructor?.certifications || '',
        experience_years: instructor?.experience_years ?? '',
        location: instructor?.location || '',
        hourly_rate: instructor?.hourly_rate ?? '',
        avatar: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('instructor.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Instructor Profile - KiteLink" />

            <div className="relative mx-auto min-h-full max-w-5xl space-y-6 p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* Header Banner */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            <UserIcon className="h-7 w-7 text-[#5bb4ff]" />
                            Instructor Profile
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">Update your public instructor details, credentials, and profile picture</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5bb4ff]/20 bg-[#5bb4ff]/10 px-3 py-1 text-xs font-semibold text-[#8acbff]">
                            <Wind className="h-3.5 w-3.5" />
                            Public Listing Active
                        </span>
                    </div>
                </div>

                {/* Status / Success Alert */}
                {(status || recentlySuccessful) && (
                    <div className="animate-in fade-in flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-4 text-sm text-emerald-300 shadow-lg backdrop-blur-md duration-300">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                        <span className="font-medium">{status || 'Your profile changes have been saved successfully!'}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Top Section: Profile Picture Glass Card */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                        <h2 className="mb-1 text-lg font-bold text-white">Profile Photo</h2>
                        <p className="mb-6 text-xs text-slate-400">Upload a high-quality picture of yourself or you kitesurfing. Max size: 2MB.</p>

                        <div className="flex flex-col items-center gap-6 sm:flex-row">
                            {/* Circular Avatar with Hover Overlay */}
                            <div className="group relative cursor-pointer" onClick={triggerFileInput}>
                                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-[#5bb4ff]/50 bg-slate-900 shadow-[0_0_25px_rgba(91,180,255,0.3)] sm:h-32 sm:w-32">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt={data.name || 'Instructor Avatar'} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="bg-gradient-to-br from-[#b8e6ff] to-[#4da6ff] bg-clip-text text-3xl font-extrabold text-transparent">
                                            {data.name?.charAt(0) || 'I'}
                                        </span>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100">
                                        <Camera className="mb-1 h-6 w-6 text-[#5bb4ff]" />
                                        <span className="text-[11px] font-semibold">Change Photo</span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#070b12] bg-[#1f6eff] text-white shadow-lg transition-transform group-hover:scale-110 hover:bg-[#3b82f6]"
                                >
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="space-y-2 text-center sm:text-left">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="avatar"
                                    name="avatar"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        className="cursor-pointer rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/[0.14]"
                                    >
                                        Select New Image
                                    </button>
                                    {previewUrl && previewUrl !== instructor?.profile_photo && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewUrl(instructor?.profile_photo || null);
                                                setData('avatar', null);
                                            }}
                                            className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/20"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-400">JPG, PNG, GIF or WebP up to 2MB.</p>
                                {errors.avatar && <p className="mt-1 text-xs text-rose-400">{errors.avatar}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Main Form Fields Glass Card */}
                    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                        <h2 className="flex items-center gap-2 border-b border-white/10 pb-3 text-lg font-bold text-white">
                            <Award className="h-5 w-5 text-[#5bb4ff]" />
                            Basic & Professional Details
                        </h2>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                    Full Name <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                        placeholder="e.g. Alex Henderson"
                                        className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-rose-400">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                    Email Address <span className="text-rose-400">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        placeholder="name@example.com"
                                        className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
                            </div>

                            {/* Certifications */}
                            <div className="space-y-1.5">
                                <label htmlFor="certifications" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                    Certifications (IKO / VDWS)
                                </label>
                                <div className="relative">
                                    <input
                                        id="certifications"
                                        type="text"
                                        value={data.certifications}
                                        onChange={(e) => setData('certifications', e.target.value)}
                                        disabled={processing}
                                        placeholder="e.g. IKO Level 2 Instructor, VDWS Pro"
                                        className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                    />
                                </div>
                                {errors.certifications && <p className="text-xs text-rose-400">{errors.certifications}</p>}
                            </div>

                            {/* Years of Experience */}
                            <div className="space-y-1.5">
                                <label htmlFor="experience_years" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                    Years of Experience
                                </label>
                                <div className="relative">
                                    <input
                                        id="experience_years"
                                        type="number"
                                        min={0}
                                        max={50}
                                        value={data.experience_years}
                                        onChange={(e) => setData('experience_years', e.target.value as any)}
                                        disabled={processing}
                                        placeholder="e.g. 5"
                                        className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                    />
                                </div>
                                {errors.experience_years && <p className="text-xs text-rose-400">{errors.experience_years}</p>}
                            </div>

                            {/* Location / Kite Center */}
                            <div className="space-y-1.5">
                                <label htmlFor="location" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                    Location / Kite Center
                                </label>
                                <div className="relative">
                                    <input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        disabled={processing}
                                        placeholder="e.g. Kalpitiya Lagoon, Sri Lanka"
                                        className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                    />
                                </div>
                                {errors.location && <p className="text-xs text-rose-400">{errors.location}</p>}
                            </div>

                            {/* Hourly Rate */}
                            <div className="space-y-1.5">
                                <label htmlFor="hourly_rate" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                    Hourly Rate ($ USD)
                                </label>
                                <div className="relative">
                                    <input
                                        id="hourly_rate"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        value={data.hourly_rate}
                                        onChange={(e) => setData('hourly_rate', e.target.value as any)}
                                        disabled={processing}
                                        placeholder="e.g. 65.00"
                                        className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                    />
                                </div>
                                {errors.hourly_rate && <p className="text-xs text-rose-400">{errors.hourly_rate}</p>}
                            </div>
                        </div>

                        {/* Bio / About */}
                        <div className="space-y-1.5 pt-2">
                            <label htmlFor="bio" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                About Me / Bio
                            </label>
                            <textarea
                                id="bio"
                                rows={4}
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                disabled={processing}
                                placeholder="Describe your kitesurfing journey, teaching philosophy, spots you cover, and what students can expect from your lessons..."
                                className="w-full resize-y rounded-xl border border-white/15 bg-slate-950/40 p-4 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                            />
                            {errors.bio && <p className="text-xs text-rose-400">{errors.bio}</p>}
                        </div>

                        {/* Save Action Button */}
                        <div className="flex flex-col items-center justify-end gap-4 border-t border-white/10 pt-4 sm:flex-row">
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02] hover:from-[#5bb4ff] hover:to-[#2e7bff] hover:shadow-blue-500/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:text-base"
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-5 w-5 animate-spin text-white" />
                                        <span>Saving Profile...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        <span>Save Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
