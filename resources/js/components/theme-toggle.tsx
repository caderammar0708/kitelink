import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ThemeToggleProps {
    className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
    const { appearance, updateAppearance } = useAppearance();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Determine whether currently dark or light
    // In dark theme: documentElement has 'dark' or appearance is 'dark' or system prefers dark
    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' &&
            (typeof window !== 'undefined'
                ? window.matchMedia('(prefers-color-scheme: dark)').matches
                : false));

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        // Single click toggle: if dark -> switch to light, if light -> switch to dark
        const nextMode = isDark ? 'light' : 'dark';
        updateAppearance(nextMode);
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            className={cn(
                'group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-white hover:text-slate-900 focus:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:text-white active:scale-95',
                className,
            )}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {/* Show Sun when currently in Dark Mode, Moon when currently in Light Mode */}
            {mounted && isDark ? (
                <Sun className="h-4 w-4 text-amber-400 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110" />
            ) : (
                <Moon className="h-4 w-4 text-slate-700 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110 dark:text-slate-300" />
            )}
        </button>
    );
}

export default ThemeToggle;
