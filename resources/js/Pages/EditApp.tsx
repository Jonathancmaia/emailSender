import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import InputMask from "react-input-mask";
import Lead from '../Components/Lead';
import { Link } from '@inertiajs/react';

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
        phone: app.phone || ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('alter-app'));
    };

    const deleteApp: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('delete-app'));
    }

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

                                    <InputMask
                                        mask={data.phone ? (data.phone.length === 15 ? '99 99 9999-9999' : '99 99 9999-99999') : ''}
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        value={data.phone}
                                        className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />

                                    <InputError message={errors.phone} className="mt-2" />
                                </div>

                                <div className="flex row justify-between mt-4">

                                    <PrimaryButton disabled={processing}>
                                        Salvar
                                    </PrimaryButton>

                                    <DangerButton disabled={processing} onClick={(e) => { deleteApp(e) }}>
                                        Excluir App
                                    </DangerButton>
                                </div>
                            </form>
                        </div>

                        {/* Leads list */}
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1 className="mb-5">
                                Leads
                            </h1>
                            <div className="flex flex-col md:flex-row md:justify-around">
                                <div className="flex flex-row md:flex-col">
                                    <div>Recebidos</div>
                                    {leads.map((lead, index) => (
                                        <div key={index} className="rounded border-2 p-2">
                                            <div className="flex justify-between items-center m-1">
                                                <div>#{lead.id}</div>
                                                <Link href={route('delete-lead', { id: lead.id })}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                            <Lead data={lead.data} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-row md:flex-col">
                                    <div>Em contato</div>
                                </div>
                                <div className="flex flex-row md:flex-col">
                                    <div>Convertidos</div>
                                </div>
                                <div className="flex flex-row md:flex-col">
                                    <div>Não convertidos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}