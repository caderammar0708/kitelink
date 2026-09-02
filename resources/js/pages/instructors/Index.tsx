import PublicLayout from '@/layouts/public-layout';
import { Head, Link } from '@inertiajs/react';
import { Award, ChevronRight, Compass, MapPin, Search, Star, Wind } from 'lucide-react';
import { useMemo, useState } from 'react';

interface InstructorItem {
    id: number;
    bio?: string;
    certifications?: string;
    experience_years?: number;
    location?: string;
    hourly_rate?: number | string;
    profile_photo?: string;
    is_freelance?: boolean;
    school?: { name: string };
    user?: { name: string; email: string; profile_picture?: string };
}

interface IndexProps {
    instructors?: InstructorItem[];
    filters?: {
        search?: string;
        location?: string;
    };
}

export function Index({ instructors = [], filters }: IndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedLocation, setSelectedLocation] = useState(filters?.location || 'all');

    // Extract unique locations from instructors list
    const uniqueLocations = useMemo(() => {
        const set = new Set<string>();
        instructors.forEach((ins) => {
            if (ins.location) set.add(ins.location);
        });
        return Array.from(set);
    }, [instructors]);

    const filteredInstructors = useMemo(() => {
        return instructors.filter((ins) => {
            const name = (ins.user?.name || '').toLowerCase();
            const bio = (ins.bio || '').toLowerCase();
            const location = (ins.location || '').toLowerCase();
            const q = search.toLowerCase();

            const matchesSearch = !q || name.includes(q) || bio.includes(q) || location.includes(q);
            const matchesLocation =
                selectedLocation === 'all' || location.includes(selectedLocation.toLowerCase());

            return matchesSearch && matchesLocation;
        });
    }, [instructors, search, selectedLocation]);

    return (
        <PublicLayout>
            <Head title="Find Certified Kitesurf Instructors - KiteLink" />

            <div className="space-y-8 sm:space-y-10">
                {/* Hero Header Section */}
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-slate-950/90 p-6 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:p-10 lg:p-12">
                    <div className="pointer-events-none absolute -mr-12 -mt-12 top-0 right-0 h-80 w-80 rounded-full bg-[#3b82f6]/15 blur-3xl" />

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#5bb4ff]/30 bg-[#5bb4ff]/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8acbff] backdrop-blur-md">
                            <Compass className="h-3.5 w-3.5 text-[#5bb4ff]" />
                            Verified Kitesurf Instructors
                        </div>

                        <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Find the Best <br className="hidden sm:inline" />
                            <span className="bg-gradient-to-r from-[#b8e6ff] via-[#8acbff] to-[#4da6ff] bg-clip-text text-transparent">
                                Kitesurf Instructors
                            </span>
                        </h1>

                        <p className="max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base lg:text-lg">
                            Discover and connect directly with certified IKO & VDWS instructors and premier kite schools worldwide. Book lessons with
                            zero middleman fees.
                        </p>
                    </div>

                    {/* Search & Location Filter Bar */}
                    <div className="relative z-10 mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-12 sm:gap-4">
                        <div className="relative sm:col-span-8">
                            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by instructor name, spot, or keyword..."
                                className="w-full rounded-2xl border border-white/15 bg-slate-950/70 py-3.5 pr-4 pl-11 text-sm text-white placeholder-slate-400/60 shadow-inner backdrop-blur-md transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                            />
                        </div>

                        <div className="relative sm:col-span-4">
                            <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#5bb4ff]" />
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full cursor-pointer appearance-none rounded-2xl border border-white/15 bg-slate-950/70 py-3.5 pr-8 pl-11 text-sm text-white shadow-inner backdrop-blur-md transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                            >
                                <option value="all" className="bg-[#070b12] text-white">
                                    All Locations
                                </option>
                                <option value="kalpitiya" className="bg-[#070b12] text-white">
                                    Kalpitiya, Sri Lanka
                                </option>
                                <option value="tarifa" className="bg-[#070b12] text-white">
                                    Tarifa, Spain
                                </option>
                                <option value="cabarete" className="bg-[#070b12] text-white">
                                    Cabarete, Dominican Rep.
                                </option>
                                <option value="dakhla" className="bg-[#070b12] text-white">
                                    Dakhla, Morocco
                                </option>
                                {uniqueLocations.map((loc) => (
                                    <option key={loc} value={loc} className="bg-[#070b12] text-white">
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count & Section Title */}
                <div className="flex items-center justify-between px-1">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
                        <span>Available Instructors</span>
                        <span className="rounded-full border border-[#5bb4ff]/30 bg-[#5bb4ff]/15 px-2.5 py-0.5 text-xs font-semibold text-[#8acbff]">
                            {filteredInstructors.length}
                        </span>
                    </h2>

                    {(search || selectedLocation !== 'all') && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSelectedLocation('all');
                            }}
                            className="cursor-pointer text-xs font-semibold text-[#8acbff] transition-colors hover:text-white"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                {/* Instructors Responsive Grid (2-3 columns on desktop, 1 on mobile) */}
                {filteredInstructors.length === 0 ? (
                    <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 py-20 text-center backdrop-blur-md">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5bb4ff]/30 bg-gradient-to-br from-[#1f6eff]/20 to-[#5bb4ff]/10 text-[#5bb4ff] shadow-lg">
                            <Wind className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white">No Instructors Found</h3>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                            We couldn't find any certified instructors matching your current search criteria. Try resetting your search filters or browse
                            all locations.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSelectedLocation('all');
                            }}
                            className="mt-6 cursor-pointer rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/15"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredInstructors.map((ins) => {
                            const photo = ins.profile_photo || ins.user?.profile_picture;
                            const name = ins.user?.name || 'Certified Instructor';
                            const location = ins.location || 'Kalpitiya, Sri Lanka';
                            const certs = ins.certifications || 'IKO Level 2 Certified';
                            const rate = ins.hourly_rate ?? 65;

                            return (
                                <Link
                                    key={ins.id}
                                    href={`/instructors/${ins.id}`}
                                    className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5bb4ff]/60 hover:bg-white/[0.10] sm:p-7"
                                >
                                    <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-[#3b82f6]/10 blur-2xl transition-all group-hover:bg-[#5bb4ff]/20" />

                                    <div>
                                        {/* Card Top / Avatar + Info */}
                                        <div className="mb-5 flex items-start gap-4">
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#5bb4ff]/40 bg-slate-900 shadow-md transition-transform duration-300 group-hover:scale-105 sm:h-18 sm:w-18">
                                                {photo ? (
                                                    <img src={photo} alt={name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="bg-gradient-to-br from-[#b8e6ff] to-[#4da6ff] bg-clip-text text-2xl font-black text-transparent">
                                                        {name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-lg font-bold text-white transition-colors group-hover:text-[#8acbff] sm:text-xl">
                                                    {name}
                                                </h3>
                                                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-300/80">
                                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5bb4ff]" />
                                                    <span>{location}</span>
                                                </p>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#5bb4ff]/30 bg-[#5bb4ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-[#8acbff] uppercase">
                                                        <Award className="h-3 w-3 text-[#5bb4ff]" />
                                                        {certs.split(',')[0]}
                                                    </span>
                                                    <span className="ml-auto flex items-center gap-1 text-xs font-bold text-amber-400">
                                                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                                                        4.9
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bio Snippet */}
                                        <p className="mb-5 line-clamp-3 text-xs leading-relaxed text-slate-300/80 sm:text-sm">
                                            {ins.bio ||
                                                'Passionate certified kitesurfing coach offering beginner progressions, board control, transitions, wave riding, and safety mastery in flat water & ocean spots.'}
                                        </p>
                                    </div>

                                    {/* Card Bottom / Rate & Action */}
                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <div>
                                            <span className="block text-[10px] font-medium tracking-wider text-slate-400 uppercase">Rate</span>
                                            <span className="text-lg font-extrabold text-emerald-400">
                                                ${rate}
                                                <span className="text-xs font-normal text-slate-400">/hr</span>
                                            </span>
                                        </div>

                                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 group-hover:scale-105 group-hover:from-[#5bb4ff] group-hover:to-[#2e7bff]">
                                            View Profile
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}

export default Index;
