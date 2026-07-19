import React, { useState } from 'react';
import { Head, router, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '../../../Layouts/DashboardLayout';

interface UserItem {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
    created_at: string;
}

interface InstitutionItem {
    id: string;
    name: string;
    type: string;
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
    users: PaginatedData<UserItem>;
    institutions: InstitutionItem[];
    filters: {
        search?: string;
        role?: string;
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

export default function UsersIndex({ users, institutions, filters, auth }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'donor',
        institution_id: '',
        gender: 'male',
        birth_date: '',
        blood_type: 'O',
        rhesus: 'positive',
    });

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = {
            search,
            role: selectedRole,
            status: selectedStatus,
            [key]: value
        };

        router.get('/admin/users', newFilters, {
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
        post('/admin/users', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            }
        });
    };

    return (
        <>
            <Head title="Kelola Pengguna - Master Data" />
            <DashboardLayout
                sidebarType="admin"
                title="Master Data Pengguna"
                subtitle="Lihat dan kelola seluruh pengguna terdaftar di sistem"
                headerRight={(
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-600/15 transition-all duration-150 active:scale-95"
                    >
                        + Tambah Pengguna
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
                                placeholder="Cari nama atau email..."
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
                        <label className="text-xs font-bold theme-text-muted uppercase">Peran (Role)</label>
                        <select 
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                                handleFilterChange('role', e.target.value);
                            }}
                            className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                        >
                            <option value="">Semua Peran</option>
                            <option value="donor">Pendonor</option>
                            <option value="pmi_staff">PMI Staff</option>
                            <option value="rs_staff">RS Staff</option>
                            <option value="super_admin">Super Admin</option>
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
                            <option value="active">Aktif</option>
                            <option value="inactive">Tidak Aktif</option>
                            <option value="banned">Diblokir</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="theme-bg-card border theme-border-main rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                    <th className="py-3 px-4">Nama & Email</th>
                                    <th className="py-3 px-4">Telepon</th>
                                    <th className="py-3 px-4">Peran</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Terdaftar Pada</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y theme-divide-main">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500 font-semibold">
                                            Tidak ada pengguna ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-500/5 transition duration-100">
                                            <td className="py-4 px-4">
                                                <div className="font-bold theme-text-main">{user.name}</div>
                                                <div className="text-xs theme-text-muted">{user.email}</div>
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted">{user.phone}</td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex max-w-max text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    user.role === 'super_admin' ? 'bg-purple-500/10 text-purple-500' :
                                                    user.role === 'donor' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex max-w-max text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    user.status === 'active' ? 'bg-green-500/10 text-green-500' :
                                                    'bg-slate-800 theme-text-muted'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted">
                                                {new Date(user.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Links */}
                    {users.links && users.links.length > 3 && (
                        <div className="p-4 border-t theme-border-main flex items-center justify-center space-x-1 overflow-x-auto">
                            {users.links.map((link, i) => (
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

            {/* Modal Tambah Pengguna */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-lg font-bold theme-text-main">Tambah Pengguna Baru</h3>
                            <button onClick={() => { setIsAddModalOpen(false); reset(); }} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Email</label>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Nomor HP</label>
                                    <input 
                                        type="text" 
                                        placeholder="08xxxxxxxx"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 font-semibold">{errors.phone}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Password</label>
                                    <input 
                                        type="password" 
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required 
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                    />
                                    {errors.password && <p className="text-xs text-red-500 font-semibold">{errors.password}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Peran (Role)</label>
                                <select 
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                >
                                    <option value="donor">Pendonor</option>
                                    <option value="pmi_staff">PMI Staff</option>
                                    <option value="pmi_admin">PMI Admin</option>
                                    <option value="rs_staff">RS Staff</option>
                                    <option value="rs_admin">RS Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                                {errors.role && <p className="text-xs text-red-500 font-semibold">{errors.role}</p>}
                            </div>

                            {/* Dropdown institusi jika peran adalah staf/admin PMI/RS */}
                            {['pmi_staff', 'pmi_admin', 'rs_staff', 'rs_admin'].includes(data.role) && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Tautkan ke Institusi</label>
                                    <select 
                                        value={data.institution_id}
                                        onChange={(e) => setData('institution_id', e.target.value)}
                                        required
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="">Pilih Institusi...</option>
                                        {institutions
                                            .filter(inst => {
                                                if (data.role.startsWith('pmi')) return inst.type === 'pmi';
                                                if (data.role.startsWith('rs')) return inst.type === 'hospital';
                                                return true;
                                            })
                                            .map(inst => (
                                                <option key={inst.id} value={inst.id}>
                                                    {inst.name} ({inst.type.toUpperCase()})
                                                </option>
                                            ))
                                        }
                                    </select>
                                    {errors.institution_id && <p className="text-xs text-red-500 font-semibold">{errors.institution_id}</p>}
                                </div>
                            )}

                            {/* Kolom pendonor jika perannya donor */}
                            {data.role === 'donor' && (
                                <div className="space-y-4 border-t theme-border-main pt-4 mt-2">
                                    <h4 className="text-xs font-bold text-red-500 uppercase">Informasi Medis & Profil Pendonor</h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold theme-text-muted uppercase">Jenis Kelamin</label>
                                            <select 
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                                className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                            >
                                                <option value="male">Laki-laki</option>
                                                <option value="female">Perempuan</option>
                                            </select>
                                            {errors.gender && <p className="text-xs text-red-500 font-semibold">{errors.gender}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold theme-text-muted uppercase">Tanggal Lahir</label>
                                            <input 
                                                type="date" 
                                                value={data.birth_date}
                                                onChange={(e) => setData('birth_date', e.target.value)}
                                                required
                                                className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none focus:border-red-500/50"
                                            />
                                            {errors.birth_date && <p className="text-xs text-red-500 font-semibold">{errors.birth_date}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold theme-text-muted uppercase">Golongan Darah</label>
                                            <select 
                                                value={data.blood_type}
                                                onChange={(e) => setData('blood_type', e.target.value)}
                                                className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                            >
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="AB">AB</option>
                                                <option value="O">O</option>
                                            </select>
                                            {errors.blood_type && <p className="text-xs text-red-500 font-semibold">{errors.blood_type}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold theme-text-muted uppercase">Rhesus</label>
                                            <select 
                                                value={data.rhesus}
                                                onChange={(e) => setData('rhesus', e.target.value)}
                                                className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                            >
                                                <option value="positive">Positif (+)</option>
                                                <option value="negative">Negatif (-)</option>
                                            </select>
                                            {errors.rhesus && <p className="text-xs text-red-500 font-semibold">{errors.rhesus}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                    {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
