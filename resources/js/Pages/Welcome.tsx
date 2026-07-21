import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ThemeSwitcher from '../Components/ThemeSwitcher';

interface User {
    name: string;
    email: string;
    role: string;
}

interface ArticleItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    created_at: string;
}

interface AnnouncementItem {
    id: string;
    title: string;
    content: string;
    type: string;
    is_pinned: boolean;
    created_at: string;
}

interface Props {
    title: string;
    articles: ArticleItem[];
    announcements: AnnouncementItem[];
    auth: {
        user: User | null;
    };
}

export default function Welcome({ title, articles = [], announcements = [], auth }: Props) {
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <>
            <Head>
                <title>MARIDONOR - Jaringan Donor Darah Nasional</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                    display: inline-block;
                    vertical-align: middle;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(226, 232, 240, 0.8);
                }
                .dark .glass-card {
                    background: rgba(43, 45, 45, 0.7);
                    border: 1px solid rgba(65, 67, 67, 0.8);
                }
            `}</style>

            <div className="min-h-screen bg-slate-50 dark:bg-[#1a1c1c] text-slate-800 dark:text-slate-100 transition-colors duration-300 select-none antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
                
                {/* Top Navigation Bar */}
                <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-white/80 dark:bg-[#2b2d2d]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#414343] transition-colors duration-300">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center text-xl font-bold text-rose-800 dark:text-rose-500 tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                            <img 
                                alt="MARIDONOR Logo" 
                                className="h-7 w-auto inline-block mr-2" 
                                src="/images/logo_icon.png"
                                onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                }}
                            />
                            MARIDONOR
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <a href="#" className="text-xs font-bold text-rose-800 dark:text-rose-400 border-b-2 border-rose-800 dark:border-rose-500 pb-1">Beranda</a>
                            <a href="#metrics" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 transition-colors">Metrik Live</a>
                            <a href="#methodology" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 transition-colors">Metodologi</a>
                            <a href="#feeds" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 transition-colors">Edukasi & Pengumuman</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeSwitcher />
                        
                        {auth.user ? (
                            <div className="flex items-center gap-3">
                                <Link 
                                    href={auth.user.role === 'donor' ? '/dashboard/donor' : (auth.user.role.includes('pmi') ? '/dashboard/pmi' : '/dashboard/hospital')}
                                    className="bg-rose-700 dark:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-all shadow-sm"
                                >
                                    Dashboard
                                </Link>
                                <form onSubmit={handleLogout} className="inline-block">
                                    <button 
                                        type="submit" 
                                        className="p-2 text-xs font-bold text-slate-400 hover:text-rose-600 transition duration-150 rounded-xl"
                                        title="Keluar"
                                    >
                                        🚪
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link 
                                href="/login" 
                                className="bg-rose-700 dark:bg-rose-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-md shadow-rose-700/10"
                            >
                                Portal Staf / Masuk
                            </Link>
                        )}
                    </div>
                </header>

                <main className="pt-16">
                    {/* Hero Section */}
                    <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden py-16 px-6 md:px-12">
                        {/* Decorative background glows */}
                        <div className="absolute top-[-10%] left-[5%] w-[500px] h-[500px] rounded-full bg-rose-600/5 blur-[120px] pointer-events-none"></div>
                        <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-rose-700/5 blur-[110px] pointer-events-none"></div>

                        <div className="relative z-10 grid grid-cols-12 gap-6 w-full items-center">
                            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
                                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Jaringan Logistik Darah Nasional
                                </span>
                                <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-bold text-rose-800 dark:text-rose-500 leading-[1.08]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                    Penyelamatan Jiwa Melalui <br/>
                                    <span className="text-slate-800 dark:text-white">Presisi Logistik Digital</span>
                                </h1>
                                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                                    MARIDONOR adalah ekosistem digital premium untuk memantau rantai pasok kantong darah secara real-time. Kami menghubungkan pendonor sukarela dengan Unit Donor Darah PMI dan fasilitas darurat Rumah Sakit dengan presisi medis.
                                </p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-2">
                                    <Link 
                                        href="/login" 
                                        className="bg-rose-700 hover:bg-rose-800 text-white px-8 py-3.5 rounded-xl text-sm font-bold active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-rose-700/10"
                                    >
                                        Gabung Jaringan
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </Link>
                                    <a 
                                        href="#metrics" 
                                        className="border border-slate-300 dark:border-[#414343] text-rose-700 dark:text-rose-400 hover:bg-rose-500/5 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all"
                                    >
                                        Pantau Stok Live
                                    </a>
                                </div>
                            </div>
                            <div className="hidden lg:col-span-5 lg:flex justify-end">
                                <div className="relative w-[440px] h-[480px] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#414343] shadow-2xl">
                                    <img 
                                        className="w-full h-full object-cover" 
                                        alt="Laboratorium Medis" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZRYeX2L9eTbAcyuBIeqjOmopQlp-MR8vGrD6m4OJQyplvHHLr8Z_PIpiaHO-oOmbSODLdAOSGziHepKaNSeklGeFyb6f5ejmGgrrawysaxMaDB8-zEzyLs9ppZj4gZJi20TyV8O0C4eKW51HQZf06wceRqCtkCVLa5Qmov7K0woNeaCYjMTQMRZtNKstN7bR_v5fhjWWrP6jVOvAhK32n2eQETcTuSXv5dOEv8Z6fghcCVDAgNyV4lA"
                                    />
                                    <div className="absolute bottom-6 left-6 right-6 p-6 glass-card rounded-2xl shadow-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-rose-800 dark:text-rose-400" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                                Pahlawan Pendonor
                                            </span>
                                            <span className="text-[9px] font-bold text-rose-700 bg-rose-600/10 px-2 py-0.5 rounded" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                LIVE
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-extrabold text-slate-800 dark:text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>12,482</span>
                                            <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">+12% minggu ini</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Bento Grid */}
                    <section id="metrics" className="py-20 bg-slate-100 dark:bg-[#2b2d2d]/30 border-t border-b border-slate-200 dark:border-[#414343]">
                        <div className="px-6 md:px-12">
                            <div className="flex flex-col items-center mb-12 text-center">
                                <h2 className="text-3xl font-bold text-rose-800 dark:text-rose-500 mb-3" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                    Metrik Kinerja & Distribusi
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl font-light">
                                    Sistem pemantauan dasbor kami mencatat setiap siklus kantong darah dari pendonor hingga terdistribusi dengan aman ke pasien penerima.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-12 gap-6">
                                {/* Metric Card 1 */}
                                <div className="col-span-12 md:col-span-6 lg:col-span-4 glass-card p-8 rounded-2xl flex flex-col justify-between h-64 hover:border-rose-700/35 transition-all shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="material-symbols-outlined text-4xl text-rose-700" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            bloodtype
                                        </span>
                                        <span className="material-symbols-outlined text-slate-400">monitoring</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                            Kapasitas Suplai
                                        </h3>
                                        <p className="text-4xl font-extrabold my-2 text-slate-800 dark:text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>94.8%</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Kapasitas penyimpanan optimal di 48 bank darah UDD.</p>
                                    </div>
                                </div>
                                {/* Metric Card 2 */}
                                <div className="col-span-12 md:col-span-6 lg:col-span-4 glass-card p-8 rounded-2xl flex flex-col justify-between h-64 hover:border-rose-700/35 transition-all shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="material-symbols-outlined text-4xl text-rose-700" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            emergency
                                        </span>
                                        <span className="material-symbols-outlined text-slate-400">speed</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                            Waktu Tanggap Darurat
                                        </h3>
                                        <p className="text-4xl font-extrabold my-2 text-slate-800 dark:text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                            14 <span className="text-base font-normal">menit</span>
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Rata-rata kecepatan penyaluran darah darurat ke Rumah Sakit.</p>
                                    </div>
                                </div>
                                {/* Metric Card 3 (Featured) */}
                                <div className="col-span-12 lg:col-span-4 row-span-2 bg-rose-800 dark:bg-rose-900 p-8 rounded-2xl flex flex-col justify-between text-white relative overflow-hidden group shadow-md">
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div>
                                            <span className="material-symbols-outlined text-4xl mb-4 text-white/95">public</span>
                                            <h3 className="text-xl font-bold mb-2 text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                                Jangkauan Kolaboratif
                                            </h3>
                                            <p className="text-xs text-rose-100 leading-relaxed font-light">
                                                Mengembangkan kolaborasi dengan berbagai rumah sakit umum, RS swasta, dan unit transfusi darah regional demi menjamin ketersediaan darah di saat kritis.
                                            </p>
                                        </div>
                                        <div className="mt-8">
                                            <div className="flex -space-x-3 mb-4">
                                                <div className="w-10 h-10 rounded-full border-2 border-rose-800 overflow-hidden bg-slate-300"></div>
                                                <div className="w-10 h-10 rounded-full border-2 border-rose-800 overflow-hidden bg-slate-400"></div>
                                                <div className="w-10 h-10 rounded-full border-2 border-rose-800 overflow-hidden bg-slate-500"></div>
                                                <div className="w-10 h-10 rounded-full border-2 border-rose-800 bg-[#2b2d2d] flex items-center justify-center text-[10px] font-bold">+2k</div>
                                            </div>
                                            <Link href="/login" className="w-full py-3 bg-white text-rose-800 hover:bg-slate-100 rounded-xl font-bold active:scale-95 transition-transform text-xs text-center block">
                                                Daftar Sekarang
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                {/* Map/Location Card */}
                                <div className="col-span-12 md:col-span-8 glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row h-64 md:h-auto lg:h-64 shadow-sm">
                                    <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                        <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                            Distribusi Regional Aktif
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-light">
                                            Pemetaan geografis persebaran kebutuhan rumah sakit dan ketersediaan relawan pendonor secara dinamis.
                                        </p>
                                        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-500 text-xs font-bold">
                                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                                            <span>48 Unit Terdaftar</span>
                                        </div>
                                    </div>
                                    <div className="md:w-1/2 relative bg-rose-50 dark:bg-[#414343]">
                                        <div 
                                            className="w-full h-full bg-cover bg-center" 
                                            style={{ 
                                                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZvB3-jHV3cLdCSRLI-EN2oPPbfw8yQ_z9ZvbbRU97e0hzAx4eaVr3ecvGAtpNBWvJVb0w2ChClUF6n3JFWxoMO4MNGsIi0UZg0-YbMNTJfsgSIvyQEB5bUWTUNlshrNXqngrAjDn1DiwS7LGQGg4HwLkbVQiSG5XHOLXc_BVxXYZWCCqh1x46lZ22rnZSlIkXV8GgV9XyM7OMvFF8Pk29ETOudF-r5mUwJOm8wWPxasLUKmGPjJjhew')" 
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-rose-800/10 pointer-events-none"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Methodology Section */}
                    <section id="methodology" className="py-20 px-6 md:px-12">
                        <div className="grid grid-cols-12 gap-12 items-center">
                            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                                <h2 className="text-3xl font-bold text-rose-800 dark:text-rose-500 leading-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                    Metodologi Penyaluran & Keamanan Medis
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                                    Kami menerapkan standar skrining klinis berlapis dan sistem distribusi terjadwal untuk menjamin mutu produk darah tetap terjaga sempurna hingga di tangan resipien.
                                </p>
                                <ul className="flex flex-col gap-5">
                                    <li className="flex gap-4 items-start">
                                        <div className="p-2.5 bg-rose-600/10 rounded-xl">
                                            <span className="material-symbols-outlined text-rose-700">verified</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold block text-slate-800 dark:text-white">Pemeriksaan Medis Ketat</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1">Skrining Hb, tekanan darah, dan pemeriksaan sampel laboratorium menyeluruh.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="p-2.5 bg-rose-600/10 rounded-xl">
                                            <span className="material-symbols-outlined text-rose-700">analytics</span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold block text-slate-800 dark:text-white">Prediksi Stok Cerdas</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-1">Pemetaan tren kebutuhan musiman untuk mencegah kekosongan suplai darah darurat.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden group shadow-md border border-slate-200 dark:border-[#414343]">
                                    <div className="h-80 relative">
                                        <img 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                            alt="Teknologi Bank Darah"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZd7eMlVU4A3kX8qDebz5VHFvSpBD_wEmIywi7LP7ZsM9mR5m7kIt9f8h6HnQAUPUiml2ZREDg6EO5OSknhg6La2XIOIu8zbLzE_hPzWvaTNgYGDgFQa2X2fam_y90z1a-DLwN_1hL93Zee8ByxGMsqkoQNViJ8PC28CeZVfJIattCKu17cIwUrOiQ72tSGf29ViBK0CgxZV_cNbXN3N4P914wFru7OJ5orW8zQUQoqV1yr_9wO2v4cQ"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6">
                                            <span className="text-[9px] text-white/70 tracking-widest block mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>RISERSET & KLINIS</span>
                                            <h4 className="text-white font-bold text-sm" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Penyimpanan Suhu Stabil</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden group shadow-md border border-slate-200 dark:border-[#414343]">
                                    <div className="h-80 relative">
                                        <img 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                            alt="Visual Data Rantai Pasok"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0WHWuWOBTVtEaAM5VDsVX7WBilv9DLmWWuMOcLs9Uhs_vFODnnfGkKMp-EutW9KPJwD4wAEuIueuCoDflaErK5x1Ei584o6DoFaFvKmdPndgHjxKDT3rdKaVphOwZLyjKX0-L_ouGKI-w9BJ6Sf8u436fRKK6upmmhjUTHzFlDMsB3HC4gMcPOByDUnvY83krbLNdBr4uO70rYF0qfDcFfLnp9yKoVL8slsCdJKwPWR3JWFFj6P0EVA"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                        <div className="absolute bottom-6 left-6">
                                            <span className="text-[9px] text-white/70 tracking-widest block mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>TEKNOLOGI RANTAI PASOK</span>
                                            <h4 className="text-white font-bold text-sm" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Rantai Dingin Terproteksi</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Feeds Section (Dynamic articles and announcements) */}
                    <section id="feeds" className="py-20 bg-slate-100 dark:bg-[#2b2d2d]/30 border-t border-slate-200 dark:border-[#414343]">
                        <div className="px-6 md:px-12 grid grid-cols-12 gap-12">
                            {/* Articles Column (Left 2/3) */}
                            <div className="col-span-12 lg:col-span-8 space-y-8">
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        📚 Edukasi & Informasi
                                    </span>
                                    <h2 className="text-3xl font-bold text-rose-800 dark:text-rose-500" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                        Kesehatan & Tips Pendonor
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {articles.length === 0 ? (
                                        <div className="p-8 rounded-2xl border border-slate-200 dark:border-[#414343] bg-white dark:bg-[#2b2d2d] text-slate-500 dark:text-slate-400 text-sm font-semibold col-span-2 text-center shadow-sm">
                                            📰 Belum ada artikel kesehatan dipublikasikan saat ini.
                                        </div>
                                    ) : (
                                        articles.map((art) => (
                                            <div key={art.id} className="p-6 rounded-2xl bg-white dark:bg-[#2b2d2d] border border-slate-200 dark:border-[#414343] flex flex-col justify-between space-y-5 hover:-translate-y-1 hover:border-rose-500/20 transition-all duration-300 shadow-sm hover:shadow-lg">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] bg-rose-600/10 text-rose-700 px-2.5 py-0.5 rounded font-bold uppercase">
                                                            {art.category}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {new Date(art.created_at).toLocaleDateString('id-ID', { month: 'long', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-base text-slate-800 dark:text-white line-clamp-2 leading-snug" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{art.title}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-light">{art.excerpt}</p>
                                                </div>
                                                <Link href="/login" className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center space-x-1 pt-2 w-fit">
                                                    <span>Baca Artikel</span>
                                                    <span>&rarr;</span>
                                                </Link>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Announcements Column (Right 1/3) */}
                            <div className="col-span-12 lg:col-span-4 space-y-8">
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest block" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        📢 Siaran Resmi
                                    </span>
                                    <h2 className="text-3xl font-bold text-rose-800 dark:text-rose-500" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                        Event & Pengumuman
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {announcements.length === 0 ? (
                                        <div className="p-8 rounded-2xl border border-slate-200 dark:border-[#414343] bg-white dark:bg-[#2b2d2d] text-slate-500 dark:text-slate-400 text-sm font-semibold text-center shadow-sm">
                                            🔔 Tidak ada pengumuman aktif saat ini.
                                        </div>
                                    ) : (
                                        announcements.map((ann) => (
                                            <div key={ann.id} className="p-6 rounded-2xl bg-white dark:bg-[#2b2d2d] border border-slate-200 dark:border-[#414343] space-y-3 relative overflow-hidden shadow-sm hover:shadow-md hover:border-rose-500/20 transition-all">
                                                {ann.is_pinned && (
                                                    <div className="absolute top-0 right-0 w-8 h-8 bg-rose-600/10 rounded-bl-2xl flex items-center justify-center text-xs">
                                                        📌
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-2">
                                                    <span className={`inline-flex text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                                        ann.type === 'warning' ? 'bg-orange-500/10 text-orange-600' :
                                                        ann.type === 'event' ? 'bg-blue-500/10 text-blue-600' :
                                                        'bg-green-500/10 text-green-600'
                                                    }`}>
                                                        {ann.type}
                                                    </span>
                                                    <span className="text-[9px] text-slate-400 font-mono">
                                                        {new Date(ann.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-sm text-slate-800 dark:text-white leading-tight line-clamp-2" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{ann.title}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-light">{ann.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-20 px-6 md:px-12 bg-slate-900 dark:bg-[#111212] text-white overflow-hidden relative">
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <h2 className="text-3xl font-bold mb-6 text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                Siap memperkuat Jaringan Donor Darah?
                            </h2>
                            <p className="text-slate-300 max-w-2xl mb-10 text-sm font-light leading-relaxed">
                                Baik Anda pendonor mandiri yang ingin menyelamatkan jiwa, maupun administrator logistik rumah sakit, MARIDONOR menyediakan platform mutakhir untuk mengelola dan memantau pasokan kritis secara cepat.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link 
                                    href="/login" 
                                    className="bg-white text-rose-800 px-10 py-3.5 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors active:scale-95 shadow-sm"
                                >
                                    Daftar Pendonor
                                </Link>
                                <Link 
                                    href="/login" 
                                    className="border-2 border-white/20 text-white px-10 py-3.5 rounded-xl font-bold text-xs hover:bg-white/10 transition-colors active:scale-95"
                                >
                                    Portal Rumah Sakit / PMI
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-[#2b2d2d] border-t border-slate-200 dark:border-[#414343] text-slate-500 dark:text-slate-400 transition-colors duration-300">
                    <div className="grid grid-cols-12 gap-6 px-6 md:px-12 py-16 w-full">
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                            <span className="text-xl font-bold text-rose-800 dark:text-rose-400 flex items-center" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                <img 
                                    alt="MARIDONOR Logo" 
                                    className="h-6 w-auto inline-block mr-2" 
                                    src="/images/logo_icon.png"
                                    onError={(e) => {
                                        (e.target as HTMLElement).style.display = 'none';
                                    }}
                                />
                                MARIDONOR
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs font-light leading-relaxed">
                                Ekosistem digital berkelas dunia untuk manajemen rantai pasok medis kritis dan koordinasi kerelawanan nasional.
                            </p>
                        </div>
                        <div className="col-span-6 md:col-span-3 lg:col-span-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                Halaman Utama
                            </h4>
                            <ul className="flex flex-col gap-3 text-xs font-medium">
                                <li><a className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors" href="#">Dokumentasi</a></li>
                                <li><a className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors" href="#">Peta Unit UDD</a></li>
                                <li><a className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors" href="#">Artikel Medis</a></li>
                            </ul>
                        </div>
                        <div className="col-span-6 md:col-span-3 lg:col-span-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                Jaringan Mitra
                            </h4>
                            <ul className="flex flex-col gap-3 text-xs font-medium">
                                <li><a className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors" href="#">Mitra PMI</a></li>
                                <li><a className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors" href="#">Rumah Sakit</a></li>
                                <li><a className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors" href="#">Kemitraan Baru</a></li>
                            </ul>
                        </div>
                        <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                Berlangganan Informasi
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-light leading-relaxed">
                                Dapatkan berita darurat ketersediaan stok golongan darah langka dan pemberitahuan donor di wilayah Anda.
                            </p>
                            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                                <input 
                                    className="flex-grow bg-slate-100 dark:bg-[#414343] border border-slate-200 dark:border-transparent rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-white focus:ring-1 focus:ring-rose-600 outline-none" 
                                    placeholder="Alamat Email Anda" 
                                    type="email"
                                />
                                <button className="bg-rose-700 dark:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:brightness-105 active:scale-95 transition-all">
                                    Gabung
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="px-6 md:px-12 py-6 border-t border-slate-200 dark:border-[#414343] flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <span className="text-slate-450">&copy; {new Date().getFullYear()} MARIDONOR. Seluruh Hak Cipta Dilindungi.</span>
                        <div className="flex gap-6">
                            <a className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors" href="#">Kebijakan Privasi</a>
                            <a className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors" href="#">Syarat & Ketentuan</a>
                            <a className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors" href="#">Kontak Bantuan</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
