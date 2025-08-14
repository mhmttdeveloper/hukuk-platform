'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  MessageSquare, Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle,
  Clock, User, Calendar, AlertCircle, ThumbsUp, ThumbsDown, Flag
} from 'lucide-react'

interface Comment {
  id: string
  content: string
  author: {
    name: string
    surname: string
    email: string
    verified: boolean
  }
  publication: {
    title: string
    id: string
  }
  status: 'approved' | 'pending' | 'rejected' | 'spam'
  createdAt: string
  updatedAt: string
  likes: number
  dislikes: number
  reports: number
  isEdited: boolean
}

const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Bu makale çok faydalı olmuş, özellikle pratik örnekler kısmı çok iyi.',
    author: { name: 'Ahmet', surname: 'Yılmaz', email: 'ahmet@example.com', verified: true },
    publication: { title: 'Türk Borçlar Kanunu Kapsamında Sözleşme Hukuku', id: '1' },
    status: 'approved',
    createdAt: '2024-08-14',
    updatedAt: '2024-08-14',
    likes: 5,
    dislikes: 0,
    reports: 0,
    isEdited: false
  },
  {
    id: '2',
    content: 'Yazarın bu konudaki görüşlerine katılmıyorum. Daha detaylı açıklama gerekli.',
    author: { name: 'Fatma', surname: 'Demir', email: 'fatma@example.com', verified: true },
    publication: { title: 'Ceza Hukukunda Kusur Unsuru ve Sorumluluk', id: '2' },
    status: 'pending',
    createdAt: '2024-08-13',
    updatedAt: '2024-08-13',
    likes: 2,
    dislikes: 3,
    reports: 1,
    isEdited: false
  },
  {
    id: '3',
    content: 'Harika bir analiz! Ben de benzer bir durumla karşılaşmıştım.',
    author: { name: 'Mehmet', surname: 'Kaya', email: 'mehmet@example.com', verified: false },
    publication: { title: 'İş Hukukunda İşçi Hakları ve Koruması', id: '3' },
    status: 'approved',
    createdAt: '2024-08-12',
    updatedAt: '2024-08-12',
    likes: 8,
    dislikes: 1,
    reports: 0,
    isEdited: false
  },
  {
    id: '4',
    content: 'Bu yorum spam içeriyor ve uygunsuz.',
    author: { name: 'Spam', surname: 'User', email: 'spam@example.com', verified: false },
    publication: { title: 'Ticaret Hukukunda Şirket Türleri ve Kuruluş', id: '4' },
    status: 'spam',
    createdAt: '2024-08-11',
    updatedAt: '2024-08-11',
    likes: 0,
    dislikes: 10,
    reports: 5,
    isEdited: false
  },
  {
    id: '5',
    content: 'Yazıda belirtilen tarih yanlış olabilir, kontrol edilmesi gerekir.',
    author: { name: 'Zeynep', surname: 'Özkan', email: 'zeynep@example.com', verified: true },
    publication: { title: 'Aile Hukukunda Boşanma Süreçleri', id: '5' },
    status: 'rejected',
    createdAt: '2024-08-10',
    updatedAt: '2024-08-10',
    likes: 1,
    dislikes: 2,
    reports: 2,
    isEdited: true
  }
]

