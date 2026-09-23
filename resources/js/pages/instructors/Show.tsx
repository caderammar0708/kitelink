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

interface InstructorProps {
    instructor: {
        id: number;
        bio?: string;
        certifications?: string;
        experience_years?: number;
        location?: string;
        hourly_rate?: number | string;
        profile_photo?: string;
        is_freelance?: boolean;
        school?: { name: string; location?: string };
        user?: { id: number; name: string; email: string; profile_picture?: string };
    };
    existingBooking?: BookingItem | null;
}

export function Show({ instructor, existingBooking = null }: InstructorProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;
    const isInstructor = auth?.user?.role === 'instructor';
    const isOwner = auth?.user?.id === instructor.user?.id;

    const name = instructor.user?.name || 'Certified Kitesurf Coach';
    const photo = instructor.profile_photo || instructor.user?.profile_picture;
    const location = instructor.location || 'Kalpitiya, Sri Lanka';
    const certs = instructor.certifications || 'IKO Level 2 Certified Instructor';
    const hourlyRate = Number(instructor.hourly_rate ?? 65);

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

    // Reviews list demo / initial feedback
    const sampleReviews = [
        {
            id: 1,
            author: 'Marcus Vance',
            country: 'Germany',
            rating: 5,
            date: '2 weeks ago',
            text: `Incredible coach! Helped me overcome my fear of waterstarts within 2 hours. Clear communication, very patient, and top-tier safety focus.`,
        },
        {
            id: 2,
            author: 'Elena Rostova',
            country: 'Switzerland',
            rating: 5,
            date: '1 month ago',
            text: `Best kite lessons in ${location}! We progressed to upwind riding in 3 sessions. Super knowledgeable about local wind conditions and spot choices.`,
        },
        {
            id: 3,
            author: 'Thomas Leroy',
            country: 'France',
            rating: 5,
            date: '2 months ago',
            text: `Learned hydrofoiling with him. Great equipment and radio helmet communication made the learning curve so much smoother. Highly recommended!`,
        },
    ];

    const content = (
        <div className={`space-y-8 sm:space-y-10 ${isAuthenticated ? 'p-4 sm:p-6 lg:p-8' : 'mx-auto max-w-7xl'}`}>
                {/* Top Navigation / Breadcrumb */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route('instructors.index')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-[#5bb4ff] sm:text-sm"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to All Instructors
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                            Available for Bookings
                        </span>
                    </div>
                </div>

                {/* Hero Header Glass Card */}
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-slate-950/90 p-6 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:p-10">
                    <div className="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 h-96 w-96 rounded-full bg-[#3b82f6]/15 blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start">
                        {/* Profile Photo */}
                        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-[#5bb4ff]/40 bg-slate-900 shadow-[0_0_25px_rgba(91,180,255,0.25)] sm:h-36 sm:w-36 lg:h-40 lg:w-40">
                            {photo ? (
                                <img src={photo} alt={name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="bg-gradient-to-br from-[#b8e6ff] to-[#4da6ff] bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
                                    {name.charAt(0)}
                                </span>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 space-y-3.5 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">{name}</h1>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5bb4ff]/30 bg-[#5bb4ff]/15 px-3 py-1 text-xs font-semibold text-[#8acbff]">
                                    <Award className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                    {certs}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 sm:text-sm md:justify-start">
                                <span className="flex items-center gap-1 text-[#8acbff]">
                                    <MapPin className="h-4 w-4 text-[#5bb4ff]" />
                                    {location}
                                </span>
                                <span>•</span>
                                <span>{instructor.is_freelance ? 'Freelance Coach' : instructor.school?.name || 'Center Instructor'}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-bold text-amber-400">
                                    <Star className="h-4 w-4 fill-amber-400" />
                                    4.9 (48 verified reviews)
                                </span>
                            </div>

                            <p className="max-w-3xl pt-1 text-sm leading-relaxed text-slate-300/90 sm:text-base">
                                {instructor.bio ||
                                    'Certified IKO senior kitesurfing coach with extensive coaching experience in flat water lagoons, deep ocean chop, and rolling wave breaks. Passionate about empowering riders from complete beginners to advanced aerial transitions with personalized radio helmet coaching.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main 2-Column Content: Left = Details & Reviews / Right = Booking & Availability Card */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                    {/* Left Column: Details, Highlights & Reviews */}
                    <div className="space-y-8 lg:col-span-7">
                        {/* Instructor Highlights Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-lg backdrop-blur-xl">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#3b82f6]/30 bg-[#3b82f6]/20 text-[#5bb4ff]">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <h3 className="mb-0.5 text-sm font-bold text-white">Experience</h3>
                                <p className="text-xs text-slate-400">
                                    {instructor.experience_years ? `${instructor.experience_years}+ Years On Water` : '5+ Years Active Coaching'}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-lg backdrop-blur-xl">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <h3 className="mb-0.5 text-sm font-bold text-white">Safety Certified</h3>
                                <p className="text-xs text-slate-400">IKO / VDWS & First Aid CPR certified with boat rescue.</p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-lg backdrop-blur-xl">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400">
                                    <Languages className="h-5 w-5" />
                                </div>
                                <h3 className="mb-0.5 text-sm font-bold text-white">Languages</h3>
                                <p className="text-xs text-slate-400">English, German, French, Spanish</p>
                            </div>
                        </div>

                        {/* Specialties & Gear Card */}
                        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl sm:p-8">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                                <Sparkles className="h-5 w-5 text-[#5bb4ff]" />
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
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-slate-200"
                                    >
                                        <Check className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Verified Student Reviews Section */}
                        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl sm:p-8">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                                    <MessageSquare className="h-5 w-5 text-[#5bb4ff]" />
                                    Verified Student Reviews ({sampleReviews.length})
                                </h3>
                                <div className="flex items-center gap-1 text-sm font-bold text-amber-400">
                                    <Star className="h-4 w-4 fill-amber-400" />
                                    <span>4.9 / 5.0</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {sampleReviews.map((rev) => (
                                    <div key={rev.id} className="space-y-2.5 rounded-2xl border border-white/10 bg-slate-950/40 p-5 backdrop-blur-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1f6eff] to-[#5bb4ff] text-xs font-bold text-white">
                                                    {rev.author.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-white sm:text-sm">{rev.author}</h4>
                                                    <span className="text-[11px] text-slate-400">
                                                        {rev.country} • {rev.date}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center text-amber-400">
                                                {[...Array(rev.rating)].map((_, i) => (
                                                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-xs leading-relaxed text-slate-300/90 italic sm:text-sm">"{rev.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Booking & Availability Card */}
                    <div className="sticky top-24 lg:col-span-5">
                        <div className="space-y-6 rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/90 to-[#070b12]/95 p-6 shadow-2xl shadow-black/80 backdrop-blur-2xl sm:p-8">
                            {/* Header Price */}
                            <div className="flex items-baseline justify-between border-b border-white/10 pb-5">
                                <div>
                                    <span className="block text-xs font-semibold tracking-wider text-[#8acbff] uppercase">Lesson Pricing</span>
                                    <div className="mt-1 text-3xl font-black text-white">
                                        ${hourlyRate}
                                        <span className="text-sm font-normal text-slate-400"> / hour</span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#5bb4ff]/30 bg-[#5bb4ff]/15 px-2.5 py-1 text-xs font-bold text-[#8acbff]">
                                        <Wind className="h-3 w-3" />
                                        Direct Booking
                                    </span>
                                </div>
                            </div>

                            {/* Booking Form, Success State, or Login Prompt */}
                            {!isAuthenticated ? (
                                <div className="space-y-4 py-4 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#5bb4ff]/30 bg-gradient-to-br from-[#1f6eff]/20 to-[#5bb4ff]/10 text-[#5bb4ff] shadow-md">
                                        <Calendar className="h-7 w-7" />
                                    </div>
                                    <h4 className="text-lg font-bold text-white">Ready to Ride?</h4>
                                    <p className="text-xs leading-relaxed text-slate-300/80">
                                        Sign in to book a session with {name}, choose available time slots, and connect directly.
                                    </p>
                                    <Link
                                        href={route('login')}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/35 transition-all duration-300 hover:scale-[1.02] hover:from-[#5bb4ff] hover:to-[#2e7bff]"
                                    >
                                        <span>Sign In to Book Lesson</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <p className="text-[11px] text-slate-400">
                                        Don't have an account?{' '}
                                        <Link href={route('register')} className="font-semibold text-[#5bb4ff] hover:underline">
                                            Register in 30 seconds
                                        </Link>
                                    </p>
                                </div>
                            ) : bookingSubmitted || existingBooking ? (
                                <div className="space-y-4 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 to-slate-950/80 p-6 text-xs text-emerald-300 shadow-xl shadow-black/40 backdrop-blur-md sm:text-sm">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />
                                        <div className="space-y-1">
                                            <p className="text-base font-bold text-white">Booking Request Sent!</p>
                                            <p className="text-xs text-emerald-200/90 leading-relaxed sm:text-sm">
                                                {name} has received your request and will confirm your session shortly.
                                            </p>
                                            {(existingBooking?.date || data.date) && (
                                                <div className="mt-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-[11px] text-emerald-200">
                                                    <span className="font-semibold text-white">Requested Session:</span>{' '}
                                                    {existingBooking?.date || data.date} ({existingBooking?.time || data.time})
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Link
                                            href={`/client/bookings${createdBookingId || existingBooking?.id ? `?highlight=${createdBookingId || existingBooking?.id}` : ''}`}
                                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02] hover:from-emerald-400 hover:to-teal-400 sm:text-sm"
                                        >
                                            <span>View Booking Status</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                    <p className="text-center text-[11px] text-slate-400">
                                        No upfront payment required. You can manage your booking or message your coach in My Bookings.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleBookingSubmit} className="space-y-5">
                                    {/* Date Selection */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold tracking-wider text-slate-300 uppercase">Select Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                value={data.date}
                                                onChange={(e) => setData('date', e.target.value)}
                                                className="w-full cursor-pointer rounded-2xl border border-white/15 bg-slate-950/60 px-4 py-3 text-sm text-white transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                                required
                                            />
                                        </div>
                                        {errors.date && <p className="text-xs text-rose-400">{errors.date}</p>}
                                    </div>

                                    {/* Time Slot Selection */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold tracking-wider text-slate-300 uppercase">
                                            Select Session Time
                                        </label>
                                        <select
                                            value={data.time}
                                            onChange={(e) => {
                                                setSelectedTimeSlot(e.target.value);
                                                setData('time', e.target.value);
                                            }}
                                            className="w-full cursor-pointer appearance-none rounded-2xl border border-white/15 bg-slate-950/60 px-4 py-3 text-sm text-white transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                        >
                                            {timeSlots.map((slot) => (
                                                <option key={slot} value={slot} className="bg-[#070b12] text-white">
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Lesson Type Selection */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold tracking-wider text-slate-300 uppercase">Lesson Program</label>
                                        <select
                                            value={data.lesson_type}
                                            onChange={(e) => {
                                                setSelectedLessonType(e.target.value);
                                                setData('lesson_type', e.target.value);
                                            }}
                                            className="w-full cursor-pointer appearance-none rounded-2xl border border-white/15 bg-slate-950/60 px-4 py-3 text-sm text-white transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                        >
                                            {lessonTypes.map((t) => (
                                                <option key={t.label} value={t.label} className="bg-[#070b12] text-white">
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Number of Students */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold tracking-wider text-slate-300 uppercase">
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
                                                            ? 'border-[#5bb4ff] bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] text-white shadow-md'
                                                            : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/30'
                                                    }`}
                                                >
                                                    {num} {num === 1 ? 'Rider' : 'Riders'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Special Notes */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-semibold tracking-wider text-slate-300 uppercase">
                                            Notes / Experience Level
                                        </label>
                                        <textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Tell your coach about your current skill level, gear preferences, or target spot..."
                                            rows={2}
                                            className="w-full rounded-2xl border border-white/15 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-400/50 transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                        />
                                    </div>

                                    {/* Estimated Total Card */}
                                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                        <div>
                                            <span className="block text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                                                Estimated Total
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {activeLesson.hours}h session · {data.students_count} student(s)
                                            </span>
                                        </div>
                                        <div className="text-2xl font-black text-emerald-400">${estimatedPrice}</div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/35 transition-all duration-300 hover:scale-[1.02] hover:from-[#5bb4ff] hover:to-[#2e7bff] active:scale-[0.99] disabled:opacity-50 sm:text-base"
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        <span>{processing ? 'Submitting Request...' : 'Book Lesson Now'}</span>
                                    </button>

                                    <p className="text-center text-[11px] text-slate-400">
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
