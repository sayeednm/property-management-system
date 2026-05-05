'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Home, Building2, TreePine, House, Calendar, User, Mail, Clock, CheckCircle, Phone } from 'lucide-react'
import { Property } from '@/lib/supabase'
import { formatCurrency, calculateROI, cn } from '@/lib/utils'
import { usePropertyStore } from '@/store/usePropertyStore'
import { useUserStore } from '@/store/useUserStore'

const typeConfig = {
  kost: { label: 'Kost', icon: Home, color: 'bg-blue-50 text-blue-600' },
  apartment: { label: 'Apartment', icon: Building2, color: 'bg-purple-50 text-purple-600' },
  villa: { label: 'Villa', icon: TreePine, color: 'bg-green-50 text-green-600' },
  homestay: { label: 'Homestay', icon: House, color: 'bg-orange-50 text-orange-600' },
}

interface Props {
  property: Property
  onClose: () => void
}

export default function PublicBookingModal({ property, onClose }: Props) {
  const { addBooking } = usePropertyStore()
  const { currentUser, isAuthenticated } = useUserStore()
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    checkIn: '',
    duration: '1',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-fill if user is logged in
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setForm((prev) => ({
        ...prev,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        customerPhone: currentUser.phone || '',
      }))
    }
  }, [isAuthenticated, currentUser])

  const type = typeConfig[property.type]
  const TypeIcon = type.icon
  const roi = calculateROI(property.price_monthly, property.assets_value)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.customerName.trim()) e.customerName = 'Nama wajib diisi'
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
      userId: currentUser?.id,
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
      customerPhone: form.customerPhone.trim(),
      customerType: 'rent',
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
        {/* Header image */}
        <div className="relative w-full h-44 bg-gradient-to-br from-indigo-50 to-slate-100 rounded-t-2xl flex items-center justify-center">
          <TypeIcon className="w-16 h-16 text-indigo-200" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Title */}
          <h2 className="text-lg font-bold text-slate-800 leading-tight mb-1">{property.name}</h2>
          <div className="flex items-center gap-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sm text-slate-400">{property.location}</span>
          </div>

          <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md mb-5', type.color)}>
            <TypeIcon className="w-3 h-3" />
            {type.label}
          </span>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#F9FAFB] rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Harga/Bulan</p>
              <p className="text-sm font-bold text-slate-800">{formatCurrency(property.price_monthly)}</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-xl p-3">
              <p className="text-xs text-slate-400 mb-1">Harga/Hari</p>
              <p className="text-sm font-bold text-slate-800">{formatCurrency(property.price_daily)}</p>
            </div>
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="font-semibold text-slate-800 mb-1">Booking Request Terkirim!</p>
              <p className="text-sm text-slate-400 mb-4">
                Kami akan menghubungi Anda segera untuk konfirmasi booking.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition"
              >
                Tutup
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm font-semibold text-slate-700">Form Booking</p>

              {/* Name */}
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> Nama Lengkap
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

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  placeholder="contoh@email.com"
                  disabled={isAuthenticated}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition disabled:bg-slate-50"
                />
                {errors.customerEmail && <p className="text-xs text-red-500 mt-1">{errors.customerEmail}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Nomor Telepon (Opsional)
                </label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  placeholder="08123456789"
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                />
              </div>

              {/* Check-in */}
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Tanggal Check-in
                </label>
                <input
                  type="date"
                  value={form.checkIn}
                  onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                />
                {errors.checkIn && <p className="text-xs text-red-500 mt-1">{errors.checkIn}</p>}
              </div>

              {/* Duration */}
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

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
              >
                Kirim Booking Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
