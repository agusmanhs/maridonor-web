import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import DashboardLayout from '../../Layouts/DashboardLayout';

interface BloodStockItem {
    id: string;
    bag_number: string;
    quantity_ml: number;
    collected_at: string;
    expires_at: string;
}

interface BloodRequestDetail {
    id: string;
    request_code: string;
    patient_name: string;
    patient_birth_year: number;
    medical_record_number: string;
    diagnosis: string;
    blood_type: string;
    rhesus: string;
    component_type: string;
    quantity_needed: number;
    quantity_fulfilled: number;
    urgency_level: string;
    status: string;
    contact_name: string;
    contact_phone: string;
    notes?: string;
    deadline_at: string;
    destination_hospital: {
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
    bloodRequest: BloodRequestDetail;
    matchingStocks: BloodStockItem[];
    currentInstitution: Institution;
    auth: {
        user: User;
    };
}

export default function BloodRequestShow({ bloodRequest, matchingStocks, currentInstitution, auth }: Props) {
    const [selectedStockIds, setSelectedStockIds] = useState<string[]>([]);

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const handleCheckboxChange = (stockId: string) => {
        if (selectedStockIds.includes(stockId)) {
            setSelectedStockIds(selectedStockIds.filter(id => id !== stockId));
        } else {
            // Jaga agar jumlah pilihan tidak melebihi sisa kantong yang dibutuhkan
            const remainingNeeded = bloodRequest.quantity_needed - bloodRequest.quantity_fulfilled;
            if (selectedStockIds.length < remainingNeeded) {
                setSelectedStockIds([...selectedStockIds, stockId]);
            }
        }
    };

    const handleFulfillSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedStockIds.length === 0) return;

