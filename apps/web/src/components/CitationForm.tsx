'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CitationType } from '@shared/types'
import { BookOpen, Gavel, ExternalLink, FileText, Plus, X, AlertCircle } from 'lucide-react'

interface Law {
  id: string
  title: string
  slug: string
  _count: {
    articles: number
  }
}

interface LawArticle {
  id: string
  number: string
  text: string
}

interface Case {
  id: string
  title: string
  court: string
  date: string
}

interface CitationFormProps {
  publicationId: string
  onCitationAdded: () => void
  onClose: () => void
}

export default function CitationForm({ publicationId, onCitationAdded, onClose }: CitationFormProps) {
  const { user, isAuthenticated } = useAuth()
  const [type, setType] = useState<CitationType>('LAW_ARTICLE')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  
  // Kanun ve madde seçimi
  const [selectedLawId, setSelectedLawId] = useState('')
  const [selectedLawArticleId, setSelectedLawArticleId] = useState('')
  const [selectedCaseId, setSelectedCaseId] = useState('')
  
  // Veri listeleri
  const [laws, setLaws] = useState<Law[]>([])
  const [lawArticles, setLawArticles] = useState<LawArticle[]>([])
  const [cases, setCases] = useState<Case[]>([])
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (type === 'LAW_ARTICLE') {
      fetchLaws()
    } else if (type === 'COURT_CASE') {
      fetchCases()
    }
  }, [type])

  useEffect(() => {
    if (selectedLawId && type === 'LAW_ARTICLE') {
      fetchLawArticles(selectedLawId)
    }
  }, [selectedLawId, type])

  const fetchLaws = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/laws?limit=100')
      if (response.ok) {
        const data = await response.json()
        setLaws(data.laws)
      }
    } catch (error) {
      console.error('Kanunlar getirilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLawArticles = async (lawId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/laws/${lawId}/articles`)
      if (response.ok) {
        const data = await response.json()
        setLawArticles(data.articles)
      }
    } catch (error) {
      console.error('Kanun maddeleri getirilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCases = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/cases?limit=100')
      if (response.ok) {
        const data = await response.json()
        setCases(data.cases)
      }
    } catch (error) {
      console.error('Mahkeme kararları getirilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Atıf başlığı gereklidir')
      return
    }

    // Atıf türüne göre gerekli alanları kontrol et
    if (type === 'LAW_ARTICLE' && !selectedLawArticleId) {
      setError('Kanun maddesi seçilmelidir')
      return
    }

    if (type === 'COURT_CASE' && !selectedCaseId) {
      setError('Mahkeme kararı seçilmelidir')
      return
    }

    if (type === 'EXTERNAL_LINK' && !url.trim()) {
      setError('URL gereklidir')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const citationData: any = {
        type,
        title: title.trim(),
        description: description.trim() || null,
        url: url.trim() || null
      }

      if (type === 'LAW_ARTICLE') {
        citationData.lawArticleId = selectedLawArticleId
        const selectedLaw = laws.find(l => l.id === selectedLawId)
        if (selectedLaw) {
          citationData.lawId = selectedLawId
        }
      } else if (type === 'COURT_CASE') {
        citationData.caseId = selectedCaseId
      }

      const response = await fetch(`/api/publications/${publicationId}/citations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(citationData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Atıf eklenirken bir hata oluştu')
      }

      onCitationAdded()
      onClose()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTypeIcon = (citationType: CitationType) => {
    switch (citationType) {
      case 'LAW_ARTICLE':
        return <Gavel className="w-4 h-4" />
      case 'COURT_CASE':
        return <BookOpen className="w-4 h-4" />
      case 'EXTERNAL_LINK':
        return <ExternalLink className="w-4 h-4" />
      case 'BOOK':
        return <BookOpen className="w-4 h-4" />
      case 'ARTICLE':
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeText = (citationType: CitationType) => {
    switch (citationType) {
      case 'LAW_ARTICLE':
        return 'Kanun Maddesi'
      case 'COURT_CASE':
        return 'Mahkeme Kararı'
      case 'EXTERNAL_LINK':
        return 'Dış Bağlantı'
      case 'BOOK':
        return 'Kitap'
      case 'ARTICLE':
        return 'Makale'
      default:
        return 'Diğer'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-800 mb-3">
          Atıf ekleyebilmek için giriş yapmanız gerekiyor
        </p>
        <a
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Giriş Yap
        </a>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Atıf Ekle</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Atıf Türü Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Atıf Türü
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(CitationType).map((citationType) => (
                <button
                  key={citationType}
                  type="button"
                  onClick={() => {
                    setType(citationType)
                    setSelectedLawId('')
                    setSelectedLawArticleId('')
                    setSelectedCaseId('')
                    setUrl('')
                  }}
                  className={`flex items-center space-x-2 p-3 border rounded-lg text-left transition-colors ${
                    type === citationType
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {getTypeIcon(citationType)}
                  <span className="text-sm font-medium">
                    {getTypeText(citationType)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Atıf Başlığı *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Atıf için açıklayıcı başlık girin"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama (İsteğe bağlı)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Atıf hakkında ek bilgi verebilirsiniz"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Kanun Maddesi Seçimi */}
          {type === 'LAW_ARTICLE' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kanun Seçin *
                </label>
                <select
                  value={selectedLawId}
                  onChange={(e) => setSelectedLawId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Kanun seçin</option>
                  {laws.map((law) => (
                    <option key={law.id} value={law.id}>
                      {law.title} ({law._count.articles} madde)
                    </option>
                  ))}
                </select>
              </div>

              {selectedLawId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kanun Maddesi Seçin *
                  </label>
                  <select
                    value={selectedLawArticleId}
                    onChange={(e) => setSelectedLawArticleId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Madde seçin</option>
                    {lawArticles.map((article) => (
                      <option key={article.id} value={article.id}>
                        Madde {article.number}
                      </option>
                    ))}
                  </select>
                  {selectedLawArticleId && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        {lawArticles.find(a => a.id === selectedLawArticleId)?.text}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mahkeme Kararı Seçimi */}
          {type === 'COURT_CASE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mahkeme Kararı Seçin *
              </label>
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Karar seçin</option>
                {cases.map((courtCase) => (
                  <option key={courtCase.id} value={courtCase.id}>
                    {courtCase.title} - {courtCase.court} ({new Date(courtCase.date).toLocaleDateString('tr-TR')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* URL (Dış Bağlantı için) */}
          {type === 'EXTERNAL_LINK' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL *
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Hata Mesajı */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Butonlar */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ekleniyor...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Atıf Ekle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
