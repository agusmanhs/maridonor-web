import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

interface ScheduleSlotItem {
    id: string;
    date: string;
    start_time: string;
    end_time: string;
    max_capacity: number;
    booked_count: number;
    status: string;
}

interface DonationItem {
    id: string;
    blood_type: string;
    rhesus: string;
    component_type: string;
    volume_ml: number;
    donated_at: string;
    donor_profile?: {
        user?: {
            name: string;
            email: string;
        };
    };
}

interface Institution {
    id: string;
    name: string;
    type: string;
}

interface User {
    name: string;
    email: string;
    role: string;
}

interface PaginatedData<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    slots: ScheduleSlotItem[];
    donations: PaginatedData<DonationItem>;
    currentInstitution: Institution;
    auth: {
        user: User;
    };
}

export default function ScheduleIndex({ slots, donations, currentInstitution, auth }: Props) {
    const [activeTab, setActiveTab] = useState<'slots' | 'donations'>('slots');

    // Modals
    const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    // Form Slot
    const [slotForm, setSlotForm] = useState({
        date: new Date().toISOString().split('T')[0],
        start_time: '08:00',
        end_time: '12:00',
        max_capacity: 50,
    });

    // Form Walk-in
    const [donationForm, setDonationForm] = useState({
        donor_email: '',
        blood_type: 'O',
        rhesus: 'positive',
        component_type: 'whole_blood',
        volume_ml: 350,
    });

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const handleSlotSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/schedules/slots', slotForm, {
            onSuccess: () => {
                setIsSlotModalOpen(false);
                setSlotForm({
                    date: new Date().toISOString().split('T')[0],
                    start_time: '08:00',
                    end_time: '12:00',
                    max_capacity: 50,
                });
            }
        });
    };

    const handleDonationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/schedules/donations', donationForm, {
            onSuccess: () => {
                setIsDonationModalOpen(false);
                setDonationForm({
                    donor_email: '',
                    blood_type: 'O',
                    rhesus: 'positive',
                    component_type: 'whole_blood',
                    volume_ml: 350,
                });
            }
        });
    };

    return (
        <>
            <Head title="Slot Jadwal & Riwayat Donor - Maridonor" />
            <DashboardLayout
                sidebarType="pmi"
                title="Manajemen Slot & Histori Donor"
                subtitle={`${currentInstitution?.name} — Kelola Jadwal Kunjungan & Catat Walk-in Donor`}
                headerRight={(
                    <div className="flex space-x-3">
                        {activeTab === 'slots' ? (
                            <button 
                                onClick={() => setIsSlotModalOpen(true)}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-600/15 transition-all duration-150 active:scale-95"
                            >
                                + Buat Slot Baru
                            </button>
                        ) : (
                            <button 
                                onClick={() => setIsDonationModalOpen(true)}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-600/15 transition-all duration-150 active:scale-95"
                            >
                                + Catat Walk-in Donor
                            </button>
                        )}
                    </div>
                )}
            >

                    {/* Tab Navigation */}
                    <div className="flex border-b border-slate-850">
                        <button 
                            onClick={() => setActiveTab('slots')}
                            className={`py-2.5 px-6 font-bold text-sm border-b-2 transition duration-150 ${
                                activeTab === 'slots' ? 'border-red-500 text-red-500' : 'border-transparent theme-text-muted hover:theme-text-main'
                            }`}
                        >
                            📅 Slot Jadwal Donor
                        </button>
                        <button 
                            onClick={() => setActiveTab('donations')}
                            className={`py-2.5 px-6 font-bold text-sm border-b-2 transition duration-150 ${
                                activeTab === 'donations' ? 'border-red-500 text-red-500' : 'border-transparent theme-text-muted hover:theme-text-main'
                            }`}
                        >
                            🩸 Riwayat Transaksi Donasi
                        </button>
                    </div>

                    {/* Content Section */}
                    {activeTab === 'slots' ? (
                        <div className="theme-bg-card border theme-border-main rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                            <th className="py-3 px-4">Tanggal Slot</th>
                                            <th className="py-3 px-4">Jam Mulai</th>
                                            <th className="py-3 px-4">Jam Selesai</th>
                                            <th className="py-3 px-4 text-center">Kapasitas Terisi</th>
                                            <th className="py-3 px-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y theme-divide-main">
                                        {slots.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-slate-500 font-semibold">
                                                    Belum ada slot waktu donor terdaftar.
                                                </td>
                                            </tr>
                                        ) : (
                                            slots.map((slot) => (
                                                <tr key={slot.id} className="hover:slate-500/5 transition duration-100">
                                                    <td className="py-4 px-4 font-semibold theme-text-main">
                                                        {new Date(slot.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </td>
                                                    <td className="py-4 px-4 theme-text-muted font-mono">{slot.start_time}</td>
                                                    <td className="py-4 px-4 theme-text-muted font-mono">{slot.end_time}</td>
                                                    <td className="py-4 px-4 text-center font-bold theme-text-main">
                                                        {slot.booked_count} / {slot.max_capacity} Orang
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                            slot.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 theme-text-muted'
                                                        }`}>
                                                            {slot.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="theme-bg-card border theme-border-main rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                            <th className="py-3 px-4">Pendonor</th>
                                            <th className="py-3 px-4">Email</th>
                                            <th className="py-3 px-4">Gol. Darah</th>
                                            <th className="py-3 px-4">Komponen</th>
                                            <th className="py-3 px-4">Volume (ml)</th>
                                            <th className="py-3 px-4">Tanggal Donasi</th>
                                            <th className="py-3 px-4 text-center">Sertifikat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y theme-divide-main">
                                        {donations.data.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold">
                                                    Belum ada riwayat transaksi donasi sukses.
                                                </td>
                                            </tr>
                                        ) : (
                                            donations.data.map((don) => (
                                                <tr key={don.id} className="hover:slate-500/5 transition duration-100">
                                                    <td className="py-4 px-4 font-semibold theme-text-main">{don.donor_profile?.user?.name || '-'}</td>
                                                    <td className="py-4 px-4 theme-text-muted font-mono text-xs">{don.donor_profile?.user?.email || '-'}</td>
                                                    <td className="py-4 px-4 theme-text-main">
                                                        <span className="font-bold">{don.blood_type}</span>
                                                        <span className="text-xs theme-text-muted"> ({don.rhesus === 'positive' ? '+' : '-'})</span>
                                                    </td>
                                                    <td className="py-4 px-4 theme-text-muted capitalize">{don.component_type.replace('_', ' ')}</td>
                                                    <td className="py-4 px-4 text-slate-350">{don.volume_ml} ml</td>
                                                    <td className="py-4 px-4 theme-text-muted">
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
                            {/* Pagination Links */}
                            {donations.links && donations.links.length > 3 && (
                                <div className="p-4 border-t theme-border-main flex items-center justify-center space-x-1 overflow-x-auto">
                                    {donations.links.map((link, i) => (
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                preserveState
                                                preserveScroll
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                                                    link.active 
                                                        ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                                                        : 'theme-bg-input theme-border-main border theme-text-main hover:bg-slate-500/10'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span 
                                                key={i} 
                                                className="px-3 py-1.5 text-xs font-bold text-slate-400 theme-bg-input border theme-border-main rounded-lg opacity-50 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
            </DashboardLayout>

            {/* Modal Tambah Slot Baru */}
            {isSlotModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-lg font-bold theme-text-main">Buat Slot Jadwal Baru</h3>
                            <button onClick={() => setIsSlotModalOpen(false)} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleSlotSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Tanggal</label>
                                <input 
                                    type="date" 
                                    value={slotForm.date}
                                    onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })}
                                    required 
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Jam Mulai</label>
                                    <input 
                                        type="time" 
                                        value={slotForm.start_time}
                                        onChange={(e) => setSlotForm({ ...slotForm, start_time: e.target.value })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Jam Selesai</label>
                                    <input 
                                        type="time" 
                                        value={slotForm.end_time}
                                        onChange={(e) => setSlotForm({ ...slotForm, end_time: e.target.value })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Kuota Kapasitas Maksimal (Orang)</label>
                                <input 
                                    type="number" 
                                    value={slotForm.max_capacity}
                                    onChange={(e) => setSlotForm({ ...slotForm, max_capacity: parseInt(e.target.value) })}
                                    required 
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                <button 
                                    type="button" 
                                    onClick={() => setIsSlotModalOpen(false)}
                                    className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-sm font-semibold"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 theme-text-main rounded-xl text-sm font-semibold"
                                >
                                    Buat Slot
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Catat Walk-in Donor */}
            {isDonationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-lg font-bold theme-text-main">Catat Transaksi Donor Walk-in</h3>
                            <button onClick={() => setIsDonationModalOpen(false)} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleDonationSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Email Pendonor Terdaftar</label>
                                <input 
                                    type="email" 
                                    placeholder="contoh: donor@maridonor.com"
                                    value={donationForm.donor_email}
                                    onChange={(e) => setDonationForm({ ...donationForm, donor_email: e.target.value })}
                                    required 
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Golongan Darah</label>
                                    <select 
                                        value={donationForm.blood_type}
                                        onChange={(e) => setDonationForm({ ...donationForm, blood_type: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Rhesus</label>
                                    <select 
                                        value={donationForm.rhesus}
                                        onChange={(e) => setDonationForm({ ...donationForm, rhesus: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="positive">Positif (+)</option>
                                        <option value="negative">Negatif (-)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Komponen Darah</label>
                                    <select 
                                        value={donationForm.component_type}
                                        onChange={(e) => setDonationForm({ ...donationForm, component_type: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="whole_blood">Whole Blood (WB)</option>
                                        <option value="prc">Packed Red Cells (PRC)</option>
                                        <option value="ffp">Fresh Frozen Plasma (FFP)</option>
                                        <option value="platelet">Thrombocyte/Platelet</option>
                                        <option value="cryo">Cryoprecipitate</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Volume Kantong (ml)</label>
                                    <input 
                                        type="number" 
                                        value={donationForm.volume_ml}
                                        onChange={(e) => setDonationForm({ ...donationForm, volume_ml: parseInt(e.target.value) })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                <button 
                                    type="button" 
                                    onClick={() => setIsDonationModalOpen(false)}
                                    className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-sm font-semibold"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 theme-text-main rounded-xl text-sm font-semibold shadow-lg shadow-red-600/15"
                                >
                                    Simpan Donasi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
