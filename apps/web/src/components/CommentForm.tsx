'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Send, AlertCircle } from 'lucide-react'

interface CommentFormProps {
  publicationId: string
  onCommentAdded: () => void
}

export default function CommentForm({ publicationId, onCommentAdded }: CommentFormProps) {
  const { user, isAuthenticated } = useAuth()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('Yorum içeriği boş olamaz')
      return
    }

    if (content.length < 10) {
      setError('Yorum en az 10 karakter olmalıdır')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/publications/${publicationId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Yorum eklenirken bir hata oluştu')
      }

      setSuccess('Yorumunuz başarıyla eklendi ve onay için gönderildi')
      setContent('')
      onCommentAdded()
      
      // Başarı mesajını 3 saniye sonra kaldır
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-800 mb-3">
          Yorum yapabilmek için giriş yapmanız gerekiyor
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {user?.name?.[0]}{user?.surname?.[0]}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">
            {user?.name} {user?.surname}
          </h3>
          <p className="text-sm text-gray-500">
            {user?.profession === 'LAWYER' ? 'Avukat' : 
             user?.profession === 'JUDGE' ? 'Hakim' : 
             user?.profession === 'PROSECUTOR' ? 'Savcı' : 
             user?.profession === 'ACADEMIC' ? 'Akademisyen' : 'Hukukçu'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Yorumunuzu buraya yazın... (en az 10 karakter)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {content.length}/1000 karakter
            </span>
            <span className="text-xs text-gray-500">
              {content.length < 10 ? `${10 - content.length} karakter daha gerekli` : '✓'}
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Yorumunuz onay için gönderilecek ve kısa süre içinde yayınlanacaktır.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || content.length < 10}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Yorum Gönder
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
