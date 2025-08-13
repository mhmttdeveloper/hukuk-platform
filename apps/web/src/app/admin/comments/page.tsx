'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Eye,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  adminNote?: string
  user: {
    id: string
    name: string
    surname: string
    profession: string
    verifiedStatus: string
  }
  publication: {
    id: string
    title: string
  }
}

export default function AdminCommentsPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdmin) {
      router.push('/auth/signin')
      return
    }
    fetchComments()
  }, [selectedStatus, page, isAdmin])

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/admin/comments?status=${selectedStatus}&page=${page}&limit=20`
      )
      
      if (!response.ok) {
        throw new Error('Yorumlar getirilemedi')
      }

      const data = await response.json()
      setComments(data.comments)
      setTotalPages(data.pagination.pages)
    } catch (error) {
      setError('Yorumlar yüklenirken bir hata oluştu')
      console.error('Yorumlar getirilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateCommentStatus = async (commentId: string, status: 'APPROVED' | 'REJECTED', adminNote?: string) => {
    try {
      setIsUpdating(commentId)
      const response = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentId,
          status,
          adminNote: adminNote?.trim() || null
        }),
      })

      if (!response.ok) {
        throw new Error('Yorum durumu güncellenemedi')
      }

      // Yorumu listeden kaldır veya güncelle
      setComments(prev => prev.filter(c => c.id !== commentId))
      
      // Başarı mesajı göster
      alert(`Yorum başarıyla ${status === 'APPROVED' ? 'onaylandı' : 'reddedildi'}`)
    } catch (error) {
      alert(`Hata: ${error.message}`)
    } finally {
      setIsUpdating(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Onaylandı
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Reddedildi
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Bekliyor
          </span>
        )
      default:
        return null
    }
  }

  const getProfessionText = (profession: string) => {
    switch (profession) {
      case 'LAWYER':
        return 'Avukat'
      case 'JUDGE':
        return 'Hakim'
      case 'PROSECUTOR':
        return 'Savcı'
      case 'ACADEMIC':
        return 'Akademisyen'
      default:
        return 'Hukukçu'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.publication.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <XCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Yetkisiz Erişim</h2>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Yorum Yönetimi</h1>
              <p className="mt-2 text-gray-600">
                Kullanıcı yorumlarını onaylayın veya reddedin
              </p>
            </div>
            <button
              onClick={fetchComments}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Yenile
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum Filtresi
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as 'PENDING' | 'APPROVED' | 'REJECTED')
                  setPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PENDING">Onay Bekleyen</option>
                <option value="APPROVED">Onaylanan</option>
                <option value="REJECTED">Reddedilen</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arama
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Yorum, kullanıcı veya yayın ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                {filteredComments.length} yorum bulundu
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Yorumlar yükleniyor...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <XCircle className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchComments}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          ) : filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Yorum bulunamadı</h3>
              <p className="text-gray-500">
                Seçilen kriterlere uygun yorum bulunmamaktadır.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredComments.map((comment) => (
                <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">
                        {comment.user.name[0]}{comment.user.surname[0]}
                      </span>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {comment.user.name} {comment.user.surname}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {getProfessionText(comment.user.profession)}
                        </span>
                        {comment.user.verifiedStatus === 'VERIFIED' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Doğrulanmış
                          </span>
                        )}
                        {getStatusBadge(comment.status)}
                      </div>

                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {comment.content}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(comment.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {comment.publication.title}
                        </span>
                      </div>

                      {/* Admin Note */}
                      {comment.adminNote && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Admin Notu:</strong> {comment.adminNote}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {comment.status === 'PENDING' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => updateCommentStatus(comment.id, 'APPROVED')}
                            disabled={isUpdating === comment.id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            {isUpdating === comment.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Onaylanıyor...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Onayla
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const note = prompt('Red sebebi (isteğe bağlı):')
                              if (note !== null) {
                                updateCommentStatus(comment.id, 'REJECTED', note)
                              }
                            }}
                            disabled={isUpdating === comment.id}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            {isUpdating === comment.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Reddediliyor...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Reddet
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 border rounded-md text-sm font-medium ${
                    pageNum === page
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
