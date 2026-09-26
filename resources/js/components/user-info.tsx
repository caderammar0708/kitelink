import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user?: User | null; showEmail?: boolean }) {
    const getInitials = useInitials();
    const avatarUrl = user?.avatar || (user as any)?.profile_picture;

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 shadow-sm dark:border-white/15">
                <AvatarImage src={avatarUrl} alt={user?.name || 'User'} className="object-cover" />
                <AvatarFallback className="rounded-full bg-gradient-to-br from-[#1f6eff] to-[#5bb4ff] text-white font-bold text-xs">
                    {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-slate-800 dark:text-slate-200">{user?.name || 'Guest'}</span>
                {showEmail && <span className="text-slate-500 truncate text-xs dark:text-slate-400">{user?.email || ''}</span>}
            </div>
        </>
    );
}

export default UserInfo;
