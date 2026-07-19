export type ThemeType = 'light' | 'dark' | 'system';

export const applyTheme = (theme: ThemeType): void => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let activeTheme = theme;
    if (theme === 'system') {
        activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    root.classList.add(activeTheme);
    root.setAttribute('data-theme', activeTheme);
    localStorage.setItem('theme_preference', theme);
};

export const getSavedTheme = (): ThemeType => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('theme_preference') as ThemeType) || 'system';
};

export const initTheme = (): void => {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);

    // Dengar perubahan media query dari OS secara dinamis jika diset ke 'system'
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (getSavedTheme() === 'system') {
            applyTheme('system');
        }
    });
};
