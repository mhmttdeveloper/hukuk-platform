'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Filter, PenTool, Calendar, Eye, Edit, Trash2, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  status: 'draft' | 'pending' | 'published' | 'rejected'
  category: string
  createdAt: string
  updatedAt: string
  views: number
  readTime: number
  excerpt: string
  tags: string[]
}

export default function AuthorArticlesPage() {
  const { user, isAuthenticated, isAuthor } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for articles
  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'İş Hukukunda İş Güvencesi ve Kapsamı',
      status: 'published',
      category: 'İş Hukuku',
      createdAt: '2024-08-10',
      updatedAt: '2024-08-12',
      views: 1250,
      readTime: 8,
      excerpt: 'İş güvencesi kapsamında olan işçilerin hakları ve işverenin yükümlülükleri hakkında detaylı analiz.',
      tags: ['İş Hukuku', 'İş Güvencesi', 'İşçi Hakları']
    },
    {
      id: '2',
      title: 'Ticari Sözleşmelerde Cayma Hakkı',
      status: 'pending',
      category: 'Ticaret Hukuku',
      createdAt: '2024-08-08',
      updatedAt: '2024-08-08',
      views: 0,
      readTime: 12,
      excerpt: 'Tüketici sözleşmelerinde cayma hakkının kullanımı ve sonuçları hakkında kapsamlı inceleme.',
      tags: ['Ticaret Hukuku', 'Tüketici Hakları', 'Sözleşme']
    },
    {
      id: '3',
      title: 'Evlilik Birliğinin Korunması',
      status: 'draft',
      category: 'Aile Hukuku',
      createdAt: '2024-08-05',
      updatedAt: '2024-08-07',
      views: 0,
      readTime: 15,
      excerpt: 'Evlilik birliğinin korunması amacıyla verilen tedbir kararlarının uygulanması ve sonuçları.',
      tags: ['Aile Hukuku', 'Evlilik', 'Tedbir Kararları']
    },
    {
      id: '4',
      title: 'Kira Sözleşmesinde Hapis Hakkı',
      status: 'rejected',
      category: 'Eşya Hukuku',
      createdAt: '2024-08-01',
      updatedAt: '2024-08-03',
      views: 0,
      readTime: 10,
      excerpt: 'Kira sözleşmesinde kiracının hapis hakkının kullanım koşulları ve sınırları.',
      tags: ['Eşya Hukuku', 'Kira', 'Hapis Hakkı']
    },
    {
      id: '5',
      title: 'Ceza Hukukunda Kusur İlkesi',
      status: 'published',
      category: 'Ceza Hukuku',
      createdAt: '2024-07-28',
      updatedAt: '2024-07-30',
      views: 890,
      readTime: 18,
      excerpt: 'Ceza hukukunda kusur ilkesinin temel prensipleri ve uygulama alanları.',
      tags: ['Ceza Hukuku', 'Kusur İlkesi', 'Ceza Sorumluluğu']
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setArticles(mockArticles)
      setFilteredArticles(mockArticles)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = articles

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(article => article.status === selectedStatus)
    }

    setFilteredArticles(filtered)
  }, [searchTerm, selectedStatus, articles])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'published':
        return {
          label: 'Yayınlandı',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: CheckCircle
        }
      case 'pending':
        return {
          label: 'İncelemede',
          color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          icon: Clock
        }
      case 'draft':
        return {
          label: 'Taslak',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
          icon: Edit
        }
      case 'rejected':
        return {
          label: 'Reddedildi',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          icon: AlertCircle
        }
      default:
        return {
          label: 'Bilinmiyor',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
          icon: AlertCircle
        }
    }
  }

  if (!isAuthenticated || !isAuthor) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Erişim Reddedildi
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Bu sayfaya erişim için yazar yetkisine sahip olmanız gerekmektedir.
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Yazılarım
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Yazdığınız tüm makaleleri buradan yönetebilirsiniz.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/author/articles/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Yeni Yazı
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Yazı ara..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <select
              value={selectedStatus}
              onChange={handleStatusFilter}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="published">Yayınlandı</option>
              <option value="pending">İncelemede</option>
              <option value="draft">Taslak</option>
              <option value="rejected">Reddedildi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <PenTool className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Yazı bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Arama kriterlerinize uygun yazı bulunamadı.
            </p>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const statusInfo = getStatusInfo(article.status)
            const StatusIcon = statusInfo.icon

            return (
              <div
                key={article.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {article.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.views.toLocaleString()} görüntüleme</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{article.readTime} dk okuma</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/author/articles/${article.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center"
                    >
                      <Eye className="w-4 h-4 mr-2 inline" />
                      Görüntüle
                    </Link>
                    <Link
                      href={`/author/articles/${article.id}/edit`}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-center"
                    >
                      <Edit className="w-4 h-4 mr-2 inline" />
                      Düzenle
                    </Link>
                    <button className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 mr-2 inline" />
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Stats Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Yazı İstatistikleri
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {articles.filter(a => a.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Yayınlanan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {articles.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">İncelemede</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {articles.filter(a => a.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Taslak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {articles.filter(a => a.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reddedilen</div>
          </div>
        </div>
      </div>
    </div>
  )
}
