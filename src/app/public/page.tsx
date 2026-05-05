'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, Building2, TreePine, House, Star, TrendingUp } from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { Property, PropertyType } from '@/lib/supabase'
import { formatCurrency, calculateROI, cn } from '@/lib/utils'
import PublicBookingModal from '@/components/PublicBookingModal'

const typeConfig = {
  kost: { label: 'Kost', icon: Home, gradient: 'from-blue-400 to-blue-600' },
  apartment: { label: 'Apartment', icon: Building2, gradient: 'from-purple-400 to-purple-600' },
  villa: { label: 'Villa', icon: TreePine, gradient: 'from-green-400 to-green-600' },
  homestay: { label: 'Homestay', icon: House, gradient: 'from-orange-400 to-orange-600' },
}

const filterOptions: { label: string; value: PropertyType | 'all' }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Kost', value: 'kost' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Homestay', value: 'homestay' },
]

type ViewMode = 'rent' | 'invest'

export default function PublicPage() {
  const { properties } = usePropertyStore()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<PropertyType | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('rent')

  const availableProperties = properties.filter((p) => p.status === 'available')

  const filtered = availableProperties.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    const matchType = filter === 'all' || p.type === filter
    return matchSearch && matchType
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">PropStay</span>
          </div>

          {/* Toggle Mode */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
            <button
              onClick={() => setViewMode('rent')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                viewMode === 'rent'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              Sewa
            </button>
            <button
              onClick={() => setViewMode('invest')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                viewMode === 'invest'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              Investasi
            </button>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a href="#" className="hover:text-slate-900 transition">Tentang Kami</a>
            <a href="#" className="hover:text-slate-900 transition">Kontak</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {viewMode === 'rent' 
              ? 'Temukan Hunian Impian di Jawa Tengah'
              : 'Investasi Properti Menguntungkan'
            }
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            {viewMode === 'rent'
              ? 'Properti berkualitas di Semarang dan sekitarnya. Kost, Apartment, Villa, dan Homestay dengan harga terjangkau.'
              : 'Analisis ROI transparan untuk setiap properti. Temukan investasi terbaik dengan return optimal.'
            }
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-white rounded-full shadow-xl border border-[#E5E7EB] flex items-center px-6 py-4">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Cari lokasi atau nama properti..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-slate-700 placeholder-slate-400 focus:outline-none"
              />
              <button className="ml-3 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:shadow-lg transition">
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-medium transition-all border',
                filter === opt.value
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white border-[#E5E7EB] text-slate-600 hover:border-slate-300 hover:shadow-sm'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{filtered.length} properti</span> tersedia
          </p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Home className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Tidak ada properti ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                viewMode={viewMode}
                onClick={() => router.push(`/public/${property.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-[#E5E7EB] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800">PropStay</span>
              </div>
              <p className="text-sm text-slate-500">Hunian berkualitas di Jawa Tengah</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">Tentang</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-slate-900">Karir</a></li>
                <li><a href="#" className="hover:text-slate-900">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">Dukungan</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-slate-900">Kontak</a></li>
                <li><a href="#" className="hover:text-slate-900">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 text-sm">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-slate-900">Kebijakan Privasi</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E5E7EB] pt-6 text-center text-sm text-slate-400">
            <p>© 2025 PropStay. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PropertyCard({ property, viewMode, onClick }: { 
  property: Property
  viewMode: ViewMode
  onClick: () => void 
}) {
  const type = typeConfig[property.type]
  const TypeIcon = type.icon
  const roi = calculateROI(property.price_monthly, property.assets_value)

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-gradient-to-br shadow-sm group-hover:shadow-xl transition-all duration-300">
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity', type.gradient)} />
        <div className="absolute inset-0 flex items-center justify-center">
          <TypeIcon className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform" />
        </div>
        {/* Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
          {type.label}
        </div>
        {/* Rating or ROI badge */}
        {viewMode === 'rent' ? (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            4.9
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-emerald-500/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {roi.toFixed(1)}%
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="font-semibold text-slate-900 text-base mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {property.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-sm text-slate-500 line-clamp-1">{property.location}</span>
        </div>

        {viewMode === 'rent' ? (
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-slate-900">{formatCurrency(property.price_monthly)}</span>
            <span className="text-sm text-slate-500">/bulan</span>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-sm text-slate-400">Nilai Aset</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900">{formatCurrency(property.assets_value)}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span className="font-semibold">ROI {roi.toFixed(2)}% per tahun</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
