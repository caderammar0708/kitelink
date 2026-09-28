import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Award,
    Building2,
    Check,
    Globe,
    ImageIcon,
    Layers,
    LoaderCircle,
    MapPin,
    Package,
    Phone,
    Plus,
    Save,
    ShieldCheck,
    Sparkles,
    Trash2,
    User,
    Wind,
    X,
} from 'lucide-react';
import React, { useState } from 'react';

interface SchoolData {
    id: number;
    name: string;
    description?: string | null;
    location?: string | null;
    contact_name?: string | null;
    phone?: string | null;
    website?: string | null;
    registration_number?: string | null;
    facilities?: string[] | null;
    gear_list?: string[] | null;
    photos?: string[] | null;
    certifications?: string | null;
    logo?: string | null;
}

interface ProfileProps {
    school: SchoolData;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'School Dashboard', href: '/school/dashboard' },
    { title: 'School Profile', href: '/school/profile' },
];

const PRESET_FACILITIES = [
    'Direct Beach Access',
    'Safety & Rescue Boat',
    'Hot Showers & Restrooms',
    'Secure Gear Lockers',
    'Free High-Speed Wi-Fi',
    'Equipment Rental Fleet',
    'Video Analysis Classroom',
    'Pro Kiteshop',
    'Chillout Beach Bar / Cafe',
    'Air Compressor Station',
    'Shaded Rigging Area',
    'Equipment Storage',
];

