'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Calendar, 
  User, 
  Tag, 
  Eye, 
  Star, 
  Share2, 
  MessageCircle, 
  Bookmark,
  Edit,
  Trash2,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import CommentForm from '@/components/CommentForm'
import CommentList from '@/components/CommentList'
import RatingSystem from '@/components/RatingSystem'
import CitationList from '@/components/CitationList'

interface Publication {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    id: string
    name: string
    surname: string
    profession: string
    bio?: string
    avatar?: string
  }
  category: string
  tags: string[]
  publishedAt: string
  updatedAt: string
  readTime: number
  viewCount: number
  rating: number
  ratingCount: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featuredImage?: string
  allowComments: boolean
  allowRatings: boolean
}

export default function TestPublicationPage() {
  const { user, isAuthor, isEditor, isAdmin } = useAuth()
  const [publication] = useState<Publication>({
    id: 'test',
    title: 'Test Yayını: TBK m.27 Genel İşlem Şartları',
    excerpt: 'Bu bir test yayınıdır. Puanlama ve yorum sistemlerini test etmek için oluşturulmuştur.',
    content: `
      <h2>Test İçeriği</h2>
      <p>Bu yayın, puanlama ve yorum sistemlerini test etmek için oluşturulmuştur.</p>
      
      <h3>Özellikler</h3>
      <ul>
        <li>Puanlama sistemi (1-5 yıldız)</li>
        <li>Yorum ekleme ve listeleme</li>
        <li>Mock data ile API hatalarında fallback</li>
        <li>Responsive tasarım</li>
      </ul>
      
      <h3>Test Senaryoları</h3>
      <p>Aşağıdaki özellikleri test edebilirsiniz:</p>
      <ul>
        <li>Yıldızlara tıklayarak puan verme</li>
        <li>Yorum ekleme</li>
        <li>Mevcut yorumları görüntüleme</li>
        <li>Puanlama istatistiklerini görme</li>
      </ul>
    `,
    author: {
      id: '1',
      name: 'Test',
      surname: 'Yazar',
      profession: 'Avukat',
      bio: 'Test yazarı - Sistem testleri için oluşturulmuştur.',
      avatar: 'https://via.placeholder.com/100x100'
    },
    category: 'Test',
    tags: ['Test', 'Puanlama', 'Yorum', 'Sistem'],
    publishedAt: '2024-08-13T10:00:00Z',
    updatedAt: '2024-08-13T10:00:00Z',
    readTime: 2,
    viewCount: 100,
    rating: 4.5,
    ratingCount: 10,
    status: 'PUBLISHED',
    featuredImage: 'https://via.placeholder.com/800x400',
    allowComments: true,
    allowRatings: true
  })

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [refreshComments, setRefreshComments] = useState(0)
  const [refreshRatings, setRefreshRatings] = useState(0)

  const handleCommentAdded = () => {
    setRefreshComments(prev => prev + 1)
  }

  const handleRatingUpdated = () => {
    setRefreshRatings(prev => prev + 1)
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const sharePublication = () => {
    if (navigator.share) {
      navigator.share({
        title: publication.title,
        text: publication.excerpt,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link kopyalandı!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/publications" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Yayınlara Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{publication.title}</h1>
          <p className="text-lg text-gray-600">{publication.excerpt}</p>
        </div>

        {/* Yayın Meta Bilgileri */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(publication.publishedAt).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{publication.author.name} {publication.author.surname}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <span>{publication.category}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{publication.viewCount} görüntüleme</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{publication.readTime} dk okuma</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{publication.rating} ({publication.ratingCount} puan)</span>
            </div>
          </div>

          {/* Etiketler */}
          <div className="flex flex-wrap gap-2">
            {publication.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Yayın İçeriği */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: publication.content }}
          />
        </div>

        {/* Atıflar */}
        <div className="mb-8">
          <CitationList 
            publicationId={publication.id} 
            onCitationAdded={() => {
              console.log('Atıf eklendi')
            }}
            showAddButton={isAuthor || isEditor || isAdmin}
          />
        </div>

        {/* Puanlama Sistemi */}
        {publication.allowRatings && (
          <div className="mb-8">
            <RatingSystem 
              publicationId={publication.id} 
              onRatingUpdated={handleRatingUpdated}
            />
          </div>
        )}

        {/* Yayın Alt Bilgileri */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Sol Taraf - Yazar Hakkında */}
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Yazar Hakkında</h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  {publication.author.avatar ? (
                    <img
                      src={publication.author.avatar}
                      alt={`${publication.author.name} ${publication.author.surname}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-gray-600">
                      {publication.author.name.charAt(0)}{publication.author.surname.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {publication.author.name} {publication.author.surname}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{publication.author.profession}</p>
                  {publication.author.bio && (
                    <p className="text-sm text-gray-500">{publication.author.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sağ Taraf - Etkileşim */}
            <div className="flex items-center space-x-4">
              {/* Bookmark */}
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full ${
                  isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                } hover:bg-blue-100 hover:text-blue-600`}
                title={isBookmarked ? 'Bookmark\'tan çıkar' : 'Bookmark\'a ekle'}
              >
                <Bookmark className="w-5 h-5" />
              </button>

              {/* Paylaş */}
              <button
                onClick={sharePublication}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                title="Paylaş"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Yorumlar Bölümü */}
        {publication.allowComments && (
          <div className="space-y-6">
            {/* Yorum Formu */}
            <CommentForm 
              publicationId={publication.id} 
              onCommentAdded={handleCommentAdded}
            />
            
            {/* Yorum Listesi */}
            <CommentList 
              publicationId={publication.id} 
              onCommentAdded={handleCommentAdded}
            />
          </div>
        )}

        {/* Test Bilgileri */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-medium text-blue-900 mb-3">Test Bilgileri</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Bu sayfa test amaçlıdır.</strong></p>
            <p>• Puanlama sistemi: 1-5 yıldız ile puan verebilirsiniz</p>
            <p>• Yorum sistemi: Yorum ekleyebilir ve mevcut yorumları görebilirsiniz</p>
            <p>• Mock data: API çalışmadığında örnek veriler gösterilir</p>
            <p>• Responsive: Mobil ve desktop'ta test edilebilir</p>
          </div>
        </div>
      </div>
    </div>
  )
}
