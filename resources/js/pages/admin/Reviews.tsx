import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    Eye,
    EyeOff,
    Search,
    Star,
    Trash2,
} from 'lucide-react';
import React, { useState } from 'react';

interface ReviewItem {
    id: number;
    rating: number;
    comment: string;
    instructor_reply?: string | null;
    is_hidden: boolean;
    created_at: string;
    student?: {
        name: string;
        email: string;
        profile_picture?: string | null;
    };
    instructor?: {
        user?: {
            name: string;
        };
    };
    booking?: {
        id: number;
        date: string;
        lesson_type: string;
    };
}

interface ReviewsProps {
    reviews: {
        data: ReviewItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        search: string;
        rating: string;
        visibility: string;
    };
    counts: {
        total: number;
        hidden: number;
        visible: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Reviews', href: '/admin/reviews' },
];

export default function Reviews({ reviews, filters, counts }: ReviewsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [visibility, setVisibility] = useState(filters.visibility || 'all');
    const [rating, setRating] = useState(filters.rating || 'all');

    const applyFilters = (custom?: Partial<typeof filters>) => {
        router.get(
            '/admin/reviews',
            {
                visibility: custom?.visibility ?? visibility,
                rating: custom?.rating ?? rating,
                search: custom?.search ?? search,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleToggleVisibility = (review: ReviewItem) => {
        router.post(`/admin/reviews/${review.id}/toggle-visibility`, {}, { preserveScroll: true });
    };

    const handleDelete = (review: ReviewItem) => {
        if (confirm(`Are you sure you want to delete this review from ${review.student?.name}?`)) {
            router.delete(`/admin/reviews/${review.id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reviews Moderation - KiteLink Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-slate-900 transition-colors duration-200 sm:p-6 lg:p-8 dark:text-slate-100">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                            Reviews Moderation
                        </h1>
                        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Monitor student feedback, hide inappropriate content, and maintain community review standards.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                            {counts.total} Reviews ({counts.visible} Visible, {counts.hidden} Hidden)
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#0c1220]">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Visibility filter */}
                        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
                            {(['all', 'visible', 'hidden'] as const).map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => {
                                        setVisibility(v);
                                        applyFilters({ visibility: v });
                                    }}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                                        visibility === v
                                            ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>

                        {/* Rating filter */}
                        <select
                            value={rating}
                            onChange={(e) => {
                                setRating(e.target.value);
                                applyFilters({ rating: e.target.value });
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilters();
                        }}
                        className="relative min-w-[240px]"
                    >
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search comments or users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                    </form>
                </div>

                {/* Review Cards Grid */}
                {reviews.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 p-12 text-center dark:border-white/10">
                        <p className="text-sm font-semibold text-slate-500">No reviews found matching criteria.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {reviews.data.map((rev) => (
                            <div
                                key={rev.id}
                                className={`rounded-3xl border p-5 shadow-sm transition-all ${
                                    rev.is_hidden
                                        ? 'border-amber-200 bg-amber-50/40 opacity-70 dark:border-amber-900/40 dark:bg-amber-950/10'
                                        : 'border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#0c1220]'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                            {rev.student?.name?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">
                                                {rev.student?.name}
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                To: {rev.instructor?.user?.name || 'Instructor'} •{' '}
                                                {new Date(rev.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rating Stars & Hidden Badge */}
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${
                                                        i < rev.rating
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        {rev.is_hidden && (
                                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                                Hidden
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <p className="mt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                    "{rev.comment}"
                                </p>

                                {rev.instructor_reply && (
                                    <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-white/5 dark:text-slate-400">
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            Instructor Reply:
                                        </span>{' '}
                                        {rev.instructor_reply}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/5">
                                    <span className="text-[11px] text-slate-400">
                                        Booking #{rev.booking?.id ?? 'N/A'}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleVisibility(rev)}
                                            className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold transition ${
                                                rev.is_hidden
                                                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300'
                                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300'
                                            }`}
                                        >
                                            {rev.is_hidden ? (
                                                <>
                                                    <Eye className="h-3.5 w-3.5" /> Unhide
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="h-3.5 w-3.5" /> Hide Review
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(rev)}
                                            className="rounded-xl p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                            title="Permanently remove"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {reviews.last_page > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
                        <span className="text-xs text-slate-500">
                            Page {reviews.current_page} of {reviews.last_page}
                        </span>
                        <div className="flex items-center gap-1">
                            {reviews.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : link.url
                                              ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
                                              : 'opacity-40 text-slate-400'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
