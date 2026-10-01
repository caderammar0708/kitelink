import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/public-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Award,
    Building2,
    Calendar,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    DollarSign,
    ExternalLink,
    Globe,
    Layers,
    LoaderCircle,
    Mail,
    MapPin,
    Package,
    Phone,
    ShieldCheck,
    Sparkles,
    Star,
    Tag,
    User,
    Users,
    Waves,
    Wind,
    X,
} from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';

interface PackageItem {
    id: number;
    school_id: number;
    name: string;
    type: 'course' | 'rental' | 'camp' | 'private' | string;
    duration_label: string;
    price: number | string;
    description?: string | null;
    features?: string[] | null;
    is_active: boolean;
}

interface InstructorItem {
    id: number;
    bio?: string | null;
    certifications?: string | null;
    experience_years?: number | string | null;
    location?: string | null;
    hourly_rate?: number | string | null;
    profile_photo?: string | null;
    user?: { id: number; name: string; email?: string; profile_picture?: string } | null;
}

interface ReviewItem {
    id: number;
    rating: number;
    comment: string;
    instructor_reply?: string | null;
    created_at?: string;
    student?: { id: number; name: string; profile_picture?: string };
    instructor_name?: string;
    instructor_photo?: string;
}

interface SchoolProps {
    school: {
        id: number;
        name: string;
        registration_number?: string | null;
        contact_name?: string | null;
        location?: string | null;
        description?: string | null;
        facilities?: string[] | null;
        gear_list?: string[] | null;
        photos?: string[] | null;
        certifications?: string | null;
        logo?: string | null;
        phone?: string | null;
        website?: string | null;
        is_active?: boolean;
        user?: { id: number; name: string; email: string } | null;
        instructors?: InstructorItem[];
        packages?: PackageItem[];
    };
    reviews?: ReviewItem[];
}

