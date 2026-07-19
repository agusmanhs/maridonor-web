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

                <div className="p-4 border-t theme-border-main">
                    <form onSubmit={handleLogout}>
                        <button type="submit" className="w-full py-2.5 text-sm font-semibold theme-text-muted hover:theme-text-main hover:bg-slate-500/10 rounded-xl border theme-border-main transition duration-150 flex items-center justify-center space-x-2">
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
        </div>
    );
}
