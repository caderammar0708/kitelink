import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/public-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Award,
    Building2,
    ChevronRight,
    Compass,
    MapPin,
    Search,
    ShieldCheck,
    Users,
    Waves,
    Wind,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface InstructorItem {
    id: number;
    bio?: string;
    certifications?: string;
    hourly_rate?: number | string;
    profile_photo?: string;
    user?: { name: string; profile_picture?: string };
}

interface SchoolItem {
    id: number;
    name: string;
    location?: string | null;
    description?: string | null;
    certifications?: string | null;
    facilities?: string[] | null;
    gear_list?: string[] | null;
    photos?: string[] | null;
    logo?: string | null;
    phone?: string | null;
    website?: string | null;
    contact_name?: string | null;
    instructors?: InstructorItem[];
}

interface IndexProps {
    schools?: SchoolItem[];
    filters?: {
        search?: string;
        location?: string;
    };
}

export function Index({ schools = [], filters }: IndexProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;
    const isSchool = auth?.user?.role === 'school';
    const isInstructor = auth?.user?.role === 'instructor';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: isSchool
                ? 'School Dashboard'
                : isInstructor
                ? 'Instructor Dashboard'
                : 'Dashboard',
            href: isSchool
                ? '/school/dashboard'
                : isInstructor
                ? '/instructor/dashboard'
                : '/dashboard',
        },
        {
            title: 'Explore Kite Centers',
            href: '/schools',
        },
    ];

    const [search, setSearch] = useState(filters?.search || '');
    const [selectedLocation, setSelectedLocation] = useState(filters?.location || 'all');

    // Extract unique locations from schools list
    const uniqueLocations = useMemo(() => {
        const set = new Set<string>();
        schools.forEach((sch) => {
            if (sch.location) {
                set.add(sch.location);
            }
        });
        return Array.from(set);
    }, [schools]);

    const filteredSchools = useMemo(() => {
        return schools.filter((sch) => {
            const name = (sch.name || '').toLowerCase();
            const desc = (sch.description || '').toLowerCase();
            const location = (sch.location || '').toLowerCase();
            const certs = (sch.certifications || '').toLowerCase();
            const q = search.toLowerCase();

            const matchesSearch =
                !q ||
                name.includes(q) ||
                desc.includes(q) ||
                location.includes(q) ||
                certs.includes(q);

            const matchesLocation =
                selectedLocation === 'all' ||
                location.includes(selectedLocation.toLowerCase());

            return matchesSearch && matchesLocation;
        });
    }, [schools, search, selectedLocation]);

    const content = (
        <div
            className={`space-y-8 text-slate-900 transition-colors duration-200 dark:text-slate-100 ${
                isAuthenticated ? 'p-4 sm:p-6 lg:p-8' : 'sm:space-y-10'
            }`}
        >
            {/* Hero Header Section */}
            <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-indigo-50/40 p-6 shadow-sm backdrop-blur-2xl sm:p-10 lg:p-12 dark:border-white/15 dark:bg-gradient-to-r dark:from-blue-950/60 dark:via-slate-900/80 dark:to-slate-950/90 dark:shadow-2xl">
                <div className="pointer-events-none absolute top-0 right-0 -mr-12 -mt-12 h-80 w-80 rounded-full bg-[#3b82f6]/10 blur-3xl dark:bg-[#3b82f6]/15" />

                <div className="relative z-10 max-w-3xl space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold tracking-wider text-blue-700 uppercase backdrop-blur-md dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                        Approved Kitesurf Centers &amp; Academies
                    </div>

                    <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                        Explore Premier <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent dark:from-[#b8e6ff] dark:via-[#8acbff] dark:to-[#4da6ff]">
                            Kite Centers &amp; Schools
                        </span>
                    </h1>

                    <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg dark:text-slate-300/90">
                        Discover top-rated, certified kite schools worldwide. Browse facilities, inspect certified coaching rosters, and book lesson packages directly with zero commission.
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
                            placeholder="Search by school name, spot, facilities, or certification..."
                            className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pr-4 pl-11 text-sm text-slate-900 placeholder-slate-400 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/70 dark:text-white dark:placeholder-slate-400/60 dark:hover:border-white/25 dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                        />
                    </div>

                    <div className="relative sm:col-span-4">
                        <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-blue-600 dark:text-[#5bb4ff]" />
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-300 bg-white py-3.5 pr-8 pl-11 text-sm text-slate-900 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/70 dark:text-white dark:hover:border-white/25 dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                        >
                            <option value="all" className="bg-white text-slate-900 dark:bg-[#070b12] dark:text-white">
                                All Locations
                            </option>
                            <option value="kalpitiya" className="bg-white text-slate-900 dark:bg-[#070b12] dark:text-white">
                                Kalpitiya, Sri Lanka
                            </option>
                            <option value="tarifa" className="bg-white text-slate-900 dark:bg-[#070b12] dark:text-white">
                                Tarifa, Spain
                            </option>
                            <option value="cabarete" className="bg-white text-slate-900 dark:bg-[#070b12] dark:text-white">
                                Cabarete, Dominican Rep.
                            </option>
                            <option value="dakhla" className="bg-white text-slate-900 dark:bg-[#070b12] dark:text-white">
                                Dakhla, Morocco
                            </option>
                            {uniqueLocations.map((loc) => (
                                <option key={loc} value={loc} className="bg-white text-slate-900 dark:bg-[#070b12] dark:text-white">
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count & Section Title */}
            <div className="flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                    <span>Approved Kite Centers</span>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                        {filteredSchools.length}
                    </span>
                </h2>

                {(search || selectedLocation !== 'all') && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setSelectedLocation('all');
                        }}
                        className="cursor-pointer text-xs font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-[#8acbff] dark:hover:text-white"
                    >
                        Reset filters
                    </button>
                )}
            </div>

            {/* Kite Centers Responsive Grid */}
            {filteredSchools.length === 0 ? (
                <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-slate-300 bg-white p-8 py-20 text-center shadow-sm dark:border-white/15 dark:bg-white/[0.02]">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 shadow-sm dark:border-[#5bb4ff]/30 dark:bg-gradient-to-br dark:from-[#1f6eff]/20 dark:to-[#5bb4ff]/10 dark:text-[#5bb4ff]">
                        <Building2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Kite Centers Found</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        We couldn't find any approved kite centers matching your search criteria. Try modifying your keywords or resetting filters.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setSelectedLocation('all');
                        }}
                        className="mt-6 cursor-pointer rounded-xl border border-slate-300 bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSchools.map((school) => {
                        const coverPhoto = school.photos?.[0] || school.logo;
                        const instructorsCount = school.instructors?.length || 0;
                        const facilities = Array.isArray(school.facilities) ? school.facilities : [];

                        return (
                            <Link
                                key={school.id}
                                href={`/schools/${school.id}`}
                                className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-md dark:border-white/15 dark:bg-white/[0.06] dark:shadow-2xl dark:hover:border-[#5bb4ff]/60 dark:hover:bg-white/[0.10] sm:p-7"
                            >
                                <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl transition-all group-hover:bg-blue-500/10 dark:bg-[#3b82f6]/10 dark:group-hover:bg-[#5bb4ff]/20" />

                                <div>
                                    {/* Cover image or Logo thumbnail header */}
                                    <div className="relative mb-5 h-44 w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs dark:border-white/10 dark:bg-slate-900">
                                        {coverPhoto ? (
                                            <img
                                                src={coverPhoto}
                                                alt={school.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-blue-600/20 via-sky-500/10 to-indigo-600/20 p-4 text-center">
                                                <Building2 className="h-10 w-10 text-blue-600 dark:text-[#5bb4ff]" />
                                                <span className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    Kiteboarding Center
                                                </span>
                                            </div>
                                        )}

                                        {school.certifications && (
                                            <div className="absolute top-3 left-3">
                                                <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/90 bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wider text-blue-700 shadow-xs uppercase backdrop-blur-md dark:border-[#5bb4ff]/30 dark:bg-[#070b12]/80 dark:text-[#8acbff]">
                                                    <Award className="h-3 w-3 text-blue-600 dark:text-[#5bb4ff]" />
                                                    {school.certifications.split(',')[0]}
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute right-3 bottom-3">
                                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/90 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-xs backdrop-blur-md dark:border-white/15 dark:bg-[#070b12]/80 dark:text-slate-200">
                                                <Users className="h-3 w-3 text-blue-600 dark:text-[#5bb4ff]" />
                                                {instructorsCount} {instructorsCount === 1 ? 'Coach' : 'Coaches'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* School Title & Location */}
                                    <div className="mb-3">
                                        <h3 className="truncate text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-[#8acbff]">
                                            {school.name}
                                        </h3>
                                        {school.location && (
                                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300/80">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-[#5bb4ff]" />
                                                <span className="truncate">{school.location}</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Description Snippet */}
                                    {school.description ? (
                                        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300/80">
                                            {school.description}
                                        </p>
                                    ) : (
                                        <p className="mb-4 text-xs italic text-slate-400">
                                            Certified kitesurf center offering courses, gear rentals, and coaching.
                                        </p>
                                    )}

                                    {/* Facilities Pills */}
                                    {facilities.length > 0 && (
                                        <div className="mb-4 flex flex-wrap gap-1.5">
                                            {facilities.slice(0, 3).map((facility, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-[#5bb4ff]" />
                                                    {facility}
                                                </span>
                                            ))}
                                            {facilities.length > 3 && (
                                                <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
                                                    +{facilities.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Card Bottom / View Profile CTA */}
                                <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                        <Wind className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                        <span>Direct Booking</span>
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
    );

    if (isAuthenticated) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Explore Kite Centers & Schools - KiteLink" />
                {content}
            </AppLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="Explore Kite Centers & Schools - KiteLink" />
            {content}
        </PublicLayout>
    );
}

export default Index;
