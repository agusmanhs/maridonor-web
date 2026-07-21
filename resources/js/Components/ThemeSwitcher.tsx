import React, { useEffect, useState } from 'react';
import { applyTheme, getSavedTheme, ThemeType } from '../Utils/themeHelper';

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState<ThemeType>('light');

    useEffect(() => {
        const saved = getSavedTheme();
        setTheme(saved);
        // Ensure root element has the correct theme class initialized
        applyTheme(saved);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        setTheme(nextTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#414343] hover:bg-slate-200 dark:hover:bg-[#4d4f4f] transition-all duration-200 flex items-center justify-center border border-slate-200 dark:border-transparent active:scale-95"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
            <span className="material-symbols-outlined text-[20px] text-rose-700 dark:text-rose-400">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
        </button>
    );
}
