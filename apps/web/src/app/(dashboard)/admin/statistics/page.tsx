'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  BarChart3, TrendingUp, Users, FileText, MessageSquare, Eye, ThumbsUp,
  Calendar, Download, Filter, RefreshCw, Activity, Target, Award
} from 'lucide-react'

interface PlatformStats {
  overview: {
    totalUsers: number
    totalPublications: number
    totalComments: number
    totalViews: number
    totalLikes: number
    activeUsers: number
  }
  publications: {
    byStatus: { status: string; count: number }[]
    byCategory: { category: string; count: number }[]
    byMonth: { month: string; count: number }[]
    topPerforming: { title: string; views: number; likes: number; comments: number }[]
  }
  users: {
    byRole: { role: string; count: number }[]
    byVerification: { status: string; count: number }[]
    newRegistrations: { date: string; count: number }[]
    activeUsers: { date: string; count: number }[]
  }
  engagement: {
    commentsByMonth: { month: string; count: number }[]
    viewsByMonth: { month: string; count: number }[]
    likesByMonth: { month: string; count: number }[]
    topCategories: { category: string; engagement: number }[]
  }
  performance: {
    pageLoadTime: number
    serverResponseTime: number
    uptime: number
    errorRate: number
  }
}

const mockStats: PlatformStats = {
  overview: {
    totalUsers: 1247,
    totalPublications: 89,
    totalComments: 456,
    totalViews: 15678,
    totalLikes: 2341,
    activeUsers: 89
  },
  publications: {
    byStatus: [
      { status: 'Yayınlandı', count: 67 },
      { status: 'Beklemede', count: 12 },
      { status: 'Reddedildi', count: 8 },
      { status: 'Taslak', count: 2 }
    ],
    byCategory: [
      { category: 'Borçlar Hukuku', count: 23 },
      { category: 'Ceza Hukuku', count: 18 },
      { category: 'İş Hukuku', count: 15 },
      { category: 'Ticaret Hukuku', count: 12 },
      { category: 'Aile Hukuku', count: 8 },
      { category: 'Diğer', count: 13 }
    ],
    byMonth: [
      { month: 'Ocak', count: 8 },
      { month: 'Şubat', count: 12 },
      { month: 'Mart', count: 15 },
      { month: 'Nisan', count: 18 },
      { month: 'Mayıs', count: 22 },
      { month: 'Haziran', count: 14 }
    ],
    topPerforming: [
      { title: 'Türk Borçlar Kanunu Kapsamında Sözleşme Hukuku', views: 1250, likes: 89, comments: 23 },
      { title: 'Ceza Hukukunda Kusur Unsuru ve Sorumluluk', views: 980, likes: 67, comments: 18 },
      { title: 'İş Hukukunda İşçi Hakları ve Koruması', views: 856, likes: 54, comments: 15 },
      { title: 'Ticaret Hukukunda Şirket Türleri ve Kuruluş', views: 734, likes: 43, comments: 12 }
    ]
  },
  users: {
    byRole: [
      { role: 'Üye', count: 892 },
      { role: 'Yazar', count: 234 },
      { role: 'Editör', count: 89 },
      { role: 'Yönetici', count: 32 }
    ],
    byVerification: [
      { status: 'Doğrulanmış', count: 567 },
      { status: 'Beklemede', count: 234 },
      { status: 'Reddedildi', count: 89 }
    ],
    newRegistrations: [
      { date: '2024-01', count: 45 },
      { date: '2024-02', count: 67 },
      { date: '2024-03', count: 89 },
      { date: '2024-04', count: 123 },
      { date: '2024-05', count: 156 },
      { date: '2024-06', count: 134 }
    ],
    activeUsers: [
      { date: '2024-01', count: 234 },
      { date: '2024-02', count: 267 },
      { date: '2024-03', count: 289 },
      { date: '2024-04', count: 323 },
      { date: '2024-05', count: 356 },
      { date: '2024-06', count: 334 }
    ]
  },
  engagement: {
    commentsByMonth: [
      { month: 'Ocak', count: 34 },
      { month: 'Şubat', count: 45 },
      { month: 'Mart', count: 67 },
      { month: 'Nisan', count: 89 },
      { month: 'Mayıs', count: 123 },
      { month: 'Haziran', count: 98 }
    ],
    viewsByMonth: [
      { month: 'Ocak', count: 1234 },
      { month: 'Şubat', count: 1567 },
      { month: 'Mart', count: 1890 },
      { month: 'Nisan', count: 2234 },
      { month: 'Mayıs', count: 2678 },
      { month: 'Haziran', count: 2345 }
    ],
    likesByMonth: [
      { month: 'Ocak', count: 123 },
      { month: 'Şubat', count: 156 },
      { month: 'Mart', count: 189 },
      { month: 'Nisan', count: 223 },
      { month: 'Mayıs', count: 267 },
      { month: 'Haziran', count: 234 }
    ],
    topCategories: [
      { category: 'Borçlar Hukuku', engagement: 89 },
      { category: 'Ceza Hukuku', engagement: 76 },
      { category: 'İş Hukuku', engagement: 67 },
      { category: 'Ticaret Hukuku', engagement: 54 },
      { category: 'Aile Hukuku', engagement: 43 }
    ]
  },
  performance: {
    pageLoadTime: 1.2,
    serverResponseTime: 0.3,
    uptime: 99.8,
    errorRate: 0.2
  }
}

