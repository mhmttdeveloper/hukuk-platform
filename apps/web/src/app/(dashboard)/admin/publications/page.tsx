'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  FileText, Plus, Search, Filter, Eye, Edit, Trash2, 
  CheckCircle, Clock, XCircle, AlertCircle 
} from 'lucide-react'

interface Publication {
  id: string
  title: string
  author: {
    name: string
    surname: string
    profession: string
  }
  category: string
  status: 'published' | 'pending' | 'rejected' | 'draft'
  createdAt: string
  updatedAt: string
  views: number
  rating: number
}

const mockPublications: Publication[] = [
  {
    id: '1',
    title: 'Türk Borçlar Kanunu Kapsamında Sözleşme Hukuku',
    author: { name: 'Ahmet', surname: 'Yılmaz', profession: 'Avukat' },
    category: 'Borçlar Hukuku',
    status: 'published',
    createdAt: '2024-08-10',
    updatedAt: '2024-08-12',
    views: 1250,
    rating: 4.5
  },
  {
    id: '2',
    title: 'Ceza Hukukunda Kusur Unsuru ve Sorumluluk',
    author: { name: 'Fatma', surname: 'Demir', profession: 'Hakim' },
    category: 'Ceza Hukuku',
    status: 'pending',
    createdAt: '2024-08-13',
    updatedAt: '2024-08-13',
    views: 0,
    rating: 0
  },
  {
    id: '3',
    title: 'İş Hukukunda İşçi Hakları ve Koruması',
    author: { name: 'Mehmet', surname: 'Kaya', profession: 'Avukat' },
    category: 'İş Hukuku',
    status: 'rejected',
    createdAt: '2024-08-08',
    updatedAt: '2024-08-11',
    views: 0,
    rating: 0
  },
  {
    id: '4',
    title: 'Ticaret Hukukunda Şirket Türleri ve Kuruluş',
    author: { name: 'Zeynep', surname: 'Özkan', profession: 'Avukat' },
    category: 'Ticaret Hukuku',
    status: 'draft',
    createdAt: '2024-08-14',
    updatedAt: '2024-08-14',
    views: 0,
    rating: 0
  }
]

export default function AdminPublicationsPage() {
  const { user, isAuthenticated, isAdmin, isEditor } = useAuth()
  const router = useRouter()
  const [publications, setPublications] = useState<Publication[]>(mockPublications)
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

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.author.surname.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || pub.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || pub.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'draft':
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Yayınlandı'
      case 'pending':
        return 'Beklemede'
      case 'rejected':
        return 'Reddedildi'
      case 'draft':
        return 'Taslak'
      default:
        return 'Bilinmiyor'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleView = (id: string) => {
    router.push(`/publications/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/publications/${id}/edit`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bu yayını silmek istediğinizden emin misiniz?')) {
      setPublications(prev => prev.filter(pub => pub.id !== id))
    }
  }

  const stats = {
    total: publications.length,
    published: publications.filter(p => p.status === 'published').length,
    pending: publications.filter(p => p.status === 'pending').length,
    rejected: publications.filter(p => p.status === 'rejected').length,
    draft: publications.filter(p => p.status === 'draft').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Yayın Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm yayınları yönetin, onaylayın ve düzenleyin
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/publications/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Yayın</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Yayınlandı</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Beklemede</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Reddedildi</div>
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
                placeholder="Yayın başlığı veya yazar ara..."
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
              <option value="published">Yayınlandı</option>
              <option value="pending">Beklemede</option>
              <option value="rejected">Reddedildi</option>
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
            </select>
          </div>
        </div>
      </div>

      {/* Publications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Yayın
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Yazar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İstatistikler
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
              {filteredPublications.map((publication) => (
                <tr key={publication.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {publication.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {publication.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {publication.author.name} {publication.author.surname}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {publication.author.profession}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {publication.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(publication.status)}`}>
                      {getStatusIcon(publication.status)}
                      <span className="ml-1">{getStatusText(publication.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>👁️ {publication.views} görüntüleme</div>
                      <div>⭐ {publication.rating} puan</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>Oluşturulma: {new Date(publication.createdAt).toLocaleDateString('tr-TR')}</div>
                      <div>Güncelleme: {new Date(publication.updatedAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(publication.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                        title="Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(publication.id)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(publication.id)}
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

      {filteredPublications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Yayın bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Arama kriterlerinize uygun yayın bulunamadı.
          </p>
        </div>
      )}
    </div>
  )
}
