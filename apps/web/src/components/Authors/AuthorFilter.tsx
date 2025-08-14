'use client'

import { useState } from 'react'
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react'

export interface FilterOptions {
  expertise: string[]
  sortBy: 'name' | 'publicationCount' | 'lastPublicationDate'
  sortOrder: 'asc' | 'desc'
}

interface AuthorFilterProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  expertiseOptions: string[]
  isMobile?: boolean
}

export default function AuthorFilter({ 
  filters, 
  onFiltersChange, 
  expertiseOptions, 
  isMobile = false 
}: AuthorFilterProps) {
  const [isOpen, setIsOpen] = useState(!isMobile)
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters)

  const handleExpertiseChange = (expertise: string) => {
    const newExpertise = localFilters.expertise.includes(expertise)
      ? localFilters.expertise.filter(e => e !== expertise)
      : [...localFilters.expertise, expertise]
    
    const newFilters = { ...localFilters, expertise: newExpertise }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    const newFilters = { ...localFilters, sortBy }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSortOrderChange = () => {
    const newFilters = { 
      ...localFilters, 
      sortOrder: localFilters.sortOrder === 'asc' ? 'desc' : 'asc' 
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters = {
      expertise: [],
      sortBy: 'name' as const,
      sortOrder: 'asc' as const
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const hasActiveFilters = filters.expertise.length > 0 || filters.sortBy !== 'name'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filtreler
          </h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {filters.expertise.length + (filters.sortBy !== 'name' ? 1 : 0)}
            </span>
          )}
        </div>
        
        {isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        )}
      </div>

      {/* Filtre İçeriği */}
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Uzmanlık Alanı Filtreleri */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Uzmanlık Alanı
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {expertiseOptions.map((expertise) => (
                <label key={expertise} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.expertise.includes(expertise)}
                    onChange={() => handleExpertiseChange(expertise)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {expertise}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sıralama Seçenekleri */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Sıralama
            </h4>
            <div className="space-y-3">
              {/* Sıralama Kriteri */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sıralama Kriteri
                </label>
                <select
                  value={localFilters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">İsim</option>
                  <option value="publicationCount">Yayın Sayısı</option>
                  <option value="lastPublicationDate">Son Yayın Tarihi</option>
                </select>
              </div>

              {/* Sıralama Yönü */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sıralama Yönü
                </label>
                <button
                  onClick={handleSortOrderChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-between"
                >
                  <span>
                    {localFilters.sortOrder === 'asc' ? 'Artan' : 'Azalan'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={localFilters.sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filtreleri Temizle */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Filtreleri Temizle</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
