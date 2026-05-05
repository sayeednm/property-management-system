'use client'

import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, TrendingUp, Home, CheckCircle, Wrench } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import PropertyModal from '@/components/PropertyModal'
import { usePropertyStore } from '@/store/usePropertyStore'
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
  const { searchQuery, filterType, properties, setSearchQuery, setFilterType, setProperties } = usePropertyStore()
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
    <div className="flex-1 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Property Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and monitor all your properties</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Home} label="Total Properties" value={stats.total} color="text-indigo-600 bg-indigo-50" />
          <StatCard icon={CheckCircle} label="Available" value={stats.available} color="text-emerald-600 bg-emerald-50" />
          <StatCard icon={TrendingUp} label="Occupied" value={stats.occupied} color="text-slate-600 bg-slate-100" />
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
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <div className="flex gap-1.5">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs font-medium transition-all',
                    filterType === opt.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-[#E5E7EB] text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
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
          <div className="text-center py-20 text-slate-400">
            <Home className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* Modal */}
      {liveSelected && (
        <PropertyModal
          property={liveSelected}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color.split(' ')[1])}>
        <Icon className={cn('w-5 h-5', color.split(' ')[0])} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  )
}
