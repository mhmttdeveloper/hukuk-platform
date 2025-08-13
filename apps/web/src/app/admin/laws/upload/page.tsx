'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface UploadResult {
  success: boolean;
  law?: any;
  parseResult?: {
    articlesCount: number;
    warnings: any[];
  };
  error?: string;
}

export default function LawUploadPage() {
  const { user, isAdmin, isEditor } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Check permissions
  if (!isAdmin && !isEditor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h1>
            <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title.trim()) {
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      if (description.trim()) {
        formData.append('description', description.trim());
      }

      const response = await fetch('/api/laws/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          law: result.law,
          parseResult: result.parseResult,
        });
        
        // Reset form
        setFile(null);
        setTitle('');
        setDescription('');
      } else {
        setUploadResult({
          success: false,
          error: result.error || 'Yükleme sırasında bir hata oluştu',
        });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: 'Bağlantı hatası oluştu',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Kanun Yükleme</h1>
            <p className="text-gray-600 mt-1">
              PDF, DOCX veya TXT dosyalarından kanun metinlerini yükleyin ve otomatik olarak maddelere ayırın
            </p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kanun Dosyası
              </label>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                } ${file ? 'border-green-400 bg-green-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-2">
                    <div className="text-4xl">{getFileIcon(file.name)}</div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">{file.name}</p>
                      <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Dosyayı Kaldır
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Dosyayı buraya sürükleyin veya{' '}
                        <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          seçin
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileChange}
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOCX, TXT dosyaları (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Kanun Başlığı *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Örn: Türk Ceza Kanunu"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama (Opsiyonel)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kanun hakkında kısa açıklama..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!file || !title.trim() || isUploading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Yükleniyor...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Kanunu Yükle ve Parçala</span>
                </>
              )}
            </button>
          </form>

          {/* Upload Result */}
          {uploadResult && (
            <div className="px-6 pb-6">
              {uploadResult.success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-green-800">
                        Kanun Başarıyla Yüklendi!
                      </h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p><strong>Başlık:</strong> {uploadResult.law.title}</p>
                        <p><strong>Madde Sayısı:</strong> {uploadResult.parseResult?.articlesCount}</p>
                        <p><strong>Durum:</strong> Taslak (Düzenleme gerekli)</p>
                      </div>
                      
                      {uploadResult.parseResult?.warnings && uploadResult.parseResult.warnings.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm font-medium text-yellow-800 mb-2">
                            ⚠️ Uyarılar ({uploadResult.parseResult.warnings.length})
                          </p>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            {uploadResult.parseResult.warnings.map((warning: any, index: number) => (
                              <li key={index}>• {warning.message}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-4 space-x-3">
                        <button
                          onClick={() => router.push(`/admin/laws/${uploadResult.law.id}/edit`)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => router.push('/admin/laws')}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Kanun Listesine Git
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-red-800">
                        Yükleme Başarısız
                      </h3>
                      <p className="mt-2 text-sm text-red-700">
                        {uploadResult.error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
