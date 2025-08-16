'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Publication {
  id: string
  title: string
  excerpt: string
  author: {
    name: string
    surname: string
  }
  category: string
  tags: string[]
  publishedAt: string
  readTime: number
  viewCount: number
  rating: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export default function PublicationsPage() {
  const { user, isAuthor, isEditor, isAdmin } = useAuth()
  const [publications, setPublications] = useState<Publication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const categories = [
    'Tümü',
    'Hukuki Makale',
    'Yargıtay Kararı',
    'Kanun Yorumu',
    'Pratik Bilgi',
    'Güncel Gelişme'
  ]

  const statuses = [
    'Tümü',
    'Taslak',
    'Yayında',
    'Arşivlenmiş'
  ]

  useEffect(() => {
    // TODO: API'den yayınları getir
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      // Simüle edilmiş veri
      const mockPublications: Publication[] = [
        {
          id: '1',
          title: 'Türk Borçlar Kanunu 6098 Madde 27 Yorumu',
          excerpt: 'Bu makalede, TBK m. 27\'de düzenlenen genel işlem şartları konusu detaylı olarak incelenmektedir...',
          author: { name: 'Ahmet', surname: 'Yılmaz' },
          category: 'Hukuki Makale',
          tags: ['Borçlar Hukuku', 'Genel İşlem Şartları', 'TBK'],
          publishedAt: '2024-08-13',
          readTime: 8,
          viewCount: 1250,
          rating: 4.5,
          status: 'PUBLISHED'
        },
        {
          id: '2',
          title: 'Yargıtay 3. HD\'nin Güncel Kararları',
          excerpt: '2024 yılında Yargıtay 3. Hukuk Dairesi tarafından verilen önemli kararların analizi...',
          author: { name: 'Fatma', surname: 'Demir' },
          category: 'Yargıtay Kararı',
          tags: ['Yargıtay', 'Karar Analizi', 'Hukuki Görüş'],
          publishedAt: '2024-08-10',
          readTime: 12,
          viewCount: 890,
          rating: 4.8,
          status: 'PUBLISHED'
        }
      ]
      
      setPublications(mockPublications)
      setIsLoading(false)
    } catch (error) {
      console.error('Yayınlar getirilemedi:', error)
      setIsLoading(false)
    }
  }

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || pub.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'Taslak' && pub.status === 'DRAFT') ||
                         (selectedStatus === 'Yayında' && pub.status === 'PUBLISHED') ||
                         (selectedStatus === 'Arşivlenmiş' && pub.status === 'ARCHIVED')
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Taslak</span>
      case 'PUBLISHED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Yayında</span>
      case 'ARCHIVED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Arşivlenmiş</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Bilinmiyor</span>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yayınlar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yayınlar</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Hukuki yayınları keşfedin ve yönetin</p>
            </div>
            {(isAuthor || isEditor || isAdmin) && (
              <Link
                href="/publications/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Yayın
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Yayın ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category === 'Tümü' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status === 'Tümü' ? 'all' : status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {filteredPublications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPublications.map((publication) => (
                <div key={publication.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {getStatusBadge(publication.status)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">{publication.readTime} dk okuma</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {publication.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {publication.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {publication.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {publication.tags.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          +{publication.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>{publication.author.name} {publication.author.surname}</span>
                      <span>{new Date(publication.publishedAt).toLocaleDateString('tr-TR')}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {publication.viewCount}
                        </span>
                        <span className="flex items-center">
                          ⭐ {publication.rating}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          href={`/publications/${publication.id}`}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Görüntüle
                        </Link>
                        
                        {(isAuthor || isEditor || isAdmin) && (
                          <Link
                            href={`/publications/${publication.id}/edit`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Yayın bulunamadı</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Arama kriterlerinize uygun yayın bulunamadı. Farklı anahtar kelimeler deneyin veya filtreleri değiştirin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
