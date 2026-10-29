import Logo from '@/components/logo';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, ReactNode, useState } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

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
            <Head title="Log in - Winduo" />

            <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-300 sm:p-8 dark:border-white/10 dark:bg-white/[0.07] dark:shadow-2xl dark:shadow-black/60">
                {/* Header with Logo */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <Link
                        href={route('home')}
                        className="mb-4 inline-flex items-center transition-transform duration-300 hover:scale-105"
                    >
                        <Logo size="lg" />
                    </Link>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">Log in to your account</h1>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300/80">Enter your email and password below to log in</p>
                </div>

                {status && (
                    <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-center text-xs font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {status}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={submit} className="space-y-4">
                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
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
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-2xs backdrop-blur-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50 dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-400/50 dark:hover:border-white/25 dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                            />
                        </div>
                        {errors.email && (
                            <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-50 px-2.5 py-1 text-xs text-rose-700 backdrop-blur-sm dark:bg-rose-950/40 dark:text-rose-300">
                                <i className="fas fa-exclamation-circle shrink-0 text-xs text-rose-500 dark:text-rose-400" />
                                <span>{errors.email}</span>
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-xs font-semibold tracking-wide text-slate-700 uppercase dark:text-slate-200">
                                Password
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    tabIndex={5}
                                    className="text-xs font-medium text-blue-600 underline-offset-4 transition-colors hover:text-blue-700 hover:underline dark:text-[#5bb4ff] dark:hover:text-[#8acbff]"
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
                                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pr-10 pl-4 text-sm text-slate-900 placeholder-slate-400 shadow-2xs backdrop-blur-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50 dark:border-white/15 dark:bg-slate-950/40 dark:text-white dark:placeholder-slate-400/50 dark:hover:border-white/25 dark:focus:border-[#3b82f6] dark:focus:ring-[#3b82f6]/40"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600 focus:outline-none dark:hover:text-slate-200"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-50 px-2.5 py-1 text-xs text-rose-700 backdrop-blur-sm dark:bg-rose-950/40 dark:text-rose-300">
                                <i className="fas fa-exclamation-circle shrink-0 text-xs text-rose-500 dark:text-rose-400" />
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
                                <div className="flex h-4 w-4 items-center justify-center rounded-md border border-slate-300 bg-white transition-all duration-200 peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500/30 dark:border-white/20 dark:bg-slate-950/60 dark:peer-checked:border-[#3b82f6] dark:peer-checked:bg-[#2563eb] dark:peer-focus:ring-[#3b82f6]/40">
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
                            <span className="text-xs text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Remember me</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            tabIndex={4}
                            className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-500/40 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 sm:text-base dark:from-[#4ba9ff] dark:to-[#1f6eff] dark:shadow-blue-600/30 dark:hover:from-[#5bb4ff] dark:hover:to-[#2e7bff]"
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
                    <div className="pt-2 text-center text-sm text-slate-600 dark:text-slate-300">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            tabIndex={6}
                            className="font-semibold text-blue-600 underline-offset-4 transition-colors hover:text-blue-700 hover:underline dark:text-[#5bb4ff] dark:hover:text-[#8acbff]"
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
                className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs backdrop-blur-md transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 sm:text-sm dark:border-white/15 dark:bg-white/[0.07] dark:text-slate-200 dark:hover:bg-white/[0.14] dark:hover:text-white"
            >
                Sign up
            </Link>
        }
    >
        {page}
    </AuthLayout>
);

export default Login;
