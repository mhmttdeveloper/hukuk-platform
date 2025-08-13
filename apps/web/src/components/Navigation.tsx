'use client'

import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <nav className="flex items-center space-x-8">
      <ThemeToggle />
      <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
        Ana Sayfa
      </a>
      <a href="/publications" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
        Yayınlar
      </a>
      <a href="/laws" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
        Kanunlar
      </a>
      <a href="/cases" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
        Kararlar
      </a>
      
      {isAuthenticated ? (
        <>
          {isAdmin && (
            <div className="flex items-center space-x-4">
              <a href="/admin/users" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Kullanıcı Yönetimi
              </a>
              <a href="/admin/comments" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Yorum Yönetimi
              </a>
              <a href="/admin/ads" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Reklam Yönetimi
              </a>
            </div>
          )}
          <a href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Profil
          </a>
          <a href="/auth/signout" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Çıkış
          </a>
        </>
      ) : (
        <a href="/auth/signin" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Giriş Yap
        </a>
      )}
    </nav>
  );
}
