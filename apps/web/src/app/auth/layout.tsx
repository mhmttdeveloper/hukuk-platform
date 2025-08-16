'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/contexts/AuthContext"
import { Navbar } from "@/components/layout/Navbar"
import { VisitorSidebar } from "@/components/layout/VisitorSidebar"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Eğer kullanıcı giriş yapmışsa ana sayfaya yönlendir
    if (mounted && isAuthenticated) {
      router.push('/')
    }
  }, [mounted, isAuthenticated, router])

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

  // Eğer kullanıcı giriş yapmışsa loading göster
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yönlendiriliyor...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <VisitorSidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
        <div className="content-container py-6">
          {children}
        </div>
      </main>
    </>
  )
}
