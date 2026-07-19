import React from 'react';
import { Head } from '@inertiajs/react';

interface DonationDetail {
    id: string;
    blood_type: string;
    rhesus: string;
    component_type: string;
    volume_ml: number;
    donated_at: string;
    donor_name: string;
    donor_nik: string;
    pmi_name: string;
    pmi_city: string;
    pmi_phone: string;
}

interface Props {
    donation: DonationDetail;
}

export default function CertificatePrint({ donation }: Props) {
    const handlePrint = () => {
        window.print();
    };

    const verificationUrl = `${window.location.origin}/donations/${donation.id}/certificate`;
    const qrCodeApi = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verificationUrl)}`;

    return (
        <>
            <Head title={`Sertifikat Donasi - ${donation.donor_name}`} />
            
            {/* Styles Khusus untuk Cetak & Layout Premium */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body {
                        background-color: #ffffff !important;
                        color: #000000 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-area {
                        border: none !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                    }
                }
                @page {
                    size: A4 landscape;
                    margin: 0;
                }
            `}} />

            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 no-print:py-12 select-none">
                
                {/* Panel Cetak (Hanya muncul di layar browser) */}
                <div className="w-full max-w-4xl no-print flex justify-between items-center mb-6 bg-slate-900 border border-slate-800 px-6 py-4 rounded-2xl shadow-lg">
                    <div className="flex items-center space-x-3">
                        <span className="text-xl">🏆</span>
                        <div>
                            <h4 className="text-sm font-bold text-white">Sertifikat Donasi Siap Cetak</h4>
                            <p className="text-xs text-slate-400">Gunakan opsi "Save to PDF" atau sambungkan ke Printer Anda.</p>
                        </div>
                    </div>
                    <button 
                        onClick={handlePrint}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/15 transition-all duration-150 active:scale-95"
                    >
                        🖨️ Cetak / Simpan PDF
                    </button>
                </div>

                {/* AREA SERTIFIKAT (A4 Landscape Layout) */}
                <div className="print-area w-full max-w-4xl aspect-[1.414/1] bg-white text-slate-900 border-[16px] border-double border-red-800 p-8 sm:p-12 flex flex-col justify-between relative shadow-2xl overflow-hidden rounded-lg">
                    
                    {/* Watermark Ornamen Latar Belakang */}
                    <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                        <img src="/images/logo_icon.png" alt="Watermark" className="w-[45%] h-auto rotate-12" />
                    </div>

                    {/* Header Sertifikat */}
                    <div className="text-center space-y-2 relative z-10">
                        <div className="flex justify-center items-center space-x-3 mb-2">
                            <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-10 w-auto" />
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                Mari<span className="text-red-600">donor</span>
                            </span>
                        </div>
                        <h2 className="text-2xl font-extrabold tracking-widest text-red-850 uppercase font-serif">Sertifikat Penghargaan</h2>
                        <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-red-800 to-transparent mx-auto"></div>
                        <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Nomor Sertifikat: CERT/{donation.id.substring(0,8).toUpperCase()}</p>
                    </div>

                    {/* Body/Isi Penghargaan */}
                    <div className="text-center space-y-6 my-auto relative z-10">
                        <p className="text-sm italic text-slate-600 font-serif">Dengan tulus dan rasa hormat yang mendalam, kami berterima kasih kepada:</p>
                        
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-serif decoration-red-600 decoration-wavy">{donation.donor_name}</h1>
                            <p className="text-xs font-mono text-slate-500">NIK: {donation.donor_nik}</p>
                        </div>

                        <p className="text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto">
                            Atas partisipasi aktifnya sebagai **Pendonor Darah Kemanusiaan** yang dengan sukarela menyumbangkan darahnya demi keselamatan jiwa sesama manusia di unit pelayanan teknis PMI.
                        </p>
                    </div>

                    {/* Metadata Transaksi Donasi */}
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-4 gap-4 text-center text-xs relative z-10 mb-2">
                        <div className="space-y-1 border-r border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Golongan Darah</span>
                            <span className="text-slate-800 font-extrabold text-sm">{donation.blood_type} ({donation.rhesus === 'positive' ? 'Positif' : 'Negatif'})</span>
                        </div>
                        <div className="space-y-1 border-r border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Komponen</span>
                            <span className="text-slate-800 font-bold capitalize">{donation.component_type.replace('_', ' ')}</span>
                        </div>
                        <div className="space-y-1 border-r border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Volume Kantong</span>
                            <span className="text-slate-800 font-bold">{donation.volume_ml} ml</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Donasi</span>
                            <span className="text-slate-800 font-bold">{new Date(donation.donated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Footer Penandatanganan & Barcode */}
                    <div className="flex justify-between items-end relative z-10 mt-4">
                        {/* QR Code Keaslian */}
                        <div className="flex items-center space-x-3 text-left">
                            <img src={qrCodeApi} alt="QR Code Verifikasi" className="h-20 w-20 border border-slate-200 p-1 bg-white rounded-lg" />
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Keaslian Dokumen</span>
                                <span className="text-[8px] text-slate-400 max-w-[150px] leading-tight block">Scan QR Code ini untuk melakukan verifikasi status sertifikat donasi secara online.</span>
                            </div>
                        </div>

                        {/* Stempel & Tanda Tangan */}
                        <div className="text-center space-y-1 min-w-[200px] relative">
                            <span className="text-xs text-slate-600 block">{donation.pmi_city}, {new Date(donation.donated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="text-xs font-bold text-slate-850 block">{donation.pmi_name}</span>
                            
                            {/* Visualisasi Tanda Tangan Digital PMI */}
                            <div className="h-16 flex items-center justify-center relative">
                                <div className="absolute text-red-600/35 border-2 border-dashed border-red-600/35 rounded-full px-3 py-1 text-[10px] font-bold uppercase rotate-12 select-none pointer-events-none">
                                    ✓ PMI VALIDATED
                                </div>
                                <span className="text-slate-300 italic font-serif text-sm">Digital Signature</span>
                            </div>

                            <div className="h-[1px] w-full bg-slate-300 mx-auto"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase block">Kepala UDD PMI Penyelenggara</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
