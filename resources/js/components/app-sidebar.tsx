import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    Briefcase,
    CalendarCheck,
    CalendarDays,
    Compass,
    DollarSign,
    LayoutDashboard,
    MessageSquare,
    Settings,
    Star,
    User,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isInstructor = auth?.user?.role === 'instructor';
    const dashboardUrl = isInstructor ? '/instructor/dashboard' : '/dashboard';

    const mainNavItems: NavItem[] = isInstructor
        ? [
              {
                  title: 'Dashboard',
                  url: '/instructor/dashboard',
                  icon: LayoutDashboard,
              },
              {
                  title: 'My Bookings',
                  url: '/instructor/bookings',
                  icon: CalendarCheck,
              },
              {
                  title: 'Availability',
                  url: '/instructor/availability',
                  icon: CalendarDays,
              },
              {
                  title: 'My Profile',
                  url: '/instructor/profile',
                  icon: User,
              },
              {
                  title: 'Revenue & Earnings',
                  url: '/instructor/revenue',
                  icon: DollarSign,
              },
              {
                  title: 'Student Reviews',
                  url: '/instructor/reviews',
                  icon: Star,
              },
              {
                  title: 'Messages',
                  url: '/instructor/messages',
                  icon: MessageSquare,
              },
              {
                  title: 'School Hire Requests',
                  url: '/instructor/hire-requests',
                  icon: Briefcase,
              },
              {
                  title: 'Browse Instructors',
                  url: '/instructor/browse',
                  icon: Compass,
              },
              {
                  title: 'Notifications',
                  url: '/instructor/notifications',
                  icon: Bell,
              },
              {
                  title: 'Settings',
                  url: '/instructor/settings',
                  icon: Settings,
              },
          ]
        : [
              {
                  title: 'Dashboard',
                  url: '/dashboard',
                  icon: LayoutDashboard,
              },
              {
                  title: 'Find Instructors',
                  url: '/instructors',
                  icon: Compass,
              },
              {
                  title: 'Settings',
                  url: '/settings/profile',
                  icon: Settings,
              },
          ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-white/10 bg-[#070b12] text-slate-200">
            <SidebarHeader className="border-b border-white/10 px-3 py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="rounded-xl transition-colors hover:bg-white/[0.06]">
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 p-2">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;
