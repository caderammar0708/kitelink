import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="border-sidebar-border/30 min-h-screen bg-[#070b12] text-slate-100">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="flex-1 bg-gradient-to-b from-[#070b12] via-[#0a0e1a] to-[#070b12]">{children}</div>
            </AppContent>
        </AppShell>
    );
}
