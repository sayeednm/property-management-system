'use client'

import { use, useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, MapPin, Wifi, Car, Coffee, Tv, Wind, Users, Home, Calendar, Shield, Award, Image, Sun, Moon } from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { useThemeStore } from '@/store/useThemeStore'
import { formatCurrency, calculateROI, cn } from '@/lib/utils'
import PublicBookingModal from '@/components/PublicBookingModal'
import PhotoGalleryModal from '@/components/PhotoGalleryModal'
import BookingCalendar from '@/components/BookingCalendar'

const amenitiesIcons = [
  { icon: Wifi, label: 'WiFi Gratis' },
  { icon: Car, label: 'Parkir' },
  { icon: Coffee, label: 'Dapur' },
  { icon: Tv, label: 'TV Kabel' },
  { icon: Wind, label: 'AC' },
  { icon: Users, label: 'Area Bersama' },
]

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { properties } = usePropertyStore()
  const { darkMode, toggleDarkMode } = useThemeStore()
  const [showBooking, setShowBooking] = useState(false)
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const viewMode = useMemo(() => {
    if (!mounted || typeof window === 'undefined') return 'rent'
    try {
      const searchParams = new URLSearchParams(window.location.search)
      return (searchParams.get('mode') as 'rent' | 'invest') || 'rent'
    } catch { return 'rent' }
  }, [mounted])

  const property = properties.find((p) => p.id === id)

  if (!property) {
    return (
      <div className={darkMode ? 'min-h-screen flex items-center justify-center bg-[#001117]' : 'min-h-screen flex items-center justify-center'}>
        <p className="text-slate-400">Properti tidak ditemukan</p>
      </div>
    )
  }

  const roi = calculateROI(property.price_monthly, property.assets_value)
  const allLocations = Array.from(new Set(
    properties.filter(p => p.id !== property.id).map(p => p.location.split(',')[0].trim())
  )).slice(0, 8)

  const d = darkMode
  const border = d ? 'border-b border-[#E6A854]/20' : 'border-b border-[#E5E7EB]'
  const heading = d ? 'text-white' : 'text-slate-900'
  const subtext = d ? 'text-slate-400' : 'text-slate-600'

  return (
    <div className={d ? 'min-h-screen bg-[#001117]' : 'min-h-screen bg-white'}>
      {/* Header */}
      <header className={d ? 'sticky top-0 z-40 bg-[#001117]/95 backdrop-blur-sm border-b border-[#E6A854]/20 shadow-sm' : 'sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm'}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => router.back()} className={d ? 'flex items-center gap-2 text-slate-400 hover:text-white transition' : 'flex items-center gap-2 text-slate-600 hover:text-slate-900 transition'}>
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">Kembali</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={d ? 'w-7 h-7 bg-gradient-to-br from-[#E6A854] to-[#D4AF37] rounded-lg flex items-center justify-center' : 'w-7 h-7 bg-gradient-to-br from-[#D4AF37] to-[#E6A854] rounded-lg flex items-center justify-center'}>
                <Home className="w-3.5 h-3.5 text-[#001117]" />
              </div>
              <span className={d ? 'text-base font-bold text-white hidden sm:inline' : 'text-base font-bold text-slate-800 hidden sm:inline'}>
                STAY<span className="text-[#E6A854]">VEST</span>
              </span>
              <span className={cn('px-2 py-1 rounded-full text-[10px] font-bold',
                viewMode === 'invest'
                  ? d ? 'bg-[#E6A854]/20 text-[#E6A854]' : 'bg-emerald-100 text-emerald-700'
                  : d ? 'bg-[#E6A854]/10 text-[#E6A854]' : 'bg-slate-100 text-slate-700'
              )}>
                {viewMode === 'invest' ? 'INVEST' : 'RENT'}
              </span>
              <button onClick={toggleDarkMode} className={d ? 'p-1.5 bg-[#E6A854]/10 text-[#E6A854] rounded-lg hover:bg-[#E6A854]/20 transition' : 'p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition'}>
                {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
          <button onClick={() => router.push('/public')} className={d ? 'hover:text-[#E6A854] text-slate-400' : 'hover:text-slate-900'}>StayVest</button>
          <span>›</span><span>Yogyakarta</span>
          <span className="hidden sm:inline">›</span>
          <span className={d ? 'text-white hidden sm:inline' : 'text-slate-900 hidden sm:inline'}>{property.name}</span>
        </div>

        {/* Title */}
        <div className="mb-4 sm:mb-6">
          <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2 leading-tight ${heading}`}>{property.name}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className={`font-semibold ${heading}`}>4.9</span>
              <span className="text-slate-400">(127 ulasan)</span>
            </div>
            <div className={`flex items-center gap-1 ${subtext}`}>
              <MapPin className="w-4 h-4" /><span>{property.location}</span>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="relative grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-6 sm:mb-8 h-64 sm:h-80 md:h-96">
          {[0,0,0,0,0].map((_, i) => (
            <div key={i} className={i === 0 ? 'col-span-2 row-span-2 relative' : 'relative'}>
              <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
            </div>
          ))}
          <button onClick={() => setShowPhotoGallery(true)} className="absolute bottom-4 right-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-2 shadow-lg">
            <Image className="w-4 h-4" />Lihat semua foto
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Host */}
            <div className={`pb-6 ${border}`}>
              <h2 className={`text-lg font-semibold mb-4 ${heading}`}>Dikelola oleh StayVest</h2>
              <div className="flex items-center gap-3">
                <div className={d ? 'w-12 h-12 bg-gradient-to-br from-[#E6A854] to-[#D4AF37] rounded-full flex items-center justify-center' : 'w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#E6A854] rounded-full flex items-center justify-center'}>
                  <Home className="w-6 h-6 text-[#001117]" />
                </div>
                <div>
                  <p className={`font-semibold text-sm sm:text-base ${heading}`}>StayVest Management</p>
                  <p className="text-xs sm:text-sm text-slate-400">Verified Host · 5 tahun pengalaman</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={`pb-6 ${border}`}>
              <h2 className={`text-lg font-semibold mb-4 ${heading}`}>{viewMode === 'invest' ? 'Tentang investasi ini' : 'Tentang properti ini'}</h2>
              <p className={`text-sm leading-relaxed ${subtext}`}>
                {viewMode === 'invest'
                  ? `${property.name} adalah investasi properti yang menawarkan ROI ${roi.toFixed(2)}% per tahun dengan nilai aset ${formatCurrency(property.assets_value)}. Terletak strategis di ${property.location} dengan potensi pendapatan pasif ${formatCurrency(property.price_monthly)}/bulan atau ${formatCurrency(property.price_monthly * 12)}/tahun.`
                  : `${property.name} adalah hunian modern yang terletak strategis di ${property.location}. Menawarkan kenyamanan maksimal dengan fasilitas lengkap dan akses mudah ke berbagai pusat aktivitas.`}
              </p>
            </div>

            {/* Investment Analysis */}
            {viewMode === 'invest' && (
              <div className={`pb-8 ${border}`}>
                <h2 className={`text-xl font-semibold mb-4 ${heading}`}>Analisis Investasi</h2>
                <div className={d ? 'bg-[#E6A854]/10 border border-[#E6A854]/20 rounded-2xl p-4 sm:p-6 mb-4' : 'bg-emerald-50 rounded-2xl p-4 sm:p-6 mb-4'}>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { label: 'Nilai Aset', value: formatCurrency(property.assets_value) },
                      { label: 'ROI Tahunan', value: `${roi.toFixed(2)}%`, gold: true },
                      { label: 'Pendapatan/Bulan', value: formatCurrency(property.price_monthly) },
                      { label: 'Pendapatan/Tahun', value: formatCurrency(property.price_monthly * 12) },
                    ].map(({ label, value, gold }) => (
                      <div key={label}>
                        <p className={d ? 'text-xs text-[#E6A854] mb-1' : 'text-xs text-emerald-600 mb-1'}>{label}</p>
                        <p className={cn('text-lg sm:text-2xl font-bold break-words', gold ? (d ? 'text-[#E6A854]' : 'text-emerald-700') : heading)}>{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {[
                  `Payback Period: Sekitar ${(100 / roi).toFixed(1)} tahun untuk balik modal penuh`,
                  'Passive Income: Pendapatan rutin setiap bulan tanpa perlu kerja aktif',
                  'Capital Gain: Potensi kenaikan nilai properti 5-10% per tahun',
                  'Lokasi Strategis: Demand tinggi, occupancy rate stabil',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 mb-2">
                    <span className={d ? 'text-[#E6A854] font-semibold' : 'text-emerald-600 font-semibold'}>✓</span>
                    <p className={`text-sm ${subtext}`}>{item}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Amenities */}
            {viewMode === 'rent' && (
              <div className={`pb-6 ${border}`}>
                <h2 className={`text-lg font-semibold mb-4 ${heading}`}>Fasilitas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {amenitiesIcons.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className={d ? 'w-5 h-5 text-[#E6A854]' : 'w-5 h-5 text-slate-400'} />
                      <span className={`text-sm ${d ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className={`pb-6 ${border}`}>
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <h2 className={`text-lg font-semibold ${heading}`}>4.9 · 127 ulasan</h2>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className={d ? 'w-10 h-10 bg-[#E6A854]/20 rounded-full flex-shrink-0' : 'w-10 h-10 bg-slate-200 rounded-full flex-shrink-0'} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-semibold text-sm ${heading}`}>User {i}</p>
                        <span className="text-xs text-slate-400">· 2 minggu lalu</span>
                      </div>
                      <p className={`text-sm ${subtext}`}>Properti sangat bagus dan nyaman. Lokasi strategis, fasilitas lengkap. Highly recommended!</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className={`pb-8 ${border}`}>
              <h2 className={`text-xl font-semibold mb-4 ${heading}`}>Lokasi</h2>
              <div className={d ? 'bg-[#E6A854]/5 border border-[#E6A854]/20 rounded-2xl h-64 flex items-center justify-center' : 'bg-slate-100 rounded-2xl h-64 flex items-center justify-center'}>
                <div className="text-center">
                  <MapPin className={d ? 'w-8 h-8 text-[#E6A854] mx-auto mb-2' : 'w-8 h-8 text-slate-400 mx-auto mb-2'} />
                  <p className={`text-sm ${subtext}`}>{property.location}</p>
                </div>
              </div>
            </div>

            {/* Things to Know */}
            <div>
              <h2 className={`text-xl font-semibold mb-6 ${heading}`}>Hal yang perlu diketahui</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Kebijakan pembatalan', items: property.type === 'kost' ? ['Pembatalan minimal 7 hari sebelum masuk', 'Deposit tidak dapat dikembalikan', 'Sewa minimal 3 bulan'] : property.type === 'villa' ? ['Pembatalan gratis hingga 30 hari', 'Kurang dari 30 hari biaya 100%', 'Deposit 30% dari total sewa'] : ['Pembatalan gratis hingga 14 hari', 'Setelah itu biaya pembatalan 50%', 'Kontrak minimal 6 bulan'] },
                  { title: 'Peraturan rumah', items: property.type === 'kost' ? ['Check-in: Fleksibel (24 jam)', 'Jam malam: 23:00', 'Tamu menginap tidak diperbolehkan'] : property.type === 'villa' ? ['Check-in: 15:00 - 20:00', 'Check-out sebelum 11:00', 'Maksimum 8-10 tamu'] : ['Check-in: 14:00 - 22:00', 'Check-out sebelum 12:00', 'Maksimum 4 orang per unit'] },
                  { title: 'Keselamatan & properti', items: property.type === 'kost' ? ['CCTV 24 jam', 'Satpam/penjaga kost', 'Akses kartu/kunci digital'] : property.type === 'villa' ? ['Pagar & gerbang otomatis', 'CCTV area luar', 'Kolam renang dengan pagar pengaman'] : ['Alarm asap', 'Security 24 jam', 'Akses lift & parkir basement'] },
                ].map((section) => (
                  <div key={section.title}>
                    <h3 className={`font-semibold mb-3 ${heading}`}>{section.title}</h3>
                    {section.items.map((item) => <p key={item} className={`text-sm mb-2 ${subtext}`}>{item}</p>)}
                    <button className={d ? 'text-sm font-semibold text-[#E6A854] underline' : 'text-sm font-semibold underline'}>Pelajari selengkapnya</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className={d ? 'lg:sticky lg:top-24 bg-[#001117] border border-[#E6A854]/30 rounded-2xl p-4 sm:p-6 shadow-lg' : 'lg:sticky lg:top-24 bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-lg'}>
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-2xl font-bold ${heading}`}>{formatCurrency(property.price_monthly)}</span>
                  <span className={`text-sm ${subtext}`}>/bulan</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className={`font-semibold ${heading}`}>4.9</span>
                  <span className="text-slate-400">· 127 ulasan</span>
                </div>
              </div>

              {viewMode === 'rent' && (
                <div className="mb-4">
                  <BookingCalendar
                    onDateSelect={(checkIn, checkOut) => { setCheckInDate(checkIn); setCheckOutDate(checkOut) }}
                    onGuestChange={() => {}}
                  />
                </div>
              )}

              <button
                onClick={() => setShowBooking(true)}
                className={d ? 'w-full py-3 bg-gradient-to-r from-[#E6A854] to-[#D4AF37] text-[#001117] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#E6A854]/30 transition mb-4' : 'w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#E6A854] text-white font-semibold rounded-xl hover:shadow-lg transition mb-4'}
              >
                {viewMode === 'invest' ? 'Ajukan Penawaran' : 'Periksa ketersediaan'}
              </button>

              <p className="text-xs text-center text-slate-400 mb-6">
                {viewMode === 'invest' ? 'Tim kami akan menghubungi Anda untuk diskusi lebih lanjut' : 'Anda tidak akan dikenakan biaya'}
              </p>

              {viewMode === 'rent' && checkInDate && checkOutDate && (
                <div className={d ? 'mb-4 pb-4 border-b border-[#E6A854]/20 space-y-2' : 'mb-4 pb-4 border-b border-[#E5E7EB] space-y-2'}>
                  {(() => {
                    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
                    const total = property.price_daily * nights
                    return (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className={subtext}>{formatCurrency(property.price_daily)} x {nights} malam</span>
                          <span className={`font-semibold ${heading}`}>{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={subtext}>Biaya layanan</span>
                          <span className={`font-semibold ${heading}`}>Rp 0</span>
                        </div>
                        <div className={d ? 'flex justify-between font-bold pt-2 border-t border-[#E6A854]/20 text-white' : 'flex justify-between font-bold pt-2 border-t border-[#E5E7EB]'}>
                          <span>Total</span><span>{formatCurrency(total)}</span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}

              <div className={d ? 'space-y-3 pt-6 border-t border-[#E6A854]/20' : 'space-y-3 pt-6 border-t border-[#E5E7EB]'}>
                {[{ Icon: Shield, label: 'Pembayaran aman' }, { Icon: Calendar, label: 'Fleksibel check-in' }, { Icon: Award, label: 'Host terverifikasi' }].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 text-sm">
                    <Icon className={d ? 'w-5 h-5 text-[#E6A854]' : 'w-5 h-5 text-slate-400'} />
                    <span className={subtext}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Explore More */}
        <div className={d ? 'mt-16 pt-12 border-t border-[#E6A854]/20' : 'mt-16 pt-12 border-t border-[#E5E7EB]'}>
          <h2 className={`text-2xl font-semibold mb-6 ${heading}`}>Telusuri pilihan lainnya di Yogyakarta</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allLocations.map((loc) => {
              const locProp = properties.find(p => p.location.includes(loc))
              const typeLabel = locProp ? { kost: 'Kost & Boarding House', apartment: 'Apartment & Kondominium', villa: 'Villa & Resort', homestay: 'Homestay & Guesthouse' }[locProp.type] : 'Properti tersedia'
              return (
                <button key={loc} onClick={() => router.push('/public')} className={d ? 'text-left hover:bg-[#E6A854]/10 p-4 rounded-xl transition' : 'text-left hover:bg-slate-50 p-4 rounded-xl transition'}>
                  <p className={`font-semibold ${heading}`}>{loc}</p>
                  <p className={`text-sm ${subtext}`}>{typeLabel}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {showBooking && <PublicBookingModal property={property} mode={viewMode} onClose={() => setShowBooking(false)} />}
      {showPhotoGallery && <PhotoGalleryModal property={property} onClose={() => setShowPhotoGallery(false)} />}
    </div>
  )
}
