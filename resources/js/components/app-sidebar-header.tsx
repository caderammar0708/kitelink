import { Breadcrumbs } from '@/components/breadcrumbs';
import { NotificationBell } from '@/components/notification-bell';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;
    const isInstructor = auth?.user?.role === 'instructor';

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200/80 bg-white/85 px-6 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6 dark:border-white/10 dark:bg-[#070b12]/90">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 cursor-pointer rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 sm:inline-flex dark:border-[#5bb4ff]/20 dark:bg-[#5bb4ff]/10 dark:text-[#7bc9ff]">
                    <i className="fas fa-wind text-[10px]" />
                    {isInstructor ? 'Instructor Portal' : 'Client Portal'}
                </span>
                <NotificationBell />
            </div>
        </header>
    );
}
