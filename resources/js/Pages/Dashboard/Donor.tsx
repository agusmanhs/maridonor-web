import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

interface DonorProfile {
    id: string;
    blood_type: string;
    rhesus: string;
    points: number;
    total_donations: number;
    last_donation_date?: string;
    next_eligible_date?: string;
    referral_code?: string;
    gender: string;
    birth_date: string;
}

interface User {
    name: string;
    email: string;
    phone: string;
    role: string;
}

interface Donation {
    id: string;
    donated_at: string;
    blood_type: string;
    volume_ml?: number;
    points_earned: number;
    status: string;
}

interface Booking {
    id: string;
    queue_number: number;
    qr_code: string;
    status: string;
    slot: {
        id: string;
        date: string;
        start_time: string;
        end_time: string;
        institution_name: string;
    };
}

interface BloodRequest {
    id: string;
    blood_type: string;
    rhesus: string;
    component_type: string;
    quantity_needed: number;
    quantity_fulfilled: number;
    urgency_level: string;
    hospital_name: string;
    deadline_at?: string;
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
    donorProfile: DonorProfile;
    donations: PaginatedData<Donation>;
    upcomingSlots: any[];
    activeBooking: Booking | null;
    activeBloodRequests: BloodRequest[];
    auth: {
        user: User;
    };
}

