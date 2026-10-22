import React from 'react';

export function TechBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
            {/* Dynamic radial gradient light spots */}
            <div className="absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-400/20 via-blue-600/20 to-indigo-500/20 blur-[130px] dark:from-sky-500/15 dark:via-blue-600/25 dark:to-indigo-500/20" />
            <div className="absolute top-[35%] -left-40 h-[500px] w-[600px] rounded-full bg-cyan-400/15 blur-[120px] dark:bg-cyan-500/10" />
            <div className="absolute top-[60%] -right-40 h-[550px] w-[600px] rounded-full bg-indigo-400/15 blur-[120px] dark:bg-indigo-600/10" />
            <div className="absolute -bottom-20 left-1/3 h-[400px] w-[700px] rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-600/10" />

            {/* Subtle tech micro-grid overlay with radial fade */}
            <div className="tech-grid-bg absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] dark:opacity-35" />
        </div>
    );
}

export default TechBackground;
