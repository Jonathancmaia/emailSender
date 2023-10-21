import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

interface AppData {
    name: string;
    id: string;
}

export default function Dashboard({ auth, apps, error }: PageProps & { apps: AppData[],  error?: React.ReactNode }) {

    const [isCopied, setIsCopied] = useState(false);
    const copy = (e: React.MouseEvent, id: string) => {
        e.preventDefault();

        const element = document.getElementById(id);

        if (element) {
            const range = document.createRange();
            range.selectNode(element);
            const selection = window.getSelection();

            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
                
                try {
                    document.execCommand('copy');
                    setIsCopied(true);
                } catch (err) {
                    console.error('Erro ao copiar o texto: ', err);
                }
                
                selection.removeAllRanges();
            }
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            {error && typeof error === 'string' && (
                <div className="mt-5 sm:mx-5 flex full-width sm:rounded text-white bg-red-600 p-5">{error}</div>
            )}

            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <Link
                                type="button"
                                href={route('create-app')}
                            >
                                <PrimaryButton>
                                    Crie um receptor de lead
                                </PrimaryButton>
                            </Link>
                        </div>

                        <div className="p-6 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row">
                            {apps.map((app, index) => (
                                <Link key={index} className="mt-2 mb-2 flex flex-col basis-1/2"  href={route('edit-app', app.id)}>
                                    <div className="text-xl">
                                        {app.name}
                                    </div>
                                    <div className="text-small flex items-center">
                                        <span id={'key' + index}>{app.id}</span>
                                        <span className="flex items-center cursor-pointer" onClick={(e)=>{copy(e, 'key'+index)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy ml-5 mr-1" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
                                            </svg>
                                            {isCopied ? 'Copiado' : 'Copiar'}
                                        </span>
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
