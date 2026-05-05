'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Star, MapPin, Wifi, Car, Coffee, Tv, Wind, Users, Home, Calendar, Shield, Award } from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { formatCurrency, calculateROI, cn } from '@/lib/utils'
import PublicBookingModal from '@/components/PublicBookingModal'

const amenitiesIcons = [
  { icon: Wifi, label: 'WiFi Gratis' },
  { icon: Car, label: 'Parkir' },
  { icon: Coffee, label: 'Dapur' },
  { icon: Tv, label: 'TV Kabel' },
  { icon: Wind, label: 'AC' },
  { icon: Users, label: 'Area Bersama' },
]

const typeConfig = {
  kost: { gradient: 'from-blue-400 to-blue-600' },
  apartment: { gradient: 'from-purple-400 to-purple-600' },
  villa: { gradient: 'from-green-400 to-green-600' },
  homestay: { gradient: 'from-orange-400 to-orange-600' },
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { properties } = usePropertyStore()
  const [showBooking, setShowBooking] = useState(false)

  const property = properties.find((p) => p.id === id)

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Properti tidak ditemukan</p>
      </div>
    )
  }

  const roi = calculateROI(property.price_monthly, property.assets_value)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">PropStay</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <button onClick={() => router.push('/public')} className="hover:text-slate-900">PropStay</button>
          <span>›</span>
          <span>Jawa Tengah</span>
          <span>›</span>
          <span>Semarang</span>
          <span>›</span>
          <span className="text-slate-900">{property.name}</span>
        </div>

        {/* Title & Rating */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">4.9</span>
              <span className="text-slate-400">(127 ulasan)</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-8 h-96">
          <div className={cn('col-span-2 row-span-2 bg-gradient-to-br', typeConfig[property.type].gradient)} />
          <div className={cn('bg-gradient-to-br opacity-80', typeConfig[property.type].gradient)} />
          <div className={cn('bg-gradient-to-br opacity-70', typeConfig[property.type].gradient)} />
          <div className={cn('bg-gradient-to-br opacity-60', typeConfig[property.type].gradient)} />
          <div className={cn('bg-gradient-to-br opacity-50', typeConfig[property.type].gradient)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Host Info */}
            <div className="pb-8 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Dikelola oleh PropStay</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">PropStay Management</p>
                  <p className="text-sm text-slate-400">Verified Host · 5 tahun pengalaman</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pb-8 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Tentang properti ini</h2>
              <p className="text-slate-600 leading-relaxed">
                {property.name} adalah hunian modern yang terletak strategis di {property.location}. 
                Properti ini menawarkan kenyamanan maksimal dengan fasilitas lengkap dan akses mudah ke berbagai pusat aktivitas. 
                Cocok untuk profesional muda, keluarga kecil, atau siapapun yang mencari hunian berkualitas di lokasi premium.
              </p>
            </div>

            {/* Amenities */}
            <div className="pb-8 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Fasilitas</h2>
              <div className="grid grid-cols-2 gap-4">
                {amenitiesIcons.map(({ icon: Icon, label }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Info (if relevant) */}
            <div className="pb-8 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Informasi Investasi</h2>
              <div className="bg-emerald-50 rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-emerald-600 mb-1">Nilai Aset</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(property.assets_value)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600 mb-1">ROI Tahunan</p>
                    <p className="text-2xl font-bold text-emerald-700">{roi.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600 mb-1">Pendapatan/Bulan</p>
                    <p className="text-lg font-semibold text-slate-900">{formatCurrency(property.price_monthly)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600 mb-1">Pendapatan/Tahun</p>
                    <p className="text-lg font-semibold text-slate-900">{formatCurrency(property.price_monthly * 12)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="pb-8 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <h2 className="text-xl font-semibold text-slate-900">4.9 · 127 ulasan</h2>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-800">User {i}</p>
                        <span className="text-xs text-slate-400">· 2 minggu lalu</span>
                      </div>
                      <p className="text-sm text-slate-600">
                        Properti sangat bagus dan nyaman. Lokasi strategis, fasilitas lengkap. Highly recommended!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="pb-8 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Lokasi</h2>
              <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">{property.location}</p>
                </div>
              </div>
            </div>

            {/* Things to Know */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Hal yang perlu diketahui</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Kebijakan pembatalan</h3>
                  <p className="text-sm text-slate-600 mb-2">
                    Pembatalan gratis sebelum 31 Mei. Jika Anda membatalkan sebelum check-in pada tanggal 5 Juni, Anda akan mendapatkan pengembalian sebagian.
                  </p>
                  <button className="text-sm font-semibold underline">Pelajari selengkapnya</button>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Peraturan rumah</h3>
                  <p className="text-sm text-slate-600 mb-1">Check-in: 15:00 - 22:00</p>
                  <p className="text-sm text-slate-600 mb-2">Check-out sebelum 12:00</p>
                  <p className="text-sm text-slate-600 mb-2">Maksimum 5 tamu</p>
                  <button className="text-sm font-semibold underline">Pelajari selengkapnya</button>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Keselamatan & properti</h3>
                  <p className="text-sm text-slate-600 mb-2">Alarm karbon monoksida</p>
                  <p className="text-sm text-slate-600 mb-2">Alarm asap</p>
                  <button className="text-sm font-semibold underline">Pelajari selengkapnya</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-lg">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold text-slate-900">{formatCurrency(property.price_monthly)}</span>
                  <span className="text-slate-500">/bulan</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-slate-400">· 127 ulasan</span>
                </div>
              </div>

              <button
                onClick={() => setShowBooking(true)}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition mb-4"
              >
                Booking Sekarang
              </button>

              <p className="text-xs text-center text-slate-400 mb-6">Anda tidak akan dikenakan biaya</p>

              <div className="space-y-3 pt-6 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">Pembayaran aman</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">Fleksibel check-in</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">Host terverifikasi</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore More */}
        <div className="mt-16 pt-12 border-t border-[#E5E7EB]">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Telusuri pilihan lainnya di Semarang dan sekitarnya</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Semarang', 'Bandungan', 'Ungaran', 'Ambarawa', 'Bawen', 'Kota Lama', 'Simpang Lima', 'Pandanaran'].map((loc) => (
              <button
                key={loc}
                onClick={() => router.push('/public')}
                className="text-left hover:bg-slate-50 p-4 rounded-xl transition"
              >
                <p className="font-semibold text-slate-800">{loc}</p>
                <p className="text-sm text-slate-400">Sewa tempat liburan</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <PublicBookingModal
          property={property}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  )
}
