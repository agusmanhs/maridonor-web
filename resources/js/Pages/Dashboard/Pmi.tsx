import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

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
            
            <DashboardLayout 
                sidebarType="pmi"
                title="PMI Dashboard"
                subtitle="Unit Donor Darah PMI Kota Bandung — Logistik Bank Darah Terpadu"
            >
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

                    {/* Komposisi Stok Golongan Darah */}
                    <div className="lg:col-span-2 p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg space-y-4">
                        <div>
                            <h3 className="font-bold theme-text-main text-base">Komposisi Stok Golongan Darah</h3>
                            <p className="text-xs theme-text-muted">Distribusi ketersediaan kantong darah berdasarkan golongan darah utama</p>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {['A', 'B', 'AB', 'O'].map((group) => {
                                const share = group === 'O' ? 40 : group === 'A' ? 25 : group === 'B' ? 25 : 10;
                                const count = Math.round((metrics.total_available_stock_bags * share) / 100);
                                return (
                                    <div key={group} className="p-4 bg-slate-500/5 rounded-2xl border theme-border-main flex flex-col justify-between">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-black text-red-500">{group}</span>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                                                {share}%
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <span className="text-xs theme-text-muted block">Jumlah Stok</span>
                                            <span className="text-lg font-black theme-text-main">{count} Bag</span>
                                        </div>
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
            </DashboardLayout>
        </>
    );
}
