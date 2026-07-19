import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ThemeSwitcher from '../Components/ThemeSwitcher';

interface User {
    name: string;
    email: string;
    role: string;
}

interface Props {
    title: string;
    auth: {
        user: User | null;
    };
}

export default function Welcome({ title, auth }: Props) {
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <>
            <Head>
                <title>Beranda - Maridonor</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white antialiased relative overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
                
                {/* Background Grid Pattern & Glowing Orbs */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full bg-gradient-to-b from-red-600/15 via-rose-600/5 to-transparent blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-red-600/5 blur-3xl pointer-events-none"></div>

                {/* Navbar Sticky Glassmorphic */}
                <header className="sticky top-0 z-50 backdrop-blur-lg bg-slate-950/75 border-b border-slate-900/80 transition duration-200">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center space-x-3.5 group cursor-pointer">
                            <div className="p-2 bg-gradient-to-br from-red-500/10 to-rose-600/10 rounded-xl border border-red-500/20 group-hover:border-red-500/40 transition duration-200">
                                <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-8 w-auto group-hover:scale-105 transition duration-200" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight text-white">
                                Mari<span className="text-red-500">donor</span>
                            </span>
                        </div>

                        <nav className="flex items-center space-x-6">
                            {auth.user ? (
                                <div className="flex items-center space-x-5">
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm font-bold text-white leading-none mb-1">{auth.user.name}</p>
                                        <span className="inline-flex text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full capitalize">
                                            {auth.user.role.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <Link 
                                        href={auth.user.role === 'donor' ? '/dashboard/donor' : (auth.user.role.includes('pmi') ? '/dashboard/pmi' : '/dashboard/hospital')}
                                        className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 transition duration-150"
                                    >
                                        Dashboard
                                    </Link>
                                    <form onSubmit={handleLogout}>
                                        <button 
                                            type="submit" 
                                            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition duration-150"
                                        >
                                            Keluar
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <Link 
                                    href="/login" 
                                    className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 rounded-xl shadow-lg shadow-red-600/15 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Portal Masuk
                                </Link>
                            )}
                            <ThemeSwitcher />
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative z-10 space-y-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/25 text-red-400 text-xs font-bold">
                                <span>🩸</span>
                                <span>Sistem Logistik Donor Darah Nasional</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif">
                                Setetes Darah,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-600">
                                    Satu Kehidupan Baru
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Platform terintegrasi yang menghubungkan pendonor secara real-time dengan Unit Donor Darah PMI dan Rumah Sakit mitra. Solusi cerdas logistik kantong darah darurat.
                             </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <Link 
                                    href="/login" 
                                    className="px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 rounded-2xl shadow-xl shadow-red-600/25 text-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Masuk ke Portal
                                </Link>
                                <a 
                                    href="#features" 
                                    className="px-8 py-4 text-base font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 rounded-2xl border border-slate-800 text-center transition duration-150"
                                >
                                    Pelajari Fitur
                                </a>
                            </div>

                            {/* Live Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-900 max-w-md mx-auto lg:mx-0">
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-extrabold text-white">120+</p>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pendonor Aktif</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-extrabold text-white">45+</p>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">PMI & RS Mitra</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-extrabold text-white">1.2K</p>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kantung Disalurkan</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Visual Graphic Card */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/20 to-rose-600/5 rounded-3xl blur-2xl opacity-60"></div>
                            <div className="relative w-full max-w-md bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-800/60">
                                    <div className="flex items-center space-x-2">
                                        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                                        <h3 className="font-bold text-white text-sm uppercase tracking-wider">Stok Darah Darurat PMI</h3>
                                    </div>
                                    <span className="text-[10px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded font-bold uppercase">Live</span>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { type: 'A+', count: 12, percent: 'w-4/5', color: 'from-red-600 to-rose-600' },
                                        { type: 'B+', count: 8, percent: 'w-3/5', color: 'from-red-500 to-orange-500' },
                                        { type: 'AB+', count: 4, percent: 'w-2/5', color: 'from-rose-500 to-rose-700' },
                                        { type: 'O+', count: 18, percent: 'w-[92%]', color: 'from-red-600 via-rose-600 to-red-500' },
                                    ].map((stock) => (
                                        <div key={stock.type} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-slate-350">{stock.type}</span>
                                                <span className="text-white">{stock.count} Kantong</span>
                                            </div>
                                            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-[1px] border border-slate-850">
                                                <div className={`h-full ${stock.percent} bg-gradient-to-r ${stock.color} rounded-full`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div id="features" className="py-12 space-y-12">
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <h2 className="text-3xl font-extrabold text-white">Satu Platform Untuk Semua Kebutuhan</h2>
                            <p className="text-sm text-slate-400 leading-relaxed font-light">
                                Menggabungkan kecepatan respon darurat Rumah Sakit dengan keandalan logistik Unit Donor Darah Palang Merah Indonesia.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Monitoring Real-Time', desc: 'Pemantauan inventori stok kantong darah PMI secara akurat berdasarkan tipe komponen.', icon: '📊' },
                                { title: 'Permohonan Darah Cepat', desc: 'Rumah Sakit dapat langsung mengirimkan permintaan darah darurat dengan notifikasi instan.', icon: '🚨' },
                                { title: 'Sertifikat Digital', desc: 'Penghargaan eksklusif untuk pendonor yang melakukan kontribusi donor darah walk-in.', icon: '🏆' },
                            ].map((feat, idx) => (
                                <div key={idx} className="bg-slate-900/30 border border-slate-850 hover:border-slate-800 p-6 rounded-2xl transition duration-200 group">
                                    <span className="text-3xl block mb-4 group-hover:scale-110 transition duration-150">{feat.icon}</span>
                                    <h4 className="text-base font-bold text-white mb-2">{feat.title}</h4>
                                    <p className="text-xs text-slate-450 leading-relaxed">{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
