import Logo from '@/components/logo';
import ThemeToggle from '@/components/theme-toggle';
import WeatherWidget from '@/components/weather-widget';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react';

export default function WinduoLanding() {
    const seasonRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;

    // Track scroll position to make navbar transparent on scroll
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Interactive spot preview switcher
    const [selectedSpot, setSelectedSpot] = useState(0);

    const spots = [
        {
            name: 'Kalpitiya Lagoon',
            country: 'Sri Lanka',
            wind: '22.4 kts',
            direction: 'SSW · Cross-shore',
            windRange: '18 – 28 kts',
            waterTemp: '28°C',
            airTemp: '31°C',
            condition: 'Butter Flat Lagoon',
            tide: 'Mid-Tide Rising',
            status: 'Peak Wind Window Open',
            badge: 'Live Station Online',
        },
        {
            name: 'Dakhla Lagoon',
            country: 'Morocco',
            wind: '25.1 kts',
            direction: 'NNE · Side-shore',
            windRange: '20 – 32 kts',
            waterTemp: '21°C',
            airTemp: '25°C',
            condition: 'Speed Strip & Flat',
            tide: 'Low Tide',
            status: 'Optimal Freestyle',
            badge: 'Live Station Online',
        },
        {
            name: 'Tarifa (Valdevaqueros)',
            country: 'Spain',
            wind: '19.8 kts',
            direction: 'Poniente · Side-on',
            windRange: '16 – 24 kts',
            waterTemp: '19°C',
            airTemp: '23°C',
            condition: 'Choppy & Small Waves',
            tide: 'High Tide',
            status: 'Good Thermal Flow',
            badge: 'Live Station Online',
        },
        {
            name: 'Cumbuco',
            country: 'Brazil',
            wind: '23.6 kts',
            direction: 'E · Side-shore',
            windRange: '20 – 27 kts',
            waterTemp: '27°C',
            airTemp: '30°C',
            condition: 'Cauipe Flat Lagoon',
            tide: 'Mid-Tide',
            status: 'Constant Trade Wind',
            badge: 'Live Station Online',
        },
    ];

    const currentSpot = spots[selectedSpot];

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
        <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white transition-colors duration-300 dark:bg-[#070b12] dark:text-slate-100">
            {/* AMBIENT TECH BACKGROUND AURA (Replaced raw photo background) */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                {/* Dynamic radial gradient light spots */}
                <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-400/20 via-blue-600/20 to-indigo-500/20 blur-[130px] dark:from-sky-500/15 dark:via-blue-600/25 dark:to-indigo-500/20" />
                <div className="absolute top-[35%] -left-40 h-[500px] w-[600px] rounded-full bg-cyan-400/15 blur-[120px] dark:bg-cyan-500/10" />
                <div className="absolute top-[60%] -right-40 h-[550px] w-[600px] rounded-full bg-indigo-400/15 blur-[120px] dark:bg-indigo-600/10" />
                <div className="absolute -bottom-20 left-1/3 h-[400px] w-[700px] rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-600/10" />

                {/* Subtle tech micro-grid overlay with radial fade */}
                <div className="tech-grid-bg absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] dark:opacity-35" />
            </div>

            {/* FIXED NAVBAR (How it was at top, transparent while scrolling) */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
                    isScrolled
                        ? 'border-b border-slate-200/20 bg-transparent backdrop-blur-md dark:border-white/[0.03]'
                        : 'border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xs dark:border-white/[0.08] dark:bg-[#070b12]/85'
                }`}
            >
                <div
                    className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
                        isScrolled ? 'py-2.5 sm:py-3' : 'py-3.5'
                    }`}
                >
                    {/* Brand Logo */}
                    <div className="flex items-center gap-6">
                        <Link href={route('home')} className="no-underline transition-transform duration-300 hover:scale-105">
                            <Logo size="md" />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden items-center gap-1 lg:flex">
                            <Link
                                href={route('instructors.index')}
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                            >
                                <i className="fas fa-user-graduate mr-1.5 text-blue-500" />
                                Instructors
                            </Link>
                            <Link
                                href={route('schools.index')}
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                            >
                                <i className="fas fa-school mr-1.5 text-sky-500" />
                                Kite Centers
                            </Link>
                            <a
                                href="#wind-telemetry"
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                            >
                                <i className="fas fa-satellite-dish mr-1.5 text-cyan-500" />
                                Live Telemetry
                            </a>
                            <a
                                href="#seasons"
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                            >
                                <i className="fas fa-calendar-alt mr-1.5 text-indigo-500" />
                                Seasons
                            </a>
                            <a
                                href="#reviews"
                                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                            >
                                <i className="fas fa-star mr-1.5 text-amber-500" />
                                Reviews
                            </a>
                        </nav>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <ThemeToggle />

                        {isAuthenticated ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/35 sm:text-sm"
                            >
                                <i className="fas fa-chart-pie text-xs" />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-xl border border-slate-300/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-md transition-all duration-200 hover:border-slate-400 hover:bg-white hover:text-slate-950 sm:px-4 sm:py-2 sm:text-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/[0.1] dark:hover:text-white"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/join"
                                    className="relative inline-flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/40 sm:px-5 sm:py-2 sm:text-sm"
                                >
                                    <i className="fas fa-user-plus text-xs" />
                                    <span>Join Winduo</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT CONTAINER */}
            <div className="app pt-24 sm:pt-28 lg:pt-32">
                {/* HERO SECTION */}
                <section className="relative pt-6 pb-16 sm:pt-8 sm:pb-20 lg:pt-10 lg:pb-24">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
                        {/* Left Hero Column */}
                        <div className="animate-slideUp flex flex-col justify-center lg:col-span-7">
                            {/* Live Badge */}
                            <div className="animate-floatBadge inline-flex w-fit items-center gap-2 rounded-full border border-sky-400/30 bg-sky-50/90 px-3.5 py-1.5 text-xs font-bold text-sky-700 shadow-xs backdrop-blur-md dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                                <span>Certified IKO &amp; VDWS Pros &middot; Direct Booking &middot; Live Wind</span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                                Find &amp; Book Top <br />
                                <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent dark:from-[#78c6ff] dark:via-[#38bdf8] dark:to-[#818cf8]">
                                    Kitesurf Instructors &amp; Centers
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                                Connect directly with certified kitesurfing instructors and premier kite centers worldwide. Access real-time spot wind telemetry and book your sessions with zero middleman fees.
                            </p>

                            {/* CTAs */}
                            <div className="mt-8 flex flex-wrap items-center gap-3.5">
                                <Link
                                    href={route('instructors.index')}
                                    className="group inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-blue-500/50"
                                >
                                    <i className="fas fa-compass transition-transform duration-300 group-hover:rotate-45" />
                                    <span>Find Instructors</span>
                                    <i className="fas fa-arrow-right text-xs transition-transform duration-300 group-hover:translate-x-0.5" />
                                </Link>

                                <Link
                                    href={route('schools.index')}
                                    className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-300 bg-white/90 px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-blue-400 hover:bg-white hover:text-blue-600 hover:shadow-md dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/[0.1]"
                                >
                                    <i className="fas fa-map-pin text-blue-600 dark:text-sky-400" />
                                    <span>Explore Kite Centers</span>
                                </Link>
                            </div>

                            {/* Trust KPI Ticker */}
                            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/80 p-3 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03]">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-sky-400">
                                        <i className="fas fa-user-graduate text-xs" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">Certified Pros</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">IKO &amp; VDWS verified</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/80 p-3 shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-white/[0.03]">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                        <i className="fas fa-handshake text-xs" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">Direct Booking</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">0% Agency markup</span>
                                    </div>
                                </div>

                                <div className="col-span-2 flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/80 p-3 shadow-xs backdrop-blur-md sm:col-span-1 dark:border-white/10 dark:bg-white/[0.03]">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                        <i className="fas fa-globe text-xs" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">40+ Countries</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Worldwide network</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Column: Interactive Tech Spot Control Terminal */}
                        <div className="lg:col-span-5">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                {/* Glow aura behind the card */}
                                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/30 to-indigo-500/30 opacity-70 blur-xl dark:from-sky-500/25 dark:to-indigo-500/25" />

                                <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl transition-all dark:border-white/10 dark:bg-[#0c121e]/90">
                                    {/* Terminal Header */}
                                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-white/10">
                                        <div className="flex items-center gap-2">
                                            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                                            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                                            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                                            <span className="ml-2 font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                                                SPOT_RADAR_V2
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            {currentSpot.badge}
                                        </span>
                                    </div>

                                    {/* Spot Switcher Tabs */}
                                    <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto pb-1">
                                        {spots.map((spot, idx) => (
                                            <button
                                                key={spot.name}
                                                onClick={() => setSelectedSpot(idx)}
                                                className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                                                    selectedSpot === idx
                                                        ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-500 dark:text-white'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]'
                                                }`}
                                            >
                                                {spot.name}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Selected Spot Hero Display */}
                                    <div className="mt-5 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 p-4 dark:border-blue-900/40 dark:from-blue-950/30 dark:to-indigo-950/20">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 dark:text-white">{currentSpot.name}</h3>
                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    <i className="fas fa-map-marker-alt mr-1 text-blue-500" />
                                                    {currentSpot.country} &middot; Spot Telemetry
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-mono text-2xl font-black text-blue-600 dark:text-sky-400">
                                                    {currentSpot.wind}
                                                </span>
                                                <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                    {currentSpot.direction}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Wind Velocity Meter Bar */}
                                        <div className="mt-3">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                <span>Wind Range: {currentSpot.windRange}</span>
                                                <span className="text-emerald-600 dark:text-emerald-400">{currentSpot.status}</span>
                                            </div>
                                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 w-[78%]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Spot Telemetry Grid */}
                                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-white/5 dark:bg-white/[0.02]">
                                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">WATER TEMP</span>
                                            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-base font-bold text-slate-900 dark:text-white">
                                                <i className="fas fa-thermometer-half text-amber-500" />
                                                <span>{currentSpot.waterTemp}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-400">Air: {currentSpot.airTemp}</span>
                                        </div>

                                        <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-white/5 dark:bg-white/[0.02]">
                                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">WATER SURFACE</span>
                                            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                                                <i className="fas fa-water text-sky-500" />
                                                <span className="truncate">{currentSpot.condition}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{currentSpot.tide}</span>
                                        </div>
                                    </div>

                                    {/* Action link */}
                                    <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-3 dark:border-white/10">
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Looking for instruction here?</span>
                                        <Link
                                            href={route('instructors.index')}
                                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-sky-400 dark:hover:text-sky-300"
                                        >
                                            <span>Find Local Pros</span>
                                            <i className="fas fa-chevron-right text-[10px]" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SERVICES & INFRASTRUCTURE BENTO GRID */}
                <section className="mt-12 border-t border-slate-200/70 pt-12 dark:border-white/10">
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-sky-300">
                            <i className="fas fa-layer-group text-xs" />
                            <span>ECOSYSTEM &middot; SERVICES</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Engineered for Every Stage of Your Kite Journey
                        </h2>
                        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                            From beginner zero-to-hero certifications to downwinder safaris and equipment rentals, everything is connected through our unified platform.
                        </p>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {/* Bento Card 1: Affiliated Kite Centers */}
                        <div className="rounded-3xl border border-slate-200/90 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-400 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/40">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-sky-400">
                                <i className="fas fa-school text-lg" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Affiliated Kite Centers</h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                Verified international kite centers offering top-tier training, boat rescue support, and clubhouse facilities.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-1.5">
                                {[
                                    { icon: 'fas fa-wind', label: 'Kite' },
                                    { icon: 'fas fa-feather-alt', label: 'Wing Foil' },
                                    { icon: 'fas fa-route', label: 'Downwinders' },
                                    { icon: 'fas fa-campground', label: 'Kite Camps' },
                                    { icon: 'fas fa-map-marked-alt', label: 'Secret Spots' },
                                ].map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                                    >
                                        <i className={`${tag.icon} text-[10px] text-blue-500`} />
                                        <span>{tag.label}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bento Card 2: Professional Infrastructure */}
                        <div className="rounded-3xl border border-slate-200/90 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-400 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/40">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                                <i className="fas fa-toolbox text-lg" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Gear &amp; Technical Support</h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                Premium hardware and safety support maintained to rigorous international standards.
                            </p>
                            <ul className="mt-5 space-y-2.5">
                                {[
                                    { icon: 'fas fa-shield-alt', text: 'Current Year Best Equipment Rental' },
                                    { icon: 'fas fa-tools', text: 'Certified Repair & Bladder Facility' },
                                    { icon: 'fas fa-life-ring', text: 'Dedicated Rescue Boat Standby' },
                                ].map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-700 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-300"
                                    >
                                        <i className={`${item.icon} text-sky-600 dark:text-sky-400`} />
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Bento Card 3: Direct Booking & Zero Fees */}
                        <div className="rounded-3xl border border-slate-200/90 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-400 hover:shadow-lg md:col-span-2 lg:col-span-1 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/40">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                <i className="fas fa-handshake text-lg" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Zero Middleman Markup</h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                Deal directly with your instructor or kite camp. No hidden agency commissions, guaranteed transparent pricing.
                            </p>
                            <div className="mt-5 space-y-2">
                                <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-50/60 p-2.5 text-xs font-semibold text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                                    <span>Direct Rate Guarantee</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">100% P2P</span>
                                </div>
                                <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 p-2.5 text-xs font-semibold text-slate-700 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-300">
                                    <span>Direct Chat with Pros</span>
                                    <span className="text-blue-600 dark:text-sky-400">Included</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* WIND STATION & TELEMETRY SECTION */}
                <section id="wind-telemetry" className="mt-16 scroll-mt-24">
                    <div className="rounded-3xl border border-slate-200/90 bg-white/80 p-6 shadow-md backdrop-blur-xl transition-all duration-300 sm:p-8 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-2xl">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-5 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-sky-400">
                                    <i className="fas fa-satellite-dish text-lg" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                                        Live Wind Station Telemetry
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Real-time atmospheric telemetry and multi-day wind forecasting
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Active Station Feed</span>
                            </span>
                        </div>

                        {/* Interactive Weather Widget Component */}
                        <div className="mt-6">
                            <WeatherWidget defaultPlaceId="kalpitiya-1242089" />
                        </div>
                    </div>
                </section>

                {/* DUAL WINDY SEASONS COMPARISON MATRIX */}
                <section id="seasons" className="mt-16 scroll-mt-24">
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
                            <i className="fas fa-calendar-check text-xs" />
                            <span>CONDITIONS &middot; SEASONS</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                            Two Distinct World-Class Windy Seasons
                        </h2>
                        <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                            Kalpitiya, Sri Lanka features 9+ months of reliable kitesurfing wind every year with butter flat water and warm temperatures.
                        </p>
                    </div>

                    {/* Season Comparison Cards */}
                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        {seasonData.map((season, index) => (
                            <div
                                className="season-card relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/85 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-blue-400 hover:shadow-xl sm:p-8 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/40"
                                key={season.title}
                                ref={(el) => {
                                    seasonRefs.current[index] = el;
                                }}
                                onMouseMove={(e) => handleMouseMove(e, index)}
                                onMouseLeave={() => handleMouseLeave(index)}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-sky-400">
                                                <i className={`${season.icon} text-lg`} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white">{season.title}</h3>
                                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{season.dateRange}</div>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-sky-300">
                                            <i className="far fa-calendar-alt text-[10px]" />
                                            <span>{season.badge}</span>
                                        </span>
                                    </div>

                                    {/* Highlights Matrix */}
                                    <div className="mt-6 grid grid-cols-2 gap-2.5">
                                        {season.items.map((item, i) => (
                                            <div
                                                className={`flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-200 ${
                                                    item.span ? 'col-span-2' : ''
                                                }`}
                                                key={i}
                                            >
                                                <i className={`${item.icon} shrink-0 text-blue-600 dark:text-sky-400`} />
                                                <span>{item.content}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-slate-200/70 pt-4 text-xs text-slate-500 dark:border-white/5 dark:text-slate-400">
                                    <i className="fas fa-check-circle mr-1 text-emerald-500" />
                                    <span>Average water temperature 27°C &middot; Kite in boardshorts year-round</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* VERIFIED REVIEWS & SOCIAL PROOF */}
                <section id="reviews" className="mt-16 scroll-mt-24 border-t border-slate-200/70 pt-12 dark:border-white/10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2">
                                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Loved by Kitesurfers Globally
                                </h2>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                                Real verified reviews from students, instructors, and visiting pros
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-300/80 bg-amber-50/80 px-4 py-2 text-xs font-bold text-amber-800 shadow-xs dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
                                <i className="fas fa-star text-amber-500" />
                                <span>4.9 / 5.0 Rating</span>
                                <span className="text-slate-400">&middot;</span>
                                <span className="font-medium text-slate-600 dark:text-slate-400">381 Google Reviews</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {reviews.map((r) => (
                            <div
                                key={r.name}
                                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/30"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-sky-400">
                                                <i className="fas fa-user text-xs" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">{r.name}</span>
                                                <div className="text-[10px] text-slate-400 dark:text-slate-500">Verified Rider</div>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-medium text-slate-400 dark:text-white/30">{r.date}</span>
                                    </div>

                                    <div className="my-2.5 flex items-center gap-1 text-xs text-amber-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <i className="fas fa-star" key={i} />
                                        ))}
                                    </div>

                                    <p className="line-clamp-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{r.text}</p>
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-white/5">
                                    <span className="text-[11px] text-slate-400">Google Review</span>
                                    <span className="font-semibold text-blue-600 dark:text-sky-400">5.0 ★</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ABOUT US & STANDARDS */}
                <section className="mt-16 rounded-3xl border border-slate-200/90 bg-white/80 p-6 shadow-md backdrop-blur-xl transition-all duration-300 sm:p-8 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-sky-400">
                            <i className="fas fa-globe-americas text-lg" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                Global Standards &middot; Local Knowledge
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Designed and run by kitesurfers, for kitesurfers
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                        Winduo is the global infrastructure connecting riders with certified instructors and kitesurf centers across the world. Whether you are learning your first waterstart or dialing in unhooked handlepasses, we ensure transparent pricing, verified safety standards, and live conditions.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { icon: 'fas fa-shield-alt', title: 'IKO & VDWS Certified', desc: 'Highest safety standards' },
                            { icon: 'fas fa-globe', title: '40+ Countries', desc: 'Global spot directory' },
                            { icon: 'fas fa-bolt', title: 'Fast Booking', desc: 'Direct chat & confirm' },
                            { icon: 'fas fa-award', title: '4.9 Rating', desc: 'Hundreds of reviews' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col gap-1 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-xs transition-all hover:border-blue-300 hover:bg-white dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/20"
                            >
                                <i className={`${item.icon} text-base text-blue-600 dark:text-sky-400`} />
                                <span className="mt-1 text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* MODERN TECH FOOTER */}
                <footer className="my-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-5 text-xs font-medium text-slate-600 shadow-xs backdrop-blur-md sm:flex-row dark:border-white/10 dark:bg-[#070b12]/80 dark:text-slate-400">
                    <div className="flex items-center gap-2.5">
                        <Logo size="sm" showWordmark={false} className="size-5" />
                        <span className="font-extrabold text-slate-900 dark:text-white">Winduo</span>
                        <span className="text-slate-400">&mdash; the kitesurfing network</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" className="transition-colors hover:text-blue-600 dark:hover:text-white">
                            Privacy
                        </a>
                        <a href="#" className="transition-colors hover:text-blue-600 dark:hover:text-white">
                            Terms
                        </a>
                        <a href="#" className="transition-colors hover:text-blue-600 dark:hover:text-white">
                            Security
                        </a>

                        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-white/10">
                            <a href="#" aria-label="Instagram" className="text-slate-500 transition-colors hover:text-blue-600 dark:hover:text-sky-400">
                                <i className="fab fa-instagram" />
                            </a>
                            <a href="#" aria-label="YouTube" className="text-slate-500 transition-colors hover:text-blue-600 dark:hover:text-sky-400">
                                <i className="fab fa-youtube" />
                            </a>
                            <a href="#" aria-label="Twitter" className="text-slate-500 transition-colors hover:text-blue-600 dark:hover:text-sky-400">
                                <i className="fab fa-twitter" />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
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
        text: 'Lovely place to stay for kitesurfing. Instructors are amazing and super certified.',
    },
    {
        name: 'Martin Lurand',
        date: '6mo',
        text: 'Spent 2 weeks in this beautiful camp! Spot is superb, staff great, gear top tier.',
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
        badge: 'Peak Season',
        items: [
            { icon: 'fas fa-water', content: 'Butter flat lagoon' },
            { icon: 'fas fa-water', content: 'Waves in ocean' },
            { icon: 'fas fa-wind', content: <span className="font-bold text-blue-600 dark:text-sky-400">15‑20 knots steady</span> },
            {
                icon: 'fas fa-thermometer-half',
                content: (
                    <>
                        <span className="font-bold text-amber-600 dark:text-amber-400">25°C</span> water /{' '}
                        <span className="font-bold text-amber-600 dark:text-amber-400">27°C</span> air
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
        badge: 'Strong Wind Season',
        items: [
            { icon: 'fas fa-water', content: 'Flat water lagoon' },
            { icon: 'fas fa-water', content: 'Waves in ocean' },
            { icon: 'fas fa-wind', content: <span className="font-bold text-blue-600 dark:text-sky-400">18‑30 knots strong</span> },
            {
                icon: 'fas fa-thermometer-half',
                content: (
                    <>
                        <span className="font-bold text-amber-600 dark:text-amber-400">27°C</span> water /{' '}
                        <span className="font-bold text-amber-600 dark:text-amber-400">32°C</span> air
                    </>
                ),
            },
            { icon: 'fas fa-tshirt', content: 'Kite without wetsuit', span: true },
        ],
    },
];