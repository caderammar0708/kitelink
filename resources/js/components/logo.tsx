import { Link } from '@inertiajs/react';
import { type HTMLAttributes } from 'react';

export const WINDUO_LOGO_PATH = '/logo/winduo-logo.png';
export const WINDUO_LOGO_ALT = 'Winduo';

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'gradient' | 'solid';
    subtitle?: string;
    showWordmark?: boolean;
    withContainer?: boolean;
    asLink?: boolean;
    href?: string;
    textClassName?: string;
    imageClassName?: string;
}

export function Logo({
    size = 'md',
    variant = 'gradient',
    subtitle,
    showWordmark = true,
    withContainer = false,
    asLink = false,
    href = '/',
    className = '',
    textClassName = '',
    imageClassName = '',
    ...props
}: LogoProps) {
    const sizeConfig = {
        sm: {
            box: 'size-8',
            img: 'h-6 w-6',
            text: 'text-base',
            gap: 'gap-2',
            subText: 'text-[9px]',
        },
        md: {
            box: 'size-10',
            img: 'h-8 w-8',
            text: 'text-xl',
            gap: 'gap-2.5',
            subText: 'text-[10px]',
        },
        lg: {
            box: 'size-12',
            img: 'h-10 w-10',
            text: 'text-2xl',
            gap: 'gap-3',
            subText: 'text-xs',
        },
    }[size];

    const wordmarkColors =
        variant === 'gradient'
            ? 'bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-600 bg-clip-text text-transparent dark:from-[#c2e7ff] dark:via-[#8acbff] dark:to-[#60a5fa]'
            : 'text-slate-900 dark:text-white';

    const content = (
        <div className={`group inline-flex items-center ${sizeConfig.gap} ${className}`} {...props}>
            {withContainer ? (
                <div
                    className={`relative flex ${sizeConfig.box} items-center justify-center rounded-xl border border-blue-200/80 bg-white/90 p-1 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/20 dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_0_15px_rgba(59,130,246,0.25)]`}
                >
                    <img
                        src={WINDUO_LOGO_PATH}
                        alt={WINDUO_LOGO_ALT}
                        className={`object-contain transition-transform duration-300 group-hover:rotate-6 ${sizeConfig.img} ${imageClassName}`}
                        loading="eager"
                    />
                </div>
            ) : (
                <div className={`relative flex ${sizeConfig.box} shrink-0 items-center justify-center`}>
                    <img
                        src={WINDUO_LOGO_PATH}
                        alt={WINDUO_LOGO_ALT}
                        className={`h-full w-full object-contain drop-shadow-[0_2px_10px_rgba(59,130,246,0.3)] transition-transform duration-300 group-hover:scale-105 ${imageClassName}`}
                        loading="eager"
                    />
                </div>
            )}

            {showWordmark && (
                <div className="flex flex-col text-left leading-none">
                    <span className={`font-extrabold tracking-tight ${sizeConfig.text} ${wordmarkColors} ${textClassName}`}>
                        Winduo
                    </span>
                    {subtitle && (
                        <span className={`mt-0.5 font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400 ${sizeConfig.subText}`}>
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    if (asLink) {
        return (
            <Link href={href} className="inline-flex cursor-pointer transition-transform duration-300 hover:scale-[1.02] focus:outline-none">
                {content}
            </Link>
        );
    }

    return content;
}

export default Logo;

