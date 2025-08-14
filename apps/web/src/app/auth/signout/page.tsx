'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, CheckCircle, AlertCircle } from 'lucide-react'

export default function SignOutPage() {
  const { logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const performLogout = async () => {
      try {
        setIsLoggingOut(true)
        await logout()
        
        // Başarılı çıkış sonrası kısa bir bekleme
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } catch (err) {
        setError('Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.')
        setIsLoggingOut(false)
      }
    }

    performLogout()
  }, [logout, router])

  if (isLoggingOut) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Çıkış Yapılıyor...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Güvenli bir şekilde çıkış yapılıyor, lütfen bekleyin.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Hata Oluştu
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Tekrar Dene
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Başarıyla Çıkış Yapıldı
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Güvenli bir şekilde çıkış yapıldı. Ana sayfaya yönlendiriliyorsunuz...
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            <LogOut className="h-4 w-4 mr-2" />
            Oturum sonlandırıldı
          </div>
        </div>
      </div>
    </div>
  )
}
