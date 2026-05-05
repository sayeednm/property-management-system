'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Property } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const typeConfig = {
  kost: { gradient: 'from-blue-400 to-blue-600' },
  apartment: { gradient: 'from-purple-400 to-purple-600' },
  villa: { gradient: 'from-green-400 to-green-600' },
  homestay: { gradient: 'from-orange-400 to-orange-600' },
}

interface Props {
  property: Property
  onClose: () => void
}

type Tab = 'foto' | 'fasilitas' | 'ulasan' | 'lokasi'

export default function PhotoGalleryModal({ property, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('foto')
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const gradient = typeConfig[property.type].gradient

  // Generate dummy photos
  const photos = [
    { id: 1, label: 'Ruang tamu', category: 'ruangan' },
    { id: 2, label: 'Dapur lengkap', category: 'ruangan' },
    { id: 3, label: 'Area makan', category: 'ruangan' },
    { id: 4, label: 'Kamar tidur 1', category: 'kamar' },
    { id: 5, label: 'Kamar tidur 2', category: 'kamar' },
    { id: 6, label: 'Kamar tidur 3', category: 'kamar' },
    { id: 7, label: 'Kamar mandi lengkap 1', category: 'kamar-mandi' },
    { id: 8, label: 'Kamar mandi lengkap 2', category: 'kamar-mandi' },
    { id: 9, label: 'Kamar mandi lengkap 3', category: 'kamar-mandi' },
    { id: 10, label: 'Halaman belakang', category: 'eksterior' },
    { id: 11, label: 'Bagian luar', category: 'eksterior' },
    { id: 12, label: 'Foto tambahan', category: 'lainnya' },
  ]

  const facilities = [
    { name: 'WiFi Gratis', available: true },
    { name: 'Parkir', available: true },
    { name: 'Dapur', available: true },
    { name: 'TV Kabel', available: true },
    { name: 'AC', available: true },
    { name: 'Area Bersama', available: true },
    { name: 'Kolam Renang', available: property.type === 'villa' },
    { name: 'Gym', available: property.type === 'apartment' },
  ]

  const tabs = [
    { id: 'foto' as Tab, label: 'Foto' },
    { id: 'fasilitas' as Tab, label: 'Fasilitas' },
    { id: 'ulasan' as Tab, label: 'Ulasan' },
    { id: 'lokasi' as Tab, label: 'Lokasi' },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 sm:gap-2 text-slate-600 hover:text-slate-900 transition"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">Tutup</span>
            </button>
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 truncate max-w-[150px] sm:max-w-none">{property.name}</h1>
            <div className="w-12 sm:w-20" /> {/* Spacer for centering */}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 -mb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'pb-2 sm:pb-3 px-1 text-xs sm:text-sm font-medium border-b-2 transition whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
        {/* Foto Tab */}
        {activeTab === 'foto' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Tur foto</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(index)}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group"
                >
                  <div className={cn('absolute inset-0 bg-gradient-to-br', gradient, 'opacity-80 group-hover:opacity-90 transition')} />
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <span className="text-white font-semibold text-xs sm:text-sm md:text-lg text-center">{photo.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fasilitas Tab */}
        {activeTab === 'fasilitas' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Fasilitas yang ditawarkan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {facilities.map((facility, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border',
                    facility.available
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-slate-200 bg-slate-50'
                  )}
                >
                  <span className={cn(
                    'text-lg',
                    facility.available ? 'text-emerald-600' : 'text-slate-400'
                  )}>
                    {facility.available ? '✓' : '✗'}
                  </span>
                  <span className={cn(
                    'font-medium',
                    facility.available ? 'text-slate-900' : 'text-slate-400'
                  )}>
                    {facility.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ulasan Tab */}
        {activeTab === 'ulasan' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-bold text-slate-900">4.9</span>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-sm text-slate-500">127 ulasan</p>
              </div>
            </div>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border-b border-[#E5E7EB] pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-slate-900">User {i}</p>
                          <p className="text-sm text-slate-400">Juni 2026</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-amber-400 text-sm">★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Properti sangat bagus dan nyaman. Lokasi strategis, fasilitas lengkap. 
                        Host sangat responsif dan membantu. Highly recommended untuk yang mencari 
                        hunian berkualitas di area ini!
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lokasi Tab */}
        {activeTab === 'lokasi' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Lokasi</h2>
            <div className="bg-slate-100 rounded-2xl h-96 flex items-center justify-center mb-6">
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-700 mb-2">{property.location}</p>
                <p className="text-sm text-slate-500">Map placeholder</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Tentang lokasi ini</h3>
                <p className="text-slate-600">
                  Properti ini terletak di lokasi strategis dengan akses mudah ke berbagai fasilitas umum, 
                  pusat perbelanjaan, dan transportasi publik. Area sekitar sangat aman dan nyaman untuk ditinggali.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Akses transportasi</h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Halte bus: 5 menit jalan kaki</li>
                  <li>• Stasiun kereta: 10 menit berkendara</li>
                  <li>• Bandara: 30 menit berkendara</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox for selected photo */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : photos.length - 1)
            }}
            className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedPhoto(selectedPhoto < photos.length - 1 ? selectedPhoto + 1 : 0)
            }}
            className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          <div className="max-w-5xl w-full aspect-[4/3] relative rounded-xl overflow-hidden">
            <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-semibold text-2xl">{photos[selectedPhoto].label}</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedPhoto + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  )
}
