import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            YargıTam'a Hoş Geldiniz
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Hukukçulara özel, güvenilir bilgi ve yayın platformu. Hukuki makaleler, kanunlar, 
            yargıtay kararları ve uzman yorumlarına tek yerden erişim.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/publications"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Yayınları Keşfet
            </Link>
            <Link
              href="/auth/register"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ücretsiz Kayıt Ol
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Hukuki Yayınlar</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Uzman hukukçular tarafından yazılmış güncel makaleler ve analizler.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Güncel Mevzuat</h3>
          <p className="text-gray-600 dark:text-gray-300">
            En son değişikliklerle güncellenmiş kanun metinleri ve yönetmelikler.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Yargıtay İçtihatları</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Önemli yargıtay kararları ve içtihatlar ile pratik hukuk bilgisi.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Platform İstatistikleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
            <div className="text-gray-600 dark:text-gray-300">Hukuki Yayın</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">1000+</div>
            <div className="text-gray-600 dark:text-gray-300">Mevzuat Metni</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">2000+</div>
            <div className="text-gray-600 dark:text-gray-300">Yargıtay İçtihadı</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">100+</div>
            <div className="text-gray-600 dark:text-gray-300">Uzman Yazar</div>
          </div>
        </div>
      </section>
    </div>
  )
}
