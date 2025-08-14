'use client'

import { useState } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import ThemeToggle from "../ThemeToggle"
import { ChevronDown, User, LogOut, Settings, Menu } from 'lucide-react'
import Link from 'next/link'

interface NavbarProps {
  isSidebarOpen?: boolean
  setIsSidebarOpen?: (open: boolean) => void
}

export function Navbar({ isSidebarOpen, setIsSidebarOpen }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error)
      alert('Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Sol taraf - Logo ve Mobile Sidebar Toggle */}
          <div className="flex items-center space-x-4">
            {/* Mobile Sidebar Toggle */}
            {isAuthenticated && setIsSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Hukuk Platformu
            </Link>
          </div>

          {/* Orta - Public Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
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

          {/* Sağ taraf - Kullanıcı işlemleri ve tema toggle */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              /* Giriş yapılmış kullanıcı - Profil menüsü */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block">{user?.name || 'Kullanıcı'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[200]">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="w-4 w-4" />
                        <span>Profil</span>
                      </Link>
                      
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Giriş yapılmamış kullanıcı - Giriş/Kayıt menüsü */
              <div className="relative">
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
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[200]">
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
            
            {/* Tema toggle en sağda */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
