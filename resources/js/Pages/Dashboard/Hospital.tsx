import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

interface Metrics {
    total_requests_sent: number;
    total_requests_fulfilled: number;
    active_requests_count: number;
    hospital_stock_bags: number;
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

export default function HospitalDashboard({ metrics, auth }: Props) {
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <>
            <Head>
                <title>Dashboard Rumah Sakit - Maridonor</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            
            <DashboardLayout
                sidebarType="hospital"
                title="Hospital Dashboard"
                subtitle="RS Immanuel Bandung — Portal Pengelolaan Permohonan Darah RS"
            >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Stat 1 */}
                    <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg relative group overflow-hidden transition-colors">
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-650/5 rounded-full blur-xl group-hover:bg-red-655/10 transition duration-305"></div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold theme-text-muted uppercase tracking-wider block">Permohonan Dikirim</span>
                            <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">✉️</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-extrabold theme-text-main">{metrics.total_requests_sent} Berkas</p>
                            <p className="text-xs theme-text-muted font-semibold">&bull; Akumulasi permohonan darah</p>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg relative group overflow-hidden transition-colors">
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-655/5 rounded-full blur-xl group-hover:bg-red-655/10 transition duration-305"></div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold theme-text-muted uppercase tracking-wider block">Permohonan Dipenuhi</span>
                            <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">✅</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-extrabold theme-text-main">{metrics.total_requests_fulfilled} Berkas</p>
                            <p className="text-xs text-green-500 font-semibold">&bull; Sukses didistribusi PMI</p>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg relative group overflow-hidden transition-colors">
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-655/5 rounded-full blur-xl group-hover:bg-red-655/10 transition duration-305"></div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold theme-text-muted uppercase tracking-wider block">Permohonan Aktif</span>
                            <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">🚨</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-extrabold theme-text-main">{metrics.active_requests_count} Berkas</p>
                            <p className="text-xs text-red-550 font-semibold">&bull; Sedang diproses PMI</p>
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg relative group overflow-hidden transition-colors">
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-red-655/5 rounded-full blur-xl group-hover:bg-red-655/10 transition duration-305"></div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold theme-text-muted uppercase tracking-wider block">Stok Bank Darah RS</span>
                            <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">🩺</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-3xl font-extrabold theme-text-main">{metrics.hospital_stock_bags} Kantong</p>
                            <p className="text-xs theme-text-muted font-semibold">&bull; internal Rumah Sakit</p>
                        </div>
                    </div>
                </div>

                {/* Table Tracking & Live Status */}
                <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg space-y-6 transition-colors">
                    <div>
                        <h3 className="font-bold theme-text-main text-base">Monitoring Permohonan Darah RS</h3>
                        <p className="text-xs theme-text-muted">Status real-time pengiriman dan alokasi kantong darah darurat</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                    <th className="py-3 px-4">Kode Request</th>
                                    <th className="py-3 px-4">Pasien</th>
                                    <th className="py-3 px-4">Gol. Darah</th>
                                    <th className="py-3 px-4">Kebutuhan</th>
                                    <th className="py-3 px-4">Tingkat Urgensi</th>
                                    <th className="py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y theme-divide-main">
                                <tr className="hover:bg-slate-500/5 transition">
                                    <td className="py-4 px-4 font-semibold theme-text-main">REQ-001</td>
                                    <td className="py-4 px-4 theme-text-muted">Budi Santoso</td>
                                    <td className="py-4 px-4 theme-text-main font-bold">O+ (PRC)</td>
                                    <td className="py-4 px-4 theme-text-muted font-medium">1 / 4 Kantong</td>
                                    <td className="py-4 px-4">
                                        <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold uppercase animate-pulse">Emergency</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-[10px] bg-yellow-500/15 text-yellow-600 dark:text-yellow-500 px-2 py-0.5 rounded font-bold uppercase">Open</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-500/5 transition">
                                    <td className="py-4 px-4 font-semibold theme-text-main">REQ-002</td>
                                    <td className="py-4 px-4 theme-text-muted">Siti Rahma</td>
                                    <td className="py-4 px-4 theme-text-main font-bold">A+ (PRC)</td>
                                    <td className="py-4 px-4 theme-text-muted font-medium">2 / 2 Kantong</td>
                                    <td className="py-4 px-4">
                                        <span className="text-[10px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded font-bold uppercase">Urgent</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-[10px] bg-green-500/15 text-green-600 dark:text-green-500 px-2 py-0.5 rounded font-bold uppercase">Fulfilled</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
