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
    referral_code: string;
}

interface DonationItem {
    id: string;
    blood_type: string;
    rhesus: string;
    component_type: string;
    volume_ml: number;
    donated_at: string;
    institution?: {
        name: string;
        address?: {
            city: string;
        };
    };
}

interface ScheduleSlotItem {
    id: string;
    slot_date: string;
    start_time: string;
    end_time: string;
    capacity: number;
    booked_count: number;
    institution?: {
        name: string;
    };
}

interface Props {
    donorProfile: DonorProfile;
    donations: DonationItem[];
    upcomingSlots: ScheduleSlotItem[];
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function DonorDashboard({ donorProfile, donations, upcomingSlots, auth }: Props) {
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    // Deteksi kelayakan donor hari ini
    const isEligible = !donorProfile.next_eligible_date || new Date(donorProfile.next_eligible_date) <= new Date();

    return (
        <>
            <Head title="Dashboard Pendonor - Maridonor" />
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans antialiased selection:bg-red-600 selection:text-white">
                
                {/* Sidebar Menu */}
                <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col">
                    <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
                        <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-8 w-auto" />
                        <span className="text-lg font-bold tracking-tight text-white">
                            Mari<span className="text-red-500">donor</span>
                        </span>
                    </div>

                    <div className="flex-1 p-4 space-y-1.5">
                        <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Portal Pendonor</span>
                        <Link href="/dashboard/donor" className="flex items-center space-x-3 px-3 py-2.5 bg-red-600/10 text-red-500 rounded-xl text-sm font-semibold border border-red-500/10">
                            <span>📊</span>
                            <span>Dashboard Anda</span>
                        </Link>
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
                    <div className="pb-6 border-b border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">Selamat Datang, {auth.user.name}!</h1>
                            <p className="text-sm text-slate-400">Terima kasih atas kontribusi kemanusiaan Anda. Pantau status dan poin donasi Anda di sini.</p>
                        </div>
                        <ThemeSwitcher />
                    </div>

                    {/* Banner Status Kelayakan */}
                    <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isEligible ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-rose-500/10 border-rose-500/25 text-rose-450'
                    }`}>
                        <div className="space-y-1">
                            <h4 className="font-bold text-base">{isEligible ? '🟢 Anda Siap Berdonor!' : '🔴 Belum Waktunya Berdonor'}</h4>
                            <p className="text-sm opacity-80">
                                {isEligible 
                                    ? 'Kondisi tubuh Anda saat ini siap untuk melakukan donor darah berikutnya. Silakan kunjungi UDD PMI terdekat.' 
                                    : `Demi kesehatan Anda, Anda baru dapat melakukan donor kembali setelah tanggal ${new Date(donorProfile.next_eligible_date!).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}.`
                                }
                            </p>
                        </div>
                        {isEligible && (
                            <span className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider block">
                                Fit to Donate
                            </span>
                        )}
                    </div>

                    {/* Stats Widget Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Golongan Darah */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                            <span className="text-3xl p-3 bg-red-600/10 text-red-500 rounded-xl">🩸</span>
                            <div className="space-y-0.5">
                                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Golongan Darah</span>
                                <span className="text-xl font-bold text-white block">{donorProfile.blood_type} ({donorProfile.rhesus === 'positive' ? 'Positif' : 'Negatif'})</span>
                            </div>
                        </div>

                        {/* Total Donasi */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                            <span className="text-3xl p-3 bg-red-600/10 text-red-500 rounded-xl">🏆</span>
                            <div className="space-y-0.5">
                                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Total Donasi</span>
                                <span className="text-xl font-bold text-white block">{donorProfile.total_donations} Kali Donasi</span>
                            </div>
                        </div>

                        {/* Poin Pendonor */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                            <span className="text-3xl p-3 bg-red-600/10 text-red-500 rounded-xl">✨</span>
                            <div className="space-y-0.5">
                                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Poin Maridonor</span>
                                <span className="text-xl font-bold text-white block">{donorProfile.points} Poin</span>
                            </div>
                        </div>

                        {/* Referral Code */}
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                            <span className="text-3xl p-3 bg-red-600/10 text-red-500 rounded-xl">🔗</span>
                            <div className="space-y-0.5">
                                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">Kode Referral</span>
                                <span className="text-xl font-mono font-bold text-white block">{donorProfile.referral_code}</span>
                            </div>
                        </div>
                    </div>

                    {/* Riwayat Donasi & Jadwal PMI */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* Riwayat Donasi */}
                        <div className="xl:col-span-2 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white">Riwayat Donasi Anda</h3>
                                <span className="text-xs text-slate-400">{donations.length} Transaksi Terdaftar</span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-xs font-bold text-slate-400">
                                                <th className="py-3 px-4">PMI Penyelenggara</th>
                                                <th className="py-3 px-4">Kota</th>
                                                <th className="py-3 px-4">Komponen</th>
                                                <th className="py-3 px-4">Volume</th>
                                                <th className="py-3 px-4">Tanggal Donasi</th>
                                                <th className="py-3 px-4 text-center">Sertifikat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm divide-y divide-slate-850">
                                            {donations.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold">
                                                        Anda belum memiliki riwayat donasi.
                                                    </td>
                                                </tr>
                                            ) : (
                                                donations.map((don) => (
                                                    <tr key={don.id} className="hover:bg-slate-850/30 transition duration-100">
                                                        <td className="py-4 px-4 font-semibold text-white">{don.institution?.name || '-'}</td>
                                                        <td className="py-4 px-4 text-slate-350">{don.institution?.address?.city || '-'}</td>
                                                        <td className="py-4 px-4 text-slate-300 capitalize">{don.component_type.replace('_', ' ')}</td>
                                                        <td className="py-4 px-4 text-slate-350">{don.volume_ml} ml</td>
                                                        <td className="py-4 px-4 text-slate-400">
                                                            {new Date(don.donated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <a 
                                                                href={`/donations/${don.id}/certificate`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-3 py-1 bg-red-600/10 hover:bg-red-600/25 text-red-500 rounded-lg text-xs font-bold border border-red-500/25 transition duration-150"
                                                            >
                                                                Unduh
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Jadwal Slot Aktif PMI */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Jadwal Donor PMI Aktif</h3>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                                {upcomingSlots.length === 0 ? (
                                    <p className="text-xs text-slate-500 font-semibold text-center py-6">
                                        Saat ini tidak ada slot jadwal donor yang aktif.
                                    </p>
                                ) : (
                                    <div className="space-y-3.5">
                                        {upcomingSlots.map((slot) => (
                                            <div key={slot.id} className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-xs font-bold text-white">{slot.institution?.name}</span>
                                                    <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-bold uppercase">
                                                        {slot.booked_count} / {slot.capacity} Slot
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-xs text-slate-400">
                                                    <span>{new Date(slot.slot_date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>
                                                    <span className="font-mono">{slot.start_time} - {slot.end_time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="text-[10px] text-slate-500 leading-normal text-center pt-2">
                                    💡 Untuk memesan / booking slot waktu donor secara online, silakan gunakan Aplikasi Mobile Maridonor di handphone Anda.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
