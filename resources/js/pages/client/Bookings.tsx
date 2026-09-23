import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePoll } from '@inertiajs/react';
import {
    AlertCircle,
    Calendar,
    CalendarCheck,
    CheckCircle2,
    Clock,
    DollarSign,
    Filter,
    MapPin,
    MessageSquare,
    Search,
    Send,
    Sparkles,
    Star,
    User,
    Users,
    Wind,
    X,
    XCircle,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ReviewData {
    id: number;
    rating: number;
    comment?: string;
    instructor_reply?: string;
    replied_at?: string;
}

interface InstructorSchool {
    id: number;
    name: string;
    location?: string;
}

interface InstructorUser {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
}

interface InstructorData {
    id: number;
    user?: InstructorUser;
    school?: InstructorSchool;
    profile_photo?: string;
    location?: string;
    hourly_rate?: number | string;
}

interface Booking {
    id: number;
    student_id: number;
    instructor_id: number;
    date: string;
    time: string;
    students_count: number;
    lesson_type: string;
    total_price: number | string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | string;
    notes?: string;
    instructor?: InstructorData;
    review?: ReviewData;
    created_at?: string;
}

interface BookingsProps {
    bookings?: Booking[];
    counts?: {
        all: number;
        pending: number;
        confirmed: number;
        completed: number;
        cancelled: number;
    };
    highlightId?: string | number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'My Bookings',
        href: '/client/bookings',
    },
];

