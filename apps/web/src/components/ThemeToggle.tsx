'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeToggle({ size = 'md' }: ThemeToggleProps) {
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

  // Size variants
  const sizeClasses = {
    sm: 'h-8 w-16',
    md: 'h-10 w-20',
    lg: 'h-12 w-24'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const toggleSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const translateSizes = {
    sm: 'translate-x-8',
    md: 'translate-x-10',
    lg: 'translate-x-12'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex ${sizeClasses[size]} items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
      title={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
      aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      <span
        className={`inline-block ${toggleSizes[size]} transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
          isDark ? translateSizes[size] : 'translate-x-1'
        }`}
      />
      <Sun className={`absolute left-1 ${iconSizes[size]} text-yellow-500 transition-opacity duration-200 ${
        isDark ? 'opacity-0' : 'opacity-100'
      }`} />
      <Moon className={`absolute right-1 ${iconSizes[size]} text-blue-500 transition-opacity duration-200 ${
        isDark ? 'opacity-100' : 'opacity-0'
      }`} />
    </button>
  );
}
