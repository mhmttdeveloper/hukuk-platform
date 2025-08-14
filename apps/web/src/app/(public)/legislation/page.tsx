'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Filter, FileText, Calendar, User, Eye, Download, Plus } from 'lucide-react'
import Link from 'next/link'

interface Legislation {
  id: string
  title: string
  type: string
  number: string
  date: string
  status: string
  description: string
  author: string
  views: number
  downloads: number
}

export default function LegislationPage() {
  const { user, isAuthenticated, isAdmin, isEditor } = useAuth()
  const [legislations, setLegislations] = useState<Legislation[]>([])
  const [filteredLegislations, setFilteredLegislations] = useState<Legislation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for legislation
  const mockLegislations: Legislation[] = [
    {
      id: '1',
      title: 'Türk Ceza Kanunu',
      type: 'Kanun',
      number: '5237',
      date: '2004-09-26',
      status: 'Yürürlükte',
      description: 'Türk Ceza Kanunu, suç ve cezaları düzenleyen temel kanun metnidir. Genel hükümler, özel hükümler ve müsadere hükümlerini içerir.',
      author: 'TBMM',
      views: 15420,
      downloads: 3240
    },
    {
      id: '2',
      title: 'Medeni Kanun',
      type: 'Kanun',
      number: '4721',
      date: '2001-11-22',
      status: 'Yürürlükte',
      description: 'Türk Medeni Kanunu, kişiler, aile, miras ve eşya hukukunu düzenler. Kişilik hakları ve aile hukuku konularını kapsar.',
      author: 'TBMM',
      views: 12850,
      downloads: 2890
    },
    {
      id: '3',
      title: 'Borçlar Kanunu',
      type: 'Kanun',
      number: '6098',
      date: '2011-01-11',
      status: 'Yürürlükte',
      description: 'Türk Borçlar Kanunu, borç ilişkilerini düzenleyen kanun metnidir. Genel hükümler ve özel borç ilişkileri yer alır.',
      author: 'TBMM',
      views: 9870,
      downloads: 2150
    },
    {
      id: '4',
      title: 'İcra ve İflas Kanunu',
      type: 'Kanun',
      number: '2004',
      date: '1932-06-09',
      status: 'Yürürlükte',
      description: 'İcra ve iflas işlemlerini düzenleyen kanun metnidir. Cebri icra yolları ve iflas hukuku konularını içerir.',
      author: 'TBMM',
      views: 7560,
      downloads: 1680
    },
    {
      id: '5',
      title: 'Hukuk Muhakemeleri Kanunu',
      type: 'Kanun',
      number: '6100',
      date: '2011-01-12',
      status: 'Yürürlükte',
      description: 'Hukuk davalarının nasıl yürütüleceğini düzenleyen kanun metnidir. Dava şartları ve usul kuralları yer alır.',
      author: 'TBMM',
      views: 6540,
      downloads: 1420
    },
    {
      id: '6',
      title: 'Türk Ticaret Kanunu',
      type: 'Kanun',
      number: '6102',
      date: '2011-01-13',
      status: 'Yürürlükte',
      description: 'Ticari işletme, şirketler, kıymetli evrak ve deniz ticareti hukukunu düzenleyen kanun metnidir.',
      author: 'TBMM',
      views: 5430,
      downloads: 1280
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLegislations(mockLegislations)
      setFilteredLegislations(mockLegislations)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = legislations

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(legislation =>
        legislation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        legislation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        legislation.number.includes(searchTerm)
      )
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(legislation => legislation.type === selectedType)
    }

    setFilteredLegislations(filtered)
  }, [searchTerm, selectedType, legislations])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value)
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Kanun':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Kanun</span>
      case 'Yönetmelik':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Yönetmelik</span>
      case 'Tüzük':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Tüzük</span>
      case 'Kararname':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Kararname</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{type}</span>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Mevzuat yükleniyor...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mevzuat</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Güncel kanunlar, yönetmelikler ve mevzuat metinlerine erişin</p>
            </div>
            {isAuthenticated && (isAdmin || isEditor) && (
              <Link
                href="/legislation/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Mevzuat Ekle
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Mevzuat ara..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={handleTypeFilter}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Tüm Türler</option>
                <option value="Kanun">Kanun</option>
                <option value="Yönetmelik">Yönetmelik</option>
                <option value="Tüzük">Tüzük</option>
                <option value="Kararname">Kararname</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {filteredLegislations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLegislations.map((legislation) => (
                <div key={legislation.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700 transition-colors">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {getTypeBadge(legislation.type)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">No: {legislation.number}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {legislation.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {legislation.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {legislation.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>{legislation.author}</span>
                      <span>{new Date(legislation.date).toLocaleDateString('tr-TR')}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {legislation.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {legislation.downloads.toLocaleString()}
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
                <FileText className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Mevzuat bulunamadı</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Arama kriterlerinize uygun mevzuat bulunamadı. Farklı anahtar kelimeler deneyin veya filtreleri değiştirin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