export default function Bookings({ bookings = [], counts, highlightId }: BookingsProps) {
    // Real-time automatic polling every 15s to update booking statuses live
    usePoll(15000);

    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [reviewModalBooking, setReviewModalBooking] = useState<Booking | null>(null);
    const [selectedRating, setSelectedRating] = useState(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const highlightedRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll to highlighted booking if passed
    useEffect(() => {
        if (highlightId && highlightedRef.current) {
            highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [highlightId, bookings]);

    // Review submission form
    const reviewForm = useForm({
        booking_id: 0,
        rating: 5,
        comment: '',
    });

    const handleOpenReviewModal = (booking: Booking) => {
        setReviewModalBooking(booking);
        setSelectedRating(5);
        reviewForm.setData({
            booking_id: booking.id,
            rating: 5,
            comment: '',
        });
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(route('client.reviews.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setReviewModalBooking(null);
                reviewForm.reset();
            },
        });
    };

    const handleMessageInstructor = (instructorId: number) => {
        router.post(route('client.messages.start'), { instructor_id: instructorId });
    };

    const totalCounts = counts || {
        all: bookings.length,
        pending: bookings.filter((b) => b.status === 'pending').length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        completed: bookings.filter((b) => b.status === 'completed').length,
        cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };

    const filteredBookings = bookings.filter((b) => {
        if (activeTab !== 'all' && b.status !== activeTab) {
            return false;
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const instructorName = (b.instructor?.user?.name || '').toLowerCase();
            const lessonType = (b.lesson_type || '').toLowerCase();
            const location = (b.instructor?.location || '').toLowerCase();
            const schoolName = (b.instructor?.school?.name || '').toLowerCase();

            return (
                instructorName.includes(q) ||
                lessonType.includes(q) ||
                location.includes(q) ||
                schoolName.includes(q) ||
                b.date.includes(q)
            );
        }

        return true;
    });

    const tabs = [
        { key: 'all', label: 'All Sessions', count: totalCounts.all, color: 'text-slate-300' },
        { key: 'pending', label: 'Pending', count: totalCounts.pending, color: 'text-amber-400' },
        { key: 'confirmed', label: 'Confirmed', count: totalCounts.confirmed, color: 'text-emerald-400' },
        { key: 'completed', label: 'Completed', count: totalCounts.completed, color: 'text-sky-400' },
        { key: 'cancelled', label: 'Cancelled', count: totalCounts.cancelled, color: 'text-rose-400' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bookings - KiteLink" />

            <div className="relative min-h-full space-y-6 p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* Header Banner */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            <CalendarCheck className="h-7 w-7 text-[#5bb4ff]" />
                            My Kitesurfing Bookings
                        </h1>
                        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                            Track the status of your lesson requests, message confirmed coaches, and leave verified session reviews.
                        </p>
                    </div>

                    <Link
                        href="/instructors"
                        className="inline-flex items-center gap-2 self-start rounded-2xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-[1.02] hover:from-[#5bb4ff] hover:to-[#2e7bff] active:scale-[0.98] sm:self-auto sm:text-sm"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>Book New Lesson</span>
                    </Link>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Tabs */}
                    <div className="flex overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-xl">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`flex cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 sm:text-sm ${
                                        isActive
                                            ? 'bg-gradient-to-r from-[#1f6eff] to-[#3b82f6] text-white shadow-md shadow-blue-600/30'
                                            : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                            isActive ? 'bg-white/20 text-white' : 'bg-white/[0.08] text-slate-400'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search */}
                    <div className="relative min-w-[240px] sm:w-72">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter bookings..."
                            className="w-full rounded-2xl border border-white/15 bg-slate-950/60 py-2 pr-3 pl-9 text-xs text-white placeholder-slate-400/60 shadow-inner backdrop-blur-md transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none sm:text-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-10 py-16 text-center backdrop-blur-md">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#5bb4ff]/30 bg-[#5bb4ff]/10 text-[#5bb4ff] shadow-md">
                            <Wind className="h-7 w-7" />
                        </div>
                        <h3 className="text-lg font-bold text-white sm:text-xl">No Bookings Found</h3>
                        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
                            {activeTab === 'all'
                                ? "You haven't booked any kitesurfing lessons yet. Explore verified instructors worldwide and book your first progression session!"
                                : `You currently have no ${activeTab} bookings.`}
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <Link
                                href="/instructors"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Browse Certified Instructors</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => {
                            const isHighlighted = String(booking.id) === String(highlightId);
                            const instructorName = booking.instructor?.user?.name || 'Certified Instructor';
                            const instructorPhoto =
                                booking.instructor?.profile_photo || booking.instructor?.user?.profile_picture;
                            const schoolName = booking.instructor?.school?.name;
                            const location = booking.instructor?.location || booking.instructor?.school?.location;

                            return (
                                <div
                                    key={booking.id}
                                    ref={isHighlighted ? highlightedRef : undefined}
                                    className={`relative overflow-hidden rounded-3xl border p-5 shadow-xl backdrop-blur-xl transition-all duration-300 sm:p-6 ${
                                        isHighlighted
                                            ? 'border-[#5bb4ff] bg-blue-950/30 ring-2 ring-[#5bb4ff]/40'
                                            : 'border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.07]'
                                    }`}
                                >
                                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                                        {/* Left Side: Instructor + Lesson Details */}
                                        <div className="flex items-start gap-4 sm:gap-5">
                                            {/* Instructor Avatar */}
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-md sm:h-16 sm:w-16">
                                                {instructorPhoto ? (
                                                    <img
                                                        src={instructorPhoto}
                                                        alt={instructorName}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="bg-gradient-to-br from-[#b8e6ff] to-[#4da6ff] bg-clip-text text-xl font-black text-transparent">
                                                        {instructorName.charAt(0)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-base font-bold text-white sm:text-lg">
                                                        {instructorName}
                                                    </h3>
                                                    {schoolName && (
                                                        <span className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                                                            {schoolName}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-sm font-semibold text-[#8acbff]">
                                                    {booking.lesson_type}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300/80">
                                                    <span className="flex items-center gap-1.5 font-medium text-slate-200">
                                                        <Calendar className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                        {booking.date}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                        {booking.time}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Users className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                        {booking.students_count} student
                                                        {booking.students_count > 1 ? 's' : ''}
                                                    </span>
                                                    {location && (
                                                        <span className="flex items-center gap-1.5 truncate">
                                                            <MapPin className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                            {location}
                                                        </span>
                                                    )}
                                                </div>

                                                {booking.notes && (
                                                    <p className="mt-2 text-xs italic text-slate-400">
                                                        "{booking.notes}"
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Side: Status Badge, Price & Actions */}
                                        <div className="flex flex-row items-center justify-between gap-4 border-t border-white/10 pt-4 lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
                                            {/* Status Badge */}
                                            <div>
                                                {booking.status === 'pending' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        Awaiting instructor confirmation
                                                    </span>
                                                )}

                                                {booking.status === 'confirmed' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Confirmed
                                                    </span>
                                                )}

                                                {booking.status === 'completed' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-500/30 bg-slate-500/15 px-3 py-1 text-xs font-semibold text-slate-300">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Completed Session
                                                    </span>
                                                )}

                                                {booking.status === 'cancelled' && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-300">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        Cancelled / Declined
                                                    </span>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <span className="block text-[11px] font-medium tracking-wider text-slate-400 uppercase">
                                                    Session Total
                                                </span>
                                                <span className="text-lg font-black text-emerald-400 sm:text-xl">
                                                    ${Number(booking.total_price).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                {booking.status === 'confirmed' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMessageInstructor(booking.instructor_id)}
                                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:scale-105 hover:from-[#5bb4ff] hover:to-[#2e7bff]"
                                                    >
                                                        <MessageSquare className="h-3.5 w-3.5" />
                                                        <span>Message Instructor</span>
                                                    </button>
                                                )}

                                                {booking.status === 'completed' && (
                                                    <>
                                                        {booking.review ? (
                                                            <div className="flex items-center gap-1 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
                                                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                                <span>Rated {booking.review.rating}/5</span>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenReviewModal(booking)}
                                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/15 px-3.5 py-2 text-xs font-bold text-amber-300 shadow-sm transition-all hover:bg-amber-400/25 hover:text-white"
                                                            >
                                                                <Star className="h-3.5 w-3.5 fill-amber-300" />
                                                                <span>Leave a Review</span>
                                                            </button>
                                                        )}
                                                    </>
                                                )}

                                                <Link
                                                    href={`/instructors/${booking.instructor_id}`}
                                                    className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:bg-white/[0.12] hover:text-white"
                                                >
                                                    View Profile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Leave a Review Modal */}
            {reviewModalBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
                        onClick={() => setReviewModalBooking(null)}
                    />

                    <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-gradient-to-b from-[#0c1424] to-[#070b12] p-6 shadow-2xl shadow-black/80 sm:p-8">
                        <button
                            type="button"
                            onClick={() => setReviewModalBooking(null)}
                            className="absolute top-5 right-5 rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="mb-6 space-y-1.5">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">
                                <Sparkles className="h-3.5 w-3.5" />
                                Verified Student Review
                            </div>
                            <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                                Review Coaching Session
                            </h2>
                            <p className="text-xs text-slate-400 sm:text-sm">
                                Rate your session with{' '}
                                <span className="font-semibold text-white">
                                    {reviewModalBooking.instructor?.user?.name || 'Instructor'}
                                </span>{' '}
                                for{' '}
                                <span className="text-[#8acbff]">{reviewModalBooking.lesson_type}</span>.
                            </p>
                        </div>

                        <form onSubmit={handleReviewSubmit} className="space-y-5">
                            {/* Star Rating Selector */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold tracking-wider text-slate-300 uppercase">
                                    Your Overall Rating
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isFilled =
                                            (hoverRating !== null ? hoverRating : selectedRating) >= star;
                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedRating(star);
                                                    reviewForm.setData('rating', star);
                                                }}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(null)}
                                                className="cursor-pointer p-1 transition-transform hover:scale-125 focus:outline-none"
                                            >
                                                <Star
                                                    className={`h-7 w-7 transition-colors ${
                                                        isFilled
                                                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                                            : 'text-slate-600'
                                                    }`}
                                                />
                                            </button>
                                        );
                                    })}
                                    <span className="ml-2 text-sm font-bold text-amber-300">
                                        {selectedRating} of 5 Stars
                                    </span>
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold tracking-wider text-slate-300 uppercase">
                                    Feedback &amp; Coaching Experience
                                </label>
                                <textarea
                                    value={reviewForm.data.comment}
                                    onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                    placeholder="How was the instructor's communication, safety guidance, and progression coaching on the water?"
                                    rows={4}
                                    className="w-full rounded-2xl border border-white/15 bg-slate-950/60 p-4 text-sm text-white placeholder-slate-400/50 shadow-inner backdrop-blur-md transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none"
                                />
                                {reviewForm.errors.comment && (
                                    <p className="text-xs text-rose-400">{reviewForm.errors.comment}</p>
                                )}
                            </div>

                            {/* Submit & Cancel */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setReviewModalBooking(null)}
                                    className="cursor-pointer rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={reviewForm.processing}
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-600/30 transition-all hover:scale-[1.02] hover:from-amber-400 hover:to-amber-500 disabled:opacity-50"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                    <span>
                                        {reviewForm.processing ? 'Publishing Review...' : 'Publish Review'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
