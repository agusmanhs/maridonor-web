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
                <title>Beranda - Maridonor</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen theme-bg-main theme-text-main selection:bg-red-650 selection:text-white antialiased relative overflow-hidden transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
                
                {/* Decorative Glowing Orbs */}
                <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none"></div>
                <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rose-600/5 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-red-500/5 blur-[110px] pointer-events-none"></div>

                {/* Navbar Sticky Glassmorphic */}
                <header className="sticky top-0 z-50 backdrop-blur-xl theme-bg-main/60 border-b theme-border-main transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 group cursor-pointer">
                            <div className="p-2.5 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl shadow-lg shadow-red-600/10 group-hover:shadow-red-600/20 transition-all duration-300 group-hover:scale-105">
                                <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-6 w-auto filter brightness-0 invert" />
                            </div>
                            <span className="text-2xl font-black tracking-tight theme-text-main">
                                Mari<span className="text-red-600 bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">donor</span>
                            </span>
                        </div>

                        {/* Mid Navigation Links */}
                        <div className="hidden md:flex items-center space-x-1.5 p-1 bg-slate-500/5 rounded-2xl border theme-border-main backdrop-blur-md">
                            <a href="#features" className="px-4 py-2 text-xs font-bold theme-text-muted hover:theme-text-main hover:bg-slate-500/10 rounded-xl transition-all duration-200">
                                🌟 Fitur Utama
                            </a>
                            <a href="#news" className="px-4 py-2 text-xs font-bold theme-text-muted hover:theme-text-main hover:bg-slate-500/10 rounded-xl transition-all duration-200">
                                📢 Info & Berita
                            </a>
                        </div>

                        {/* Right Auth CTA / Actions */}
                        <nav className="flex items-center space-x-4">
                            {auth.user ? (
                                <div className="flex items-center space-x-4">
                                    <div className="hidden lg:block text-right">
                                        <p className="text-xs font-bold theme-text-main leading-none mb-0.5">{auth.user.name}</p>
                                        <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded capitalize">
                                            {auth.user.role.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <Link 
                                        href={auth.user.role === 'donor' ? '/dashboard/donor' : (auth.user.role.includes('pmi') ? '/dashboard/pmi' : '/dashboard/hospital')}
                                        className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 rounded-xl shadow-md shadow-red-600/10 transition duration-150 active:scale-95"
                                    >
                                        Dashboard
                                    </Link>
                                    <form onSubmit={handleLogout}>
                                        <button 
                                            type="submit" 
                                            className="p-2 text-xs font-bold theme-text-muted hover:theme-text-main transition duration-150 rounded-xl hover:bg-slate-500/5"
                                            title="Keluar"
                                        >
                                            🚪
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <Link 
                                    href="/login" 
                                    className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 rounded-xl shadow-lg shadow-red-600/15 transition-all duration-200 active:scale-95"
                                >
                                    Portal Masuk
                                </Link>
                            )}
                            <div className="h-6 w-[1px] bg-slate-500/20 hidden sm:block"></div>
                            <ThemeSwitcher />
                        </nav>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 relative z-10 space-y-32">
                    
                    {/* Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-500/5 border border-red-500/20 text-red-500 text-xs font-bold">
                                <span>🩸</span>
                                <span>Platform Logistik Donor Darah Nasional</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tight theme-text-main leading-[1.05]">
                                Setetes <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-650">Darah</span>,<br />
                                Satu Kehidupan.
                            </h1>

                            <p className="text-base sm:text-lg theme-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                                Platform cerdas yang menghubungkan pendonor secara langsung dengan Unit Donor Darah PMI dan Rumah Sakit. Mempercepat proses pemesanan & penyaluran darah darurat secara real-time.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <Link 
                                    href="/login" 
                                    className="px-8 py-4 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 rounded-2xl shadow-xl shadow-red-600/20 text-center transition-all duration-200 active:scale-95"
                                >
                                    Gabung Pendonor / Staf
                                </Link>
                                <a 
                                    href="#news" 
                                    className="px-8 py-4 text-xs font-bold theme-text-main theme-bg-card hover:bg-slate-500/10 rounded-2xl border theme-border-main text-center transition duration-150 shadow-sm"
                                >
                                    Lihat Berita & Event
                                </a>
                            </div>

                            {/* Live Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t theme-border-main max-w-md mx-auto lg:mx-0">
                                <div className="text-center lg:text-left space-y-1">
                                    <p className="text-3xl font-black theme-text-main">150+</p>
                                    <p className="text-[10px] font-bold theme-text-muted uppercase tracking-widest">Pendonor Aktif</p>
                                </div>
                                <div className="text-center lg:text-left space-y-1">
                                    <p className="text-3xl font-black theme-text-main">48+</p>
                                    <p className="text-[10px] font-bold theme-text-muted uppercase tracking-widest">PMI & RS Mitra</p>
                                </div>
                                <div className="text-center lg:text-left space-y-1">
                                    <p className="text-3xl font-black theme-text-main">1.5K</p>
                                    <p className="text-[10px] font-bold theme-text-muted uppercase tracking-widest">Kantung Disalurkan</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Visual Graphic Card */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-red-600/20 to-rose-600/5 rounded-[2.5rem] blur-2xl opacity-40"></div>
                            <div className="relative w-full max-w-md theme-bg-card border theme-border-card rounded-[2rem] p-8 shadow-2xl space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b theme-border-main">
                                    <div className="flex items-center space-x-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                                        <h3 className="font-extrabold theme-text-main text-xs uppercase tracking-widest">Stok Darah Darurat Nasional</h3>
                                    </div>
                                    <span className="text-[9px] text-red-500 bg-red-500/10 px-2 py-0.5 rounded font-black uppercase">Live</span>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { type: 'A (Positif)', count: 12, percent: 'w-4/5', color: 'from-red-600 to-rose-600' },
                                        { type: 'B (Positif)', count: 8, percent: 'w-3/5', color: 'from-red-500 to-orange-500' },
                                        { type: 'AB (Positif)', count: 4, percent: 'w-2/5', color: 'from-rose-500 to-rose-700' },
                                        { type: 'O (Positif)', count: 18, percent: 'w-[92%]', color: 'from-red-600 via-rose-600 to-red-500' },
                                    ].map((stock) => (
                                        <div key={stock.type} className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="theme-text-muted">{stock.type}</span>
                                                <span className="theme-text-main">{stock.count} Kantong</span>
                                            </div>
                                            <div className="w-full theme-bg-main h-3.5 rounded-full overflow-hidden p-[1px] border theme-border-main">
                                                <div className={`h-full ${stock.percent} bg-gradient-to-r ${stock.color} rounded-full`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* News & Info Section (Brought Up front for better content flow) */}
                    <div id="news" className="py-12 border-t theme-border-main grid grid-cols-1 lg:grid-cols-3 gap-12">
                        
                        {/* Articles Column (Left 2/3) */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-2 text-center lg:text-left">
                                <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">📚 Artikel & Edukasi</span>
                                <h2 className="text-3xl font-black theme-text-main tracking-tight">Kesehatan & Informasi Pendonor</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {articles.length === 0 ? (
                                    <div className="p-8 rounded-3xl border theme-border-card theme-bg-card theme-text-muted text-sm font-semibold col-span-2 text-center">
                                        📰 Belum ada artikel edukasi dipublikasikan saat ini.
                                    </div>
                                ) : (
                                    articles.map((art) => (
                                        <div key={art.id} className="p-6 rounded-[2rem] theme-bg-card border theme-border-card flex flex-col justify-between space-y-5 hover:-translate-y-1.5 hover:border-red-500/20 transition-all duration-300 shadow-sm hover:shadow-lg">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-black uppercase">
                                                        {art.category}
                                                    </span>
                                                    <span className="text-[10px] theme-text-muted font-mono">
                                                        {new Date(art.created_at).toLocaleDateString('id-ID', { month: 'long', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h4 className="font-extrabold text-base theme-text-main line-clamp-2 leading-snug">{art.title}</h4>
                                                <p className="text-xs theme-text-muted line-clamp-3 leading-relaxed font-light">{art.excerpt}</p>
                                            </div>
                                            <Link href="/login" className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center space-x-1 pt-2 w-fit">
                                                <span>Baca Artikel</span>
                                                <span>&rarr;</span>
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Announcements Column (Right 1/3) */}
                        <div className="space-y-8">
                            <div className="space-y-2 text-center lg:text-left">
                                <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">📢 Pengumuman Resmi</span>
                                <h2 className="text-3xl font-black theme-text-main tracking-tight">Siaran & Event</h2>
                            </div>

                            <div className="space-y-4">
                                {announcements.length === 0 ? (
                                    <div className="p-8 rounded-3xl border theme-border-card theme-bg-card theme-text-muted text-sm font-semibold text-center">
                                        🔔 Tidak ada pengumuman aktif saat ini.
                                    </div>
                                ) : (
                                    announcements.map((ann) => (
                                        <div key={ann.id} className="p-6 rounded-2xl theme-bg-card border theme-border-card space-y-3 relative overflow-hidden shadow-sm hover:shadow-md hover:border-slate-500/20 transition-all">
                                            {ann.is_pinned && (
                                                <div className="absolute top-0 right-0 w-8 h-8 bg-red-650/10 rounded-bl-2xl flex items-center justify-center text-xs">
                                                    📌
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                                    ann.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                                                    ann.type === 'event' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-green-500/10 text-green-500'
                                                }`}>
                                                    {ann.type}
                                                </span>
                                                <span className="text-[9px] theme-text-muted font-mono">
                                                    {new Date(ann.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <h4 className="font-extrabold text-sm theme-text-main leading-tight line-clamp-2">{ann.title}</h4>
                                            <p className="text-xs theme-text-muted line-clamp-3 leading-relaxed font-light">{ann.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Features Section */}
                    <div id="features" className="py-12 border-t theme-border-main space-y-16">
                        <div className="max-w-3xl space-y-4 text-center lg:text-left">
                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">🛡️ Manfaat & Keunggulan</span>
                            <h2 className="text-3xl lg:text-4xl font-black theme-text-main tracking-tight">Solusi Ekosistem Donor Darah</h2>
                            <p className="text-sm theme-text-muted leading-relaxed font-light">
                                Kami merancang platform Maridonor untuk memangkas birokrasi logistik darah darurat dan memberikan kenyamanan maksimal bagi para pendonor.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Pencarian Instan', desc: 'Pemantauan stok kantong darah secara akurat untuk kebutuhan darurat di Rumah Sakit.', icon: '🔍', color: 'bg-red-500' },
                                { title: 'Verifikasi KYC Cepat', desc: 'Sistem verifikasi berkas identitas tingkat 1 terintegrasi langsung untuk pendonor.', icon: '🛡️', color: 'bg-purple-500' },
                                { title: 'Schedules & Booking', desc: 'Pendonor dapat memesan antrean donor mandiri lewat aplikasi untuk menghindari antrean panjang.', icon: '📅', color: 'bg-orange-500' },
                                { title: 'Loyalty & Reward', desc: 'Kumpulkan poin loyalty untuk setiap donasi dan tukarkan dengan sertifikat penghargaan digital.', icon: '🏆', color: 'bg-emerald-500' },
                            ].map((feat, idx) => (
                                <div key={idx} className="theme-bg-card border theme-border-card p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start relative group">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/5 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                                        {feat.icon}
                                    </div>
                                    <h4 className="text-base font-extrabold theme-text-main mb-3 leading-tight">{feat.title}</h4>
                                    <p className="text-xs theme-text-muted leading-relaxed flex-1 mb-8 font-light">{feat.desc}</p>
                                    
                                    {/* Accent Bar at bottom */}
                                    <div className={`absolute bottom-8 left-8 h-1 w-6 rounded-full ${feat.color}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Footer Section */}
                <footer className="border-t theme-border-main bg-slate-500/5 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl">
                                <img src="/images/logo_icon.png" alt="Logo icon" className="h-5 w-auto filter brightness-0 invert" />
                            </div>
                            <span className="text-base font-bold theme-text-main">
                                Mari<span className="text-red-650 bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">donor</span>
                            </span>
                        </div>
                        <p className="text-xs theme-text-muted text-center sm:text-right font-light">
                            &copy; {new Date().getFullYear()} Maridonor. Seluruh hak cipta dilindungi undang-undang.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
