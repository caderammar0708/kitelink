import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/public-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Calendar,
    Check,
    CheckCircle2,
    ChevronLeft,
    Clock,
    Languages,
    MapPin,
    MessageSquare,
    ShieldCheck,
    Sparkles,
    Star,
    Wind,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface BookingItem {
    id: number;
    status: string;
    date?: string;
    time?: string;
    lesson_type?: string;
    total_price?: number | string;
}

interface ReviewItem {
    id: number;
    rating: number;
    comment: string;
    instructor_reply?: string | null;
    created_at?: string;
    student?: { id: number; name: string; profile_picture?: string };
}

interface InstructorProps {
    instructor: {
        id: number;
        bio?: string | null;
        certifications?: string | null;
        experience_years?: number | string | null;
        location?: string | null;
        languages?: string[] | string | null;
        hourly_rate?: number | string | null;
        daily_rate?: number | string | null;
        profile_photo?: string | null;
        is_freelance?: boolean;
        is_active?: boolean;
        school?: { name: string; location?: string } | null;
        user?: { id: number; name: string; email: string; profile_picture?: string } | null;
        reviews?: ReviewItem[];
    };
    existingBooking?: BookingItem | null;
}

export function Show({ instructor, existingBooking = null }: InstructorProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;
    const isInstructor = auth?.user?.role === 'instructor';
    const isOwner = auth?.user?.id === instructor.user?.id;

    const name = instructor.user?.name || 'Instructor';
    const photo = instructor.profile_photo || instructor.user?.profile_picture;
    const location = instructor.location || null;
    const certs = instructor.certifications || null;
    const hourlyRate = instructor.hourly_rate ? Number(instructor.hourly_rate) : 65;
    const isListingActive = instructor.is_active !== false;

    const languages =
        Array.isArray(instructor.languages) && instructor.languages.length > 0
            ? instructor.languages.join(', ')
            : typeof instructor.languages === 'string' && instructor.languages
            ? instructor.languages
            : 'English';

    const realReviews = instructor.reviews || [];
    const averageRating =
        realReviews.length > 0
            ? realReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / realReviews.length
            : null;


    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: isInstructor ? 'Instructor Dashboard' : 'Dashboard',
            href: isInstructor ? '/instructor/dashboard' : '/dashboard',
        },
        {
            title: 'Find Instructors',
            href: '/instructors',
        },
        {
            title: name,
            href: `/instructors/${instructor.id}`,
        },
    ];

    // Tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    const timeSlots = [
        '08:30 AM - 10:30 AM (Morning Breeze)',
        '11:00 AM - 01:00 PM (Midday Session)',
        '02:30 PM - 04:30 PM (Afternoon Thermal)',
        '04:45 PM - 06:45 PM (Sunset Session)',
    ];

    const lessonTypes = [
        { label: 'Beginner 1-on-1 Lesson (2h)', hours: 2, multiplier: 1 },
        { label: 'Intermediate / Waterstart (2h)', hours: 2, multiplier: 1 },
        { label: 'Hydrofoil / Wing Progression (2h)', hours: 2, multiplier: 1.15 },
        { label: 'Full Day Intensive Coaching (4h)', hours: 4, multiplier: 1.8 },
    ];

    const [selectedLessonType, setSelectedLessonType] = useState(lessonTypes[0].label);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]);
    const [studentsCount, setStudentsCount] = useState(1);
    const [bookingSubmitted, setBookingSubmitted] = useState(!!existingBooking);
    const [createdBookingId, setCreatedBookingId] = useState<number | null>(existingBooking?.id ?? null);

    const activeLesson = lessonTypes.find((l) => l.label === selectedLessonType) || lessonTypes[0];
    const estimatedPrice = Math.round(hourlyRate * activeLesson.hours * activeLesson.multiplier * studentsCount);

    const { data, setData, post, processing, errors, reset } = useForm({
        instructor_id: instructor.id,
        date: defaultDate,
        time: selectedTimeSlot,
        students_count: studentsCount,
        lesson_type: selectedLessonType,
        notes: '',
    });

    const handleBookingSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('bookings.store'), {
            preserveScroll: true,
            onSuccess: (page) => {
                setBookingSubmitted(true);
                reset('notes');
                const flashId = (page.props as any)?.flash?.booking_id || (page.props as any)?.booking_id;
                if (flashId) {
                    setCreatedBookingId(Number(flashId));
                }
            },
        });
    };

    const content = (
        <div className={`space-y-8 sm:space-y-10 ${isAuthenticated ? 'p-4 sm:p-6 lg:p-8' : 'mx-auto max-w-7xl'}`}>
                {/* Top Navigation / Breadcrumb */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route('instructors.index')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-[#5bb4ff] sm:text-sm"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to All Instructors
                    </Link>

                    <div className="flex items-center gap-2">
                        {isListingActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 px-3 py-1 text-xs font-semibold">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 dark:bg-emerald-400" />
                                Available for Bookings
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-400 px-3 py-1 text-xs font-semibold">
                                <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                                Listing Paused (Offline)
                            </span>
                        )}
                    </div>
                </div>

                {/* Hero Header Glass Card */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/15 dark:bg-gradient-to-r dark:from-blue-950/60 dark:via-slate-900/80 dark:to-slate-950/90 dark:shadow-2xl dark:shadow-black/60 dark:backdrop-blur-2xl sm:p-10">
                    <div className="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl dark:bg-[#3b82f6]/15" />

                    <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start">
                        {/* Profile Photo */}
                        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-blue-200 bg-slate-100 shadow-md dark:border-[#5bb4ff]/40 dark:bg-slate-900 dark:shadow-[0_0_25px_rgba(91,180,255,0.25)] sm:h-36 sm:w-36 lg:h-40 lg:w-40">
                            {photo ? (
                                <img src={photo} alt={name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-4xl font-black text-transparent dark:from-[#b8e6ff] dark:to-[#4da6ff] sm:text-5xl">
                                    {name.charAt(0)}
                                </span>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 space-y-3.5 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{name}</h1>
                                {certs && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                                        <Award className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                        {certs}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-300 sm:text-sm md:justify-start">
                                {location && (
                                    <span className="flex items-center gap-1 font-medium text-blue-600 dark:text-[#8acbff]">
                                        <MapPin className="h-4 w-4 text-blue-600 dark:text-[#5bb4ff]" />
                                        {location}
                                    </span>
                                )}
                                {location && <span className="text-slate-400">•</span>}
                                <span>{instructor.is_freelance ? 'Freelance Coach' : instructor.school?.name || 'Center Instructor'}</span>
                                {averageRating !== null ? (
                                    <>
                                        <span className="text-slate-400">•</span>
                                        <span className="flex items-center gap-1 font-bold text-amber-500 dark:text-amber-400">
                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            {averageRating.toFixed(1)} ({realReviews.length} verified review{realReviews.length === 1 ? '' : 's'})
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-500 dark:text-slate-400">New Coach</span>
                                    </>
                                )}
                            </div>

                            {instructor.bio ? (
                                <p className="max-w-3xl pt-1 text-sm leading-relaxed text-slate-700 whitespace-pre-line dark:text-slate-300/90 sm:text-base">
                                    {instructor.bio}
                                </p>
                            ) : (
                                <p className="max-w-3xl pt-1 text-xs italic text-slate-500 dark:text-slate-400">
                                    No biography provided yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main 2-Column Content: Left = Details & Reviews / Right = Booking & Availability Card */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {/* Left Column: Details, Highlights & Reviews */}
                    <div className="space-y-8 lg:col-span-7">
                        {/* Instructor Highlights Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-lg dark:backdrop-blur-xl">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-[#3b82f6]/30 dark:bg-[#3b82f6]/20 dark:text-[#5bb4ff]">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <h3 className="mb-0.5 text-sm font-bold text-slate-900 dark:text-white">Experience</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    {instructor.experience_years !== null && instructor.experience_years !== undefined && instructor.experience_years !== ('' as any)
                                        ? `${instructor.experience_years} Year${Number(instructor.experience_years) === 1 ? '' : 's'} Active Coaching`
                                        : 'Experience not specified'}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-lg dark:backdrop-blur-xl">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <h3 className="mb-0.5 text-sm font-bold text-slate-900 dark:text-white">Certifications</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    {instructor.certifications || 'Verified Professional Coach'}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-lg dark:backdrop-blur-xl">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400">
                                    <Languages className="h-5 w-5" />
                                </div>
                                <h3 className="mb-0.5 text-sm font-bold text-slate-900 dark:text-white">Languages</h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300">{languages}</p>
                            </div>
                        </div>

                        {/* Specialties & Gear Card */}
                        <div className="space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:backdrop-blur-xl sm:p-8">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                                <Sparkles className="h-5 w-5 text-blue-600 dark:text-[#5bb4ff]" />
                                Coaching Disciplines & Specialties
                            </h3>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {[
                                    'Complete Beginner 1-on-1',
                                    'Body Dragging & Board Recovery',
                                    'Waterstart Mastery',
                                    'Upwind Riding & Transitions',
                                    'Jumps & Inverted Aerials',
                                    'Hydrofoil Progression',
                                    'Wing Foil Fundamentals',
                                    'Self-Rescue & Ocean Safety',
                                    'Radio Helmet 2-Way Coaching',
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"
                                    >
                                        <Check className="h-3.5 w-3.5 text-blue-600 dark:text-[#5bb4ff]" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Verified Student Reviews Section */}
                        <div className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:shadow-xl dark:backdrop-blur-xl sm:p-8">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-[#5bb4ff]" />
                                    Verified Student Reviews ({realReviews.length})
                                </h3>
                                {averageRating !== null && (
                                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500 dark:text-amber-400">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        <span>{averageRating.toFixed(1)} / 5.0</span>
                                    </div>
                                )}
                            </div>

                            {realReviews.length > 0 ? (
                                <div className="space-y-4">
                                    {realReviews.map((rev) => (
                                        <div key={rev.id} className="space-y-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/40 dark:backdrop-blur-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-[#5bb4ff] text-xs font-bold text-white">
                                                        {rev.student?.profile_picture ? (
                                                            <img src={rev.student.profile_picture} alt={rev.student?.name || 'Student'} className="h-full w-full object-cover" />
                                                        ) : (
                                                            (rev.student?.name || 'S').charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white sm:text-sm">{rev.student?.name || 'Verified Student'}</h4>
                                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                            {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Verified Session'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center text-amber-400">
                                                    {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                                                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-xs leading-relaxed text-slate-700 italic dark:text-slate-300/90 sm:text-sm">"{rev.comment}"</p>

                                            {rev.instructor_reply && (
                                                <div className="mt-2.5 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                                                    <span className="font-semibold text-blue-700 dark:text-[#8acbff]">Response from coach: </span>
                                                    <span className="italic">"{rev.instructor_reply}"</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-400">
                                    No reviews yet for this instructor. Book a session to be the first!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking & Availability Card */}
                    <div className="sticky top-24 lg:col-span-5">
                        <div className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/15 dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-[#070b12]/95 dark:shadow-2xl dark:shadow-black/80 dark:backdrop-blur-2xl sm:p-8">
                            {/* Header Price */}
                            <div className="flex items-baseline justify-between border-b border-slate-200 pb-5 dark:border-white/10">
                                <div>
                                    <span className="block text-xs font-semibold tracking-wider text-blue-700 uppercase dark:text-[#8acbff]">Lesson Pricing</span>
                                    <div className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
                                        ${hourlyRate}
                                        <span className="text-sm font-normal text-slate-500 dark:text-slate-400"> / hour</span>
                                    </div>
                                    {instructor.daily_rate && (
                                        <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                            ${Number(instructor.daily_rate)} / full day
                                        </div>
                                    )}
                                </div>

                                <div className="text-right">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:border-[#5bb4ff]/30 dark:bg-[#5bb4ff]/15 dark:text-[#8acbff]">
                                        <Wind className="h-3 w-3 text-blue-600 dark:text-[#5bb4ff]" />
                                        Direct Booking
                                    </span>
                                </div>
                            </div>

                            {/* Booking Form, Paused Notice, Success State, or Login Prompt */}
                            {!isListingActive ? (
                                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-600 dark:border-slate-700/60 dark:bg-slate-950/70 dark:text-slate-300">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                                        <Wind className="h-6 w-6" />
                                    </div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Bookings Currently Paused</h4>
                                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                        {name} has paused their listing and is not accepting new booking requests at this time.
                                    </p>
                                    <Link
                                        href={route('instructors.index')}
                                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline dark:text-[#5bb4ff]"
                                    >
                                        <span>Browse Available Coaches</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            ) : !isAuthenticated ? (
                                <div className="space-y-4 py-4 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 shadow-sm dark:border-[#5bb4ff]/30 dark:bg-gradient-to-br dark:from-[#1f6eff]/20 dark:to-[#5bb4ff]/10 dark:text-[#5bb4ff]">
                                        <Calendar className="h-7 w-7" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Ready to Ride?</h4>
                                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300/80">
                                        Sign in to book a session with {name}, choose available time slots, and connect directly.
                                    </p>
                                    <Link
                                        href={route('login')}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-[#1f6eff] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-blue-500 hover:to-blue-700"
                                    >
                                        <span>Sign In to Book Lesson</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Don't have an account?{' '}
                                        <Link href={route('register')} className="font-semibold text-blue-600 hover:underline dark:text-[#5bb4ff]">
                                            Register in 30 seconds
                                        </Link>
                                    </p>
                                </div>
                            ) : bookingSubmitted || existingBooking ? (
                                <div className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/80 p-6 text-xs text-emerald-800 shadow-sm dark:border-emerald-500/40 dark:bg-gradient-to-br dark:from-emerald-950/60 dark:to-slate-950/80 dark:text-emerald-300 dark:shadow-xl dark:shadow-black/40 sm:text-sm">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                        <div className="space-y-1">
                                            <p className="text-base font-bold text-slate-900 dark:text-white">Booking Request Sent!</p>
                                            <p className="text-xs text-emerald-700 leading-relaxed dark:text-emerald-200/90 sm:text-sm">
                                                {name} has received your request and will confirm your session shortly.
                                            </p>
                                            {(existingBooking?.date || data.date) && (
                                                <div className="mt-2 rounded-xl border border-emerald-300 bg-white/80 p-3 text-[11px] text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                                                    <span className="font-semibold text-slate-900 dark:text-white">Requested Session:</span>{' '}
                                                    {existingBooking?.date || data.date} ({existingBooking?.time || data.time})
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Link
                                            href={`/client/bookings${createdBookingId || existingBooking?.id ? `?highlight=${createdBookingId || existingBooking?.id}` : ''}`}
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:from-emerald-500 hover:to-teal-500 sm:text-sm"
                                        >
                                            <span>View Booking Status</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                    <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                                        No upfront payment required. You can manage your booking or message your coach in My Bookings.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleBookingSubmit} className="space-y-5">

                                    {/* Date Selection */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">Select Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                value={data.date}
                                                onChange={(e) => setData('date', e.target.value)}
                                                className="w-full cursor-pointer rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                                required
                                            />
                                        </div>
                                        {errors.date && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.date}</p>}
                                    </div>

                                    {/* Time Slot Selection */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Select Session Time
                                        </label>
                                        <select
                                            value={data.time}
                                            onChange={(e) => {
                                                setSelectedTimeSlot(e.target.value);
                                                setData('time', e.target.value);
                                            }}
                                            className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                        >
                                            {timeSlots.map((slot) => (
                                                <option key={slot} value={slot} className="bg-white text-slate-900 dark:bg-[#070b12] dark:text-white">
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Lesson Type Selection */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">Lesson Program</label>
                                        <select
                                            value={data.lesson_type}
                                            onChange={(e) => {
                                                setSelectedLessonType(e.target.value);
                                                setData('lesson_type', e.target.value);
                                            }}
                                            className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                        >
                                            {lessonTypes.map((t) => (
                                                <option key={t.label} value={t.label} className="bg-white text-slate-900 dark:bg-[#070b12] dark:text-white">
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Number of Students */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Number of Students
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[1, 2, 3, 4].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => {
                                                        setStudentsCount(num);
                                                        setData('students_count', num);
                                                    }}
                                                    className={`cursor-pointer rounded-xl border py-2 text-xs font-bold transition-all ${
                                                        data.students_count === num
                                                            ? 'border-blue-600 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm'
                                                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-white/30'
                                                    }`}
                                                >
                                                    {num} {num === 1 ? 'Rider' : 'Riders'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Special Notes */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase dark:text-slate-300">
                                            Notes / Experience Level
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Tell your coach about your current skill level, gear preferences, or target spot..."
                                            rows={2}
                                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-white/15 dark:bg-slate-950/60 dark:text-white dark:placeholder-slate-400/50 dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                                        />
                                    </div>

                                    {/* Estimated Total Card */}
                                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                                        <div>
                                            <span className="block text-[11px] font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Estimated Total
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                {activeLesson.hours}h session · {data.students_count} student(s)
                                            </span>
                                        </div>
                                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${estimatedPrice}</div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-[#1f6eff] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-blue-500 hover:to-blue-700 active:scale-[0.99] disabled:opacity-50 sm:text-base"
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        <span>{processing ? 'Submitting Request...' : 'Book Lesson Now'}</span>
                                    </button>

                                    <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                                        No upfront payment required. Pay directly at the kite spot upon session completion.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
        </div>
    );

    if (isAuthenticated) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${name} - Certified Kitesurf Instructor | KiteLink`} />
                {content}
            </AppLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title={`${name} - Certified Kitesurf Instructor | KiteLink`} />
            {content}
        </PublicLayout>
    );
}

export default Show;
