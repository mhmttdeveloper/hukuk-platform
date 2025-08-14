'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Settings, Save, Globe, Shield, Database, Bell, Users, 
  FileText, BookOpen, Gavel, CheckCircle, AlertCircle
} from 'lucide-react'

interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    contactEmail: string
    maintenanceMode: boolean
    allowRegistration: boolean
    requireEmailVerification: boolean
  }
  content: {
    maxFileSize: number
    allowedFileTypes: string[]
    autoApprovePublications: boolean
    requireModeration: boolean
    maxTagsPerPublication: number
    allowComments: boolean
    moderateComments: boolean
  }
  security: {
    sessionTimeout: number
    maxLoginAttempts: number
    requireStrongPasswords: boolean
    enableTwoFactor: boolean
    allowSocialLogin: boolean
    ipWhitelist: string[]
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    adminAlerts: boolean
    userWelcomeEmail: boolean
    publicationApprovalEmail: boolean
  }
}

const defaultSettings: SystemSettings = {
  general: {
    siteName: 'Hukuk Platformu',
    siteDescription: 'Türkiye\'nin en kapsamlı hukuk bilgi platformu',
    siteUrl: 'https://hukuk-platformu.com',
    contactEmail: 'info@hukuk-platformu.com',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true
  },
  content: {
    maxFileSize: 10, // MB
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    autoApprovePublications: false,
    requireModeration: true,
    maxTagsPerPublication: 10,
    allowComments: true,
    moderateComments: true
  },
  security: {
    sessionTimeout: 24, // hours
    maxLoginAttempts: 5,
    requireStrongPasswords: true,
    enableTwoFactor: false,
    allowSocialLogin: false,
    ipWhitelist: []
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    adminAlerts: true,
    userWelcomeEmail: true,
    publicationApprovalEmail: true
  }
}

export default function AdminSettingsPage() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveMessage('Ayarlar başarıyla kaydedildi!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Ayarlar kaydedilirken hata oluştu!')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const tabs = [
    { id: 'general', name: 'Genel', icon: Globe },
    { id: 'content', name: 'İçerik', icon: FileText },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'notifications', name: 'Bildirimler', icon: Bell }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sistem Ayarları
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Platform ayarlarını yapılandırın ve yönetin
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes('başarıyla') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Genel Ayarlar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Adı
                </label>
                <input
                  type="text"
                  value={settings.general.siteName}
                  onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  value={settings.general.siteUrl}
                  onChange={(e) => updateSetting('general', 'siteUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Açıklaması
                </label>
                <textarea
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İletişim E-posta
                </label>
                <input
                  type="email"
                  value={settings.general.contactEmail}
                  onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Bakım Modu (Site sadece yöneticiler için erişilebilir)
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.general.allowRegistration}
                  onChange={(e) => updateSetting('general', 'allowRegistration', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Yeni kullanıcı kayıtlarına izin ver
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.general.requireEmailVerification}
                  onChange={(e) => updateSetting('general', 'requireEmailVerification', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  E-posta doğrulaması zorunlu
                </span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">İçerik Ayarları</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maksimum Dosya Boyutu (MB)
                </label>
                <input
                  type="number"
                  value={settings.content.maxFileSize}
                  onChange={(e) => updateSetting('content', 'maxFileSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maksimum Etiket Sayısı
                </label>
                <input
                  type="number"
                  value={settings.content.maxTagsPerPublication}
                  onChange={(e) => updateSetting('content', 'maxTagsPerPublication', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İzin Verilen Dosya Türleri
                </label>
                <input
                  type="text"
                  value={settings.content.allowedFileTypes.join(', ')}
                  onChange={(e) => updateSetting('content', 'allowedFileTypes', e.target.value.split(',').map(t => t.trim()))}
                  placeholder="pdf, doc, docx, jpg, png"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.content.autoApprovePublications}
                  onChange={(e) => updateSetting('content', 'autoApprovePublications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Yayınları otomatik onayla
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.content.requireModeration}
                  onChange={(e) => updateSetting('content', 'requireModeration', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Yayınlar için moderasyon gerekli
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.content.allowComments}
                  onChange={(e) => updateSetting('content', 'allowComments', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Yorumlara izin ver
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.content.moderateComments}
                  onChange={(e) => updateSetting('content', 'moderateComments', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Yorumları moderasyon gerektir
                </span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Güvenlik Ayarları</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Oturum Zaman Aşımı (Saat)
                </label>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maksimum Giriş Denemesi
                </label>
                <input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  IP Beyaz Listesi
                </label>
                <textarea
                  value={settings.security.ipWhitelist.join('\n')}
                  onChange={(e) => updateSetting('security', 'ipWhitelist', e.target.value.split('\n').filter(ip => ip.trim()))}
                  rows={3}
                  placeholder="Her satıra bir IP adresi"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.requireStrongPasswords}
                  onChange={(e) => updateSetting('security', 'requireStrongPasswords', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Güçlü şifre zorunluluğu
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.enableTwoFactor}
                  onChange={(e) => updateSetting('security', 'enableTwoFactor', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  İki faktörlü kimlik doğrulama
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.security.allowSocialLogin}
                  onChange={(e) => updateSetting('security', 'allowSocialLogin', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Sosyal medya ile giriş
                </span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bildirim Ayarları</h3>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  E-posta bildirimleri
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Push bildirimleri
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.adminAlerts}
                  onChange={(e) => updateSetting('notifications', 'adminAlerts', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Yönetici uyarıları
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.userWelcomeEmail}
                  onChange={(e) => updateSetting('notifications', 'userWelcomeEmail', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Kullanıcı karşılama e-postası
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifications.publicationApprovalEmail}
                  onChange={(e) => updateSetting('notifications', 'publicationApprovalEmail', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Yayın onay e-postası
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
