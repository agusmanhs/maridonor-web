import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    
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

    const handleQuickLogin = (role: 'pmi' | 'rs') => {
        setData((prev) => ({
            ...prev,
            email: role === 'pmi' ? 'pmi@maridonor.com' : 'rs@maridonor.com',
            password: 'password',
        }));
    };

    return (
        <>
            <Head>
                <title>Masuk - MARIDONOR</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                .crimson-overlay {
                    background: linear-gradient(135deg, rgba(120, 0, 38, 0.75) 0%, rgba(159, 18, 57, 0.45) 100%);
                }
                .input-transition {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .input-transition:focus {
                    box-shadow: 0 0 0 2px rgba(159, 18, 57, 0.1);
                }
            `}</style>

            <main className="min-h-screen w-full flex select-none antialiased bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* Left Side: Visual Narrative */}
                <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <div 
                        className="absolute inset-0 z-0 bg-cover bg-center" 
                        style={{ 
                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0pAKSiAv2tJROjcoKV1lCYC6GQ8YSH6fPj_e7B1SACv9VOs_O4rSNqm1zWADD6xQeRtK5UDugVrzSXkA6QssEq3Bu031l3ECKLdfeW_jBT-l_GxHJgN7Q_3vcQfm-yezJuwfHGi-FnPZ52Bdh5fFU5EVwAQy40-kw_vIjP9r3hmS939B9tGso_T3-d9XBQVuglXcrWMpi-t--qWkKr6Lit7LOUIYevY4A73ivcggbIwtah06Mqn7PeQ')" 
                        }}
                    />
                    <div className="absolute inset-0 crimson-overlay z-10 flex flex-col justify-end p-12 text-white">
                        <div className="max-w-md mb-8">
                            <h2 className="font-semibold text-4xl mb-4 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Berikan Harapan, Selamatkan Jiwa.
                            </h2>
                            <p className="text-base opacity-90 leading-relaxed">
                                Setiap tetes darah yang Anda donasikan adalah nafas kehidupan bagi mereka yang membutuhkan. Bergabunglah dalam gerakan pahlawan kemanusiaan hari ini.
                            </p>
                        </div>
                        <div className="flex gap-6 items-center border-t border-white/20 pt-6 mb-8">
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-500"></div>
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-600 flex items-center justify-center text-[10px] font-bold">+12k</div>
                            </div>
                            <p className="text-sm font-semibold">Pahlawan MARIDONOR aktif di seluruh Indonesia</p>
                        </div>
                    </div>
                </section>

                {/* Right Side: Login Form */}
                <section className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
                    <div className="w-full max-w-[440px] flex flex-col gap-6">
                        
                        {/* Brand Identity */}
                        <div className="flex flex-col items-center lg:items-start gap-2">
                            <img 
                                alt="MARIDONOR" 
                                className="h-14 w-auto object-contain mb-1" 
                                src="/images/logo_icon.png"
                                onError={(e) => {
                                    // Fallback if logo icon doesn't load
                                    (e.target as HTMLElement).style.display = 'none';
                                }}
                            />
                            <span className="text-3xl font-bold tracking-tighter text-rose-700" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                MARIDONOR
                            </span>
                        </div>

                        {/* Header Text */}
                        <div className="space-y-1 text-center lg:text-left">
                            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Selamat Datang Kembali
                            </h1>
                            <p className="text-sm text-slate-500">
                                Silakan masuk untuk melanjutkan kontribusi Anda.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-4" onSubmit={submit}>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-500 ml-1" htmlFor="email">
                                    Email
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-700 transition-colors">
                                        mail
                                    </span>
                                    <input 
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl input-transition outline-none focus:border-rose-600 focus:bg-white text-sm" 
                                        id="email" 
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@email.com" 
                                        required
                                        autoComplete="username"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-600 font-semibold pl-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-bold text-slate-500" htmlFor="password">
                                        Password
                                    </label>
                                    <Link className="text-xs font-semibold text-rose-600 hover:underline transition-all" href="#">
                                        Lupa Password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-700 transition-colors">
                                        lock
                                    </span>
                                    <input 
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl input-transition outline-none focus:border-rose-600 focus:bg-white text-sm" 
                                        id="password" 
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••" 
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-600 font-semibold pl-1">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2 px-1 py-1">
                                <input 
                                    className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500" 
                                    id="remember" 
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label className="text-xs text-slate-500 cursor-pointer select-none" htmlFor="remember">
                                    Ingat saya di perangkat ini
                                </label>
                            </div>

                            <button 
                                className="w-full py-4 bg-rose-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-700/10 hover:bg-rose-800 active:scale-[0.98] transition-all duration-200 mt-2 flex justify-center items-center" 
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Masuk'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative flex items-center py-1">
                            <div className="flex-grow border-t border-slate-100"></div>
                            <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                Atau
                            </span>
                            <div className="flex-grow border-t border-slate-100"></div>
                        </div>

                        {/* Registration Trigger */}
                        <div className="text-center">
                            <p className="text-sm text-slate-500">
                                Belum punya akun?{' '}
                                <Link className="text-rose-600 font-bold hover:underline" href="/register">
                                    Daftar Sebagai Pendonor
                                </Link>
                            </p>
                        </div>

                        {/* Institutional Entry */}
                        <div className="mt-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-3">
                            <p className="text-[10px] font-bold text-slate-400 tracking-wider text-center uppercase">
                                LOGIN CEPAT SIMULATOR (DEV ONLY)
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    type="button"
                                    onClick={() => handleQuickLogin('pmi')}
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-slate-600 text-xs font-bold shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[16px] text-rose-600">
                                        local_hospital
                                    </span>
                                    PMI Staff
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => handleQuickLogin('rs')}
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all text-slate-600 text-xs font-bold shadow-sm"
                                >
                                    <span className="material-symbols-outlined text-[16px] text-rose-600">
                                        apartment
                                    </span>
                                    RS Staff
                                </button>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <footer className="mt-8 pt-4 flex justify-center gap-6 border-t border-slate-100">
                            <a className="text-xs text-slate-400 hover:text-rose-600 transition-colors" href="#">Bantuan</a>
                            <a className="text-xs text-slate-400 hover:text-rose-600 transition-colors" href="#">Privasi</a>
                            <a className="text-xs text-slate-400 hover:text-rose-600 transition-colors" href="#">Syarat &amp; Ketentuan</a>
                        </footer>
                    </div>
                </section>
            </main>
        </>
    );
}
