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
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen theme-bg-main theme-text-main selection:bg-red-600 selection:theme-text-main antialiased relative overflow-hidden transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
                
                {/* Ambient Glowing Orbs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-red-500/5 blur-[100px] pointer-events-none"></div>

                {/* Navbar Sticky Glassmorphic */}
                <header className="sticky top-0 z-50 backdrop-blur-lg theme-bg-main/70 border-b theme-border-main transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center space-x-3.5 group cursor-pointer">
                            <div className="p-2 bg-gradient-to-br from-red-500/10 to-rose-600/10 rounded-xl border border-red-500/20 group-hover:border-red-500/40 transition duration-200">
                                <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-8 w-auto group-hover:scale-105 transition duration-200" />
                            </div>
                            <span className="text-2xl font-black tracking-tight theme-text-main">
                                Mari<span className="text-red-600">donor</span>
                            </span>
                        </div>

                        <nav className="flex items-center space-x-6">
                            {auth.user ? (
                                <div className="flex items-center space-x-5">
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm font-bold theme-text-main leading-none mb-1">{auth.user.name}</p>
                                        <span className="inline-flex text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full capitalize">
                                            {auth.user.role.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <Link 
                                        href={auth.user.role === 'donor' ? '/dashboard/donor' : (auth.user.role.includes('pmi') ? '/dashboard/pmi' : '/dashboard/hospital')}
                                        className="px-4 py-2 text-xs font-bold theme-text-main theme-bg-card hover:bg-red-500/10 rounded-xl border theme-border-main transition duration-150"
                                    >
                                        Dashboard
                                    </Link>
                                    <form onSubmit={handleLogout}>
                                        <button 
                                            type="submit" 
                                            className="px-4 py-2 text-xs font-bold theme-text-muted hover:theme-text-main transition duration-150"
                                        >
                                            Keluar
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <Link 
                                    href="/login" 
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md shadow-red-600/20 transition-all duration-200"
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

                            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tight theme-text-main leading-[1.1]">
                                Setetes <span className="text-red-600">Darah</span>,<br />
                                Satu Kehidupan Baru.
                            </h1>

                            <p className="text-base sm:text-lg theme-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Platform terintegrasi yang menghubungkan pendonor secara real-time dengan Unit Donor Darah PMI dan Rumah Sakit mitra. Solusi cerdas logistik kantong darah darurat.
                             </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <Link 
                                    href="/login" 
                                    className="px-8 py-3.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/25 text-center transition-all duration-200"
                                >
                                    Masuk ke Portal
                                </Link>
                                <a 
                                    href="#features" 
                                    className="px-8 py-3.5 text-base font-bold theme-text-main theme-bg-card hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border theme-border-main text-center transition duration-150 shadow-sm"
                                >
                                    Pelajari Lebih Lanjut
                                </a>
                            </div>

                            {/* Live Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t theme-border-main max-w-md mx-auto lg:mx-0">
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-extrabold theme-text-main">120+</p>
                                    <p className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">Pendonor Aktif</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-extrabold theme-text-main">45+</p>
                                    <p className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">PMI & RS Mitra</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-3xl font-extrabold theme-text-main">1.2K</p>
                                    <p className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">Kantung Disalurkan</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Visual Graphic Card */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/20 to-rose-600/5 rounded-3xl blur-2xl opacity-60"></div>
                            <div className="relative w-full max-w-md theme-bg-card border theme-border-card rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b theme-border-main">
                                    <div className="flex items-center space-x-2">
                                        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                                        <h3 className="font-bold theme-text-main text-sm uppercase tracking-wider">Stok Darah Darurat PMI</h3>
                                    </div>
                                    <span className="text-[10px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded font-bold uppercase">Live</span>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { type: 'A+', count: 12, percent: 'w-4/5', color: 'from-red-600 to-rose-605' },
                                        { type: 'B+', count: 8, percent: 'w-3/5', color: 'from-red-500 to-orange-500' },
                                        { type: 'AB+', count: 4, percent: 'w-2/5', color: 'from-rose-500 to-rose-700' },
                                        { type: 'O+', count: 18, percent: 'w-[92%]', color: 'from-red-650 via-rose-600 to-red-500' },
                                    ].map((stock) => (
                                        <div key={stock.type} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="theme-text-muted">{stock.type}</span>
                                                <span className="theme-text-main">{stock.count} Kantong</span>
                                            </div>
                                            <div className="w-full theme-bg-main h-3 rounded-full overflow-hidden p-[1px] border theme-border-main">
                                                <div className={`h-full ${stock.percent} bg-gradient-to-r ${stock.color} rounded-full`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div id="features" className="py-24 space-y-16">
                        <div className="max-w-3xl space-y-4">
                            <h2 className="text-3xl lg:text-4xl font-black theme-text-main tracking-tight">Kenapa Maridonor?</h2>
                            <p className="text-base theme-text-muted leading-relaxed font-medium">
                                Berbagi kehidupan, bergerak hidup sehat, dan berbuat kebaikan dalam satu platform logistik yang terpadu.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Kemudahan Akses', desc: 'Pemantauan inventori stok kantong darah secara akurat untuk kebutuhan darurat.', icon: '📅', color: 'bg-yellow-400' },
                                { title: 'Respons Cepat', desc: 'Rumah Sakit dapat langsung mengirimkan permintaan darah darurat.', icon: '🚨', color: 'bg-purple-500' },
                                { title: 'Pemantauan Real-time', desc: 'Monitor data ketersediaan komponen darah di seluruh PMI mitra secara instan.', icon: '📊', color: 'bg-orange-400' },
                                { title: 'Pengalaman Berkelanjutan', desc: 'Dapatkan penghargaan dan sertifikat digital untuk setiap donor darah yang Anda lakukan.', icon: '🏆', color: 'bg-emerald-500' },
                            ].map((feat, idx) => (
                                <div key={idx} className="theme-bg-card border theme-border-card p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col items-start relative group">
                                    <div className="w-14 h-14 rounded-2xl bg-red-500/5 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feat.icon}
                                    </div>
                                    <h4 className="text-lg font-bold theme-text-main mb-3 leading-tight">{feat.title}</h4>
                                    <p className="text-sm theme-text-muted leading-relaxed flex-1 mb-8">{feat.desc}</p>
                                    
                                    {/* Accent Bar at bottom */}
                                    <div className={`absolute bottom-8 left-8 h-1 w-8 rounded-full ${feat.color}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
