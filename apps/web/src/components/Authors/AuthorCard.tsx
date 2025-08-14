'use client'

import Image from 'next/image'
import Link from 'next/link'
import { User, BookOpen, Calendar } from 'lucide-react'

export interface Author {
  id: string
  name: string
  avatar: string
  expertise: string
  bio: string
  publicationCount: number
  lastPublicationDate: string
  profileUrl: string
}

interface AuthorCardProps {
  author: Author
}

// Uzmanlık alanına göre renk sınıfları
const getExpertiseColor = (expertise: string) => {
  const colors = {
    'Ceza Hukuku': 'border-red-500 bg-red-50 dark:bg-red-900/20',
    'Ticaret Hukuku': 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    'Medeni Hukuk': 'border-green-500 bg-green-50 dark:bg-green-900/20',
    'İş Hukuku': 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    'Anayasa Hukuku': 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
    'İdare Hukuku': 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
    'Maliye Hukuku': 'border-pink-500 bg-pink-50 dark:bg-pink-900/20',
    'Uluslararası Hukuk': 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
  }
  
  return colors[expertise as keyof typeof colors] || 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const expertiseColor = getExpertiseColor(author.expertise)
  
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-1">
      {/* Üst kısım - Avatar ve Uzmanlık */}
      <div className="relative p-6 pb-4">
        <div className="flex justify-center">
          <div className={`relative w-24 h-24 rounded-full border-4 ${expertiseColor} p-1`}>
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={96}
                height={96}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {author.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
            )}
          </div>
        </div>
        
        {/* Uzmanlık Badge */}
        <div className="mt-3 text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${expertiseColor.replace('border-', 'bg-').replace(' dark:bg-', ' dark:bg-')} text-gray-700 dark:text-gray-300`}>
            {author.expertise}
          </span>
        </div>
      </div>

      {/* Alt kısım - Bilgiler */}
      <div className="px-6 pb-6">
        {/* İsim */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {author.name}
        </h3>

        {/* Biyografi */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 line-clamp-2 leading-relaxed">
          {author.bio}
        </p>

        {/* İstatistikler */}
        <div className="flex items-center justify-center space-x-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{author.publicationCount} yayın</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(author.lastPublicationDate).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Profili Gör Butonu */}
        <div className="text-center">
          <Link
            href={author.profileUrl}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 group-hover:shadow-md"
          >
            Profili Gör
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Hover overlay efekti */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}
