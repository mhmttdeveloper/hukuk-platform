'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Varsayılan olarak açık
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Server-side rendering sırasında basit layout döndür
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="pt-16">
          <div className="content-container py-6">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
        <div className="content-container py-6">
          {children}
        </div>
      </main>
    </>
  )
}
