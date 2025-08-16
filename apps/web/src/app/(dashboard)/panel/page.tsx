'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  FileText, 
  BookOpen, 
  Gavel, 
  MessageSquare, 
  Users, 
  Eye, 
  TrendingUp, 
  Calendar,
  Plus,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  publications: number
  laws: number
  cases: number
  comments: number
  views: number
  lastActivity: string
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    publications: 0,
    laws: 0,
    cases: 0,
    comments: 0,
    views: 0,
    lastActivity: ''
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats()
    }
  }, [isAuthenticated])

  const fetchDashboardStats = async () => {
    try {
      // Simüle edilmiş veri
      const mockStats: DashboardStats = {
        publications: user?.role === 'ADMIN' ? 156 : user?.role === 'EDITOR' ? 89 : user?.role === 'AUTHOR' ? 23 : 0,
        laws: user?.role === 'ADMIN' ? 89 : user?.role === 'EDITOR' ? 45 : user?.role === 'AUTHOR' ? 12 : 0,
        cases: user?.role === 'ADMIN' ? 234 : user?.role === 'EDITOR' ? 123 : user?.role === 'AUTHOR' ? 34 : 0,
        comments: user?.role === 'ADMIN' ? 567 : user?.role === 'EDITOR' ? 234 : user?.role === 'AUTHOR' ? 89 : 12,
        views: user?.role === 'ADMIN' ? 15420 : user?.role === 'EDITOR' ? 8920 : user?.role === 'AUTHOR' ? 3450 : 120,
        lastActivity: '2024-08-13T10:30:00'
      }
      
      setStats(mockStats)
      setIsLoading(false)
    } catch (error) {
      console.error('Dashboard istatistikleri getirilemedi:', error)
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hoş geldin, {user?.name} {user?.surname}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              YargıTam'da bugün neler yapmak istiyorsunuz?
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Son aktivite</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Yayınlar</dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.publications}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Kanunlar</dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.laws}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
                <Gavel className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Kararlar</dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.cases}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-md flex items-center justify-center">
                <Eye className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Görüntülenme</dt>
                <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.views.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Hızlı İşlemler</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(user?.role === 'ADMIN' || user?.role === 'EDITOR' || user?.role === 'AUTHOR') && (
              <Link
                href="/dashboard/publications/new"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Yeni Yayın</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Yeni bir yayın oluştur</p>
                </div>
              </Link>
            )}

            {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
              <Link
                href="/editor/publications"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Yayın Onayları</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bekleyen yayınları incele</p>
                </div>
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link
                href="/admin/users"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Kullanıcı Yönetimi</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kullanıcıları yönet</p>
                </div>
              </Link>
            )}

            <Link
              href="/dashboard/comments"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
                <MessageSquare className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Yorumlarım</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Yorumlarını görüntüle</p>
              </div>
            </Link>

            <Link
              href="/profile"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Profil</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Profil bilgilerini düzenle</p>
              </div>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Ayarlar</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hesap ayarlarını yap</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Son Aktiviteler</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Yeni yayın</span> oluşturuldu
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 saat önce</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Yorum</span> yapıldı
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5 saat önce</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">Yayın</span> görüntülendi
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 gün önce</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