export default function Profile({ school }: ProfileProps) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: school.name || '',
        description: school.description || '',
        location: school.location || '',
        contact_name: school.contact_name || '',
        phone: school.phone || '',
        website: school.website || '',
        facilities: school.facilities || [],
        gear_list: school.gear_list || [],
        photos: school.photos || [],
        certifications: school.certifications || '',
        logo: school.logo || '',
    });

    const [customFacility, setCustomFacility] = useState('');
    const [newGearItem, setNewGearItem] = useState('');
    const [newPhotoUrl, setNewPhotoUrl] = useState('');

    const toggleFacility = (facility: string) => {
        if (data.facilities.includes(facility)) {
            setData('facilities', data.facilities.filter((f) => f !== facility));
        } else {
            setData('facilities', [...data.facilities, facility]);
        }
    };

    const addCustomFacility = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = customFacility.trim();
        if (trimmed && !data.facilities.includes(trimmed)) {
            setData('facilities', [...data.facilities, trimmed]);
            setCustomFacility('');
        }
    };

    const addGearItem = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newGearItem.trim();
        if (trimmed && !data.gear_list.includes(trimmed)) {
            setData('gear_list', [...data.gear_list, trimmed]);
            setNewGearItem('');
        }
    };

    const removeGearItem = (index: number) => {
        setData('gear_list', data.gear_list.filter((_, i) => i !== index));
    };

    const addPhotoUrl = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = newPhotoUrl.trim();
        if (trimmed && !data.photos.includes(trimmed)) {
            setData('photos', [...data.photos, trimmed]);
            setNewPhotoUrl('');
        }
    };

    const removePhoto = (index: number) => {
        setData('photos', data.photos.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/school/profile', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="School Profile - KiteLink" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-800 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300">
                            <Building2 className="h-3.5 w-3.5" />
                            Center Profile Setup
                        </div>
                        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            School & Center Profile
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Fill in your center description, available facilities, equipment fleet, and certifications to showcase to clients.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-purple-500/25 transition hover:bg-purple-500 disabled:opacity-50 self-start sm:self-auto"
                    >
                        {processing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : recentlySuccessful ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {recentlySuccessful ? 'Changes Saved!' : 'Save Center Profile'}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: Business Overview */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                            <Building2 className="h-5 w-5 text-purple-500" />
                            Business Information
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                            Core identification details and contact person for your kitesurf school.
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    School / Business Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                                {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Location (Spot, City, Country) *
                                </label>
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g. Tarifa, Cadiz, Spain"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>
                                {errors.location && <p className="text-xs text-rose-500">{errors.location}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Contact Person Name
                                </label>
                                <div className="relative">
                                    <User className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={data.contact_name}
                                        onChange={(e) => setData('contact_name', e.target.value)}
                                        placeholder="Director or Lead Instructor"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>
                                {errors.contact_name && <p className="text-xs text-rose-500">{errors.contact_name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    School Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+34 600 000 000"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-rose-500">{errors.phone}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Official Website
                                </label>
                                <div className="relative">
                                    <Globe className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="url"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        placeholder="https://www.yourkiteschool.com"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>
                                {errors.website && <p className="text-xs text-rose-500">{errors.website}</p>}
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Logo / Badge Image URL
                                </label>
                                <div className="relative">
                                    <ImageIcon className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={data.logo}
                                        onChange={(e) => setData('logo', e.target.value)}
                                        placeholder="https://example.com/logo.png"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    />
                                </div>
                                {errors.logo && <p className="text-xs text-rose-500">{errors.logo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Center Description */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                            <Wind className="h-5 w-5 text-blue-500" />
                            About the School & Spot
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Describe your school's history, vibe, teaching philosophy, conditions, wind season, and what makes your center special.
                        </p>

                        <textarea
                            rows={4}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Welcome to Kite Paradise! We are a certified IKO Center located right on the beach in Tarifa..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                        {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                    </div>

                    {/* Section 3: Facilities */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                            <Layers className="h-5 w-5 text-indigo-500" />
                            Center Facilities & Amenities
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Select all amenities available on-site at your kite center:
                        </p>

                        {/* Preset Badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {PRESET_FACILITIES.map((f) => {
                                const selected = data.facilities.includes(f);
                                return (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => toggleFacility(f)}
                                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                                            selected
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
                                        }`}
                                    >
                                        {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 text-slate-400" />}
                                        {f}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Custom Facility input */}
                        <div className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                value={customFacility}
                                onChange={(e) => setCustomFacility(e.target.value)}
                                placeholder="Add custom facility..."
                                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={addCustomFacility}
                                className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Section 4: Certifications & Center Status */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                            <Award className="h-5 w-5 text-amber-500" />
                            Certifications & Official Center Status
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            List your formal affiliations, e.g. IKO Official Center, VDWS Watersport School, BKSA Recognized Center, RYA Training Center.
                        </p>

                        <input
                            type="text"
                            value={data.certifications}
                            onChange={(e) => setData('certifications', e.target.value)}
                            placeholder="e.g. IKO Affiliated Center #4812 • VDWS Kite Station • Official Duotone Pro Center"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                        {errors.certifications && <p className="text-xs text-rose-500">{errors.certifications}</p>}
                    </div>

                    {/* Section 5: Gear & Equipment Fleet */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                            <Package className="h-5 w-5 text-emerald-500" />
                            Gear & Equipment Fleet
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Show clients the brands and gear models you provide for lessons and equipment rentals.
                        </p>

                        {/* Current Gear List Chips */}
                        {data.gear_list.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {data.gear_list.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300"
                                    >
                                        <Package className="h-3 w-3" />
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => removeGearItem(idx)}
                                            className="ml-1 text-emerald-600 hover:text-emerald-900 dark:hover:text-emerald-100"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                value={newGearItem}
                                onChange={(e) => setNewGearItem(e.target.value)}
                                placeholder="e.g. Duotone Rebel SLS 7-14m, Core XR8, Cabrinha Switchblade..."
                                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={addGearItem}
                                className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                            >
                                Add Gear
                            </button>
                        </div>
                    </div>

                    {/* Section 6: Photos & Spot Gallery */}
                    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                            <ImageIcon className="h-5 w-5 text-blue-500" />
                            Spot & Center Photos
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Add photo links to display your beach spot, kitesurf lessons, station building, and equipment lockers.
                        </p>

                        {/* Current Photos Grid */}
                        {data.photos.length > 0 && (
                            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mb-4">
                                {data.photos.map((url, idx) => (
                                    <div key={idx} className="group relative aspect-video overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5">
                                        <img src={url} alt="Center photo" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(idx)}
                                            className="absolute top-2 right-2 rounded-lg bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition hover:bg-rose-600"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                value={newPhotoUrl}
                                onChange={(e) => setNewPhotoUrl(e.target.value)}
                                placeholder="Paste image URL (https://...)"
                                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={addPhotoUrl}
                                className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                            >
                                Add Photo
                            </button>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition hover:bg-purple-500 disabled:opacity-50"
                        >
                            {processing ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save Center Profile Changes
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
