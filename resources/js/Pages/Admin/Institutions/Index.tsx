import React, { useState } from 'react';
import { Head, router, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '../../../Layouts/DashboardLayout';

interface InstitutionItem {
    id: string;
    name: string;
    type: string;
    code: string;
    email: string;
    status: string;
    created_at: string;
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
    institutions: PaginatedData<InstitutionItem>;
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function InstitutionsIndex({ institutions, filters, auth }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'hospital',
        code: '',
        license_number: '',
        phone: '',
        email: '',
        street_address: '',
        city: 'Bandung',
        province: 'Jawa Barat',
        postal_code: '40111',
        district: '',
        sub_district: '',
    });

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = {
            search,
            type: selectedType,
            status: selectedStatus,
            [key]: value
        };

        router.get('/admin/institutions', newFilters, {
            preserveState: true,
            replace: true
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange('search', search);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/institutions', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            }
        });
    };

    const handleUpdateStatus = (id: string, status: string) => {
        if (confirm(`Apakah Anda yakin ingin mengubah status institusi ini menjadi ${status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}?`)) {
            router.patch(`/admin/institutions/${id}/status`, { status });
        }
    };

    return (
        <>
            <Head title="Kelola Institusi - Master Data" />
            <DashboardLayout
                sidebarType="admin"
                title="Master Data Institusi"
                subtitle="Kelola data instansi Palang Merah Indonesia & Mitra Rumah Sakit"
                headerRight={(
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-600/15 transition-all duration-150 active:scale-95"
                    >
                        + Tambah Institusi
                    </button>
                )}
            >
                {/* Filter Panel */}
                <div className="theme-bg-card border theme-border-main p-5 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
                    <form onSubmit={handleSearchSubmit} className="col-span-1 md:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold theme-text-muted uppercase">Pencarian</label>
                        <div className="flex space-x-2">
                            <input 
                                type="text" 
                                placeholder="Cari nama institusi atau kode..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                            />
                            <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold transition duration-150 shadow-sm">
                                Cari
                            </button>
                        </div>
                    </form>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold theme-text-muted uppercase">Tipe Institusi</label>
                        <select 
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                handleFilterChange('type', e.target.value);
                            }}
                            className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                        >
                            <option value="">Semua Tipe</option>
                            <option value="pmi">PMI (Palang Merah Indonesia)</option>
                            <option value="hospital">Rumah Sakit</option>
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
                            <option value="approved">Disetujui</option>
                            <option value="pending">Menunggu Persetujuan</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                </div>

                {/* Institutions Table */}
                <div className="theme-bg-card border theme-border-main rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                    <th className="py-3 px-4">Nama Institusi</th>
                                    <th className="py-3 px-4">Tipe</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Bergabung Pada</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y theme-divide-main">
                                {institutions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500 font-semibold">
                                            Tidak ada institusi ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    institutions.data.map((inst) => (
                                        <tr key={inst.id} className="hover:bg-slate-500/5 transition duration-100">
                                            <td className="py-4 px-4">
                                                <div className="font-bold theme-text-main">{inst.name}</div>
                                                <div className="text-xs font-mono theme-text-muted">{inst.code}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex max-w-max text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    inst.type === 'pmi' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                    {inst.type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted">{inst.email}</td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex max-w-max text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    inst.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                                                    inst.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                    'bg-slate-800 theme-text-muted'
                                                }`}>
                                                    {inst.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted">
                                                {new Date(inst.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    {inst.status !== 'approved' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(inst.id, 'approved')}
                                                            className="px-2.5 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg text-xs font-bold transition duration-100"
                                                        >
                                                            Setujui
                                                        </button>
                                                    )}
                                                    {inst.status !== 'rejected' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(inst.id, 'rejected')}
                                                            className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-xs font-bold transition duration-100"
                                                        >
                                                            Tolak
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Links */}
                    {institutions.links && institutions.links.length > 3 && (
                        <div className="p-4 border-t theme-border-main flex items-center justify-center space-x-1 overflow-x-auto">
                            {institutions.links.map((link, i) => (
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

            {/* Modal Tambah Institusi */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-lg font-bold theme-text-main">Pendaftaran Institusi Baru</h3>
                            <button onClick={() => { setIsAddModalOpen(false); reset(); }} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <h4 className="text-xs font-bold text-red-500 uppercase">Informasi Institusi</h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Nama Institusi</label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: RS Immanuel"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Tipe</label>
                                    <select 
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="pmi">PMI (Palang Merah Indonesia)</option>
                                        <option value="hospital">Rumah Sakit</option>
                                    </select>
                                    {errors.type && <p className="text-xs text-red-500 font-semibold">{errors.type}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Kode Institusi</label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: RS-IMM"
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.code && <p className="text-xs text-red-500 font-semibold">{errors.code}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">No. Izin Operasional</label>
                                    <input 
                                        type="text" 
                                        placeholder="LIC-RS-xxxxx"
                                        value={data.license_number}
                                        onChange={(e) => setData('license_number', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.license_number && <p className="text-xs text-red-500 font-semibold">{errors.license_number}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Telepon</label>
                                    <input 
                                        type="text" 
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 font-semibold">{errors.phone}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Email Institusi</label>
                                    <input 
                                        type="email" 
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email}</p>}
                                </div>
                            </div>

                            <h4 className="text-xs font-bold text-red-500 uppercase border-t theme-border-main pt-4 mt-2">Alamat Institusi</h4>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Alamat Jalan</label>
                                <textarea 
                                    rows={2}
                                    value={data.street_address}
                                    onChange={(e) => setData('street_address', e.target.value)}
                                    required 
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50 resize-none"
                                />
                                {errors.street_address && <p className="text-xs text-red-500 font-semibold">{errors.street_address}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Kelurahan</label>
                                    <input 
                                        type="text" 
                                        value={data.sub_district}
                                        onChange={(e) => setData('sub_district', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.sub_district && <p className="text-xs text-red-500 font-semibold">{errors.sub_district}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Kecamatan</label>
                                    <input 
                                        type="text" 
                                        value={data.district}
                                        onChange={(e) => setData('district', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.district && <p className="text-xs text-red-500 font-semibold">{errors.district}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5 col-span-1">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Kode Pos</label>
                                    <input 
                                        type="text" 
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.postal_code && <p className="text-xs text-red-500 font-semibold">{errors.postal_code}</p>}
                                </div>
                                <div className="space-y-1.5 col-span-1">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Kota/Kabupaten</label>
                                    <input 
                                        type="text" 
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.city && <p className="text-xs text-red-500 font-semibold">{errors.city}</p>}
                                </div>
                                <div className="space-y-1.5 col-span-1">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Provinsi</label>
                                    <input 
                                        type="text" 
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.province && <p className="text-xs text-red-500 font-semibold">{errors.province}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsAddModalOpen(false); reset(); }}
                                    className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-sm font-semibold"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 theme-text-main rounded-xl text-sm font-semibold shadow-lg disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Institusi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
