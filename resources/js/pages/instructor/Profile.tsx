import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Award,
    Camera,
    Check,
    CheckCircle2,
    DollarSign,
    FileText,
    Globe,
    Info,
    LoaderCircle,
    MapPin,
    Plus,
    Power,
    Save,
    Upload,
    User as UserIcon,
    Wind,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface InstructorData {
    id: number;
    bio?: string;
    certifications?: string;
    experience_years?: number;
    location?: string;
    languages?: string[];
    hourly_rate?: number;
    daily_rate?: number;
    profile_photo?: string;
    is_freelance?: boolean;
    is_active?: boolean;
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

const AVAILABLE_LANGUAGES = [
    'English',
    'German',
    'French',
    'Spanish',
    'Italian',
    'Russian',
    'Dutch',
    'Portuguese',
    'Arabic',
    'Sinhala',
];

export default function Profile({ instructor, status }: ProfileProps) {
    const { auth } = usePage<SharedData>().props;
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const certDocInputRef = useRef<HTMLInputElement | null>(null);

    const initialPhoto =
        instructor?.profile_photo ||
        instructor?.user?.profile_picture ||
        auth?.user?.avatar ||
        (auth?.user as any)?.profile_picture ||
        null;
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialPhoto);
    const [certFileName, setCertFileName] = useState<string | null>(null);
    const [customLangInput, setCustomLangInput] = useState('');
    const [isActive, setIsActive] = useState<boolean>(instructor?.is_active ?? true);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        const photo =
            instructor?.profile_photo ||
            instructor?.user?.profile_picture ||
            auth?.user?.avatar ||
            (auth?.user as any)?.profile_picture ||
            null;
        if (photo) {
            setPreviewUrl(photo);
        }
    }, [instructor?.profile_photo, instructor?.user?.profile_picture, auth?.user]);

    useEffect(() => {
        if (instructor?.is_active !== undefined) {
            setIsActive(instructor.is_active);
            setData('is_active', instructor.is_active);
        }
    }, [instructor?.is_active]);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: instructor?.user?.name || '',
        email: instructor?.user?.email || '',
        bio: instructor?.bio || '',
        certifications: instructor?.certifications || '',
        experience_years: instructor?.experience_years ?? '',
        location: instructor?.location || '',
        languages: (instructor?.languages || ['English']) as string[],
        hourly_rate: instructor?.hourly_rate ?? '',
        daily_rate: instructor?.daily_rate ?? '',
        is_active: instructor?.is_active ?? true,
        avatar: null as File | null,
        cert_document: null as File | null,
    });

    const handleToggleStatus = () => {
        const nextStatus = !isActive;
        setIsActive(nextStatus);
        setData('is_active', nextStatus);
        setIsUpdatingStatus(true);

        router.patch(
            route('instructor.profile.availabilityStatus'),
            { is_active: nextStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsUpdatingStatus(false);
                },
                onError: () => {
                    setIsActive(!nextStatus);
                    setData('is_active', !nextStatus);
                    setIsUpdatingStatus(false);
                },
            }
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleCertDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('cert_document', file);
            setCertFileName(file.name);
        }
    };

    const toggleLanguage = (lang: string) => {
        if (data.languages.includes(lang)) {
            setData('languages', data.languages.filter((l) => l !== lang));
        } else {
            setData('languages', [...data.languages, lang]);
        }
    };

    const addCustomLanguage = () => {
        if (customLangInput.trim() && !data.languages.includes(customLangInput.trim())) {
            setData('languages', [...data.languages, customLangInput.trim()]);
            setCustomLangInput('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('instructor.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: (page) => {
                const updatedInstructor = page.props.instructor as InstructorData | undefined;
                const photo = updatedInstructor?.profile_photo || updatedInstructor?.user?.profile_picture;
                if (photo) {
                    setPreviewUrl(photo);
                }
                setData('avatar', null);
                // Also trigger a reload of shared auth.user so header/sidebar updates immediately
                router.reload({ only: ['auth', 'instructor'] });
            },
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Instructor Profile - KiteLink" />

            <div className="relative mx-auto min-h-full max-w-5xl space-y-6 p-4 text-slate-800 selection:bg-blue-600/30 selection:text-blue-900 dark:text-slate-100 dark:selection:bg-[#3b82f6]/30 dark:selection:text-white sm:p-6 lg:p-8">
                {/* Header Banner */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            <UserIcon className="h-7 w-7 text-blue-600 dark:text-[#5bb4ff]" />
                            My Instructor Profile
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                            Configure your teaching rates, credentials, spoken languages, and listing visibility
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            disabled={isUpdatingStatus}
                            onClick={handleToggleStatus}
                            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                                isActive
                                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/40'
                                    : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-800'
                            }`}
                        >
                            <Power className={`h-3.5 w-3.5 ${isUpdatingStatus ? 'animate-pulse text-amber-500 dark:text-amber-400' : ''}`} />
                            {isActive ? 'Listing Active (Online)' : 'Listing Paused (Offline)'}
                        </button>
                    </div>
                </div>

                {/* Status / Success Alert */}
                {(status || recentlySuccessful) && (
                    <div className="animate-in fade-in flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm duration-300 dark:border-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-300 dark:shadow-lg dark:backdrop-blur-md">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-medium">{status || 'Your profile has been saved and published successfully!'}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Top Section: Avatar & Status */}
                    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-2xl dark:backdrop-blur-xl sm:p-8">
                        <h2 className="mb-1 text-base font-bold text-slate-900 dark:text-white sm:text-lg">Profile Photo & Identity</h2>
                        <p className="mb-6 text-xs text-slate-500 dark:text-slate-400">
                            Upload a professional headshot or active kitesurfing image to increase student bookings.
                        </p>

                        <div className="flex flex-col items-center gap-6 sm:flex-row">
                            {/* Circular Avatar */}
                            <div className="group relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-blue-400/50 bg-slate-100 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:border-[#5bb4ff]/50 dark:bg-slate-900 dark:shadow-[0_0_25px_rgba(91,180,255,0.3)] sm:h-32 sm:w-32">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt={data.name || 'Avatar'}
                                            className="h-full w-full object-cover"
                                            onError={() => setPreviewUrl(null)}
                                        />
                                    ) : (
                                        <span className="bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-3xl font-extrabold text-transparent dark:from-[#b8e6ff] dark:to-[#4da6ff]">
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
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-lg transition-transform group-hover:scale-110 hover:bg-blue-700 dark:border-[#070b12] dark:bg-[#1f6eff] dark:hover:bg-[#3b82f6]"
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
                                        onClick={() => fileInputRef.current?.click()}
                                        className="cursor-pointer rounded-xl border border-slate-300 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.14]"
                                    >
                                        Choose New Picture
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">JPG, PNG, GIF, WebP up to 2MB.</p>
                                {errors.avatar && <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">{errors.avatar}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Basic Info & Rates */}
                    <div className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-2xl dark:backdrop-blur-xl sm:p-8">
                        <h2 className="flex items-center gap-2 border-b border-slate-200/80 pb-3 text-base font-bold text-slate-900 dark:border-white/10 dark:text-white sm:text-lg">
                            <Wind className="h-5 w-5 text-blue-600 dark:text-[#5bb4ff]" />
                            Basic & Coaching Information
                        </h2>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Name */}
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
                                    Full Name <span className="text-rose-500 dark:text-rose-400">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Alex Henderson"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-400/50 dark:backdrop-blur-sm dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                />
                                {errors.name && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
                                    Email Address <span className="text-rose-500 dark:text-rose-400">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-400/50 dark:backdrop-blur-sm dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                />
                                {errors.email && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.email}</p>}
                            </div>

                            {/* Teaching Spots / Primary Location */}
                            <div className="space-y-1.5">
                                <label htmlFor="location" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
                                    Teaching Spots &amp; Base Location
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute top-3 left-3.5 h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                    <input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g. Kalpitiya Lagoon &amp; Kappalady, Sri Lanka"
                                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-400/50 dark:backdrop-blur-sm dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                    />
                                </div>
                                {errors.location && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.location}</p>}
                            </div>

                            {/* Years of Experience */}
                            <div className="space-y-1.5">
                                <label htmlFor="experience_years" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
                                    Years of Experience
                                </label>
                                <input
                                    id="experience_years"
                                    type="number"
                                    min={0}
                                    max={50}
                                    value={data.experience_years}
                                    onChange={(e) => setData('experience_years', e.target.value as any)}
                                    placeholder="e.g. 6"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-400/50 dark:backdrop-blur-sm dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                />
                                {errors.experience_years && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.experience_years}</p>}
                            </div>

                            {/* Hourly Rate */}
                            <div className="space-y-1.5">
                                <label htmlFor="hourly_rate" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
                                    Hourly Rate ($ USD / hr)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute top-3 left-3.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    <input
                                        id="hourly_rate"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        value={data.hourly_rate}
                                        onChange={(e) => setData('hourly_rate', e.target.value as any)}
                                        placeholder="e.g. 65.00"
                                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-400/50 dark:backdrop-blur-sm dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                    />
                                </div>
                                {errors.hourly_rate && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.hourly_rate}</p>}
                            </div>

                            {/* Daily Rate */}
                            <div className="space-y-1.5">
                                <label htmlFor="daily_rate" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
                                    Full-Day Camp Rate ($ USD / day)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute top-3 left-3.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    <input
                                        id="daily_rate"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        value={data.daily_rate}
                                        onChange={(e) => setData('daily_rate', e.target.value as any)}
                                        placeholder="e.g. 240.00"
                                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-400/50 dark:backdrop-blur-sm dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                    />
                                </div>
                                {errors.daily_rate && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.daily_rate}</p>}
                            </div>
                        </div>

                        {/* Languages Section */}
                        <div className="space-y-2 border-t border-slate-200/80 pt-4 dark:border-white/10">
                            <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
                                <Globe className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                Spoken Languages for Coaching
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Select all languages you can conduct kitesurf lessons in:</p>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {AVAILABLE_LANGUAGES.map((lang) => {
                                    const isSelected = data.languages.includes(lang);
                                    return (
                                        <button
                                            type="button"
                                            key={lang}
                                            onClick={() => toggleLanguage(lang)}
                                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                                                isSelected
                                                    ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-xs dark:border-[#5bb4ff]/50 dark:bg-[#1f6eff]/30 dark:text-white dark:shadow-blue-500/20'
                                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]'
                                            }`}
                                        >
                                            {isSelected ? <Check className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" /> : <Plus className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />}
                                            {lang}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Add other language */}
                            <div className="mt-2 flex max-w-xs items-center gap-2">
                                <input
                                    type="text"
                                    value={customLangInput}
                                    onChange={(e) => setCustomLangInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addCustomLanguage();
                                        }
                                    }}
                                    placeholder="Add other language..."
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500 dark:focus:border-[#3b82f6]"
                                />
                                <button
                                    type="button"
                                    onClick={addCustomLanguage}
                                    className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:border-transparent dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Certifications & Document Upload */}
                        <div className="space-y-4 border-t border-slate-200/80 pt-4 dark:border-white/10">
                            <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
                                <Award className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                Certifications &amp; Licenses (IKO / VDWS / BKSA)
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label htmlFor="certifications" className="block text-xs text-slate-600 dark:text-slate-300">
                                        Certification Titles / Levels
                                    </label>
                                    <input
                                        id="certifications"
                                        type="text"
                                        value={data.certifications}
                                        onChange={(e) => setData('certifications', e.target.value)}
                                        placeholder="e.g. IKO Level 2 Senior Instructor, VDWS Pro Coach"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-400/50 dark:backdrop-blur-sm dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                    />
                                    {errors.certifications && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.certifications}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs text-slate-600 dark:text-slate-300">
                                        Upload Certification Proof (PDF, PNG, JPG)
                                    </label>
                                    <input
                                        ref={certDocInputRef}
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={handleCertDocChange}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => certDocInputRef.current?.click()}
                                        className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2.5 text-xs text-slate-700 transition hover:border-blue-400 hover:bg-slate-100 dark:border-white/20 dark:bg-slate-950/40 dark:text-slate-300 dark:hover:border-[#5bb4ff]/50 dark:hover:bg-white/[0.04]"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                            <span className="truncate max-w-[180px]">
                                                {certFileName || 'Upload certificate scan / PDF'}
                                            </span>
                                        </div>
                                        <Upload className="h-4 w-4 text-slate-400" />
                                    </div>
                                    {errors.cert_document && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.cert_document}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Bio / About */}
                        <div className="space-y-1.5 border-t border-slate-200/80 pt-4 dark:border-white/10">
                            <label htmlFor="bio" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
                                Bio / Teaching Philosophy
                            </label>
                            <textarea
                                id="bio"
                                rows={4}
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Tell prospective students about your kitesurfing background, credentials, what spots you favor, and why they should book coaching sessions with you..."
                                className="w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-400/50 dark:backdrop-blur-sm dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                            />
                            {errors.bio && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.bio}</p>}
                        </div>

                        {/* Submit Actions */}
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-4 sm:flex-row dark:border-white/10">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <Info className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                All updates are instantly live on your public instructor card.
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 dark:from-[#4ba9ff] dark:to-[#1f6eff] dark:shadow-blue-600/30 sm:w-auto"
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin text-white" />
                                        <span>Saving Profile...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        <span>Save &amp; Publish Profile</span>
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
