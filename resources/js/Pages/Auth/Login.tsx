import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ThemeSwitcher from '../../Components/ThemeSwitcher';

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
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen theme-bg-main flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-red-600 selection:theme-text-main antialiased relative overflow-hidden transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
                
                {/* Floating Theme Switcher */}
                <div className="absolute top-6 right-6 z-30">
                    <ThemeSwitcher />
                </div>
                
                {/* Background Grid Pattern & Glowing Circles */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-main)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-main)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    
                    {/* Header Logo */}
                    <div className="text-center space-y-3">
                        <Link href="/" className="inline-flex items-center space-x-3.5 group">
                            <div className="p-2 bg-gradient-to-br from-red-500/10 to-rose-600/10 rounded-xl border border-red-500/20 group-hover:border-red-500/40 transition duration-200">
                                <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-8 w-auto group-hover:scale-105 transition duration-200" />
                            </div>
                            <span className="text-2xl font-black tracking-tight theme-text-main">
                                Mari<span className="text-red-600">donor</span>
                            </span>
                        </Link>
                        <h2 className="text-lg font-bold theme-text-main tracking-tight">
                            Portal Staf PMI & Rumah Sakit
                        </h2>
                        <p className="text-xs theme-text-muted">
                            Masuk untuk mengelola logistik bank darah dan slot jadwal.
                        </p>
                    </div>

                    {/* Card Form Glassmorphism */}
                    <div className="theme-bg-card border theme-border-card rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
                        <form onSubmit={submit} className="space-y-5">
                            
                            {/* Email Address */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                    Alamat Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                    placeholder="nama.staf@maridonor.com"
                                    autoComplete="username"
                                    required
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-550 font-semibold pt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                    Kata Sandi
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-550 font-semibold pt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    className="h-4 w-4 rounded theme-bg-input border theme-border-main text-red-600 focus:ring-red-550/30 focus:ring-offset-slate-900"
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label htmlFor="remember" className="ml-2.5 text-xs font-semibold theme-text-muted select-none">
                                    Ingat saya di perangkat ini
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 rounded-xl shadow-lg shadow-red-600/15 hover:shadow-red-600/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center"
                            >
                                {processing ? 'Memverifikasi...' : 'Masuk ke Portal'}
                            </button>
                        </form>
                    </div>

                    {/* Register & Back Links */}
                    <div className="text-center space-y-2">
                        <p className="text-xs theme-text-muted">
                            Belum punya akun?{' '}
                            <Link href="/register" className="text-red-500 font-bold hover:text-red-400 transition duration-150">
                                Daftar sebagai Pendonor
                            </Link>
                        </p>
                        <Link href="/" className="inline-block text-xs theme-text-muted hover:theme-text-main transition duration-150">
                            &larr; Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
