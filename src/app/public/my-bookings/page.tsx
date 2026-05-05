'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Calendar, Clock, MapPin } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { usePropertyStore, BookingStatus } from '@/store/usePropertyStore'
import { formatCurrency, cn } from '@/lib/utils'

const typeConfig = {
  kost: { gradient: 'from-blue-400 to-blue-600' },
  apartment: { gradient: 'from-purple-400 to-purple-600' },
  villa: { gradient: 'from-green-400 to-green-600' },
  homestay: { gradient: 'from-orange-400 to-orange-600' },
}

export default function MyBookingsPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated } = useUserStore()
  const { bookings, properties } = usePropertyStore()
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/public')
    }
  }, [isAuthenticated, router])

  if (!currentUser) return null

  const userBookings = bookings.filter((b) => b.customerEmail === currentUser.email)
  const filteredBookings = filter === 'all' 
    ? userBookings 
    : userBookings.filter((b) => b.status === filter)

  const statusConfig = {
    pending: { label: 'Menunggu', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    approved: { label: 'Disetujui', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-700 border-red-200' },
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Booking Saya</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'all' as const, label: 'Semua' },
            { value: 'pending' as const, label: 'Menunggu' },
            { value: 'approved' as const, label: 'Disetujui' },
            { value: 'rejected' as const, label: 'Ditolak' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap',
                filter === tab.value
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-[#E5E7EB]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB]">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">Belum ada booking</p>
            <button
              onClick={() => router.push('/public')}
              className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Mulai booking sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const property = properties.find((p) => p.id === booking.propertyId)
              if (!property) return null

              const totalPrice = property.price_monthly * booking.duration

              return (
                <div
                  key={booking.id}
                  onClick={() => router.push(`/public/${property.id}`)}
                  className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex gap-4 p-4">
                    {/* Property Image */}
                    <div className={cn('w-24 h-24 rounded-xl flex-shrink-0 bg-gradient-to-br', typeConfig[property.type].gradient)} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 line-clamp-1">{property.name}</h3>
                        <span className={cn('px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap', statusConfig[booking.status].color)}>
                          {statusConfig[booking.status].label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(booking.checkIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{booking.duration} bulan</span>
                        </div>
                      </div>

                      <p className="text-sm font-bold text-slate-900">{formatCurrency(totalPrice)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
