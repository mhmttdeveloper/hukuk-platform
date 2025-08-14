'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Save, Eye, X, Plus, Image } from 'lucide-react'
import TiptapEditor from '@/components/TiptapEditor'
import SEOAssistant from '@/components/SEOAssistant'
import CitationForm from '@/components/CitationForm'


interface PublicationForm {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  status: 'DRAFT' | 'PUBLISHED'
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  featuredImage: string
  allowComments: boolean
  allowRatings: boolean
}

const categories = [
  'Hukuki Makale',
  'Yargıtay Kararı',
  'Kanun Yorumu',
  'Pratik Bilgi',
  'Güncel Gelişme',
  'Doktrin',
  'Karşılaştırmalı Hukuk'
]

export default function NewPublicationPage() {
  const { user, isAuthor, isEditor, isAdmin } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSEO, setShowSEO] = useState(false)
  const [showCitationForm, setShowCitationForm] = useState(false)
  const [showOGImage, setShowOGImage] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newKeyword, setNewKeyword] = useState('')

  const [formData, setFormData] = useState<PublicationForm>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    featuredImage: '',
    allowComments: true,
    allowRatings: true
  })

  // Yetki kontrolü - useEffect içinde yapılmalı
  useEffect(() => {
    if (user && (!isAuthor && !isEditor && !isAdmin)) {
      router.push('/auth/signin')
    }
  }, [user, isAuthor, isEditor, isAdmin, router])

  // Yetki yoksa loading göster
  if (!user || (!isAuthor && !isEditor && !isAdmin)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yetki kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: keyof PublicationForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // SEO alanlarını otomatik doldur
    if (field === 'title' && !formData.seoTitle) {
      setFormData(prev => ({ ...prev, seoTitle: value }))
    }
    if (field === 'excerpt' && !formData.seoDescription) {
      setFormData(prev => ({ ...prev, seoDescription: value }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.seoKeywords.includes(newKeyword.trim())) {
      setFormData(prev => ({ ...prev, seoKeywords: [...prev.seoKeywords, newKeyword.trim()] }))
      setNewKeyword('')
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({ ...prev, seoKeywords: prev.seoKeywords.filter(keyword => keyword !== keywordToRemove) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: API'ye yayın verilerini gönder
      console.log('Yayın verileri:', formData)
      
      // Başarılı kayıt sonrası yönlendirme
      router.push('/publications')
    } catch (error) {
      console.error('Yayın kaydedilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsLoading(true)
    
    try {
      const draftData = { ...formData, status: 'DRAFT' }
      // TODO: Taslak olarak kaydet
      console.log('Taslak kaydediliyor:', draftData)
      
      router.push('/publications')
    } catch (error) {
      console.error('Taslak kaydedilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Yeni Yayın Oluştur</h1>
              <p className="mt-2 text-gray-600">Hukuki yayınınızı oluşturun ve yayınlayın</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Düzenlemeyi Göster' : 'Önizleme'}
              </button>
              <button
                onClick={() => setShowOGImage(!showOGImage)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Image className="w-4 h-4 mr-2" />
                {showOGImage ? 'OG Görseli Gizle' : 'OG Görseli'}
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Taslak Kaydet
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ana Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Temel Bilgiler */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Başlık *
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Yayın başlığını girin..."
                    />
                  </div>

                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                      Özet *
                    </label>
                    <textarea
                      id="excerpt"
                      required
                      rows={3}
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Yayın özetini girin..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                      </label>
                      <select
                        id="category"
                        required
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Kategori seçin</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Durum
                      </label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="DRAFT">Taslak</option>
                        <option value="PUBLISHED">Yayınla</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                      Etiketler
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Etiket ekleyin..."
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                      Öne Çıkan Görsel URL
                    </label>
                    <input
                      type="url"
                      id="featuredImage"
                      value={formData.featuredImage}
                      onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* İçerik Editörü */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">İçerik</h3>
                <TiptapEditor
                  content={formData.content}
                  onChange={(content) => handleInputChange('content', content)}
                  placeholder="Yayın içeriğinizi buraya yazın..."
                  showCitationButton={true}
                  onAddCitation={() => setShowCitationForm(true)}
                />
              </div>

              {/* Ayarlar */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Yayın Ayarları</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Yorumlara İzin Ver</h4>
                      <p className="text-sm text-gray-500">Kullanıcıların yayına yorum yapmasına izin ver</p>
                    </div>
                    <input
                      type="checkbox"
                      id="allowComments"
                      checked={formData.allowComments}
                      onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Puanlamaya İzin Ver</h4>
                      <p className="text-sm text-gray-500">Kullanıcıların yayını puanlamasına izin ver</p>
                    </div>
                    <input
                      type="checkbox"
                      id="allowRatings"
                      checked={formData.allowRatings}
                      onChange={(e) => handleInputChange('allowRatings', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isLoading ? 'Kaydediliyor...' : 'Yayınla'}
                </button>
              </div>
            </form>
          </div>

          {/* Sağ Sidebar */}
          <div className="space-y-6">
            {/* OG Görsel Önizleme */}
            {formData.title && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">OG Görsel Önizleme</h3>
                  <button
                    onClick={() => setShowOGImage(!showOGImage)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showOGImage ? 'Gizle' : 'Göster'}
                  </button>
                </div>
                

              </div>
            )}

            {/* SEO Asistanı */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">SEO Asistanı</h3>
                <button
                  onClick={() => setShowSEO(!showSEO)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showSEO ? 'Gizle' : 'Göster'}
                </button>
              </div>
              
              {showSEO && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Başlığı
                    </label>
                    <input
                      type="text"
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SEO için özel başlık..."
                    />
                  </div>

                  <div>
                    <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Açıklaması
                    </label>
                    <textarea
                      id="seoDescription"
                      rows={3}
                      value={formData.seoDescription}
                      onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SEO için özel açıklama..."
                    />
                  </div>

                  <div>
                    <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Anahtar Kelimeleri
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Anahtar kelime ekleyin..."
                      />
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.seoKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Analizi */}
              {showSEO && (
                <div className="mt-6">
                  <SEOAssistant
                    title={formData.seoTitle || formData.title}
                    description={formData.seoDescription || formData.excerpt}
                    content={formData.content}
                    keywords={formData.seoKeywords}
                    onUpdate={handleInputChange}
                  />
                </div>
              )}
            </div>

            {/* Önizleme */}
            {showPreview && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Önizleme</h3>
                
                {formData.title && (
                  <div className="mb-4">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">{formData.title}</h1>
                    {formData.excerpt && (
                      <p className="text-gray-600 text-sm">{formData.excerpt}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                      <span>{user?.name}</span>
                      <span>•</span>
                      <span>{formData.category}</span>
                      <span>•</span>
                      <span>{formData.status === 'DRAFT' ? 'Taslak' : 'Yayında'}</span>
                    </div>
                  </div>
                )}

                {formData.content && (
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                  </div>
                )}
              </div>
            )}


          </div>
        </div>
      </div>

      {/* Atıf Ekleme Formu */}
      {showCitationForm && (
        <CitationForm
          publicationId="new" // Yeni yayın için geçici ID
          onCitationAdded={() => {
            // Yeni yayın için atıf ekleme işlemi
            setShowCitationForm(false)
          }}
          onClose={() => setShowCitationForm(false)}
        />
      )}
    </div>
  )
}
