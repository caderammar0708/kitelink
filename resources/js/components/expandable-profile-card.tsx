import { Link } from '@inertiajs/react';
import { ChevronRight, MapPin, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

export interface ProfileDetailItem {
    label: string;
    value: React.ReactNode;
}

export interface ExpandableProfileCardProps {
    id: string | number;
    title: string;
    location?: string | null;
    subtitle?: string | null;
    imageSrc?: string | null;
    topBadge?: React.ReactNode;
    cornerBadge?: React.ReactNode;
    bio?: string | null;
    details?: ProfileDetailItem[];
    tags?: string[];
    profileUrl: string;
    profileButtonText?: string;
    content?: React.ReactNode;
}

export default function ExpandableProfileCard({
    id,
    title,
    location,
    subtitle,
    imageSrc,
    topBadge,
    cornerBadge,
    bio,
    details = [],
    tags = [],
    profileUrl,
    profileButtonText = 'View Full Profile',
    content,
}: ExpandableProfileCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const layoutId = `expandable-profile-card-${id}`;
    const displaySubtitle = subtitle || location || 'Spot Location';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <>
            {/* Collapsed Card */}
            <motion.div
                layoutId={layoutId}
                onClick={() => setIsOpen(true)}
                className="group relative h-72 sm:h-80 w-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#5bb4ff]/60 hover:shadow-xl dark:border-white/15 dark:bg-slate-900"
                whileHover="hover"
            >
                {imageSrc ? (
                    <motion.img
                        layoutId={`image-${layoutId}`}
                        src={imageSrc}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-cover"
                        variants={{
                            hover: { scale: 1.05 },
                        }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    />
                ) : (
                    <motion.div
                        layoutId={`image-${layoutId}`}
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/60 via-slate-900 to-indigo-950 text-white"
                    >
                        <span className="text-5xl font-black bg-gradient-to-r from-[#b8e6ff] to-[#4da6ff] bg-clip-text text-transparent">
                            {title ? title.charAt(0).toUpperCase() : 'K'}
                        </span>
                    </motion.div>
                )}

                {/* Gradient Shadow Overlay for High-Contrast Text in Both Light & Dark Mode */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95" />

                {/* Optional Top Badges */}
                {topBadge && <div className="absolute top-3.5 left-3.5 z-10">{topBadge}</div>}
                {cornerBadge && <div className="absolute top-3.5 right-3.5 z-10">{cornerBadge}</div>}

                {/* Card Bottom Meta */}
                <div className="absolute bottom-0 left-0 p-5 sm:p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <motion.p
                        layoutId={`subtitle-${layoutId}`}
                        className="text-[#5bb4ff] text-xs font-semibold tracking-wide uppercase mb-1 flex items-center gap-1.5 truncate"
                    >
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5bb4ff]" />
                        <span className="truncate">{displaySubtitle}</span>
                    </motion.p>
                    <motion.h3
                        layoutId={`title-${layoutId}`}
                        className="text-lg sm:text-xl font-bold tracking-tight text-white truncate mb-2 drop-shadow-xs"
                    >
                        {title}
                    </motion.h3>

                    <div className="flex items-center justify-between text-xs text-slate-300 opacity-90 group-hover:opacity-100 pt-2 border-t border-white/10">
                        <span className="text-[#8acbff] font-medium flex items-center gap-1">
                            Click to expand
                        </span>
                        <span className="inline-flex items-center gap-1 text-white font-semibold">
                            Quick View <ChevronRight className="h-3.5 w-3.5 text-[#5bb4ff]" />
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Expanded Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md dark:bg-black/80"
                        />

                        <motion.div
                            layoutId={layoutId}
                            className="relative z-10 flex h-auto max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl md:h-[620px] md:flex-row dark:border-white/15 dark:bg-[#0c121e]"
                        >
                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                }}
                                aria-label="Close modal"
                                className="absolute top-4 right-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-white/15 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Left Side: Photo */}
                            <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-100 sm:h-64 md:h-full md:w-5/12 dark:bg-slate-950">
                                {imageSrc ? (
                                    <motion.img
                                        layoutId={`image-${layoutId}`}
                                        src={imageSrc}
                                        alt={title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <motion.div
                                        layoutId={`image-${layoutId}`}
                                        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-900/60 via-slate-900 to-indigo-950"
                                    >
                                        <span className="text-6xl font-black bg-gradient-to-r from-[#b8e6ff] to-[#4da6ff] bg-clip-text text-transparent">
                                            {title ? title.charAt(0).toUpperCase() : 'K'}
                                        </span>
                                    </motion.div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent md:hidden" />
                            </div>

                            {/* Right Side: Expanded Content */}
                            <div className="flex w-full flex-col h-full overflow-y-auto p-6 sm:p-8 md:w-7/12 text-slate-900 dark:text-slate-100">
                                <motion.p
                                    layoutId={`subtitle-${layoutId}`}
                                    className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5bb4ff]"
                                >
                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5bb4ff]" />
                                    <span>{displaySubtitle}</span>
                                </motion.p>

                                <motion.h3
                                    layoutId={`title-${layoutId}`}
                                    className="mb-4 pb-3 text-2xl font-black tracking-tight text-slate-900 border-b border-slate-200/80 sm:text-3xl dark:border-white/10 dark:text-white"
                                >
                                    {title}
                                </motion.h3>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: 0.15 }}
                                    className="flex flex-col grow justify-between text-sm leading-relaxed"
                                >
                                    <div className="space-y-4">
                                        {bio && (
                                            <div>
                                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                                                    About
                                                </h4>
                                                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                                    {bio}
                                                </p>
                                            </div>
                                        )}

                                        {details.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                {details.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 sm:p-3 dark:border-white/10 dark:bg-white/[0.04]"
                                                    >
                                                        <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                            {item.label}
                                                        </div>
                                                        <div className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                            {item.value}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {tags.length > 0 && (
                                            <div>
                                                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                                                    Certifications &amp; Highlights
                                                </h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {tags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {content}
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                                        <Link
                                            href={profileUrl}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#1f6eff] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-[#5bb4ff] hover:to-[#2e7bff] hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <span>{profileButtonText}</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
