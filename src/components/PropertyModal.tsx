'use client'

import { useState } from 'react'
import { X, MapPin, TrendingUp, Home, Building2, TreePine, House, Calendar, User, Clock, CheckCircle } from 'lucide-react'
import { Property } from '@/lib/supabase'
import { formatCurrency, calculateROI, cn } from '@/lib/utils'
import { usePropertyStore, CustomerType } from '@/store/usePropertyStore'

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

interface Props {
  property: Property
  onClose: () => void
}

export default function PropertyModal({ property, onClose }: Props) {
  const { addBooking } = usePropertyStore()
  const [showForm, setShowForm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerType: 'rent' as CustomerType,
    checkIn: '',
    duration: '1',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const roi = calculateROI(property.price_monthly, property.assets_value)
  const type = typeConfig[property.type]
  const status = statusConfig[property.status]
  const TypeIcon = type.icon

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.customerName.trim()) e.customerName = 'Nama customer wajib diisi'
    if (!form.customerEmail.trim()) e.customerEmail = 'Email wajib diisi'
    else if (!/\S+@\S+\.\S+/.test(form.customerEmail)) e.customerEmail = 'Email tidak valid'
    if (!form.checkIn) e.checkIn = 'Tanggal check-in wajib diisi'
    if (!form.duration || Number(form.duration) < 1) e.duration = 'Durasi minimal 1 bulan'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    addBooking({
      propertyId: property.id,
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
      customerType: form.customerType,
      checkIn: form.checkIn,
      duration: Number(form.duration),
    })
    setSuccess(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="relative w-full h-44 rounded-t-2xl overflow-hidden">
          <img 
            src={property.images[0]} 
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition">
            <X className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-lg font-bold text-slate-800 leading-tight flex-1 pr-3">{property.name}</h2>
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0', status.color)}>
              {status.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sm text-slate-400">{property.location}</span>
          </div>

          <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md mb-5', type.color)}>
            <TypeIcon className="w-3 h-3" />{type.label}
          </span>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#F9FAFB] rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Monthly</p>
              <p className="text-sm font-bold text-slate-800">{formatCurrency(property.price_monthly)}</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Daily</p>
              <p className="text-sm font-bold text-slate-800">{formatCurrency(property.price_daily)}</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Asset Value</p>
              <p className="text-sm font-bold text-slate-800">{formatCurrency(property.assets_value)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-3 mb-6">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-emerald-600 font-medium">Annual Yield (ROI)</span>
            <span className="text-sm font-bold text-emerald-700 ml-auto">{roi.toFixed(2)}%</span>
          </div>

          {success ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="font-semibold text-slate-800 mb-1">Booking Berhasil!</p>
              <p className="text-sm text-slate-400 mb-4">Status properti telah diubah menjadi Occupied.</p>
              <button onClick={onClose} className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition">
                Tutup
              </button>
            </div>
          ) : property.status !== 'available' ? (
            <div className="bg-slate-50 rounded-xl px-4 py-3 text-center">
              <p className="text-sm text-slate-400">Properti ini tidak tersedia untuk booking saat ini.</p>
            </div>
          ) : !showForm ? (
            <button onClick={() => setShowForm(true)} className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition">
              + Add Booking
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm font-semibold text-slate-700">Form Booking</p>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> Nama Customer
                </label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                />
                {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Email Customer</label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  placeholder="contoh@email.com"
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                />
                {errors.customerEmail && <p className="text-xs text-red-500 mt-1">{errors.customerEmail}</p>}
              </div>

              {/* Customer Type */}
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1.5 block">Tipe Customer</label>
                <div className="flex gap-2">
                  {(['rent', 'buyer'] as CustomerType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, customerType: t })}
                      className={cn(
                        'flex-1 py-2 rounded-xl text-xs font-semibold border transition',
                        form.customerType === t
                          ? t === 'rent'
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-500 border-[#E5E7EB] hover:border-slate-300'
                      )}
                    >
                      {t === 'rent' ? '🏠 Sewa (Rent)' : '🔑 Beli (Buyer)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Tanggal Check-in
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                  />
                  {form.checkIn && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, checkIn: '' })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {errors.checkIn && <p className="text-xs text-red-500 mt-1">{errors.checkIn}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Durasi Sewa (bulan)
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                />
                {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-[#E5E7EB] text-slate-500 text-sm font-medium rounded-xl hover:bg-slate-50 transition">
                  Batal
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition">
                  Simpan Booking
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
