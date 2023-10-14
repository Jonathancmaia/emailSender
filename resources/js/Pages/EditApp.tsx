import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

import { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

import Lead from '../Components/Lead';

interface AppData {
    id: string,
    name: string;
    email: string;
    phone: string;
}

interface LeadData{
    id: number,
    data: string
}

export default function Dashboard({ auth, app, leads }: PageProps & { app: AppData } & {leads: LeadData[]}) {
    const { data, setData, post, processing, errors } = useForm({
        id: app.id,
        name: app.name,
        email: app.email,
        phone: app.phone
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('alter-app'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">App {app.name}</h2>}
        >
            <Head title={"App "+app.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        
                        {/* Edit app form */}
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1 className="mb-5">
                                Editar App
                            </h1>
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="name" value="Nome" />

                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />

                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="email" value="Email" />

                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />

                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="phone" value="Telefone" />

                                    <TextInput
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        value={data.phone}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />

                                    <InputError message={errors.phone} className="mt-2" />
                                </div>

                                <div className="flex items-center mt-4">

                                    <PrimaryButton disabled={processing}>
                                        Salvar
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

                        {/* Leads list */}
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1 className="mb-5">
                                Leads
                            </h1>
                            <div className="flex flex-col md:flex-row md:justify-around">
                                {leads.map((lead, index) => (
                                    <div key={index}>
                                        <div>
                                            #{lead.id}
                                        </div>
                                        <Lead data={lead.data} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}