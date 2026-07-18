import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface User {
    name: string;
    email: string;
    role: string;
}

interface Props {
    title: string;
    auth: {
        user: User | null;
    };
}

export default function Welcome({ title, auth }: Props) {
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <>
            <Head title="Beranda - Maridonor" />
            <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-red-600 selection:text-white font-sans antialiased">
                
                {/* Navbar Sticky Glassmorphic */}
                <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img src="/images/logo.png" alt="Maridonor Logo" className="h-9 w-auto" />
                            <span className="text-xl font-bold tracking-tight text-white font-sans">
                                Mari<span className="text-red-500">donor</span>
                            </span>
                        </div>

                        <nav className="flex items-center space-x-4">
                            {auth.user ? (
                                <div className="flex items-center space-x-4">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-sm font-semibold text-white">{auth.user.name}</p>
                                        <p className="text-xs text-slate-400 capitalize">{auth.user.role.replace('_', ' ')}</p>
                                    </div>
                                    <form onSubmit={handleLogout}>
                                        <button 
                                            type="submit" 
                                            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition duration-200"
                                        >
                                            Keluar
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <Link 
                                    href="/login" 
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-600/30 transition duration-200"
                                >
                                    Portal Staf
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                                <span>🩸</span>
                                <span>E-Logistik Donor Darah Terintegrasi</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                                Setetes Darah Anda,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">
                                    Harapan Bagi Sesama
                                </span>
                            </h1>

                            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Menghubungkan pendonor secara instan dengan Unit Donor Darah PMI dan Rumah Sakit. Kelola persediaan stok darah darurat dan jadwalkan donasi Anda dengan mudah dalam satu platform.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                                <Link 
                                    href="/login" 
                                    className="px-8 py-4 text-base font-semibold text-white bg-red-600 hover:bg-red-700 rounded-2xl shadow-xl shadow-red-600/30 text-center transition duration-200"
                                >
                                    Masuk Portal Staf
                                </Link>
                                <a 
                                    href="#features" 
                                    className="px-8 py-4 text-base font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-800 text-center transition duration-200"
                                >
                                    Pelajari Fitur
                                </a>
                            </div>

                            {/* Live Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-900">
                                <div className="text-center lg:text-left">
                                    <p className="text-2xl sm:text-3xl font-bold text-white">120+</p>
                                    <p className="text-xs text-slate-400">Pendonor Aktif</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-2xl sm:text-3xl font-bold text-white">45+</p>
                                    <p className="text-xs text-slate-400">PMI & RS Mitra</p>
                                </div>
                                <div className="text-center lg:text-left">
                                    <p className="text-2xl sm:text-3xl font-bold text-white">1.2K</p>
                                    <p className="text-xs text-slate-400">Kantung Tersalurkan</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Visual Graphic */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="absolute inset-0 bg-red-600/10 rounded-full blur-3xl w-72 h-72 mx-auto lg:mr-10"></div>
                            <div className="relative w-full max-w-md bg-slate-900/50 border border-slate-850 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                                    <h3 className="font-bold text-white">Stok Darah Darurat</h3>
                                    <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-md font-semibold">Live</span>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { type: 'A+', count: 12, width: 'w-4/5', color: 'bg-red-500' },
                                        { type: 'B+', count: 8, width: 'w-3/5', color: 'bg-rose-500' },
                                        { type: 'AB+', count: 4, width: 'w-2/5', color: 'bg-red-600' },
                                        { type: 'O+', count: 18, width: 'w-[90%]', color: 'bg-rose-600' },
                                    ].map((stock) => (
                                        <div key={stock.type} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span className="text-slate-300">{stock.type}</span>
                                                <span className="text-white">{stock.count} Kantong</span>
                                            </div>
                                            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                                                <div className={`h-full ${stock.width} ${stock.color} rounded-full`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Features Section */}
                <section id="features" className="bg-slate-950/40 border-t border-slate-900 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                Fitur Utama Platform
                            </h2>
                            <p className="text-slate-400">
                                Solusi logistik modern untuk menanggulangi kebutuhan pasokan darah darurat di Indonesia.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: '📊',
                                    title: 'Logistik Real-time',
                                    desc: 'Pantau ketersediaan kantong darah secara langsung dari berbagai UDD PMI dan unit bank darah Rumah Sakit.'
                                },
                                {
                                    icon: '📅',
                                    title: 'Booking Slot Donor',
                                    desc: 'Daftarkan jadwal donasi Anda secara digital, dapatkan nomor antrean QR Code, dan lewati proses administrasi manual.'
                                },
                                {
                                    icon: '🚨',
                                    title: 'Permintaan Darah Darurat',
                                    desc: 'Rumah Sakit dapat menyiarkan kebutuhan darah kritis secara instan yang langsung terhubung ke sistem PMI terdekat.'
                                }
                            ].map((feat, index) => (
                                <div key={index} className="p-8 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition duration-200 space-y-4">
                                    <div className="text-3xl">{feat.icon}</div>
                                    <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-900 py-8 bg-slate-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
                        &copy; 2026 Maridonor. Hak Cipta Dilindungi Undang-Undang.
                    </div>
                </footer>
            </div>
        </>
    );
}
