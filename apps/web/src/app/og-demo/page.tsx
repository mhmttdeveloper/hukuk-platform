'use client';

import { useState } from 'react';
import OGImagePreview from '@/components/OGImagePreview';

export default function OGImageDemoPage() {
  const [demoData, setDemoData] = useState({
    title: 'Türk Borçlar Kanunu 6098 Madde 27 Yorumu: Genel İşlem Şartları',
    subtitle: 'Bu makalede, TBK m. 27\'de düzenlenen genel işlem şartları konusu detaylı olarak incelenmektedir.',
    author: 'Av. Mehmet Yılmaz',
    category: 'Hukuki Makale',
    readTime: 8,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">OG Görsel Demo</h1>
          <p className="mt-2 text-gray-600">
            Sosyal medya paylaşımları için otomatik görsel üretimi test sayfası
          </p>
        </div>

        {/* Demo Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Demo Verileri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={demoData.title}
                onChange={(e) => setDemoData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Başlık girin..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Başlık
              </label>
              <input
                type="text"
                value={demoData.subtitle}
                onChange={(e) => setDemoData(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Alt başlık girin..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yazar
              </label>
              <input
                type="text"
                value={demoData.author}
                onChange={(e) => setDemoData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Yazar adı..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <input
                type="text"
                value={demoData.category}
                onChange={(e) => setDemoData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kategori..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Okuma Süresi (dk)
              </label>
              <input
                type="number"
                value={demoData.readTime}
                onChange={(e) => setDemoData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="60"
              />
            </div>
          </div>
        </div>

        {/* OG Image Preview */}
        <OGImagePreview
          title={demoData.title}
          subtitle={demoData.subtitle}
          author={demoData.author}
          category={demoData.category}
          readTime={demoData.readTime}
        />

        {/* API Usage Examples */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Kullanım Örnekleri</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">LinkedIn Format</h3>
              <code className="block bg-gray-100 p-3 rounded text-sm">
                /api/og-image?title={encodeURIComponent(demoData.title)}&subtitle={encodeURIComponent(demoData.subtitle)}&author={encodeURIComponent(demoData.author)}&category={encodeURIComponent(demoData.category)}&readTime={demoData.readTime}&template=linkedin
              </code>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Twitter/X Format</h3>
              <code className="block bg-gray-100 p-3 rounded text-sm">
                /api/og-image?title={encodeURIComponent(demoData.title)}&subtitle={encodeURIComponent(demoData.subtitle)}&author={encodeURIComponent(demoData.author)}&category={encodeURIComponent(demoData.category)}&readTime={demoData.readTime}&template=twitter
              </code>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">WhatsApp Format</h3>
              <code className="block bg-gray-100 p-3 rounded text-sm">
                /api/og-image?title={encodeURIComponent(demoData.title)}&subtitle={encodeURIComponent(demoData.subtitle)}&author={encodeURIComponent(demoData.author)}&category={encodeURIComponent(demoData.category)}&readTime={demoData.readTime}&template=whatsapp
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
