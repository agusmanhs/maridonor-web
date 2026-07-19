import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

interface BloodRequestItem {
    id: string;
    request_code: string;
    patient_name: string;
    blood_type: string;
    rhesus: string;
    component_type: string;
    quantity_needed: number;
    quantity_fulfilled: number;
    urgency_level: string;
    status: string;
    deadline_at: string;
    destination_hospital?: {
        name: string;
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

interface Props {
    requests: BloodRequestItem[];
    filters: {
        urgency_level?: string;
        status?: string;
    };
    currentInstitution: Institution;
    auth: {
        user: User;
    };
}

export default function BloodRequestIndex({ requests, filters, currentInstitution, auth }: Props) {
    const [selectedUrgency, setSelectedUrgency] = useState(filters.urgency_level || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    
    // State Modal Request Baru
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    
    // State Form Request
    const [formData, setFormData] = useState({
        patient_name: '',
        patient_birth_year: 1990,
        medical_record_number: '',
        diagnosis: '',
        blood_type: 'O',
        rhesus: 'positive',
        component_type: 'prc',
        quantity_needed: 2,
        urgency_level: 'emergency',
        contact_name: auth.user.name,
        contact_phone: '081234567890',
        deadline_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0] + 'T12:00',
        notes: '',
    });

    const handleFilterChange = (key: string, value: string) => {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');

        const newFilters: any = {
            urgency_level: selectedUrgency,
            status: selectedStatus,
            [key]: value
        };

        if (type) {
            newFilters.type = type;
        }

        router.get('/blood-requests', newFilters, {
            preserveState: true,
            replace: true
        });
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/blood-requests', formData, {
            onSuccess: () => {
                setIsRequestModalOpen(false);
                setFormData({
                    patient_name: '',
                    patient_birth_year: 1990,
                    medical_record_number: '',
                    diagnosis: '',
                    blood_type: 'O',
                    rhesus: 'positive',
                    component_type: 'prc',
                    quantity_needed: 2,
                    urgency_level: 'emergency',
                    contact_name: auth.user.name,
                    contact_phone: '081234567890',
                    deadline_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0] + 'T12:00',
                    notes: '',
                });
            }
        });
    };

    const isHospital = currentInstitution?.type === 'hospital';

    return (
        <>
            <Head title="Permohonan Darah - Maridonor" />
            <DashboardLayout
                sidebarType={isHospital ? 'hospital' : 'pmi'}
                title="Permohonan Darah Darurat"
                subtitle={isHospital ? 'Ajukan dan pantau status permohonan bank darah RS' : 'Daftar permohonan masuk dari Rumah Sakit mitra'}
                headerRight={isHospital ? (
                    <button 
                        onClick={() => setIsRequestModalOpen(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-600/15 transition-all duration-150 active:scale-95"
                    >
                        + Ajukan Permohonan Darah
                    </button>
                ) : undefined}
            >

                    {/* Filter Panel */}
                    <div className="theme-bg-card border theme-border-main p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold theme-text-muted uppercase">Tingkat Urgensi</label>
                            <select 
                                value={selectedUrgency}
                                onChange={(e) => {
                                    setSelectedUrgency(e.target.value);
                                    handleFilterChange('urgency_level', e.target.value);
                                }}
                                className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                            >
                                <option value="">Semua Urgensi</option>
                                <option value="normal">Normal</option>
                                <option value="urgent">Urgent</option>
                                <option value="emergency">Emergency</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold theme-text-muted uppercase">Status</label>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    handleFilterChange('status', e.target.value);
                                }}
                                className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                            >
                                <option value="">Semua Status</option>
                                <option value="open">Menunggu (Open)</option>
                                <option value="partially_fulfilled">Terpenuhi Sebagian</option>
                                <option value="fulfilled">Selesai (Fulfilled)</option>
                                <option value="cancelled">Dibatalkan</option>
                            </select>
                        </div>
                    </div>

                    {/* Request Table */}
                    <div className="theme-bg-card border theme-border-main rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                        <th className="py-3 px-4">Kode Request</th>
                                        {!isHospital && <th className="py-3 px-4">Rumah Sakit</th>}
                                        <th className="py-3 px-4">Pasien</th>
                                        <th className="py-3 px-4">Tipe Darah</th>
                                        <th className="py-3 px-4">Komponen</th>
                                        <th className="py-3 px-4 text-center">Pemenuhan</th>
                                        <th className="py-3 px-4">Urgensi</th>
                                        <th className="py-3 px-4">Tenggat Waktu</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y theme-divide-main">
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan={isHospital ? 9 : 10} className="py-8 text-center text-slate-500 font-semibold">
                                                Tidak ada permohonan darah terdaftar saat ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        requests.map((req) => (
                                            <tr key={req.id} className="hover:slate-500/5 transition duration-100">
                                                <td className="py-4 px-4 font-mono font-semibold theme-text-main">{req.request_code}</td>
                                                {!isHospital && (
                                                    <td className="py-4 px-4 theme-text-muted font-semibold">
                                                        {req.destination_hospital?.name || '-'}
                                                    </td>
                                                )}
                                                <td className="py-4 px-4 theme-text-muted">{req.patient_name}</td>
                                                <td className="py-4 px-4 theme-text-main">
                                                    <span className="font-bold">{req.blood_type}</span>
                                                    <span className="text-xs theme-text-muted"> ({req.rhesus === 'positive' ? '+' : '-'})</span>
                                                </td>
                                                <td className="py-4 px-4 theme-text-muted capitalize">{req.component_type.replace('_', ' ')}</td>
                                                <td className="py-4 px-4 text-center font-semibold theme-text-main">
                                                    {req.quantity_fulfilled} / {req.quantity_needed} Bag
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                        req.urgency_level === 'emergency' ? 'bg-red-500/10 text-red-500 animate-pulse' :
                                                        req.urgency_level === 'urgent' ? 'bg-orange-500/10 text-orange-500' :
                                                        'theme-bg-sidebar theme-text-muted'
                                                    }`}>
                                                        {req.urgency_level}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 theme-text-muted">
                                                    {new Date(req.deadline_at).toLocaleDateString('id-ID')} {new Date(req.deadline_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                        req.status === 'open' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        req.status === 'partially_fulfilled' ? 'bg-blue-500/10 text-blue-500' :
                                                        req.status === 'fulfilled' ? 'bg-green-500/10 text-green-500' :
                                                        'bg-slate-800 theme-text-muted'
                                                    }`}>
                                                        {req.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <Link 
                                                        href={`/blood-requests/${req.id}${typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('type') ? `?type=${new URLSearchParams(window.location.search).get('type')}` : ''}`}
                                                        className="px-3 py-1 bg-red-600/10 hover:bg-red-600/25 text-red-500 rounded-lg text-xs font-bold border border-red-500/25 transition duration-150"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
            </DashboardLayout>

            {/* Modal Form Permohonan Darah Baru */}
            {isRequestModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-lg font-bold theme-text-main">Ajukan Permohonan Darah Darurat</h3>
                            <button onClick={() => setIsRequestModalOpen(false)} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Nama Pasien</label>
                                    <input 
                                        type="text" 
                                        placeholder="Nama lengkap pasien"
                                        value={formData.patient_name}
                                        onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Tahun Lahir</label>
                                    <input 
                                        type="number" 
                                        value={formData.patient_birth_year}
                                        onChange={(e) => setFormData({ ...formData, patient_birth_year: parseInt(e.target.value) })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">No. Rekam Medis (MR)</label>
                                    <input 
                                        type="text" 
                                        placeholder="MR-xxxxxx"
                                        value={formData.medical_record_number}
                                        onChange={(e) => setFormData({ ...formData, medical_record_number: e.target.value })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Diagnosis / Alasan Medis</label>
                                    <input 
                                        type="text" 
                                        placeholder="contoh: Anemia Kronis"
                                        value={formData.diagnosis}
                                        onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Golongan Darah</label>
                                    <select 
                                        value={formData.blood_type}
                                        onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
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
                                        value={formData.rhesus}
                                        onChange={(e) => setFormData({ ...formData, rhesus: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="positive">Positif (+)</option>
                                        <option value="negative">Negatif (-)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Komponen</label>
                                    <select 
                                        value={formData.component_type}
                                        onChange={(e) => setFormData({ ...formData, component_type: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="whole_blood">Whole Blood (WB)</option>
                                        <option value="prc">Packed Red Cells (PRC)</option>
                                        <option value="ffp">Fresh Frozen Plasma (FFP)</option>
                                        <option value="platelet">Thrombocyte/Platelet</option>
                                        <option value="cryo">Cryoprecipitate</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Jumlah Kantong</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={formData.quantity_needed}
                                        onChange={(e) => setFormData({ ...formData, quantity_needed: parseInt(e.target.value) })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Urgensi</label>
                                    <select 
                                        value={formData.urgency_level}
                                        onChange={(e) => setFormData({ ...formData, urgency_level: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="emergency">Emergency (Kritis)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Nama Kontak Staf</label>
                                    <input 
                                        type="text" 
                                        value={formData.contact_name}
                                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">No. Telepon Kontak</label>
                                    <input 
                                        type="text" 
                                        value={formData.contact_phone}
                                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Tenggat Waktu Pemenuhan</label>
                                <input 
                                    type="datetime-local" 
                                    value={formData.deadline_at}
                                    onChange={(e) => setFormData({ ...formData, deadline_at: e.target.value })}
                                    required 
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Catatan Tambahan</label>
                                <textarea 
                                    rows={2}
                                    placeholder="Instruksi tambahan jika ada..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                <button 
                                    type="button" 
                                    onClick={() => setIsRequestModalOpen(false)}
                                    className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-sm font-semibold transition duration-150"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 theme-text-main rounded-xl text-sm font-semibold transition duration-150"
                                >
                                    Kirim Permohonan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
