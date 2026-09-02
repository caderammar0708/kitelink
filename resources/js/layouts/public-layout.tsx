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
        <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden font-sans text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white">
            {/* Ocean/Kitesurf Background Image */}
            <img
                src="https://media.istockphoto.com/id/588369448/photo/kite-surfing-man-in-the-caribbean.jpg?s=1024x1024&w=is&k=20&c=jFqNdOMzlvtr-0QOAspQHODed554keOuClit63vzl2M="
                alt="Kitesurfing Background"
                className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover brightness-[0.38] contrast-[1.08] saturate-[1.25]"
            />

            {/* Dark Radial Gradient Overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background: 'radial-gradient(circle at 30% 20%, rgba(0, 30, 60, 0.80) 0%, rgba(7, 11, 18, 0.94) 100%)',
                }}
            />

            {/* Public Header / Navbar */}
            <header className="relative sticky top-0 z-20 w-full border-b border-white/10 bg-[#070b12]/50 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    {/* Brand Logo */}
                    <Link href={route('home')} className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#5bb4ff]/40 bg-gradient-to-br from-[#1f6eff]/30 to-[#5bb4ff]/15 shadow-[0_0_12px_rgba(91,180,255,0.3)]">
                            <i className="fas fa-wind text-lg text-[#5bb4ff] drop-shadow-[0_0_8px_rgba(91,180,255,0.6)] transition-transform group-hover:rotate-6" />
                        </div>
                        <span className="bg-gradient-to-r from-[#b8e6ff] via-[#8acbff] to-[#4da6ff] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
                            KiteLink
                        </span>
                    </Link>

                    {/* Nav Links & Actions */}
                    <nav className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:from-[#5bb4ff] hover:to-[#2e7bff] hover:shadow-blue-500/50 sm:px-5 sm:text-sm"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/[0.14] hover:text-white sm:px-4 sm:text-sm"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/join"
                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:from-[#5bb4ff] hover:to-[#2e7bff] hover:shadow-blue-500/50 sm:px-5 sm:text-sm"
                                >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    <span>Join KiteLink</span>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            {/* Page Body */}
            <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">{children}</main>

            {/* Public Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-[#070b12]/60 py-8 text-xs text-white/50 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <i className="fas fa-wind text-[#5bb4ff]" />
                        <span className="font-semibold text-slate-300">KiteLink</span>
                        <span>— Discover certified kitesurfing coaches & schools worldwide</span>
                    </div>

                    <div className="flex items-center gap-6 text-slate-400">
                        <Link href={route('instructors.index')} className="transition-colors hover:text-white">
                            Instructors
                        </Link>
                        <Link href="/join" className="transition-colors hover:text-white">
                            Become a Partner
                        </Link>
                        <Link href={route('login')} className="transition-colors hover:text-white">
                            Sign In
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default PublicLayout;