        router.post(`/blood-requests/${bloodRequest.id}/fulfill`, {
            blood_stock_ids: selectedStockIds
        }, {
            onSuccess: () => {
                setSelectedStockIds([]);
            }
        });
    };

    const isPmi = currentInstitution?.type === 'pmi';
    const remainingNeeded = bloodRequest.quantity_needed - bloodRequest.quantity_fulfilled;

    return (
        <>
            <Head title={`Permohonan ${bloodRequest.request_code} - Maridonor`} />
            <DashboardLayout
                sidebarType={isPmi ? 'pmi' : 'hospital'}
            >
                    
                    {/* Header */}
                    <div className="pb-6 border-b theme-border-main flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center space-x-3">
                                <Link 
                                    href={`/blood-requests${typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('type') ? `?type=${new URLSearchParams(window.location.search).get('type')}` : ''}`} 
                                    className="text-red-500 hover:text-red-400 font-semibold text-sm"
                                >
                                    &larr; Kembali
                                </Link>
                                <span className="text-slate-600">/</span>
                                <span className="font-mono text-sm theme-text-muted font-bold">{bloodRequest.request_code}</span>
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold theme-text-main tracking-tight">Detail Permohonan Darah</h1>
                        </div>

                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1.5 text-xs font-bold rounded-xl uppercase ${
                                bloodRequest.urgency_level === 'emergency' ? 'bg-red-500/10 text-red-500 animate-pulse' :
                                bloodRequest.urgency_level === 'urgent' ? 'bg-orange-500/10 text-orange-500' :
                                'bg-slate-800 theme-text-muted'
                            }`}>
                                Urgensi: {bloodRequest.urgency_level}
                            </span>
                            <span className={`px-3 py-1.5 text-xs font-bold rounded-xl uppercase ${
                                bloodRequest.status === 'open' ? 'bg-yellow-500/10 text-yellow-500' :
                                bloodRequest.status === 'partially_fulfilled' ? 'bg-blue-500/10 text-blue-500' :
                                bloodRequest.status === 'fulfilled' ? 'bg-green-500/10 text-green-500' :
                                'bg-slate-800 theme-text-muted'
                            }`}>
                                Status: {bloodRequest.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Patient & Hospital Info Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Detail Data Pasien */}
                        <div className="lg:col-span-2 p-6 rounded-2xl theme-bg-card border theme-border-main space-y-6">
                            <div>
                                <h3 className="font-bold theme-text-main text-base">Informasi Medis Pasien</h3>
                                <p className="text-xs theme-text-muted">Rincian data identitas dan kebutuhan klinis</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nama Lengkap Pasien</span>
                                    <span className="theme-text-main font-semibold">{bloodRequest.patient_name}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">No. Rekam Medis (MR)</span>
                                    <span className="theme-text-main font-mono font-semibold">{bloodRequest.medical_record_number}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Golongan Darah & Rhesus</span>
                                    <span className="theme-text-main font-bold">{bloodRequest.blood_type} ({bloodRequest.rhesus === 'positive' ? 'Positif' : 'Negatif'})</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jenis Komponen Darah</span>
                                    <span className="theme-text-main font-semibold capitalize">{bloodRequest.component_type.replace('_', ' ')}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jumlah Kantong Dibutuhkan</span>
                                    <span className="theme-text-main font-semibold">{bloodRequest.quantity_needed} Kantong (Terpenuhi: {bloodRequest.quantity_fulfilled})</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Batas Waktu (Deadline)</span>
                                    <span className="text-rose-500 font-semibold">
                                        {new Date(bloodRequest.deadline_at).toLocaleDateString('id-ID')} {new Date(bloodRequest.deadline_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-850 space-y-2">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Diagnosis Klinis</span>
                                    <p className="text-slate-350 text-sm font-semibold">{bloodRequest.diagnosis}</p>
                                </div>
                                {bloodRequest.notes && (
                                    <div className="space-y-1 pt-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Catatan Tambahan RS</span>
                                        <p className="theme-text-muted text-xs italic">{bloodRequest.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Kontak & Lokasi RS */}
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-main space-y-6">
                            <div>
                                <h3 className="font-bold theme-text-main text-base">Rumah Sakit Pengirim</h3>
                                <p className="text-xs theme-text-muted">Instansi penanggung jawab alokasi</p>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Rumah Sakit Penerima</span>
                                    <p className="theme-text-main font-semibold">{bloodRequest.destination_hospital.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Staf Kontak RS</span>
                                    <p className="theme-text-main font-semibold">{bloodRequest.contact_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Nomor Telepon</span>
                                    <p className="text-red-500 font-semibold">{bloodRequest.contact_phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FULFILLMENT AREA (Khusus PMI & Stok Sisa > 0) */}
                    {isPmi && remainingNeeded > 0 && (
                        <div className="p-6 rounded-2xl theme-bg-card border theme-border-main space-y-6">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                                <div>
                                    <h3 className="font-bold theme-text-main text-base">Alokasikan Kantong Darah dari PMI</h3>
                                    <p className="text-xs theme-text-muted">Cari dan pilih kantong darah yang cocok untuk diserahkan ke Rumah Sakit</p>
                                </div>
                                <span className="text-xs font-bold theme-text-muted theme-bg-main border border-slate-850 px-3 py-1 rounded-xl">
                                    Sisa Kebutuhan: {remainingNeeded} Kantong
                                </span>
                            </div>

                            {matchingStocks.length === 0 ? (
                                <p className="text-sm text-slate-500 font-semibold py-4 text-center">
                                    ⚠️ Maaf, tidak ada stok kantong darah yang cocok ({bloodRequest.blood_type} {bloodRequest.rhesus === 'positive' ? 'Positif' : 'Negatif'} {bloodRequest.component_type.replace('_', ' ').toUpperCase()}) dengan status 'available' di UDD Anda saat ini.
                                </p>
                            ) : (
                                <form onSubmit={handleFulfillSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {matchingStocks.map((stock) => {
                                            const isChecked = selectedStockIds.includes(stock.id);
                                            const isDisabled = !isChecked && selectedStockIds.length >= remainingNeeded;

                                            return (
                                                <label 
                                                    key={stock.id} 
                                                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition duration-150 ${
                                                        isChecked ? 'bg-red-600/10 border-red-500 theme-text-main' : 
                                                        isDisabled ? 'opacity-40 theme-border-main cursor-not-allowed' :
                                                        'theme-bg-main border-slate-850 hover:theme-border-main theme-text-muted'
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <input 
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            disabled={isDisabled}
                                                            onChange={() => handleCheckboxChange(stock.id)}
                                                            className="rounded theme-border-main text-red-600 focus:ring-red-600 theme-bg-card"
                                                        />
                                                        <div className="space-y-0.5">
                                                            <span className="font-mono font-bold block text-sm">{stock.bag_number}</span>
                                                            <span className="text-[10px] theme-text-muted block">Expired: {new Date(stock.expires_at).toLocaleDateString('id-ID')} ({stock.quantity_ml}ml)</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-slate-850">
                                        <button 
                                            type="submit" 
                                            disabled={selectedStockIds.length === 0}
                                            className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 disabled:opacity-50 theme-text-main rounded-xl text-sm font-semibold shadow-lg shadow-red-600/15 transition-all duration-150"
                                        >
                                            Serahkan {selectedStockIds.length} Kantong Darah
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
            </DashboardLayout>
        </>
    );
}
