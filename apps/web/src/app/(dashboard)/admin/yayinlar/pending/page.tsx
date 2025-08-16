'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  FileText, Search, Filter, Eye, CheckCircle, XCircle, Clock,
  MessageSquare, User, Calendar, AlertCircle
} from 'lucide-react'

interface PendingPublication {
  id: string
  title: string
  author: {
    name: string
    surname: string
    profession: string
    verified: boolean
  }
  category: string
  submittedAt: string
  excerpt: string
  tags: string[]
  estimatedReadTime: number
  hasComments: boolean
  priority: 'low' | 'medium' | 'high'
}

const mockPendingPublications: PendingPublication[] = [
  {
    id: '1',
    title: 'Ceza Hukukunda Kusur Unsuru ve Sorumluluk',
    author: { name: 'Fatma', surname: 'Demir', profession: 'Hakim', verified: true },
    category: 'Ceza Hukuku',
    submittedAt: '2024-08-13',
    excerpt: 'Bu makalede, ceza hukukunda kusur unsuru ve sorumluluk konuları detaylı olarak incelenmektedir...',
    tags: ['Ceza Hukuku', 'Kusur', 'Sorumluluk'],
    estimatedReadTime: 8,
    hasComments: false,
    priority: 'high'
  },
  {
    id: '2',
    title: 'İş Hukukunda İşçi Hakları ve Koruması',
    author: { name: 'Mehmet', surname: 'Kaya', profession: 'Avukat', verified: true },
    category: 'İş Hukuku',
    submittedAt: '2024-08-12',
    excerpt: 'İş hukukunda işçi hakları ve koruması konuları ele alınmaktadır...',
    tags: ['İş Hukuku', 'İşçi Hakları', 'Koruma'],
    estimatedReadTime: 12,
    hasComments: true,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Ticaret Hukukunda Şirket Türleri ve Kuruluş',
    author: { name: 'Zeynep', surname: 'Özkan', profession: 'Avukat', verified: false },
    category: 'Ticaret Hukuku',
    submittedAt: '2024-08-11',
    excerpt: 'Ticaret hukukunda şirket türleri ve kuruluş süreçleri detaylandırılmaktadır...',
    tags: ['Ticaret Hukuku', 'Şirket', 'Kuruluş'],
    estimatedReadTime: 15,
    hasComments: false,
    priority: 'low'
  },
  {
    id: '4',
    title: 'Aile Hukukunda Boşanma Süreçleri',
    author: { name: 'Ali', surname: 'Yıldız', profession: 'Avukat', verified: true },
    category: 'Aile Hukuku',
    submittedAt: '2024-08-10',
    excerpt: 'Aile hukukunda boşanma süreçleri ve yasal düzenlemeler incelenmektedir...',
    tags: ['Aile Hukuku', 'Boşanma', 'Süreç'],
    estimatedReadTime: 10,
    hasComments: true,
    priority: 'medium'
  }
]

export default function PendingPublicationsPage() {
  const { user, isAuthenticated, isAdmin, isEditor } = useAuth()
  const router = useRouter()
  const [publications, setPublications] = useState<PendingPublication[]>(mockPendingPublications)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all')

  useEffect(() => {
    if (isAuthenticated && !isAdmin && !isEditor) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isAdmin, isEditor, router])

  if (!isAuthenticated || (!isAdmin && !isEditor)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.author.surname.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || pub.category === categoryFilter
    const matchesPriority = priorityFilter === 'all' || pub.priority === priorityFilter
    const matchesVerified = verifiedFilter === 'all' || 
                           (verifiedFilter === 'verified' && pub.author.verified) ||
                           (verifiedFilter === 'unverified' && !pub.author.verified)
    
    return matchesSearch && matchesCategory && matchesPriority && matchesVerified
  })

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'low':
        return <Clock className="w-4 h-4 text-green-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Yüksek'
      case 'medium':
        return 'Orta'
      case 'low':
        return 'Düşük'
      default:
        return 'Bilinmiyor'
    }
  }

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleApprove = (id: string) => {
    if (confirm('Bu yayını onaylamak istediğinizden emin misiniz?')) {
      setPublications(prev => prev.filter(pub => pub.id !== id))
      // Here you would typically make an API call to approve the publication
    }
  }

  const handleReject = (id: string) => {
    const reason = prompt('Red sebebini girin:')
    if (reason) {
      setPublications(prev => prev.filter(pub => pub.id !== id))
      // Here you would typically make an API call to reject the publication
    }
  }

  const handleView = (id: string) => {
    router.push(`/admin/publications/${id}/review`)
  }

  const stats = {
    total: publications.length,
    highPriority: publications.filter(p => p.priority === 'high').length,
    verifiedAuthors: publications.filter(p => p.author.verified).length,
    unverifiedAuthors: publications.filter(p => !p.author.verified).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bekleyen Onaylar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Onay bekleyen yayınları inceleyin ve karar verin
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{publications.length} yayın onay bekliyor</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Bekleyen</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Yüksek Öncelik</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{stats.verifiedAuthors}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Doğrulanmış Yazar</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">{stats.unverifiedAuthors}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Doğrulanmamış Yazar</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Yayın başlığı veya yazar ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="Ceza Hukuku">Ceza Hukuku</option>
              <option value="İş Hukuku">İş Hukuku</option>
              <option value="Ticaret Hukuku">Ticaret Hukuku</option>
              <option value="Aile Hukuku">Aile Hukuku</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Öncelikler</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Yazarlar</option>
              <option value="verified">Doğrulanmış</option>
              <option value="unverified">Doğrulanmamış</option>
            </select>
          </div>
        </div>
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPublications.map((publication) => (
          <div
            key={publication.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {publication.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {publication.author.name} {publication.author.surname}
                    </span>
                    {publication.author.verified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Doğrulanmış
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadgeClass(publication.priority)}`}>
                {getPriorityIcon(publication.priority)}
                <span className="ml-1">{getPriorityText(publication.priority)}</span>
              </span>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                {publication.excerpt}
              </p>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(publication.submittedAt).toLocaleDateString('tr-TR')}
                </span>
                <span>📖 {publication.estimatedReadTime} dk</span>
                {publication.hasComments && (
                  <span className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Yorum var
                  </span>
                )}
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {publication.category}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {publication.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleView(publication.id)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Eye className="w-4 h-4" />
                <span>İncele</span>
              </button>
              <button
                onClick={() => handleApprove(publication.id)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Onayla</span>
              </button>
              <button
                onClick={() => handleReject(publication.id)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <XCircle className="w-4 h-4" />
                <span>Reddet</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPublications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Onay bekleyen yayın bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Arama kriterlerinize uygun onay bekleyen yayın bulunamadı.
          </p>
        </div>
      )}
    </div>
  )
}
