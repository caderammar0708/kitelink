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
    CloudSun,
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
                  title: 'Weather & Wind',
                  url: '/instructor/weather',
                  icon: CloudSun,
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
                  title: 'Weather & Wind',
                  url: '/client/weather',
                  icon: CloudSun,
              },
              {
                  title: 'My Bookings',
                  url: '/client/bookings',
                  icon: CalendarCheck,
              },
              {
                  title: 'Messages',
                  url: '/client/messages',
                  icon: MessageSquare,
              },
              {
                  title: 'Settings',
                  url: '/client/settings',
                  icon: Settings,
              },
          ];

    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-slate-200/80 bg-white text-slate-800 transition-colors duration-200 dark:border-white/10 dark:bg-[#070b12] dark:text-slate-200">
            <SidebarHeader className="border-b border-slate-200/80 px-3 py-3 dark:border-white/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-white/[0.06]">
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2">
                <NavMain items={mainNavItems} label={isInstructor ? 'Instructor Menu' : 'Main Menu'} />
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-200/80 p-2 dark:border-white/10">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;
