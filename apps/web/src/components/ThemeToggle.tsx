'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  // Geçici olarak hata durumunda fallback
  let theme = 'light';
  let setTheme = () => {};
  
  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    setTheme = themeContext.setTheme;
  } catch (error) {
    console.warn('Theme context not available:', error);
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-20 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      title={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
      aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      <span
        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          isDark ? 'translate-x-10' : 'translate-x-1'
        }`}
      />
      <Sun className={`absolute left-1 h-6 w-6 text-yellow-500 transition-opacity duration-200 ${
        isDark ? 'opacity-0' : 'opacity-100'
      }`} />
      <Moon className={`absolute right-1 h-6 w-6 text-blue-500 transition-opacity duration-200 ${
        isDark ? 'opacity-100' : 'opacity-0'
      }`} />
    </button>
  );
}
