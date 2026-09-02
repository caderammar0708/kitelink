import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Award,
    CheckCircle2,
    CornerDownRight,
    LoaderCircle,
    MessageCircle,
    MessageSquare,
    Send,
    Sparkles,
    Star,
    ThumbsUp,
    User,
} from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    profile_picture?: string;
}

interface Review {
    id: number;
    student_id: number;
    student?: Student;
    rating: number;
    comment?: string;
    instructor_reply?: string;
    replied_at?: string;
    created_at: string;
}

interface ReviewsProps {
    reviews?: Review[];
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
    {
        title: 'Student Reviews',
        href: '/instructor/reviews',
    },
];

export default function Reviews({
    reviews = [],
    averageRating = 4.9,
    totalReviews = 0,
    ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}: ReviewsProps) {
    const [replyingReviewId, setReplyingReviewId] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendReply = (reviewId: number) => {
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        router.post(
            route('instructor.reviews.reply', reviewId),
            { instructor_reply: replyText },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setReplyingReviewId(null);
                    setReplyText('');
                },
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Reviews - KiteLink" />

            <div className="relative min-h-full space-y-6 p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
                            Verified Student Reviews
                        </h1>
                        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                            Public reviews from verified students who booked kitesurfing coaching sessions with you
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
                        <Sparkles className="h-4 w-4" />
                        Reputation Score: Top 5%
                    </div>
                </div>

                {/* Rating Overview Glass Card */}
                <div className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:grid-cols-12">
                    {/* Left: Overall Score (4 cols) */}
                    <div className="flex flex-col items-center justify-center border-b border-white/10 pb-6 text-center md:col-span-4 md:border-r md:border-b-0 md:pb-0 md:pr-6">
                        <span className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">{averageRating}</span>
                        <div className="mt-2 flex text-base text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                        i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="mt-2 text-xs font-semibold text-slate-400">
                            Based on {totalReviews} student review{totalReviews !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Right: Star Breakdown Progress Bars (8 cols) */}
                    <div className="space-y-2.5 md:col-span-8">
                        <h3 className="text-xs font-bold tracking-wider text-slate-300 uppercase">Rating Breakdown</h3>
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = ratingDistribution[stars] || 0;
                            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                            return (
                                <div key={stars} className="flex items-center gap-3 text-xs">
                                    <span className="flex w-12 items-center gap-1 font-semibold text-slate-300">
                                        {stars} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    </span>
                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-8 text-right text-[11px] text-slate-400">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    <h2 className="text-base font-bold text-white sm:text-lg">Recent Student Feedback</h2>

                    {reviews.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/20 px-4 py-16 text-center">
                            <Star className="mx-auto mb-3 h-10 w-10 text-slate-600" />
                            <h3 className="text-base font-bold text-white">No Reviews Yet</h3>
                            <p className="mt-1 max-w-sm text-xs text-slate-400">
                                After students complete lessons with you, they will be invited to leave a verified rating and review.
                            </p>
                        </div>
                    ) : (
                        reviews.map((rev) => {
                            const isReplying = replyingReviewId === rev.id;

                            return (
                                <div
                                    key={rev.id}
                                    className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-xl backdrop-blur-xl transition hover:border-white/20 sm:p-6"
                                >
                                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                        {/* Student Info */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-800 text-xs font-bold text-[#8acbff]">
                                                {rev.student?.profile_picture ? (
                                                    <img
                                                        src={rev.student.profile_picture}
                                                        alt={rev.student?.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    rev.student?.name?.charAt(0) || 'S'
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{rev.student?.name || 'Student'}</h4>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex text-amber-400">
                                                        {Array.from({ length: rev.rating }).map((_, i) => (
                                                            <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                        ))}
                                                    </div>
                                                    <span className="text-[11px] text-slate-400">
                                                        • {new Date(rev.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reply Button (if not already replied) */}
                                        {!rev.instructor_reply && !isReplying && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setReplyingReviewId(rev.id);
                                                    setReplyText('');
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                                            >
                                                <MessageSquare className="h-3.5 w-3.5 text-[#5bb4ff]" />
                                                Reply Publicly
                                            </button>
                                        )}
                                    </div>

                                    {/* Review Comment */}
                                    <p className="text-xs leading-relaxed text-slate-200 sm:text-sm">
                                        "{rev.comment || 'Great kitesurfing coaching session! Very knowledgeable and patient.'}"
                                    </p>

                                    {/* Existing Public Reply */}
                                    {rev.instructor_reply && (
                                        <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#5bb4ff]/20 bg-[#1f6eff]/10 p-3.5 text-xs">
                                            <CornerDownRight className="mt-0.5 h-4 w-4 shrink-0 text-[#5bb4ff]" />
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[#8acbff]">Your Public Response:</span>
                                                    {rev.replied_at && (
                                                        <span className="text-[10px] text-slate-400">
                                                            {new Date(rev.replied_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-slate-200">{rev.instructor_reply}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reply Textbox (Expandable) */}
                                    {isReplying && (
                                        <div className="space-y-3 rounded-xl border border-white/15 bg-slate-950/60 p-4">
                                            <label className="block text-xs font-bold text-slate-200">
                                                Write a public reply to {rev.student?.name || 'this student'}:
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="e.g. Thanks so much for the feedback! It was fantastic coaching you in the lagoon. Keep practicing your transitions!"
                                                className="w-full resize-none rounded-xl border border-white/15 bg-slate-900/80 p-3 text-xs text-white placeholder-slate-500 focus:border-[#3b82f6] focus:outline-none"
                                            />
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setReplyingReviewId(null)}
                                                    className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isSubmitting || !replyText.trim()}
                                                    onClick={() => handleSendReply(rev.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-1.5 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] disabled:opacity-50"
                                                >
                                                    {isSubmitting ? (
                                                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        <Send className="h-3.5 w-3.5" />
                                                    )}
                                                    Post Reply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
