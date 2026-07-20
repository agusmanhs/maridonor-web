import React, { ReactNode, useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ThemeSwitcher from '../Components/ThemeSwitcher';

interface DashboardLayoutProps {
    children: ReactNode;
    sidebarType: 'pmi' | 'hospital' | 'donor' | 'admin';
    title?: string;
    subtitle?: string;
    headerRight?: ReactNode;
}

export default function DashboardLayout({ children, sidebarType, title, subtitle, headerRight }: DashboardLayoutProps) {
    const { auth } = usePage<any>().props;

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

    const [profileForm, setProfileForm] = useState({
        name: '',
        phone: '',
        gender: 'male',
        birth_date: '',
        blood_type: 'O',
        rhesus: 'positive',
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (auth?.user) {
            setProfileForm({
                name: auth.user.name || '',
                phone: auth.user.phone || '',
                gender: auth.user.donor_profile?.gender || 'male',
                birth_date: auth.user.donor_profile?.birth_date || '',
                blood_type: auth.user.donor_profile?.blood_type || 'O',
                rhesus: auth.user.donor_profile?.rhesus || 'positive',
            });
        }
    }, [auth?.user, isSettingsModalOpen]);

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch('/profile', profileForm, {
            onSuccess: () => {
                alert('Profil berhasil diperbarui.');
                setIsSettingsModalOpen(false);
            },
            onError: (err) => {
                alert(Object.values(err).join('\n'));
            }
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch('/profile/password', passwordForm, {
            onSuccess: () => {
                alert('Kata sandi berhasil diperbarui.');
                setIsSettingsModalOpen(false);
                setPasswordForm({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            },
            onError: (err) => {
                alert(Object.values(err).join('\n'));
            }
        });
    };

    const [adminContext, setAdminContext] = useState<'pmi' | 'hospital' | 'donor'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('maridonor_admin_context');
            if (saved === 'pmi' || saved === 'hospital' || saved === 'donor') return saved;
        }
        return 'pmi';
    });

    useEffect(() => {
        if (sidebarType === 'pmi' || sidebarType === 'hospital' || sidebarType === 'donor') {
            setAdminContext(sidebarType);
            localStorage.setItem('maridonor_admin_context', sidebarType);
        }
    }, [sidebarType]);

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const isPmi = sidebarType === 'pmi';
    const isHospital = sidebarType === 'hospital';
    const isDonor = sidebarType === 'donor';
    const isSuperAdmin = sidebarType === 'admin';

    // Determine what to show in Menu Utama for super_admin
    const showPmiMenu = isPmi || (auth?.user?.role === 'super_admin' && isSuperAdmin && adminContext === 'pmi');
    const showHospitalMenu = isHospital || (auth?.user?.role === 'super_admin' && isSuperAdmin && adminContext === 'hospital');
    const showDonorMenu = isDonor || (auth?.user?.role === 'super_admin' && isSuperAdmin && adminContext === 'donor');

    // Highlight helper
    const isActive = (path: string, typeParam?: string) => {
        if (typeof window === 'undefined') return "theme-text-muted hover:theme-text-main hover:bg-slate-500/10 border border-transparent";
        const urlParams = new URLSearchParams(window.location.search);
        const currentType = urlParams.get('type');
        
        const pathMatches = window.location.pathname.startsWith(path);
        const typeMatches = !typeParam || currentType === typeParam;

        return (pathMatches && typeMatches)
            ? "bg-red-600/10 text-red-500 border border-red-500/10" 
            : "theme-text-muted hover:theme-text-main hover:bg-slate-500/10 border border-transparent";
    };

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden theme-bg-main theme-text-main flex flex-col lg:flex-row antialiased relative overflow-hidden transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
            
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-red-600/5 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-rose-600/5 blur-3xl pointer-events-none"></div>

            {/* Sidebar Menu */}
            <aside className="w-full lg:w-64 lg:h-screen lg:sticky lg:top-0 theme-bg-sidebar border-b lg:border-b-0 lg:border-r theme-border-main backdrop-blur-xl flex flex-col relative z-20 transition-colors duration-300">
                <div className="p-6 border-b theme-border-main flex items-center space-x-3.5">
                    <div className="p-2 bg-gradient-to-br from-red-500/10 to-rose-600/10 rounded-xl border border-red-500/20">
                        <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-7 w-auto" />
                    </div>
                    <span className="text-2xl font-black tracking-tight theme-text-main">
                        Mari<span className="text-red-600">donor</span>
                    </span>
                </div>

                <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    <span className="px-3 text-[10px] font-bold theme-text-muted uppercase tracking-wider block mb-2">
                        {showDonorMenu && !showPmiMenu && !showHospitalMenu ? 'Portal Pendonor' : 'Menu Utama'}
                    </span>
                    
                    {showPmiMenu && (
                        <>
                            <Link href="/dashboard/pmi" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/dashboard/pmi')}`}>
                                <span>📊</span>
                                <span>Ikhtisar Dashboard</span>
                            </Link>
                            <Link href="/blood-stocks?type=pmi" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/blood-stocks', 'pmi')}`}>
                                <span>🩸</span>
                                <span>Kelola Stok Darah</span>
                            </Link>
                            <Link href="/blood-requests?type=pmi" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/blood-requests', 'pmi')}`}>
                                <span>🚨</span>
                                <span>Permohonan Darah</span>
                            </Link>
                            <Link href="/schedules" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/schedules')}`}>
                                <span>📅</span>
                                <span>Slot Jadwal Donor</span>
                            </Link>
                        </>
                    )}

                    {showHospitalMenu && (
                        <>
                            <Link href="/dashboard/hospital" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/dashboard/hospital')}`}>
                                <span>📊</span>
                                <span>Ikhtisar Dashboard</span>
                            </Link>
                            <Link href="/blood-requests?type=hospital" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/blood-requests', 'hospital')}`}>
                                <span>🚨</span>
                                <span>Ajukan Permohonan</span>
                            </Link>
                            <Link href="/blood-stocks?type=hospital" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/blood-stocks', 'hospital')}`}>
                                <span>🩺</span>
                                <span>Stok Bank Darah RS</span>
                            </Link>
                        </>
                    )}

                    {showDonorMenu && (
                        <>
                            <Link href="/dashboard/donor" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/dashboard/donor')}`}>
                                <span>📊</span>
                                <span>Dashboard Anda</span>
                            </Link>
                        </>
                    )}

                    {/* Master Data Menu for Super Admin */}
                    {auth?.user?.role === 'super_admin' && (
                        <div className="pt-4 border-t theme-border-main mt-4 space-y-1.5">
                            <span className="px-3 text-[10px] font-bold text-red-500 uppercase tracking-wider block mb-2">
                                ⚙️ Master Data
                            </span>
                            <Link href="/admin/users" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/admin/users')}`}>
                                <span>👥</span>
                                <span>Data Pengguna</span>
                            </Link>
                            <Link href="/admin/institutions" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/admin/institutions')}`}>
                                <span>🏥</span>
                                <span>Data Institusi</span>
                            </Link>
                            <Link href="/admin/kyc" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/admin/kyc')}`}>
                                <span>🛡️</span>
                                <span>Verifikasi KYC</span>
                            </Link>
                            <Link href="/admin/articles" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/admin/articles')}`}>
                                <span>📚</span>
                                <span>Artikel & Edukasi</span>
                            </Link>
                            <Link href="/admin/announcements" className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${isActive('/admin/announcements')}`}>
                                <span>📢</span>
                                <span>Pengumuman & Event</span>
                            </Link>
                        </div>
                    )}

                    {/* Quick Access Dashboards for Super Admin */}
                    {auth?.user?.role === 'super_admin' && (
                        <div className="pt-4 border-t theme-border-main mt-4 space-y-1.5">
                            <span className="px-3 text-[10px] font-bold text-purple-500 uppercase tracking-wider block mb-2">
                                🛡️ Akses Cepat Dasbor
                            </span>
                            <Link href="/dashboard/pmi" className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 ${isActive('/dashboard/pmi')}`}>
                                <span>🏢</span>
                                <span>Dasbor UDD PMI</span>
                            </Link>
                            <Link href="/dashboard/hospital" className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 ${isActive('/dashboard/hospital')}`}>
                                <span>🏥</span>
                                <span>Dasbor Rumah Sakit</span>
                            </Link>
                            <Link href="/dashboard/donor" className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 ${isActive('/dashboard/donor')}`}>
                                <span>🩸</span>
                                <span>Dasbor Pendonor</span>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t theme-border-main space-y-2">
                    <button 
                        type="button"
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="w-full py-2.5 text-xs font-semibold theme-text-muted hover:theme-text-main hover:bg-slate-500/10 rounded-xl border theme-border-main transition duration-150 flex items-center justify-center space-x-2"
                    >
                        <span>⚙️</span>
                        <span>Pengaturan Akun</span>
                    </button>
                    <form onSubmit={handleLogout}>
                        <button type="submit" className="w-full py-2.5 text-xs font-semibold theme-text-muted hover:theme-text-main hover:bg-slate-500/10 rounded-xl border theme-border-main transition duration-150 flex items-center justify-center space-x-2">
                            <span>🚪</span>
                            <span>Keluar Akun</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto relative z-10">
                
                {/* Header Dinamis */}
                {(title || headerRight) && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b theme-border-main">
                        <div>
                            {title && <h1 className="text-2xl lg:text-3xl font-black theme-text-main tracking-tight">{title}</h1>}
                            {subtitle && <p className="text-sm theme-text-muted mt-1">{subtitle}</p>}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {headerRight}
                            {auth?.user && (
                                <div className="hidden sm:flex items-center space-x-3.5 theme-bg-card border theme-border-card px-4 py-2.5 rounded-2xl backdrop-blur-lg">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-xs font-bold theme-text-muted">Aktif: {auth.user.name}</span>
                                </div>
                            )}
                            <ThemeSwitcher />
                        </div>
                    </div>
                )}

                {/* Slot Konten Halaman */}
                {children}

            </main>

            {/* Modal Pengaturan Akun */}
            {isSettingsModalOpen && auth?.user && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center theme-bg-main/80 backdrop-blur-sm p-4">
                    <div className="theme-bg-card border theme-border-main w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b theme-border-main flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold theme-text-main">Pengaturan Akun & Profil</h3>
                                <p className="text-xs theme-text-muted">Kelola informasi pribadi dan keamanan kata sandi Anda</p>
                            </div>
                            <button onClick={() => setIsSettingsModalOpen(false)} className="theme-text-muted hover:theme-text-main text-lg font-bold">&times;</button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b theme-border-main bg-slate-500/5">
                            <button 
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${
                                    activeTab === 'profile' ? 'border-red-600 text-red-550' : 'border-transparent theme-text-muted hover:theme-text-main'
                                }`}
                            >
                                👤 Informasi Profil
                            </button>
                            <button 
                                onClick={() => setActiveTab('password')}
                                className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${
                                    activeTab === 'password' ? 'border-red-600 text-red-550' : 'border-transparent theme-text-muted hover:theme-text-main'
                                }`}
                            >
                                🔒 Keamanan / Kata Sandi
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {activeTab === 'profile' ? (
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold theme-text-muted uppercase">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold theme-text-muted uppercase">Nomor HP</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                        />
                                    </div>

                                    {auth.user.role === 'donor' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold theme-text-muted uppercase">Jenis Kelamin</label>
                                                    <select 
                                                        value={profileForm.gender}
                                                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                                    >
                                                        <option value="male">Laki-laki</option>
                                                        <option value="female">Perempuan</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold theme-text-muted uppercase">Tanggal Lahir</label>
                                                    <input 
                                                        type="date" 
                                                        required 
                                                        value={profileForm.birth_date}
                                                        onChange={(e) => setProfileForm({ ...profileForm, birth_date: e.target.value })}
                                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold theme-text-muted uppercase">Golongan Darah</label>
                                                    <select 
                                                        value={profileForm.blood_type}
                                                        onChange={(e) => setProfileForm({ ...profileForm, blood_type: e.target.value })}
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
                                                        value={profileForm.rhesus}
                                                        onChange={(e) => setProfileForm({ ...profileForm, rhesus: e.target.value })}
                                                        className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                                    >
                                                        <option value="positive">Positif (+)</option>
                                                        <option value="negative">Negatif (-)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsSettingsModalOpen(false)}
                                            className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-xs font-bold"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-lg"
                                        >
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold theme-text-muted uppercase">Kata Sandi Saat Ini</label>
                                        <input 
                                            type="password" 
                                            required 
                                            value={passwordForm.current_password}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                            className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold theme-text-muted uppercase">Kata Sandi Baru</label>
                                        <input 
                                            type="password" 
                                            required 
                                            value={passwordForm.password}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                                            className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold theme-text-muted uppercase">Konfirmasi Kata Sandi Baru</label>
                                        <input 
                                            type="password" 
                                            required 
                                            value={passwordForm.password_confirmation}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                                            className="w-full theme-bg-main border theme-border-main rounded-xl px-3 py-2 text-sm theme-text-main focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t theme-border-main">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsSettingsModalOpen(false)}
                                            className="px-4 py-2 border theme-border-main hover:theme-bg-sidebar text-slate-350 rounded-xl text-xs font-bold"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-550 hover:to-rose-550 text-white rounded-xl text-xs font-bold shadow-lg"
                                        >
                                            Ubah Kata Sandi
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
