import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';

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

interface Props {
    stocks: BloodStockItem[];
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
        const newFilters = {
            blood_type: selectedBloodType,
            component_type: selectedComponent,
            status: selectedStatus,
            [key]: value
        };

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
                        <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Menu Utama</span>
                        <Link href={isPmi ? '/dashboard/pmi' : '/dashboard/hospital'} className="flex items-center space-x-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-850 rounded-xl text-sm font-semibold transition duration-150">
                            <span>📊</span>
                            <span>Ikhtisar Dashboard</span>
                        </Link>
                        <Link href="/blood-stocks" className="flex items-center space-x-3 px-3 py-2.5 bg-red-600/10 text-red-500 rounded-xl text-sm font-semibold border border-red-500/10">
                            <span>{isPmi ? '🩸' : '🩺'}</span>
                            <span>{isPmi ? 'Kelola Stok Darah' : 'Stok Bank Darah RS'}</span>
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                                {isPmi ? 'Inventori Stok Darah PMI' : 'Bank Darah Rumah Sakit'}
                            </h1>
                            <p className="text-sm text-slate-400">
                                {currentInstitution?.name} — {isPmi ? 'Pencatatan & Alokasi Distribusi' : 'Pemantauan Kantong Darah Diterima'}
                            </p>
                        </div>
                        {isPmi && (
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-600/15 transition-all duration-150 active:scale-95"
                            >
                                + Registrasi Kantong Darah
                            </button>
                        )}
                    </div>

                    {/* Filter Panel */}
                    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase">Golongan Darah</label>
                            <select 
                                value={selectedBloodType}
                                onChange={(e) => {
                                    setSelectedBloodType(e.target.value);
                                    handleFilterChange('blood_type', e.target.value);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
                            >
                                <option value="">Semua Golongan</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="AB">AB</option>
                                <option value="O">O</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase">Komponen</label>
                            <select 
                                value={selectedComponent}
                                onChange={(e) => {
                                    setSelectedComponent(e.target.value);
                                    handleFilterChange('component_type', e.target.value);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
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
                            <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    handleFilterChange('status', e.target.value);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
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
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-xs font-bold text-slate-400">
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
                                <tbody className="text-sm divide-y divide-slate-850">
                                    {stocks.length === 0 ? (
                                        <tr>
                                            <td colSpan={isPmi ? 8 : 7} className="py-8 text-center text-slate-500 font-semibold">
                                                Tidak ada kantong darah terdaftar dengan filter ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        stocks.map((stock) => {
                                            const daysLeft = Math.ceil((new Date(stock.expires_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                            const isNearExpired = daysLeft > 0 && daysLeft <= 7;

                                            return (
                                                <tr key={stock.id} className="hover:bg-slate-850/30 transition duration-100">
                                                    <td className="py-4 px-4 font-mono font-semibold text-white">{stock.bag_number}</td>
                                                    <td className="py-4 px-4 text-slate-200">
                                                        <span className="font-bold">{stock.blood_type}</span>
                                                        <span className="text-xs text-slate-400"> ({stock.rhesus === 'positive' ? 'Positif' : 'Negatif'})</span>
                                                    </td>
                                                    <td className="py-4 px-4 text-slate-300 capitalize">{stock.component_type.replace('_', ' ')}</td>
                                                    <td className="py-4 px-4 text-slate-300">{stock.quantity_ml} ml</td>
                                                    <td className="py-4 px-4 text-slate-400">{new Date(stock.collected_at).toLocaleDateString('id-ID')}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`font-semibold ${isNearExpired ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>
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
                                                                'bg-slate-800 text-slate-400'
                                                            }`}>
                                                                {stock.status}
                                                            </span>
                                                            {stock.status === 'distributed' && stock.distributed_to_details && (
                                                                <span className="text-[10px] text-slate-400 font-semibold">
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
                    </div>
                </main>
            </div>

            {/* Modal Tambah Kantong Darah */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">Registrasi Kantong Darah Baru</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase">Nomor Bag/Barcode</label>
                                <input 
                                    type="text" 
                                    placeholder="contoh: BAG-PMI-88421"
                                    value={formData.bag_number}
                                    onChange={(e) => setFormData({ ...formData, bag_number: e.target.value })}
                                    required 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Golongan Darah</label>
                                    <select 
                                        value={formData.blood_type}
                                        onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Rhesus</label>
                                    <select 
                                        value={formData.rhesus}
                                        onChange={(e) => setFormData({ ...formData, rhesus: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                                    >
                                        <option value="positive">Positif (+)</option>
                                        <option value="negative">Negatif (-)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Komponen Darah</label>
                                    <select 
                                        value={formData.component_type}
                                        onChange={(e) => setFormData({ ...formData, component_type: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                                    >
                                        <option value="whole_blood">Whole Blood (WB)</option>
                                        <option value="prc">Packed Red Cells (PRC)</option>
                                        <option value="ffp">Fresh Frozen Plasma (FFP)</option>
                                        <option value="platelet">Thrombocyte/Platelet</option>
                                        <option value="cryo">Cryoprecipitate</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Volume (ml)</label>
                                    <input 
                                        type="number" 
                                        value={formData.quantity_ml}
                                        onChange={(e) => setFormData({ ...formData, quantity_ml: parseInt(e.target.value) })}
                                        required 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase">Tanggal Diambil / Donor</label>
                                <input 
                                    type="date" 
                                    value={formData.collected_at}
                                    onChange={(e) => setFormData({ ...formData, collected_at: e.target.value })}
                                    required 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border border-slate-800 hover:bg-slate-850 text-slate-350 rounded-xl text-sm font-semibold transition duration-150"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition duration-150"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">Alokasi Distribusi Kantong</h3>
                            <button onClick={() => setIsDistributeModalOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleDistributeSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-400 uppercase">Rumah Sakit Penerima</label>
                                <select 
                                    value={targetHospitalId}
                                    onChange={(e) => setTargetHospitalId(e.target.value)}
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
                                >
                                    <option value="">Pilih RS Penerima</option>
                                    {hospitals.map((h) => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsDistributeModalOpen(false);
                                        setTargetHospitalId('');
                                    }}
                                    className="px-4 py-2 border border-slate-800 hover:bg-slate-850 text-slate-350 rounded-xl text-sm font-semibold transition duration-150"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={!targetHospitalId}
                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition duration-150"
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
