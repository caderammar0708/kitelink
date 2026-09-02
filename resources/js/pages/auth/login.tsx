import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, ReactNode, useState } from 'react';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in - KiteLink" />

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-300 sm:p-8">
                {/* Header with Logo */}
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

                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Log in to your account</h1>
                    <p className="mt-1.5 text-sm text-slate-300/80">Enter your email and password below to log in</p>
                </div>

                {status && (
                    <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-center text-xs font-medium text-emerald-300">
                        {status}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={submit} className="space-y-4">
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
                                autoFocus
                                tabIndex={1}
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
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                Password
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    tabIndex={5}
                                    className="text-xs font-medium text-[#5bb4ff] underline-offset-4 transition-colors hover:text-[#8acbff] hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
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

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center space-x-2.5 pt-0.5">
                        <label htmlFor="remember" className="relative flex cursor-pointer items-center gap-2.5 select-none">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="flex h-4 w-4 items-center justify-center rounded-md border border-white/20 bg-slate-950/60 transition-all duration-200 peer-checked:border-[#3b82f6] peer-checked:bg-[#2563eb] peer-focus:ring-2 peer-focus:ring-[#3b82f6]/40">
                                    <svg
                                        className={`h-3 w-3 text-white transition-opacity duration-150 ${data.remember ? 'opacity-100' : 'opacity-0'}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-xs text-slate-300 transition-colors hover:text-white">Remember me</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            tabIndex={4}
                            className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-[1.01] hover:from-[#5bb4ff] hover:to-[#2e7bff] hover:shadow-blue-500/50 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 sm:text-base"
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="h-5 w-5 animate-spin text-white" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Log in</span>
                                    <i className="fas fa-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Sign up Link */}
                    <div className="pt-2 text-center text-sm text-slate-300">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            tabIndex={6}
                            className="font-semibold text-[#5bb4ff] underline-offset-4 transition-colors hover:text-[#8acbff] hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

Login.layout = (page: ReactNode) => (
    <AuthLayout
        headerRight={
            <Link
                href={route('register')}
                className="rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/[0.14] hover:text-white sm:text-sm"
            >
                Sign up
            </Link>
        }
    >
        {page}
    </AuthLayout>
);

export default Login;
