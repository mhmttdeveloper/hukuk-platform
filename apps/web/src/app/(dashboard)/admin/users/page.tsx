'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  Users, Search, Filter, Eye, Edit, Trash2, Shield, UserCheck, 
  UserX, Mail, Calendar, Building, CheckCircle, XCircle, AlertCircle, Clock
} from 'lucide-react'

interface User {
  id: string
  name: string
  surname: string
  email: string
  role: 'admin' | 'editor' | 'author' | 'member'
  profession: string
  verifiedStatus: 'verified' | 'pending' | 'rejected'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin: string
  publicationsCount: number
  commentsCount: number
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmet',
    surname: 'Yılmaz',
    email: 'ahmet.yilmaz@example.com',
    role: 'admin',
    profession: 'Avukat',
    verifiedStatus: 'verified',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-08-14',
    publicationsCount: 25,
    commentsCount: 150
  },
  {
    id: '2',
    name: 'Fatma',
    surname: 'Demir',
    email: 'fatma.demir@example.com',
    role: 'editor',
    profession: 'Hakim',
    verifiedStatus: 'verified',
    status: 'active',
    createdAt: '2024-02-20',
    lastLogin: '2024-08-13',
    publicationsCount: 18,
    commentsCount: 89
  },
  {
    id: '3',
    name: 'Mehmet',
    surname: 'Kaya',
    email: 'mehmet.kaya@example.com',
    role: 'author',
    profession: 'Avukat',
    verifiedStatus: 'verified',
    status: 'active',
    createdAt: '2024-03-10',
    lastLogin: '2024-08-12',
    publicationsCount: 12,
    commentsCount: 67
  },
  {
    id: '4',
    name: 'Zeynep',
    surname: 'Özkan',
    email: 'zeynep.ozkan@example.com',
    role: 'author',
    profession: 'Avukat',
    verifiedStatus: 'pending',
    status: 'active',
    createdAt: '2024-04-05',
    lastLogin: '2024-08-10',
    publicationsCount: 3,
    commentsCount: 23
  },
  {
    id: '5',
    name: 'Ali',
    surname: 'Yıldız',
    email: 'ali.yildiz@example.com',
    role: 'member',
    profession: 'Öğrenci',
    verifiedStatus: 'rejected',
    status: 'suspended',
    createdAt: '2024-05-12',
    lastLogin: '2024-07-25',
    publicationsCount: 0,
    commentsCount: 5
  }
]

export default function AdminUsersPage() {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all')

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesVerified = verifiedFilter === 'all' || user.verifiedStatus === verifiedFilter
    
    return matchesSearch && matchesRole && matchesStatus && matchesVerified
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-600" />
      case 'editor':
        return <UserCheck className="w-4 h-4 text-blue-600" />
      case 'author':
        return <Edit className="w-4 h-4 text-green-600" />
      case 'member':
        return <Users className="w-4 h-4 text-gray-600" />
      default:
        return <Users className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Yönetici'
      case 'editor':
        return 'Editör'
      case 'author':
        return 'Yazar'
      case 'member':
        return 'Üye'
      default:
        return 'Bilinmiyor'
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'editor':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'author':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'member':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-600" />
      case 'suspended':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif'
      case 'inactive':
        return 'Pasif'
      case 'suspended':
        return 'Askıya Alındı'
      default:
        return 'Bilinmiyor'
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getVerifiedStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getVerifiedStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Doğrulandı'
      case 'pending':
        return 'Beklemede'
      case 'rejected':
        return 'Reddedildi'
      default:
        return 'Bilinmiyor'
    }
  }

  const getVerifiedStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleView = (id: string) => {
    router.push(`/admin/users/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/users/${id}/edit`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      setUsers(prev => prev.filter(user => user.id !== id))
    }
  }

  const handleVerify = (id: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, verifiedStatus: 'verified' as const } : user
    ))
  }

  const handleSuspend = (id: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, status: 'suspended' as const } : user
    ))
  }

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    editors: users.filter(u => u.role === 'editor').length,
    authors: users.filter(u => u.role === 'author').length,
    members: users.filter(u => u.role === 'member').length,
    verified: users.filter(u => u.verifiedStatus === 'verified').length,
    pending: users.filter(u => u.verifiedStatus === 'pending').length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kullanıcı Yönetimi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tüm kullanıcıları yönetin, rollerini düzenleyin ve durumlarını kontrol edin
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/users/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Users className="w-4 h-4" />
          <span>Yeni Kullanıcı</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Toplam</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Yönetici</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">{stats.editors}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Editör</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{stats.authors}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Yazar</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-600">{stats.members}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Üye</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Doğrulanmış</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Beklemede</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Askıya Alınan</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Kullanıcı adı, soyadı veya e-posta ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Yönetici</option>
              <option value="editor">Editör</option>
              <option value="author">Yazar</option>
              <option value="member">Üye</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="suspended">Askıya Alınan</option>
            </select>
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tüm Doğrulama</option>
              <option value="verified">Doğrulanmış</option>
              <option value="pending">Beklemede</option>
              <option value="rejected">Reddedildi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
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
                  Doğrulama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İstatistikler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name.charAt(0)}{user.surname.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name} {user.surname}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.profession}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeClass(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1">{getRoleText(user.role)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(user.status)}`}>
                      {getStatusIcon(user.status)}
                      <span className="ml-1">{getStatusText(user.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVerifiedStatusBadgeClass(user.verifiedStatus)}`}>
                      {getVerifiedStatusIcon(user.verifiedStatus)}
                      <span className="ml-1">{getVerifiedStatusText(user.verifiedStatus)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>📝 {user.publicationsCount} yayın</div>
                      <div>💬 {user.commentsCount} yorum</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div>Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</div>
                      <div>Son giriş: {new Date(user.lastLogin).toLocaleDateString('tr-TR')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(user.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                        title="Görüntüle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
                        title="Düzenle"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.verifiedStatus === 'pending' && (
                        <button
                          onClick={() => handleVerify(user.id)}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
                          title="Doğrula"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleSuspend(user.id)}
                          className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-lg"
                          title="Askıya Al"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                        title="Sil"
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Kullanıcı bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Arama kriterlerinize uygun kullanıcı bulunamadı.
          </p>
        </div>
      )}
    </div>
  )
}
