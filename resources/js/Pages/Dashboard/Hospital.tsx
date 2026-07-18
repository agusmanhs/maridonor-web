import React from 'react';
import { Head, router } from '@inertiajs/react';

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
            <Head title="Dashboard Rumah Sakit - Maridonor" />
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
                        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 bg-red-600/10 text-red-500 rounded-xl text-sm font-semibold border border-red-500/10">
                            <span>📊</span>
                            <span>Ikhtisar Dashboard</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold transition duration-150">
                            <span>🚨</span>
                            <span>Ajukan Permohonan</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold transition duration-150">
                            <span>🩺</span>
                            <span>Stok Bank Darah RS</span>
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
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Hospital Dashboard</h1>
                            <p className="text-sm text-slate-400">RS Immanuel Bandung — Bank Darah & Permintaan Pasien</p>
                        </div>
                        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-300">Staff RS: {auth.user.name}</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        
                        {/* Stat 1 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Permohonan Dikirim</span>
                                <span className="text-xl">✉️</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-extrabold text-white">{metrics.total_requests_sent} Berkas</p>
                                <p className="text-xs text-slate-400 font-semibold">&bull; Akumulasi permohonan darah</p>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Permohonan Dipenuhi</span>
                                <span className="text-xl">✅</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-extrabold text-white">{metrics.total_requests_fulfilled} Berkas</p>
                                <p className="text-xs text-green-500 font-semibold">&bull; Sukses didistribusi PMI</p>
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Permohonan Aktif</span>
                                <span className="text-xl">🚨</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-extrabold text-white">{metrics.active_requests_count} Berkas</p>
                                <p className="text-xs text-red-500 font-semibold">&bull; Sedang diproses PMI</p>
                            </div>
                        </div>

                        {/* Stat 4 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stok Tersimpan di RS</span>
                                <span className="text-xl">🩺</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-extrabold text-white">{metrics.hospital_stock_bags} Kantong</p>
                                <p className="text-xs text-slate-400 font-semibold">&bull; Cadangan bank darah RS</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Tracking & Live Status */}
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
                        <div>
                            <h3 className="font-bold text-white">Monitoring Permohonan Darah RS</h3>
                            <p className="text-xs text-slate-400">Status real-time pengiriman dan alokasi kantong darah darurat</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-xs font-bold text-slate-400">
                                        <th className="py-3 px-4">Kode Request</th>
                                        <th className="py-3 px-4">Pasien</th>
                                        <th className="py-3 px-4">Gol. Darah</th>
                                        <th className="py-3 px-4">Kebutuhan</th>
                                        <th className="py-3 px-4">Tingkat Urgensi</th>
                                        <th className="py-3 px-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-850">
                                    <tr>
                                        <td className="py-4 px-4 font-semibold text-white">REQ-001</td>
                                        <td className="py-4 px-4 text-slate-300">Budi Santoso</td>
                                        <td className="py-4 px-4 text-slate-300">O+ (PRC)</td>
                                        <td className="py-4 px-4 text-slate-300">1 / 4 Kantong</td>
                                        <td className="py-4 px-4">
                                            <span className="text-xs bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold uppercase">Emergency</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded font-bold">Open</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 px-4 font-semibold text-white">REQ-002</td>
                                        <td className="py-4 px-4 text-slate-300">Siti Rahma</td>
                                        <td className="py-4 px-4 text-slate-300">A+ (PRC)</td>
                                        <td className="py-4 px-4 text-slate-300">2 / 2 Kantong</td>
                                        <td className="py-4 px-4">
                                            <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded font-bold uppercase">Urgent</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded font-bold">Fulfilled</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
