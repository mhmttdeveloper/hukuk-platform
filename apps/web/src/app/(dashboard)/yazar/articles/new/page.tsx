'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import TiptapEditor from '@/components/TiptapEditor'

interface ArticleForm {
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  isPublished: boolean
}

export default function NewArticlePage() {
  const { user, isAuthenticated, isAuthor } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState<ArticleForm>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    isPublished: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<ArticleForm>>({})
  const [showPreview, setShowPreview] = useState(false)

  const categories = [
    'İş Hukuku',
    'Aile Hukuku',
    'Eşya Hukuku',
    'Ticaret Hukuku',
    'Ceza Hukuku',
    'İdare Hukuku',
    'Anayasa Hukuku',
    'Uluslararası Hukuk',
    'Maliye Hukuku',
    'Çevre Hukuku'
  ]

  const handleInputChange = (field: keyof ArticleForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (!form.tags.includes(newTag) && form.tags.length < 5) {
        setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
        e.currentTarget.value = ''
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ArticleForm> = {}

    if (!form.title.trim()) {
      newErrors.title = 'Başlık gereklidir'
    } else if (form.title.length < 10) {
      newErrors.title = 'Başlık en az 10 karakter olmalıdır'
    }

    if (!form.excerpt.trim()) {
      newErrors.excerpt = 'Özet gereklidir'
    } else if (form.excerpt.length < 50) {
      newErrors.excerpt = 'Özet en az 50 karakter olmalıdır'
    }

    if (!form.content.trim()) {
      newErrors.content = 'İçerik gereklidir'
    } else if (form.content.length < 200) {
      newErrors.content = 'İçerik en az 200 karakter olmalıdır'
    }

    if (!form.category) {
      newErrors.category = 'Kategori seçimi gereklidir'
    }

    if (form.tags.length === 0) {
      newErrors.tags = ['En az bir etiket eklenmelidir']
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success - redirect to articles list
      router.push('/author/articles')
    } catch (error) {
      console.error('Yazı kaydedilirken hata:', error)
      alert('Yazı kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    setForm(prev => ({ ...prev, isPublished: false }))
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call for draft
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Taslak başarıyla kaydedildi!')
      router.push('/author/articles')
    } catch (error) {
      console.error('Taslak kaydedilirken hata:', error)
      alert('Taslak kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCitation = () => {
    alert('Atıf ekleme özelliği yakında eklenecek!')
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/author/articles"
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Yeni Yazı
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Yeni bir hukuki makale yazın
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 mr-2 inline" />
            {showPreview ? 'Düzenle' : 'Önizle'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Başlık *
          </label>
          <input
            type="text"
            id="title"
            value={form.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.title 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Makale başlığını girin..."
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Category and Tags Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategori *
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.category 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Kategori seçin</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Etiketler * (En fazla 5)
            </label>
            <input
              type="text"
              id="tags"
              onKeyDown={handleTagInput}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.tags 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter tuşu ile etiket ekleyin..."
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.tags}
              </p>
            )}
            
            {/* Tags Display */}
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Özet *
          </label>
          <textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.excerpt 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Makalenin kısa özetini girin..."
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.excerpt}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {form.excerpt.length}/500 karakter
          </p>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            İçerik *
          </label>
          <TiptapEditor
            content={form.content}
            onChange={(content) => handleInputChange('content', content)}
            placeholder="Makale içeriğini buraya yazın..."
            className="min-h-[400px]"
            onAddCitation={handleAddCitation}
            showCitationButton={true}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.content}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2 inline" />
            Taslak Olarak Kaydet
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                Kaydediliyor...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2 inline" />
                Yayınla
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
