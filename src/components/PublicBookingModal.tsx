'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Home, Building2, TreePine, House, Calendar, User, Mail, Clock, CheckCircle, Phone, MessageCircle } from 'lucide-react'
import { Property } from '@/lib/supabase'
import { formatCurrency, calculateROI, cn } from '@/lib/utils'
import { usePropertyStore } from '@/store/usePropertyStore'
import { useUserStore } from '@/store/useUserStore'
import { useThemeStore } from '@/store/useThemeStore'

const typeConfig = {
  kost: { label: 'Kost', icon: Home, color: 'bg-blue-50 text-blue-600' },
  apartment: { label: 'Apartment', icon: Building2, color: 'bg-purple-50 text-purple-600' },
  villa: { label: 'Villa', icon: TreePine, color: 'bg-green-50 text-green-600' },
  homestay: { label: 'Homestay', icon: House, color: 'bg-orange-50 text-orange-600' },
}

interface Props {
  property: Property
  mode?: 'rent' | 'invest'
  onClose: () => void
}

export default function PublicBookingModal({ property, mode = 'rent', onClose }: Props) {
  const { addBooking } = usePropertyStore()
  const { currentUser, isAuthenticated } = useUserStore()
  const { darkMode: d } = useThemeStore()
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', checkIn: '', duration: '1' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setForm((prev) => ({ ...prev, customerName: currentUser.name, customerEmail: currentUser.email, customerPhone: currentUser.phone || '' }))
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
    if (mode === 'rent') {
      if (!form.checkIn) e.checkIn = 'Tanggal check-in wajib diisi'
      if (!form.duration || Number(form.duration) < 1) e.duration = 'Durasi minimal 1 bulan'
    }
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
      customerType: mode === 'invest' ? 'buyer' : 'rent',
      checkIn: mode === 'rent' ? form.checkIn : new Date().toISOString().split('T')[0],
      duration: mode === 'rent' ? Number(form.duration) : 12,
    })
    setSuccess(true)
  }

  const handleWhatsApp = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    let msg = `Halo, saya tertarik dengan properti:\n\n📍 *${property.name}*\n📌 ${property.location}\n🏠 Tipe: ${type.label}\n\n`
    if (mode === 'invest') {
      msg += `💰 *Penawaran Investasi*\nNilai Aset: ${formatCurrency(property.assets_value)}\nROI: ${roi.toFixed(2)}%/tahun\nPendapatan: ${formatCurrency(property.price_monthly)}/bulan\n\n`
    } else {
      msg += `📅 Check-in: ${form.checkIn}\n⏱️ Durasi: ${form.duration} bulan\n💵 Harga: ${formatCurrency(property.price_monthly)}/bulan\n\n`
    }
    msg += `👤 Nama: ${form.customerName}\n📧 Email: ${form.customerEmail}\n`
    if (form.customerPhone) msg += `📱 Telepon: ${form.customerPhone}\n`
    msg += `\nMohon informasi lebih lanjut. Terima kasih!`
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const bg = d ? 'bg-[#001117]' : 'bg-white'
  const text = d ? 'text-white' : 'text-slate-800'
  const subtext = d ? 'text-slate-400' : 'text-slate-500'
  const border = d ? 'border-[#E6A854]/30' : 'border-[#E5E7EB]'
  const inputBg = d ? 'bg-[#001117]/50 border-[#E6A854]/30 text-white placeholder-slate-500' : 'bg-white border-[#E5E7EB] text-slate-700 placeholder-slate-300'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cn('rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto', bg)}>
        {/* Header image */}
        <div className="relative w-full h-44 rounded-t-2xl overflow-hidden">
          <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition">
            <X className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        <div className="p-6">
          <h2 className={cn('text-lg font-bold leading-tight mb-1', text)}>{property.name}</h2>
          <div className="flex items-center gap-1.5 mb-4">
            <MapPin className={cn('w-3.5 h-3.5', subtext)} />
            <span className={cn('text-sm', subtext)}>{property.location}</span>
          </div>

          <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md mb-5', d ? 'bg-[#E6A854]/20 text-[#E6A854]' : type.color)}>
            <TypeIcon className="w-3 h-3" />{type.label}
          </span>

          {/* Pricing */}
          {mode === 'rent' ? (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Harga/Bulan', value: formatCurrency(property.price_monthly) },
                { label: 'Harga/Hari', value: formatCurrency(property.price_daily) },
              ].map(({ label, value }) => (
                <div key={label} className={cn('rounded-xl p-3', d ? 'bg-[#E6A854]/10 border border-[#E6A854]/20' : 'bg-[#F9FAFB]')}>
                  <p className={cn('text-xs mb-1', d ? 'text-[#E6A854]' : 'text-slate-400')}>{label}</p>
                  <p className={cn('text-sm font-bold', text)}>{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={cn('rounded-xl p-4 mb-4', d ? 'bg-[#E6A854]/10 border border-[#E6A854]/20' : 'bg-emerald-50')}>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className={cn('text-xs mb-1', d ? 'text-[#E6A854]' : 'text-emerald-600')}>Nilai Aset</p>
                  <p className={cn('text-lg font-bold', text)}>{formatCurrency(property.assets_value)}</p>
                </div>
                <div>
                  <p className={cn('text-xs mb-1', d ? 'text-[#E6A854]' : 'text-emerald-600')}>ROI Tahunan</p>
                  <p className={cn('text-lg font-bold', d ? 'text-[#E6A854]' : 'text-emerald-700')}>{roi.toFixed(2)}%</p>
                </div>
              </div>
              <p className={cn('text-xs', subtext)}>💰 Pendapatan: {formatCurrency(property.price_monthly)}/bulan</p>
            </div>
          )}

          {/* Success */}
          {success ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mb-3', d ? 'bg-[#E6A854]/20' : 'bg-emerald-50')}>
                <CheckCircle className={cn('w-6 h-6', d ? 'text-[#E6A854]' : 'text-emerald-500')} />
              </div>
              <p className={cn('font-semibold mb-1', text)}>{mode === 'invest' ? 'Penawaran Investasi Terkirim!' : 'Booking Request Terkirim!'}</p>
              <p className={cn('text-sm mb-4', subtext)}>{mode === 'invest' ? 'Tim kami akan menghubungi Anda untuk diskusi investasi lebih lanjut.' : 'Kami akan menghubungi Anda segera untuk konfirmasi booking.'}</p>
              <button onClick={onClose} className={cn('px-5 py-2 text-sm font-medium rounded-xl transition', d ? 'bg-[#E6A854] text-[#001117] hover:bg-[#D4AF37]' : 'bg-slate-900 text-white hover:bg-slate-800')}>Tutup</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className={cn('text-sm font-semibold', text)}>{mode === 'invest' ? 'Form Penawaran Investasi' : 'Form Booking'}</p>

              {/* Name */}
              <div>
                <label className={cn('text-xs font-medium mb-1 flex items-center gap-1', subtext)}>
                  <User className="w-3 h-3" /> Nama Lengkap
                </label>
                <input type="text" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Contoh: Budi Santoso" className={cn('w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition', inputBg, d ? 'focus:ring-[#E6A854]/50 focus:border-[#E6A854]' : 'focus:ring-slate-200 focus:border-slate-400')} />
                {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className={cn('text-xs font-medium mb-1 flex items-center gap-1', subtext)}>
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  placeholder="contoh@email.com" disabled={isAuthenticated}
                  className={cn('w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition disabled:opacity-50', inputBg, d ? 'focus:ring-[#E6A854]/50 focus:border-[#E6A854]' : 'focus:ring-slate-200 focus:border-slate-400')} />
                {errors.customerEmail && <p className="text-xs text-red-500 mt-1">{errors.customerEmail}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className={cn('text-xs font-medium mb-1 flex items-center gap-1', subtext)}>
                  <Phone className="w-3 h-3" /> Nomor Telepon (Opsional)
                </label>
                <input type="tel" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  placeholder="08123456789" className={cn('w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition', inputBg, d ? 'focus:ring-[#E6A854]/50 focus:border-[#E6A854]' : 'focus:ring-slate-200 focus:border-slate-400')} />
              </div>

              {/* Check-in & Duration */}
              {mode === 'rent' && (
                <>
                  <div>
                    <label className={cn('text-xs font-medium mb-1 flex items-center gap-1', subtext)}>
                      <Calendar className="w-3 h-3" /> Tanggal Check-in
                    </label>
                    <div className="relative">
                      <input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                        className={cn('w-full px-3 py-2.5 pr-10 border rounded-xl text-sm focus:outline-none focus:ring-2 transition', inputBg, d ? 'focus:ring-[#E6A854]/50 focus:border-[#E6A854]' : 'focus:ring-slate-200 focus:border-slate-400')} />
                      {form.checkIn && (
                        <button type="button" onClick={() => setForm({ ...form, checkIn: '' })}
                          className={cn('absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full transition z-10', d ? 'bg-[#E6A854]/20 hover:bg-[#E6A854]/30 text-[#E6A854]' : 'bg-slate-100 hover:bg-slate-200 text-slate-600')}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {errors.checkIn && <p className="text-xs text-red-500 mt-1">{errors.checkIn}</p>}
                  </div>

                  <div>
                    <label className={cn('text-xs font-medium mb-1 flex items-center gap-1', subtext)}>
                      <Clock className="w-3 h-3" /> Durasi Sewa (bulan)
                    </label>
                    <input type="number" min="1" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      className={cn('w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition', inputBg, d ? 'focus:ring-[#E6A854]/50 focus:border-[#E6A854]' : 'focus:ring-slate-200 focus:border-slate-400')} />
                    {errors.duration && <p className="text-xs text-red-500 mt-1">{errors.duration}</p>}
                  </div>
                </>
              )}

              <button type="submit" className={cn('w-full py-2.5 text-sm font-semibold rounded-xl transition', d ? 'bg-[#E6A854] text-[#001117] hover:bg-[#D4AF37]' : 'bg-slate-900 text-white hover:bg-slate-800')}>
                {mode === 'invest' ? 'Kirim Penawaran Investasi' : 'Kirim Booking Request'}
              </button>

              <button type="button" onClick={handleWhatsApp} className="w-full py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                {mode === 'invest' ? 'Hubungi via WhatsApp' : 'Booking via WhatsApp'}
              </button>

              <p className={cn('text-xs text-center', subtext)}>Pilih booking via WhatsApp untuk respon lebih cepat</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}


interface Props {
  property: Property
  mode?: 'rent' | 'invest'
  onClose: () => void
}

export default function PublicBookingModal({ property, mode = 'rent', onClose }: Props) {
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
    
    // Only validate check-in and duration for rent mode
    if (mode === 'rent') {
      if (!form.checkIn) e.checkIn = 'Tanggal check-in wajib diisi'
      if (!form.duration || Number(form.duration) < 1) e.duration = 'Durasi minimal 1 bulan'
    }
    
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
      customerType: mode === 'invest' ? 'buyer' : 'rent',
      checkIn: mode === 'rent' ? form.checkIn : new Date().toISOString().split('T')[0],
      duration: mode === 'rent' ? Number(form.duration) : 12, // Default 12 months for investment
    })
    setSuccess(true)
  }

  const handleWhatsAppBooking = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    // Format WhatsApp message
    let message = `Halo, saya tertarik dengan properti:\n\n`
    message += `📍 *${property.name}*\n`
    message += `📌 ${property.location}\n`
    message += `🏠 Tipe: ${type.label}\n\n`
    
    if (mode === 'invest') {
      message += `💰 *Penawaran Investasi*\n`
      message += `Nilai Aset: ${formatCurrency(property.assets_value)}\n`
      message += `ROI: ${roi.toFixed(2)}%/tahun\n`
      message += `Pendapatan: ${formatCurrency(property.price_monthly)}/bulan\n\n`
    } else {
      message += `📅 Check-in: ${form.checkIn}\n`
      message += `⏱️ Durasi: ${form.duration} bulan\n`
      message += `💵 Harga: ${formatCurrency(property.price_monthly)}/bulan\n\n`
    }
    
    message += `👤 Nama: ${form.customerName}\n`
    message += `📧 Email: ${form.customerEmail}\n`
    if (form.customerPhone) message += `📱 Telepon: ${form.customerPhone}\n`
    
    message += `\nMohon informasi lebih lanjut. Terima kasih!`

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)
    
    // Replace with your WhatsApp business number (format: 62xxx without +)
    const waNumber = '6281234567890' // Ganti dengan nomor WA bisnis kamu
    
    // Open WhatsApp
    window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, '_blank')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header image */}
        <div className="relative w-full h-44 rounded-t-2xl overflow-hidden">
          <img 
            src={property.images[0]} 
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition"
          >
            <X className="w-4 h-4 text-slate-700" />
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
          {mode === 'rent' ? (
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
          ) : (
            <div className="bg-emerald-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-emerald-600 mb-1">Nilai Aset</p>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(property.assets_value)}</p>
                </div>
                <div>
                  <p className="text-xs text-emerald-600 mb-1">ROI Tahunan</p>
                  <p className="text-lg font-bold text-emerald-700">{roi.toFixed(2)}%</p>
                </div>
              </div>
              <div className="text-xs text-slate-600">
                <p>💰 Pendapatan: {formatCurrency(property.price_monthly)}/bulan</p>
              </div>
            </div>
          )}

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="font-semibold text-slate-800 mb-1">
                {mode === 'invest' ? 'Penawaran Investasi Terkirim!' : 'Booking Request Terkirim!'}
              </p>
              <p className="text-sm text-slate-400 mb-4">
                {mode === 'invest' 
                  ? 'Tim kami akan menghubungi Anda untuk diskusi investasi lebih lanjut.'
                  : 'Kami akan menghubungi Anda segera untuk konfirmasi booking.'}
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
              <p className="text-sm font-semibold text-slate-700">
                {mode === 'invest' ? 'Form Penawaran Investasi' : 'Form Booking'}
              </p>

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

              {/* Check-in & Duration - Only for Rent Mode */}
              {mode === 'rent' && (
                <>
                  {/* Check-in */}
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Tanggal Check-in
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={form.checkIn}
                        onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                        className="w-full px-3 py-2.5 pr-10 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
                      />
                      {form.checkIn && (
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, checkIn: '' })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 hover:text-slate-800 transition z-10"
                          title="Hapus tanggal"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
              >
                {mode === 'invest' ? 'Kirim Penawaran Investasi' : 'Kirim Booking Request'}
              </button>

              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="w-full py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                {mode === 'invest' ? 'Hubungi via WhatsApp' : 'Booking via WhatsApp'}
              </button>

              <p className="text-xs text-center text-slate-400">
                Pilih booking via WhatsApp untuk respon lebih cepat
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