export default function AdminStatisticsPage() {
  const { user, isAuthenticated, isAdmin, isEditor } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<PlatformStats>(mockStats)
  const [timeRange, setTimeRange] = useState('6months')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && !isAdmin && !isEditor) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isAdmin, isEditor, router])

  if (!isAuthenticated || (!isAdmin && !isEditor)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExport = () => {
    // Simulate export functionality
    alert('İstatistikler dışa aktarılıyor...')
  }

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return 'text-green-600'
    if (engagement >= 60) return 'text-yellow-600'
    if (engagement >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getPerformanceColor = (value: number, type: 'time' | 'uptime' | 'error') => {
    if (type === 'time') {
      if (value <= 1) return 'text-green-600'
      if (value <= 2) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'uptime') {
      if (value >= 99.5) return 'text-green-600'
      if (value >= 99) return 'text-yellow-600'
      return 'text-red-600'
    }
    if (type === 'error') {
      if (value <= 0.5) return 'text-green-600'
      if (value <= 1) return 'text-yellow-600'
      return 'text-red-600'
    }
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Platform İstatistikleri
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Platform performansı ve kullanıcı etkileşimi hakkında detaylı analizler
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="1month">Son 1 Ay</option>
            <option value="3months">Son 3 Ay</option>
            <option value="6months">Son 6 Ay</option>
            <option value="1year">Son 1 Yıl</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4" />
            <span>Dışa Aktar</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overview.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Kullanıcı</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overview.totalPublications.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Yayın</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overview.totalComments.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Yorum</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overview.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Görüntüleme</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <ThumbsUp className="w-8 h-8 text-pink-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overview.totalLikes.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Beğeni</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-indigo-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overview.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Aktif Kullanıcı</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publications by Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Yayın Durumları
          </h3>
          <div className="space-y-3">
            {stats.publications.byStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.status}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.count / Math.max(...stats.publications.byStatus.map(s => s.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Publications by Category */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Yayın Kategorileri
          </h3>
          <div className="space-y-3">
            {stats.publications.byCategory.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(item.count / Math.max(...stats.publications.byCategory.map(c => c.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Roles */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Kullanıcı Rolleri
          </h3>
          <div className="space-y-3">
            {stats.users.byRole.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.role}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(item.count / Math.max(...stats.users.byRole.map(r => r.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Publications */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            En İyi Performans Gösteren Yayınlar
          </h3>
          <div className="space-y-3">
            {stats.publications.topPerforming.map((item, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">
                  {item.title}
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>👁️ {item.views}</span>
                  <span>👍 {item.likes}</span>
                  <span>💬 {item.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Sistem Performansı
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(stats.performance.pageLoadTime, 'time')}`}>
              {stats.performance.pageLoadTime}s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sayfa Yükleme</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(stats.performance.serverResponseTime, 'time')}`}>
              {stats.performance.serverResponseTime}s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sunucu Yanıt</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(stats.performance.uptime, 'uptime')}`}>
              %{stats.performance.uptime}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Çalışma Süresi</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getPerformanceColor(stats.performance.errorRate, 'error')}`}>
              %{stats.performance.errorRate}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hata Oranı</div>
          </div>
        </div>
      </div>

      {/* Engagement Analytics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Kategori Etkileşim Oranları
        </h3>
        <div className="space-y-3">
          {stats.engagement.topCategories.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.category}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${item.engagement}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium w-12 text-right ${getEngagementColor(item.engagement)}`}>
                  %{item.engagement}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
