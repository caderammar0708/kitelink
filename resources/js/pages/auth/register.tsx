import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Award, Building2, Eye, EyeOff, FileText, LoaderCircle, Lock, Mail, MapPin, Phone, ShieldCheck, Sparkles, User } from 'lucide-react';
import { FormEventHandler, ReactNode, useState } from 'react';

interface RegisterForm {
    name: string;
    school_name: string;
    registration_number: string;
    contact_name: string;
    email: string;
    phone: string;
    license_number: string;
    location: string;
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
        school_name: '',
        registration_number: '',
        contact_name: '',
        email: '',
        phone: '',
        license_number: '',
        location: '',
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
            <Head title={isSchool ? 'School Registration - KiteLink' : isInstructor ? 'Instructor Registration - KiteLink' : 'Create an Account - KiteLink'} />

            <div className={`w-full ${isSchool ? 'max-w-xl' : 'max-w-md'} rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-300 sm:p-8`}>
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
                        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[rgba(91,180,255,0.25)] bg-[rgba(91,180,255,0.12)] px-3.5 py-1 text-xs font-semibold tracking-wider text-[#b0daff] uppercase shadow-sm backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5 text-[#7bc9ff]" />
                            <span>Instructor Application</span>
                        </div>
                    )}

                    {isSchool && (
                        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.12)] px-3.5 py-1 text-xs font-semibold tracking-wider text-[#e9d5ff] uppercase shadow-sm backdrop-blur-md">
                            <Building2 className="h-3.5 w-3.5 text-[#c084fc]" />
                            <span>Kite School Registration</span>
                        </div>
                    )}

                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {isSchool
                            ? 'Register Your Kite Center'
                            : isInstructor
                              ? 'Join as an Instructor'
                              : 'Create an account'}
                    </h1>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-300/80 max-w-sm">
                        {isSchool
                            ? 'Quick application for kite schools and centers. Full profile, gear, and roster setup opens after approval.'
                            : isInstructor
                              ? 'Quick signup for certified coaches. You can set rates, spots, and bio once approved.'
                              : 'Enter your details below to get started with KiteLink'}
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={submit} className="space-y-4">
                    <input type="hidden" name="role" value={data.role} />

                    {/* SCHOOL SPECIFIC FIELDS */}
                    {isSchool ? (
                        <>
                            {/* School / Business Name */}
                            <div className="space-y-1.5">
                                <label htmlFor="school_name" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                    School / Business Name
                                </label>
                                <div className="relative">
                                    <Building2 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        id="school_name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        value={data.school_name}
                                        onChange={(e) => {
                                            setData((prev) => ({
                                                ...prev,
                                                school_name: e.target.value,
                                                name: e.target.value,
                                            }));
                                        }}
                                        disabled={processing}
                                        placeholder="e.g. Kite Paradise Tarifa"
                                        className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                                    />
                                </div>
                                {errors.school_name && (
                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-rose-300">
                                        <span>{errors.school_name}</span>
                                    </div>
                                )}
                            </div>

                            {/* Business Registration Number & Contact Person Name (2 columns on sm+) */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label htmlFor="registration_number" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                        Business Reg. No.
                                    </label>
                                    <div className="relative">
                                        <FileText className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            id="registration_number"
                                            type="text"
                                            required
                                            tabIndex={2}
                                            value={data.registration_number}
                                            onChange={(e) => setData('registration_number', e.target.value)}
                                            disabled={processing}
                                            placeholder="e.g. REG-984210"
                                            className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                                        />
                                    </div>
                                    {errors.registration_number && (
                                        <div className="mt-1 text-xs text-rose-300">{errors.registration_number}</div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="contact_name" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                        Contact Person Name
                                    </label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            id="contact_name"
                                            type="text"
                                            required
                                            tabIndex={3}
                                            value={data.contact_name}
                                            onChange={(e) => setData('contact_name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Full name of director/manager"
                                            className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                                        />
                                    </div>
                                    {errors.contact_name && (
                                        <div className="mt-1 text-xs text-rose-300">{errors.contact_name}</div>
                                    )}
                                </div>
                            </div>

                            {/* Email Address & Phone Number (2 columns on sm+) */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={4}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="contact@school.com"
                                            className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                                        />
                                    </div>
                                    {errors.email && (
                                        <div className="mt-1 text-xs text-rose-300">{errors.email}</div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="phone" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            id="phone"
                                            type="tel"
                                            required
                                            tabIndex={5}
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            disabled={processing}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <div className="mt-1 text-xs text-rose-300">{errors.phone}</div>
                                    )}
                                </div>
                            </div>

                            {/* Location (city/area) */}
                            <div className="space-y-1.5">
                                <label htmlFor="location" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                    Location (City / Area)
                                </label>
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        id="location"
                                        type="text"
                                        required
                                        tabIndex={6}
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        disabled={processing}
                                        placeholder="e.g. Tarifa, Cadiz, Spain"
                                        className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                                    />
                                </div>
                                {errors.location && (
                                    <div className="mt-1 text-xs text-rose-300">{errors.location}</div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* INSTRUCTOR & CLIENT FIELDS */
                        <>
                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                                        className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                                    />
                                </div>
                                {errors.name && (
                                    <div className="mt-1 text-xs text-rose-300">{errors.name}</div>
                                )}
                            </div>

                            {/* Email Address */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                                        className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                                    />
                                </div>
                                {errors.email && (
                                    <div className="mt-1 text-xs text-rose-300">{errors.email}</div>
                                )}
                            </div>

                            {/* Phone Number (for Instructor) */}
                            {isInstructor && (
                                <div className="space-y-1.5">
                                    <label htmlFor="phone" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            id="phone"
                                            type="tel"
                                            required
                                            tabIndex={3}
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            disabled={processing}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                                        />
                                    </div>
                                    {errors.phone && (
                                        <div className="mt-1 text-xs text-rose-300">{errors.phone}</div>
                                    )}
                                </div>
                            )}

                            {/* Certification / License Number (for Instructor) */}
                            {isInstructor && (
                                <div className="space-y-1.5">
                                    <label htmlFor="license_number" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                        Certification / License Number <span className="text-rose-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Award className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            id="license_number"
                                            type="text"
                                            required
                                            tabIndex={4}
                                            value={data.license_number}
                                            onChange={(e) => setData('license_number', e.target.value)}
                                            disabled={processing}
                                            placeholder="e.g. IKO-123456 or VDWS-654321"
                                            className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Your IKO, VDWS, or equivalent kitesurf instructor certification ID — used by our team to verify your credentials.
                                    </p>
                                    {errors.license_number && (
                                        <div className="mt-1 text-xs text-rose-300">{errors.license_number}</div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* PASSWORDS (SHARED) */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    tabIndex={7}
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
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
                                <div className="mt-1 text-xs text-rose-300">{errors.password}</div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="password_confirmation" className="block text-xs font-medium tracking-wide text-slate-200 uppercase">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    tabIndex={8}
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-white/15 bg-slate-950/40 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400/50 backdrop-blur-sm transition-all duration-200 hover:border-white/25 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/40 focus:outline-none disabled:opacity-50"
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
                                <div className="mt-1 text-xs text-rose-300">{errors.password_confirmation}</div>
                            )}
                        </div>
                    </div>

                    {/* Notice for Instructors & Schools about Approval Workflow */}
                    {(isInstructor || isSchool) && (
                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-200/90 backdrop-blur-sm">
                            <div className="flex items-start gap-2">
                                <ShieldCheck className="h-4 w-4 shrink-0 text-blue-400 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-white">Verification Step:</span>{' '}
                                    {isSchool
                                        ? 'Your application will be submitted for admin verification. Once verified, you will gain full access to configure your school profile, gear, and instructor roster.'
                                        : 'Your instructor application will be submitted for verification. Once approved, you can complete your certifications, bio, and lesson rates.'}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            tabIndex={9}
                            className={`group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 sm:text-base ${
                                isSchool
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 shadow-purple-600/30 hover:from-purple-400 hover:to-indigo-500 hover:shadow-purple-500/50'
                                    : 'bg-gradient-to-r from-[#4ba9ff] to-[#1f6eff] shadow-blue-600/30 hover:from-[#5bb4ff] hover:to-[#2e7bff] hover:shadow-blue-500/50'
                            }`}
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="h-5 w-5 animate-spin text-white" />
                                    <span>Submitting Application...</span>
                                </>
                            ) : (
                                <>
                                    <span>
                                        {isSchool
                                            ? 'Submit School Application'
                                            : isInstructor
                                              ? 'Submit Instructor Application'
                                              : 'Create account'}
                                    </span>
                                    <i className="fas fa-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Already have an account */}
                    <div className="pt-2 text-center text-xs sm:text-sm text-slate-300">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            tabIndex={10}
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
