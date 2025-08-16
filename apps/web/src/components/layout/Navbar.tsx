'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { User, Menu, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

interface NavbarProps {
  isSidebarOpen?: boolean
  setIsSidebarOpen?: (open: boolean) => void
}

export function Navbar({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) {
  const { user, isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isVisitorMenuOpen, setIsVisitorMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Click outside handler for visitor dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isVisitorMenuOpen && !(event.target as Element).closest('.visitor-dropdown')) {
        setIsVisitorMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisitorMenuOpen])

  // Server-side rendering sırasında boş div döndür
  if (!mounted) {
    return (
      <div className="sticky top-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-[9999] transition-all duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <header className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Menu Burger placeholder - Her zaman görünür */}
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              {/* Logo placeholder - Büyük ekranlarda görünür */}
              <div className="hidden md:block w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle placeholder - Geniş ekranlarda görünür */}
              <div className="hidden md:block w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              {/* Giriş/Kayıt placeholder */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </header>
          
          {/* Küçük ekranlarda ortada görünen logo placeholder */}
          <div className="md:hidden flex justify-center items-center h-16 -mt-16">
            <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`sticky top-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-[9999] transition-all duration-300 ${isScrolled ? 'scrolled' : ''}`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center h-16">
          {/* Sol taraf - Logo ve Menu Burger */}
          <div className="flex items-center space-x-4">
            {/* Menu Burger - Her zaman görünür, authentication state'ine göre farklı sidebar açar */}
            {setIsSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ${
                  isAuthenticated ? '' : 'md:hidden'
                }`}
                aria-label={isSidebarOpen ? 'Sidebar\'ı kapat' : 'Sidebar\'ı aç'}
                title={isSidebarOpen ? 'Sidebar\'ı kapat' : 'Sidebar\'ı aç'}
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            
            {/* Logo - Küçük ekranlarda gizli, büyük ekranlarda sol tarafta */}
            <Link href="/" className="hidden md:block text-xl font-bold text-gray-900 dark:text-white">
              YargıTam
            </Link>
          </div>

          {/* Orta - Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/publications" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Yayınlar
            </Link>
            <Link href="/legislation" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Mevzuat
            </Link>
            <Link href="/jurisprudence" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              İçtihat
            </Link>
            <Link href="/authors" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Yazarlar
            </Link>
          </nav>

          {/* Sağ taraf - Dark Mode Toggle ve Kullanıcı İşlemleri */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle - Geniş ekranlarda görünür */}
            <div className="hidden md:block">
              <ThemeToggle size="sm" />
            </div>
            
            {isAuthenticated ? (
              /* Giriş yapılmış kullanıcı - Profil linki */
              <Link
                href="/profile"
                className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block">{user?.name || 'Kullanıcı'}</span>
              </Link>
            ) : (
              /* Giriş yapılmamış kullanıcı - Giriş/Kayıt dropdown menüsü */
              <div className="relative visitor-dropdown hidden md:block">
                <div className="flex items-center space-x-2">
                  {/* Giriş Linki */}
                  <Link
                    href="/auth/signin"
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Giriş Yap</span>
                  </Link>
                  
                  {/* Dropdown Toggle */}
                  <button
                    onClick={() => setIsVisitorMenuOpen(!isVisitorMenuOpen)}
                    className="p-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isVisitorMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {/* Dropdown Menu */}
                {isVisitorMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[10000]">
                    <div className="py-1">
                      <Link
                        href="/auth/register"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Kayıt Ol</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
        
        {/* Küçük ekranlarda ortada görünen logo */}
        <div className="md:hidden flex justify-center items-center h-16 -mt-16">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            YargıTam
          </Link>
        </div>
      </div>
    </div>
  )
}