export default function AdminCommentsPage() {
  const { user, isAuthenticated, isAdmin, isEditor } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [publicationFilter, setPublicationFilter] = useState<string>('all')
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all')

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

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.publication.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter
    const matchesPublication = publicationFilter === 'all' || comment.publication.id === publicationFilter
    const matchesVerified = verifiedFilter === 'all' ||
                           (verifiedFilter === 'verified' && comment.author.verified) ||
                           (verifiedFilter === 'unverified' && !comment.author.verified)

    return matchesSearch && matchesStatus && matchesPublication && matchesVerified
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'spam':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Onaylandı'
      case 'pending':
        return 'Beklemede'
      case 'rejected':
        return 'Reddedildi'
      case 'spam':
        return 'Spam'
      default:
        return 'Bilinmiyor'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'spam':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleApprove = (id: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === id ? { ...comment, status: 'approved' as const } : comment
    ))
  }

  const handleReject = (id: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === id ? { ...comment, status: 'rejected' as const } : comment
    ))
  }

  const handleMarkAsSpam = (id: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === id ? { ...comment, status: 'spam' as const } : comment
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      setComments(prev => prev.filter(comment => comment.id !== id))
    }
  }

  const handleViewPublication = (publicationId: string) => {
    router.push(`/publications/${publicationId}`)
  }

  const stats = {
    total: comments.length,
    approved: comments.filter(c => c.status === 'approved').length,
    pending: comments.filter(c => c.status === 'pending').length,
    rejected: comments.filter(c => c.status === 'rejected').length,
    spam: comments.filter(c => c.status === 'spam').length,
    verifiedAuthors: comments.filter(c => c.author.verified).length,
    reported: comments.filter(c => c.reports > 0).length
  }

  const uniquePublications = Array.from(new Set(comments.map(c => c.publication.id)))
    .map(id => comments.find(c => c.publication.id === id)?.publication)
    .filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Yorum Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Platformdaki tüm yorumları yönetin, onaylayın ve moderasyon yapın
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <MessageSquare className="w-4 h-4" />
          <span>{comments.length} yorum</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Onaylandı</div>
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
          <div className="text-2xl font-bold text-red-600">{stats.spam}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Spam</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">{stats.verifiedAuthors}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Doğrulanmış</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-orange-600">{stats.reported}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Raporlanan</div>
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
                placeholder="Yorum içeriği, yazar veya yayın ara..."
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
              <option value="approved">Onaylandı</option>
              <option value="pending">Beklemede</option>
              <option value="rejected">Reddedildi</option>
              <option value="spam">Spam</option>
            </select>
            <select
              value={publicationFilter}
              onChange={(e) => setPublicationFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Yayınlar</option>
              {uniquePublications.map(pub => (
                <option key={pub?.id} value={pub?.id}>
                  {pub?.title.substring(0, 30)}...
                </option>
              ))}
            </select>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Yazarlar</option>
              <option value="verified">Doğrulanmış</option>
              <option value="unverified">Doğrulanmamış</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Yorum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Yazar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Yayın
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
              {filteredComments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <MessageSquare className="w-6 h-6 text-blue-600 mr-3 mt-1" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 dark:text-white line-clamp-3">
                          {comment.content}
                        </div>
                        {comment.isEdited && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            (Düzenlendi)
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.author.name} {comment.author.surname}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {comment.author.email}
                      </div>
                      {comment.author.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Doğrulanmış
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewPublication(comment.publication.id)}
                      className="text-left hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {comment.publication.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {comment.publication.id}
                      </div>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(comment.status)}`}>
                      {getStatusIcon(comment.status)}
                      <span className="ml-1">{getStatusText(comment.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="w-4 h-4 text-green-600" />
                        <span>{comment.likes}</span>
                        <ThumbsDown className="w-4 h-4 text-red-600" />
                        <span>{comment.dislikes}</span>
                      </div>
                      {comment.reports > 0 && (
                        <div className="flex items-center mt-1">
                          <Flag className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-600">{comment.reports} rapor</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>Oluşturulma: {new Date(comment.createdAt).toLocaleDateString('tr-TR')}</div>
                      <div>Güncelleme: {new Date(comment.updatedAt).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {comment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(comment.id)}
                            className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
                            title="Onayla"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(comment.id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                            title="Reddet"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {comment.status !== 'spam' && (
                        <button
                          onClick={() => handleMarkAsSpam(comment.id)}
                          className="p-2 text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg"
                          title="Spam Olarak İşaretle"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment.id)}
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

      {filteredComments.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Yorum bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Arama kriterlerinize uygun yorum bulunamadı.
          </p>
        </div>
      )}
    </div>
  )
}