export default function DonorDashboard({ donorProfile, donations, upcomingSlots, activeBooking, activeBloodRequests, auth }: Props) {
    // Deteksi kelayakan donor hari ini
    const isEligible = !donorProfile.next_eligible_date || new Date(donorProfile.next_eligible_date) <= new Date();

    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [profileForm, setProfileForm] = React.useState({
        name: auth.user.name,
        phone: auth.user.phone || '',
        gender: donorProfile.gender || 'male',
        birth_date: donorProfile.birth_date || '',
        blood_type: donorProfile.blood_type || 'O',
        rhesus: donorProfile.rhesus || 'positive',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch('/dashboard/donor/profile', profileForm, {
            onSuccess: () => {
                setIsEditModalOpen(false);
            }
        });
    };

    const handleBookSlot = (slotId: string, instName: string) => {
        if (!isEligible) {
            alert('Anda belum layak mendonorkan darah kembali sesuai tenggat waktu medis.');
            return;
        }
        if (confirm(`Apakah Anda yakin ingin melakukan reservasi jadwal donor di ${instName}?`)) {
            router.post(`/schedules/slots/${slotId}/book`, {}, {
                onError: (errors) => {
                    alert(errors.booking || 'Terjadi kesalahan saat memproses reservasi.');
                }
            });
        }
    };

    const handleCancelBooking = (bookingId: string) => {
        if (confirm('Apakah Anda yakin ingin membatalkan reservasi jadwal donor aktif ini?')) {
            router.delete(`/bookings/${bookingId}`);
        }
    };

    const handleRespondRequest = (req: BloodRequest) => {
        // Cari slot terdekat yang dibuka oleh RS tersebut atau PMI
        // Cari slot instansi yang sesuai
        const matchedSlot = upcomingSlots.find(s => s.institution.name.toLowerCase().includes(req.hospital_name.toLowerCase()));
        
        if (matchedSlot) {
            if (confirm(`Apakah Anda bersedia berdonor di ${req.hospital_name} untuk membantu pasien ini?`)) {
                router.post(`/schedules/slots/${matchedSlot.id}/book`);
            }
        } else {
            // Alternatif: cari slot pertama yang tersedia secara umum
            if (upcomingSlots.length > 0) {
                const firstSlot = upcomingSlots[0];
                if (confirm(`Slot langsung di ${req.hospital_name} belum tersedia. Apakah Anda bersedia berdonor di slot terdekat: ${firstSlot.institution.name}?`)) {
                    router.post(`/schedules/slots/${firstSlot.id}/book`);
                }
            } else {
                alert(`Maaf, belum ada slot jadwal donor yang dibuka oleh ${req.hospital_name} saat ini.`);
            }
        }
    };

    return (
        <>
            <Head>
                <title>Dashboard Pendonor - Maridonor</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Head>
            
            <DashboardLayout
                sidebarType="donor"
                title={`Selamat Datang, ${auth.user.name}!`}
                subtitle="Terima kasih atas kontribusi kemanusiaan Anda. Pantau status dan poin donasi Anda di sini."
                headerRight={(
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2.5 bg-gradient-to-r from-red-650 to-rose-650 hover:from-red-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition active:scale-95 flex items-center space-x-1.5"
                    >
                        <span>✏️</span>
                        <span>Edit Profil</span>
                    </button>
                )}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-2 space-y-6">
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
                                        ? 'Anda telah memenuhi tenggang waktu dari donasi terakhir. Silakan lakukan donor kembali.' 
                                        : `Donasi berikutnya dapat dilakukan setelah tanggal ${new Date(donorProfile.next_eligible_date!).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}.`}
                                </p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Stat 1: Golongan Darah */}
                            <div className="p-4 sm:p-5 rounded-2xl theme-bg-card border theme-border-card shadow-md relative overflow-hidden transition-colors">
                                <span className="text-[10px] font-bold theme-text-muted uppercase tracking-wider block mb-1">Gol. Darah</span>
                                <p className="text-2xl sm:text-3xl font-black theme-text-main">
                                    {donorProfile.blood_type} <span className="text-sm font-normal theme-text-muted">({donorProfile.rhesus === 'positive' ? '+' : '-'})</span>
                                </p>
                            </div>

                            {/* Stat 2: Total Donasi */}
                            <div className="p-4 sm:p-5 rounded-2xl theme-bg-card border theme-border-card shadow-md relative overflow-hidden transition-colors">
                                <span className="text-[10px] font-bold theme-text-muted uppercase tracking-wider block mb-1">Total Donor</span>
                                <p className="text-2xl sm:text-3xl font-black theme-text-main">{donorProfile.total_donations} <span className="text-xs font-normal theme-text-muted">Kali</span></p>
                            </div>

                            {/* Stat 3: Poin Loyalitas */}
                            <div className="p-4 sm:p-5 rounded-2xl theme-bg-card border theme-border-card shadow-md relative overflow-hidden transition-colors">
                                <span className="text-[10px] font-bold theme-text-muted uppercase tracking-wider block mb-1">Loyalty Points</span>
                                <p className="text-2xl sm:text-3xl font-black text-red-500">{donorProfile.points} <span className="text-xs font-normal theme-text-muted">Pts</span></p>
                            </div>
                        </div>

                        {/* Booking & Reservasi Section */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-card shadow-md space-y-5 transition-colors">
                            <div>
                                <h3 className="font-bold theme-text-main text-base">Reservasi Jadwal Donor</h3>
                                <p className="text-xs theme-text-muted">Jadwalkan kunjungan Anda untuk menghindari antrean panjang</p>
                            </div>

                            {activeBooking ? (
                                /* Tampilan Booking Aktif */
                                <div className="p-5 border border-red-500/20 bg-red-500/5 rounded-2xl space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase">Reservasi Aktif</span>
                                            <h4 className="font-bold theme-text-main text-base mt-2">{activeBooking.slot.institution_name}</h4>
                                            <p className="text-xs theme-text-muted font-semibold mt-1">
                                                📅 {new Date(activeBooking.slot.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                            <p className="text-xs theme-text-muted font-mono mt-0.5">
                                                ⏰ {activeBooking.slot.start_time} - {activeBooking.slot.end_time} WIB
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs theme-text-muted uppercase tracking-wider block">No. Antrean</span>
                                            <span className="text-3xl font-black text-red-500 block">#{activeBooking.queue_number}</span>
                                        </div>
                                    </div>
                                    <div className="border-t theme-border-main pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                        <p className="text-[11px] theme-text-muted">
                                            Tunjukkan kode booking <span className="font-mono font-bold text-red-500">{activeBooking.qr_code}</span> saat check-in di lokasi.
                                        </p>
                                        <button 
                                            onClick={() => handleCancelBooking(activeBooking.id)}
                                            className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl text-xs font-bold transition duration-150"
                                        >
                                            Batalkan Reservasi
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Tampilan List Slot untuk Booking */
                                <div className="space-y-3">
                                    {!isEligible ? (
                                        <p className="text-xs text-rose-500 font-semibold bg-rose-500/5 p-3 rounded-xl">
                                            ⚠️ Anda saat ini belum layak melakukan donor darah baru berdasarkan riwayat medis. Pilihan reservasi akan kembali aktif secara otomatis setelah masa pemulihan Anda selesai.
                                        </p>
                                    ) : upcomingSlots.length === 0 ? (
                                        <p className="text-xs theme-text-muted text-center py-4">Belum ada slot waktu aktif yang dibuka oleh Unit PMI/RS.</p>
                                    ) : (
                                        <div className="divide-y theme-divide-main">
                                            {upcomingSlots.map((slot) => (
                                                <div key={slot.id} className="py-3.5 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                                                    <div>
                                                        <h4 className="font-bold text-sm theme-text-main">{slot.institution.name}</h4>
                                                        <p className="text-xs theme-text-muted mt-0.5">
                                                            {new Date(slot.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} | {slot.start_time} - {slot.end_time} WIB
                                                        </p>
                                                        {/* Progress bar kapasitas */}
                                                        <div className="w-40 bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden flex">
                                                            <div 
                                                                className="bg-red-500 h-full rounded-full" 
                                                                style={{ width: `${Math.min(100, (slot.booked_count / slot.max_capacity) * 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] theme-text-muted mt-1 block">
                                                            Kapasitas: {slot.booked_count} / {slot.max_capacity} terisi
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleBookSlot(slot.id, slot.institution.name)}
                                                        disabled={slot.booked_count >= slot.max_capacity}
                                                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition duration-150"
                                                    >
                                                        {slot.booked_count >= slot.max_capacity ? 'Penuh' : 'Pesan'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Riwayat Donasi Terakhir */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-card shadow-md space-y-6 transition-colors">
                            <div>
                                <h3 className="font-bold theme-text-main text-base">Riwayat Donasi Terakhir</h3>
                                <p className="text-xs theme-text-muted">Daftar kontribusi kemanusiaan yang berhasil Anda lakukan</p>
                            </div>

                            {donations.data.length === 0 ? (
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
                                                <th className="py-3 px-4">Volume</th>
                                                <th className="py-3 px-4">Loyalty Points</th>
                                                <th className="py-3 px-4">Status</th>
                                                <th className="py-3 px-4 text-right">Sertifikat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm divide-y theme-divide-main">
                                            {donations.data.map((donation) => (
                                                <tr key={donation.id} className="hover:bg-slate-500/5 transition">
                                                    <td className="py-4 px-4 font-semibold theme-text-main">
                                                        {new Date(donation.donated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </td>
                                                    <td className="py-4 px-4 theme-text-muted">{donation.blood_type}</td>
                                                    <td className="py-4 px-4 theme-text-muted">{donation.volume_ml || '-'} ml</td>
                                                    <td className="py-4 px-4 font-bold text-red-500">+100 Pts</td>
                                                    <td className="py-4 px-4">
                                                        <span className="text-[10px] bg-green-500/15 text-green-600 dark:text-green-400 px-2 py-0.5 rounded font-bold uppercase">
                                                            {donation.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <a 
                                                            href={`/donations/${donation.id}/certificate`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center text-xs font-bold text-red-500 hover:text-red-400 transition"
                                                        >
                                                            🖨️ Cetak
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            
                            {/* Pagination Links */}
                            {donations.links && donations.links.length > 3 && (
                                <div className="p-4 border-t theme-border-main flex items-center justify-center space-x-1 overflow-x-auto mt-4">
                                    {donations.links.map((link, i) => (
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
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
                    </div>

                    {/* Right Column (Sidebar Details) */}
                    <div className="space-y-6">
                        
                        {/* Kartu Anggota Digital (Phase 9) */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-red-900 via-rose-950 to-slate-950 text-white border border-red-500/20 shadow-2xl relative overflow-hidden space-y-6">
                            {/* Glowing lines in card background */}
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent pointer-events-none"></div>
                            
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[9px] uppercase tracking-widest font-black text-red-400">Kartu Pendonor Digital</span>
                                    <h4 className="text-lg font-black tracking-tight mt-1 text-white">Maridonor</h4>
                                </div>
                                <span className="text-xl">🩸</span>
                            </div>

                            <div className="space-y-4">
                                {/* Donor QR Mockup SVG */}
                                <div className="bg-white p-3 rounded-2xl w-32 h-32 mx-auto flex items-center justify-center shadow-lg border border-red-500/10">
                                    <svg className="w-28 h-28 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                                        {/* Dynamic QR SVG Pattern mockup representing user unique id */}
                                        <rect x="0" y="0" width="25" height="25" />
                                        <rect x="5" y="5" width="15" height="15" fill="white" />
                                        <rect x="10" y="10" width="5" height="5" />
                                        
                                        <rect x="75" y="0" width="25" height="25" />
                                        <rect x="80" y="5" width="15" height="15" fill="white" />
                                        <rect x="85" y="10" width="5" height="5" />

                                        <rect x="0" y="75" width="25" height="25" />
                                        <rect x="5" y="80" width="15" height="15" fill="white" />
                                        <rect x="10" y="85" width="5" height="5" />

                                        {/* Randomized bits */}
                                        <rect x="35" y="5" width="10" height="5" />
                                        <rect x="55" y="5" width="5" height="10" />
                                        <rect x="35" y="20" width="15" height="5" />
                                        <rect x="60" y="20" width="10" height="10" />
                                        
                                        <rect x="5" y="35" width="15" height="5" />
                                        <rect x="10" y="45" width="10" height="10" />
                                        <rect x="25" y="35" width="10" height="15" />
                                        <rect x="40" y="35" width="25" height="5" />
                                        
                                        <rect x="5" y="60" width="5" height="10" />
                                        <rect x="20" y="65" width="15" height="5" />
                                        
                                        <rect x="75" y="35" width="15" height="15" />
                                        <rect x="85" y="55" width="10" height="5" />
                                        <rect x="75" y="65" width="5" height="10" />
                                        
                                        <rect x="35" y="75" width="5" height="20" />
                                        <rect x="45" y="75" width="15" height="5" />
                                        <rect x="45" y="85" width="10" height="10" />
                                        <rect x="65" y="85" width="10" height="5" />
                                        <rect x="80" y="80" width="15" height="15" />
                                    </svg>
                                </div>
                                <p className="text-center text-[10px] font-mono text-red-300 tracking-wider">
                                    {activeBooking ? activeBooking.qr_code : `DONOR-${auth.user.name.toUpperCase().substring(0,3)}-${donorProfile.points}`}
                                </p>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs">
                                <div>
                                    <span className="text-[9px] text-red-400 block font-bold uppercase">Nama Pendonor</span>
                                    <span className="font-extrabold text-white block truncate max-w-[120px]">{auth.user.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] text-red-400 block font-bold uppercase">Status</span>
                                    <span className="font-extrabold text-emerald-400 block">Aktif</span>
                                </div>
                            </div>
                        </div>

                        {/* Permintaan Darah Darurat Aktif (Phase 10) */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-card shadow-md space-y-4 transition-colors">
                            <div>
                                <h3 className="font-bold theme-text-main text-sm">Permintaan Darurat Aktif</h3>
                                <p className="text-[10px] theme-text-muted">Daftar permohonan darah mendesak yang butuh pertolongan</p>
                            </div>

                            <div className="space-y-3.5">
                                {activeBloodRequests.length === 0 ? (
                                    <p className="text-xs theme-text-muted text-center py-4">Tidak ada permintaan darah darurat aktif saat ini.</p>
                                ) : (
                                    activeBloodRequests.map((req) => (
                                        <div key={req.id} className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="inline-flex text-[9px] font-extrabold bg-red-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                                                        {req.blood_type} {req.rhesus === 'positive' ? 'Pos' : 'Neg'}
                                                    </span>
                                                    <h4 className="text-xs font-extrabold theme-text-main mt-2">{req.hospital_name}</h4>
                                                    <p className="text-[10px] theme-text-muted font-medium capitalize mt-0.5">
                                                        Kebutuhan: {req.component_type.replace('_', ' ')}
                                                    </p>
                                                    <p className="text-[10px] text-red-550 dark:text-red-400 font-bold mt-1">
                                                        Kekurangan: {req.quantity_needed - req.quantity_fulfilled} Kantong lagi
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleRespondRequest(req)}
                                                className="w-full py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white text-xs font-bold rounded-xl transition duration-150"
                                            >
                                                Bersedia Donor
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>

            {/* Modal Edit Profil */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-lg font-bold theme-text-main">Edit Profil Saya</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Nomor HP</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Jenis Kelamin</label>
                                    <select 
                                        value={profileForm.gender}
                                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="male">Laki-laki</option>
                                        <option value="female">Perempuan</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Tanggal Lahir</label>
                                    <input 
                                        type="date" 
                                        required 
                                        value={profileForm.birth_date}
                                        onChange={(e) => setProfileForm({ ...profileForm, birth_date: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Golongan Darah</label>
                                    <select 
                                        value={profileForm.blood_type}
                                        onChange={(e) => setProfileForm({ ...profileForm, blood_type: e.target.value })}
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
                                        value={profileForm.rhesus}
                                        onChange={(e) => setProfileForm({ ...profileForm, rhesus: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="positive">Positif (+)</option>
                                        <option value="negative">Negatif (-)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-sm font-semibold"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-gradient-to-r from-red-650 to-rose-650 hover:from-red-600 hover:to-rose-600 theme-text-main rounded-xl text-sm font-semibold shadow-lg"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
