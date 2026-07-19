import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '../../../Layouts/DashboardLayout';

interface KycDocumentItem {
    id: string;
    user_id: string;
    type: string;
    file_url: string;
    status: string;
    rejection_reason: string | null;
    created_at: string;
    user?: {
        name: string;
        email: string;
        donor_profile?: {
            gender: string;
            birth_date: string;
        };
    };
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
    kycDocuments: PaginatedData<KycDocumentItem>;
    filters: {
        status: string;
    };
    auth: {
        user: {
            name: string;
            role: string;
        };
    };
}

export default function KycIndex({ kycDocuments, filters, auth }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'pending');
    
    // Modal states
    const [selectedDoc, setSelectedDoc] = useState<KycDocumentItem | null>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleFilterChange = (status: string) => {
        setStatusFilter(status);
        router.get(route('admin.kyc.index'), { status }, { preserveState: true });
    };

    const handleApprove = (id: string) => {
        if (confirm('Apakah Anda yakin menyetujui dokumen identitas (KYC) pendonor ini?')) {
            router.patch(route('admin.kyc.update_status', id), {
                status: 'approved'
            }, {
                onSuccess: () => {
                    setIsReviewModalOpen(false);
                    setSelectedDoc(null);
                }
            });
        }
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDoc || !rejectionReason.trim()) return;

        router.patch(route('admin.kyc.update_status', selectedDoc.id), {
            status: 'rejected',
            rejection_reason: rejectionReason
        }, {
            onSuccess: () => {
                setIsRejectionModalOpen(false);
                setIsReviewModalOpen(false);
                setSelectedDoc(null);
                setRejectionReason('');
            }
        });
    };

    return (
        <>
            <Head title="Verifikasi KYC Pendonor - Maridonor" />
            <DashboardLayout
                sidebarType="admin"
                title="Persetujuan Identitas Pendonor (KYC)"
                subtitle="Verifikasi NIK, KTP & Swafoto Pendonor untuk Kelayakan Level 1"
            >
                {/* Status Tabs */}
                <div className="flex border-b border-slate-800">
                    <button 
                        onClick={() => handleFilterChange('pending')}
                        className={`py-2.5 px-6 font-bold text-sm border-b-2 transition duration-150 ${
                            statusFilter === 'pending' ? 'border-red-500 text-red-500' : 'border-transparent theme-text-muted hover:theme-text-main'
                        }`}
                    >
                        🚨 Menunggu Tinjauan ({statusFilter === 'pending' ? kycDocuments.total : 0})
                    </button>
                    <button 
                        onClick={() => handleFilterChange('approved')}
                        className={`py-2.5 px-6 font-bold text-sm border-b-2 transition duration-150 ${
                            statusFilter === 'approved' ? 'border-red-500 text-red-500' : 'border-transparent theme-text-muted hover:theme-text-main'
                        }`}
                    >
                        ✅ Disetujui
                    </button>
                    <button 
                        onClick={() => handleFilterChange('rejected')}
                        className={`py-2.5 px-6 font-bold text-sm border-b-2 transition duration-150 ${
                            statusFilter === 'rejected' ? 'border-red-500 text-red-500' : 'border-transparent theme-text-muted hover:theme-text-main'
                        }`}
                    >
                        ❌ Ditolak
                    </button>
                </div>

                {/* Table Content */}
                <div className="theme-bg-card border theme-border-main rounded-2xl overflow-hidden mt-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                    <th className="py-3 px-4">Nama Pendonor</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Tipe Dokumen</th>
                                    <th className="py-3 px-4">Tanggal Pengajuan</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y theme-divide-main">
                                {kycDocuments.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold">
                                            Tidak ada data pengajuan KYC ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    kycDocuments.data.map((doc) => (
                                        <tr key={doc.id} className="hover:slate-500/5 transition duration-100">
                                            <td className="py-4 px-4 font-semibold theme-text-main">
                                                {doc.user?.name || '-'}
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted font-mono text-xs">
                                                {doc.user?.email || '-'}
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted font-semibold capitalize">
                                                {doc.type.replace('_', ' ')}
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted font-mono text-xs">
                                                {new Date(doc.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    doc.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 animate-pulse' :
                                                    doc.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                    'bg-red-500/10 text-red-500'
                                                }`}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedDoc(doc);
                                                        setIsReviewModalOpen(true);
                                                    }}
                                                    className="px-3.5 py-1.5 bg-red-650/10 hover:bg-red-650/20 text-red-500 rounded-xl text-xs font-bold border border-red-500/10 transition duration-150 active:scale-95"
                                                >
                                                    Tinjau Berkas
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {kycDocuments.links && kycDocuments.links.length > 3 && (
                        <div className="p-4 border-t theme-border-main flex items-center justify-center space-x-1 overflow-x-auto">
                            {kycDocuments.links.map((link, i) => (
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
            </DashboardLayout>

            {/* Modal Review Dokumen */}
            {isReviewModalOpen && selectedDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold theme-text-main">Tinjau Dokumen Identitas</h3>
                                <p className="text-xs theme-text-muted">Nama: {selectedDoc.user?.name || '-'} | Email: {selectedDoc.user?.email || '-'}</p>
                            </div>
                            <button onClick={() => { setIsReviewModalOpen(false); setSelectedDoc(null); }} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            {/* File Viewer */}
                            <div className="space-y-2">
                                <span className="text-xs font-bold theme-text-muted uppercase">Foto Berkas Terunggah ({selectedDoc.type.replace('_', ' ')})</span>
                                <div className="border theme-border-main rounded-2xl overflow-hidden bg-black/20 flex justify-center items-center min-h-[300px] relative">
                                    <img 
                                        src={selectedDoc.file_url} 
                                        alt={`Dokumen ${selectedDoc.type}`} 
                                        className="max-h-[400px] w-auto object-contain rounded-xl shadow-lg"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/27272a/ef4444?text=Berkas+Gambar+KTP';
                                        }}
                                    />
                                </div>
                            </div>

                            {selectedDoc.status === 'rejected' && (
                                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-1">
                                    <span className="text-xs font-bold text-red-400 block uppercase">Alasan Penolakan Sebelumnya:</span>
                                    <p className="text-xs theme-text-main font-medium">{selectedDoc.rejection_reason}</p>
                                </div>
                            )}
                        </div>

                        {selectedDoc.status === 'pending' && (
                            <div className="p-6 border-t theme-border-main flex justify-between items-center bg-slate-500/5">
                                <button
                                    onClick={() => setIsRejectionModalOpen(true)}
                                    className="px-4 py-2 bg-red-650/10 hover:bg-red-650/20 text-red-500 rounded-xl text-sm font-semibold border border-red-500/10 transition duration-150"
                                >
                                    Tolak Dokumen
                                </button>
                                <div className="flex space-x-3">
                                    <button 
                                        type="button" 
                                        onClick={() => { setIsReviewModalOpen(false); setSelectedDoc(null); }}
                                        className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-sm font-semibold"
                                    >
                                        Kembali
                                    </button>
                                    <button 
                                        onClick={() => handleApprove(selectedDoc.id)}
                                        className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-550 hover:to-emerald-550 text-white rounded-xl text-sm font-bold shadow-lg"
                                    >
                                        Setujui & Verifikasi
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Input Alasan Penolakan */}
            {isRejectionModalOpen && selectedDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-md font-bold text-red-500">Tolak Verifikasi KYC</h3>
                            <button onClick={() => setIsRejectionModalOpen(false)} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-red-400 uppercase">Alasan Penolakan Dokumen</label>
                                <textarea 
                                    required
                                    placeholder="Tulis alasan penolakan secara rinci agar pendonor dapat mengoreksi foto/berkas mereka..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500"
                                    rows={4}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                <button 
                                    type="button" 
                                    onClick={() => setIsRejectionModalOpen(false)}
                                    className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-sm font-semibold"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold"
                                >
                                    Tolak Sekarang
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
