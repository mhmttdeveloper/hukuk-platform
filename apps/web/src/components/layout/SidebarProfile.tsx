'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'

interface SidebarProfileProps {
  onLogout: () => void
}

export function SidebarProfile({ onLogout }: SidebarProfileProps) {
  const { user, isAdmin, isEditor, isAuthor } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const getRoleLabel = () => {
    if (isAdmin) return 'Admin'
    if (isEditor) return 'Editör'
    if (isAuthor) return 'Yazar'
    return 'Üye'
  }

  const getRoleColor = () => {
    if (isAdmin) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    if (isEditor) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (isAuthor) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  if (!user) return null

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      {/* Profile Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {user.name || 'Kullanıcı'} {user.surname || ''}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {user.email || 'user@example.com'}
          </p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getRoleColor()}`}>
            {getRoleLabel()}
          </span>
        </div>

        {/* Profile Menu Toggle */}
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Profile Menu Dropdown */}
      {isProfileMenuOpen && (
        <div className="space-y-1 mt-2">
          <Link
            href="/profile"
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
          >
            <User className="mr-3 h-4 w-4" />
            Profil
          </Link>
          
          <Link
            href="/settings"
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-md transition-colors"
          >
            <Settings className="mr-3 h-4 w-4" />
            Ayarlar
          </Link>
          
          <hr className="my-2 border-gray-200 dark:border-gray-600" />
          
          <button
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  )
}
