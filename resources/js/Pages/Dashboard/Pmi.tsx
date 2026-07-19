import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import ThemeSwitcher from '../../Components/ThemeSwitcher';

interface Trend {
    month: string;
    total: number;
}

interface Metrics {
    total_available_stock_bags: number;
    active_requests_count: number;
    total_registered_donors: number;
    donation_trends: Trend[];
}

interface User {
    name: string;
    email: string;
    role: string;
}

interface Props {
    metrics: Metrics;
    auth: {
        user: User;
    };
}

export default function PmiDashboard({ metrics, auth }: Props) {
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const maxDonations = metrics.donation_trends.length > 0 
        ? Math.max(...metrics.donation_trends.map(t => t.total))
        : 10;

    return (
        <>
            <Head>
                <title>Dashboard PMI - Maridonor</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen theme-bg-main theme-text-main flex flex-col lg:flex-row antialiased relative overflow-hidden transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
                
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-red-600/5 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-rose-600/5 blur-3xl pointer-events-none"></div>

                {/* Sidebar Menu (Responsive) */}
                <aside className="w-full lg:w-64 theme-bg-sidebar border-b lg:border-b-0 lg:border-r theme-border-main backdrop-blur-xl flex flex-col relative z-20 transition-colors duration-300">
                    <div className="p-6 border-b theme-border-main flex items-center space-x-3.5">
                        <div className="p-2 bg-gradient-to-br from-red-500/10 to-rose-600/10 rounded-xl border border-red-500/20">
                            <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-7 w-auto" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight theme-text-main">
                            Mari<span className="text-red-500">donor</span>
                        </span>
                    </div>

                    <div className="flex-1 p-4 space-y-1.5">
                        <span className="px-3 text-[10px] font-bold theme-text-muted uppercase tracking-wider block mb-2">Menu Utama</span>
                        <Link href="/dashboard/pmi" className="flex items-center space-x-3 px-3 py-2.5 bg-gradient-to-r from-red-500/10 to-rose-500/5 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">
                            <span>📊</span>
                            <span>Ikhtisar Dashboard</span>
                        </Link>
                        <Link href="/blood-stocks" className="flex items-center space-x-3 px-3 py-2.5 theme-text-muted hover:theme-text-main hover:bg-slate-500/10 rounded-xl text-sm font-semibold transition duration-150">
                            <span>🩸</span>
                            <span>Kelola Stok Darah</span>
                        </Link>
                        <Link href="/blood-requests" className="flex items-center space-x-3 px-3 py-2.5 theme-text-muted hover:theme-text-main hover:bg-slate-500/10 rounded-xl text-sm font-semibold transition duration-150">
                            <span>🚨</span>
                            <span>Permohonan Darah</span>
                        </Link>
                        <Link href="/schedules" className="flex items-center space-x-3 px-3 py-2.5 theme-text-muted hover:theme-text-main hover:bg-slate-500/10 rounded-xl text-sm font-semibold transition duration-150">
                            <span>📅</span>
                            <span>Slot Jadwal Donor</span>
                        </Link>
                    </div>

                    <div className="p-4 border-t theme-border-main">
                        <form onSubmit={handleLogout}>
                            <button type="submit" className="w-full py-2.5 text-sm font-semibold theme-text-muted hover:theme-text-main hover:bg-slate-500/10 rounded-xl border theme-border-main transition duration-150 flex items-center justify-center space-x-2">
                                <span>🚪</span>
                                <span>Keluar Akun</span>
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto relative z-10">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b theme-border-main">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold theme-text-main tracking-tight font-serif">PMI Dashboard</h1>
                            <p className="text-sm theme-text-muted">Unit Donor Darah PMI Kota Bandung — Logistik Bank Darah Terpadu</p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3.5 theme-bg-card border theme-border-card px-4 py-2.5 rounded-2xl backdrop-blur-lg">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold theme-text-muted">Staff Aktif: {auth.user.name}</span>
                            </div>
                            <ThemeSwitcher />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Stat 1 */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg relative group overflow-hidden transition-colors">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-650/5 rounded-full blur-xl group-hover:bg-red-650/10 transition duration-300"></div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold theme-text-muted uppercase tracking-wider block">Total Stok Tersedia</span>
                                <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">🩸</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl lg:text-4xl font-extrabold theme-text-main">{metrics.total_available_stock_bags} Kantong</p>
                                <p className="text-xs text-green-505 font-semibold">&bull; Siap didistribusikan ke rumah sakit</p>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg relative group overflow-hidden transition-colors">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-650/5 rounded-full blur-xl group-hover:bg-red-650/10 transition duration-300"></div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold theme-text-muted uppercase tracking-wider block">Permohonan Aktif</span>
                                <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">🚨</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl lg:text-4xl font-extrabold theme-text-main">{metrics.active_requests_count} Berkas</p>
                                <p className="text-xs text-red-550 font-semibold">&bull; Butuh pemenuhan darurat segera</p>
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg relative group overflow-hidden transition-colors">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-650/5 rounded-full blur-xl group-hover:bg-red-650/10 transition duration-300"></div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold theme-text-muted uppercase tracking-wider block">Pendonor Terdaftar</span>
                                <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">👥</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl lg:text-4xl font-extrabold theme-text-main">{metrics.total_registered_donors} Jiwa</p>
                                <p className="text-xs theme-text-muted font-semibold">&bull; Anggota pendonor aktif PMI</p>
                            </div>
                        </div>
                    </div>

                    {/* Chart & Live Logs */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Trend Chart (SVG Batang Dinamis) */}
                        <div className="lg:col-span-2 p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg space-y-6">
                            <div>
                                <h3 className="font-bold theme-text-main text-base">Tren Donasi Darah</h3>
                                <p className="text-xs theme-text-muted">Total donasi sukses selama 6 bulan terakhir</p>
                            </div>

                            {/* Grafik Batang */}
                            <div className="h-64 flex items-end justify-between gap-2 pt-6 border-b theme-border-main">
                                {metrics.donation_trends.map((trend) => {
                                    const percentageHeight = (trend.total / maxDonations) * 100;
                                    return (
                                        <div key={trend.month} className="flex-1 flex flex-col items-center space-y-3 group">
                                            {/* tooltip */}
                                            <span className="text-[10px] font-bold theme-text-main theme-bg-main border theme-border-main px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition duration-150 mb-1">
                                                {trend.total} Bag
                                            </span>
                                            {/* bar */}
                                            <div 
                                                style={{ height: `${percentageHeight}%` }} 
                                                className="w-full max-w-[40px] bg-gradient-to-t from-red-600 to-rose-500 rounded-t-lg group-hover:from-red-500 group-hover:to-rose-450 transition-all duration-300 shadow-lg shadow-red-600/10"
                                            ></div>
                                            {/* month text */}
                                            <span className="text-[10px] font-bold theme-text-muted">{trend.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Requests list */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg space-y-6 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold theme-text-main text-base">Log Permintaan Baru</h3>
                                    <p className="text-xs theme-text-muted">Kebutuhan kritis dari Rumah Sakit</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-4 bg-red-950/10 border border-red-900/20 rounded-2xl space-y-2 relative overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-red-500">REQ-EMERGENCY</span>
                                            <span className="text-[9px] bg-red-500/15 text-red-500 px-2 py-0.5 rounded font-bold uppercase animate-pulse">Open</span>
                                        </div>
                                        <p className="text-xs theme-text-muted font-medium">Mitra Rumah Sakit membutuhkan alokasi kantong darah segera.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <Link href="/blood-requests" className="block w-full py-3 text-center text-xs font-bold text-red-550 hover:text-red-500 bg-red-500/10 hover:bg-red-500/15 border border-red-555/20 rounded-xl transition duration-150">
                                Proses Permintaan Darah
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
