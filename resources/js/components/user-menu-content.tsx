import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';

export interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const isInstructor = (user as any)?.role === 'instructor';

    return (
        <div className="rounded-xl border border-white/10 bg-[#0a0e1a] p-1 text-slate-200 shadow-xl">
            <DropdownMenuLabel className="p-2 font-normal">
                <div className="flex items-center gap-2 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-white/10" />
            <DropdownMenuGroup>
                {isInstructor && (
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-white/[0.08] hover:text-white">
                        <Link
                            className="flex w-full items-center px-2 py-1.5 text-sm"
                            href="/instructor/profile"
                            as="button"
                            prefetch
                            onClick={cleanup}
                        >
                            <UserIcon className="mr-2 h-4 w-4 text-[#5bb4ff]" />
                            My Profile
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-white/[0.08] hover:text-white">
                    <Link
                        className="flex w-full items-center px-2 py-1.5 text-sm"
                        href={route('profile.edit')}
                        as="button"
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2 h-4 w-4 text-slate-400" />
                        Account Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1 bg-white/10" />
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg text-rose-400 hover:bg-rose-500/15 hover:text-rose-300">
                <Link className="flex w-full items-center px-2 py-1.5 text-sm" method="post" href={route('logout')} as="button" onClick={cleanup}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </div>
    );
}

export default UserMenuContent;
