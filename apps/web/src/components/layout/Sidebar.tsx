'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarProfile } from './SidebarProfile'
import { SidebarGroup } from './SidebarGroup'
import { SidebarItem } from './SidebarItem'
import { getMenuForRole } from './menuConfig'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'

interface SidebarProps {
  isOpen?: boolean
  setIsSidebarOpen?: (open: boolean) => void
  isMobileOpen?: boolean
}

export function Sidebar({ isOpen = true, setIsSidebarOpen, isMobileOpen = false }: SidebarProps) {
  const { user, logout, isAdmin, isEditor, isAuthor } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get user role and navigation
  const getUserRole = () => {
    if (isAdmin) return 'admin'
    if (isEditor) return 'editor'
    if (isAuthor) return 'author'
    return 'member'
  }

  const userRole = getUserRole()
  const menuGroups = getMenuForRole(userRole)

  const handleSignOut = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error)
    }
  }

  // Don't render sidebar if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[9997] lg:hidden"
          onClick={() => {
            // Close sidebar when backdrop is clicked
            if (typeof window !== 'undefined') {
              // Trigger custom event to close sidebar
              window.dispatchEvent(new CustomEvent('closeSidebar'))
            }
          }}
        />
      )}
      
      <aside className={`fixed left-0 top-16 z-[9998] h-[calc(100vh-64px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out sidebar-container flex flex-col ${
        isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
      }`}>
        {/* Üst - Kullanıcı Profili (sadece authenticated kullanıcılar için) */}
        {user && (
          <div className={`flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}>
            <SidebarProfile onLogout={handleSignOut} />
            
            {/* Dark Mode Toggle - Sadece küçük ekranlarda görünür */}
            <div className="md:hidden mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Tema</span>
                <ThemeToggle size="sm" />
              </div>
            </div>
          </div>
        )}

        {/* Orta - Navigation - Scrollable content area */}
        <nav className={`sidebar-nav sidebar-scrollbar px-2 py-4 overflow-y-auto flex-1 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="space-y-6">
            {/* Navigation Links - Sadece küçük ekranlarda görünür */}
            <div className="md:hidden">
              <div className="px-2 mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Sayfalar</h3>
                <div className="space-y-1">
                  <Link
                    href="/publications"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
                  >
                    <span>Yayınlar</span>
                  </Link>
                  <Link
                    href="/legislation"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
                  >
                    <span>Mevzuat</span>
                  </Link>
                  <Link
                    href="/jurisprudence"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
                  >
                    <span>İçtihat</span>
                  </Link>
                  <Link
                    href="/authors"
                    className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
                  >
                    <span>Yazarlar</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {menuGroups.map((group) => (
              <SidebarGroup key={group.title} title={group.title}>
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.name}
                    name={item.name}
                    href={item.href}
                    icon={item.icon}
                    exists={item.exists}
                    badge={item.badge}
                    subItems={item.subItems}
                  />
                ))}
              </SidebarGroup>
            ))}
          </div>
        </nav>

        {/* Alt - HP Panel Bilgisi */}
        <div className={`flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-700 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">HP Panel</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
