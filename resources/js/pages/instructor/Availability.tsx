import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Calendar as CalendarIcon,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Info,
    Lock,
    Plus,
    Save,
    Trash2,
    User,
    Wind,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface AvailabilitySlot {
    id: number;
    instructor_id: number;
    date: string;
    start_time?: string;
    end_time?: string;
    is_available: boolean;
}

interface ConfirmedBooking {
    id: number;
    date: string;
    time?: string;
    lesson_type?: string;
    student?: { id: number; name: string };
}

interface AvailabilityProps {
    availabilities?: AvailabilitySlot[];
    confirmedBookings?: ConfirmedBooking[];
    month: number;
    year: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Instructor Dashboard',
        href: '/instructor/dashboard',
    },
    {
        title: 'Availability Calendar',
        href: '/instructor/availability',
    },
];

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const PRESET_TIME_SLOTS = [
    { label: 'Morning Session (08:00 - 12:00)', start: '08:00', end: '12:00' },
    { label: 'Afternoon Prime (13:00 - 17:00)', start: '13:00', end: '17:00' },
    { label: 'Sunset Wind (17:00 - 19:00)', start: '17:00', end: '19:00' },
    { label: 'Full Day Wind Window (08:00 - 18:00)', start: '08:00', end: '18:00' },
];

