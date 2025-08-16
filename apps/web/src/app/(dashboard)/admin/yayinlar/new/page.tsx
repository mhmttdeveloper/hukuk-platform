'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Plus } from 'lucide-react'
import TiptapEditor from '@/components/TiptapEditor'

interface PublicationForm {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  authorId: string
  status: 'draft' | 'pending' | 'published'
  featured: boolean
  allowComments: boolean
}

const mockAuthors = [
  { id: '1', name: 'Ahmet Yılmaz', profession: 'Avukat', verified: true },
  { id: '2', name: 'Fatma Demir', profession: 'Hakim', verified: true },
  { id: '3', name: 'Mehmet Kaya', profession: 'Avukat', verified: true },
  { id: '4', name: 'Zeynep Özkan', profession: 'Avukat', verified: false }
]

const categories = [
  'Borçlar Hukuku',
  'Ceza Hukuku',
  'İş Hukuku',
  'Ticaret Hukuku',
  'Aile Hukuku',
  'Miras Hukuku',
  'Gayrimenkul Hukuku',
  'Fikri Mülkiyet Hukuku',
  'İdare Hukuku',
  'Anayasa Hukuku'
]

export default function NewPublicationPage() {
  const { user, isAuthenticated, isAdmin, isEditor } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState<PublicationForm>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    authorId: '',
    status: 'draft',
    featured: false,
    allowComments: true
  })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Partial<PublicationForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const validateForm = () => {
    const newErrors: Partial<PublicationForm> = {}

    if (!form.title.trim()) {
      newErrors.title = 'Başlık gereklidir'
    }
    if (!form.content.trim()) {
      newErrors.content = 'İçerik gereklidir'
    }
    if (!form.excerpt.trim()) {
      newErrors.excerpt = 'Özet gereklidir'
    }
    if (!form.category) {
      newErrors.category = 'Kategori seçilmelidir'
    }
    if (!form.authorId) {
      newErrors.authorId = 'Yazar seçilmelidir'
    }
    if (form.tags.length === 0) {
      newErrors.tags = 'En az bir etiket eklenmelidir'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Success - redirect to publications list
      router.push('/admin/publications')
    } catch (error) {
      console.error('Yayın eklenirken hata oluştu:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    // Save to localStorage for preview
    localStorage.setItem('publicationPreview', JSON.stringify(form))
    router.push('/admin/publications/preview')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/admin/publications')}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Yeni Yayın Ekle
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Yeni bir yayın oluşturun ve yönetin
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Eye className="w-4 h-4" />
            <span>Önizle</span>
          </button>
          <button
            type="submit"
            form="publication-form"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      <form id="publication-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Yayın Başlığı *
              </label>
              <input
                type="text"
                id="title"
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Yayın başlığını girin..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                İçerik *
              </label>
              <TiptapEditor
                content={form.content}
                onChange={(content) => setForm(prev => ({ ...prev, content }))}
                placeholder="Yayın içeriğini buraya yazın..."
                className="min-h-[400px]"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Özet *
              </label>
              <textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  errors.excerpt ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Yayının kısa özetini girin..."
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publication Settings */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Yayın Ayarları
              </h3>
              
              {/* Author */}
              <div className="mb-4">
                <label htmlFor="authorId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yazar *
                </label>
                <select
                  id="authorId"
                  value={form.authorId}
                  onChange={(e) => setForm(prev => ({ ...prev, authorId: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.authorId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Yazar seçin</option>
                  {mockAuthors.map(author => (
                    <option key={author.id} value={author.id}>
                      {author.name} ({author.profession}) {author.verified ? '✓' : ''}
                    </option>
                  ))}
                </select>
                {errors.authorId && (
                  <p className="mt-1 text-sm text-red-600">{errors.authorId}</p>
                )}
              </div>

              {/* Category */}
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori *
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                    errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Kategori seçin</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Status */}
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durum
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="draft">Taslak</option>
                  <option value="pending">Onay Bekliyor</option>
                  <option value="published">Yayınlandı</option>
                </select>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Öne çıkan yayın
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.allowComments}
                    onChange={(e) => setForm(prev => ({ ...prev, allowComments: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Yorumlara izin ver
                  </span>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Etiketler
              </h3>
              
              <div className="mb-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Etiket ekleyin..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
