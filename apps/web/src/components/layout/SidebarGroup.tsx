'use client'

interface SidebarGroupProps {
  title: string
  children: React.ReactNode
}

export function SidebarGroup({ title, children }: SidebarGroupProps) {
  return (
    <div className="space-y-1">
      {/* Group Header */}
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      
      {/* Group Items */}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}
