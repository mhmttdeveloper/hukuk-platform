'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Edit, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface LawArticle {
  id: string;
  number: string;
  title?: string;
  text: string;
  slug: string;
  orderIndex: number;
}

interface Law {
  id: string;
  title: string;
  slug: string;
  description?: string;
  fullText: string;
  sourceFile?: string;
  fileType?: string;
  fileSize?: number;
  status: string;
  publishedAt?: string;
  articles: LawArticle[];
}

export default function LawEditPage() {
  const { user, isAdmin, isEditor } = useAuth();
  const router = useRouter();
  const params = useParams();
  const lawId = params.id as string;
  
  const [law, setLaw] = useState<Law | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const [showFullText, setShowFullText] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check permissions
  if (!isAdmin && !isEditor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h1>
            <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchLaw();
  }, [lawId]);

  const fetchLaw = async () => {
    try {
      const response = await fetch(`/api/laws/${lawId}`);
      if (response.ok) {
        const data = await response.json();
        setLaw(data);
      } else {
        console.error('Failed to fetch law');
      }
    } catch (error) {
      console.error('Error fetching law:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleUpdate = (articleId: string, field: keyof LawArticle, value: string) => {
    if (!law) return;
    
    setLaw({
      ...law,
      articles: law.articles.map(article => 
        article.id === articleId 
          ? { ...article, [field]: value }
          : article
      )
    });
  };

  const handleSaveArticle = async (articleId: string) => {
    if (!law) return;
    
    const article = law.articles.find(a => a.id === articleId);
    if (!article) return;

    try {
      const response = await fetch(`/api/laws/${lawId}/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      if (response.ok) {
        setEditingArticle(null);
        setSaveMessage({ type: 'success', message: 'Madde başarıyla güncellendi' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', message: 'Madde güncellenirken hata oluştu' });
      }
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Bağlantı hatası oluştu' });
    }
  };

  const handlePublishLaw = async () => {
    if (!law) return;

    try {
      const response = await fetch(`/api/laws/${lawId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setLaw({ ...law, status: 'PUBLISHED', publishedAt: new Date().toISOString() });
        setSaveMessage({ type: 'success', message: 'Kanun yayınlandı' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', message: 'Kanun yayınlanırken hata oluştu' });
      }
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Bağlantı hatası oluştu' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
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

  if (!law) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Kanun Bulunamadı</h1>
            <p className="text-gray-600">Aradığınız kanun bulunamadı veya silinmiş olabilir.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{law.title}</h1>
                <p className="text-gray-600 mt-1">
                  {law.description || 'Açıklama yok'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  law.status === 'PUBLISHED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {law.status === 'PUBLISHED' ? 'Yayında' : 'Taslak'}
                </span>
                {law.status === 'DRAFT' && (
                  <button
                    onClick={handlePublishLaw}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Yayınla
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Dosya:</span> {law.sourceFile ? 'Yüklendi' : 'Yok'}
              </div>
              <div>
                <span className="font-medium">Madde Sayısı:</span> {law.articles.length}
              </div>
              <div>
                <span className="font-medium">Oluşturulma:</span> {new Date(law.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-4 p-4 rounded-lg ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              {saveMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{saveMessage.message}</span>
            </div>
          </div>
        )}

        {/* Full Text Toggle */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              {showFullText ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              <span>{showFullText ? 'Tam Metni Gizle' : 'Tam Metni Göster'}</span>
            </button>
          </div>
          
          {showFullText && (
            <div className="px-6 py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                  {law.fullText}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Articles */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Kanun Maddeleri</h2>
            <p className="text-sm text-gray-600">Maddeleri düzenleyin ve gerekirse düzeltin</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {law.articles.map((article, index) => (
              <div key={article.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="space-y-3">
                      {/* Article Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Madde Numarası
                        </label>
                        <input
                          type="text"
                          value={article.number}
                          onChange={(e) => handleArticleUpdate(article.id, 'number', e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Article Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Madde Başlığı (Opsiyonel)
                        </label>
                        <input
                          type="text"
                          value={article.title || ''}
                          onChange={(e) => handleArticleUpdate(article.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Madde başlığı..."
                        />
                      </div>

                      {/* Article Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Madde Metni
                        </label>
                        <textarea
                          value={article.text}
                          onChange={(e) => handleArticleUpdate(article.id, 'text', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <span>Slug: {article.slug}</span>
                          <span className="mx-2">•</span>
                          <span>Sıra: {article.orderIndex}</span>
                        </div>
                        
                        <button
                          onClick={() => handleSaveArticle(article.id)}
                          disabled={isSaving}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
                        >
                          <Save className="h-4 w-4" />
                          <span>Kaydet</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
