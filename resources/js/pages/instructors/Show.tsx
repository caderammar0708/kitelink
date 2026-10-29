import InstructorProfileContent, { type BookingItem, type InstructorData } from '@/components/instructor-profile-content';
import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/public-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface InstructorProps {
    instructor: InstructorData;
    existingBooking?: BookingItem | null;
}

export function Show({ instructor, existingBooking = null }: InstructorProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;
    const isInstructor = auth?.user?.role === 'instructor';
    const name = instructor.user?.name || 'Instructor';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: isInstructor ? 'Instructor Dashboard' : 'Dashboard',
            href: isInstructor ? '/instructor/dashboard' : '/dashboard',
        },
        {
            title: 'Find Instructors',
            href: '/instructors',
        },
        {
            title: name,
            href: `/instructors/${instructor.id}`,
        },
    ];

    const content = (
        <div className={`space-y-8 sm:space-y-10 ${isAuthenticated ? 'p-4 sm:p-6 lg:p-8' : 'mx-auto max-w-7xl'}`}>
            <InstructorProfileContent instructor={instructor} existingBooking={existingBooking} />
        </div>
    );

    if (isAuthenticated) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${name} - Certified Kitesurf Instructor | Winduo`} />
                {content}
            </AppLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title={`${name} - Certified Kitesurf Instructor | Winduo`} />
            {content}
        </PublicLayout>
    );
}

export default Show;
