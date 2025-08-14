'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Database, Download, Upload, RefreshCw, Trash2, Settings, Activity,
  HardDrive, Clock, AlertTriangle, CheckCircle, XCircle, Info,
  Play, Pause, RotateCcw, Shield, Lock, Unlock
} from 'lucide-react'

interface DatabaseStats {
  size: string
  tables: number
  records: number
  connections: number
  uptime: string
  version: string
  lastBackup: string
  lastOptimization: string
}

interface TableInfo {
  name: string
  records: number
  size: string
  status: 'active' | 'optimized' | 'needs_optimization'
  lastUpdated: string
}

interface BackupInfo {
  id: string
  filename: string
  size: string
  createdAt: string
  status: 'completed' | 'in_progress' | 'failed'
  type: 'full' | 'incremental' | 'schema_only'
}

const mockDatabaseStats: DatabaseStats = {
  size: '2.4 GB',
  tables: 24,
  records: 156789,
  connections: 12,
  uptime: '15 gün 8 saat',
  version: 'PostgreSQL 15.4',
  lastBackup: '2024-08-14 02:00:00',
  lastOptimization: '2024-08-10 03:00:00'
}

const mockTables: TableInfo[] = [
  { name: 'users', records: 1247, size: '45.2 MB', status: 'active', lastUpdated: '2024-08-14 15:30:00' },
  { name: 'publications', records: 89, size: '12.8 MB', status: 'optimized', lastUpdated: '2024-08-14 14:20:00' },
  { name: 'comments', records: 456, size: '8.9 MB', status: 'active', lastUpdated: '2024-08-14 16:45:00' },
  { name: 'ratings', records: 234, size: '3.2 MB', status: 'needs_optimization', lastUpdated: '2024-08-14 13:15:00' },
  { name: 'legislation', records: 156, size: '25.6 MB', status: 'active', lastUpdated: '2024-08-14 12:00:00' },
  { name: 'jurisprudence', records: 89, size: '18.7 MB', status: 'optimized', lastUpdated: '2024-08-14 11:30:00' }
]

const mockBackups: BackupInfo[] = [
  { id: '1', filename: 'backup_2024_08_14_020000.sql', size: '2.1 GB', createdAt: '2024-08-14 02:00:00', status: 'completed', type: 'full' },
  { id: '2', filename: 'backup_2024_08_13_020000.sql', size: '2.0 GB', createdAt: '2024-08-13 02:00:00', status: 'completed', type: 'full' },
  { id: '3', filename: 'backup_2024_08_12_020000.sql', size: '1.9 GB', createdAt: '2024-08-12 02:00:00', status: 'completed', type: 'full' },
  { id: '4', filename: 'incremental_2024_08_14_120000.sql', size: '45 MB', createdAt: '2024-08-14 12:00:00', status: 'completed', type: 'incremental' },
  { id: '5', filename: 'schema_2024_08_14_180000.sql', size: '2.3 MB', createdAt: '2024-08-14 18:00:00', status: 'completed', type: 'schema_only' }
]

