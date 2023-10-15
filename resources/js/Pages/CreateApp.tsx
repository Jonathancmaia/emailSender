import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

import { FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

import InputMask from 'react-input-mask';

export default function Dashboard({ auth }: PageProps) {

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('save-app'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Crie um receptor de lead</h2>}
        >
            <Head title="Crie um receptor de lead" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
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
                                        mask={data.phone.length == 15 ? '99 99 9999-99999' : '99 99 9999-99999'}
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        value={data.phone}
                                        className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}