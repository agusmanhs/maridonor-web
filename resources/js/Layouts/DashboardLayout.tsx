import React, { ReactNode, useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { applyTheme, getSavedTheme, ThemeType } from '../Utils/themeHelper';

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
    const [theme, setThemeState] = useState<ThemeType>('light');

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
        const saved = getSavedTheme();
        setThemeState(saved);
    }, []);

    const toggleTheme = (newTheme: ThemeType) => {
        applyTheme(newTheme);
        setThemeState(newTheme);
    };

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

    const showPmiMenu = isPmi || (auth?.user?.role === 'super_admin' && isSuperAdmin && adminContext === 'pmi');
    const showHospitalMenu = isHospital || (auth?.user?.role === 'super_admin' && isSuperAdmin && adminContext === 'hospital');
    const showDonorMenu = isDonor || (auth?.user?.role === 'super_admin' && isSuperAdmin && adminContext === 'donor');

    const isActive = (path: string, typeParam?: string) => {
        if (typeof window === 'undefined') {
            return "flex items-center px-6 h-12 gap-3 text-secondary dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-tertiary-container border-l-4 border-transparent font-nav-item text-nav-item transition-all duration-200";
        }
        const urlParams = new URLSearchParams(window.location.search);
        const currentType = urlParams.get('type');
        
        const pathMatches = window.location.pathname.startsWith(path);
        const typeMatches = !typeParam || currentType === typeParam;

        return (pathMatches && typeMatches)
            ? "flex items-center px-6 h-12 gap-3 text-primary dark:text-primary-fixed bg-primary-fixed/20 border-l-4 border-primary font-nav-item text-nav-item transition-all duration-200" 
            : "flex items-center px-6 h-12 gap-3 text-secondary dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-tertiary-container border-l-4 border-transparent font-nav-item text-nav-item transition-all duration-200";
    };

    return (
        <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-surface dark:bg-[#1a1c1c] text-on-surface flex flex-col lg:flex-row antialiased relative transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
            
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 bg-white/70 dark:bg-tertiary/70 backdrop-blur-md border-b border-outline-variant dark:border-[#414343] transition-colors duration-300">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <img 
                            src="/images/logo_icon.png" 
                            alt="MARIDONOR Logo" 
                            className="h-8 w-auto object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDJz4_nlZYqmzDV3OfxKKnnZtrQMA3dxw7dDAaafkUGSfMDs500OuM1s_sW48RY6RXihP6lsUiqyO5AkWytx7yGfa0-OK5KLERGuGeLOhyXnlqC-f_p2nKUJT21ANTrwxxbLNXsBQuqJBAIG06uBhczivHT-nmYL-1eOv-DzNa1apyNvOGfM7KE5QAWhQjUuCAg1AWWqEbmoc9D57Kbq3V-zSh0qGh-VySBm_RZK2vfnN6sS1B6VUsEtP1clfFi0FE2yI0";
                            }}
                        />
                        <span className="font-title-md text-headline-lg font-bold text-primary dark:text-primary-fixed tracking-tight" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                            MARIDONOR
                        </span>
                    </Link>

                    {/* Search Field */}
                    <div className="hidden md:flex items-center bg-surface-container-low dark:bg-[#414343]/30 px-4 py-2 rounded-xl border border-outline-variant/35 dark:border-transparent">
                        <span className="material-symbols-outlined text-secondary mr-2 text-[20px]">search</span>
                        <input 
                            className="bg-transparent border-none focus:ring-0 text-sm w-64 text-on-surface dark:text-white placeholder-slate-400" 
                            placeholder="Cari kantong darah, donor, atau klinik..." 
                            type="text" 
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Switcher Segmented Control */}
                    <div className="flex items-center bg-secondary-container/50 dark:bg-[#414343]/50 p-1 rounded-xl">
                        <button 
                            className={`p-1.5 rounded-lg transition-all active:scale-95 flex items-center ${theme !== 'dark' ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:bg-white/40 dark:hover:bg-white/10'}`} 
                            onClick={() => toggleTheme('light')}
                            type="button"
                            title="Mode Terang"
                        >
                            <span className="material-symbols-outlined text-[20px]">light_mode</span>
                        </button>
                        <button 
                            className={`p-1.5 rounded-lg transition-all active:scale-95 flex items-center ${theme === 'dark' ? 'bg-primary-container text-white shadow-sm' : 'text-secondary hover:bg-white/40 dark:hover:bg-white/10'}`} 
                            onClick={() => toggleTheme('dark')}
                            type="button"
                            title="Mode Gelap"
                        >
                            <span className="material-symbols-outlined text-[20px]">dark_mode</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 border-l border-outline-variant/30 pl-4">
                        <button className="p-2 rounded-full hover:bg-secondary-container/50 dark:hover:bg-white/5 transition-colors relative" title="Notifikasi">
                            <span className="material-symbols-outlined text-primary dark:text-primary-fixed">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full animate-pulse"></span>
                        </button>
                        
                        <button 
                            onClick={() => setIsSettingsModalOpen(true)}
                            className="p-2 rounded-full hover:bg-secondary-container/50 dark:hover:bg-white/5 transition-colors" 
                            title="Pengaturan"
                        >
                            <span className="material-symbols-outlined text-primary dark:text-primary-fixed">settings_brightness</span>
                        </button>

                        <button 
                            onClick={() => setIsSettingsModalOpen(true)}
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container ml-2 active:scale-95 transition-transform" 
                            title={auth?.user?.name || 'Profil'}
                        >
                            <img 
                                className="w-full h-full object-cover" 
                                alt={auth?.user?.name} 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0tUo1JxzcXGRRXQ6W_2GIr_IQt3xk2YybQ4p8uwxaVx6s_r52jbUUBfNd-30CUpgNOaajYXfNmRH7yEHtA5UvYwZkcXIu9-Iekd6MBLyrMqaEyaDiiouxsokmnk-tl3SlBv0xTHaMMH1l4g3h2KxLGbxH3AdrYVBdhB9PvQtuCnl6tJf_DCUPG-WC6aPDomU3Qr2xik8mBBe3eHI7AIawKpGs1id_UbDGO8Oui6fvimfo0oz3wU8ORw" 
                            />
                        </button>
                    </div>
                </div>
            </header>

            {/* SideNavBar */}
            <aside className="w-full lg:w-[260px] lg:h-screen lg:sticky lg:top-0 bg-white dark:bg-tertiary border-b lg:border-b-0 lg:border-r border-outline-variant dark:border-[#414343] pt-16 flex flex-col relative z-20 transition-colors duration-300">
                <nav className="flex-1 flex flex-col py-6 gap-0.5 overflow-y-auto">
                    <span className="px-6 text-[10px] font-bold text-secondary dark:text-secondary-fixed-dim uppercase tracking-widest block mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {showDonorMenu && !showPmiMenu && !showHospitalMenu ? 'Portal Pendonor' : 'Menu Utama'}
                    </span>
                    
                    {showPmiMenu && (
                        <>
                            <Link href="/dashboard/pmi" className={isActive('/dashboard/pmi')}>
                                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                <span>Dashboard</span>
                            </Link>
                            <Link href="/blood-stocks?type=pmi" className={isActive('/blood-stocks', 'pmi')}>
                                <span className="material-symbols-outlined text-[20px]">bloodtype</span>
                                <span>Donations / Stok</span>
                            </Link>
                            <Link href="/schedules" className={isActive('/schedules')}>
                                <span className="material-symbols-outlined text-[20px]">event</span>
                                <span>Appointments</span>
                            </Link>
                            <Link href="/blood-requests?type=pmi" className={isActive('/blood-requests', 'pmi')}>
                                <span className="material-symbols-outlined text-[20px]">group</span>
                                <span>Permohonan Darah</span>
                            </Link>
                        </>
                    )}

                    {showHospitalMenu && (
                        <>
                            <Link href="/dashboard/hospital" className={isActive('/dashboard/hospital')}>
                                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                <span>Dashboard</span>
                            </Link>
                            <Link href="/blood-requests?type=hospital" className={isActive('/blood-requests', 'hospital')}>
                                <span className="material-symbols-outlined text-[20px]">emergency</span>
                                <span>Ajukan Permohonan</span>
                            </Link>
                            <Link href="/blood-stocks?type=hospital" className={isActive('/blood-stocks', 'hospital')}>
                                <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                                <span>Stok Bank Darah RS</span>
                            </Link>
                        </>
                    )}

                    {showDonorMenu && (
                        <>
                            <Link href="/dashboard/donor" className={isActive('/dashboard/donor')}>
                                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                <span>Dashboard Anda</span>
                            </Link>
                        </>
                    )}

                    {/* Master Data Menu for Super Admin */}
                    {auth?.user?.role === 'super_admin' && (
                        <div className="pt-4 border-t border-outline-variant/30 mt-4 flex flex-col gap-0.5">
                            <span className="px-6 text-[10px] font-bold text-primary dark:text-primary-fixed uppercase tracking-widest block mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                Master Data
                            </span>
                            <Link href="/admin/users" className={isActive('/admin/users')}>
                                <span className="material-symbols-outlined text-[20px]">group</span>
                                <span>Data Pengguna</span>
                            </Link>
                            <Link href="/admin/institutions" className={isActive('/admin/institutions')}>
                                <span className="material-symbols-outlined text-[20px]">apartment</span>
                                <span>Data Institusi</span>
                            </Link>
                            <Link href="/admin/kyc" className={isActive('/admin/kyc')}>
                                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                                <span>Verifikasi KYC</span>
                            </Link>
                            <Link href="/admin/articles" className={isActive('/admin/articles')}>
                                <span className="material-symbols-outlined text-[20px]">book</span>
                                <span>Artikel & Edukasi</span>
                            </Link>
                            <Link href="/admin/announcements" className={isActive('/admin/announcements')}>
                                <span className="material-symbols-outlined text-[20px]">campaign</span>
                                <span>Pengumuman & Event</span>
                            </Link>
                        </div>
                    )}

                    {/* Quick Access Dashboards for Super Admin */}
                    {auth?.user?.role === 'super_admin' && (
                        <div className="pt-4 border-t border-outline-variant/30 mt-4 flex flex-col gap-0.5">
                            <span className="px-6 text-[10px] font-bold text-secondary dark:text-secondary-fixed-dim uppercase tracking-widest block mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                Akses Cepat Dasbor
                            </span>
                            <Link href="/dashboard/pmi" className={isActive('/dashboard/pmi')}>
                                <span className="material-symbols-outlined text-[20px]">domain</span>
                                <span>Dasbor UDD PMI</span>
                            </Link>
                            <Link href="/dashboard/hospital" className={isActive('/dashboard/hospital')}>
                                <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                                <span>Dasbor Rumah Sakit</span>
                            </Link>
                            <Link href="/dashboard/donor" className={isActive('/dashboard/donor')}>
                                <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                                <span>Dasbor Pendonor</span>
                            </Link>
                        </div>
                    )}

                    {/* Footer Navigation Items */}
                    <div className="mt-auto border-t border-outline-variant/20 pt-4 flex flex-col gap-0.5">
                        <button 
                            type="button"
                            onClick={() => setIsSettingsModalOpen(true)}
                            className="flex items-center px-6 h-12 gap-3 text-secondary dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-tertiary-container border-l-4 border-transparent font-nav-item text-nav-item transition-all duration-200 w-full text-left"
                        >
                            <span className="material-symbols-outlined text-[20px]">account_circle</span>
                            <span>Profil & Akun</span>
                        </button>
                        <form onSubmit={handleLogout}>
                            <button 
                                type="submit" 
                                className="flex items-center px-6 h-12 gap-3 text-secondary dark:text-secondary-fixed-dim hover:bg-secondary-container dark:hover:bg-tertiary-container border-l-4 border-transparent font-nav-item text-nav-item transition-all duration-200 w-full text-left"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                <span>Keluar Akun</span>
                            </button>
                        </form>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-0 pt-16 lg:h-screen lg:overflow-y-auto relative z-10 transition-colors duration-300">
                <div className="p-8 space-y-8 min-h-[calc(100vh-64px)] flex flex-col justify-between">
                    <div className="space-y-8 flex-1">
                        
                        {/* Dynamic Header Banner */}
                        {(title || headerRight) && (
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-outline-variant dark:border-[#414343]">
                                <div>
                                    {title && <h1 className="font-headline-lg text-headline-lg text-primary dark:text-primary-fixed mb-1" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>{title}</h1>}
                                    {subtitle && <p className="text-secondary dark:text-slate-400 text-sm font-light">{subtitle}</p>}
                                </div>
                                <div className="flex items-center gap-3">
                                    {headerRight}
                                </div>
                            </div>
                        )}

                        {/* Slot Konten Halaman */}
                        {children}

                    </div>

                    {/* Footer dashboard */}
                    <footer className="w-full bg-[#2b2d2d] dark:bg-[#111212] grid grid-cols-12 gap-6 p-8 rounded-2xl text-white mt-12">
                        <div className="col-span-12 md:col-span-4">
                            <span className="font-title-md text-title-md text-white mb-2 block flex items-center" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                                <img 
                                    src="/images/logo_icon.png" 
                                    alt="MARIDONOR Logo" 
                                    className="h-6 w-auto object-contain inline-block mr-2 brightness-0 invert"
                                />
                                MARIDONOR
                            </span>
                            <p className="text-slate-400 text-xs font-light max-w-xs leading-relaxed">
                                Memimpin transformasi digital dalam manajemen rantai pasok darah demi hasil keselamatan pasien yang superior.
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-8 flex flex-wrap gap-8 justify-end">
                            <div className="flex flex-col gap-2">
                                <span className="text-white font-bold text-xs">Dokumen</span>
                                <a className="text-slate-400 hover:text-white transition-colors text-xs" href="#">Kebijakan Privasi</a>
                                <a className="text-slate-400 hover:text-white transition-colors text-xs" href="#">Syarat &amp; Ketentuan</a>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-white font-bold text-xs">Bantuan</span>
                                <a className="text-slate-400 hover:text-white transition-colors text-xs" href="#">Hubungi Dukungan</a>
                                <a className="text-slate-400 hover:text-white transition-colors text-xs" href="#">Tentang Kami</a>
                            </div>
                        </div>
                        <div className="col-span-12 border-t border-slate-700/50 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                            <p>© {new Date().getFullYear()} MARIDONOR. Seluruh hak cipta dilindungi.</p>
                            <div className="flex gap-4">
                                <span className="material-symbols-outlined text-white cursor-pointer hover:text-rose-450 text-[18px]">share</span>
                                <span className="material-symbols-outlined text-white cursor-pointer hover:text-rose-450 text-[18px]">help_outline</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>

            {/* Modal Pengaturan Akun */}
            {isSettingsModalOpen && auth?.user && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-[#2b2d2d] border border-outline-variant dark:border-[#414343] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-outline-variant dark:border-[#414343] flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>Pengaturan Akun & Profil</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Kelola informasi pribadi dan keamanan kata sandi Anda</p>
                            </div>
                            <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-2xl font-light">&times;</button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-outline-variant dark:border-[#414343] bg-slate-50 dark:bg-[#1a1c1c]">
                            <button 
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${
                                    activeTab === 'profile' ? 'border-primary text-primary dark:border-primary-fixed dark:text-primary-fixed' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                👤 Informasi Profil
                            </button>
                            <button 
                                onClick={() => setActiveTab('password')}
                                className={`flex-1 py-3 text-xs font-bold border-b-2 transition ${
                                    activeTab === 'password' ? 'border-primary text-primary dark:border-primary-fixed dark:text-primary-fixed' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                🔒 Keamanan / Kata Sandi
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {activeTab === 'profile' ? (
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-[#414343] border border-outline-variant dark:border-transparent rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Nomor HP</label>
                                        <input 
                                            type="text" 
                                            required 
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-[#414343] border border-outline-variant dark:border-transparent rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
                                        />
                                    </div>

                                    {auth.user.role === 'donor' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Jenis Kelamin</label>
                                                    <select 
                                                        value={profileForm.gender}
                                                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                                                        className="w-full bg-slate-50 dark:bg-[#414343] border border-outline-variant dark:border-transparent rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
                                                    >
                                                        <option value="male">Laki-laki</option>
                                                        <option value="female">Perempuan</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tanggal Lahir</label>
                                                    <input 
                                                        type="date" 
                                                        required 
                                                        value={profileForm.birth_date}
                                                        onChange={(e) => setProfileForm({ ...profileForm, birth_date: e.target.value })}
                                                        className="w-full bg-slate-50 dark:bg-[#414343] border border-outline-variant dark:border-transparent rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Golongan Darah</label>
                                                    <select 
                                                        value={profileForm.blood_type}
                                                        onChange={(e) => setProfileForm({ ...profileForm, blood_type: e.target.value })}
                                                        className="w-full bg-slate-50 dark:bg-[#414343] border border-outline-variant dark:border-transparent rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
                                                    >
                                                        <option value="A">A</option>
                                                        <option value="B">B</option>
                                                        <option value="AB">AB</option>
                                                        <option value="O">O</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Rhesus</label>
                                                    <select 
                                                        value={profileForm.rhesus}
                                                        onChange={(e) => setProfileForm({ ...profileForm, rhesus: e.target.value })}
                                                        className="w-full bg-slate-50 dark:bg-[#414343] border border-outline-variant dark:border-transparent rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
                                                    >
                                                        <option value="positive">Positif (+)</option>
                                                        <option value="negative">Negatif (-)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex justify-end space-x-3 pt-4 border-t border-outline-variant dark:border-[#414343]">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsSettingsModalOpen(false)}
                                            className="px-4 py-2 border border-outline-variant dark:border-[#414343] text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#414343]"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-900/10 hover:brightness-110"
                                        >
                                            Simpan Perubahan
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Kata Sandi Saat Ini</label>
                                        <input 
                                            type="password" 
                                            required 
                                            value={passwordForm.current_password}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-[#414343] border border-outline-variant dark:border-transparent rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Kata Sandi Baru</label>
                                        <input 
                                            type="password" 
                                            required 
                                            value={passwordForm.password}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-[#414343] border border-outline-variant dark:border-transparent rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Konfirmasi Kata Sandi Baru</label>
                                        <input 
                                            type="password" 
                                            required 
                                            value={passwordForm.password_confirmation}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-[#414343] border border-slate-200 dark:border-transparent rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t border-outline-variant dark:border-[#414343]">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsSettingsModalOpen(false)}
                                            className="px-4 py-2 border border-outline-variant dark:border-[#414343] text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-[#414343]"
                                        >
                                            Batal
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-900/10 hover:brightness-110"
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
