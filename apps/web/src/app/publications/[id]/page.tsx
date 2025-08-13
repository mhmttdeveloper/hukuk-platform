'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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

export default function PublicationDetailPage() {
  const params = useParams()
  const { user, isAuthor, isEditor, isAdmin } = useAuth()
  const [publication, setPublication] = useState<Publication | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRating, setUserRating] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [refreshComments, setRefreshComments] = useState(0)
  const [refreshRatings, setRefreshRatings] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchPublication()
    }
  }, [params.id])

  const fetchPublication = async () => {
    try {
      // TODO: API'den yayın detaylarını getir
      // Simüle edilmiş veri
      const mockPublication: Publication = {
        id: params.id as string,
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
        author: {
          id: '1',
          name: 'Ahmet',
          surname: 'Yılmaz',
          profession: 'Avukat',
          bio: '15 yıllık deneyime sahip borçlar hukuku uzmanı. İstanbul Barosu üyesi.',
          avatar: 'https://via.placeholder.com/100x100'
        },
        category: 'Hukuki Makale',
        tags: ['Borçlar Hukuku', 'Genel İşlem Şartları', 'TBK', 'Sözleşme Hukuku', 'Ticaret Hukuku'],
        publishedAt: '2024-08-13T10:00:00Z',
        updatedAt: '2024-08-13T10:00:00Z',
        readTime: 8,
        viewCount: 1250,
        rating: 4.5,
        ratingCount: 23,
        status: 'PUBLISHED',
        featuredImage: 'https://via.placeholder.com/800x400',
        allowComments: true,
        allowRatings: true
      }
      
      setPublication(mockPublication)
      setIsLoading(false)
    } catch (error) {
      console.error('Yayın getirilemedi:', error)
      setError('Yayın yüklenirken bir hata oluştu')
      setIsLoading(false)
    }
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
    // TODO: API'ye kullanıcı puanını gönder
  }

  const handleCommentAdded = () => {
    setRefreshComments(prev => prev + 1)
  }

  const handleRatingUpdated = () => {
    setRefreshRatings(prev => prev + 1)
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // TODO: API'ye bookmark durumunu gönder
  }

  const sharePublication = () => {
    if (navigator.share) {
      navigator.share({
        title: publication?.title,
        text: publication?.excerpt,
        url: window.location.href
      })
    } else {
      // Fallback: URL'yi kopyala
      navigator.clipboard.writeText(window.location.href)
      alert('Link kopyalandı!')
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

  if (error || !publication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hata</h2>
          <p className="text-gray-600">{error || 'Yayın bulunamadı'}</p>
          <Link href="/publications" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Yayınlara Dön
          </Link>
        </div>
      </div>
    )
  }

  if (publication.status === 'DRAFT' && !(isAuthor || isEditor || isAdmin)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-600">Bu yayın henüz yayınlanmamış.</p>
          <Link href="/publications" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Yayınlara Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {publication.featuredImage && (
        <div className="relative h-96 bg-gray-900">
          <img
            src={publication.featuredImage}
            alt={publication.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">{publication.title}</h1>
              <p className="text-xl text-gray-200 mb-4">{publication.excerpt}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Yayın Başlığı (Featured Image yoksa) */}
        {!publication.featuredImage && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{publication.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{publication.excerpt}</p>
          </div>
        )}

        {/* Yayın Meta Bilgileri */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              {/* Yazar Bilgisi */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  {publication.author.avatar ? (
                    <img
                      src={publication.author.avatar}
                      alt={`${publication.author.name} ${publication.author.surname}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-gray-600">
                      {publication.author.name.charAt(0)}{publication.author.surname.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <Link 
                    href={`/authors/${publication.author.id}`}
                    className="font-medium text-gray-900 hover:text-blue-600"
                  >
                    {publication.author.name} {publication.author.surname}
                  </Link>
                  <p className="text-sm text-gray-500">{publication.author.profession}</p>
                </div>
              </div>

              {/* Yayın Tarihi */}
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(publication.publishedAt).toLocaleDateString('tr-TR')}</span>
              </div>

              {/* Okuma Süresi */}
              <div className="flex items-center space-x-2 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{publication.readTime} dk okuma</span>
              </div>

              {/* Kategori */}
              <div className="flex items-center space-x-2 text-gray-500">
                <Tag className="w-4 h-4" />
                <span>{publication.category}</span>
              </div>
            </div>

            {/* İstatistikler */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{publication.viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{publication.rating} ({publication.ratingCount})</span>
              </div>
            </div>
          </div>

          {/* Etiketler */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {publication.tags.map((tag, index) => (
                <Link
                  key={index}
                  href={`/publications?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
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
              // Atıf eklendiğinde sayfayı yenile
              fetchPublication()
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

              {/* Düzenleme Butonları */}
              {(isAuthor || isEditor || isAdmin) && (
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/publications/${publication.id}/edit`}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                    title="Düzenle"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Bu yayını silmek istediğinizden emin misiniz?')) {
                        // TODO: Yayını sil
                        console.log('Yayın siliniyor:', publication.id)
                      }
                    }}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                    title="Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
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

        {/* İlgili Yayınlar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">İlgili Yayınlar</h3>
          <div className="text-center py-8 text-gray-500">
            <p>İlgili yayınlar burada gösterilecek</p>
          </div>
          {/* TODO: İlgili yayınları getir */}
        </div>
      </div>
    </div>
  )
}
