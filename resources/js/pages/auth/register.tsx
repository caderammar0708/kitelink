import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, ReactNode, useState } from 'react';

interface RegisterForm {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
}

interface RegisterProps {
    role?: string;
}

export function Register({ role }: RegisterProps) {
    const queryRole = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('role') : null;
    const initialRole = role || queryRole || 'client';

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: initialRole,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const isInstructor = data.role === 'instructor' || role === 'instructor' || queryRole === 'instructor';
    const isSchool = data.role === 'school' || role === 'school' || queryRole === 'school';

    return (
        <>
            <Head title="Create an account - KiteLink" />

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-300 sm:p-8">
                {/* Header with Logo & Role Badge */}
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

                    {isInstructor && (
                        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[rgba(91,180,255,0.25)] bg-[rgba(91,180,255,0.12)] px-3 py-1 text-xs font-semibold tracking-wider text-[#b0daff] uppercase shadow-sm backdrop-blur-md">
                            <i className="fas fa-user-astronaut text-xs text-[#7bc9ff]" />
                            <span>Registering as Instructor</span>
                        </div>
                    )}

                    {isSchool && (
                        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[rgba(91,180,255,0.25)] bg-[rgba(91,180,255,0.12)] px-3 py-1 text-xs font-semibold tracking-wider text-[#b0daff] uppercase shadow-sm backdrop-blur-md">
                            <i className="fas fa-school text-xs text-[#7bc9ff]" />
                            <span>Registering as Kite School</span>
                        </div>
                    )}

                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Create an account</h1>
                    <p className="mt-1.5 text-sm text-slate-300/80">
                        {isInstructor
                            ? 'Join KiteLink as an instructor to list your lessons and spots'
                            : isSchool
                              ? 'Join KiteLink to list your kite center and team of instructors'
                              : 'Enter your details below to get started with KiteLink'}
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={submit} className="space-y-4">
                    <input type="hidden" name="role" value={data.role} />

                    {/* Name Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                            Name
                        </label>
                        <div className="relative">
                            <input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Your full name"
                                className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                            />
                        </div>
                        {errors.name && (
                            <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-950/40 px-2.5 py-1 text-xs text-rose-300 backdrop-blur-sm">
                                <i className="fas fa-exclamation-circle shrink-0 text-xs text-rose-400" />
                                <span>{errors.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="name@example.com"
                                className="w-full rounded-xl border border-white/15 bg-slate-950/40 px-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                            />
                        </div>
                        {errors.email && (
                            <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-950/40 px-2.5 py-1 text-xs text-rose-300 backdrop-blur-sm">
                                <i className="fas fa-exclamation-circle shrink-0 text-xs text-rose-400" />
                                <span>{errors.email}</span>
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-white/15 bg-slate-950/40 py-2.5 pr-10 pl-4 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-200 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-950/40 px-2.5 py-1 text-xs text-rose-300 backdrop-blur-sm">
                                <i className="fas fa-exclamation-circle shrink-0 text-xs text-rose-400" />
                                <span>{errors.password}</span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="password_confirmation" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-white/15 bg-slate-950/40 py-2.5 pr-10 pl-4 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1}
                                aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-200 focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-950/40 px-2.5 py-1 text-xs text-rose-300 backdrop-blur-sm">
                                <i className="fas fa-exclamation-circle shrink-0 text-xs text-rose-400" />
                                <span>{errors.password_confirmation}</span>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            tabIndex={5}
                            className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.01] hover:from-[#5bb4ff] hover:to-[#2e7bff] hover:shadow-blue-500/50 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 sm:text-base"
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="h-5 w-5 animate-spin text-white" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create account</span>
                                    <i className="fas fa-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Already have an account */}
                    <div className="pt-2 text-center text-sm text-slate-300">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            tabIndex={6}
                            className="font-semibold text-[#5bb4ff] underline-offset-4 transition-colors hover:text-[#8acbff] hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

Register.layout = (page: ReactNode) => (
    <AuthLayout
        headerRight={
            <Link
                href={route('login')}
                className="rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/[0.14] hover:text-white sm:text-sm"
            >
                Sign in
            </Link>
        }
    >
        {page}
    </AuthLayout>
);

export default Register;
