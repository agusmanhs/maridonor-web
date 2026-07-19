import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '../../../Layouts/DashboardLayout';

interface AnnouncementItem {
    id: string;
    title: string;
    content: string;
    type: string;
    target_audience: string;
    is_pinned: boolean;
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
    announcements: PaginatedData<AnnouncementItem>;
    auth: {
        user: {
            name: string;
            role: string;
        };
    };
}

export default function AnnouncementsIndex({ announcements, auth }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        content: '',
        type: 'info',
        target_audience: 'all',
        is_pinned: false,
    });

    const openCreateModal = () => {
        setForm({
            title: '',
            content: '',
            type: 'info',
            target_audience: 'all',
            is_pinned: false,
        });
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (ann: AnnouncementItem) => {
        setForm({
            title: ann.title,
            content: ann.content,
            type: ann.type,
            target_audience: ann.target_audience,
            is_pinned: ann.is_pinned,
        });
        setSelectedId(ann.id);
        setEditMode(true);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode && selectedId) {
            router.put(route('admin.announcements.update', selectedId), form, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            router.post(route('admin.announcements.store'), form, {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
            router.delete(route('admin.announcements.destroy', id));
        }
    };

    return (
        <>
            <Head title="Manajemen Pengumuman - Maridonor" />
            <DashboardLayout
                sidebarType="admin"
                title="Pengumuman & Pemberitahuan"
                subtitle="Siarkan Berita Penting, Event Donor Darah, atau Info Siaga ke Pengguna"
                headerRight={(
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white rounded-xl text-sm font-semibold shadow-lg transition duration-150 active:scale-95"
                    >
                        + Buat Pengumuman Baru
                    </button>
                )}
            >
                {/* Announcements Table */}
                <div className="theme-bg-card border theme-border-main rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                    <th className="py-3 px-4">Judul Pengumuman</th>
                                    <th className="py-3 px-4">Tipe</th>
                                    <th className="py-3 px-4">Target Audiens</th>
                                    <th className="py-3 px-4 text-center">Pin</th>
                                    <th className="py-3 px-4">Tanggal Rilis</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y theme-divide-main">
                                {announcements.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold">
                                            Belum ada pengumuman disiarkan.
                                        </td>
                                    </tr>
                                ) : (
                                    announcements.data.map((ann) => (
                                        <tr key={ann.id} className="hover:slate-500/5 transition duration-100">
                                            <td className="py-4 px-4 font-semibold theme-text-main max-w-[300px] truncate">
                                                {ann.title}
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    ann.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                                                    ann.type === 'event' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-green-500/10 text-green-500'
                                                }`}>
                                                    {ann.type}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted font-medium capitalize">
                                                {ann.target_audience}
                                            </td>
                                            <td className="py-4 px-4 text-center font-bold">
                                                {ann.is_pinned ? '📌' : '-'}
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted font-mono text-xs">
                                                {new Date(ann.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </td>
                                            <td className="py-4 px-4 text-center space-x-2">
                                                <button
                                                    onClick={() => openEditModal(ann)}
                                                    className="px-2.5 py-1 bg-purple-650/10 hover:bg-purple-650/20 text-purple-400 rounded-lg text-xs font-bold border border-purple-500/10 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ann.id)}
                                                    className="px-2.5 py-1 bg-red-650/10 hover:bg-red-650/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/10 transition"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {announcements.links && announcements.links.length > 3 && (
                        <div className="p-4 border-t theme-border-main flex items-center justify-center space-x-1 overflow-x-auto">
                            {announcements.links.map((link, i) => (
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

            {/* Modal Tambah/Edit Pengumuman */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-lg font-bold theme-text-main">{editMode ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Judul Pengumuman</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="contoh: Event Donor Darah Ramadhan PMI"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Tipe</label>
                                    <select 
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="info">Informasi (Info)</option>
                                        <option value="event">Kegiatan / Event</option>
                                        <option value="warning">Peringatan (Warning)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Target Penerima</label>
                                    <select 
                                        value={form.target_audience}
                                        onChange={(e) => setForm({ ...form, target_audience: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="all">Semua Pengguna</option>
                                        <option value="donor">Hanya Pendonor</option>
                                        <option value="staff">Hanya Staf PMI/RS</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Isi Pesan Pengumuman</label>
                                <textarea 
                                    required
                                    placeholder="Tuliskan pesan detail pengumuman yang akan disiarkan..."
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    rows={5}
                                />
                            </div>

                            <div className="space-y-1.5 flex items-center justify-between p-4 rounded-xl bg-slate-500/5 border theme-border-main">
                                <div className="space-y-0.5 text-left">
                                    <span className="text-xs font-bold theme-text-main block">Sematkan Pengumuman</span>
                                    <span className="text-[10px] theme-text-muted">Tampilkan di bagian teratas daftar pengumuman mobile</span>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={form.is_pinned}
                                    onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                                    className="h-5 w-5 rounded-lg border theme-border-main bg-transparent text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-sm font-semibold"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-gradient-to-r from-red-655 to-rose-655 hover:from-red-600 hover:to-rose-600 theme-text-main rounded-xl text-sm font-semibold shadow-lg"
                                >
                                    {editMode ? 'Simpan Perubahan' : 'Siarkan Pengumuman'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
