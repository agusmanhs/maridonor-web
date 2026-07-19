import React, { useEffect, useState } from 'react';
import { applyTheme, getSavedTheme, ThemeType } from '../Utils/themeHelper';

export default function ThemeSwitcher() {
    const [currentTheme, setCurrentTheme] = useState<ThemeType>('system');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Inisialisasi tema saat pertama kali komponen dirender
        const saved = getSavedTheme();
        setCurrentTheme(saved);
    }, []);

    const handleThemeChange = (theme: ThemeType) => {
        applyTheme(theme);
        setCurrentTheme(theme);
        setIsOpen(false);
    };

    const getThemeIcon = (theme: ThemeType) => {
        switch (theme) {
            case 'light': return '☀️';
            case 'dark': return '🌙';
            default: return '💻';
        }
    };

    return (
        <div className="relative inline-block text-left z-35">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 bg-slate-900/60 dark:bg-slate-900/40 border border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-850 transition duration-150 flex items-center justify-center space-x-2 focus:outline-none focus:ring-1 focus:ring-red-500/35"
                title="Pilih Tema Halaman"
            >
                <span>{getThemeIcon(currentTheme)}</span>
                <span className="hidden md:inline text-xs text-slate-350 dark:text-slate-400 capitalize">{currentTheme} Theme</span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-850">
                        <button 
                            onClick={() => handleThemeChange('light')}
                            className="w-full px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-850 flex items-center space-x-2.5 transition text-left"
                        >
                            <span>☀️</span>
                            <span>Terang</span>
                        </button>
                        <button 
                            onClick={() => handleThemeChange('dark')}
                            className="w-full px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-850 flex items-center space-x-2.5 transition text-left"
                        >
                            <span>🌙</span>
                            <span>Gelap</span>
                        </button>
                        <button 
                            onClick={() => handleThemeChange('system')}
                            className="w-full px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-850 flex items-center space-x-2.5 transition text-left"
                        >
                            <span>💻</span>
                            <span>Sistem</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
