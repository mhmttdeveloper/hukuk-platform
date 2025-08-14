'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Listen for close sidebar event
  useEffect(() => {
    const handleCloseSidebar = () => setIsSidebarOpen(false)
    window.addEventListener('closeSidebar', handleCloseSidebar)
    return () => window.removeEventListener('closeSidebar', handleCloseSidebar)
  }, [])

  return (
    <>
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Sidebar isMobileOpen={isSidebarOpen} />
      <main className="pt-16 pl-0 lg:pl-64 min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </>
  )
}
