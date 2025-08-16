'use client'

import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/AuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { VisitorSidebar } from "@/components/layout/VisitorSidebar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Server-side rendering sırasında basit layout döndür
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="content-container py-6">
          {children}
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Kullanıcı giriş yapmışsa kullanıcı modu sidebar'ı, yapmamışsa ziyaretçi modu sidebar'ı */}
      {isAuthenticated ? (
        <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      ) : (
        <VisitorSidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      )}
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 z-[100]">
        <div className="content-container py-6">
          {children}
        </div>
      </main>
    </>
  )
}
