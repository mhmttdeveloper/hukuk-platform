'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Plus, Edit, Eye, FileText, Calendar, Filter } from 'lucide-react';

interface Law {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  articles: { id: string }[];
  sourceFile?: string;
  fileType?: string;
  fileSize?: number;
}

export default function LawsPage() {
  const { user, isAdmin, isEditor } = useAuth();
  const router = useRouter();
  
  const [laws, setLaws] = useState<Law[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Check permissions
  if (!isAdmin && !isEditor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h1>
            <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchLaws();
  }, []);

  const fetchLaws = async () => {
    try {
      const response = await fetch('/api/laws');
      if (response.ok) {
        const data = await response.json();
        setLaws(data);
      } else {
        console.error('Failed to fetch laws');
      }
    } catch (error) {
      console.error('Error fetching laws:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Yayında';
      case 'DRAFT':
        return 'Taslak';
      case 'ARCHIVED':
        return 'Arşivlenmiş';
      default:
        return status;
    }
  };

  const getFileIcon = (fileType?: string) => {
    switch (fileType) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📄';
      default:
        return '📁';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAndSortedLaws = laws
    .filter(law => {
      const matchesSearch = law.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (law.description && law.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'ALL' || law.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'publishedAt':
          aValue = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
          bValue = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
          break;
        case 'articles':
          aValue = a.articles.length;
          bValue = b.articles.length;
          break;
        default:
          aValue = a[sortBy as keyof Law];
          bValue = b[sortBy as keyof Law];
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kanun Yönetimi</h1>
                <p className="text-gray-600 mt-1">
                  Yüklenen kanunları görüntüleyin, düzenleyin ve yönetin
                </p>
              </div>
              <button
                onClick={() => router.push('/admin/laws/upload')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Yeni Kanun Yükle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Kanun ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Tüm Durumlar</option>
                  <option value="DRAFT">Taslak</option>
                  <option value="PUBLISHED">Yayında</option>
                  <option value="ARCHIVED">Arşivlenmiş</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt">Oluşturulma Tarihi</option>
                  <option value="title">Başlık</option>
                  <option value="publishedAt">Yayın Tarihi</option>
                  <option value="articles">Madde Sayısı</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center space-x-2"
                >
                  <Filter className="h-5 w-5" />
                  <span>{sortOrder === 'asc' ? 'Artan' : 'Azalan'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Laws List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Kanunlar ({filteredAndSortedLaws.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredAndSortedLaws.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm || statusFilter !== 'ALL' ? 'Arama kriterlerinize uygun kanun bulunamadı.' : 'Henüz kanun yüklenmemiş.'}
              </div>
            ) : (
              filteredAndSortedLaws.map((law) => (
                <div key={law.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                        {getFileIcon(law.fileType)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                              onClick={() => router.push(`/admin/laws/${law.id}/edit`)}>
                            {law.title}
                          </h3>
                          {law.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {law.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(law.status)}`}>
                            {getStatusText(law.status)}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => router.push(`/admin/laws/${law.id}/edit`)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50"
                              title="Düzenle"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            
                            <button
                              onClick={() => router.push(`/laws/${law.slug}`)}
                              className="text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-50"
                              title="Görüntüle"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>{law.articles.length} madde</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(law.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                        
                        {law.publishedAt && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Yayın: {new Date(law.publishedAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                        )}
                        
                        {law.sourceFile && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs">
                              {law.fileType?.toUpperCase()} • {formatFileSize(law.fileSize)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
