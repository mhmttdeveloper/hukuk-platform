'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Eye, Calendar, User, Eye as EyeIcon, Download, Share2, BarChart3, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface PublishedArticle {
  id: string
  title: string
  category: string
  publishedAt: string
  views: number
  downloads: number
  shares: number
  rating: number
  excerpt: string
  tags: string[]
  featured: boolean
  status: 'published' | 'featured' | 'archived'
}

export default function AuthorPublishedPage() {
  const { user, isAuthenticated, isAuthor } = useAuth()
  const [articles, setArticles] = useState<PublishedArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<PublishedArticle[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for published articles
  const mockArticles: PublishedArticle[] = [
    {
      id: '1',
      title: 'İş Hukukunda İş Güvencesi ve Kapsamı',
      category: 'İş Hukuku',
      publishedAt: '2024-08-10',
      views: 1250,
      downloads: 89,
      shares: 23,
      rating: 4.8,
      excerpt: 'İş güvencesi kapsamında olan işçilerin hakları ve işverenin yükümlülükleri hakkında detaylı analiz.',
      tags: ['İş Hukuku', 'İş Güvencesi', 'İşçi Hakları'],
      featured: true,
      status: 'featured'
    },
    {
      id: '2',
      title: 'Ceza Hukukunda Kusur İlkesi',
      category: 'Ceza Hukuku',
      publishedAt: '2024-07-28',
      views: 890,
      downloads: 67,
      shares: 15,
      rating: 4.6,
      excerpt: 'Ceza hukukunda kusur ilkesinin temel prensipleri ve uygulama alanları.',
      tags: ['Ceza Hukuku', 'Kusur İlkesi', 'Ceza Sorumluluğu'],
      featured: false,
      status: 'published'
    },
    {
      id: '3',
      title: 'Ticari Sözleşmelerde Cayma Hakkı',
      category: 'Ticaret Hukuku',
      publishedAt: '2024-07-15',
      views: 654,
      downloads: 45,
      shares: 12,
      rating: 4.4,
      excerpt: 'Tüketici sözleşmelerinde cayma hakkının kullanımı ve sonuçları.',
      tags: ['Ticaret Hukuku', 'Tüketici Hakları', 'Sözleşme'],
      featured: false,
      status: 'published'
    },
    {
      id: '4',
      title: 'Aile Hukukunda Nafaka Yükümlülüğü',
      category: 'Aile Hukuku',
      publishedAt: '2024-07-01',
      views: 432,
      downloads: 34,
      shares: 8,
      rating: 4.7,
      excerpt: 'Nafaka yükümlülüğünün kapsamı, hesaplanması ve güncellenmesi konularında kapsamlı inceleme.',
      tags: ['Aile Hukuku', 'Nafaka', 'Yükümlülük'],
      featured: false,
      status: 'published'
    },
    {
      id: '5',
      title: 'Kira Sözleşmesinde Hapis Hakkı',
      category: 'Eşya Hukuku',
      publishedAt: '2024-06-20',
      views: 321,
      downloads: 28,
      shares: 6,
      rating: 4.3,
      excerpt: 'Kira sözleşmesinde kiracının hapis hakkının kullanım koşulları ve sınırları.',
      tags: ['Eşya Hukuku', 'Kira', 'Hapis Hakkı'],
      featured: false,
      status: 'archived'
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

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(article => article.status === selectedStatus)
    }

    setFilteredArticles(filtered)
  }, [searchTerm, selectedCategory, selectedStatus, articles])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'featured':
        return {
          label: 'Öne Çıkan',
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          icon: TrendingUp
        }
      case 'published':
        return {
          label: 'Yayınlandı',
          color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          icon: CheckCircle
        }
      case 'archived':
        return {
          label: 'Arşivlendi',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
          icon: Eye
        }
      default:
        return {
          label: 'Bilinmiyor',
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
          icon: AlertCircle
        }
    }
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
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
            Yayınlanan Yazılarım
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Yayınlanan tüm makalelerinizi ve performans metriklerini görüntüleyin.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/author/articles/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Eye className="w-5 h-5 mr-2" />
            Yeni Yazı
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
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

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={handleCategoryFilter}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="İş Hukuku">İş Hukuku</option>
              <option value="Aile Hukuku">Aile Hukuku</option>
              <option value="Eşya Hukuku">Eşya Hukuku</option>
              <option value="Ticaret Hukuku">Ticaret Hukuku</option>
              <option value="Ceza Hukuku">Ceza Hukuku</option>
              <option value="İdare Hukuku">İdare Hukuku</option>
            </select>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mt-4">
          <select
            value={selectedStatus}
            onChange={handleStatusFilter}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="featured">Öne Çıkan</option>
            <option value="published">Yayınlandı</option>
            <option value="archived">Arşivlendi</option>
          </select>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Yayınlanan yazı bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Arama kriterlerinize uygun yayınlanan yazı bulunamadı.
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
                      {article.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          ⭐ Öne Çıkan
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(article.publishedAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4" />
                        <span>{article.views.toLocaleString()} görüntüleme</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{article.downloads} indirme</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        <span>{article.shares} paylaşım</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < Math.floor(article.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatRating(article.rating)} ({article.rating > 0 ? 'Değerlendirildi' : 'Henüz değerlendirilmedi'})
                      </span>
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
                      <EyeIcon className="w-4 h-4 mr-2 inline" />
                      Görüntüle
                    </Link>
                    <Link
                      href={`/author/articles/${article.id}/edit`}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-center"
                    >
                      <BarChart3 className="w-4 h-4 mr-2 inline" />
                      Analitik
                    </Link>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Performance Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performans Özeti
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {articles.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Yazı</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {articles.filter(a => a.featured).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Öne Çıkan</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {articles.reduce((sum, a) => sum + a.views, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Görüntüleme</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {formatRating(articles.reduce((sum, a) => sum + a.rating, 0) / articles.length)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ortalama Puan</div>
          </div>
        </div>
      </div>
    </div>
  )
}
