import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    Compass,
    Eye,
    Globe,
    GraduationCap,
    MapPin,
    Search,
    Sparkles,
    Star,
    UserCheck,
    Wind,
} from 'lucide-react';
import { useState } from 'react';

interface InstructorItem {
    id: number;
    name: string;
    avatar?: string;
    location?: string;
    certifications?: string;
    experience_years?: number;
    hourly_rate?: number;
    rating?: number;
    review_count: number;
}

interface BrowseProps {
    instructors?: InstructorItem[];
    filters: {
        search?: string;
        country?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
    {
        title: 'Browse Other Instructors',
        href: '/instructor/browse',
    },
];

const POPULAR_SPOTS = [
    'All Spots',
    'Kalpitiya, Sri Lanka',
    'Tarifa, Spain',
    'El Gouna, Egypt',
    'Cabarete, Dominican Rep',
    'Cumbuco, Brazil',
    'Le Morne, Mauritius',
];

export default function Browse({ instructors = [], filters }: BrowseProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedSpot, setSelectedSpot] = useState(filters.country || 'All Spots');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('instructor.browse'),
            {
                search: search || undefined,
                country: selectedSpot !== 'All Spots' ? selectedSpot : undefined,
            },
            { preserveState: true }
        );
    };

    const handleSpotChange = (spot: string) => {
        setSelectedSpot(spot);
        router.get(
            route('instructor.browse'),
            {
                search: search || undefined,
                country: spot !== 'All Spots' ? spot : undefined,
            },
            { preserveState: true }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Browse Instructors - KiteLink" />

            <div className="relative min-h-full space-y-6 p-4 text-slate-900 selection:bg-blue-600/30 selection:text-blue-900 sm:p-6 lg:p-8 dark:text-slate-100 dark:selection:bg-[#3b82f6]/30 dark:selection:text-white">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            <Compass className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                            Instructor Network
                        </h1>
                        <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
                            Connect and discover fellow certified kitesurf coaches across 40+ global kite spots
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-950/30 dark:text-indigo-300">
                        <UserCheck className="h-4 w-4" />
                        Global Peer Network
                    </div>
                </div>

                {/* Search & Spot Pills */}
                <div className="space-y-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, certification (IKO/VDWS), or lagoon..."
                                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-blue-600 focus:outline-none sm:text-sm dark:border-white/10 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-500 dark:focus:border-[#3b82f6]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:scale-105 sm:text-sm dark:from-[#4ba9ff] dark:to-[#1f6eff]"
                        >
                            Search
                        </button>
                    </form>

                    {/* Spot Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                        {POPULAR_SPOTS.map((spot) => {
                            const isSelected = selectedSpot === spot;
                            return (
                                <button
                                    type="button"
                                    key={spot}
                                    onClick={() => handleSpotChange(spot)}
                                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                                        isSelected
                                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm dark:border-indigo-500/50 dark:bg-indigo-600/30 dark:text-white'
                                            : 'border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-slate-200'
                                    }`}
                                >
                                    {spot}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Instructors Grid */}
                {instructors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-16 text-center shadow-sm dark:border-white/10 dark:bg-slate-950/20">
                        <Compass className="mx-auto mb-3 h-10 w-10 text-slate-400 dark:text-slate-600" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Instructors Found</h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try adjusting your search criteria or spot filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {instructors.map((ins) => (
                            <div
                                key={ins.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:backdrop-blur-xl dark:hover:border-indigo-400/40 dark:hover:bg-white/[0.08]"
                            >
                                <div className="space-y-4">
                                    {/* Avatar & Header */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-sm font-bold text-blue-600 shadow-sm transition-transform group-hover:scale-105 dark:border-white/15 dark:bg-slate-800 dark:text-[#8acbff]">
                                            {ins.avatar ? (
                                                <img src={ins.avatar} alt={ins.name} className="h-full w-full object-cover" />
                                            ) : (
                                                ins.name?.charAt(0) || 'I'
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">{ins.name}</h3>
                                            <span className="flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
                                                <MapPin className="h-3 w-3 text-blue-500 dark:text-[#5bb4ff]" />
                                                {ins.location || 'Kalpitiya, Sri Lanka'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Certifications Badge */}
                                    <div className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-[#8acbff]">
                                        <Award className="h-3.5 w-3.5" />
                                        <span className="truncate font-semibold">{ins.certifications || 'IKO Certified Coach'}</span>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200/80 bg-slate-50 p-2.5 text-center text-xs dark:border-white/5 dark:bg-slate-950/40">
                                        <div>
                                            <span className="block text-[10px] text-slate-500 dark:text-slate-400">Rating</span>
                                            <span className="flex items-center justify-center gap-0.5 font-bold text-amber-500 dark:text-amber-400">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                {ins.rating || 4.9}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-500 dark:text-slate-400">Experience</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{ins.experience_years ? `${ins.experience_years} yrs` : '5+ yrs'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-500 dark:text-slate-400">Rate</span>
                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">${ins.hourly_rate ?? 65}/hr</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Link to Public Profile */}
                                <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
                                    <Link
                                        href={route('instructors.show', ins.id)}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/15 dark:hover:text-white"
                                    >
                                        <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                        View Public Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
