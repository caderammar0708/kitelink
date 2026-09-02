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
            className="relative w-full overflow-x-hidden bg-[#070b12] font-sans text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white"
            style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', minHeight: '100vh' }}
        >
            {/* Persistent Ocean/Kitesurf Background Image */}
            <img
                src="https://media.istockphoto.com/id/588369448/photo/kite-surfing-man-in-the-caribbean.jpg?s=1024x1024&w=is&k=20&c=jFqNdOMzlvtr-0QOAspQHODed554keOuClit63vzl2M="
                alt="Kitesurfing Background"
                className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover brightness-[0.40] contrast-[1.08] saturate-[1.25]"
            />

            {/* Persistent Dark Radial Gradient Overlay */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{
                    background: 'radial-gradient(circle at 30% 20%, rgba(0, 30, 60, 0.78) 0%, rgba(7, 11, 18, 0.94) 100%)',
                }}
            />

            {/* Top Navbar / Branding */}
            <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
                <Link href={route('home')} className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#5bb4ff]/40 bg-gradient-to-br from-[#1f6eff]/30 to-[#5bb4ff]/15 shadow-[0_0_12px_rgba(91,180,255,0.3)]">
                        <i className="fas fa-wind text-lg text-[#5bb4ff] drop-shadow-[0_0_8px_rgba(91,180,255,0.6)] transition-transform group-hover:rotate-6" />
                    </div>
                    <span className="bg-gradient-to-r from-[#b8e6ff] via-[#8acbff] to-[#4da6ff] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
                        KiteLink
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    {headerRight || (
                        <Link
                            href={route('login')}
                            className="rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/[0.14] hover:text-white sm:text-sm"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </header>

            {/* Main Centered Content Container — grid row fills remaining height */}
            <main className="relative z-10 flex w-full items-center justify-center px-4 py-8 sm:px-6">
                {title ? (
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-300 sm:p-8">
                        <div className="mb-6 flex flex-col items-center text-center">
                            <Link
                                href={route('home')}
                                className="group mb-4 inline-flex items-center gap-2.5 transition-transform duration-300 hover:scale-105"
                            >
                                <i className="fas fa-wind text-3xl text-[#5bb4ff] drop-shadow-[0_0_14px_rgba(91,180,255,0.7)] transition-transform group-hover:rotate-6" />
                                <span className="bg-gradient-to-r from-[#b8e6ff] via-[#8acbff] to-[#4da6ff] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
                                    KiteLink
                                </span>
                            </Link>

                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
                            {description && <p className="mt-1.5 text-sm text-slate-300/80">{description}</p>}
                        </div>
                        {children}
                    </div>
                ) : (
                    children
                )}
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-5 text-center text-xs text-white/40">
                <p>
                    <i className="fas fa-wind mr-1 text-[#5bb4ff]" /> KiteLink — Discover certified kitesurfing instructors &amp; premier kite centers
                    worldwide
                </p>
            </footer>
        </div>
    );
}

export default AuthLayout;
