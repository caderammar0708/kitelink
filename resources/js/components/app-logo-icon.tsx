import { WINDUO_LOGO_ALT, WINDUO_LOGO_PATH } from '@/components/logo';
import { type ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className = '', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src={WINDUO_LOGO_PATH}
            alt={WINDUO_LOGO_ALT}
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
