'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Citation, CitationType } from '@/types/citation'
import { BookOpen, Gavel, ExternalLink, FileText, Plus, Trash2, Edit, Eye } from 'lucide-react'
import CitationForm from './CitationForm'

interface CitationWithDetails extends Citation {
  law?: {
    id: string
    title: string
    slug: string
  }
  lawArticle?: {
    id: string
    number: string
    text: string
  }
  case?: {
    id: string
    title: string
    court: string
    date: string
  }
}

interface CitationListProps {
  publicationId: string
  onCitationAdded: () => void
  showAddButton?: boolean
}

export default function CitationList({ publicationId, onCitationAdded, showAddButton = true }: CitationListProps) {
  const { user, isAuthenticated, isAdmin, isEditor, isAuthor } = useAuth()
  const [citations, setCitations] = useState<CitationWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCitation, setEditingCitation] = useState<CitationWithDetails | null>(null)

  useEffect(() => {
    fetchCitations()
  }, [publicationId])

  const fetchCitations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/publications/${publicationId}/citations`)
      
      if (!response.ok) {
        throw new Error('Atıflar getirilemedi')
      }

      const data = await response.json()
      setCitations(data)
    } catch (error) {
      setError('Atıflar yüklenirken bir hata oluştu')
      console.error('Atıflar getirilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCitation = async (citationId: string) => {
    if (!confirm('Bu atıfı silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/publications/${publicationId}/citations/${citationId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Atıf silinemedi')
      }

      fetchCitations()
    } catch (error) {
      alert(`Hata: ${error.message}`)
    }
  }

  const getTypeIcon = (citationType: CitationType) => {
    switch (citationType) {
      case CitationType.LAW_ARTICLE:
        return <Gavel className="w-4 h-4 text-blue-600" />
      case CitationType.COURT_CASE:
        return <BookOpen className="w-4 h-4 text-green-600" />
      case CitationType.EXTERNAL_LINK:
        return <ExternalLink className="w-4 h-4 text-purple-600" />
      case CitationType.BOOK:
        return <BookOpen className="w-4 h-4 text-orange-600" />
      case CitationType.ARTICLE:
        return <FileText className="w-4 h-4 text-red-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeText = (citationType: CitationType) => {
    switch (citationType) {
      case CitationType.LAW_ARTICLE:
        return 'Kanun Maddesi'
      case CitationType.COURT_CASE:
        return 'Mahkeme Kararı'
      case CitationType.EXTERNAL_LINK:
        return 'Dış Bağlantı'
      case CitationType.BOOK:
        return 'Kitap'
      case CitationType.ARTICLE:
        return 'Makale'
      default:
        return 'Diğer'
    }
  }

  const getTypeBadge = (citationType: CitationType) => {
    const colors = {
      [CitationType.LAW_ARTICLE]: 'bg-blue-100 text-blue-800',
      [CitationType.COURT_CASE]: 'bg-green-100 text-green-800',
      [CitationType.EXTERNAL_LINK]: 'bg-purple-100 text-purple-800',
      [CitationType.BOOK]: 'bg-orange-100 text-orange-800',
      [CitationType.ARTICLE]: 'bg-red-100 text-red-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[citationType] || 'bg-gray-100 text-gray-800'}`}>
        {getTypeIcon(citationType)}
        <span className="ml-1">{getTypeText(citationType)}</span>
      </span>
    )
  }

  const canEdit = isAdmin || isEditor || isAuthor

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Atıflar yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <FileText className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchCitations}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            Atıflar ({citations.length})
          </h3>
        </div>
        
        {showAddButton && canEdit && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Atıf Ekle
          </button>
        )}
      </div>

      {citations.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz atıf yok</h4>
          <p className="text-gray-500">
            Bu yayın için ilk atıfı siz ekleyin!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {citations.map((citation) => (
            <div key={citation.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getTypeBadge(citation.type)}
                    <h4 className="font-medium text-gray-900">
                      {citation.title}
                    </h4>
                  </div>
                  
                  {citation.description && (
                    <p className="text-gray-600 mb-3 text-sm">
                      {citation.description}
                    </p>
                  )}

                  {/* Atıf Detayları */}
                  <div className="space-y-2">
                    {citation.type === CitationType.LAW_ARTICLE && citation.law && citation.lawArticle && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Gavel className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            {citation.law.title} - Madde {citation.lawArticle.number}
                          </span>
                        </div>
                        <p className="text-sm text-blue-700">
                          {citation.lawArticle.text}
                        </p>
                        <a
                          href={`/laws/${citation.law.slug}`}
                          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Kanunu görüntüle
                        </a>
                      </div>
                    )}

                    {citation.type === CitationType.COURT_CASE && citation.case && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <BookOpen className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            {citation.case.title}
                          </span>
                        </div>
                        <div className="text-sm text-green-700 space-y-1">
                          <p><strong>Mahkeme:</strong> {citation.case.court}</p>
                          <p><strong>Tarih:</strong> {new Date(citation.case.date).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                    )}

                    {citation.type === CitationType.EXTERNAL_LINK && citation.url && (
                      <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                          <a
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-700 hover:text-purple-900 break-all"
                          >
                            {citation.url}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-3 text-xs text-gray-500">
                    <span>Eklenme: {new Date(citation.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                {/* Düzenleme Butonları */}
                {canEdit && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingCitation(citation)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCitation(citation.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Atıf Ekleme Formu */}
      {showAddForm && (
        <CitationForm
          publicationId={publicationId}
          onCitationAdded={() => {
            fetchCitations()
            onCitationAdded()
            setShowAddForm(false)
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  )
}
