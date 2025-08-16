'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { HelpCircle, Search, MessageSquare, Mail, Phone, MapPin, ChevronDown, ChevronUp, BookOpen, FileText, Users, Settings } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  isExpanded: boolean
}

interface ContactMethod {
  type: 'email' | 'phone' | 'chat'
  title: string
  description: string
  icon: any
  action: string
  value: string
}

export default function HelpPage() {
  const { user, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // FAQ data
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'Hesabımı nasıl oluşturabilirim?',
      answer: 'Ana sayfada sağ üst köşedeki "Kayıt Ol" butonuna tıklayarak hesap oluşturabilirsiniz. E-posta adresinizi ve güçlü bir şifre belirleyerek kayıt işlemini tamamlayabilirsiniz.',
      category: 'hesap',
      isExpanded: false
    },
    {
      id: '2',
      question: 'Şifremi unuttum, ne yapmalıyım?',
      answer: 'Giriş sayfasında "Şifremi Unuttum" linkine tıklayarak e-posta adresinizi girebilirsiniz. Size şifre sıfırlama linki gönderilecektir.',
      category: 'hesap',
      isExpanded: false
    },
    {
      id: '3',
      question: 'Makale nasıl yayınlayabilirim?',
      answer: 'Yazar rolüne sahipseniz, sidebar\'daki "Yeni Yazı" menüsünden yeni makale oluşturabilirsiniz. Makalenizi yazdıktan sonra "Yayınla" butonuna tıklayarak yayınlayabilirsiniz.',
      category: 'yayin',
      isExpanded: false
    },
    {
      id: '4',
      question: 'Yorum yapabilir miyim?',
      answer: 'Evet, giriş yapmış tüm kullanıcılar makalelere yorum yapabilir. Yorumlarınız editör onayından sonra yayınlanır.',
      category: 'yorum',
      isExpanded: false
    },
    {
      id: '5',
      question: 'Mevzuat ve içtihat ekleyebilir miyim?',
      answer: 'Mevzuat ve içtihat ekleme yetkisi sadece admin ve editör rollerine sahip kullanıcılarda bulunmaktadır. Normal kullanıcılar sadece görüntüleme yapabilir.',
      category: 'mevzuat',
      isExpanded: false
    },
    {
      id: '6',
      question: 'Profil bilgilerimi nasıl güncelleyebilirim?',
      answer: 'Sidebar\'daki "Ayarlarım" menüsünden profil bilgilerinizi, bildirim tercihlerinizi ve gizlilik ayarlarınızı güncelleyebilirsiniz.',
      category: 'profil',
      isExpanded: false
    },
    {
      id: '7',
      question: 'Bildirimleri nasıl yönetebilirim?',
      answer: 'Ayarlarım sayfasındaki "Bildirimler" sekmesinden e-posta, push ve diğer bildirim türlerini açıp kapatabilirsiniz.',
      category: 'bildirim',
      isExpanded: false
    },
    {
      id: '8',
      question: 'Dark mode nasıl aktif edilir?',
      answer: 'Sağ üst köşedeki tema değiştirme butonuna tıklayarak dark mode ve light mode arasında geçiş yapabilirsiniz.',
      category: 'tema',
      isExpanded: false
    }
  ])

  const categories = [
    { id: 'all', name: 'Tüm Kategoriler' },
    { id: 'hesap', name: 'Hesap İşlemleri' },
    { id: 'yayin', name: 'Yayın Yönetimi' },
    { id: 'yorum', name: 'Yorum Sistemi' },
    { id: 'mevzuat', name: 'Mevzuat ve İçtihat' },
    { id: 'profil', name: 'Profil ve Ayarlar' },
    { id: 'bildirim', name: 'Bildirimler' },
    { id: 'tema', name: 'Tema ve Görünüm' }
  ]

  const contactMethods: ContactMethod[] = [
    {
      type: 'email',
      title: 'E-posta ile İletişim',
      description: 'Detaylı sorularınız için e-posta gönderin',
      icon: Mail,
      action: 'E-posta Gönder',
      value: 'destek@hukuk-platformu.com'
    },
    {
      type: 'phone',
      title: 'Telefon ile İletişim',
      description: 'Acil durumlar için telefon hattımızı kullanın',
      icon: Phone,
      action: 'Ara',
      value: '+90 (212) XXX XX XX'
    },
    {
      type: 'chat',
      title: 'Canlı Destek',
      description: 'Anlık yardım için canlı destek hattımız',
      icon: MessageSquare,
      action: 'Sohbet Başlat',
      value: 'Canlı Destek'
    }
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  const toggleFAQ = (faqId: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === faqId 
        ? { ...faq, isExpanded: !faq.isExpanded }
        : faq
    ))
  }

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactAction = (method: ContactMethod) => {
    switch (method.type) {
      case 'email':
        window.open(`mailto:${method.value}?subject=YargıTam Yardım Talebi`, '_blank')
        break
      case 'phone':
        window.open(`tel:${method.value}`, '_blank')
        break
      case 'chat':
        alert('Canlı destek yakında aktif olacaktır. Şimdilik e-posta ile iletişim kurabilirsiniz.')
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          YargıTam Merkezi
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Sık sorulan sorular, kullanım kılavuzları ve destek kanalları
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Yardım konusu ara..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={selectedCategory}
              onChange={handleCategoryFilter}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <BookOpen className="mx-auto h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Kullanım Kılavuzu</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Platform özelliklerini keşfedin</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <FileText className="mx-auto h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">SSS</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sık sorulan sorular</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Users className="mx-auto h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Topluluk</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Diğer kullanıcılarla bağlantı kurun</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <Settings className="mx-auto h-8 w-8 text-orange-600 mb-3" />
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Teknik Destek</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Teknik sorunlar için destek</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
            Sık Sorulan Sorular
          </h2>
        </div>
        <div className="p-6">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Sonuç bulunamadı
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Arama kriterlerinize uygun yardım konusu bulunamadı.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-4 py-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                    {faq.isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {faq.isExpanded && (
                    <div className="px-4 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-green-600" />
            İletişim Kanalları
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.type}
                  className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Icon className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {method.description}
                  </p>
                  <button
                    onClick={() => handleContactAction(method)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    {method.action}
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {method.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Additional Help Resources */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Ek Yardım Kaynakları
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-white">Video Eğitimler</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Platform tanıtım videosu</li>
              <li>• Makale yazma rehberi</li>
              <li>• Yorum sistemi kullanımı</li>
              <li>• Profil yönetimi</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-white">Yazılı Dokümanlar</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Kullanıcı kılavuzu (PDF)</li>
              <li>• API dokümantasyonu</li>
              <li>• Güvenlik rehberi</li>
              <li>• Gizlilik politikası</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Office Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Ofis Bilgileri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-red-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Adres</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                İstanbul, Türkiye<br />
                Hukuk Platformu Merkezi
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Telefon</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                +90 (212) XXX XX XX<br />
                Pazartesi - Cuma, 09:00-18:00
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">E-posta</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                destek@hukuk-platformu.com<br />
                24 saat içinde yanıt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
