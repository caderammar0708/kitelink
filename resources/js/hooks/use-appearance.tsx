import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const applyTheme = (appearance: Appearance) => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
};

export function initializeTheme() {
    const savedAppearance = (localStorage.getItem('appearance') as Appearance) || 'system';

    applyTheme(savedAppearance);

    // Add the event listener for system theme changes...
    mediaQuery.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('appearance') as Appearance) || 'system';
        }
        return 'system';
    });

    const updateAppearance = (mode: Appearance) => {
        setAppearance(mode);
        localStorage.setItem('appearance', mode);
        applyTheme(mode);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('appearance-change', { detail: mode }));
        }
    };

    useEffect(() => {
        const savedAppearance = (localStorage.getItem('appearance') as Appearance | null) || 'system';
        setAppearance(savedAppearance);

        const handleCustomChange = (e: Event) => {
            const customEvent = e as CustomEvent<Appearance>;
            setAppearance(customEvent.detail);
        };

        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'appearance') {
                const newMode = (e.newValue as Appearance) || 'system';
                setAppearance(newMode);
                applyTheme(newMode);
            }
        };

        window.addEventListener('appearance-change', handleCustomChange);
        window.addEventListener('storage', handleStorage);
        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            window.removeEventListener('appearance-change', handleCustomChange);
            window.removeEventListener('storage', handleStorage);
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, []);

    return { appearance, updateAppearance };
}
