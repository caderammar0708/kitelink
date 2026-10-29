import Logo from '@/components/logo';
import TechBackground from '@/components/tech-background';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
    headerRight?: ReactNode;
}

export function AuthLayout({ children, title, description, headerRight }: AuthLayoutProps) {
    return (
        <div
            className="relative w-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white transition-colors duration-300 dark:bg-[#070b12] dark:text-slate-100"
            style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', minHeight: '100vh' }}
        >
            {/* Ambient Tech Aura Background (matches Landing Page) */}
            <TechBackground />

            {/* Top Navbar / Branding */}
            <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
                <Link href={route('home')} className="transition-transform duration-300 hover:scale-105">
                    <Logo size="md" />
                </Link>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {headerRight || (
                        <Link
                            href={route('login')}
                            className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-md transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 sm:text-sm dark:border-white/15 dark:bg-white/[0.07] dark:text-slate-200 dark:hover:bg-white/[0.14] dark:hover:text-white"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </header>

            {/* Main Centered Content Container — grid row fills remaining height */}
            <main className="relative z-10 flex w-full items-center justify-center px-4 py-8 sm:px-6">
                {title ? (
                    <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 sm:p-8 dark:border-white/10 dark:bg-white/[0.07] dark:shadow-2xl dark:shadow-black/60">
                        <div className="mb-6 flex flex-col items-center text-center">
                            <Link
                                href={route('home')}
                                className="mb-4 inline-flex items-center transition-transform duration-300 hover:scale-105"
                            >
                                <Logo size="lg" />
                            </Link>

                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">{title}</h1>
                            {description && <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300/80">{description}</p>}
                        </div>
                        {children}
                    </div>
                ) : (
                    children
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-200/80 py-5 text-center text-xs text-slate-500 transition-colors duration-300 dark:border-white/5 dark:text-white/40">
                <p className="flex items-center justify-center gap-1.5">
                    <Logo size="sm" showWordmark={false} className="size-4" />
                    <span>Winduo &mdash; Discover certified kitesurfing instructors &amp; premier kite centers worldwide</span>
                </p>
            </footer>
        </div>
    );
}

export default AuthLayout;
