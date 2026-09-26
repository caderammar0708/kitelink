import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [], label = 'Menu' }: { items: NavItem[]; label?: string }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="mb-1 px-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const isActive =
                        page.url === item.url ||
                        (item.url !== '/instructor/dashboard' && item.url.includes('#') === false && page.url.startsWith(item.url));

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                className={`rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'border-l-2 border-[#3b82f6] bg-blue-50 font-semibold text-blue-700 shadow-xs dark:bg-gradient-to-r dark:from-[#1f6eff]/20 dark:to-[#5bb4ff]/10 dark:text-[#5bb4ff]'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white'
                                }`}
                            >
                                <Link href={item.url} prefetch className="flex items-center gap-2.5">
                                    {item.icon && (
                                        <item.icon
                                            className={`h-4 w-4 shrink-0 transition-colors ${
                                                isActive ? 'text-blue-600 dark:text-[#5bb4ff]' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                                            }`}
                                        />
                                    )}
                                    <span className="truncate">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
