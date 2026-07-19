import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

interface BloodStockItem {
    id: string;
    bag_number: string;
    blood_type: string;
    rhesus: string;
    component_type: string;
    quantity_ml: number;
    status: string;
    collected_at: string;
    expires_at: string;
    distributed_to_details?: {
        name: string;
    };
}

interface HospitalItem {
    id: string;
    name: string;
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
    stocks: PaginatedData<BloodStockItem>;
    hospitals: HospitalItem[];
    filters: {
        blood_type?: string;
        component_type?: string;
        status?: string;
    };
    currentInstitution: Institution;
    auth: {
        user: User;
    };
}

export default function BloodStockIndex({ stocks, hospitals, filters, currentInstitution, auth }: Props) {
    const [selectedBloodType, setSelectedBloodType] = useState(filters.blood_type || '');
    const [selectedComponent, setSelectedComponent] = useState(filters.component_type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    // State Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false);
    const [selectedStockIdForDistribute, setSelectedStockIdForDistribute] = useState('');

    // State Form Tambah
    const [formData, setFormData] = useState({
        bag_number: '',
        blood_type: 'O',
        rhesus: 'positive',
        component_type: 'prc',
        quantity_ml: 350,
        collected_at: new Date().toISOString().split('T')[0],
        expires_at: '',
    });

    // State Form Distribusi
    const [targetHospitalId, setTargetHospitalId] = useState('');

    const handleFilterChange = (key: string, value: string) => {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');

        const newFilters: any = {
            blood_type: selectedBloodType,
            component_type: selectedComponent,
            status: selectedStatus,
            [key]: value
        };

        if (type) {
            newFilters.type = type;
        }

        // Kirim filter ke backend menggunakan router.get
        router.get('/blood-stocks', newFilters, {
            preserveState: true,
            replace: true
        });
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/blood-stocks', formData, {
            onSuccess: () => {
                setIsAddModalOpen(false);
                setFormData({
                    bag_number: '',
                    blood_type: 'O',
                    rhesus: 'positive',
                    component_type: 'prc',
                    quantity_ml: 350,
                    collected_at: new Date().toISOString().split('T')[0],
                    expires_at: '',
                });
            }
        });
    };

    const handleDistributeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetHospitalId) return;

        router.post(`/blood-stocks/${selectedStockIdForDistribute}/distribute`, {
            to_institution_id: targetHospitalId
        }, {
            onSuccess: () => {
                setIsDistributeModalOpen(false);
                setTargetHospitalId('');
                setSelectedStockIdForDistribute('');
            }
        });
    };

    const isPmi = currentInstitution?.type === 'pmi';

    return (
        <>
            <Head title="Kelola Stok Darah - Maridonor" />
            <DashboardLayout
                sidebarType={isPmi ? 'pmi' : 'hospital'}
                title={isPmi ? 'Inventori Stok Darah PMI' : 'Bank Darah Rumah Sakit'}
                subtitle={`${currentInstitution?.name} — ${isPmi ? 'Pencatatan & Alokasi Distribusi' : 'Pemantauan Kantong Darah Diterima'}`}
                headerRight={isPmi ? (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-600/15 transition-all duration-150 active:scale-95"
                    >
                        + Registrasi Kantong Darah
                    </button>
                ) : undefined}
            >

                    {/* Filter Panel */}
                    <div className="theme-bg-card border theme-border-main p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold theme-text-muted uppercase">Golongan Darah</label>
                            <select 
                                value={selectedBloodType}
                                onChange={(e) => {
                                    setSelectedBloodType(e.target.value);
                                    handleFilterChange('blood_type', e.target.value);
                                }}
                                className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                            >
                                <option value="">Semua Golongan</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold theme-text-muted uppercase">Komponen</label>
                            <select 
                                value={selectedComponent}
                                onChange={(e) => {
                                    setSelectedComponent(e.target.value);
                                    handleFilterChange('component_type', e.target.value);
                                }}
                                className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                            >
                                <option value="">Semua Komponen</option>
                                <option value="whole_blood">Whole Blood (WB)</option>
                                <option value="prc">Packed Red Cells (PRC)</option>
                                <option value="ffp">Fresh Frozen Plasma (FFP)</option>
                                <option value="platelet">Thrombocyte/Platelet</option>
                                <option value="cryo">Cryoprecipitate</option>
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
                                <option value="available">Tersedia (Available)</option>
                                <option value="distributed">Didistribusikan (Distributed)</option>
                                <option value="reserved">Dipesan (Reserved)</option>
                                <option value="discarded">Dibuang (Discarded)</option>
                            </select>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="theme-bg-card border theme-border-main rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                        <th className="py-3 px-4">Nomor Bag</th>
                                        <th className="py-3 px-4">Tipe Darah</th>
                                        <th className="py-3 px-4">Komponen</th>
                                        <th className="py-3 px-4">Volume (ml)</th>
                                        <th className="py-3 px-4">Tanggal Diambil</th>
                                        <th className="py-3 px-4">Kedaluwarsa</th>
                                        <th className="py-3 px-4">Status / Distribusi</th>
                                        {isPmi && <th className="py-3 px-4 text-center">Aksi</th>}
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y theme-divide-main">
                                    {stocks.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={isPmi ? 8 : 7} className="py-8 text-center text-slate-500 font-semibold">
                                                Tidak ada kantong darah terdaftar dengan filter ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        stocks.data.map((stock) => {
                                            const daysLeft = Math.ceil((new Date(stock.expires_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                            const isNearExpired = daysLeft > 0 && daysLeft <= 7;

                                            return (
                                                <tr key={stock.id} className="hover:slate-500/5 transition duration-100">
                                                    <td className="py-4 px-4 font-mono font-semibold theme-text-main">{stock.bag_number}</td>
                                                    <td className="py-4 px-4 theme-text-main">
                                                        <span className="font-bold">{stock.blood_type}</span>
                                                        <span className="text-xs theme-text-muted"> ({stock.rhesus === 'positive' ? 'Positif' : 'Negatif'})</span>
                                                    </td>
                                                    <td className="py-4 px-4 theme-text-muted capitalize">{stock.component_type.replace('_', ' ')}</td>
                                                    <td className="py-4 px-4 theme-text-muted">{stock.quantity_ml} ml</td>
                                                    <td className="py-4 px-4 theme-text-muted">{new Date(stock.collected_at).toLocaleDateString('id-ID')}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`font-semibold ${isNearExpired ? 'text-rose-500 animate-pulse' : 'theme-text-muted'}`}>
                                                            {new Date(stock.expires_at).toLocaleDateString('id-ID')}
                                                        </span>
                                                        {isNearExpired && <span className="text-[10px] block font-bold text-rose-500">({daysLeft} hari lagi!)</span>}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-col space-y-1">
                                                            <span className={`inline-flex max-w-max text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                                stock.status === 'available' ? 'bg-green-500/10 text-green-500' :
                                                                stock.status === 'distributed' ? 'bg-blue-500/10 text-blue-500' :
                                                                stock.status === 'reserved' ? 'bg-yellow-500/10 text-yellow-500' :
                                                                'bg-slate-800 theme-text-muted'
                                                            }`}>
                                                                {stock.status}
                                                            </span>
                                                            {stock.status === 'distributed' && stock.distributed_to_details && (
                                                                <span className="text-[10px] theme-text-muted font-semibold">
                                                                    ke: {stock.distributed_to_details.name}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    {isPmi && (
                                                        <td className="py-4 px-4 text-center">
                                                            {stock.status === 'available' ? (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedStockIdForDistribute(stock.id);
                                                                        setIsDistributeModalOpen(true);
                                                                    }}
                                                                    className="px-3 py-1 bg-red-600/10 hover:bg-red-600/25 text-red-500 rounded-lg text-xs font-bold border border-red-500/25 transition duration-150"
                                                                >
                                                                    Distribusikan
                                                                </button>
                                                            ) : (
                                                                <span className="text-xs text-slate-500 font-semibold">-</span>
                                                            )}
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Links */}
                        {stocks.links && stocks.links.length > 3 && (
                            <div className="p-4 border-t theme-border-main flex items-center justify-center space-x-1 overflow-x-auto">
                                {stocks.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
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
            </DashboardLayout>

            {/* Modal Tambah Kantong Darah */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-lg font-bold theme-text-main">Registrasi Kantong Darah Baru</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Nomor Bag/Barcode</label>
                                <input 
                                    type="text" 
                                    placeholder="contoh: BAG-PMI-88421"
                                    value={formData.bag_number}
                                    onChange={(e) => setFormData({ ...formData, bag_number: e.target.value })}
                                    required 
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Komponen Darah</label>
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
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Volume (ml)</label>
                                    <input 
                                        type="number" 
                                        value={formData.quantity_ml}
                                        onChange={(e) => setFormData({ ...formData, quantity_ml: parseInt(e.target.value) })}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Tanggal Diambil / Donor</label>
                                <input 
                                    type="date" 
                                    value={formData.collected_at}
                                    onChange={(e) => setFormData({ ...formData, collected_at: e.target.value })}
                                    required 
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-sm font-semibold transition duration-150"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 theme-text-main rounded-xl text-sm font-semibold transition duration-150"
                                >
                                    Daftarkan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Distribusikan Kantong Darah */}
            {isDistributeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-lg font-bold theme-text-main">Alokasi Distribusi Kantong</h3>
                            <button onClick={() => setIsDistributeModalOpen(false)} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleDistributeSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Rumah Sakit Penerima</label>
                                <select 
                                    value={targetHospitalId}
                                    onChange={(e) => setTargetHospitalId(e.target.value)}
                                    required
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                >
                                    <option value="">Pilih RS Penerima</option>
                                    {hospitals.map((h) => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsDistributeModalOpen(false);
                                        setTargetHospitalId('');
                                    }}
                                    className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-sm font-semibold transition duration-150"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={!targetHospitalId}
                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 disabled:opacity-50 theme-text-main rounded-xl text-sm font-semibold transition duration-150"
                                >
                                    Kirim Distribusi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
