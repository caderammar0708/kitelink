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

            <div className="relative min-h-full space-y-6 p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            <Compass className="h-7 w-7 text-indigo-400" />
                            Instructor Network
                        </h1>
                        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                            Connect and discover fellow certified kitesurf coaches across 40+ global kite spots
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/30 px-4 py-1.5 text-xs font-semibold text-indigo-300">
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
                                className="w-full rounded-xl border border-white/10 bg-slate-950/40 py-2.5 pr-4 pl-10 text-xs text-white placeholder-slate-500 backdrop-blur-sm focus:border-[#3b82f6] focus:outline-none sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:scale-105 sm:text-sm"
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
                                            ? 'border-indigo-500/50 bg-indigo-600/30 text-white'
                                            : 'border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
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
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/20 px-4 py-16 text-center">
                        <Compass className="mx-auto mb-3 h-10 w-10 text-slate-600" />
                        <h3 className="text-base font-bold text-white">No Instructors Found</h3>
                        <p className="mt-1 text-xs text-slate-400">Try adjusting your search criteria or spot filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {instructors.map((ins) => (
                            <div
                                key={ins.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-indigo-400/40 hover:bg-white/[0.08]"
                            >
                                <div className="space-y-4">
                                    {/* Avatar & Header */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-slate-800 text-sm font-bold text-[#8acbff] shadow-md group-hover:scale-105 transition-transform">
                                            {ins.avatar ? (
                                                <img src={ins.avatar} alt={ins.name} className="h-full w-full object-cover" />
                                            ) : (
                                                ins.name?.charAt(0) || 'I'
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-base font-bold text-white">{ins.name}</h3>
                                            <span className="flex items-center gap-1 text-xs text-slate-400 truncate">
                                                <MapPin className="h-3 w-3 text-[#5bb4ff]" />
                                                {ins.location || 'Kalpitiya, Sri Lanka'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Certifications Badge */}
                                    <div className="flex items-center gap-1.5 text-xs text-[#8acbff]">
                                        <Award className="h-3.5 w-3.5" />
                                        <span className="font-semibold truncate">{ins.certifications || 'IKO Certified Coach'}</span>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-950/40 p-2.5 text-center text-xs">
                                        <div>
                                            <span className="block text-[10px] text-slate-400">Rating</span>
                                            <span className="flex items-center justify-center gap-0.5 font-bold text-amber-400">
                                                <Star className="h-3 w-3 fill-amber-400" />
                                                {ins.rating || 4.9}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-400">Experience</span>
                                            <span className="font-bold text-white">{ins.experience_years ? `${ins.experience_years} yrs` : '5+ yrs'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-slate-400">Rate</span>
                                            <span className="font-bold text-emerald-400">${ins.hourly_rate ?? 65}/hr</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Link to Public Profile */}
                                <div className="mt-5 border-t border-white/10 pt-4">
                                    <Link
                                        href={route('instructors.show', ins.id)}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] py-2 text-xs font-bold text-slate-200 transition hover:bg-white/15 hover:text-white"
                                    >
                                        <Eye className="h-3.5 w-3.5 text-[#5bb4ff]" />
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
