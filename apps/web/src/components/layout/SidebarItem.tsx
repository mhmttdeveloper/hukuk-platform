'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface SubMenuItem {
  name: string
  href: string
  exists: boolean
  badge?: string | number
}

interface SidebarItemProps {
  name: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  exists: boolean
  badge?: string | number
  subItems?: SubMenuItem[]
  isActive?: boolean
}

export function SidebarItem({ 
  name, 
  href, 
  icon: Icon, 
  exists, 
  badge, 
  subItems, 
  isActive = false 
}: SidebarItemProps) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  
  const hasSubItems = subItems && subItems.length > 0
  const isDisabled = !exists
  const isActuallyActive = isActive || (href && pathname === href)

  // Handle accordion toggle
  const handleToggle = () => {
    if (hasSubItems) {
      setIsExpanded(!isExpanded)
    }
  }

  // If item is disabled, show as non-clickable
  if (isDisabled) {
    return (
      <div className="group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-not-allowed opacity-50">
        <Icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400" />
        <span className="text-gray-400 flex-1">{name}</span>
        {badge && (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {badge}
          </span>
        )}
        <span className="ml-auto text-xs text-gray-400">Yakında</span>
      </div>
    )
  }

  // If item has sub-items, render as accordion
  if (hasSubItems) {
    return (
      <div>
        <button
          onClick={handleToggle}
          className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isActuallyActive
              ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
          }`}
        >
          <Icon
            className={`mr-3 h-5 w-5 flex-shrink-0 ${
              isActuallyActive
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
            }`}
          />
          <span className="flex-1 text-left">{name}</span>
          {badge && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {badge}
            </span>
          )}
          <ChevronDown
            className={`ml-auto h-4 w-4 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            } ${
              isActuallyActive
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
            }`}
          />
        </button>

        {/* Sub-items */}
        {isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {subItems.map((subItem) => (
              <Link
                key={subItem.name}
                href={subItem.href}
                onClick={(e) => {
                  // Navigasyon sonrası sidebar'ı kapatma
                  // Sadece mobilde sidebar açıksa kapat
                  if (window.innerWidth < 1024) {
                    // Mobilde sidebar'ı kapatmak için custom event gönder
                    window.dispatchEvent(new CustomEvent('closeSidebar'))
                  }
                }}
                className={`group flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  pathname === subItem.href
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <span className="flex-1">{subItem.name}</span>
                {subItem.badge && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {subItem.badge}
                  </span>
                )}
                {!subItem.exists && (
                  <span className="ml-auto text-xs text-gray-400">Yakında</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Regular menu item
  return (
    <Link
      href={href || '#'}
      onClick={(e) => {
        // Navigasyon sonrası sidebar'ı kapatma
        // Sadece mobilde sidebar açıksa kapat
        if (window.innerWidth < 1024) {
          // Mobilde sidebar'ı kapatmak için custom event gönder
          window.dispatchEvent(new CustomEvent('closeSidebar'))
        }
      }}
      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActuallyActive
          ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
      }`}
    >
      <Icon
        className={`mr-3 h-5 w-5 flex-shrink-0 ${
          isActuallyActive
            ? 'text-blue-500 dark:text-blue-400'
            : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
        }`}
      />
      <span className="flex-1">{name}</span>
      {badge && (
        <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {badge}
        </span>
      )}
      {isActuallyActive && (
        <ChevronRight className="ml-auto h-4 w-4 text-blue-500 dark:text-blue-400" />
      )}
    </Link>
  )
}
