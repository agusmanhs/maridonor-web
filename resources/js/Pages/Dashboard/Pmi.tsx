import React from 'react';
import { Head, router, Link } from '@inertiajs/react';

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

    // Cari nilai tertinggi untuk kalkulasi skala grafik batang SVG
    const maxDonations = metrics.donation_trends.length > 0 
        ? Math.max(...metrics.donation_trends.map(t => t.total))
        : 10;

    return (
        <>
            <Head title="Dashboard PMI - Maridonor" />
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans antialiased selection:bg-red-600 selection:text-white">
                
                {/* Sidebar Menu (Responsive) */}
                <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col">
                    <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
                        <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-8 w-auto" />
                        <span className="text-lg font-bold tracking-tight text-white">
                            Mari<span className="text-red-500">donor</span>
                        </span>
                    </div>

                    <div className="flex-1 p-4 space-y-1.5">
                        <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Menu Utama</span>
                        <Link href="/dashboard/pmi" className="flex items-center space-x-3 px-3 py-2.5 bg-red-600/10 text-red-500 rounded-xl text-sm font-semibold border border-red-500/10">
                            <span>📊</span>
                            <span>Ikhtisar Dashboard</span>
                        </Link>
                        <Link href="/blood-stocks" className="flex items-center space-x-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold transition duration-150">
                            <span>🩸</span>
                            <span>Kelola Stok Darah</span>
                        </Link>
                        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold transition duration-150">
                            <span>🚨</span>
                            <span>Permohonan Darah</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold transition duration-150">
                            <span>📅</span>
                            <span>Slot Jadwal Donor</span>
                        </a>
                    </div>

                    <div className="p-4 border-t border-slate-800">
                        <form onSubmit={handleLogout}>
                            <button type="submit" className="w-full py-2.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl border border-slate-800 transition duration-150 flex items-center justify-center space-x-2">
                                <span>🚪</span>
                                <span>Keluar Akun</span>
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">PMI Dashboard</h1>
                            <p className="text-sm text-slate-400">UDD PMI Kota Bandung — Pemantauan Stok & Permintaan Aktif</p>
                        </div>
                        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-300">Staff Aktif: {auth.user.name}</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Stat 1 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Stok Tersedia</span>
                                <span className="text-xl">🩸</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl lg:text-4xl font-extrabold text-white">{metrics.total_available_stock_bags} Kantong</p>
                                <p className="text-xs text-green-500 font-semibold">&bull; Siap didistribusikan ke rumah sakit</p>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Permohonan Aktif</span>
                                <span className="text-xl">🚨</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl lg:text-4xl font-extrabold text-white">{metrics.active_requests_count} Berkas</p>
                                <p className="text-xs text-red-500 font-semibold">&bull; Butuh pemenuhan darurat segera</p>
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendonor Terdaftar</span>
                                <span className="text-xl">👥</span>
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
                        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                            <div>
                                <h3 className="font-bold text-white">Tren Donasi Darah</h3>
                                <p className="text-xs text-slate-400">Total donasi sukses selama 6 bulan terakhir</p>
                            </div>

                            {/* Grafik Batang */}
                            <div className="h-64 flex items-end justify-between gap-2 pt-6 border-b border-slate-800">
                                {metrics.donation_trends.map((trend) => {
                                    const percentageHeight = (trend.total / maxDonations) * 100;
                                    return (
                                        <div key={trend.month} className="flex-1 flex flex-col items-center space-y-3 group">
                                            {/* tooltip */}
                                            <span className="text-[10px] font-bold text-slate-200 bg-slate-950 border border-slate-850 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition duration-150 mb-1">
                                                {trend.total} Bag
                                            </span>
                                            {/* bar */}
                                            <div 
                                                style={{ height: `${percentageHeight}%` }} 
                                                className="w-full max-w-[40px] bg-gradient-to-t from-red-600 to-rose-500 rounded-t-lg group-hover:from-red-500 group-hover:to-rose-450 transition-all duration-300 shadow-lg shadow-red-600/10"
                                            ></div>
                                            {/* month text */}
                                            <span className="text-[10px] font-bold text-slate-400">{trend.month}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Requests list */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-white">Log Permintaan Baru</h3>
                                    <p className="text-xs text-slate-400">Kebutuhan kritis dari Rumah Sakit</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-xl space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-red-400">REQ-001 (Emergency)</span>
                                            <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold">Open</span>
                                        </div>
                                        <p className="text-xs text-slate-300">RS Immanuel membutuhkan **4 kantong O+ PRC**</p>
                                        <p className="text-[10px] text-slate-500">Pasien: Budi Santoso</p>
                                    </div>
                                </div>
                            </div>
                            
                            <a href="#" className="block w-full py-2.5 text-center text-xs font-semibold text-red-500 hover:text-red-400 bg-red-600/5 hover:bg-red-600/10 rounded-xl transition duration-150">
                                Proses Permintaan Darah
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
