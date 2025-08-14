'use client'

import { useState } from 'react'
import TiptapEditor from '@/components/TiptapEditor'

export default function EditorTestPage() {
  const [content, setContent] = useState(`
    <h1>Gelişmiş Tiptap Editör Test Sayfası</h1>
    
    <p>Bu sayfa, yeni eklenen özellikleri test etmek için oluşturulmuştur.</p>
    
    <h2>Yeni Özellikler</h2>
    
    <ul>
      <li><strong>Gelişmiş Başlık Seçici:</strong> H1-H6 başlık seviyeleri ve paragraf</li>
      <li><strong>Kanun Alıntısı:</strong> TBK, TCK gibi kanun maddeleri</li>
      <li><strong>İçtihat Alıntısı:</strong> Mahkeme kararları</li>
      <li><strong>Gelişmiş Toolbar:</strong> Daha organize edilmiş butonlar</li>
    </ul>
    
    <h3>Test İçeriği</h3>
    
    <p>Bu paragrafı seçip farklı başlık seviyelerine dönüştürebilirsiniz. Ayrıca kanun ve içtihat alıntıları ekleyebilirsiniz.</p>
    
    <blockquote class="kanun-alintisi">
      <div class="kanun-header">
        <span class="kanun-adi">TBK m.27</span>
      </div>
      <div class="kanun-content">
        <p>Genel işlem şartları, bir tarafın diğer tarafa önceden hazırlanmış olarak sunduğu ve karşı tarafın kabul etmekten başka seçeneği bulunmadığı sözleşme şartlarıdır.</p>
      </div>
    </blockquote>
    
    <blockquote class="ictihat-alintisi">
      <div class="ictihat-header">
        <span class="ictihat-kaynak">Yargıtay 3. HD, 2019/12345</span>
      </div>
      <div class="ictihat-content">
        <p>Genel işlem şartlarının geçerliliği konusunda verilen bu karar, TBK m.27 kapsamında önemli bir içtihat oluşturmaktadır.</p>
      </div>
    </blockquote>
  `)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gelişmiş Tiptap Editör Test</h1>
          <p className="text-gray-600">Yeni eklenen özellikleri test edin</p>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Editör</h2>
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder="İçeriğinizi buraya yazın..."
            showCitationButton={true}
            onAddCitation={() => alert('Atıf ekleme özelliği çalışıyor!')}
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Kullanım Talimatları</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">1. Başlık Seçici</h3>
              <p className="text-gray-600">
                Toolbar'daki "Başlık" dropdown'ını kullanarak seçili metni H1-H6 başlık seviyelerine dönüştürebilir veya paragraf yapabilirsiniz.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">2. Kanun Alıntısı</h3>
              <p className="text-gray-600">
                <strong>Gavel (Çekiç)</strong> ikonuna tıklayarak kanun alıntısı ekleyebilirsiniz. Kanun adı ve madde numarası girmeniz gerekiyor.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">3. İçtihat Alıntısı</h3>
              <p className="text-gray-600">
                <strong>BookOpen (Kitap)</strong> ikonuna tıklayarak içtihat alıntısı ekleyebilirsiniz. Mahkeme adı, esas numarası ve karar numarası girmeniz gerekiyor.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">4. Diğer Özellikler</h3>
              <p className="text-gray-600">
                Metin formatlama, listeler, tablolar, linkler, görseller ve diğer tüm özellikler çalışmaya devam ediyor.
              </p>
            </div>
          </div>
        </div>

        {/* HTML Output */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">HTML Çıktısı</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
              {content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
