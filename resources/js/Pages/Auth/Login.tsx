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
            <Head>
                <title>Masuk - Portal Staf Maridonor</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-red-600 selection:text-white antialiased relative overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
                
                {/* Background Grid Pattern & Glowing Circles */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    
                    {/* Header Logo */}
                    <div className="text-center space-y-3">
                        <Link href="/" className="inline-flex items-center space-x-3.5 group">
                            <div className="p-2 bg-gradient-to-br from-red-500/10 to-rose-600/10 rounded-xl border border-red-500/20 group-hover:border-red-500/40 transition duration-200">
                                <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-8 w-auto group-hover:scale-105 transition duration-200" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight text-white">
                                Mari<span className="text-red-500">donor</span>
                            </span>
                        </Link>
                        <h2 className="text-lg font-bold text-slate-200 tracking-tight">
                            Portal Staf PMI & Rumah Sakit
                        </h2>
                        <p className="text-xs text-slate-400">
                            Masuk untuk mengelola logistik bank darah dan slot jadwal.
                        </p>
                    </div>

                    {/* Card Form Glassmorphism */}
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
                        <form onSubmit={submit} className="space-y-5">
                            
                            {/* Email Address */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-xs font-bold text-slate-350 uppercase tracking-wider block">
                                    Alamat Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-4 py-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-650 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                    placeholder="nama.staf@maridonor.com"
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
                                <label htmlFor="password" className="text-xs font-bold text-slate-350 uppercase tracking-wider block">
                                    Kata Sandi
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-4 py-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-650 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
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
                                    className="h-4 w-4 rounded bg-slate-950 border-slate-800 text-red-650 focus:ring-red-500/30 focus:ring-offset-slate-900"
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label htmlFor="remember" className="ml-2.5 text-xs font-semibold text-slate-400 select-none">
                                    Ingat saya di perangkat ini
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 disabled:opacity-50 rounded-xl shadow-lg shadow-red-600/15 hover:shadow-red-600/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center"
                            >
                                {processing ? 'Memverifikasi...' : 'Masuk ke Portal'}
                            </button>
                        </form>
                    </div>

                    {/* Back Link */}
                    <div className="text-center">
                        <Link href="/" className="text-xs text-slate-500 hover:text-slate-350 transition duration-150">
                            &larr; Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
