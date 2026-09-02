import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#070b12]/90 px-6 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 cursor-pointer rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full border border-[#5bb4ff]/20 bg-[#5bb4ff]/10 px-2.5 py-1 text-xs font-medium text-[#7bc9ff] sm:inline-flex">
                    <i className="fas fa-wind text-[10px]" />
                    Instructor Portal
                </span>
            </div>
        </header>
    );
}
