'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FormData {
  name: string
  surname: string
  email: string
  password: string
  confirmPassword: string
  profession: string
  bio: string
  socialLinks: {
    linkedin: string
    twitter: string
    website: string
  }
  contactInfo: {
    phone: string
    address: string
    city: string
  }
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    bio: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      website: ''
    },
    contactInfo: {
      phone: '',
      address: '',
      city: ''
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [section, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return false
    }
    
    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          profession: formData.profession,
          bio: formData.bio || undefined,
          socialLinks: {
            linkedin: formData.socialLinks.linkedin || undefined,
            twitter: formData.socialLinks.twitter || undefined,
            website: formData.socialLinks.website || undefined
          },
          contactInfo: {
            phone: formData.contactInfo.phone || undefined,
            address: formData.contactInfo.address || undefined,
            city: formData.contactInfo.city || undefined
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Kayıt sırasında bir hata oluştu')
      }

      setSuccess(data.message)
      
      // Redirect to signin page after 3 seconds
      setTimeout(() => {
        router.push('/auth/signin')
      }, 3000)

    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Hukuk Platformu'na Üye Olun
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
              Giriş yapın
            </Link>
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Kişisel Bilgiler</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Ad *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                  Soyad *
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  required
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                Meslek/Unvan *
              </label>
              <input
                type="text"
                id="profession"
                name="profession"
                required
                value={formData.profession}
                onChange={handleInputChange}
                placeholder="Örn: Avukat, Hukuk Müşaviri, Akademisyen"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Biyografi
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Kendiniz hakkında kısa bilgi..."
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Güvenlik</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Şifre *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">En az 8 karakter</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Şifre Tekrar *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Sosyal Medya (İsteğe Bağlı)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="socialLinks.linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="socialLinks.linkedin"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/..."
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-700">
                  Twitter/X
                </label>
                <input
                  type="url"
                  id="socialLinks.twitter"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/..."
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="socialLinks.website" className="block text-sm font-medium text-gray-700">
                  Kişisel Website
                </label>
                <input
                  type="url"
                  id="socialLinks.website"
                  name="socialLinks.website"
                  value={formData.socialLinks.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">İletişim Bilgileri (İsteğe Bağlı)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="contactInfo.phone"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                  placeholder="+90 (5XX) XXX XX XX"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contactInfo.city" className="block text-sm font-medium text-gray-700">
                  Şehir
                </label>
                <input
                  type="text"
                  id="contactInfo.city"
                  name="contactInfo.city"
                  value={formData.contactInfo.city}
                  onChange={handleInputChange}
                  placeholder="İstanbul"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="contactInfo.address" className="block text-sm font-medium text-gray-700">
                  Adres
                </label>
                <input
                  type="text"
                  id="contactInfo.address"
                  name="contactInfo.address"
                  value={formData.contactInfo.address}
                  onChange={handleInputChange}
                  placeholder="Mahalle, Sokak, No"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Kayıt yapılıyor...' : 'Üye Ol'}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              Üye olarak{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Kullanım Şartları
              </Link>
              {' '}ve{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Gizlilik Politikası
              </Link>
              'nı kabul etmiş olursunuz.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

