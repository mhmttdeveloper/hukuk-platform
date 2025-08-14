'use client'

import { useAuth } from '@/contexts/AuthContext'
import { SidebarProfile } from './SidebarProfile'
import { SidebarGroup } from './SidebarGroup'
import { SidebarItem } from './SidebarItem'
import { getMenuForRole } from './menuConfig'

interface SidebarProps {
  isMobileOpen?: boolean
}

export function Sidebar({ isMobileOpen = false }: SidebarProps) {
  const { user, logout, isAdmin, isEditor, isAuthor } = useAuth()

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
          className="fixed inset-0 bg-black bg-opacity-50 z-[80] lg:hidden"
          onClick={() => {
            // Close sidebar when backdrop is clicked
            if (typeof window !== 'undefined') {
              // Trigger custom event to close sidebar
              window.dispatchEvent(new CustomEvent('closeSidebar'))
            }
          }}
        />
      )}
      
      <aside className={`fixed left-0 top-16 z-[90] h-[calc(100vh-64px)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out sidebar-container ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header - Fixed height, no scroll */}
        <div className="flex-shrink-0 flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HP</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Panel</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable content area */}
        <nav className="sidebar-nav sidebar-scrollbar px-2 py-4">
          <div className="space-y-6">
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

        {/* User Profile - Fixed height, no scroll */}
        <div className="flex-shrink-0">
          <SidebarProfile onLogout={handleSignOut} />
        </div>
      </aside>
    </>
  )
}