export default function Availability({
    availabilities = [],
    confirmedBookings = [],
    month,
    year,
}: AvailabilityProps) {
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(PRESET_TIME_SLOTS[1]);
    const [customStartTime, setCustomStartTime] = useState('');
    const [customEndTime, setCustomEndTime] = useState('');
    const [statusFilter, setStatusFilter] = useState<'available' | 'unavailable'>('available');

    // Calendar calculation
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 is Sunday

    const navigateMonth = (step: number) => {
        let newMonth = month + step;
        let newYear = year;
        if (newMonth > 12) {
            newMonth = 1;
            newYear++;
        } else if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }
        router.get(route('instructor.availability'), { month: newMonth, year: newYear }, { preserveState: true });
        setSelectedDates([]);
    };

    const toggleDateSelection = (dateStr: string) => {
        if (selectedDates.includes(dateStr)) {
            setSelectedDates(selectedDates.filter((d) => d !== dateStr));
        } else {
            setSelectedDates([...selectedDates, dateStr]);
        }
    };

    const selectAllWeekdays = () => {
        const dates: string[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month - 1, day);
            const dayOfWeek = dateObj.getDay();
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                dates.push(dateStr);
            }
        }
        setSelectedDates(dates);
    };

    const selectEntireMonth = () => {
        const dates: string[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dates.push(dateStr);
        }
        setSelectedDates(dates);
    };

    const clearSelection = () => {
        setSelectedDates([]);
    };

    // Save availability form
    const { post, processing } = useForm();

    const handleSaveAvailability = (isAvailable: boolean) => {
        if (selectedDates.length === 0) return;

        router.post(
            route('instructor.availability.store'),
            {
                dates: selectedDates,
                start_time: customStartTime || selectedTimeSlot.start,
                end_time: customEndTime || selectedTimeSlot.end,
                is_available: isAvailable,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedDates([]);
                },
            }
        );
    };

    // Map bookings and availabilities for fast lookup
    const availabilityMap = useMemo(() => {
        const map: Record<string, AvailabilitySlot[]> = {};
        availabilities.forEach((slot) => {
            const d = slot.date.split('T')[0];
            if (!map[d]) map[d] = [];
            map[d].push(slot);
        });
        return map;
    }, [availabilities]);

    const bookingsMap = useMemo(() => {
        const map: Record<string, ConfirmedBooking[]> = {};
        confirmedBookings.forEach((b) => {
            const d = b.date.split('T')[0];
            if (!map[d]) map[d] = [];
            map[d].push(b);
        });
        return map;
    }, [confirmedBookings]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Availability Calendar - KiteLink" />

            <div className="relative min-h-full space-y-6 p-4 text-slate-100 selection:bg-[#3b82f6]/30 selection:text-white sm:p-6 lg:p-8">
                {/* Header Banner */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            <CalendarIcon className="h-7 w-7 text-[#5bb4ff]" />
                            Availability Calendar
                        </h1>
                        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                            Mark open dates and time slots for student bookings. Confirmed bookings are automatically blocked.
                        </p>
                    </div>

                    {/* Month Navigator */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-2xl border border-white/15 bg-white/[0.06] p-1 shadow-lg backdrop-blur-md">
                            <button
                                type="button"
                                onClick={() => navigateMonth(-1)}
                                className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                                title="Previous Month"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="min-w-[140px] text-center text-sm font-bold text-white">
                                {MONTH_NAMES[month - 1]} {year}
                            </span>
                            <button
                                type="button"
                                onClick={() => navigateMonth(1)}
                                className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                                title="Next Month"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar & Control Panel Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Main Monthly Calendar Grid (8 cols) */}
                    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:col-span-8">
                        {/* Quick Selection Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">Quick Select:</span>
                                <button
                                    type="button"
                                    onClick={selectAllWeekdays}
                                    className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-slate-300 transition hover:bg-white/10"
                                >
                                    Weekdays
                                </button>
                                <button
                                    type="button"
                                    onClick={selectEntireMonth}
                                    className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-slate-300 transition hover:bg-white/10"
                                >
                                    All Month
                                </button>
                                {selectedDates.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearSelection}
                                        className="text-rose-400 hover:underline"
                                    >
                                        Clear ({selectedDates.length})
                                    </button>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Open Slot
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Booked Lesson
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-slate-600" /> Off / Unavailable
                                </span>
                            </div>
                        </div>

                        {/* Days of Week Header */}
                        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-400">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="py-2 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days Matrix */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* Empty offset days */}
                            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[80px] rounded-xl border border-transparent bg-transparent" />
                            ))}

                            {/* Actual Month Days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const dayNum = i + 1;
                                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                const isSelected = selectedDates.includes(dateStr);
                                const dayBookings = bookingsMap[dateStr] || [];
                                const daySlots = availabilityMap[dateStr] || [];
                                const hasBookings = dayBookings.length > 0;
                                const isAvailable = daySlots.some((s) => s.is_available);
                                const isExplicitlyOff = daySlots.some((s) => !s.is_available);

                                return (
                                    <div
                                        key={dateStr}
                                        onClick={() => toggleDateSelection(dateStr)}
                                        className={`group relative flex min-h-[85px] cursor-pointer flex-col justify-between rounded-xl border p-2 transition-all duration-200 sm:min-h-[95px] ${
                                            isSelected
                                                ? 'border-[#5bb4ff] bg-[#1f6eff]/25 ring-2 ring-[#5bb4ff]/50'
                                                : hasBookings
                                                  ? 'border-blue-500/40 bg-blue-950/30 hover:border-blue-400'
                                                  : isAvailable
                                                    ? 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400'
                                                    : isExplicitlyOff
                                                      ? 'border-slate-800 bg-slate-950/40 opacity-60 hover:opacity-100'
                                                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`text-xs font-bold ${
                                                    isSelected
                                                        ? 'text-[#5bb4ff]'
                                                        : hasBookings
                                                          ? 'text-blue-300'
                                                          : isAvailable
                                                            ? 'text-emerald-400'
                                                            : 'text-slate-300'
                                                }`}
                                            >
                                                {dayNum}
                                            </span>

                                            {isSelected && (
                                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#1f6eff] text-[10px] font-bold text-white">
                                                    ✓
                                                </div>
                                            )}
                                        </div>

                                        {/* Status Indicators in Cell */}
                                        <div className="mt-1 space-y-1">
                                            {hasBookings && (
                                                <div className="flex items-center gap-1 rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
                                                    <Lock className="h-2.5 w-2.5" />
                                                    <span className="truncate">{dayBookings[0].student?.name || 'Booked'}</span>
                                                </div>
                                            )}

                                            {!hasBookings && isAvailable && (
                                                <div className="flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                                                    <Wind className="h-2.5 w-2.5" />
                                                    <span>Open</span>
                                                </div>
                                            )}

                                            {!hasBookings && isExplicitlyOff && (
                                                <span className="block text-[10px] text-slate-500">Day Off</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Control & Management Panel (4 cols) */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Slot Setter Card */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                            <h2 className="flex items-center gap-2 text-base font-bold text-white">
                                <Clock className="h-5 w-5 text-[#5bb4ff]" />
                                Set Availability Slot
                            </h2>
                            <p className="mt-1 text-xs text-slate-400">
                                {selectedDates.length > 0
                                    ? `Applying to ${selectedDates.length} selected date(s)`
                                    : 'Select dates on the calendar matrix to update availability'}
                            </p>

                            <div className="mt-5 space-y-4">
                                {/* Preset Time Slots */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                        Time Slot Template
                                    </label>
                                    <div className="mt-2 space-y-2">
                                        {PRESET_TIME_SLOTS.map((slot) => (
                                            <button
                                                type="button"
                                                key={slot.label}
                                                onClick={() => setSelectedTimeSlot(slot)}
                                                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-xs transition ${
                                                    selectedTimeSlot.label === slot.label
                                                        ? 'border-[#5bb4ff]/60 bg-[#1f6eff]/20 text-white font-semibold'
                                                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07]'
                                                }`}
                                            >
                                                <span>{slot.label}</span>
                                                {selectedTimeSlot.label === slot.label && (
                                                    <Check className="h-4 w-4 text-[#5bb4ff]" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2 pt-2">
                                    <button
                                        type="button"
                                        disabled={selectedDates.length === 0 || processing}
                                        onClick={() => handleSaveAvailability(true)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:from-emerald-400 hover:to-teal-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Mark as Available ({selectedDates.length})
                                    </button>

                                    <button
                                        type="button"
                                        disabled={selectedDates.length === 0 || processing}
                                        onClick={() => handleSaveAvailability(false)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <X className="h-4 w-4 text-rose-400" />
                                        Mark as Unavailable / Off
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Confirmed Lessons Widget */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                                <Lock className="h-4 w-4 text-blue-400" />
                                Confirmed Bookings ({confirmedBookings.length})
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-400">
                                Reserved slots for this month
                            </p>

                            <div className="mt-4 space-y-2.5">
                                {confirmedBookings.length === 0 ? (
                                    <p className="py-4 text-center text-xs text-slate-500">
                                        No confirmed bookings yet this month.
                                    </p>
                                ) : (
                                    confirmedBookings.slice(0, 5).map((b) => (
                                        <div
                                            key={b.id}
                                            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-xs font-bold text-blue-300">
                                                    {b.student?.name?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <span className="block font-semibold text-white">
                                                        {b.student?.name || 'Student'}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">{b.date} {b.time ? `• ${b.time}` : ''}</span>
                                                </div>
                                            </div>
                                            <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                                                Confirmed
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
