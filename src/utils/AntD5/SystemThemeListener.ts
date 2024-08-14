import { useEffect } from 'react';

export const useSystemThemeListener = () => {
  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    const updateDarkMode = (e: MediaQueryListEvent) => {
      const isDarkMode = e.matches;
      console.log('System theme changed to: ' + isDarkMode ? 'Dark' : 'Light');
      //   SetDarkMode(e.matches);
    };

    prefersDarkScheme.addEventListener('change', updateDarkMode);

    // SetDarkMode(prefersDarkScheme.matches);

    // 清理监听器
    return () => {
      prefersDarkScheme.removeEventListener('change', updateDarkMode);
    };
  }, []);
};
