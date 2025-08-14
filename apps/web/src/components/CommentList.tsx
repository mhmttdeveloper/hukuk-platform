'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  user: {
    id: string
    name: string
    surname: string
    profession: string
    verifiedStatus: string
  }
}

interface CommentListProps {
  publicationId: string
  onCommentAdded: () => void
}

export default function CommentList({ publicationId, onCommentAdded }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [publicationId, page])

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/publications/${publicationId}/comments?page=${page}&limit=10`
      )
      
      if (!response.ok) {
        throw new Error('Yorumlar getirilemedi')
      }

      const data = await response.json()
      
      if (page === 1) {
        setComments(data.comments)
      } else {
        setComments(prev => [...prev, ...data.comments])
      }
      
      setHasMore(data.pagination.page < data.pagination.pages)
    } catch (error) {
      setError('Yorumlar yüklenirken bir hata oluştu')
      console.error('Yorumlar getirilemedi:', error)
      
      // Mock data ile fallback
      if (page === 1) {
        const mockComments: Comment[] = [
          {
            id: '1',
            content: 'Bu makale gerçekten çok faydalı. TBK m.27 konusunda net bir açıklama yapılmış. Teşekkürler.',
            createdAt: '2024-08-13T10:00:00Z',
            status: 'APPROVED',
            user: {
              id: '1',
              name: 'Mehmet',
              surname: 'Demir',
              profession: 'LAWYER',
              verifiedStatus: 'VERIFIED'
            }
          },
          {
            id: '2',
            content: 'Genel işlem şartları konusunda güncel bilgiler içeriyor. Özellikle pratik örnekler çok yardımcı.',
            createdAt: '2024-08-12T15:30:00Z',
            status: 'APPROVED',
            user: {
              id: '2',
              name: 'Ayşe',
              surname: 'Kaya',
              profession: 'JUDGE',
              verifiedStatus: 'VERIFIED'
            }
          },
          {
            id: '3',
            content: 'Yazarın bu konudaki deneyimi açıkça görülüyor. Önerilen kaynaklar da çok değerli.',
            createdAt: '2024-08-11T09:15:00Z',
            status: 'APPROVED',
            user: {
              id: '3',
              name: 'Ali',
              surname: 'Özkan',
              profession: 'LAWYER',
              verifiedStatus: 'VERIFIED'
            }
          }
        ]
        setComments(mockComments)
        setHasMore(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'PENDING':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Onaylandı'
      case 'REJECTED':
        return 'Reddedildi'
      case 'PENDING':
        return 'Onay Bekliyor'
      default:
        return 'Bilinmiyor'
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
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Az önce'
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) {
        return `${diffInDays} gün önce`
      } else {
        return date.toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    }
  }

  if (isLoading && page === 1) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Yorumlar</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Yorumlar yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error && page === 1) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MessageCircle className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Yorumlar</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <XCircle className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => {
              setError('')
              fetchComments()
            }}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <MessageCircle className="w-6 h-6 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">
          Yorumlar ({comments.length})
        </h3>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz yorum yok</h4>
          <p className="text-gray-500">
            Bu yayın için ilk yorumu siz yapın!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">
                    {comment.user.name[0]}{comment.user.surname[0]}
                  </span>
                </div>
                
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
                    <div className="flex items-center space-x-1 ml-auto">
                      {getStatusIcon(comment.status)}
                      <span className="text-xs text-gray-500">
                        {getStatusText(comment.status)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    {comment.content}
                  </p>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Yükleniyor...
                  </>
                ) : (
                  'Daha Fazla Yorum Göster'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
