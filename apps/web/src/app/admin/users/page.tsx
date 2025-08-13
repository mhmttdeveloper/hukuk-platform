'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  surname: string
  email: string
  profession: string
  bio?: string
  verifiedStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

export default function AdminUsersPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING')

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
      return
    }

    if (!isAdmin) {
      router.push('/')
      return
    }

    fetchUsers()
  }, [user, isAdmin, router, selectedStatus])

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/auth/verify?status=${selectedStatus}`)
      if (!response.ok) {
        throw new Error('Kullanıcılar getirilemedi')
      }
      const data = await response.json()
      setUsers(data.users)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (userId: string, status: 'VERIFIED' | 'REJECTED', reason?: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          verifiedStatus: status,
          reason
        }),
      })

      if (!response.ok) {
        throw new Error('Doğrulama işlemi başarısız')
      }

      // Refresh users list
      fetchUsers()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Beklemede</span>
      case 'VERIFIED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Doğrulandı</span>
      case 'REJECTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Reddedildi</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Bilinmiyor</span>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="mt-2 text-gray-600">Kullanıcı hesaplarını doğrulayın ve yönetin</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedStatus('PENDING')}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedStatus === 'PENDING'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Bekleyen ({users.filter(u => u.verifiedStatus === 'PENDING').length})
            </button>
            <button
              onClick={() => setSelectedStatus('VERIFIED')}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedStatus === 'VERIFIED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Doğrulanan ({users.filter(u => u.verifiedStatus === 'VERIFIED').length})
            </button>
            <button
              onClick={() => setSelectedStatus('REJECTED')}
              className={`px-4 py-2 rounded-md font-medium ${
                selectedStatus === 'REJECTED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Reddedilen ({users.filter(u => u.verifiedStatus === 'REJECTED').length})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Bu durumda kullanıcı bulunamadı.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li key={user.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.name.charAt(0)}{user.surname.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name} {user.surname}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          <p className="text-sm text-gray-500 truncate">{user.profession}</p>
                          {user.bio && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{user.bio}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        {getStatusBadge(user.verifiedStatus)}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      
                      {user.verifiedStatus === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleVerification(user.id, 'VERIFIED')}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Doğrula
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Red sebebi:')
                              if (reason !== null) {
                                handleVerification(user.id, 'REJECTED', reason)
                              }
                            }}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Reddet
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                    <span className="text-yellow-600 text-sm font-medium">⏳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Bekleyen</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.filter(u => u.verifiedStatus === 'PENDING').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Doğrulanan</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.filter(u => u.verifiedStatus === 'VERIFIED').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                    <span className="text-red-600 text-sm font-medium">❌</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Reddedilen</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {users.filter(u => u.verifiedStatus === 'REJECTED').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
