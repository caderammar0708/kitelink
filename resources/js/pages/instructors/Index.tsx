import ExpandableProfileCard from '@/components/expandable-profile-card';
import InstructorProfileContent, {
    type BookingItem,
    type InstructorData,
    InstructorProfileSkeleton,
} from '@/components/instructor-profile-content';
import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/public-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Award, Compass, MapPin, Search, Wind } from 'lucide-react';
import { useMemo, useState } from 'react';

interface InstructorFullProfileResponse {
    instructor?: InstructorData;
    existingBooking?: BookingItem | null;
}

interface InstructorItem {
    id: number;
    bio?: string;
    certifications?: string;
    experience_years?: number;
    location?: string;
    hourly_rate?: number | string;
    daily_rate?: number | string;
    languages?: string[] | string | null;
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
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;
    const isInstructor = auth?.user?.role === 'instructor';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: isInstructor ? 'Instructor Dashboard' : 'Dashboard',
            href: isInstructor ? '/instructor/dashboard' : '/dashboard',
        },
        {
            title: 'Find Instructors',
            href: '/instructors',
        },
    ];

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
            const matchesLocation = selectedLocation === 'all' || location.includes(selectedLocation.toLowerCase());

            return matchesSearch && matchesLocation;
        });
    }, [instructors, search, selectedLocation]);

    const content = (
        <div
            className={`space-y-8 text-slate-900 transition-colors duration-200 dark:text-slate-100 ${isAuthenticated ? 'p-4 sm:p-6 lg:p-8' : 'sm:space-y-10'}`}
        >
            {/* Hero Header Section */}
            <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-indigo-50/40 p-6 shadow-sm backdrop-blur-2xl sm:p-10 lg:p-12 dark:border-white/15 dark:bg-gradient-to-r dark:from-blue-950/60 dark:via-slate-900/80 dark:to-slate-950/90 dark:shadow-2xl">
                <div className="pointer-events-none absolute top-0 right-0 -mt-12 -mr-12 h-80 w-80 rounded-full bg-[#3b82f6]/10 blur-3xl dark:bg-[#3b82f6]/15" />

                <div className="relative z-10 max-w-3xl space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold tracking-wider text-blue-700 uppercase backdrop-blur-md dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                        <Compass className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                        Verified Kitesurf Instructors
                    </div>

                    <h1 className="text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                        Find the Best <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent dark:from-[#b8e6ff] dark:via-[#8acbff] dark:to-[#4da6ff]">
                            Kitesurf Instructors
                        </span>
                    </h1>

                    <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg dark:text-slate-300/90">
                        Discover and connect directly with certified IKO & VDWS instructors and premier kite schools worldwide. Book lessons with zero
                        middleman fees.
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
                    <span>Available Instructors</span>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
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
                        className="cursor-pointer text-xs font-semibold text-blue-600 transition-colors hover:text-blue-800 dark:text-[#8acbff] dark:hover:text-white"
                    >
                        Reset filters
                    </button>
                )}
            </div>

            {/* Instructors Responsive Grid (2-3 columns on desktop, 1 on mobile) */}
            {filteredInstructors.length === 0 ? (
                <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-slate-300 bg-white p-8 py-20 text-center shadow-sm dark:border-white/15 dark:bg-white/[0.02]">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 shadow-sm dark:border-[#5bb4ff]/30 dark:bg-gradient-to-br dark:from-[#1f6eff]/20 dark:to-[#5bb4ff]/10 dark:text-[#5bb4ff]">
                        <Wind className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Instructors Found</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        We couldn't find any certified instructors matching your current search criteria. Try resetting your search filters or browse
                        all locations.
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
                    {filteredInstructors.map((ins) => {
                        const photo = ins.profile_photo || ins.user?.profile_picture || null;
                        const name = ins.user?.name || 'Certified Instructor';
                        const location = ins.location || 'Location upon request';
                        const certs = ins.certifications || null;
                        const rate = ins.hourly_rate ?? 65;

                        const formattedLanguages: string[] = (() => {
                            if (!ins.languages) return [];
                            if (Array.isArray(ins.languages)) return ins.languages;
                            if (typeof ins.languages === 'string') {
                                try {
                                    const parsed = JSON.parse(ins.languages);
                                    if (Array.isArray(parsed)) return parsed;
                                } catch {
                                    return ins.languages
                                        .split(',')
                                        .map((l) => l.trim())
                                        .filter(Boolean);
                                }
                            }
                            return [];
                        })();

                        const certTags = certs
                            ? certs
                                  .split(',')
                                  .map((c) => c.trim())
                                  .filter(Boolean)
                            : [];
                        const tags = [...certTags, ...formattedLanguages];

                        const details = [
                            {
                                label: 'Hourly Rate',
                                value: (
                                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                        ${rate} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ hour</span>
                                    </span>
                                ),
                            },
                            ...(ins.daily_rate
                                ? [
                                      {
                                          label: 'Daily Rate',
                                          value: (
                                              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                                  ${ins.daily_rate}{' '}
                                                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ day</span>
                                              </span>
                                          ),
                                      },
                                  ]
                                : []),
                            ...(formattedLanguages.length > 0
                                ? [
                                      {
                                          label: 'Languages',
                                          value: formattedLanguages.join(', '),
                                      },
                                  ]
                                : []),
                            ...(ins.experience_years
                                ? [
                                      {
                                          label: 'Experience',
                                          value: `${ins.experience_years} ${ins.experience_years === 1 ? 'Year' : 'Years'} Teaching`,
                                      },
                                  ]
                                : []),
                            ...(ins.school?.name
                                ? [
                                      {
                                          label: 'School Affiliation',
                                          value: ins.school.name,
                                      },
                                  ]
                                : [
                                      {
                                          label: 'Type',
                                          value: ins.is_freelance ? 'Freelance Instructor' : 'Independent Coach',
                                      },
                                  ]),
                        ];

                        return (
                            <ExpandableProfileCard<InstructorFullProfileResponse>
                                key={ins.id}
                                id={ins.id}
                                title={name}
                                location={location}
                                imageSrc={photo}
                                profileUrl={`/instructors/${ins.id}`}
                                profileButtonText="View Full Profile"
                                bio={ins.bio || 'Certified kitesurf instructor dedicated to safe progression, wave riding, and freestyle technique.'}
                                details={details}
                                tags={tags}
                                renderFullProfile={({ data, isLoading, onClose, layoutId }) => {
                                    if (isLoading && !data) {
                                        return (
                                            <div className="space-y-6">
                                                <InstructorProfileSkeleton name={name} photo={photo} location={location} />
                                            </div>
                                        );
                                    }

                                    const instructorData = data?.instructor || {
                                        ...ins,
                                        user: ins.user || { name },
                                    };

                                    return (
                                        <InstructorProfileContent
                                            instructor={instructorData}
                                            existingBooking={data?.existingBooking}
                                            layoutId={layoutId}
                                            onClose={onClose}
                                            hideTopNav
                                        />
                                    );
                                }}
                                topBadge={
                                    certs ? (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200/90 bg-white/95 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-blue-700 uppercase shadow-xs backdrop-blur-md dark:border-[#5bb4ff]/30 dark:bg-[#070b12]/80 dark:text-[#8acbff]">
                                            <Award className="h-3 w-3 text-blue-600 dark:text-[#5bb4ff]" />
                                            {certs.split(',')[0]}
                                        </span>
                                    ) : null
                                }
                                cornerBadge={
                                    <span className="inline-flex items-center rounded-full border border-emerald-300/40 bg-emerald-950/80 px-2.5 py-0.5 text-xs font-bold text-emerald-300 shadow-xs backdrop-blur-md">
                                        ${rate}/hr
                                    </span>
                                }
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );

    if (isAuthenticated) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Find Certified Kitesurf Instructors - Winduo" />
                {content}
            </AppLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title="Find Certified Kitesurf Instructors - Winduo" />
            {content}
        </PublicLayout>
    );
}

export default Index;
