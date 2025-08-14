'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  Gavel, Plus, Search, Filter, Eye, Edit, Trash2,
  CheckCircle, Clock, XCircle, AlertCircle, Calendar, FileText, Scale
} from 'lucide-react'

interface Jurisprudence {
  id: string
  title: string
  caseNumber: string
  court: string
  decisionDate: string
  publishedDate: string
  status: 'published' | 'pending' | 'draft' | 'archived'
  category: string
  summary: string
  decision: string
  lastUpdated: string
  views: number
  citations: number
}

const mockJurisprudence: Jurisprudence[] = [
  {
    id: '1',
    title: 'İşçi İşveren İlişkisinde Haksız Yıpratma',
    caseNumber: '2024/1234',
    court: 'Yargıtay 9. Hukuk Dairesi',
    decisionDate: '2024-06-15',
    publishedDate: '2024-07-01',
    status: 'published',
    category: 'İş Hukuku',
    summary: 'İşçi işveren ilişkisinde haksız yıpratma kavramı ve sonuçları',
    decision: 'İşçinin işveren tarafından haksız yıpratıldığı tespit edilmiştir.',
    lastUpdated: '2024-08-14',
    views: 890,
    citations: 23
  },
  {
    id: '2',
    title: 'Ticari Sözleşmelerde Hile Kavramı',
    caseNumber: '2024/987',
    court: 'Yargıtay 11. Hukuk Dairesi',
    decisionDate: '2024-05-20',
    publishedDate: '2024-06-10',
    status: 'published',
    category: 'Ticaret Hukuku',
    summary: 'Ticari sözleşmelerde hile kavramı ve tespit yöntemleri',
    decision: 'Sözleşmede hile tespit edilmiş, sözleşme iptal edilmiştir.',
    lastUpdated: '2024-08-13',
    views: 756,
    citations: 18
  },
  {
    id: '3',
    title: 'Ceza Hukukunda Kusur Unsuru',
    caseNumber: '2024/567',
    court: 'Yargıtay 1. Ceza Dairesi',
    decisionDate: '2024-04-12',
    publishedDate: '2024-05-05',
    status: 'published',
    category: 'Ceza Hukuku',
    summary: 'Ceza hukukunda kusur unsuru ve sorumluluk kriterleri',
    decision: 'Sanığın kusurlu hareketi tespit edilmiştir.',
    lastUpdated: '2024-08-12',
    views: 634,
    citations: 15
  },
  {
    id: '4',
    title: 'Aile Hukukunda Boşanma Sebepleri',
    caseNumber: '2024/321',
    court: 'Yargıtay 2. Hukuk Dairesi',
    decisionDate: '2024-03-18',
    publishedDate: '2024-04-15',
    status: 'pending',
    category: 'Aile Hukuku',
    summary: 'Aile hukukunda boşanma sebepleri ve ispat yükü',
    decision: 'Boşanma talebi kabul edilmiştir.',
    lastUpdated: '2024-08-11',
    views: 445,
    citations: 12
  },
  {
    id: '5',
    title: 'Borçlar Hukukunda Sözleşme İhlali',
    caseNumber: '2024/789',
    court: 'Yargıtay 15. Hukuk Dairesi',
    decisionDate: '2024-02-25',
    publishedDate: '2024-03-20',
    status: 'draft',
    category: 'Borçlar Hukuku',
    summary: 'Borçlar hukukunda sözleşme ihlali ve tazminat',
    decision: 'Sözleşme ihlali tespit edilmiş, tazminat ödenmesine karar verilmiştir.',
    lastUpdated: '2024-08-10',
    views: 0,
    citations: 0
  }
]

export default function AdminJurisprudencePage() {
  const { user, isAuthenticated, isAdmin, isEditor } = useAuth()
  const router = useRouter()
  const [jurisprudence, setJurisprudence] = useState<Jurisprudence[]>(mockJurisprudence)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [courtFilter, setCourtFilter] = useState<string>('all')

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

  const filteredJurisprudence = jurisprudence.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caseNumber.includes(searchTerm) ||
                         item.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesCourt = courtFilter === 'all' || item.court === courtFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesCourt
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'draft':
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      case 'archived':
        return <XCircle className="w-4 h-4 text-gray-600" />
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
      case 'draft':
        return 'Taslak'
      case 'archived':
        return 'Arşivlendi'
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
      case 'draft':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleView = (id: string) => {
    router.push(`/admin/jurisprudence/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/jurisprudence/${id}/edit`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bu içtihadı silmek istediğinizden emin misiniz?')) {
      setJurisprudence(prev => prev.filter(item => item.id !== id))
    }
  }

  const stats = {
    total: jurisprudence.length,
    published: jurisprudence.filter(item => item.status === 'published').length,
    pending: jurisprudence.filter(item => item.status === 'pending').length,
    draft: jurisprudence.filter(item => item.status === 'draft').length,
    archived: jurisprudence.filter(item => item.status === 'archived').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            İçtihat Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm içtihatları yönetin, düzenleyin ve güncelleyin
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/jurisprudence/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni İçtihat</span>
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
          <div className="text-2xl font-bold text-blue-600">{stats.draft}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Taslak</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Arşivlendi</div>
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
                placeholder="İçtihat başlığı, dava numarası veya özet ara..."
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
              <option value="draft">Taslak</option>
              <option value="archived">Arşivlendi</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="İş Hukuku">İş Hukuku</option>
              <option value="Ticaret Hukuku">Ticaret Hukuku</option>
              <option value="Ceza Hukuku">Ceza Hukuku</option>
              <option value="Aile Hukuku">Aile Hukuku</option>
              <option value="Borçlar Hukuku">Borçlar Hukuku</option>
            </select>
            <select
              value={courtFilter}
              onChange={(e) => setCourtFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Mahkemeler</option>
              <option value="Yargıtay 9. Hukuk Dairesi">Yargıtay 9. Hukuk Dairesi</option>
              <option value="Yargıtay 11. Hukuk Dairesi">Yargıtay 11. Hukuk Dairesi</option>
              <option value="Yargıtay 1. Ceza Dairesi">Yargıtay 1. Ceza Dairesi</option>
              <option value="Yargıtay 2. Hukuk Dairesi">Yargıtay 2. Hukuk Dairesi</option>
              <option value="Yargıtay 15. Hukuk Dairesi">Yargıtay 15. Hukuk Dairesi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jurisprudence Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İçtihat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dava No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mahkeme
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
              {filteredJurisprudence.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Gavel className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {item.summary}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.caseNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {item.court}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{getStatusText(item.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>Karar: {new Date(item.decisionDate).toLocaleDateString('tr-TR')}</div>
                      <div>Yayın: {new Date(item.publishedDate).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>👁️ {item.views} görüntüleme</div>
                      <div>📚 {item.citations} alıntı</div>
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

      {filteredJurisprudence.length === 0 && (
        <div className="text-center py-12">
          <Gavel className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">İçtihat bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Arama kriterlerinize uygun içtihat bulunamadı.
          </p>
        </div>
      )}
    </div>
  )
}