export default function AdminDatabasePage() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DatabaseStats>(mockDatabaseStats)
  const [tables, setTables] = useState<TableInfo[]>(mockTables)
  const [backups, setBackups] = useState<BackupInfo[]>(mockBackups)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<string>('')
  const [isBackupInProgress, setIsBackupInProgress] = useState(false)
  const [isOptimizationInProgress, setIsOptimizationInProgress] = useState(false)

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

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleCreateBackup = async () => {
    setIsBackupInProgress(true)
    // Simulate backup process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newBackup: BackupInfo = {
      id: Date.now().toString(),
      filename: `backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '_')}.sql`,
      size: '2.2 GB',
      createdAt: new Date().toISOString(),
      status: 'completed',
      type: 'full'
    }
    
    setBackups(prev => [newBackup, ...prev])
    setIsBackupInProgress(false)
  }

  const handleOptimizeTable = async (tableName: string) => {
    setIsOptimizationInProgress(true)
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setTables(prev => prev.map(table => 
      table.name === tableName 
        ? { ...table, status: 'optimized' as const }
        : table
    ))
    setIsOptimizationInProgress(false)
  }

  const handleDeleteBackup = async (backupId: string) => {
    if (confirm('Bu yedeği silmek istediğinizden emin misiniz?')) {
      setBackups(prev => prev.filter(backup => backup.id !== backupId))
    }
  }

  const handleRestoreBackup = async (backupId: string) => {
    if (confirm('Bu yedeği geri yüklemek istediğinizden emin misiniz? Bu işlem mevcut verileri değiştirecektir.')) {
      // Simulate restore process
      alert('Yedek geri yükleniyor... Bu işlem birkaç dakika sürebilir.')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'optimized':
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      case 'needs_optimization':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif'
      case 'optimized':
        return 'Optimize Edildi'
      case 'needs_optimization':
        return 'Optimizasyon Gerekli'
      default:
        return 'Bilinmiyor'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'optimized':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'needs_optimization':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getBackupStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Info className="w-4 h-4 text-gray-600" />
    }
  }

  const getBackupStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı'
      case 'in_progress':
        return 'Devam Ediyor'
      case 'failed':
        return 'Başarısız'
      default:
        return 'Bilinmiyor'
    }
  }

  const getBackupTypeText = (type: string) => {
    switch (type) {
      case 'full':
        return 'Tam Yedek'
      case 'incremental':
        return 'Artırımlı Yedek'
      case 'schema_only':
        return 'Sadece Şema'
      default:
        return 'Bilinmiyor'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Veritabanı Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Veritabanı performansını izleyin, yedek alın ve optimize edin
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
          <button
            onClick={handleCreateBackup}
            disabled={isBackupInProgress}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isBackupInProgress ? 'Yedek Alınıyor...' : 'Yedek Al'}</span>
          </button>
        </div>
      </div>

      {/* Database Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <HardDrive className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.size}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Boyut</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Database className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.tables}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tablo Sayısı</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.connections}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Aktif Bağlantı</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.uptime}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Çalışma Süresi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Veritabanı Bilgileri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Veritabanı Versiyonu</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{stats.version}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Kayıt</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{stats.records.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Son Yedek</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{stats.lastBackup}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Son Optimizasyon</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">{stats.lastOptimization}</div>
          </div>
        </div>
      </div>

      {/* Tables Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Tablo Yönetimi
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tablo Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kayıt Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Boyut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Son Güncelleme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tables.map((table) => (
                <tr key={table.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{table.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{table.records.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{table.size}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(table.status)}`}>
                      {getStatusIcon(table.status)}
                      <span className="ml-1">{getStatusText(table.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{table.lastUpdated}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {table.status === 'needs_optimization' && (
                        <button
                          onClick={() => handleOptimizeTable(table.name)}
                          disabled={isOptimizationInProgress}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg disabled:opacity-50"
                          title="Optimize Et"
                        >
                          <RefreshCw className={`w-4 h-4 ${isOptimizationInProgress ? 'animate-spin' : ''}`} />
                        </button>
                      )}
                      <button
                        onClick={() => alert(`${table.name} tablosu için detaylı bilgi`)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
                        title="Detaylar"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backups Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Yedek Yönetimi
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Yedek Dosyası
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Boyut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tür
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{backup.filename}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{backup.size}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border-blue-200">
                      {getBackupTypeText(backup.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      backup.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                      backup.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {getBackupStatusIcon(backup.status)}
                      <span className="ml-1">{getBackupStatusText(backup.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{backup.createdAt}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRestoreBackup(backup.id)}
                        disabled={backup.status !== 'completed'}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg disabled:opacity-50"
                        title="Geri Yükle"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`${backup.filename} indiriliyor...`)}
                        disabled={backup.status !== 'completed'}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg disabled:opacity-50"
                        title="İndir"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBackup(backup.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Bakım İşlemleri
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => alert('Veritabanı analizi başlatılıyor...')}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">Veritabanı Analizi</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => alert('Tüm tablolar optimize ediliyor...')}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">Tüm Tabloları Optimize Et</span>
              <RefreshCw className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={() => alert('Gereksiz veriler temizleniyor...')}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">Gereksiz Verileri Temizle</span>
              <Trash2 className="w-4 h-4 text-orange-600" />
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Güvenlik
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => alert('Veritabanı erişim logları kontrol ediliyor...')}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">Erişim Logları</span>
              <Lock className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => alert('Şifreleme durumu kontrol ediliyor...')}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">Şifreleme Durumu</span>
              <Shield className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={() => alert('Güvenlik açıkları taranıyor...')}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">Güvenlik Taraması</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
