import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk - Portal Staf Maridonor" />
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-red-600 selection:text-white font-sans antialiased relative overflow-hidden">
                
                {/* Decorative Red Glow Background */}
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    {/* Header Logo */}
                    <div className="text-center space-y-3">
                        <Link href="/" className="inline-flex items-center space-x-3 group">
                            <img src="/images/logo.png" alt="Maridonor Logo" className="h-10 w-auto" />
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Mari<span className="text-red-500">donor</span>
                            </span>
                        </Link>
                        <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                            Portal Staf PMI & Rumah Sakit
                        </h2>
                        <p className="text-xs text-slate-400">
                            Silakan masuk menggunakan akun staf resmi Anda
                        </p>
                    </div>

                    {/* Card Form Glassmorphism */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-lg shadow-2xl space-y-6">
                        <form onSubmit={submit} className="space-y-5">
                            
                            {/* Email Address */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-xs font-semibold text-slate-300">
                                    Alamat Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                    placeholder="nama.staf@pmi.or.id"
                                    autoComplete="username"
                                    required
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 font-medium pt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label htmlFor="password" className="text-xs font-semibold text-slate-300">
                                        Kata Sandi
                                    </label>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500 font-medium pt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    className="h-4 w-4 rounded bg-slate-950 border-slate-850 text-red-600 focus:ring-red-500/30 focus:ring-offset-slate-900"
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label htmlFor="remember" className="ml-2 text-xs font-semibold text-slate-400 select-none">
                                    Ingat saya di perangkat ini
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition duration-200 flex justify-center items-center"
                            >
                                {processing ? 'Memverifikasi...' : 'Masuk ke Portal'}
                            </button>
                        </form>
                    </div>

                    {/* Back Link */}
                    <div className="text-center">
                        <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition duration-200">
                            &larr; Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
