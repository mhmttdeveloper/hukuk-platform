'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Plus, Eye, Edit, Trash2, User, Mail, Calendar, Shield, MoreHorizontal, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface UserData {
  id: string
  name: string
  surname: string
  email: string
  role: string
  verifiedStatus: string
  createdAt: string
  profession?: string
  bio?: string
}

export default function UserManagementPage() {
  const { user, isAdmin } = useAuth()
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('Tümü')
  const [selectedStatus, setSelectedStatus] = useState('Tümü')

  const roles = ['Tümü', 'Admin', 'Editor', 'Author', 'Member']
  const statuses = ['Tümü', 'Verified', 'Pending', 'Rejected']

  useEffect(() => {
    // Mock data for demonstration
    const mockUsers: UserData[] = [
      {
        id: '1',
        name: 'Test',
        surname: 'Admin',
        email: 'admin@test.com',
        role: 'Admin',
        verifiedStatus: 'Verified',
        createdAt: '2024-01-15',
        profession: 'Hukuk Profesörü',
        bio: 'Test admin kullanıcısı'
      },
      {
        id: '2',
        name: 'Test',
        surname: 'Editor',
        email: 'editor@test.com',
        role: 'Editor',
        verifiedStatus: 'Verified',
        createdAt: '2024-01-16',
        profession: 'Avukat',
        bio: 'Test editör kullanıcısı'
      },
      {
        id: '3',
        name: 'Test',
        surname: 'Author',
        email: 'author@test.com',
        role: 'Author',
        verifiedStatus: 'Verified',
        createdAt: '2024-01-17',
        profession: 'Hukuk Danışmanı',
        bio: 'Test yazar kullanıcısı'
      }
    ]

    setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = selectedRole === 'Tümü' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'Tümü' || user.verifiedStatus === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    const roleColors = {
      'Admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Editor': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Author': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Member': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
    return roleColors[role as keyof typeof roleColors] || roleColors['Member']
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Verified': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return statusColors[status as keyof typeof statusColors] || statusColors['Pending']
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        // API call would go here
        setUsers(users.filter(user => user.id !== userId))
        console.log('Kullanıcı silindi:', userId)
      } catch (error) {
        console.error('Kullanıcı silinirken hata:', error)
      }
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Kullanıcılar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kullanıcı Yönetimi</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Sistem kullanıcılarını yönetin ve izleyin</p>
          </div>
          <Link
            href="/admin/users/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kullanıcı
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name} {user.surname}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        {user.profession && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {user.profession}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.verifiedStatus)}`}>
                      {user.verifiedStatus === 'Verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {user.verifiedStatus === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                      {user.verifiedStatus === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                      {user.verifiedStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Kullanıcı bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Arama kriterlerinize uygun kullanıcı bulunamadı.
          </p>
        </div>
      )}
    </div>
  )
}
