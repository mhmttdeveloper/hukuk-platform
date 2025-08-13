'use client';

import { useState, useEffect } from 'react';
import { Image, Download, RefreshCw, Settings } from 'lucide-react';

interface OGImagePreviewProps {
  title: string;
  subtitle?: string;
  author?: string;
  category?: string;
  readTime?: number;
  className?: string;
}

export default function OGImagePreview({
  title,
  subtitle,
  author,
  category,
  readTime,
  className = '',
}: OGImagePreviewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'linkedin' | 'twitter' | 'whatsapp' | 'default'>('linkedin');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const templates = [
    { id: 'linkedin', name: 'LinkedIn', dimensions: '1200x630' },
    { id: 'twitter', name: 'Twitter/X', dimensions: '1200x675' },
    { id: 'whatsapp', name: 'WhatsApp', dimensions: '800x800' },
    { id: 'default', name: 'Default', dimensions: '1200x630' },
  ];

  const generateImage = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        title: title.trim(),
        template: selectedTemplate,
      });

      if (subtitle) params.append('subtitle', subtitle.trim());
      if (author) params.append('author', author.trim());
      if (category) params.append('category', category.trim());
      if (readTime) params.append('readTime', readTime.toString());

      const url = `/api/og-image?${params.toString()}`;
      setImageUrl(url);
    } catch (err) {
      setError('Görsel oluşturulurken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `og-image-${selectedTemplate}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Görsel indirilirken hata oluştu');
    }
  };

  useEffect(() => {
    if (title.trim()) {
      generateImage();
    }
  }, [title, subtitle, author, category, readTime, selectedTemplate]);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">OG Görsel Önizleme</h3>
          <p className="text-sm text-gray-600">
            Sosyal medya paylaşımları için otomatik görsel üretimi
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={generateImage}
            disabled={isLoading || !title.trim()}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
          
          {imageUrl && (
            <button
              onClick={downloadImage}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              <span>İndir</span>
            </button>
          )}
        </div>
      </div>

      {/* Template Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Şablon Seçimi
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id as any)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="text-sm font-medium">{template.name}</div>
              <div className="text-xs text-gray-500">{template.dimensions}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Image Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">
            {templates.find(t => t.id === selectedTemplate)?.name} Önizleme
          </h4>
          <div className="text-xs text-gray-500">
            {templates.find(t => t.id === selectedTemplate)?.dimensions}
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : imageUrl ? (
            <div className="relative group">
              <img
                src={imageUrl}
                alt="OG Image Preview"
                className="w-full h-auto max-h-96 object-contain"
                onError={() => setError('Görsel yüklenirken hata oluştu')}
              />
              
              {/* Overlay with download button */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={downloadImage}
                  className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>İndir</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Başlık girin ve görsel oluşturun</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Kullanım</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• LinkedIn: Profesyonel paylaşımlar için ideal</li>
          <li>• Twitter/X: Sosyal medya paylaşımları için optimize</li>
          <li>• WhatsApp: Kare format, mobil uyumlu</li>
          <li>• Default: Genel kullanım için standart format</li>
        </ul>
      </div>
    </div>
  );
}
