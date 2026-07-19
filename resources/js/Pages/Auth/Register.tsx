import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ThemeSwitcher from '../../Components/ThemeSwitcher';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        gender: 'male',
        birth_date: '',
        blood_type: 'O',
        rhesus: 'positive',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head>
                <title>Daftar Pendonor - Maridonor Portal</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            
            <div className="min-h-screen theme-bg-main flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-red-600 selection:theme-text-main antialiased relative overflow-hidden transition-colors duration-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
                
                {/* Floating Theme Switcher */}
                <div className="absolute top-6 right-6 z-30">
                    <ThemeSwitcher />
                </div>
                
                {/* Background Grid Pattern & Glowing Circles */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-main)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-main)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>

                <div className="w-full max-w-2xl space-y-8 relative z-10 my-8">
                    
                    {/* Header Logo */}
                    <div className="text-center space-y-3">
                        <Link href="/" className="inline-flex items-center space-x-3.5 group">
                            <div className="p-2 bg-gradient-to-br from-red-500/10 to-rose-600/10 rounded-xl border border-red-500/20 group-hover:border-red-500/40 transition duration-200">
                                <img src="/images/logo_icon.png" alt="Maridonor Logo" className="h-8 w-auto group-hover:scale-105 transition duration-200" />
                            </div>
                            <span className="text-2xl font-black tracking-tight theme-text-main">
                                Mari<span className="text-red-600">donor</span>
                            </span>
                        </Link>
                        <h2 className="text-lg font-bold theme-text-main tracking-tight">
                            Pendaftaran Pendonor Mandiri
                        </h2>
                        <p className="text-xs theme-text-muted">
                            Buat akun baru untuk mulai mendonorkan darah, mengumpulkan poin, dan melihat sertifikat digital Anda.
                        </p>
                    </div>

                    {/* Card Form Glassmorphism */}
                    <div className="theme-bg-card border theme-border-card rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
                        <form onSubmit={submit} className="space-y-5">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label htmlFor="name" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                        placeholder="Contoh: Ahmad Hidayat"
                                        required
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-550 font-semibold pt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Address */}
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                        Alamat Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                        placeholder="ahmad@email.com"
                                        required
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-550 font-semibold pt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Phone Number */}
                                <div className="space-y-1.5">
                                    <label htmlFor="phone" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                        Nomor Handphone
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        value={data.phone}
                                        className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                        placeholder="Contoh: 081234567890"
                                        required
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-red-550 font-semibold pt-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Birth Date */}
                                <div className="space-y-1.5">
                                    <label htmlFor="birth_date" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                        Tanggal Lahir (Min. 17 Tahun)
                                    </label>
                                    <input
                                        id="birth_date"
                                        type="date"
                                        name="birth_date"
                                        value={data.birth_date}
                                        className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                        required
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                    />
                                    {errors.birth_date && (
                                        <p className="text-xs text-red-550 font-semibold pt-1">{errors.birth_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label htmlFor="password" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                        Kata Sandi
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                        placeholder="••••••••"
                                        required
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    {errors.password && (
                                        <p className="text-xs text-red-550 font-semibold pt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <label htmlFor="password_confirmation" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                        Konfirmasi Kata Sandi
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition duration-200"
                                        placeholder="••••••••"
                                        required
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-xs text-red-550 font-semibold pt-1">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* Gender */}
                                <div className="space-y-1.5">
                                    <label htmlFor="gender" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                        Jenis Kelamin
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={data.gender}
                                        className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main focus:outline-none focus:border-red-500/50 transition duration-200"
                                        onChange={(e) => setData('gender', e.target.value)}
                                    >
                                        <option value="male">Laki-laki</option>
                                        <option value="female">Perempuan</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="text-xs text-red-550 font-semibold pt-1">{errors.gender}</p>
                                    )}
                                </div>

                                {/* Blood Type */}
                                <div className="space-y-1.5">
                                    <label htmlFor="blood_type" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                        Golongan Darah
                                    </label>
                                    <select
                                        id="blood_type"
                                        name="blood_type"
                                        value={data.blood_type}
                                        className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main focus:outline-none focus:border-red-500/50 transition duration-200"
                                        onChange={(e) => setData('blood_type', e.target.value)}
                                    >
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="AB">AB</option>
                                        <option value="O">O</option>
                                    </select>
                                    {errors.blood_type && (
                                        <p className="text-xs text-red-550 font-semibold pt-1">{errors.blood_type}</p>
                                    )}
                                </div>

                                {/* Rhesus */}
                                <div className="space-y-1.5">
                                    <label htmlFor="rhesus" className="text-xs font-bold theme-text-muted uppercase tracking-wider block">
                                        Rhesus
                                    </label>
                                    <select
                                        id="rhesus"
                                        name="rhesus"
                                        value={data.rhesus}
                                        className="w-full px-4 py-3.5 theme-bg-input border theme-border-main rounded-xl text-sm theme-text-main focus:outline-none focus:border-red-500/50 transition duration-200"
                                        onChange={(e) => setData('rhesus', e.target.value)}
                                    >
                                        <option value="positive">Positif (+)</option>
                                        <option value="negative">Negatif (-)</option>
                                    </select>
                                    {errors.rhesus && (
                                        <p className="text-xs text-red-550 font-semibold pt-1">{errors.rhesus}</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-550 disabled:opacity-50 rounded-xl shadow-lg shadow-red-600/15 hover:shadow-red-600/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center"
                            >
                                {processing ? 'Memproses Pendaftaran...' : 'Daftar Sekarang'}
                            </button>
                        </form>
                    </div>

                    {/* Login Link */}
                    <div className="text-center space-y-2">
                        <p className="text-xs theme-text-muted">
                            Sudah memiliki akun?{' '}
                            <Link href="/login" className="text-red-500 font-bold hover:text-red-400 transition duration-150">
                                Masuk di sini
                            </Link>
                        </p>
                        <Link href="/" className="inline-block text-xs theme-text-muted hover:theme-text-main transition duration-150">
                            &larr; Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
