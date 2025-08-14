'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Bell, CheckCircle, AlertCircle, Info, X, Trash2, Filter, Calendar } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  date: string
  isRead: boolean
  isImportant: boolean
  actionUrl?: string
  actionText?: string
}

export default function NotificationsPage() {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for notifications
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Yorum Onaylandı',
      message: 'İş Hukukunda İş Güvencesi makalesine yaptığınız yorum onaylandı.',
      type: 'success',
      date: '2024-08-13T10:30:00',
      isRead: false,
      isImportant: true,
      actionUrl: '/articles/1',
      actionText: 'Makaleyi Görüntüle'
    },
    {
      id: '2',
      title: 'Yeni Takipçi',
      message: 'Ahmet Yılmaz sizi takip etmeye başladı.',
      type: 'info',
      date: '2024-08-13T09:15:00',
      isRead: false,
      isImportant: false,
      actionUrl: '/profile/ahmet-yilmaz',
      actionText: 'Profili Görüntüle'
    },
    {
      id: '3',
      title: 'Makale Güncellendi',
      message: 'Ticari Sözleşmelerde Cayma Hakkı makaleniz güncellendi ve yayınlandı.',
      type: 'success',
      date: '2024-08-12T16:45:00',
      isRead: true,
      isImportant: false,
      actionUrl: '/articles/2',
      actionText: 'Makaleyi Görüntüle'
    },
    {
      id: '4',
      title: 'Sistem Bakımı',
      message: 'Sistem bakımı nedeniyle 14 Ağustos 02:00-04:00 saatleri arasında hizmet verilemeyecektir.',
      type: 'warning',
      date: '2024-08-12T14:20:00',
      isRead: true,
      isImportant: true
    },
    {
      id: '5',
      title: 'Yorum Yanıtı',
      message: 'Ceza Hukukunda Kusur makalesine yaptığınız yoruma Mehmet Kaya yanıt verdi.',
      type: 'info',
      date: '2024-08-12T11:30:00',
      isRead: false,
      isImportant: false,
      actionUrl: '/articles/4',
      actionText: 'Yanıtı Görüntüle'
    },
    {
      id: '6',
      title: 'Haftalık Rapor',
      message: 'Bu hafta makaleleriniz 1,250 kez görüntülendi ve 45 yorum aldı.',
      type: 'info',
      date: '2024-08-11T08:00:00',
      isRead: true,
      isImportant: false
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications)
      setFilteredNotifications(mockNotifications)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = notifications

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(notification => notification.type === selectedType)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'unread') {
        filtered = filtered.filter(notification => !notification.isRead)
      } else if (selectedStatus === 'important') {
        filtered = filtered.filter(notification => notification.isImportant)
      }
    }

    setFilteredNotifications(filtered)
  }, [selectedType, selectedStatus, notifications])

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value)
  }

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ))
    } catch (error) {
      console.error('Bildirim güncellenirken hata:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })))
      alert('Tüm bildirimler okundu olarak işaretlendi!')
    } catch (error) {
      console.error('Bildirimler güncellenirken hata:', error)
      alert('Bildirimler güncellenirken bir hata oluştu.')
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
    } catch (error) {
      console.error('Bildirim silinirken hata:', error)
      alert('Bildirim silinirken bir hata oluştu.')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'error':
        return <X className="w-5 h-5 text-red-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'success':
        return 'Başarılı'
      case 'warning':
        return 'Uyarı'
      case 'error':
        return 'Hata'
      default:
        return 'Bilgi'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Erişim Reddedildi
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Bu sayfaya erişim için giriş yapmanız gerekmektedir.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
  const importantCount = notifications.filter(n => n.isImportant).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Bildirimlerim
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Platform aktiviteleriniz ve önemli güncellemeler hakkında bilgi alın
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <Bell className="mx-auto h-8 w-8 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Toplam Bildirim</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{unreadCount}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Okunmamış</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{importantCount}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Önemli</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="md:w-48">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tür Filtresi
            </label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={handleTypeFilter}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Türler</option>
              <option value="info">Bilgi</option>
              <option value="success">Başarılı</option>
              <option value="warning">Uyarı</option>
              <option value="error">Hata</option>
            </select>
          </div>
          <div className="md:w-48">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Durum Filtresi
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={handleStatusFilter}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="unread">Okunmamış</option>
              <option value="important">Önemli</option>
            </select>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Tümünü Okundu İşaretle
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Bildirim bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Seçilen kriterlere uygun bildirim bulunamadı.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 ${
                notification.isRead ? 'border-gray-300 dark:border-gray-600' : 'border-blue-500'
              }`}
            >
              <div className="space-y-4">
                {/* Notification Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(notification.type)}
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(notification.type)}`}>
                        {getTypeText(notification.type)}
                      </span>
                      {notification.isImportant && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Önemli
                        </span>
                      )}
                      {!notification.isRead && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Yeni
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        title="Okundu İşaretle"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notification Content */}
                <div>
                  <h3 className={`text-lg font-semibold mb-2 ${
                    notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                  }`}>
                    {notification.title}
                  </h3>
                  <p className={`text-gray-600 dark:text-gray-400 ${
                    notification.isRead ? 'opacity-75' : ''
                  }`}>
                    {notification.message}
                  </p>
                </div>

                {/* Action Button */}
                {notification.actionUrl && notification.actionText && (
                  <div>
                    <a
                      href={notification.actionUrl}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      {notification.actionText}
                    </a>
                  </div>
                )}

                {/* Notification Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(notification.date).toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
