'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, Calendar, Shield, ArrowLeft, Edit, Trash2, CheckCircle, XCircle, Clock, Eye, FileText, MessageSquare, Activity } from 'lucide-react'
import Link from 'next/link'


interface UserData {
  id: string
  name: string
  surname: string
  email: string
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'MEMBER'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'
  createdAt: string
  lastLogin: string | null
  publicationCount: number
  commentCount: number
  avatar?: string
  bio?: string
  profession?: string
  phone?: string
  address?: string
  verifiedAt?: string
  lastActivity?: string
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const userId = params.id as string

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
      return
    }
    
    fetchUser()
  }, [isAdmin, userId])

  const fetchUser = async () => {
    try {
      // Simüle edilmiş veri
      const mockUser: UserData = {
        id: userId,
        name: 'Ahmet',
        surname: 'Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: '2024-01-15',
        lastLogin: '2024-08-13T10:30:00',
        publicationCount: 25,
        commentCount: 156,
        bio: 'Hukuk alanında 15 yıllık deneyime sahip, özellikle ticaret hukuku ve sözleşme hukuku konularında uzmanlaşmış bir avukat.',
        profession: 'Avukat',
        phone: '+90 532 123 45 67',
        address: 'İstanbul, Türkiye',
        verifiedAt: '2024-01-20',
        lastActivity: '2024-08-13T10:30:00'
      }
      
      setUser(mockUser)
      setIsLoading(false)
    } catch (error) {
      console.error('Kullanıcı getirilemedi:', error)
      setIsLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Admin</span>
      case 'EDITOR':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Editör</span>
      case 'AUTHOR':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Yazar</span>
      case 'MEMBER':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Üye</span>
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">Bilinmiyor</span>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Aktif</span>
      case 'INACTIVE':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">Pasif</span>
      case 'PENDING':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Beklemede</span>
      case 'SUSPENDED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Askıya Alınmış</span>
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">Bilinmiyor</span>
    }
  }

  const handleDeleteUser = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!user) return
    
    try {
      // TODO: API'den kullanıcıyı sil
      console.log('Kullanıcı siliniyor:', user.id)
      
      // Simüle edilmiş silme işlemi
      router.push('/admin/users')
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error)
    }
  }

  if (!isAdmin) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Kullanıcı bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <User className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Kullanıcı bulunamadı</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Aradığınız kullanıcı mevcut değil veya silinmiş olabilir.
            </p>
            <Link
              href="/admin/users"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kullanıcı Listesine Dön
            </Link>
                  </div>
      </div>
    </div>
  )
}

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/users"
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Geri Dön
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kullanıcı Detayları</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {user.name} {user.surname} kullanıcısının detaylı bilgileri
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/users/${user.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </Link>
              
              <button
                onClick={handleDeleteUser}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Sil
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors mb-8">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.name} {user.surname}
                  </h2>
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  
                  {user.profession && (
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span>{user.profession}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                
                {user.bio && (
                  <div className="mt-4">
                    <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Toplam Yayın</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">{user.publicationCount}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Toplam Yorum</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">{user.commentCount}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Son Aktivite</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.lastActivity ? new Date(user.lastActivity).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aktivite Geçmişi</h3>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">{user.name} {user.surname}</span> sisteme giriş yaptı
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                
                <li>
                  <div className="relative pb-8">
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                          <User className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Hesap oluşturuldu
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4">
                Kullanıcıyı Sil
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>{user.name} {user.surname}</strong> kullanıcısını silmek istediğinizden emin misiniz?
                  Bu işlem geri alınamaz.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
