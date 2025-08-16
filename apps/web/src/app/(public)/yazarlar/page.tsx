'use client'

import { useState, useEffect, useMemo } from 'react'
import { Users, Filter, Search, BookOpen, Calendar } from 'lucide-react'
import AuthorCard, { Author } from '@/components/Authors/AuthorCard'
import SearchBar from '@/components/Authors/SearchBar'
import AuthorFilter, { FilterOptions } from '@/components/Authors/AuthorFilter'

// Mock data - gerçek uygulamada API'den gelecek
const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Prof. Dr. Ahmet Yılmaz',
    avatar: '', // Avatar yok, fallback kullanılacak
    expertise: 'Ceza Hukuku',
    bio: 'İstanbul Üniversitesi Hukuk Fakültesi öğretim üyesi. 25 yıllık deneyimi ile ceza hukuku alanında uzmanlaşmış, çok sayıda makale ve kitap yayınlamıştır.',
    publicationCount: 47,
    lastPublicationDate: '2024-07-15',
    profileUrl: '/authors/ahmet-yilmaz'
  },
  {
    id: '2',
    name: 'Av. Fatma Demir',
    avatar: '', // Avatar yok, fallback kullanılacak
    expertise: 'Ticaret Hukuku',
    bio: '20 yıllık avukatlık deneyimi ile ticaret hukuku, şirketler hukuku ve sözleşme hukuku alanlarında uzmanlaşmıştır.',
    publicationCount: 32,
    lastPublicationDate: '2024-07-10',
    profileUrl: '/authors/fatma-demir'
  },
  {
    id: '3',
    name: 'Doç. Dr. Mehmet Kaya',
    avatar: '', // Avatar yok, fallback kullanılacak
    expertise: 'Medeni Hukuk',
    bio: 'Ankara Üniversitesi Hukuk Fakültesi öğretim üyesi. Aile hukuku ve miras hukuku alanlarında uzmanlaşmış, uluslararası yayınları bulunmaktadır.',
    publicationCount: 28,
    lastPublicationDate: '2024-07-08',
    profileUrl: '/authors/mehmet-kaya'
  },
  {
    id: '4',
    name: 'Av. Zeynep Özkan',
    avatar: '', // Avatar yok, fallback kullanılacak
    expertise: 'İş Hukuku',
    bio: '15 yıllık deneyimi ile iş hukuku ve sosyal güvenlik hukuku alanlarında uzmanlaşmış, işçi ve işveren davalarında başarılı sonuçlar elde etmiştir.',
    publicationCount: 23,
    lastPublicationDate: '2024-07-05',
    profileUrl: '/authors/zeynep-ozkan'
  },
  {
    id: '5',
    name: 'Prof. Dr. Mustafa Arslan',
    avatar: '', // Avatar yok, fallback kullanılacak
    expertise: 'Anayasa Hukuku',
    bio: 'Hacettepe Üniversitesi Hukuk Fakültesi öğretim üyesi. Anayasa hukuku ve insan hakları alanlarında uzmanlaşmış, çok sayıda uluslararası yayını bulunmaktadır.',
    publicationCount: 41,
    lastPublicationDate: '2024-07-12',
    profileUrl: '/authors/mustafa-arslan'
  },
  {
    id: '6',
    name: 'Av. Can Yıldız',
    avatar: '', // Avatar yok, fallback kullanılacak
    expertise: 'İdare Hukuku',
    bio: '18 yıllık avukatlık deneyimi ile idare hukuku ve vergi hukuku alanlarında uzmanlaşmış, kamu kurumları ile özel sektör arasındaki uyuşmazlıklarda uzmanlaşmıştır.',
    publicationCount: 19,
    lastPublicationDate: '2024-07-03',
    profileUrl: '/authors/can-yildiz'
  },
  {
    id: '7',
    name: 'Dr. Elif Şahin',
    avatar: '', // Avatar yok, fallback kullanılacak
    expertise: 'Maliye Hukuku',
    bio: 'Marmara Üniversitesi Hukuk Fakültesi öğretim üyesi. Vergi hukuku ve maliye hukuku alanlarında uzmanlaşmış, uluslararası vergi hukuku konularında çalışmalar yapmaktadır.',
    publicationCount: 35,
    lastPublicationDate: '2024-07-14',
    profileUrl: '/authors/elif-sahin'
  },
  {
    id: '8',
    name: 'Av. Burak Koç',
    avatar: '', // Avatar yok, fallback kullanılacak
    expertise: 'Uluslararası Hukuk',
    bio: '12 yıllık deneyimi ile uluslararası ticaret hukuku ve tahkim alanlarında uzmanlaşmış, çok sayıda uluslararası davada başarılı sonuçlar elde etmiştir.',
    publicationCount: 26,
    lastPublicationDate: '2024-07-07',
    profileUrl: '/authors/burak-koc'
  }
]

