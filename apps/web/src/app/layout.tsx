import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdProvider } from "@/contexts/AdContext";

export const metadata: Metadata = {
  title: "Hukuk Platformu - Hukuki Yayın ve Bilgi Platformu",
  description: "Hukukçulara özel, SEO uyumlu yayın platformu. Hukuki makaleler, kanunlar, yargıtay kararları ve uzman yorumları.",
  keywords: "hukuk, avukat, kanun, yargıtay, hukuki yayın, hukuk platformu",
  openGraph: {
    title: "Hukuk Platformu",
    description: "Hukukçulara özel yayın ve bilgi platformu",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Providers>
          <ThemeProvider>
            <AdProvider>
              <div className="flex flex-col min-h-screen">
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                      <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                          Hukuk Platformu
                        </h1>
                      </div>
                      <Navigation />
                    </div>
                  </div>
                </header>

                <main className="flex-grow">
                  {children}
                </main>

                <footer className="bg-gray-800 dark:bg-gray-900 text-white border-t border-gray-700 dark:border-gray-600 transition-colors duration-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Hukuk Platformu</h3>
                        <p className="text-gray-300">
                          Hukukçulara özel, güvenilir bilgi ve yayın platformu.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-md font-semibold mb-4">Hızlı Erişim</h4>
                        <ul className="space-y-2">
                          <li><a href="/publications" className="text-gray-300 hover:text-white">Yayınlar</a></li>
                          <li><a href="/laws" className="text-gray-300 hover:text-white">Kanunlar</a></li>
                          <li><a href="/cases" className="text-gray-300 hover:text-white">Kararlar</a></li>
                          <li><a href="/categories" className="text-gray-300 hover:text-white">Kategoriler</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-md font-semibold mb-4">Kullanıcı</h4>
                        <ul className="space-y-2">
                          <li><a href="/auth/signin" className="text-gray-300 hover:text-white">Giriş Yap</a></li>
                          <li><a href="/auth/signup" className="text-gray-300 hover:text-white">Kayıt Ol</a></li>
                          <li><a href="/profile" className="text-gray-300 hover:text-white">Profil</a></li>
                          <li><a href="/help" className="text-gray-300 hover:text-white">Yardım</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-md font-semibold mb-4">İletişim</h4>
                        <ul className="space-y-2">
                          <li className="text-gray-300">info@hukuk-platformu.com</li>
                          <li className="text-gray-300">+90 (212) XXX XX XX</li>
                          <li className="text-gray-300">İstanbul, Türkiye</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
                      <p>&copy; 2024 Hukuk Platformu. Tüm hakları saklıdır.</p>
                    </div>
                  </div>
                </footer>
              </div>
            </AdProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
