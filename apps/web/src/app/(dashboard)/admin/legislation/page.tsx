'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  BookOpen, Plus, Search, Filter, Eye, Edit, Trash2,
  CheckCircle, Clock, XCircle, AlertCircle, Calendar, FileText
} from 'lucide-react'

interface Legislation {
  id: string
  title: string
  lawNumber: string
  publishedDate: string
  effectiveDate: string
  status: 'active' | 'amended' | 'repealed' | 'draft'
  category: string
  description: string
  lastUpdated: string
  views: number
  downloads: number
}

const mockLegislation: Legislation[] = [
  {
    id: '1',
    title: 'Türk Borçlar Kanunu',
    lawNumber: '6098',
    publishedDate: '2011-02-11',
    effectiveDate: '2012-07-01',
    status: 'active',
    category: 'Borçlar Hukuku',
    description: 'Türk Borçlar Kanunu, borçlar hukukunun temel ilkelerini ve kurallarını düzenler.',
    lastUpdated: '2024-08-14',
    views: 1250,
    downloads: 89
  },
  {
    id: '2',
    title: 'Türk Ceza Kanunu',
    lawNumber: '5237',
    publishedDate: '2004-09-26',
    effectiveDate: '2005-06-01',
    status: 'active',
    category: 'Ceza Hukuku',
    description: 'Türk Ceza Kanunu, suç ve cezaların genel hükümlerini düzenler.',
    lastUpdated: '2024-08-13',
    views: 980,
    downloads: 67
  },
  {
    id: '3',
    title: 'İş Kanunu',
    lawNumber: '4857',
    publishedDate: '2003-05-22',
    effectiveDate: '2003-06-10',
    status: 'active',
    category: 'İş Hukuku',
    description: 'İş Kanunu, işçi ve işveren arasındaki iş ilişkilerini düzenler.',
    lastUpdated: '2024-08-12',
    views: 756,
    downloads: 45
  },
  {
    id: '4',
    title: 'Ticaret Kanunu',
    lawNumber: '6102',
    publishedDate: '2011-01-14',
    effectiveDate: '2012-07-01',
    status: 'active',
    category: 'Ticaret Hukuku',
    description: 'Ticaret Kanunu, ticari işletmeler ve ticari işlemleri düzenler.',
    lastUpdated: '2024-08-11',
    views: 634,
    downloads: 38
  },
  {
    id: '5',
    title: 'Aile Hukuku Kanunu',
    lawNumber: '4721',
    publishedDate: '2001-11-22',
    effectiveDate: '2002-01-01',
    status: 'amended',
    category: 'Aile Hukuku',
    description: 'Aile Hukuku Kanunu, aile ilişkilerini ve evlilik hukukunu düzenler.',
    lastUpdated: '2024-08-10',
    views: 445,
    downloads: 29
  }
]

export default function AdminLegislationPage() {
  const { user, isAuthenticated, isAdmin, isEditor } = useAuth()
  const router = useRouter()
  const [legislation, setLegislation] = useState<Legislation[]>(mockLegislation)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

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

  const filteredLegislation = legislation.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.lawNumber.includes(searchTerm) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'amended':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'repealed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'draft':
        return <Clock className="w-4 h-4 text-gray-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Yürürlükte'
      case 'amended':
        return 'Değiştirildi'
      case 'repealed':
        return 'Yürürlükten Kaldırıldı'
      case 'draft':
        return 'Taslak'
      default:
        return 'Bilinmiyor'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'amended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'repealed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleView = (id: string) => {
    router.push(`/admin/legislation/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/legislation/${id}/edit`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bu mevzuatı silmek istediğinizden emin misiniz?')) {
      setLegislation(prev => prev.filter(item => item.id !== id))
    }
  }

  const stats = {
    total: legislation.length,
    active: legislation.filter(item => item.status === 'active').length,
    amended: legislation.filter(item => item.status === 'amended').length,
    repealed: legislation.filter(item => item.status === 'repealed').length,
    draft: legislation.filter(item => item.status === 'draft').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mevzuat Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm mevzuatları yönetin, düzenleyin ve güncelleyin
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/legislation/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Mevzuat</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Yürürlükte</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">{stats.amended}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Değiştirildi</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">{stats.repealed}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Yürürlükten Kaldırıldı</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Taslak</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Mevzuat başlığı, numarası veya açıklama ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Yürürlükte</option>
              <option value="amended">Değiştirildi</option>
              <option value="repealed">Yürürlükten Kaldırıldı</option>
              <option value="draft">Taslak</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="Borçlar Hukuku">Borçlar Hukuku</option>
              <option value="Ceza Hukuku">Ceza Hukuku</option>
              <option value="İş Hukuku">İş Hukuku</option>
              <option value="Ticaret Hukuku">Ticaret Hukuku</option>
              <option value="Aile Hukuku">Aile Hukuku</option>
            </select>
          </div>
        </div>
      </div>

      {/* Legislation Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mevzuat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kanun No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tarihler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İstatistikler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLegislation.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.lawNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{getStatusText(item.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>Yayın: {new Date(item.publishedDate).toLocaleDateString('tr-TR')}</div>
                      <div>Yürürlük: {new Date(item.effectiveDate).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>👁️ {item.views} görüntüleme</div>
                      <div>📥 {item.downloads} indirme</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(item.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                        title="Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

      {filteredLegislation.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Mevzuat bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Arama kriterlerinize uygun mevzuat bulunamadı.
          </p>
        </div>
      )}
    </div>
  )
}
