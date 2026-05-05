'use client'

import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, TrendingUp, Home, CheckCircle, Wrench } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import PropertyModal from '@/components/PropertyModal'
import { usePropertyStore } from '@/store/usePropertyStore'
import { useThemeStore } from '@/store/useThemeStore'
import { Property, PropertyType } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const filterOptions: { label: string; value: PropertyType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Kost', value: 'kost' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Villa', value: 'villa' },
  { label: 'Homestay', value: 'homestay' },
]

export default function DashboardPage() {
  const { searchQuery, filterType, properties, setSearchQuery, setFilterType } = usePropertyStore()
  const { darkMode } = useThemeStore()
  const [mounted, setMounted] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filtered = properties.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = filterType === 'all' || p.type === filterType
    return matchSearch && matchType
  })

  const stats = {
    total: properties.length,
    available: properties.filter((p) => p.status === 'available').length,
    occupied: properties.filter((p) => p.status === 'occupied').length,
    maintenance: properties.filter((p) => p.status === 'maintenance').length,
  }

  // Sync selected property with latest state (so modal reflects status changes)
  const liveSelected = selectedProperty
    ? properties.find((p) => p.id === selectedProperty.id) ?? null
    : null

  if (!mounted) return null

  return (
    <div className={darkMode ? 'flex-1 bg-[#001117] min-h-screen' : 'flex-1 bg-[#F9FAFB] min-h-screen'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className={darkMode ? 'text-xl sm:text-2xl font-bold text-white' : 'text-xl sm:text-2xl font-bold text-slate-800'}>Property Dashboard</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage and monitor all your properties</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard icon={Home} label="Total Properties" value={stats.total} color={darkMode ? 'text-[#E6A854] bg-[#E6A854]/10' : 'text-[#D4AF37] bg-[#D4AF37]/10'} />
          <StatCard icon={CheckCircle} label="Available" value={stats.available} color="text-emerald-600 bg-emerald-50" />
          <StatCard icon={TrendingUp} label="Occupied" value={stats.occupied} color={darkMode ? 'text-slate-300 bg-slate-800' : 'text-slate-600 bg-slate-100'} />
          <StatCard icon={Wrench} label="Maintenance" value={stats.maintenance} color="text-amber-600 bg-amber-50" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={darkMode ? 'w-full pl-9 pr-4 py-2.5 bg-[#001117]/50 border border-[#E6A854]/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E6A854]/50 focus:border-[#E6A854] transition' : 'w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E6A854]/20 focus:border-[#E6A854] transition'}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex gap-1.5">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                    filterType === opt.value
                      ? darkMode
                        ? 'bg-gradient-to-r from-[#E6A854] to-[#D4AF37] text-[#001117]'
                        : 'bg-slate-900 text-white'
                      : darkMode
                      ? 'bg-[#001117]/50 border border-[#E6A854]/30 text-slate-400 hover:bg-[#E6A854]/10'
                      : 'bg-white border border-[#E5E7EB] text-slate-500 hover:border-slate-400'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 sm:py-20 text-slate-400">
            <Home className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => setSelectedProperty(property)}
              />
            ))}
          </div>
        )}
      </div>

      {liveSelected && (
        <PropertyModal
          property={liveSelected}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
  const { darkMode } = useThemeStore()
  return (
    <div className={darkMode ? 'bg-[#001117] rounded-2xl border border-[#E6A854]/20 p-3 sm:p-4 flex items-center gap-2 sm:gap-3' : 'bg-white rounded-2xl border border-[#E5E7EB] p-3 sm:p-4 flex items-center gap-2 sm:gap-3'}>
      <div className={cn('w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center', color.split(' ')[1])}>
        <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', color.split(' ')[0])} />
      </div>
      <div>
        <p className={darkMode ? 'text-xl sm:text-2xl font-bold text-white' : 'text-xl sm:text-2xl font-bold text-slate-800'}>{value}</p>
        <p className="text-[10px] sm:text-xs text-slate-400">{label}</p>
      </div>
    </div>
  )
}
