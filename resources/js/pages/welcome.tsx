import ThemeToggle from '@/components/theme-toggle';
import WeatherWidget from '@/components/weather-widget';
import { Link, usePage } from '@inertiajs/react';
import React, { useRef } from 'react';

export default function KiteLinkLanding() {
    const seasonRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { auth } = usePage<any>().props;
    const isAuthenticated = !!auth?.user;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const card = seasonRefs.current[index];
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${y * -4}deg) translateY(-4px)`;
    };

    const handleMouseLeave = (index: number) => {
        const card = seasonRefs.current[index];
        if (!card) return;
        card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)';
    };

    return (
        <>
            {/* Background image & dark overlay stay dark/moody in both themes */}
            <img
                className="bg-image"
                src="https://media.istockphoto.com/id/588369448/photo/kite-surfing-man-in-the-caribbean.jpg?s=1024x1024&w=is&k=20&c=jFqNdOMzlvtr-0QOAspQHODed554keOuClit63vzl2M="
                alt="kitesurfing background"
            />
            <div className="overlay" />

            <div className="app">
                {/* NAVBAR */}
                <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 py-5 dark:border-white/10">
                    <Link
                        href={route('home')}
                        className="group flex items-center gap-2.5 no-underline transition-transform hover:scale-105"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-white/90 text-blue-600 shadow-sm backdrop-blur-md dark:border-[#5bb4ff]/40 dark:bg-gradient-to-br dark:from-[#1f6eff]/30 dark:to-[#5bb4ff]/15 dark:text-[#5bb4ff] dark:shadow-[0_0_12px_rgba(91,180,255,0.3)]">
                            <i className="fas fa-wind text-lg text-blue-600 dark:text-[#5bb4ff] transition-transform group-hover:rotate-6" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent dark:from-[#b8e6ff] dark:via-[#8acbff] dark:to-[#4da6ff]">
                            KiteLink
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {/* Navbar Sun/Moon Theme Toggle */}
                        <ThemeToggle />

                        {isAuthenticated ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:from-[#5bb4ff] hover:to-[#2e7bff] hover:shadow-blue-500/50"
                            >
                                <i className="fas fa-chart-pie" />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-slate-300 bg-white/95 px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-slate-400 hover:bg-white hover:text-slate-950 hover:shadow-sm dark:border-white/15 dark:bg-white/[0.07] dark:text-slate-200 dark:hover:bg-white/[0.14] dark:hover:text-white sm:text-sm"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/join"
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:from-[#5bb4ff] hover:to-[#2e7bff] hover:shadow-blue-500/50 sm:px-5 sm:text-sm"
                                >
                                    <i className="fas fa-user-plus" />
                                    <span>Join KiteLink</span>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* HERO */}
                <section className="flex max-w-3xl flex-col justify-center py-8 sm:py-12 animate-slideUp">
                    <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-200/90 bg-white/95 px-3 py-1 text-xs font-bold text-blue-700 shadow-sm backdrop-blur-md dark:border-[#5bb4ff]/30 dark:bg-[#1f6eff]/15 dark:text-[#b0daff] dark:shadow-none animate-floatBadge">
                        <i className="fas fa-globe text-blue-600 dark:text-[#5bb4ff]" />
                        <span>Sri Lanka · year-round</span>
                    </div>

                    <h1 className="mt-4 text-4xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
                        Find the Best <br />
                        <span className="bg-gradient-to-r from-[#f0faff] to-[#8acbff] bg-clip-text text-transparent drop-shadow-sm">
                            Kitesurf Instructors
                        </span>
                    </h1>

                    <p className="mt-4 max-w-xl text-base text-slate-100/90 drop-shadow-sm sm:text-lg">
                        KiteLink helps you discover certified instructors and kite centers around the world — book directly, no middleman.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Link
                            href={route('instructors.index')}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:from-[#5bb4ff] hover:to-[#2e7bff]"
                        >
                            <i className="fas fa-compass" />
                            <span>Find Instructors</span>
                        </Link>
                        <Link
                            href={route('schools.index')}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-6 py-3 text-sm font-bold text-slate-800 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-blue-300 hover:bg-white hover:text-blue-600 hover:shadow-lg dark:border-white/20 dark:bg-white/[0.04] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/[0.1]"
                        >
                            <i className="fas fa-map-pin text-blue-600 dark:text-[#7bc9ff]" />
                            <span>Explore Kite Centers</span>
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-1.5 text-xs text-slate-700 shadow-sm backdrop-blur-md transition-all hover:border-blue-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
                            <i className="fas fa-user-graduate text-blue-600 dark:text-[#5bb4ff]" />
                            <span>
                                <strong className="font-semibold text-slate-900 dark:text-white">Certified pros</strong> IKO &amp; VDWS
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-1.5 text-xs text-slate-700 shadow-sm backdrop-blur-md transition-all hover:border-blue-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
                            <i className="fas fa-handshake text-blue-600 dark:text-[#5bb4ff]" />
                            <span>
                                <strong className="font-semibold text-slate-900 dark:text-white">Direct booking</strong> no middleman
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/95 px-3.5 py-1.5 text-xs text-slate-700 shadow-sm backdrop-blur-md transition-all hover:border-blue-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
                            <i className="fas fa-map-marked-alt text-blue-600 dark:text-[#5bb4ff]" />
                            <span>
                                <strong className="font-semibold text-slate-900 dark:text-white">Worldwide spots</strong> 40+ countries
                            </span>
                        </div>
                    </div>
                </section>

                {/* SERVICES */}
                <div className="mt-10 border-t border-slate-200/60 pt-8 dark:border-white/10">
                    <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-3xl">
                        <i className="fas fa-concierge-bell text-blue-500 dark:text-[#5bb4ff]" />
                        <span>Services</span>
                    </h2>
                    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Affiliated Center Card */}
                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:backdrop-blur-xl dark:hover:border-[#5bb4ff]/30 sm:p-7">
                            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-white/40">
                                <i className="fas fa-flag text-blue-600 dark:text-[#5bb4ff]" />
                                <span>AFFILIATED CENTER</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                {[
                                    { icon: 'fas fa-kite', label: 'Kite' },
                                    { icon: 'fas fa-wing', label: 'Wing' },
                                    { icon: 'fas fa-route', label: 'Trips & Everyday' },
                                    { icon: 'fas fa-school', label: 'School' },
                                    { icon: 'fas fa-map-pin', label: 'Spots' },
                                ].map((badge, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/90 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-xs transition-all duration-200 hover:scale-105 hover:border-blue-300 hover:bg-blue-100 dark:border-[#5bb4ff]/30 dark:bg-[#1f6eff]/15 dark:text-[#8acbff] dark:hover:bg-[#1f6eff]/25"
                                    >
                                        <i className={`${badge.icon} text-[11px] text-blue-600 dark:text-[#5bb4ff]`} />
                                        {badge.label}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Included Services Card */}
                        <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:backdrop-blur-xl dark:hover:border-[#5bb4ff]/30 sm:p-7">
                            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-white/40">
                                <i className="fas fa-list text-blue-600 dark:text-[#5bb4ff]" />
                                <span>Included Services</span>
                            </div>
                            <ul className="mt-4 space-y-2.5">
                                {[
                                    { icon: 'fas fa-umbrella-beach', text: 'Gear Rental (Current Year Best Equipment)' },
                                    { icon: 'fas fa-tools', text: 'Kite Shop & Certified Repair Facility' },
                                    { icon: 'fas fa-chalkboard-teacher', text: 'Kite Coaching & Downwinder Safaris' },
                                ].map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-xs font-semibold text-slate-800 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/80 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-200 sm:text-sm"
                                    >
                                        <i className={`${item.icon} text-blue-600 dark:text-[#5bb4ff]`} />
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* REVIEWS */}
                <div className="mt-10 border-t border-slate-200/60 pt-8 dark:border-white/10">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-3xl">
                            <i className="fas fa-star text-amber-500" />
                            <span>Excellent</span>
                        </h2>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-white/95 px-3 py-1 text-xs font-bold text-amber-800 shadow-sm backdrop-blur-md dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300">
                            <i className="fas fa-star text-amber-500" />
                            <span>4.9 · 381 reviews</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-200/80 drop-shadow-xs dark:text-white/40">
                            <i className="fab fa-google mr-1" /> Google Reviews
                        </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((r) => (
                            <div
                                key={r.name}
                                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-900/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:backdrop-blur-xl dark:hover:border-[#5bb4ff]/30"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                            <i className="fas fa-user-circle text-blue-600 dark:text-[#7bc9ff]" />
                                            <span>{r.name}</span>
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-400 dark:text-white/30">{r.date}</span>
                                    </div>
                                    <div className="my-2 flex items-center gap-0.5 text-xs text-amber-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <i className="fas fa-star" key={i} />
                                        ))}
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-300">
                                        {r.text}
                                    </p>
                                </div>
                                <div className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-[#5bb4ff] dark:hover:text-[#8acbff] cursor-pointer">
                                    Read more →
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WINDY SEASONS INTRO */}
                <div className="mt-10 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:backdrop-blur-xl sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            <i className="fas fa-wind text-blue-600 dark:text-[#5bb4ff]" />
                            <span>Two distinct windy seasons</span>
                        </h2>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 shadow-xs dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <i className="fas fa-circle text-[8px] text-emerald-500 animate-pulse" />
                            <span>Live Spot Wind</span>
                        </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                        Kalpitiya offers two reliable kite seasons, making it a world-class destination throughout most of the year.
                    </p>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-blue-200/80 border-l-4 border-l-blue-500 bg-blue-50/40 p-4.5 shadow-xs transition-all dark:border-white/5 dark:border-l-4 dark:border-l-[#5bb4ff] dark:bg-white/[0.03]">
                            <h4 className="text-xs font-bold tracking-wider text-blue-700 uppercase dark:text-[#8acbff]">
                                Summer Season (mid-May – mid-October)
                            </h4>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                Expect strong, consistent cross-shore wind averaging 18–25 knots, with peaks up to 30 knots. Peak action dawn till dusk.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-sky-200/80 border-l-4 border-l-sky-500 bg-sky-50/40 p-4.5 shadow-xs transition-all dark:border-white/5 dark:border-l-4 dark:border-l-[#38bdf8] dark:bg-white/[0.03]">
                            <h4 className="text-xs font-bold tracking-wider text-sky-700 uppercase dark:text-[#7bc9ff]">
                                Winter Season (mid-December – mid-March)
                            </h4>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                Offers steady afternoon winds from 15–25 knots. Mornings are ideal for yoga, diving, or dolphin &amp; whale excursions.
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                        Both seasons are warm and dry with water temperatures around{' '}
                        <span className="font-bold text-blue-600 dark:text-[#8acbff]">27°C</span>, meaning you can kite without a wetsuit all year.
                        While the wind direction shifts between seasons, the adventure remains the same: reliable wind, warm water, and a variety of spots
                        to explore for every beginner or advanced kitesurfer.
                    </p>

                    {/* Spot Wind Station Weather Widget */}
                    <div className="mt-6">
                        <WeatherWidget defaultPlaceId="kalpitiya-1242089" />
                    </div>
                </div>

                {/* WEATHER / SEASONS */}
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {seasonData.map((season, index) => (
                        <div
                            className="season-card relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 hover:border-blue-400 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:backdrop-blur-xl dark:hover:border-[#5bb4ff]/30 sm:p-7"
                            key={season.title}
                            ref={(el) => {
                                seasonRefs.current[index] = el;
                            }}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white">
                                        <i className={`${season.icon} text-blue-600 dark:text-[#7bc9ff]`} />
                                        <span>{season.title}</span>
                                    </h3>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:border-[#5bb4ff]/30 dark:bg-[#1f6eff]/15 dark:text-[#7bc9ff]">
                                        <i className="far fa-calendar-alt text-[10px]" />
                                        <span>{season.badge}</span>
                                    </span>
                                </div>
                                <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-white/40">{season.dateRange}</div>

                                <div className="mt-4 grid grid-cols-2 gap-2.5">
                                    {season.items.map((item, i) => (
                                        <div
                                            className={`flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100/70 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-200 ${
                                                item.span ? 'col-span-2' : ''
                                            }`}
                                            key={i}
                                        >
                                            <i className={`${item.icon} text-blue-600 dark:text-[#5bb4ff] shrink-0`} />
                                            <span>{item.content}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ABOUT */}
                <div className="mt-10 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-md shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl dark:backdrop-blur-xl sm:p-8">
                    <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        <i className="fas fa-info-circle text-blue-600 dark:text-[#5bb4ff]" />
                        <span>About Us</span>
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                        KiteLink is the leading platform for kitesurfing enthusiasts. We connect you with certified instructors and world-class kite
                        centers across the globe. Whether you're a beginner or a pro, we make booking simple and transparent — no middleman, just pure
                        kitesurfing.
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { icon: 'fas fa-shield-alt', text: 'Certified IKO & VDWS' },
                            { icon: 'fas fa-globe-americas', text: '40+ Countries' },
                            { icon: 'fas fa-clock', text: 'Book in 2 Minutes' },
                            { icon: 'fas fa-star', text: '4.9 Average Rating' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3.5 text-xs font-bold text-slate-800 shadow-xs transition-all hover:border-blue-200 hover:bg-white hover:shadow-sm dark:border-white/5 dark:bg-white/[0.03] dark:text-slate-200"
                            >
                                <i className={`${item.icon} text-base text-blue-600 dark:text-[#5bb4ff]`} />
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="my-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 px-6 py-4 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-[#070b12]/60 dark:text-white/40 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-wind text-blue-600 dark:text-[#4ba9ff]" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">KiteLink</span>
                        <span>— the kitesurfing platform</span>
                    </div>
                    <div className="flex items-center gap-5 text-slate-500 dark:text-white/40">
                        <a href="#" className="transition-colors hover:text-blue-600 dark:hover:text-white">
                            Privacy
                        </a>
                        <a href="#" className="transition-colors hover:text-blue-600 dark:hover:text-white">
                            Terms
                        </a>
                        <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-white/10">
                            <a href="#" aria-label="Instagram" className="transition-colors hover:text-blue-600 dark:hover:text-[#7bc9ff]">
                                <i className="fab fa-instagram text-sm" />
                            </a>
                            <a href="#" aria-label="YouTube" className="transition-colors hover:text-blue-600 dark:hover:text-[#7bc9ff]">
                                <i className="fab fa-youtube text-sm" />
                            </a>
                            <a href="#" aria-label="Twitter" className="transition-colors hover:text-blue-600 dark:hover:text-[#7bc9ff]">
                                <i className="fab fa-twitter text-sm" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const reviews = [
    {
        name: 'Curious548',
        date: '5mo',
        text: 'Very nice people and place. Amazing! Best kitesport in Sri Lanka!',
    },
    {
        name: 'Robert Funke',
        date: '5mo',
        text: 'Very special place. Great atmosphere, food was delicious. Will come back!',
    },
    {
        name: 'Ernestin L.',
        date: '6mo',
        text: 'Lovely place to stay for kitesurfing. Instructors are amazing.',
    },
    {
        name: 'Martin Lurand',
        date: '6mo',
        text: 'Spent 2 weeks in this beautiful camp! Spot is superb, staff great.',
    },
    {
        name: 'Rafal D',
        date: '6mo',
        text: 'Great vibes! Great people, perfect spot, amazing food. Just feels right.',
    },
];

const seasonData = [
    {
        title: 'Winter Season',
        icon: 'fas fa-snowflake',
        dateRange: 'Mid‑December – Mid‑March',
        badge: 'peak season',
        items: [
            { icon: 'fas fa-water', content: 'Butter flat lagoon' },
            { icon: 'fas fa-water', content: 'Waves in ocean' },
            { icon: 'fas fa-wind', content: <span className="font-bold text-blue-600 dark:text-[#8acbff]">15‑20 knots</span> },
            {
                icon: 'fas fa-thermometer-half',
                content: (
                    <>
                        <span className="font-bold text-amber-600 dark:text-[#ffb347]">25°C</span> /{' '}
                        <span className="font-bold text-amber-600 dark:text-[#ffb347]">27°C</span>
                    </>
                ),
            },
            { icon: 'fas fa-tshirt', content: 'Kite without wetsuit', span: true },
        ],
    },
    {
        title: 'Summer Season',
        icon: 'fas fa-sun',
        dateRange: 'Mid‑May – Mid‑October',
        badge: 'windy season',
        items: [
            { icon: 'fas fa-water', content: 'Flat water lagoon' },
            { icon: 'fas fa-water', content: 'Waves in ocean' },
            { icon: 'fas fa-wind', content: <span className="font-bold text-blue-600 dark:text-[#8acbff]">18‑30 knots</span> },
            {
                icon: 'fas fa-thermometer-half',
                content: (
                    <>
                        <span className="font-bold text-amber-600 dark:text-[#ffb347]">27°C</span> /{' '}
                        <span className="font-bold text-amber-600 dark:text-[#ffb347]">32°C</span>
                    </>
                ),
            },
            { icon: 'fas fa-tshirt', content: 'Kite without wetsuit', span: true },
        ],
    },
];
