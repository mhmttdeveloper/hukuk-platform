'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquare, Edit3, Trash2, Calendar, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  articleTitle: string
  articleUrl: string
  date: string
  likes: number
  dislikes: number
  isEdited: boolean
  isApproved: boolean
  isPending: boolean
}

export default function MyCommentsPage() {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [filteredComments, setFilteredComments] = useState<Comment[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  // Mock data for comments
  const mockComments: Comment[] = [
    {
      id: '1',
      content: 'Bu makale çok faydalı olmuş, özellikle pratik örnekler kısmı çok iyi.',
      articleTitle: 'İş Hukukunda İş Güvencesi',
      articleUrl: '/articles/1',
      date: '2024-08-10',
      likes: 12,
      dislikes: 1,
      isEdited: false,
      isApproved: true,
      isPending: false
    },
    {
      id: '2',
      content: 'Yazarın bu konudaki görüşlerine katılmıyorum. Daha detaylı analiz gerekli.',
      articleTitle: 'Ticari Sözleşmelerde Cayma Hakkı',
      articleUrl: '/articles/2',
      date: '2024-08-08',
      likes: 5,
      dislikes: 8,
      isEdited: true,
      isApproved: true,
      isPending: false
    },
    {
      id: '3',
      content: 'Çok güzel bir yazı olmuş, teşekkürler.',
      articleTitle: 'Aile Hukukunda Evlilik Birliği',
      articleUrl: '/articles/3',
      date: '2024-08-05',
      likes: 3,
      dislikes: 0,
      isEdited: false,
      isApproved: false,
      isPending: true
    },
    {
      id: '4',
      content: 'Bu konuda daha fazla içerik bekliyorum.',
      articleTitle: 'Ceza Hukukunda Kusur',
      articleUrl: '/articles/4',
      date: '2024-08-03',
      likes: 7,
      dislikes: 2,
      isEdited: false,
      isApproved: true,
      isPending: false
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComments(mockComments)
      setFilteredComments(mockComments)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = comments

    // Status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'approved') {
        filtered = filtered.filter(comment => comment.isApproved && !comment.isPending)
      } else if (selectedStatus === 'pending') {
        filtered = filtered.filter(comment => comment.isPending)
      } else if (selectedStatus === 'edited') {
        filtered = filtered.filter(comment => comment.isEdited)
      }
    }

    setFilteredComments(filtered)
  }, [selectedStatus, comments])

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
  }

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingComment(commentId)
    setEditContent(currentContent)
  }

  const handleSaveEdit = async (commentId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editContent, isEdited: true }
          : comment
      ))
      
      setEditingComment(null)
      setEditContent('')
      alert('Yorum başarıyla güncellendi!')
    } catch (error) {
      console.error('Yorum güncellenirken hata:', error)
      alert('Yorum güncellenirken bir hata oluştu.')
    }
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditContent('')
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setComments(prev => prev.filter(comment => comment.id !== commentId))
      alert('Yorum başarıyla silindi!')
    } catch (error) {
      console.error('Yorum silinirken hata:', error)
      alert('Yorum silinirken bir hata oluştu.')
    }
  }

  const getStatusBadge = (comment: Comment) => {
    if (comment.isPending) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Onay Bekliyor
        </span>
      )
    } else if (comment.isApproved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Onaylandı
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          Reddedildi
        </span>
      )
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Yorumlarım
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Yaptığınız yorumları görüntüleyin, düzenleyin ve yönetin
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-blue-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{comments.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Toplam Yorum</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {comments.filter(c => c.isApproved && !c.isPending).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Onaylanan</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {comments.filter(c => c.isPending).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Onay Bekleyen</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <Edit3 className="mx-auto h-8 w-8 text-purple-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {comments.filter(c => c.isEdited).length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Düzenlenen</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
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
              <option value="approved">Onaylanan</option>
              <option value="pending">Onay Bekleyen</option>
              <option value="edited">Düzenlenen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Yorum bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Seçilen kriterlere uygun yorum bulunamadı.
            </p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                {/* Comment Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(comment)}
                    {comment.isEdited && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        Düzenlendi
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditComment(comment.id, comment.content)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Article Link */}
                <div>
                  <Link
                    href={comment.articleUrl}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                  >
                    {comment.articleTitle}
                  </Link>
                </div>

                {/* Comment Content */}
                {editingComment === comment.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Yorumunuzu düzenleyin..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                )}

                {/* Comment Footer */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(comment.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown className="w-4 h-4" />
                    <span>{comment.dislikes}</span>
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
