import SchoolProfileContent, { type ReviewItem, type SchoolData } from '@/components/school-profile-content';
import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/public-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface SchoolProps {
    school: SchoolData;
    reviews?: ReviewItem[];
}

export function Show({ school, reviews = [] }: SchoolProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = !!auth?.user;
    const isSchool = auth?.user?.role === 'school';
    const isInstructor = auth?.user?.role === 'instructor';
    const name = school.name;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: isSchool ? 'School Dashboard' : isInstructor ? 'Instructor Dashboard' : 'Dashboard',
            href: isSchool ? '/school/dashboard' : isInstructor ? '/instructor/dashboard' : '/dashboard',
        },
        {
            title: 'Explore Kite Centers',
            href: '/schools',
        },
        {
            title: name,
            href: `/schools/${school.id}`,
        },
    ];

    const content = (
        <div className={`space-y-8 sm:space-y-10 ${isAuthenticated ? 'p-4 sm:p-6 lg:p-8' : 'mx-auto max-w-7xl'}`}>
            <SchoolProfileContent school={school} reviews={reviews} />
        </div>
    );

    if (isAuthenticated) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${name} - Packages & Courses - KiteLink`} />
                {content}
            </AppLayout>
        );
    }

    return (
        <PublicLayout>
            <Head title={`${name} - Packages & Courses - KiteLink`} />
            {content}
        </PublicLayout>
    );
}

export default Show;
