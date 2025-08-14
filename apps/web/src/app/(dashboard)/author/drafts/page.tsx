'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Edit3, Calendar, Clock, Edit, Trash2, Plus, AlertCircle, Eye } from 'lucide-react'
import Link from 'next/link'

interface Draft {
  id: string
  title: string
  category: string
  lastModified: string
  wordCount: number
  excerpt: string
  tags: string[]
  autoSaved: boolean
}

export default function AuthorDraftsPage() {
  const { user, isAuthenticated, isAuthor } = useAuth()
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [filteredDrafts, setFilteredDrafts] = useState<Draft[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for drafts
  const mockDrafts: Draft[] = [
    {
      id: '1',
      title: 'İş Hukukunda Toplu İşçi Çıkarma',
      category: 'İş Hukuku',
      lastModified: '2024-08-13T10:30:00',
      wordCount: 1250,
      excerpt: 'Toplu işçi çıkarma sürecinde işverenin yükümlülükleri ve işçi hakları hakkında detaylı analiz...',
      tags: ['İş Hukuku', 'Toplu İşçi Çıkarma', 'İşçi Hakları'],
      autoSaved: true
    },
    {
      id: '2',
      title: 'Ticari Sözleşmelerde Garanti Hükümleri',
      category: 'Ticaret Hukuku',
      lastModified: '2024-08-12T15:45:00',
      wordCount: 890,
      excerpt: 'Ticari sözleşmelerde garanti hükümlerinin hukuki niteliği ve uygulama alanları...',
      tags: ['Ticaret Hukuku', 'Garanti', 'Sözleşme'],
      autoSaved: false
    },
    {
      id: '3',
      title: 'Aile Hukukunda Nafaka Yükümlülüğü',
      category: 'Aile Hukuku',
      lastModified: '2024-08-11T09:15:00',
      wordCount: 2100,
      excerpt: 'Nafaka yükümlülüğünün kapsamı, hesaplanması ve güncellenmesi konularında kapsamlı inceleme...',
      tags: ['Aile Hukuku', 'Nafaka', 'Yükümlülük'],
      autoSaved: true
    },
    {
      id: '4',
      title: 'Ceza Hukukunda Suçun Unsurları',
      category: 'Ceza Hukuku',
      lastModified: '2024-08-10T14:20:00',
      wordCount: 750,
      excerpt: 'Suçun maddi ve manevi unsurlarının analizi ve uygulamadaki önemi...',
      tags: ['Ceza Hukuku', 'Suç Unsurları', 'Maddi Unsur'],
      autoSaved: false
    },
    {
      id: '5',
      title: 'İdare Hukukunda İptal Davası',
      category: 'İdare Hukuku',
      lastModified: '2024-08-09T11:00:00',
      wordCount: 1680,
      excerpt: 'İptal davasının koşulları, süreleri ve yargılama usulü hakkında detaylı açıklama...',
      tags: ['İdare Hukuku', 'İptal Davası', 'Yargılama'],
      autoSaved: true
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDrafts(mockDrafts)
      setFilteredDrafts(mockDrafts)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = drafts

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(draft =>
        draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        draft.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        draft.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(draft => draft.category === selectedCategory)
    }

    setFilteredDrafts(filtered)
  }, [searchTerm, selectedCategory, drafts])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  const handleDeleteDraft = async (draftId: string) => {
    if (confirm('Bu taslağı silmek istediğinizden emin misiniz?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Remove from local state
        setDrafts(prev => prev.filter(draft => draft.id !== draftId))
        setFilteredDrafts(prev => prev.filter(draft => draft.id !== draftId))
        
        alert('Taslak başarıyla silindi!')
      } catch (error) {
        console.error('Taslak silinirken hata:', error)
        alert('Taslak silinirken bir hata oluştu. Lütfen tekrar deneyin.')
      }
    }
  }

  const formatLastModified = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Az önce'
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`
    } else {
      return date.toLocaleDateString('tr-TR')
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
            Taslaklarım
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Henüz tamamlanmamış yazılarınızı buradan yönetebilirsiniz.
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
                placeholder="Taslak ara..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-48">
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
      </div>

      {/* Drafts List */}
      <div className="space-y-4">
        {filteredDrafts.length === 0 ? (
          <div className="text-center py-12">
            <Edit3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Taslak bulunamadı
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Arama kriterlerinize uygun taslak bulunamadı.
            </p>
          </div>
        ) : (
          filteredDrafts.map((draft) => (
            <div
              key={draft.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {draft.category}
                    </span>
                    {draft.autoSaved && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Otomatik Kaydedildi
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {draft.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {draft.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatLastModified(draft.lastModified)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Edit3 className="w-4 h-4" />
                      <span>{draft.wordCount} kelime</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {draft.tags.map((tag, index) => (
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
                    href={`/author/articles/${draft.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-center"
                  >
                    <Eye className="w-4 h-4 mr-2 inline" />
                    Görüntüle
                  </Link>
                  <Link
                    href={`/author/articles/${draft.id}/edit`}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-center"
                  >
                    <Edit className="w-4 h-4 mr-2 inline" />
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDeleteDraft(draft.id)}
                    className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2 inline" />
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Taslak İstatistikleri
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {drafts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Taslak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {drafts.filter(d => d.autoSaved).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Otomatik Kaydedilen</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {Math.round(drafts.reduce((sum, d) => sum + d.wordCount, 0) / drafts.length)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Ortalama Kelime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {drafts.filter(d => d.wordCount > 1000).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">1000+ Kelime</div>
          </div>
        </div>
      </div>
    </div>
  )
}
