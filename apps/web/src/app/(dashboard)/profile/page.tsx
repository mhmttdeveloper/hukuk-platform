'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react'

interface UserProfile {
  name: string
  surname: string
  email: string
  phone?: string
  city?: string
  birthDate?: string
  bio?: string
  avatar?: string
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    city: '',
    birthDate: '',
    bio: '',
    avatar: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Simüle edilmiş profil verisi
      setProfile({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: '+90 (555) 123 45 67',
        city: 'İstanbul',
        birthDate: '1990-01-01',
        bio: 'Hukuk alanında uzmanlaşmış profesyonel. Özellikle ticaret hukuku ve sözleşme hukuku konularında deneyimli.',
        avatar: ''
      })
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const handleSave = async () => {
    try {
      // Burada API çağrısı yapılacak
      console.log('Profil güncellendi:', profile)
      setIsEditing(false)
      // Başarı mesajı göster
    } catch (error) {
      console.error('Profil güncellenirken hata:', error)
      // Hata mesajı göster
    }
  }

  const handleCancel = () => {
    // Orijinal veriyi geri yükle
    if (user) {
      setProfile({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        phone: '+90 (555) 123 45 67',
        city: 'İstanbul',
        birthDate: '1990-01-01',
        bio: 'Hukuk alanında uzmanlaşmış profesyonel. Özellikle ticaret hukuku ve sözleşme hukuku konularında deneyimli.',
        avatar: ''
      })
    }
    setIsEditing(false)
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profil Bilgileri</h1>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Kaydet
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar and Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            {/* Avatar */}
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              {isEditing && (
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Fotoğraf Değiştir
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ad
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Soyad
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.surname}
                    onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{profile.surname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-posta
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Detaylı Bilgiler</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefon
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Şehir
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Doğum Tarihi
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.birthDate}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hakkımda
              </label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
