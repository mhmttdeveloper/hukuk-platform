import Link from 'next/link';
import Advertisement from '@/components/Advertisement';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            🏛️ Hukuk Platformu
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Hukukçulara özel, SEO uyumlu yayın platformu. 
            Kanun ve yargıtay kararlarına kolay erişim, 
            uzman yorumları ve güncel hukuki gelişmeler.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link 
              href="/publications" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              📚 Yayınları Keşfet
            </Link>
            <Link 
              href="/laws" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              ⚖️ Kanun Kütüphanesi
            </Link>
            <Link 
              href="/cases" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              🏛️ Yargıtay Kararları
            </Link>
          </div>

          {/* Content Top Advertisement */}
          <div className="mb-8">
            <Advertisement position="content-top" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">SEO Uyumlu Yayınlar</h3>
              <p className="text-gray-600 dark:text-gray-300">
                RankMath benzeri SEO asistanı ile optimize edilmiş hukuki içerikler
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Uzman Yorumları</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Hukukçular tarafından yazılan yorumlar ve 5 yıldız puanlama sistemi
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Gelişmiş Arama</h3>
              <p className="text-gray-600 dark:text-gray-300">
                MeiliSearch ile hızlı ve akıllı arama özelliği
              </p>
            </div>
          </div>

          {/* Content Bottom Advertisement */}
          <div className="mt-8 mb-8">
            <Advertisement position="content-bottom" />
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Hemen Başlayın
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Hukuki bilgi birikiminizi paylaşın, uzman görüşlerinizi okuyun
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/auth/register" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Üye Ol
              </Link>
              <Link 
                href="/auth/login" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
