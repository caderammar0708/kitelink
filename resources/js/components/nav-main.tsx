import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="mb-1 px-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Instructor Menu
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
                                        ? 'border-l-2 border-[#3b82f6] bg-gradient-to-r from-[#1f6eff]/20 to-[#5bb4ff]/10 font-semibold text-[#5bb4ff] shadow-sm'
                                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                                }`}
                            >
                                <Link href={item.url} prefetch className="flex items-center gap-2.5">
                                    {item.icon && (
                                        <item.icon
                                            className={`h-4 w-4 shrink-0 transition-colors ${
                                                isActive ? 'text-[#5bb4ff]' : 'text-slate-400 group-hover:text-slate-200'
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
