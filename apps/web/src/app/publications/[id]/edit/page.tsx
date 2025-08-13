'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Save, Eye, X, Plus, ArrowLeft, Image } from 'lucide-react'
import Link from 'next/link'
import TiptapEditor from '@/components/TiptapEditor'
import SEOAssistant from '@/components/SEOAssistant'
import CitationForm from '@/components/CitationForm'
import OGImagePreview from '@/components/OGImagePreview'

interface PublicationForm {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
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

export default function EditPublicationPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthor, isEditor, isAdmin } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSEO, setShowSEO] = useState(false)
  const [showCitationForm, setShowCitationForm] = useState(false)
  const [showOGImage, setShowOGImage] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newKeyword, setNewKeyword] = useState('')
  const [error, setError] = useState('')

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

  useEffect(() => {
    if (params.id) {
      fetchPublication()
    }
  }, [params.id])

  // Yetki kontrolü
  if (!user || (!isAuthor && !isEditor && !isAdmin)) {
    router.push('/auth/signin')
    return null
  }

  const fetchPublication = async () => {
    try {
      // TODO: API'den yayın verilerini getir
      // Simüle edilmiş veri
      const mockPublication: PublicationForm = {
        title: 'Türk Borçlar Kanunu 6098 Madde 27 Yorumu: Genel İşlem Şartları',
        excerpt: 'Bu makalede, TBK m. 27\'de düzenlenen genel işlem şartları konusu detaylı olarak incelenmektedir. Genel işlem şartlarının tanımı, kapsamı ve uygulama alanları ele alınmıştır.',
        content: `
          <h2>Giriş</h2>
          <p>Türk Borçlar Kanunu'nun 27. maddesi, genel işlem şartlarını düzenleyen önemli bir hükümdür. Bu madde, ticari hayatta sıkça karşılaşılan standart sözleşme şartlarının hukuki çerçevesini çizmektedir.</p>
          
          <h2>Genel İşlem Şartlarının Tanımı</h2>
          <p>Genel işlem şartları, bir tarafın diğer tarafa önceden hazırlanmış olarak sunduğu ve karşı tarafın kabul etmekten başka seçeneği bulunmadığı sözleşme şartlarıdır.</p>
          
          <h2>TBK m. 27'nin Kapsamı</h2>
          <p>Madde 27, genel işlem şartlarının geçerlilik koşullarını ve sınırlarını belirlemektedir. Bu kapsamda:</p>
          <ul>
            <li>Şartların açık ve anlaşılır olması</li>
            <li>Karşı tarafın bilgi sahibi olması</li>
            <li>Haksız şartların geçersizliği</li>
          </ul>
          
          <h2>Uygulama Örnekleri</h2>
          <p>Pratik hayatta genel işlem şartlarına şu örnekler verilebilir:</p>
          <ul>
            <li>Banka sözleşmeleri</li>
            <li>Sigorta poliçeleri</li>
            <li>Alışveriş sözleşmeleri</li>
            <li>Hizmet sözleşmeleri</li>
          </ul>
          
          <h2>Sonuç</h2>
          <p>Genel işlem şartları, modern ticari hayatın vazgeçilmez unsurlarıdır. Ancak bu şartların hukuki geçerliliği, TBK m. 27'de belirtilen koşullara bağlıdır.</p>
        `,
        category: 'Hukuki Makale',
        tags: ['Borçlar Hukuku', 'Genel İşlem Şartları', 'TBK', 'Sözleşme Hukuku'],
        status: 'PUBLISHED',
        seoTitle: 'TBK Madde 27 Genel İşlem Şartları - Hukuki Yorum ve Analiz',
        seoDescription: 'Türk Borçlar Kanunu 6098 Madde 27 genel işlem şartları hakkında detaylı hukuki yorum ve analiz. TBK m. 27 kapsamı, uygulama örnekleri ve hukuki sonuçlar.',
        seoKeywords: ['TBK', 'Borçlar Hukuku', 'Genel İşlem Şartları', 'Sözleşme Hukuku', 'Madde 27'],
        featuredImage: 'https://via.placeholder.com/800x400',
        allowComments: true,
        allowRatings: true
      }
      
      setFormData(mockPublication)
      setIsLoading(false)
    } catch (error) {
      console.error('Yayın getirilemedi:', error)
      setError('Yayın yüklenirken bir hata oluştu')
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof PublicationForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
    setIsSaving(true)

    try {
      // TODO: API'ye güncellenmiş yayın verilerini gönder
      console.log('Güncellenmiş yayın verileri:', formData)
      
      // Başarılı güncelleme sonrası yönlendirme
      router.push(`/publications/${params.id}`)
    } catch (error) {
      console.error('Yayın güncellenemedi:', error)
      setError('Yayın güncellenirken bir hata oluştu')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    
    try {
      const draftData = { ...formData, status: 'DRAFT' }
      // TODO: Taslak olarak kaydet
      console.log('Taslak kaydediliyor:', draftData)
      
      router.push(`/publications/${params.id}`)
    } catch (error) {
      console.error('Taslak kaydedilemedi:', error)
      setError('Taslak kaydedilirken bir hata oluştu')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yayın yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hata</h2>
          <p className="text-gray-600">{error}</p>
          <Link href="/publications" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Yayınlara Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Link
                  href={`/publications/${params.id}`}
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Yayına Dön
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Yayını Düzenle</h1>
              <p className="mt-2 text-gray-600">Yayın bilgilerini güncelleyin</p>
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
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Taslak Kaydet
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

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
                        <option value="ARCHIVED">Arşivle</option>
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
                  disabled={isSaving}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSaving ? 'Güncelleniyor...' : 'Güncelle'}
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
                
                {showOGImage && (
                  <OGImagePreview
                    title={formData.title}
                    subtitle={formData.excerpt}
                    author={user?.name}
                    category={formData.category}
                    readTime={Math.ceil(formData.content.split(' ').length / 200)}
                  />
                )}
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
                        <span>{formData.status === 'DRAFT' ? 'Taslak' : formData.status === 'PUBLISHED' ? 'Yayında' : 'Arşivlenmiş'}</span>
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

              {/* OG Görsel Önizleme */}
              {showOGImage && (
                <div className="mt-6">
                  <OGImagePreview
                    title={formData.title}
                    subtitle={formData.excerpt}
                    author={user?.name}
                    category={formData.category}
                    readTime={Math.ceil(formData.content.split(' ').length / 200)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Atıf Ekleme Formu */}
      {showCitationForm && (
        <CitationForm
          publicationId={params.id as string}
          onCitationAdded={() => {
            setShowCitationForm(false)
          }}
          onClose={() => setShowCitationForm(false)}
        />
      )}
    </div>
  )
}
