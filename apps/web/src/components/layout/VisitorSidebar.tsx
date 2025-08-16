'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import Link from 'next/link'
import { X, User, FileText, BookOpen, Gavel, Users } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

interface VisitorSidebarProps {
  isOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
}

export function VisitorSidebar({ isOpen, setIsSidebarOpen }: VisitorSidebarProps) {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('.visitor-sidebar')) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsSidebarOpen])

  // Don't render if user is authenticated
  if (isAuthenticated) {
    return null
  }

  // Don't render on large screens (md+)
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[9997] md:hidden"
          onClick={() => {
            // Close sidebar when backdrop is clicked
            if (typeof window !== 'undefined') {
              // Trigger custom event to close sidebar
              window.dispatchEvent(new CustomEvent('closeSidebar'))
            }
          }}
        />
      )}
      
      <aside className={`fixed left-0 top-16 z-[9998] h-[calc(100vh-64px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out sidebar-container visitor-sidebar flex flex-col md:hidden ${
        isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
      }`}>
        {/* Üst - Site İsmi ve Kapatma Butonu */}
        <div className={`flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              YargıTam
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Orta - Navigation Links */}
        <nav className={`sidebar-nav sidebar-scrollbar px-2 py-4 overflow-y-auto flex-1 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="space-y-6">
            {/* Sayfalar */}
            <div>
              <div className="px-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Sayfalar</h3>
                <div className="space-y-1">
                  <Link
                    href="/publications"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    <span>Yayınlar</span>
                  </Link>
                  <Link
                    href="/legislation"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
                  >
                    <BookOpen className="w-4 h-4 mr-3" />
                    <span>Mevzuat</span>
                  </Link>
                  <Link
                    href="/jurisprudence"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
                  >
                    <Gavel className="w-4 h-4 mr-3" />
                    <span>İçtihat</span>
                  </Link>
                  <Link
                    href="/authors"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
                  >
                    <Users className="w-4 h-4 mr-3" />
                    <span>Yazarlar</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Kullanıcı İşlemleri */}
            <div>
              <div className="px-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Hesap</h3>
                <div className="space-y-1">
                  <Link
                    href="/auth/signin"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    <span>Giriş Yap</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    <span>Kayıt Ol</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Alt - Dark Mode Toggle */}
        <div className={`flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Tema</span>
            <ThemeToggle size="sm" />
          </div>
        </div>
      </aside>
    </>
  )
}
