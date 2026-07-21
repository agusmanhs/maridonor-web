import React from 'react';
import { Head, Link } from '@inertiajs/react';
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
    const maxDonations = metrics.donation_trends.length > 0 
        ? Math.max(...metrics.donation_trends.map(t => t.total))
        : 10;

    return (
        <>
            <Head>
                <title>PMI Dashboard - MARIDONOR</title>
                <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                .font-label-caps {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                }
            `}</style>

            <DashboardLayout 
                sidebarType="pmi"
                title="Blood Inventory Overview"
                subtitle="Real-time status of blood bank stock levels across the regional network."
                headerRight={
                    <>
                        <button className="bg-white dark:bg-[#414343] border border-outline-variant dark:border-transparent px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#4d4f4f] text-slate-700 dark:text-slate-200 transition-colors text-xs font-semibold shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">download</span> Export Report
                        </button>
                        <Link 
                            href="/blood-stocks?type=pmi"
                            className="bg-primary text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:brightness-95 active:scale-95 transition-all text-xs font-bold shadow-md shadow-rose-900/10"
                        >
                            <span className="material-symbols-outlined text-[18px]">add_circle</span> Tambah Unit
                        </Link>
                    </>
                }
            >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    {/* Stat 1 */}
                    <div className="bg-white dark:bg-[#2b2d2d] rounded-xl border border-outline-variant dark:border-[#414343] p-6 flex flex-col justify-between h-40 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-secondary dark:text-slate-400 font-label-caps uppercase tracking-wider">TOTAL UNITS (A+)</span>
                            <div className="w-10 h-10 rounded-lg bg-primary-fixed/20 dark:bg-rose-500/10 flex items-center justify-center text-primary dark:text-rose-400">
                                <span className="material-symbols-outlined text-[22px]">water_drop</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-primary dark:text-rose-400" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                {metrics.total_available_stock_bags}
                            </h3>
                            <p className="text-xs text-secondary dark:text-slate-400 mt-1 flex items-center gap-1">
                                <span className="text-rose-600 dark:text-rose-400 flex items-center"><span className="material-symbols-outlined text-[14px]">trending_down</span> 4.2%</span> dari minggu lalu
                            </p>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-white dark:bg-[#2b2d2d] rounded-xl border border-outline-variant dark:border-[#414343] p-6 flex flex-col justify-between h-40 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-secondary dark:text-slate-400 font-label-caps uppercase tracking-wider">CRITICAL STOCK (O-)</span>
                            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center text-error">
                                <span className="material-symbols-outlined text-[22px]">priority_high</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-error" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                {metrics.active_requests_count}
                            </h3>
                            <p className="text-xs text-secondary dark:text-slate-400 mt-1 flex items-center gap-1">
                                <span className="text-error font-bold uppercase tracking-wider">URGENT</span> butuh penambahan
                            </p>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-white dark:bg-[#2b2d2d] rounded-xl border border-outline-variant dark:border-[#414343] p-6 flex flex-col justify-between h-40 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-secondary dark:text-slate-400 font-label-caps uppercase tracking-wider">ACTIVE DONORS</span>
                            <div className="w-10 h-10 rounded-lg bg-secondary-container/50 dark:bg-white/5 flex items-center justify-center text-secondary dark:text-slate-300">
                                <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                {metrics.total_registered_donors}
                            </h3>
                            <p className="text-xs text-secondary dark:text-slate-400 mt-1 flex items-center gap-1">
                                <span className="text-green-600 dark:text-green-400 flex items-center"><span className="material-symbols-outlined text-[14px]">trending_up</span> 12%</span> aktif hari ini
                            </p>
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="bg-white dark:bg-[#2b2d2d] rounded-xl border border-outline-variant dark:border-[#414343] p-6 flex flex-col justify-between h-40 shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="text-secondary dark:text-slate-400 font-label-caps uppercase tracking-wider">SCHEDULED WALKS</span>
                            <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 dark:bg-white/5 flex items-center justify-center text-tertiary dark:text-slate-300">
                                <span className="material-symbols-outlined text-[22px]">calendar_today</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>86</h3>
                            <p className="text-xs text-secondary dark:text-slate-400 mt-1">Terkonfirmasi untuk 24 jam ke depan</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-6 mt-6">
                    {/* Map Section (Bento Style) */}
                    <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#2b2d2d] rounded-xl border border-outline-variant dark:border-[#414343] overflow-hidden flex flex-col shadow-sm">
                        <div className="p-6 border-b border-outline-variant dark:border-[#414343] flex justify-between items-center">
                            <div>
                                <h2 className="font-title-md text-title-md text-primary dark:text-rose-400" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Network Distribution</h2>
                                <p className="text-xs text-secondary dark:text-slate-400">Jangkauan unit donor dan rumah sakit regional.</p>
                            </div>
                            <div className="flex bg-slate-100 dark:bg-[#414343]/50 p-1 rounded-lg">
                                <button className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-[#4d4f4f] shadow-sm rounded-md text-primary dark:text-white">Map View</button>
                                <button className="px-3 py-1.5 text-xs font-medium text-secondary dark:text-slate-400">List View</button>
                            </div>
                        </div>
                        <div className="relative flex-grow min-h-[400px]">
                            <div className="absolute inset-0 w-full h-full bg-slate-100 dark:bg-[#1a1c1c] flex items-center justify-center">
                                <div 
                                    className="w-full h-full bg-cover bg-center" 
                                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaJAmLXOvyBtBg9cdoll7Cvjh2Idf7lG2QVr1zHHKqd2cMkr3USWpYpQK3v49veYofL_t3h0leLSdfNTT-on63MboduhGe5psfkVWgx4111Yb7QMLKFAuZNsAijzGSuedQcJy7abG2MJMmidscFBMA8v7zlOFT3FUI8f2OKvVNUIKWmq6aUbsp3HMPlz3auVBy7eYEkfWWjy2ykY5iP89RXuXzdIeMiYOIrrTPBdYpP11Jt_dlUC7T9A')" }}
                                />
                            </div>
                            {/* Floating Map Legend */}
                            <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-[#2b2d2d]/90 backdrop-blur-md p-4 rounded-xl border border-outline-variant dark:border-[#414343] shadow-lg z-10 w-48 transition-colors">
                                <h4 className="text-[10px] font-bold mb-3 uppercase tracking-wider text-primary dark:text-rose-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Stock Intensity</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> 
                                        <span className="text-slate-700 dark:text-slate-300">Surplus Stock</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div> 
                                        <span className="text-slate-700 dark:text-slate-300">Moderate Level</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="w-2.5 h-2.5 rounded-full bg-error"></div> 
                                        <span className="text-slate-700 dark:text-slate-300">Critical Low</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alerts & Analytics Section */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        {/* Unit Expiry Warning */}
                        <div className="bg-white dark:bg-[#2b2d2d] rounded-xl border border-outline-variant dark:border-[#414343] p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-error text-[24px]">notification_important</span>
                                <h2 className="font-title-md text-title-md text-slate-800 dark:text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Peringatan Kritis</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 bg-red-500/5 dark:bg-red-500/10 rounded-lg border-l-4 border-error">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold text-error">Kedaluwarsa Unit B-</span>
                                        <span className="text-[10px] text-error font-bold">2 JAM LAGI</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-300">Unit ID #9822-B1 mendekati batas penyimpanan aman. Segera tindak lanjuti.</p>
                                </div>
                                <div className="p-3 bg-secondary-container/30 dark:bg-white/5 rounded-lg border-l-4 border-outline">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-xs font-bold text-slate-800 dark:text-white">Kekurangan Stok O+</span>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">PENDING</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">Pusat Transfusi melaporkan &lt; 5 unit stok golongan O+. Rekomendasikan pengalihan donor.</p>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-2 text-xs font-bold text-primary dark:text-rose-450 hover:bg-rose-900/5 transition-colors rounded-lg border border-primary/20 dark:border-rose-900/20">
                                LIHAT SEMUA PERINGATAN
                            </button>
                        </div>

                        {/* Weekly Consumption Graph */}
                        <div className="bg-white dark:bg-[#2b2d2d] rounded-xl border border-outline-variant dark:border-[#414343] p-6 flex flex-col justify-between flex-grow shadow-sm">
                            <div>
                                <h2 className="font-title-md text-title-md text-primary dark:text-rose-400" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Konsumsi Mingguan</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Alokasi kantong darah 7 hari terakhir</p>
                            </div>
                            
                            <div className="h-44 relative flex items-end justify-between px-2 pt-6 border-b border-outline-variant/30">
                                {metrics.donation_trends.map((trend) => {
                                    const percentageHeight = (trend.total / maxDonations) * 80;
                                    return (
                                        <div key={trend.month} className="w-6 bg-slate-200 dark:bg-[#414343] rounded-t-sm hover:bg-primary dark:hover:bg-rose-800 transition-colors group relative flex flex-col items-center justify-end" style={{ height: '100%' }}>
                                            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 text-[9px] font-bold bg-primary text-white px-1.5 py-0.5 rounded shadow z-10 transition-opacity">
                                                {trend.total}
                                            </div>
                                            <div 
                                                className="w-full bg-primary/75 dark:bg-rose-500/75 rounded-t-sm group-hover:bg-primary dark:group-hover:bg-rose-500 transition-all"
                                                style={{ height: `${percentageHeight}%` }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 flex justify-between items-center text-xs text-secondary dark:text-slate-400">
                                <span>Total Terpakai: {metrics.total_available_stock_bags} Unit</span>
                                <span className="font-bold text-primary dark:text-rose-400">+12.4% Rata-rata</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Golongan Darah Composition Table */}
                <div className="bg-white dark:bg-[#2b2d2d] rounded-xl border border-outline-variant dark:border-[#414343] mt-6 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-outline-variant dark:border-[#414343]">
                        <h2 className="font-title-md text-title-md text-slate-800 dark:text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Komposisi Stok Golongan Darah</h2>
                        <p className="text-xs text-secondary dark:text-slate-400">Distribusi persentase stok aktif berdasarkan tipe darah utama.</p>
                    </div>
                    <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {['A', 'B', 'AB', 'O'].map((group) => {
                            const share = group === 'O' ? 40 : group === 'A' ? 25 : group === 'B' ? 25 : 10;
                            const count = Math.round((metrics.total_available_stock_bags * share) / 100);
                            return (
                                <div key={group} className="p-4 bg-slate-50 dark:bg-[#414343]/30 rounded-xl border border-outline-variant dark:border-transparent flex flex-col justify-between">
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-black text-primary dark:text-rose-400">{group}</span>
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 dark:bg-rose-500/10 text-primary dark:text-rose-400">
                                            {share}%
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Jumlah Stok</span>
                                        <span className="text-base font-extrabold text-slate-800 dark:text-white">{count} Kantong</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Distribution Activity Table */}
                <div className="bg-white dark:bg-[#2b2d2d] rounded-xl border border-outline-variant dark:border-[#414343] mt-6 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-outline-variant dark:border-[#414343] flex justify-between items-center">
                        <div>
                            <h2 className="font-title-md text-title-md text-slate-800 dark:text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Recent Distribution Activity</h2>
                            <p className="text-xs text-secondary dark:text-slate-400">Catatan transaksi keluar-masuk kantong darah terbaru.</p>
                        </div>
                        <div className="relative">
                            <select className="appearance-none bg-slate-50 dark:bg-[#414343] border border-outline-variant dark:border-transparent rounded-lg px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-primary pr-8">
                                <option>Filter Status</option>
                                <option>Delivered</option>
                                <option>In Transit</option>
                                <option>Scheduled</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1.5 text-secondary text-[16px] pointer-events-none">expand_more</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#1a1c1c] text-secondary dark:text-slate-400 font-label-caps text-[11px] uppercase tracking-wider">
                                    <th className="px-6 py-4">Transaction ID</th>
                                    <th className="px-6 py-4">Blood Type</th>
                                    <th className="px-6 py-4">Quantity (Units)</th>
                                    <th className="px-6 py-4">Destination Clinic</th>
                                    <th className="px-6 py-4">Timestamp</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20 dark:divide-slate-700 font-body-sm text-slate-800 dark:text-slate-200">
                                <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-label-caps text-primary dark:text-rose-400">#TX-94211</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-primary/10 text-primary dark:text-rose-400 rounded-md font-bold text-xs">A+</span></td>
                                    <td className="px-6 py-4">24</td>
                                    <td className="px-6 py-4">North General Hospital</td>
                                    <td className="px-6 py-4 text-secondary dark:text-slate-450">Oct 24, 09:42 AM</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold text-xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Delivered
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-label-caps text-primary dark:text-rose-400">#TX-94212</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-primary text-white rounded-md font-bold text-xs">O-</span></td>
                                    <td className="px-6 py-4">08</td>
                                    <td className="px-6 py-4">Central Trauma Care</td>
                                    <td className="px-6 py-4 text-secondary dark:text-slate-450">Oct 24, 10:15 AM</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> In Transit
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-label-caps text-primary dark:text-rose-400">#TX-94213</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-primary/10 text-primary dark:text-rose-400 rounded-md font-bold text-xs">B+</span></td>
                                    <td className="px-6 py-4">12</td>
                                    <td className="px-6 py-4">South City Medical</td>
                                    <td className="px-6 py-4 text-secondary dark:text-slate-450">Oct 24, 11:30 AM</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-450 font-bold text-xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Scheduled
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                        </button>
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
