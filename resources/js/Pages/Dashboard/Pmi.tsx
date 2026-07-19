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
            
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased relative overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
                
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-red-600/5 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-rose-600/5 blur-3xl pointer-events-none"></div>

                {/* Sidebar Menu (Responsive) */}
                <aside className="w-full lg:w-64 bg-slate-900/60 border-b lg:border-b-0 lg:border-r border-slate-900 backdrop-blur-xl flex flex-col relative z-20">
                    <div className="p-6 border-b border-slate-900 flex items-center space-x-3.5">
                        <div className="p-2 bg-gradient-to-br from-red-500/10 to-rose-600/10 rounded-xl border border-red-500/20">
                            <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-7 w-auto" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-white">
                            Mari<span className="text-red-500">donor</span>
                        </span>
                    </div>

                    <div className="flex-1 p-4 space-y-1.5">
                        <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Menu Utama</span>
                        <Link href="/dashboard/pmi" className="flex items-center space-x-3 px-3 py-2.5 bg-gradient-to-r from-red-600/15 to-rose-600/5 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">
                            <span>📊</span>
                            <span>Ikhtisar Dashboard</span>
                        </Link>
                        <Link href="/blood-stocks" className="flex items-center space-x-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold transition duration-150">
                            <span>🩸</span>
                            <span>Kelola Stok Darah</span>
                        </Link>
                        <Link href="/blood-requests" className="flex items-center space-x-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold transition duration-150">
                            <span>🚨</span>
                            <span>Permohonan Darah</span>
                        </Link>
                        <Link href="/schedules" className="flex items-center space-x-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold transition duration-150">
                            <span>📅</span>
                            <span>Slot Jadwal Donor</span>
                        </Link>
                    </div>

                    <div className="p-4 border-t border-slate-900">
                        <form onSubmit={handleLogout}>
                            <button type="submit" className="w-full py-2.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl border border-slate-800/80 transition duration-150 flex items-center justify-center space-x-2">
                                <span>🚪</span>
                                <span>Keluar Akun</span>
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto relative z-10">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">PMI Dashboard</h1>
                            <p className="text-sm text-slate-400">Unit Donor Darah PMI Kota Bandung — Logistik Bank Darah Terpadu</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3.5 bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-2xl backdrop-blur-lg">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold text-slate-300">Staff Aktif: {auth.user.name}</span>
                            </div>
                            <ThemeSwitcher />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Stat 1 */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-lg relative group overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-600/5 rounded-full blur-xl group-hover:bg-red-600/10 transition duration-300"></div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Stok Tersedia</span>
                                <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">🩸</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl lg:text-4xl font-extrabold text-white">{metrics.total_available_stock_bags} Kantong</p>
                                <p className="text-xs text-green-500 font-semibold">&bull; Siap didistribusikan ke rumah sakit</p>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-lg relative group overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-600/5 rounded-full blur-xl group-hover:bg-red-600/10 transition duration-300"></div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Permohonan Aktif</span>
                                <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">🚨</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl lg:text-4xl font-extrabold text-white">{metrics.active_requests_count} Berkas</p>
                                <p className="text-xs text-red-500 font-semibold">&bull; Butuh pemenuhan darurat segera</p>
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-lg relative group overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-600/5 rounded-full blur-xl group-hover:bg-red-600/10 transition duration-300"></div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pendonor Terdaftar</span>
                                <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">👥</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl lg:text-4xl font-extrabold text-white">{metrics.total_registered_donors} Jiwa</p>
                                <p className="text-xs text-slate-400 font-semibold">&bull; Anggota pendonor aktif PMI</p>
                            </div>
                        </div>
                    </div>

                    {/* Chart & Live Logs */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Trend Chart (SVG Batang Dinamis) */}
                        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-6">
                            <div>
                                <h3 className="font-bold text-white text-base">Tren Donasi Darah</h3>
                                <p className="text-xs text-slate-400">Total donasi sukses selama 6 bulan terakhir</p>
                            </div>

                            {/* Grafik Batang */}
                            <div className="h-64 flex items-end justify-between gap-2 pt-6 border-b border-slate-800/50">
                                {metrics.donation_trends.map((trend) => {
                                    const percentageHeight = (trend.total / maxDonations) * 100;
                                    return (
                                        <div key={trend.month} className="flex-1 flex flex-col items-center space-y-3 group">
                                            {/* tooltip */}
                                            <span className="text-[10px] font-bold text-slate-200 bg-slate-950 border border-slate-850 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition duration-150 mb-1">
                                                {trend.total} Bag
                                            </span>
                                            {/* bar */}
                                            <div 
                                                style={{ height: `${percentageHeight}%` }} 
                                                className="w-full max-w-[40px] bg-gradient-to-t from-red-650 to-rose-500 rounded-t-lg group-hover:from-red-500 group-hover:to-rose-450 transition-all duration-300 shadow-lg shadow-red-600/10"
                                            ></div>
                                            {/* month text */}
                                            <span className="text-[10px] font-bold text-slate-400">{trend.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Requests list */}
                        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-6 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-white text-base">Log Permintaan Baru</h3>
                                    <p className="text-xs text-slate-400">Kebutuhan kritis dari Rumah Sakit</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-4 bg-red-950/15 border border-red-900/25 rounded-2xl space-y-2 relative overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-red-400">REQ-EMERGENCY</span>
                                            <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold uppercase animate-pulse">Open</span>
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium">Mitra Rumah Sakit membutuhkan alokasi kantong darah segera.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <Link href="/blood-requests" className="block w-full py-3 text-center text-xs font-bold text-red-500 hover:text-red-400 bg-red-600/5 hover:bg-red-600/10 border border-red-500/10 rounded-xl transition duration-150">
                                Proses Permintaan Darah
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