export function Show({ school, reviews = [] }: SchoolProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;
    const isSchool = auth?.user?.role === 'school';
    const isInstructor = auth?.user?.role === 'instructor';

    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [bookingPackage, setBookingPackage] = useState<PackageItem | null>(null);
    const [bookingSubmitted, setBookingSubmitted] = useState(false);
    const [submittedBookingId, setSubmittedBookingId] = useState<number | null>(null);

    const name = school.name;
    const logo = school.logo;
    const location = school.location;
    const certs = school.certifications;
    const facilities = Array.isArray(school.facilities) ? school.facilities : [];
    const gearList = Array.isArray(school.gear_list) ? school.gear_list : [];
    const photos = Array.isArray(school.photos) ? school.photos : [];
    const instructors = school.instructors || [];
    const packages = school.packages || [];

    const averageRating = useMemo(() => {
        if (!reviews || reviews.length === 0) return null;
        const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
        return sum / reviews.length;
    }, [reviews]);

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
        {
            title: name,
            href: `/schools/${school.id}`,
        },
    ];

    // Tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    // Package Booking Form
    const { data: bookingData, setData: setBookingData, post: postBooking, processing: bookingProcessing, errors: bookingErrors, reset: resetBooking } = useForm({
        package_id: 0,
        school_id: school.id,
        date: defaultDate,
        time: '10:00 AM (Morning Session)',
        students_count: 1,
        notes: '',
    });

    const openBookingModal = (pkg: PackageItem) => {
        if (!isAuthenticated) {
            window.location.href = route('login');
            return;
        }
        setBookingPackage(pkg);
        setBookingSubmitted(false);
        setSubmittedBookingId(null);
        setBookingData({
            package_id: pkg.id,
            school_id: school.id,
            date: defaultDate,
            time: '10:00 AM (Morning Session)',
            students_count: 1,
            notes: '',
        });
    };

    const handlePackageBookingSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        postBooking(route('bookings.store'), {
            preserveScroll: true,
            onSuccess: (page) => {
                setBookingSubmitted(true);
                resetBooking('notes');
                const flashId = (page.props as any)?.flash?.booking_id || (page.props as any)?.booking_id;
                if (flashId) {
                    setSubmittedBookingId(Number(flashId));
                }
            },
        });
    };

    const typeBadges: Record<string, { label: string; class: string }> = {
        course: { label: 'Course', class: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-[#8acbff] dark:border-[#5bb4ff]/30' },
        rental: { label: 'Rental', class: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30' },
        camp: { label: 'Camp', class: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30' },
        private: { label: 'Private Lesson', class: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30' },
    };

    const content = (
        <div
            className={`space-y-8 sm:space-y-10 ${
                isAuthenticated ? 'p-4 sm:p-6 lg:p-8' : 'mx-auto max-w-7xl'
            }`}
        >
            {/* Top Navigation & Status */}
            <div className="flex items-center justify-between">
                <Link
                    href={route('schools.index')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-[#5bb4ff] sm:text-sm"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to All Kite Centers
                </Link>

                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        Verified Partner Center
                    </span>
                </div>
            </div>

            {/* Hero Header Glass Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md backdrop-blur-2xl sm:p-10 dark:border-white/15 dark:bg-gradient-to-r dark:from-blue-950/60 dark:via-slate-900/80 dark:to-slate-950/90 dark:shadow-2xl">
                <div className="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl dark:bg-[#3b82f6]/15" />

                <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start">
                    {/* School Logo / Avatar */}
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-blue-200 bg-slate-100 shadow-md sm:h-36 sm:w-36 lg:h-40 lg:w-40 dark:border-[#5bb4ff]/40 dark:bg-slate-900 dark:shadow-[0_0_25px_rgba(91,180,255,0.25)]">
                        {logo ? (
                            <img src={logo} alt={name} className="h-full w-full object-cover" />
                        ) : photos.length > 0 ? (
                            <img src={photos[0]} alt={name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                                <Building2 className="h-12 w-12 text-blue-600 dark:text-[#5bb4ff]" />
                                <span className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                                    Kite Center
                                </span>
                            </div>
                        )}
                    </div>

                    {/* School Info Header */}
                    <div className="flex-1 space-y-3.5 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                {name}
                            </h1>
                            {certs && (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                                    <Award className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                    {certs}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 sm:text-sm md:justify-start dark:text-slate-300">
                            {location && (
                                <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-[#8acbff]">
                                    <MapPin className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                    {location}
                                </span>
                            )}
                            {location && <span className="text-slate-400">•</span>}
                            <span className="flex items-center gap-1">
                                <Package className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                {packages.length} {packages.length === 1 ? 'Package' : 'Packages'} Available
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                {instructors.length} Certified {instructors.length === 1 ? 'Instructor' : 'Instructors'}
                            </span>
                            {averageRating !== null && (
                                <>
                                    <span className="text-slate-400">•</span>
                                    <span className="flex items-center gap-1 font-bold text-amber-500 dark:text-amber-400">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        {averageRating.toFixed(1)} ({reviews.length} verified review{reviews.length === 1 ? '' : 's'})
                                    </span>
                                </>
                            )}
                        </div>

                        {school.description ? (
                            <p className="max-w-3xl pt-1 text-sm leading-relaxed text-slate-700 whitespace-pre-line sm:text-base dark:text-slate-300/90">
                                {school.description}
                            </p>
                        ) : (
                            <p className="max-w-3xl pt-1 text-xs italic text-slate-500 dark:text-slate-400">
                                Certified kitesurf center offering lessons, coaching, gear rental, and safety services.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* 2-Column Content Layout */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                {/* Left Column: Packages, Instructor Roster, Photos, Facilities & Reviews */}
                <div className="space-y-8 lg:col-span-8">
                    {/* PROMINENT PACKAGES SECTION */}
                    <div id="packages-section" className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-black text-slate-900 sm:text-2xl dark:text-white">
                                    <Package className="h-6 w-6 text-blue-600 dark:text-[#5bb4ff]" />
                                    School Packages &amp; Courses
                                </h2>
                                <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                                    Structured progression lessons, equipment rentals, and camp packages offered directly by {name}
                                </p>
                            </div>

                            <span className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                                {packages.length} Active {packages.length === 1 ? 'Package' : 'Packages'}
                            </span>
                        </div>

                        {packages.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                <Package className="mx-auto h-10 w-10 text-slate-400" />
                                <h3 className="mt-2 text-base font-bold text-slate-800 dark:text-slate-200">
                                    Custom Packages Available On Inquiry
                                </h3>
                                <p className="mx-auto mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
                                    This center offers tailored courses upon request. Contact them directly or explore instructor roster below.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {packages.map((pkg) => {
                                    const badge = typeBadges[pkg.type] || typeBadges.course;
                                    const features = Array.isArray(pkg.features) ? pkg.features : [];

                                    return (
                                        <div
                                            key={pkg.id}
                                            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-[#5bb4ff]/40 dark:hover:bg-white/[0.06]"
                                        >
                                            <div>
                                                {/* Card Header / Badge & Duration */}
                                                <div className="flex items-center justify-between gap-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${badge.class}`}
                                                    >
                                                        <Tag className="h-3 w-3" />
                                                        {badge.label}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                        <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                                        {pkg.duration_label}
                                                    </span>
                                                </div>

                                                {/* Package Name & Price */}
                                                <div className="mt-3.5">
                                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors dark:text-white dark:group-hover:text-[#8acbff]">
                                                        {pkg.name}
                                                    </h3>

                                                    <div className="mt-2 flex items-baseline gap-1">
                                                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                            ${Number(pkg.price).toFixed(0)}
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                            / student
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                {pkg.description && (
                                                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-300">
                                                        {pkg.description}
                                                    </p>
                                                )}

                                                {/* Included Features Bullet Points */}
                                                {features.length > 0 && (
                                                    <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 dark:border-white/10">
                                                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            Included Features
                                                        </span>
                                                        <ul className="space-y-1.5">
                                                            {features.map((feat, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                                                                >
                                                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                                                    <span>{feat}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            <div className="mt-5 border-t border-slate-100 pt-3.5 dark:border-white/10">
                                                <button
                                                    type="button"
                                                    onClick={() => openBookingModal(pkg)}
                                                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] hover:from-[#5bb4ff] hover:to-[#2e7bff]"
                                                >
                                                    <span>Book This Package</span>
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* CERTIFIED INSTRUCTORS ROSTER SECTION */}
                    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md backdrop-blur-xl sm:p-8 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                                    <Users className="h-5 w-5 text-blue-600 dark:text-[#5bb4ff]" />
                                    Instructor Roster
                                </h2>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Certified coaches providing coaching sessions at {name}
                                </p>
                            </div>
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                                {instructors.length} {instructors.length === 1 ? 'Coach' : 'Coaches'} On Roster
                            </span>
                        </div>

                        {instructors.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                <Users className="mx-auto h-8 w-8 text-slate-400" />
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    No active coaches listed on roster currently.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {instructors.map((ins) => {
                                    const insName = ins.user?.name || 'Instructor';
                                    const insPhoto = ins.profile_photo || ins.user?.profile_picture;
                                    const insRate = ins.hourly_rate ?? 65;

                                    return (
                                        <div
                                            key={ins.id}
                                            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 transition-all hover:border-blue-400 hover:bg-white hover:shadow-md dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-[#5bb4ff]/40 dark:hover:bg-white/[0.06]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-200 bg-white shadow-xs dark:border-[#5bb4ff]/30 dark:bg-slate-900">
                                                    {insPhoto ? (
                                                        <img
                                                            src={insPhoto}
                                                            alt={insName}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xl font-bold text-blue-600 dark:text-[#8acbff]">
                                                            {insName.charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                                                        {insName}
                                                    </h3>
                                                    {ins.certifications && (
                                                        <p className="truncate text-[11px] font-semibold text-blue-600 dark:text-[#8acbff]">
                                                            {ins.certifications.split(',')[0]}
                                                        </p>
                                                    )}
                                                    {ins.experience_years && (
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                            {ins.experience_years} years experience
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-white/10">
                                                <div>
                                                    <span className="text-[10px] text-slate-500 uppercase dark:text-slate-400">
                                                        Rate
                                                    </span>
                                                    <span className="block text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                        ${insRate}
                                                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                                                            /hr
                                                        </span>
                                                    </span>
                                                </div>

                                                <Link
                                                    href={`/instructors/${ins.id}`}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                                >
                                                    View Profile
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Photos Gallery */}
                    {photos.length > 0 && (
                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md backdrop-blur-xl sm:p-7 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                                <Sparkles className="h-5 w-5 text-blue-600 dark:text-[#5bb4ff]" />
                                Center Photos &amp; Spot Views
                            </h2>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {photos.map((photoUrl, idx) => (
                                    <button
                                        type="button"
                                        key={idx}
                                        onClick={() => setSelectedPhoto(photoUrl)}
                                        className="group relative h-36 w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition-all hover:border-blue-400 sm:h-44 dark:border-white/10 dark:bg-slate-900"
                                    >
                                        <img
                                            src={photoUrl}
                                            alt={`${name} photo ${idx + 1}`}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-blue-900/0 transition-colors group-hover:bg-blue-900/20" />
                                    </button>
                                ))}
                            </div>

                            {/* Full-view Modal */}
                            {selectedPhoto && (
                                <div
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                                    onClick={() => setSelectedPhoto(null)}
                                >
                                    <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-slate-950 p-2 shadow-2xl">
                                        <img
                                            src={selectedPhoto}
                                            alt="Enlarged Center View"
                                            className="max-h-[80vh] w-auto rounded-xl object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPhoto(null)}
                                            className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Facilities & Amenities */}
                    {facilities.length > 0 && (
                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md backdrop-blur-xl sm:p-7 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                                <Building2 className="h-5 w-5 text-blue-600 dark:text-[#5bb4ff]" />
                                Facilities &amp; Spot Amenities
                            </h2>

                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {facilities.map((facility, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100/80 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-200 sm:text-sm"
                                    >
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                                            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                        </div>
                                        <span>{facility}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gear & Equipment list */}
                    {gearList.length > 0 && (
                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md backdrop-blur-xl sm:p-7 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                                <Layers className="h-5 w-5 text-blue-600 dark:text-[#5bb4ff]" />
                                Gear &amp; Equipment Fleet
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {gearList.map((gear, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-800 dark:border-[#5bb4ff]/20 dark:bg-[#5bb4ff]/10 dark:text-[#8acbff]"
                                    >
                                        <Wind className="h-3 w-3 text-blue-600 dark:text-[#5bb4ff]" />
                                        {gear}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Student Reviews Section */}
                    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md backdrop-blur-xl sm:p-7 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                                    <Star className="h-5 w-5 text-amber-500 fill-amber-400" />
                                    Student Reviews
                                </h2>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Verified feedback from kitesurfers coached at {name}
                                </p>
                            </div>

                            {averageRating !== null && (
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    <span>{averageRating.toFixed(1)} / 5.0</span>
                                </div>
                            )}
                        </div>

                        {reviews.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center dark:border-white/10">
                                <Star className="mx-auto h-8 w-8 text-slate-400" />
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    No verified reviews for this center yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.02]"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-[#8acbff]">
                                                    {review.student?.name?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <span className="block text-xs font-bold text-slate-900 dark:text-white">
                                                        {review.student?.name || 'Verified Student'}
                                                    </span>
                                                    {review.instructor_name && (
                                                        <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                                                            Coached by {review.instructor_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-0.5 text-xs text-amber-500">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3.5 w-3.5 ${
                                                            i < review.rating
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'text-slate-300 dark:text-slate-700'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="mt-3 text-xs leading-relaxed text-slate-700 sm:text-sm dark:text-slate-300">
                                            {review.comment}
                                        </p>

                                        {review.instructor_reply && (
                                            <div className="mt-3 rounded-xl border-l-2 border-blue-500 bg-blue-50/70 p-3 text-xs text-slate-700 dark:border-[#5bb4ff] dark:bg-white/[0.03] dark:text-slate-300">
                                                <span className="block font-bold text-blue-700 dark:text-[#8acbff]">
                                                    Center / Coach Reply:
                                                </span>
                                                <p className="mt-0.5">{review.instructor_reply}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Contact, Center Directory & Primary Action Sidebar */}
                <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
                    {/* Contact & Inquiry Card */}
                    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
                        <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                            <span>Center Directory &amp; Inquiries</span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            Visit or Book at {name}
                        </h3>

                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            Book certified packages directly with zero commission, or contact the center directly for custom requests and lodging.
                        </p>

                        <div className="mt-5 space-y-3">
                            {school.contact_name && (
                                <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs dark:border-white/5 dark:bg-white/[0.02]">
                                    <User className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                    <div>
                                        <span className="block text-[10px] text-slate-400 uppercase">Contact Person</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{school.contact_name}</span>
                                    </div>
                                </div>
                            )}

                            {school.phone && (
                                <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs dark:border-white/5 dark:bg-white/[0.02]">
                                    <Phone className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                    <div>
                                        <span className="block text-[10px] text-slate-400 uppercase">Direct Phone</span>
                                        <a href={`tel:${school.phone}`} className="font-semibold text-blue-600 hover:underline dark:text-[#8acbff]">
                                            {school.phone}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {school.website && (
                                <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs dark:border-white/5 dark:bg-white/[0.02]">
                                    <Globe className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                    <div className="min-w-0 flex-1">
                                        <span className="block text-[10px] text-slate-400 uppercase">Official Website</span>
                                        <a
                                            href={school.website.startsWith('http') ? school.website : `https://${school.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 font-semibold text-blue-600 hover:underline dark:text-[#8acbff]"
                                        >
                                            <span className="truncate">{school.website.replace(/^https?:\/\//, '')}</span>
                                            <ExternalLink className="h-3 w-3 shrink-0" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Primary Action Button — replaces old Browse All Instructors CTA */}
                        <div className="mt-6 border-t border-slate-100 pt-5 dark:border-white/10">
                            {packages.length > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => openBookingModal(packages[0])}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02] hover:from-[#5bb4ff] hover:to-[#2e7bff]"
                                >
                                    <Package className="h-4 w-4" />
                                    <span>Book Top Package ({packages[0].name})</span>
                                </button>
                            ) : (
                                <a
                                    href="#packages-section"
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <Package className="h-4 w-4" />
                                    <span>Explore School Offerings</span>
                                </a>
                            )}

                            {!isAuthenticated && (
                                <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                                    <Link href={route('login')} className="font-semibold text-blue-600 hover:underline dark:text-[#8acbff]">
                                        Sign in
                                    </Link>{' '}
                                    to book courses or rental packages with this center.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* KiteLink Assurance Card */}
                    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            KiteLink Center Guarantee
                        </h4>
                        <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                <span>Verified IKO / VDWS affiliated certifications</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                <span>Direct school rates — zero platform booking markup</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                <span>Safety boat rescue on standby during all sessions</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* PACKAGE BOOKING MODAL */}
            {bookingPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/15 dark:bg-[#070b12] sm:p-8">
                        <button
                            type="button"
                            onClick={() => setBookingPackage(null)}
                            className="absolute top-5 right-5 cursor-pointer rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {bookingSubmitted ? (
                            <div className="py-6 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    Booking Request Submitted!
                                </h3>
                                <p className="mx-auto mt-2 max-w-sm text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                                    Your request for <strong className="text-blue-600 dark:text-[#8acbff]">{bookingPackage.name}</strong> has been sent to {name}.
                                    The school will confirm your schedule and send session details.
                                </p>
                                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                                    <Link
                                        href="/client/bookings"
                                        className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                                    >
                                        View in My Bookings
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => setBookingPackage(null)}
                                        className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:text-slate-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="border-b border-slate-100 pb-4 dark:border-white/10">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                                        {bookingPackage.duration_label}
                                    </span>
                                    <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                                        Book {bookingPackage.name}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                        Offered by {name} • ${Number(bookingPackage.price).toFixed(0)} per student
                                    </p>
                                </div>

                                <form onSubmit={handlePackageBookingSubmit} className="mt-5 space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                                            Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            min={defaultDate}
                                            value={bookingData.date}
                                            onChange={(e) => setBookingData('date', e.target.value)}
                                            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-white/15 dark:bg-slate-900 dark:text-white"
                                        />
                                        {bookingErrors.date && <p className="mt-1 text-xs text-rose-500">{bookingErrors.date}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                                                Preferred Session Time
                                            </label>
                                            <select
                                                value={bookingData.time}
                                                onChange={(e) => setBookingData('time', e.target.value)}
                                                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-white/15 dark:bg-slate-900 dark:text-white"
                                            >
                                                <option value="08:30 AM (Morning Breeze)">08:30 AM (Morning Breeze)</option>
                                                <option value="10:00 AM (Morning Session)">10:00 AM (Morning Session)</option>
                                                <option value="02:00 PM (Afternoon Thermal)">02:00 PM (Afternoon Thermal)</option>
                                                <option value="04:00 PM (Late Session)">04:00 PM (Late Session)</option>
                                                <option value="Flexible Schedule">Flexible Schedule (Anytime)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                                                Number of Students
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={10}
                                                required
                                                value={bookingData.students_count}
                                                onChange={(e) => setBookingData('students_count', Number(e.target.value))}
                                                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-white/15 dark:bg-slate-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase dark:text-slate-300">
                                            Special Requests or Skill Level
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={bookingData.notes}
                                            onChange={(e) => setBookingData('notes', e.target.value)}
                                            placeholder="Tell the center about your kite experience, preferred kite sizes, or lodging questions..."
                                            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-white/15 dark:bg-slate-900 dark:text-white"
                                        />
                                    </div>

                                    {/* Estimated Total */}
                                    <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            Total Reservation Estimate
                                        </span>
                                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                            ${(Number(bookingPackage.price) * (bookingData.students_count || 1)).toFixed(0)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-3">
                                        <button
                                            type="button"
                                            onClick={() => setBookingPackage(null)}
                                            className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:text-slate-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={bookingProcessing}
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:from-[#5bb4ff] hover:to-[#2e7bff] disabled:opacity-50"
                                        >
                                            {bookingProcessing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                            Submit Booking Request
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    if (isAuthenticated) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${name} - Packages & Courses - KiteLink`} />
                {content}
            </AppLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title={`${name} - Packages & Courses - KiteLink`} />
            {content}
        </PublicLayout>
    );
}

export default Show;
