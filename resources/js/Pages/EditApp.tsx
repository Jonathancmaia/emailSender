import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { FormEventHandler, useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Accordion from '@/Components/Accordion';
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
    data: string,
    step: number;
}

interface GroupedLeads {
  [key: number]: LeadData[];
}

export default function Dashboard({ auth, app, leads }: PageProps & { app: AppData } & {leads: LeadData[]}) {
    const { data, setData, post, processing, errors } = useForm({
        id: app.id,
        name: app.name,
        email: app.email,
        phone: app.phone || ''
    });

    const [allLeads, setAllLeads] = useState(leads);
    const [groupedLeads, setGroupedLeads] = useState<GroupedLeads>({});
    const [loading, setLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('alter-app'));
    };

    const deleteApp: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('delete-app'));
    }

    useEffect(() => {
        let arr:GroupedLeads = [];
            
        allLeads.forEach((lead) => {
            const step = lead.step;
            if (!arr[step]) {
                arr[step] = [];
            }
            arr[step].push(lead);
        });

        setGroupedLeads(arr);
    }, [allLeads]);

    const onDragStart = (e: React.DragEvent, leadId: number) => {
        e.dataTransfer.setData('leadId', leadId.toString());
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };
    
    const onDrop = (e: React.DragEvent, stepId: number) => {
        setLoading(true);
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');

        const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
        const headers: { [key: string]: string } = {
            'Content-Type': 'application/json',
        };

        if (csrfTokenElement) {
            const csrfToken = csrfTokenElement.getAttribute('content');
            if (csrfToken) {
                headers['X-CSRF-TOKEN'] = csrfToken;
            }
        }

        fetch('/step-lead', {
            method: 'POST',
            headers,
            body: JSON.stringify({ leadId: leadId, stepId: stepId }),
        })
        .then(response => response.json())
            .then(response => {
                setAllLeads(response.leads);
                setLoading(false);
            })
        .catch(error => {
            console.error('Erro na chamada AJAX: ', error);
            setLoading(false);
        });
    };

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
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">App {app.name}</h2>}
        >
            <Head title={"App "+app.name} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        
                        {/* Edit app form */}
                        <Accordion title="Editar App">
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

                                <div className="mt-4">

                                    <div className='flex items-center'>
                                        <InputLabel htmlFor="token" value="API Token" />

                                        <span className="flex items-center cursor-pointer" onClick={(e)=>{copy(e, 'token')}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy ml-5 mr-1" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
                                            </svg>
                                            {isCopied ? 'Copiado' : 'Copiar'}
                                        </span>
                                    </div>

                                    <TextInput
                                        id="token"
                                        type="text"
                                        name="token"
                                        value={data.id}
                                        className="mt-1 block w-full bg-slate-100"
                                        autoComplete="name"
                                        disabled={true}
                                    />
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
                        </Accordion>

                        {/* Leads list */}
                        <div className={`p-6 text-gray-900 dark:text-gray-100 ${loading ? 'blur-sm' : ''}`}>
                            <h1 className="mb-5 text-xl">
                                Leads
                            </h1>
                            <div className="flex flex-col md:flex-row md:justify-around">
                                <div className="flex flex-row md:flex-col items-center" onDrop={(e) => onDrop(e, 0)} onDragOver={(e) => onDragOver(e)}>
                                    
                                    {/* Recieved leads */}
                                    <div className="p-2">Recebidos</div>
                                    <hr className="mb-5"/>
                                    {groupedLeads[0] && groupedLeads[0].map((lead, index) => (
                                        <div key={index} className="rounded border-2 p-2" draggable="true" onDragStart={(e) => onDragStart(e, Number(lead.id))}>
                                            <div className="flex justify-between items-center m-1">
                                                <div>#{lead.id}</div>
                                                <Link href={route('delete-lead', { id: lead.id })}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                            <hr/>
                                            <Lead data={lead.data} />
                                        </div>
                                    ))}
                                </div>

                                {/* In contact leads */}
                                <div className="flex flex-row md:flex-col items-center" onDrop={(e) => onDrop(e, 1)} onDragOver={(e) => onDragOver(e)}>
                                    <div className="p-2">Em contato</div>
                                    <hr className="mb-5" />
                                    {groupedLeads[1] && groupedLeads[1].map((lead, index) => (
                                        <div key={index} className="rounded border-2 p-2" draggable="true" onDragStart={(e) => onDragStart(e, Number(lead.id))}>
                                            <div className="flex justify-between items-center m-1">
                                                <div>#{lead.id}</div>
                                                <Link href={route('delete-lead', { id: lead.id })}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                            <hr/>
                                            <Lead data={lead.data} />
                                        </div>
                                    ))}
                                </div>

                                {/* Converted leads */}
                                <div className="flex flex-row md:flex-col items-center" onDrop={(e) => onDrop(e, 2)} onDragOver={(e) => onDragOver(e)}>
                                    <div className="p-2">Convertidos</div>
                                    <hr className="mb-5" />
                                    {groupedLeads[2] && groupedLeads[2].map((lead, index) => (
                                        <div key={index} className="rounded border-2 p-2" draggable="true" onDragStart={(e) => onDragStart(e, Number(lead.id))}>
                                            <div className="flex justify-between items-center m-1">
                                                <div>#{lead.id}</div>
                                                <Link href={route('delete-lead', { id: lead.id })}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                            <hr/>
                                            <Lead data={lead.data} />
                                        </div>
                                    ))}
                                </div>

                                {/* Discarted leads */}
                                <div className="flex flex-row md:flex-col items-center" onDrop={(e) => onDrop(e, 3)} onDragOver={(e) => onDragOver(e)}>
                                    <div className="p-2">Não convertidos</div>
                                    <hr className="mb-5" />
                                    {groupedLeads[3] && groupedLeads[3].map((lead, index) => (
                                        <div key={index} className="rounded border-2 p-2" draggable="true" onDragStart={(e) => onDragStart(e, Number(lead.id))}>
                                            <div className="flex justify-between items-center m-1">
                                                <div>#{lead.id}</div>
                                                <Link href={route('delete-lead', { id: lead.id })}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                                    </svg>
                                                </Link>
                                            </div>
                                            <hr/>
                                            <Lead data={lead.data} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}