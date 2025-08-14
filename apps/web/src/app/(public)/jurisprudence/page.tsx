'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Filter, Gavel, Calendar, User, Eye, Download, BookOpen, Plus } from 'lucide-react'
import Link from 'next/link'

interface Jurisprudence {
  id: string
  title: string
  court: string
  caseNumber: string
  date: string
  category: string
  summary: string
  judge: string
  views: number
  downloads: number
  importance: 'Yüksek' | 'Orta' | 'Düşük'
}

export default function JurisprudencePage() {
  const { user, isAuthenticated, isAdmin, isEditor } = useAuth()
  const [jurisprudences, setJurisprudences] = useState<Jurisprudence[]>([])
  const [filteredJurisprudences, setFilteredJurisprudences] = useState<Jurisprudence[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourt, setSelectedCourt] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for jurisprudence
  const mockJurisprudences: Jurisprudence[] = [
    {
      id: '1',
      title: 'İşçi İşveren İlişkisinde İş Güvencesi',
      court: 'Yargıtay',
      caseNumber: '2019/12345',
      date: '2019-06-15',
      category: 'İş Hukuku',
      summary: 'İş güvencesi kapsamında olan işçinin iş sözleşmesinin feshi durumunda uygulanacak hükümler. İşverenin fesih nedenini gösterme yükümlülüğü ve geçerli neden kavramı.',
      judge: 'Hasan Yılmaz',
      views: 8750,
      downloads: 2340,
      importance: 'Yüksek'
    },
    {
      id: '2',
      title: 'Ticari İşletme Devri ve İşçi Hakları',
      court: 'Yargıtay',
      caseNumber: '2019/9876',
      date: '2019-05-22',
      category: 'İş Hukuku',
      summary: 'Ticari işletme devrinde işçi haklarının korunması ve devir sonrası iş ilişkisinin devamı. Devir işleminin işçiye bildirilmesi zorunluluğu.',
      judge: 'Ayşe Demir',
      views: 6540,
      downloads: 1890,
      importance: 'Orta'
    },
    {
      id: '3',
      title: 'Kira Sözleşmesinde Hapis Hakkı',
      court: 'Yargıtay',
      caseNumber: '2019/5432',
      date: '2019-04-18',
      category: 'Eşya Hukuku',
      summary: 'Kira sözleşmesinde kiracının hapis hakkının kullanım koşulları ve sınırları. Hapis hakkının kapsamı ve sınırları.',
      judge: 'Mehmet Kaya',
      views: 5430,
      downloads: 1560,
      importance: 'Orta'
    },
    {
      id: '4',
      title: 'Evlilik Birliğinin Korunması',
      court: 'Yargıtay',
      caseNumber: '2019/3456',
      date: '2019-03-12',
      category: 'Aile Hukuku',
      summary: 'Evlilik birliğinin korunması amacıyla verilen tedbir kararlarının uygulanması. Aile birliğinin korunması için alınan önlemler.',
      judge: 'Fatma Özkan',
      views: 4320,
      downloads: 1230,
      importance: 'Yüksek'
    },
    {
      id: '5',
      title: 'Ticari Sözleşmelerde Cayma Hakkı',
      court: 'Yargıtay',
      caseNumber: '2019/7890',
      date: '2019-02-28',
      category: 'Ticaret Hukuku',
      summary: 'Tüketici sözleşmelerinde cayma hakkının kullanımı ve sonuçları. Cayma süresi ve bildirim yükümlülüğü.',
      judge: 'Ali Yıldız',
      views: 3980,
      downloads: 980,
      importance: 'Düşük'
    },
    {
      id: '6',
      title: 'Sosyal Güvenlik Kurumu İşlemleri',
      court: 'Danıştay',
      caseNumber: '2019/4567',
      date: '2019-01-15',
      category: 'İdare Hukuku',
      summary: 'SGK tarafından yapılan işlemlerin idari yargı denetimi. İdari işlemlerin hukuka uygunluğunun kontrolü.',
      judge: 'Zeynep Kaya',
      views: 3210,
      downloads: 890,
      importance: 'Orta'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJurisprudences(mockJurisprudences)
      setFilteredJurisprudences(mockJurisprudences)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = jurisprudences

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(jurisprudence =>
        jurisprudence.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jurisprudence.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jurisprudence.caseNumber.includes(searchTerm)
      )
    }

    // Court filter
    if (selectedCourt !== 'all') {
      filtered = filtered.filter(jurisprudence => jurisprudence.court === selectedCourt)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(jurisprudence => jurisprudence.category === selectedCategory)
    }

    setFilteredJurisprudences(filtered)
  }, [searchTerm, selectedCourt, selectedCategory, jurisprudences])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCourtFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourt(e.target.value)
  }

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'Yüksek':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Orta':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Düşük':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">İçtihat yükleniyor...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">İçtihat</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Yargıtay kararları ve önemli içtihatlar ile hukuki uygulamalar hakkında bilgi edinin</p>
            </div>
            {isAuthenticated && (isAdmin || isEditor) && (
              <Link
                href="/jurisprudence/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni İçtihat Ekle
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
                placeholder="İçtihat ara..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Court Filter */}
            <div>
              <select
                value={selectedCourt}
                onChange={handleCourtFilter}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Tüm Mahkemeler</option>
                <option value="Yargıtay">Yargıtay</option>
                <option value="Danıştay">Danıştay</option>
                <option value="Anayasa Mahkemesi">Anayasa Mahkemesi</option>
                <option value="Uyuşmazlık Mahkemesi">Uyuşmazlık Mahkemesi</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={handleCategoryFilter}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

        {/* Main Content */}
        <div className="w-full">
          {filteredJurisprudences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJurisprudences.map((jurisprudence) => (
                <div key={jurisprudence.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {jurisprudence.court}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImportanceColor(jurisprudence.importance)}`}>
                        {jurisprudence.importance}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {jurisprudence.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {jurisprudence.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {jurisprudence.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {jurisprudence.caseNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>{jurisprudence.judge}</span>
                      <span>{new Date(jurisprudence.date).toLocaleDateString('tr-TR')}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {jurisprudence.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {jurisprudence.downloads.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <Eye className="w-4 h-4 mr-1" />
                          Görüntüle
                        </button>
                        <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <Download className="w-4 h-4 mr-1" />
                          İndir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Gavel className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">İçtihat bulunamadı</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Arama kriterlerinize uygun içtihat bulunamadı. Farklı anahtar kelimeler deneyin veya filtreleri değiştirin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
