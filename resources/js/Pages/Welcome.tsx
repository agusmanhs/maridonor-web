import React from 'react';
import { Head } from '@inertiajs/react';

interface Props {
    title: string;
}

export default function Welcome({ title }: Props) {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-6 selection:bg-red-500 selection:text-white">
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-3xl font-bold">
                        M
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
                        <p className="text-sm text-slate-400">
                            Platform Logistik Donor Darah PMI & Rumah Sakit Indonesia
                        </p>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex justify-center space-x-2 text-xs text-slate-500">
                        <span>Laravel 12</span>
                        <span>•</span>
                        <span>Inertia.js</span>
                        <span>•</span>
                        <span>React 19</span>
                    </div>
                </div>
            </div>
        </>
    );
}
