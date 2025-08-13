'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Star, StarHalf, MessageSquare, Users, TrendingUp } from 'lucide-react'

interface Rating {
  id: string
  score: number
  comment?: string
  createdAt: string
  user: {
    id: string
    name: string
    surname: string
    profession: string
  }
}

interface RatingData {
  ratings: Rating[]
  averageRating: number
  totalRatings: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

interface RatingSystemProps {
  publicationId: string
  onRatingUpdated: () => void
}

export default function RatingSystem({ publicationId, onRatingUpdated }: RatingSystemProps) {
  const { user, isAuthenticated } = useAuth()
  const [ratingData, setRatingData] = useState<RatingData | null>(null)
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRatings()
  }, [publicationId])

  const fetchRatings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/publications/${publicationId}/ratings`)
      
      if (!response.ok) {
        throw new Error('Puanlamalar getirilemedi')
      }

      const data = await response.json()
      setRatingData(data)

      // Kullanıcının mevcut puanlamasını bul
      if (isAuthenticated && user) {
        const existingRating = data.ratings.find((r: Rating) => r.user.id === user.id)
        if (existingRating) {
          setUserRating(existingRating.score)
          setComment(existingRating.comment || '')
        }
      }
    } catch (error) {
      console.error('Puanlamalar getirilemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRatingSubmit = async () => {
    if (!userRating) {
      setError('Lütfen bir puan seçin')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`/api/publications/${publicationId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: userRating,
          comment: comment.trim() || null
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Puanlama eklenirken bir hata oluştu')
      }

      setSuccess('Puanlamanız başarıyla kaydedildi!')
      onRatingUpdated()
      fetchRatings()
      
      // Başarı mesajını 3 saniye sonra kaldır
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStarIcon = (index: number, rating: number) => {
    if (index <= rating) {
      return <Star className="w-6 h-6 text-yellow-400 fill-current" />
    } else if (index === Math.ceil(rating) && rating % 1 !== 0) {
      return <StarHalf className="w-6 h-6 text-yellow-400 fill-current" />
    } else {
      return <Star className="w-6 h-6 text-gray-300" />
    }
  }

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Mükemmel'
    if (rating >= 4.0) return 'Çok İyi'
    if (rating >= 3.5) return 'İyi'
    if (rating >= 3.0) return 'Orta'
    if (rating >= 2.5) return 'Fena Değil'
    if (rating >= 2.0) return 'Kötü'
    return 'Çok Kötü'
  }

  const getProfessionText = (profession: string) => {
    switch (profession) {
      case 'LAWYER':
        return 'Avukat'
      case 'JUDGE':
        return 'Hakim'
      case 'PROSECUTOR':
        return 'Savcı'
      case 'ACADEMIC':
        return 'Akademisyen'
      default:
        return 'Hukukçu'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Puanlamalar yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!ratingData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">Puanlamalar yüklenemedi</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Taraf - Genel Puanlama */}
        <div className="lg:col-span-1">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {ratingData.averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-3">
              {[1, 2, 3, 4, 5].map((index) => (
                <span key={index} className="mx-1">
                  {getStarIcon(index, ratingData.averageRating)}
                </span>
              ))}
            </div>
            <div className="text-lg font-medium text-gray-700 mb-1">
              {getRatingText(ratingData.averageRating)}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {ratingData.totalRatings} puanlama
            </div>
            
            {/* Puan Dağılımı */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((score) => {
                const count = ratingData.ratingDistribution[score as keyof typeof ratingData.ratingDistribution]
                const percentage = ratingData.totalRatings > 0 ? (count / ratingData.totalRatings) * 100 : 0
                
                return (
                  <div key={score} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 w-4">{score}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Kullanıcı Puanlaması */}
        <div className="lg:col-span-2">
          {!isAuthenticated ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 mb-3">
                Puanlama yapabilmek için giriş yapmanız gerekiyor
              </p>
              <a
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Giriş Yap
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Bu yayını puanlayın
                </h4>
                
                {/* Yıldız Puanlaması */}
                <div className="flex items-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setUserRating(index)}
                      onMouseEnter={() => setHoverRating(index)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-colors"
                    >
                      {index <= (hoverRating || userRating) ? (
                        <Star className="w-8 h-8 text-yellow-400 fill-current hover:text-yellow-500" />
                      ) : (
                        <Star className="w-8 h-8 text-gray-300 hover:text-yellow-400" />
                      )}
                    </button>
                  ))}
                  <span className="ml-3 text-sm text-gray-600">
                    {userRating > 0 && `${userRating} yıldız`}
                  </span>
                </div>

                {/* Yorum Alanı */}
                <div className="mb-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Puanlamanız hakkında kısa bir yorum yazabilirsiniz (isteğe bağlı)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-500">
                      {comment.length}/500 karakter
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-md p-3">
                    {success}
                  </div>
                )}

                <button
                  onClick={handleRatingSubmit}
                  disabled={isSubmitting || userRating === 0}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    'Puanlamayı Kaydet'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Son Puanlamalar */}
      {ratingData.ratings.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-gray-400" />
            Son Puanlamalar
          </h4>
          <div className="space-y-3">
            {ratingData.ratings.slice(0, 5).map((rating) => (
              <div key={rating.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xs">
                    {rating.user.name[0]}{rating.user.surname[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-gray-900">
                      {rating.user.name} {rating.user.surname}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getProfessionText(rating.user.profession)}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {rating.comment}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <span key={index}>
                      {index <= rating.score ? (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      ) : (
                        <Star className="w-4 h-4 text-gray-300" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
