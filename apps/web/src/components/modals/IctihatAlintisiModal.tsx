'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface IctihatAlintisiModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (mahkemeAdi: string, esasNo: string, kararNo: string) => void
}

export default function IctihatAlintisiModal({ isOpen, onClose, onSubmit }: IctihatAlintisiModalProps) {
  const [mahkemeAdi, setMahkemeAdi] = useState('')
  const [esasNo, setEsasNo] = useState('')
  const [kararNo, setKararNo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mahkemeAdi.trim() && esasNo.trim() && kararNo.trim()) {
      onSubmit(mahkemeAdi.trim(), esasNo.trim(), kararNo.trim())
      onClose()
      setMahkemeAdi('')
      setEsasNo('')
      setKararNo('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            İçtihat Alıntısı Ekle
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="mahkemeAdi" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mahkeme Adı
            </label>
            <input
              type="text"
              id="mahkemeAdi"
              value={mahkemeAdi}
              onChange={(e) => setMahkemeAdi(e.target.value)}
              placeholder="Örn: Yargıtay 3. HD, Danıştay, Anayasa Mahkemesi"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="esasNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Esas Numarası
            </label>
            <input
              type="text"
              id="esasNo"
              value={esasNo}
              onChange={(e) => setEsasNo(e.target.value)}
              placeholder="Örn: 2019/12345"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="kararNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Karar Numarası
            </label>
            <input
              type="text"
              id="kararNo"
              value={kararNo}
              onChange={(e) => setKararNo(e.target.value)}
              placeholder="Örn: 2020/6789"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {mahkemeAdi && esasNo && kararNo && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Önizleme:</strong> {mahkemeAdi}, {esasNo}/{kararNo}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
