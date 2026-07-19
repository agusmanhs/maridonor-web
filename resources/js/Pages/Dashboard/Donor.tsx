import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import ThemeSwitcher from '../../Components/ThemeSwitcher';

interface DonorProfile {
    id: string;
    blood_type: string;
    rhesus: string;
    points: number;
    total_donations: number;
    last_donation_date?: string;
    next_eligible_date?: string;
    referral_code?: string;
}

interface User {
    name: string;
    email: string;
    role: string;
}

interface Donation {
    id: string;
    donation_date: string;
    blood_type: string;
    volume_ml?: number;
    points_earned: number;
    status: string;
}

interface Props {
    donorProfile: DonorProfile;
    recentDonations: Donation[];
    auth: {
        user: User;
    };
}

export default function DonorDashboard({ donorProfile, recentDonations, auth }: Props) {
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    // Deteksi kelayakan donor hari ini
    const isEligible = !donorProfile.next_eligible_date || new Date(donorProfile.next_eligible_date) <= new Date();

    return (
        <>
            <Head>
                <title>Dashboard Pendonor - Maridonor</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen theme-bg-main theme-text-main flex flex-col lg:flex-row antialiased relative overflow-hidden transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
                
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-red-600/5 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-rose-600/5 blur-3xl pointer-events-none"></div>

                {/* Sidebar Menu */}
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
                        <span className="px-3 text-[10px] font-bold theme-text-muted uppercase tracking-wider block mb-2">Portal Pendonor</span>
                        <Link href="/dashboard/donor" className="flex items-center space-x-3 px-3 py-2.5 bg-gradient-to-r from-red-650/10 to-rose-650/5 text-red-500 rounded-xl text-sm font-bold border border-red-500/10">
                            <span>📊</span>
                            <span>Dashboard Anda</span>
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
                    <div className="pb-6 border-b theme-border-main flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold theme-text-main tracking-tight font-serif">Selamat Datang, {auth.user.name}!</h1>
                            <p className="text-sm theme-text-muted">Terima kasih atas kontribusi kemanusiaan Anda. Pantau status dan poin donasi Anda di sini.</p>
                        </div>
                        <ThemeSwitcher />
                    </div>

                    {/* Banner Status Kelayakan */}
                    <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                        isEligible 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-450'
                    }`}>
                        <div className="space-y-1">
                            <h4 className="font-bold text-base">{isEligible ? '🟢 Anda Siap Berdonor!' : '🔴 Belum Waktunya Berdonor'}</h4>
                            <p className="text-xs opacity-90">
                                {isEligible 
                                    ? 'Anda telah memenuhi tenggang waktu 60 hari dari donasi terakhir. Silakan lakukan donor kembali.' 
                                    : `Donasi berikutnya dapat dilakukan setelah tanggal ${donorProfile.next_eligible_date}.`}
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Stat 1: Golongan Darah */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold theme-text-muted uppercase tracking-wider block">Golongan Darah</span>
                                <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold border border-red-500/10">🩸</span>
                            </div>
                            <p className="text-4xl font-extrabold theme-text-main">
                                {donorProfile.blood_type} <span className="text-lg font-normal theme-text-muted">({donorProfile.rhesus})</span>
                            </p>
                        </div>

                        {/* Stat 2: Total Donasi */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold theme-text-muted uppercase tracking-wider block">Total Donasi</span>
                                <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold border border-red-500/10">🤝</span>
                            </div>
                            <p className="text-4xl font-extrabold theme-text-main">{donorProfile.total_donations} Kali</p>
                        </div>

                        {/* Stat 3: Poin Loyalitas */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg relative overflow-hidden transition-colors">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold theme-text-muted uppercase tracking-wider block">Loyalty Points</span>
                                <span className="p-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold border border-red-500/10">✨</span>
                            </div>
                            <p className="text-4xl font-extrabold theme-text-main">{donorProfile.points} Pts</p>
                        </div>
                    </div>

                    {/* Riwayat Donasi Terakhir */}
                    <div className="p-6 rounded-2xl theme-bg-card border theme-border-card backdrop-blur-xl shadow-lg space-y-6 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold theme-text-main text-base">Riwayat Donasi Terakhir</h3>
                                <p className="text-xs theme-text-muted">Daftar kontribusi kemanusiaan yang berhasil Anda lakukan</p>
                            </div>
                        </div>

                        {recentDonations.length === 0 ? (
                            <div className="text-center py-10 border border-dashed theme-border-main rounded-2xl">
                                <p className="text-sm theme-text-muted">Anda belum memiliki riwayat donasi yang tercatat.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                            <th className="py-3 px-4">Tanggal Donasi</th>
                                            <th className="py-3 px-4">Komponen</th>
                                            <th className="py-3 px-4">Volume (ml)</th>
                                            <th className="py-3 px-4">Poin Diperoleh</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4 text-right">Unduh</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y theme-divide-main">
                                        {recentDonations.map((donation) => (
                                            <tr key={donation.id} className="hover:bg-slate-500/5 transition">
                                                <td className="py-4 px-4 font-medium theme-text-main">{donation.donation_date}</td>
                                                <td className="py-4 px-4 theme-text-muted">{donation.blood_type}</td>
                                                <td className="py-4 px-4 theme-text-muted">{donation.volume_ml || '-'} ml</td>
                                                <td className="py-4 px-4 font-bold text-red-500">+{donation.points_earned} Pts</td>
                                                <td className="py-4 px-4">
                                                    <span className="text-[10px] bg-green-500/15 text-green-600 dark:text-green-400 px-2 py-0.5 rounded font-bold uppercase">
                                                        {donation.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <Link 
                                                        href={`/certificates/${donation.id}/print`}
                                                        target="_blank"
                                                        className="inline-flex items-center text-xs font-bold text-red-500 hover:text-red-650 transition"
                                                    >
                                                        🖨️ Cetak Sertifikat
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
