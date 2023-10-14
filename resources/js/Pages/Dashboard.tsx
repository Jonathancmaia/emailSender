import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';

interface AppData {
    name: string;
    id: string;
}

export default function Dashboard({ auth, apps }: PageProps & { apps: AppData[] }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <Link
                                type="button"
                                href={route('create-app')}
                            >
                                Crie um receptor de lead
                            </Link>
                        </div>

                        <div className="p-6 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row">
                            {apps.map((app, index) => (
                                <Link key={index} className="mt-2 mb-2 flex flex-col basis-1/2"  href={route('edit-app', app.id)}>
                                    <div className="text-xl">
                                        {app.name}
                                    </div>
                                    <div className="text-small">
                                        {app.id}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
