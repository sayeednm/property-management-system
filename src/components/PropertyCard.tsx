'use client'

import { Property } from '@/lib/supabase'
import { formatCurrency, calculateROI, cn } from '@/lib/utils'
import { MapPin, TrendingUp, Home, Building2, TreePine, House } from 'lucide-react'

const typeConfig = {
  kost: { label: 'Kost', icon: Home, color: 'bg-blue-50 text-blue-600' },
  apartment: { label: 'Apartment', icon: Building2, color: 'bg-purple-50 text-purple-600' },
  villa: { label: 'Villa', icon: TreePine, color: 'bg-green-50 text-green-600' },
  homestay: { label: 'Homestay', icon: House, color: 'bg-orange-50 text-orange-600' },
}

const statusConfig = {
  available: { label: 'Available', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  occupied: { label: 'Occupied', color: 'bg-slate-50 text-slate-500 border-slate-200' },
  maintenance: { label: 'Maintenance', color: 'bg-amber-50 text-amber-600 border-amber-200' },
}

interface PropertyCardProps {
  property: Property
  onClick?: () => void
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  const roi = calculateROI(property.price_monthly, property.assets_value)
  const type = typeConfig[property.type]
  const status = statusConfig[property.status]
  const TypeIcon = type.icon

  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer group">
      {/* Image placeholder */}
      <div className="w-full h-40 bg-gradient-to-br from-indigo-50 to-slate-100 rounded-xl mb-4 flex items-center justify-center">
        <TypeIcon className="w-10 h-10 text-indigo-300" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 text-sm leading-tight truncate group-hover:text-indigo-600 transition-colors">
            {property.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-400 truncate">{property.location}</span>
          </div>
        </div>
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border ml-2 flex-shrink-0', status.color)}>
          {status.label}
        </span>
      </div>

      {/* Type badge */}
      <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md mb-3', type.color)}>
        <TypeIcon className="w-3 h-3" />
        {type.label}
      </span>

      {/* Pricing */}
      <div className="border-t border-[#E5E7EB] pt-3 mt-1">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Monthly</p>
            <p className="text-base font-bold text-slate-800">{formatCurrency(property.price_monthly)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-0.5">Daily</p>
            <p className="text-sm font-medium text-slate-600">{formatCurrency(property.price_daily)}</p>
          </div>
        </div>

        {/* ROI */}
        <div className="flex items-center gap-1.5 mt-3 bg-emerald-50 rounded-lg px-3 py-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">Annual Yield</span>
          <span className="text-xs font-bold text-emerald-700 ml-auto">{roi.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  )
}
