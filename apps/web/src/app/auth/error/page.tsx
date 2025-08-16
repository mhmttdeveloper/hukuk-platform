'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'CredentialsSignin':
        return 'E-posta veya şifre hatalı. Lütfen bilgilerinizi kontrol edin.'
      case 'VerificationRequired':
        return 'Hesabınız henüz doğrulanmamış. Lütfen admin ile iletişime geçin.'
      case 'AccessDenied':
        return 'Bu sayfaya erişim yetkiniz bulunmuyor.'
      default:
        return 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Giriş Hatası
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Giriş Sayfasına Dön
          </Link>

          <Link
            href="/"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sorun devam ederse lütfen destek ekibi ile iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  )
}
