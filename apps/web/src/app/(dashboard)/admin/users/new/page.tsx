'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, Lock, Shield, ArrowLeft, Save, X } from 'lucide-react'
import Link from 'next/link'

interface NewUserData {
  name: string
  surname: string
  email: string
  password: string
  confirmPassword: string
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'MEMBER'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
}

export default function NewUserPage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  const [formData, setFormData] = useState<NewUserData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'MEMBER',
    status: 'PENDING'
  })
  const [errors, setErrors] = useState<Partial<NewUserData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAdmin) {
    router.push('/')
    return null
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<NewUserData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Ad alanı zorunludur'
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Soyad alanı zorunludur'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz'
    }

    if (!formData.password) {
      newErrors.password = 'Şifre alanı zorunludur'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor'
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
      // TODO: API'ye yeni kullanıcı ekle
      console.log('Yeni kullanıcı ekleniyor:', formData)
      
      // Simüle edilmiş başarılı işlem
      setTimeout(() => {
        router.push('/admin/users')
      }, 1000)
      
    } catch (error) {
      console.error('Kullanıcı eklenirken hata:', error)
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof NewUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Hata mesajını temizle
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yeni Kullanıcı Ekle</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Sisteme yeni kullanıcı ekleyin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Kişisel Bilgiler
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ad *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Kullanıcının adı"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Soyad *
                </label>
                <input
                  type="text"
                  id="surname"
                  value={formData.surname}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.surname 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Kullanıcının soyadı"
                />
                {errors.surname && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.surname}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              İletişim Bilgileri
            </h3>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-posta *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="kullanici@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Güvenlik
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şifre *
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="En az 6 karakter"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şifre Tekrar *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Şifreyi tekrar girin"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role and Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Rol ve Durum
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="MEMBER">Üye</option>
                  <option value="AUTHOR">Yazar</option>
                  <option value="EDITOR">Editör</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durum
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="PENDING">Beklemede</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="INACTIVE">Pasif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/admin/users"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              İptal
            </Link>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Ekleniyor...' : 'Kullanıcı Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
