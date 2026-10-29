import TechBackground from '@/components/tech-background';
import Logo from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, UserPlus } from 'lucide-react';
import { type ReactNode } from 'react';

export interface PublicLayoutProps {
    children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;

    return (
        <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white transition-colors duration-300 dark:bg-[#070b12] dark:text-slate-100">
            {/* Ambient Tech Aura Background (matches Landing Page) */}
            <TechBackground />

            {/* Public Header / Navbar */}
            <header className="relative sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xs transition-colors duration-300 dark:border-white/10 dark:bg-[#070b12]/80 dark:shadow-none">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <Link href={route('home')} className="transition-transform duration-300 hover:scale-105">
                        <Logo size="md" />
                    </Link>

                    {/* Nav Links & Actions */}
                    <nav className="flex items-center gap-3">
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 sm:px-5 sm:text-sm dark:from-[#4ba9ff] dark:to-[#1f6eff] dark:shadow-blue-600/30 dark:hover:from-[#5bb4ff] dark:hover:to-[#2e7bff]"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-md transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200 dark:hover:bg-white/[0.14] dark:hover:text-white sm:px-4 sm:text-sm"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/join"
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 sm:px-5 sm:text-sm dark:from-[#4ba9ff] dark:to-[#1f6eff] dark:shadow-blue-600/30 dark:hover:from-[#5bb4ff] dark:hover:to-[#2e7bff]"
                                >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    <span>Join Winduo</span>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            {/* Page Body */}
            <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">{children}</main>

            {/* Public Footer */}
            <footer className="relative z-10 border-t border-slate-200/80 bg-white/70 py-8 text-xs text-slate-500 backdrop-blur-md transition-colors duration-300 dark:border-white/10 dark:bg-[#070b12]/70 dark:text-white/50">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <Logo size="sm" showWordmark={false} className="size-4" />
                        <span className="font-semibold text-slate-800 dark:text-slate-300">Winduo</span>
                        <span>— Discover certified kitesurfing coaches &amp; schools worldwide</span>
                    </div>

                    <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400">
                        <Link href={route('instructors.index')} className="transition-colors hover:text-slate-900 dark:hover:text-white">
                            Instructors
                        </Link>
                        <Link href={route('schools.index')} className="transition-colors hover:text-slate-900 dark:hover:text-white">
                            Kite Centers
                        </Link>
                        <Link href="/join" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                            Become a Partner
                        </Link>
                        <Link href={route('login')} className="transition-colors hover:text-slate-900 dark:hover:text-white">
                            Sign In
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default PublicLayout;
