import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '../../../Layouts/DashboardLayout';

interface ArticleItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    status: string;
    view_count: number;
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
    articles: PaginatedData<ArticleItem>;
    auth: {
        user: {
            name: string;
            role: string;
        };
    };
}

export default function ArticlesIndex({ articles, auth }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'Kesehatan',
        status: 'draft',
    });

    const openCreateModal = () => {
        setForm({
            title: '',
            excerpt: '',
            content: '',
            category: 'Kesehatan',
            status: 'draft',
        });
        setEditMode(false);
        setIsModalOpen(true);
    };

    const openEditModal = (article: ArticleItem) => {
        setForm({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            status: article.status,
        });
        setSelectedId(article.id);
        setEditMode(true);
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode && selectedId) {
            router.put(route('admin.articles.update', selectedId), form, {
                onSuccess: () => setIsModalOpen(false),
            });
        } else {
            router.post(route('admin.articles.store'), form, {
                onSuccess: () => setIsModalOpen(false),
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus artikel ini?')) {
            router.delete(route('admin.articles.destroy', id));
        }
    };

    return (
        <>
            <Head title="Manajemen Artikel Edukasi - Maridonor" />
            <DashboardLayout
                sidebarType="admin"
                title="Artikel Edukasi Kesehatan"
                subtitle="Tulis, Kelola, dan Publikasikan Artikel Donor Darah untuk Pendonor di Aplikasi Mobile"
                headerRight={(
                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white rounded-xl text-sm font-semibold shadow-lg transition duration-150 active:scale-95"
                    >
                        + Tulis Artikel Baru
                    </button>
                )}
            >
                {/* Articles Table */}
                <div className="theme-bg-card border theme-border-main rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b theme-border-main text-xs font-bold theme-text-muted">
                                    <th className="py-3 px-4">Judul Artikel</th>
                                    <th className="py-3 px-4">Kategori</th>
                                    <th className="py-3 px-4">Ringkasan</th>
                                    <th className="py-3 px-4 text-center">Dibaca</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y theme-divide-main">
                                {articles.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold">
                                            Belum ada artikel edukasi terdaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    articles.data.map((art) => (
                                        <tr key={art.id} className="hover:slate-500/5 transition duration-100">
                                            <td className="py-4 px-4 font-semibold theme-text-main max-w-[250px] truncate">
                                                {art.title}
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted font-medium">
                                                {art.category}
                                            </td>
                                            <td className="py-4 px-4 theme-text-muted max-w-[300px] truncate">
                                                {art.excerpt}
                                            </td>
                                            <td className="py-4 px-4 text-center font-bold theme-text-muted">
                                                {art.view_count}x
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                                    art.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 theme-text-muted'
                                                }`}>
                                                    {art.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center space-x-2">
                                                <button
                                                    onClick={() => openEditModal(art)}
                                                    className="px-2.5 py-1 bg-purple-650/10 hover:bg-purple-650/20 text-purple-400 rounded-lg text-xs font-bold border border-purple-500/10 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(art.id)}
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
                    {articles.links && articles.links.length > 3 && (
                        <div className="p-4 border-t theme-border-main flex items-center justify-center space-x-1 overflow-x-auto">
                            {articles.links.map((link, i) => (
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

            {/* Modal Tambah/Edit Artikel */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <h3 className="text-lg font-bold theme-text-main">{editMode ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Judul Artikel</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="contoh: Manfaat Donor Darah Bagi Jantung"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold theme-text-muted uppercase">Kategori</label>
                                    <select 
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    >
                                        <option value="Kesehatan">Kesehatan & Medis</option>
                                        <option value="Gaya Hidup">Gaya Hidup & Nutrisi</option>
                                        <option value="Informasi">Informasi & Panduan</option>
                                        <option value="Event">Event & Sosialisasi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Kutipan / Ringkasan Singkat (Excerpt)</label>
                                <textarea 
                                    required
                                    placeholder="Tulis ringkasan 2-3 kalimat mengenai artikel ini..."
                                    value={form.excerpt}
                                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Isi / Konten Artikel</label>
                                <textarea 
                                    required
                                    placeholder="Tulis isi lengkap artikel edukasi..."
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                    rows={10}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold theme-text-muted uppercase">Status Publikasi</label>
                                <select 
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                >
                                    <option value="draft">Simpan Sebagai Draft (Draft)</option>
                                    <option value="published">Langsung Publikasikan (Published)</option>
                                </select>
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
                                    className="px-4 py-2 bg-gradient-to-r from-red-650 to-rose-650 hover:from-red-600 hover:to-rose-600 theme-text-main rounded-xl text-sm font-semibold shadow-lg"
                                >
                                    {editMode ? 'Simpan Perubahan' : 'Publikasikan Artikel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