// Uzmanlık alanları listesi
const expertiseOptions = [
  'Ceza Hukuku',
  'Ticaret Hukuku',
  'Medeni Hukuk',
  'İş Hukuku',
  'Anayasa Hukuku',
  'İdare Hukuku',
  'Maliye Hukuku',
  'Uluslararası Hukuk'
]

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>(mockAuthors)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    expertise: [],
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  // Filtreleme ve sıralama işlemleri
  const filteredAndSortedAuthors = useMemo(() => {
    let result = [...authors]

    // Arama filtresi
    if (searchQuery) {
      result = result.filter(author =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author.bio.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Uzmanlık alanı filtresi
    if (filters.expertise.length > 0) {
      result = result.filter(author =>
        filters.expertise.includes(author.expertise)
      )
    }

    // Sıralama
    result.sort((a, b) => {
      let aValue: string | number | Date
      let bValue: string | number | Date

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'publicationCount':
          aValue = a.publicationCount
          bValue = b.publicationCount
          break
        case 'lastPublicationDate':
          aValue = new Date(a.lastPublicationDate)
          bValue = new Date(b.lastPublicationDate)
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return result
  }, [authors, searchQuery, filters])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mr-4">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                Yazarlar
              </h1>
            </div>
            <p className="text-xl text-blue-100 dark:text-blue-200 max-w-3xl mx-auto leading-relaxed">
              Hukuk alanında uzmanlaşmış yazarlarımızı keşfedin. 
              Uzmanlık alanlarına göre filtreleyin ve en güncel hukuki içeriklere ulaşın.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol Sidebar - Filtreler (Desktop) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Filtreler
                </h3>
                <AuthorFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  expertiseOptions={expertiseOptions}
                />
              </div>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="flex-1">
            {/* Üst Bar - Arama ve Mobil Filtre */}
            <div className="mb-8 space-y-6">
              {/* Arama Çubuğu */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center">
                    Yazar Ara
                  </h3>
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Yazar adı, uzmanlık alanı veya biyografi ara..."
                    className="w-full"
                  />
                </div>
              </div>

              {/* Mobil Filtre Butonu */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filtreleri Göster</span>
                  <svg 
                    className={`h-5 w-5 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Mobil Filtre Panel */}
              {isMobileFilterOpen && (
                <div className="lg:hidden">
                  <AuthorFilter
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    expertiseOptions={expertiseOptions}
                    isMobile={true}
                  />
                </div>
              )}
            </div>

            {/* Sonuç Bilgisi */}
            <div className="mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">{filteredAndSortedAuthors.length}</span> yazar bulundu
                    {searchQuery && (
                      <span className="ml-2">
                        "<span className="font-medium text-blue-600 dark:text-blue-400">{searchQuery}</span>" için
                      </span>
                    )}
                  </p>
                  
                  {/* Aktif Filtreler */}
                  {(filters.expertise.length > 0 || filters.sortBy !== 'name') && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Aktif:</span>
                      {filters.expertise.map(expertise => (
                        <span key={expertise} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                          {expertise}
                        </span>
                      ))}
                      {filters.sortBy !== 'name' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-700">
                          {filters.sortBy === 'publicationCount' ? 'Yayın Sayısı' : 'Son Yayın Tarihi'} 
                          ({filters.sortOrder === 'asc' ? 'Artan' : 'Azalan'})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Yazar Grid */}
            {filteredAndSortedAuthors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredAndSortedAuthors.map((author) => (
                  <AuthorCard key={author.id} author={author} />
                ))}
              </div>
            ) : (
              /* Sonuç Bulunamadı */
              <div className="text-center py-16">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Sonuç bulunamadı
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    Arama kriterlerinize uygun yazar bulunamadı. 
                    Farklı anahtar kelimeler deneyin veya filtreleri temizleyin.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setFilters({
                        expertise: [],
                        sortBy: 'name',
                        sortOrder: 'asc'
                      })
                    }}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Filtreleri Temizle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Bilgisi */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Yazarlar Hakkında
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-3xl mx-auto">
              YargıTam'da yer alan yazarlar, alanlarında uzmanlaşmış akademisyenler, 
              avukatlar ve hukuk profesyonelleridir. Her yazar, kaliteli ve güncel hukuki içerik 
              üretmek için titizlikle seçilmiştir.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                {authors.length} Aktif Yazar
              </span>
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Toplam {authors.reduce((sum, author) => sum + author.publicationCount, 0)} Yayın
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Güncel İçerik
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
