'use client'

import { CheckCircle, XCircle, Clock, Mail, Calendar, User, Home } from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { useThemeStore } from '@/store/useThemeStore'
import { cn } from '@/lib/utils'

export default function BookingsPage() {
  const { bookings, properties, approveBooking, rejectBooking } = usePropertyStore()
  const { darkMode: d } = useThemeStore()

  const pendingBookings = bookings.filter((b) => b.status === 'pending')
  const approvedBookings = bookings.filter((b) => b.status === 'approved')
  const rejectedBookings = bookings.filter((b) => b.status === 'rejected')

  const bg = d ? 'bg-[#001117]' : 'bg-[#F9FAFB]'
  const card = cn('rounded-2xl border p-4 flex items-center gap-3', d ? 'bg-[#001117] border-[#E6A854]/20' : 'bg-white border-[#E5E7EB]')
  const heading = d ? 'text-white' : 'text-slate-800'

  return (
    <div className={cn('flex-1 min-h-screen', bg)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className={cn('text-xl sm:text-2xl font-bold', heading)}>Booking Requests</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Kelola semua booking request dari calon penyewa</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { icon: Clock, value: pendingBookings.length, label: 'Pending', color: 'text-amber-600 bg-amber-50' },
            { icon: CheckCircle, value: approvedBookings.length, label: 'Approved', color: 'text-emerald-600 bg-emerald-50' },
            { icon: XCircle, value: rejectedBookings.length, label: 'Rejected', color: 'text-red-500 bg-red-50' },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className={card}>
              <div className={cn('w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0', color.split(' ')[1])}>
                <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', color.split(' ')[0])} />
              </div>
              <div>
                <p className={cn('text-xl sm:text-2xl font-bold', heading)}>{value}</p>
                <p className="text-[10px] sm:text-xs text-slate-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sections */}
        {[
          { title: `Pending Approval (${pendingBookings.length})`, icon: Clock, iconColor: 'text-amber-500', items: pendingBookings, showActions: true },
          { title: `Approved (${approvedBookings.length})`, icon: CheckCircle, iconColor: 'text-emerald-500', items: approvedBookings, showActions: false },
          { title: `Rejected (${rejectedBookings.length})`, icon: XCircle, iconColor: 'text-red-500', items: rejectedBookings, showActions: false },
        ].map(({ title, icon: Icon, iconColor, items, showActions }) => items.length > 0 && (
          <div key={title} className="mb-6 sm:mb-8">
            <h2 className={cn('text-sm font-semibold mb-4 flex items-center gap-2', d ? 'text-slate-300' : 'text-slate-700')}>
              <Icon className={cn('w-4 h-4', iconColor)} />{title}
            </h2>
            <div className="space-y-3">
              {items.map((booking) => {
                const property = properties.find((p) => p.id === booking.propertyId)
                return (
                  <BookingCard key={booking.id} booking={booking} property={property}
                    onApprove={showActions ? () => approveBooking(booking.id) : undefined}
                    onReject={showActions ? () => rejectBooking(booking.id) : undefined}
                    darkMode={d}
                  />
                )
              })}
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Home className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada booking request.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function BookingCard({ booking, property, onApprove, onReject, darkMode: d }: {
  booking: ReturnType<typeof usePropertyStore.getState>['bookings'][0]
  property?: ReturnType<typeof usePropertyStore.getState>['properties'][0]
  onApprove?: () => void
  onReject?: () => void
  darkMode: boolean
}) {
  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    rejected: { label: 'Rejected', color: 'bg-red-50 text-red-500 border-red-200' },
  }
  const status = statusConfig[booking.status]

  return (
    <div className={cn('rounded-2xl border p-4 sm:p-5', d ? 'bg-[#001117] border-[#E6A854]/20' : 'bg-white border-[#E5E7EB]')}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={cn('font-semibold text-sm sm:text-base truncate', d ? 'text-white' : 'text-slate-800')}>{property?.name ?? 'Unknown Property'}</h3>
            <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full border flex-shrink-0', status.color)}>{status.label}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 truncate">{property?.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 sm:mb-4 text-sm">
        {[
          { icon: User, label: 'Customer', value: booking.customerName },
          { icon: Mail, label: 'Email', value: booking.customerEmail, small: true },
          { icon: Calendar, label: 'Check-in', value: new Date(booking.checkIn).toLocaleDateString('id-ID') },
          { icon: Clock, label: 'Durasi', value: `${booking.duration} bulan` },
        ].map(({ icon: Icon, label, value, small }) => (
          <div key={label} className="flex items-start gap-2">
            <Icon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-slate-400">{label}</p>
              <p className={cn('font-medium truncate', small ? 'text-xs' : 'text-xs sm:text-sm', d ? 'text-slate-200' : 'text-slate-700')}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {booking.status === 'pending' && onApprove && onReject && (
        <div className={cn('flex gap-2 pt-3 border-t', d ? 'border-[#E6A854]/20' : 'border-[#E5E7EB]')}>
          <button onClick={onReject} className={cn('flex-1 py-2 border text-sm font-medium rounded-xl transition', d ? 'border-[#E6A854]/30 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' : 'border-[#E5E7EB] text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200')}>Reject</button>
          <button onClick={onApprove} className="flex-1 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition">Approve</button>
        </div>
      )}
    </div>
  )
}

export default function BookingsPage() {
  const { bookings, properties, approveBooking, rejectBooking } = usePropertyStore()

  const pendingBookings = bookings.filter((b) => b.status === 'pending')
  const approvedBookings = bookings.filter((b) => b.status === 'approved')
  const rejectedBookings = bookings.filter((b) => b.status === 'rejected')

  return (
    <div className="flex-1 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Booking Requests</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola semua booking request dari calon penyewa</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{pendingBookings.length}</p>
              <p className="text-xs text-slate-400">Pending</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{approvedBookings.length}</p>
              <p className="text-xs text-slate-400">Approved</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{rejectedBookings.length}</p>
              <p className="text-xs text-slate-400">Rejected</p>
            </div>
          </div>
        </div>

        {/* Pending Section */}
        {pendingBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Pending Approval ({pendingBookings.length})
            </h2>
            <div className="space-y-3">
              {pendingBookings.map((booking) => {
                const property = properties.find((p) => p.id === booking.propertyId)
                return (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    property={property}
                    onApprove={() => approveBooking(booking.id)}
                    onReject={() => rejectBooking(booking.id)}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Approved Section */}
        {approvedBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Approved ({approvedBookings.length})
            </h2>
            <div className="space-y-3">
              {approvedBookings.map((booking) => {
                const property = properties.find((p) => p.id === booking.propertyId)
                return <BookingCard key={booking.id} booking={booking} property={property} />
              })}
            </div>
          </div>
        )}

        {/* Rejected Section */}
        {rejectedBookings.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Rejected ({rejectedBookings.length})
            </h2>
            <div className="space-y-3">
              {rejectedBookings.map((booking) => {
                const property = properties.find((p) => p.id === booking.propertyId)
                return <BookingCard key={booking.id} booking={booking} property={property} />
              })}
            </div>
          </div>
        )}

        {bookings.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Home className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada booking request.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function BookingCard({
  booking,
  property,
  onApprove,
  onReject,
}: {
  booking: ReturnType<typeof usePropertyStore.getState>['bookings'][0]
  property?: ReturnType<typeof usePropertyStore.getState>['properties'][0]
  onApprove?: () => void
  onReject?: () => void
}) {
  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-amber-50 text-amber-600 border-amber-200' },
    approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    rejected: { label: 'Rejected', color: 'bg-red-50 text-red-500 border-red-200' },
  }

  const status = statusConfig[booking.status]

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800">{property?.name ?? 'Unknown Property'}</h3>
            <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full border', status.color)}>
              {status.label}
            </span>
          </div>
          <p className="text-sm text-slate-400">{property?.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <User className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-xs text-slate-400">Customer</p>
            <p className="font-medium">{booking.customerName}</p>
          </div>
        </div>
        {booking.customerEmail && (
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="font-medium text-xs">{booking.customerEmail}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-xs text-slate-400">Check-in</p>
            <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString('id-ID')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-xs text-slate-400">Durasi</p>
            <p className="font-medium">{booking.duration} bulan</p>
          </div>
        </div>
      </div>

      {booking.status === 'pending' && onApprove && onReject && (
        <div className="flex gap-2 pt-3 border-t border-[#E5E7EB]">
          <button
            onClick={onReject}
            className="flex-1 py-2 border border-[#E5E7EB] text-slate-500 text-sm font-medium rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition"
          >
            Reject
          </button>
          <button
            onClick={onApprove}
            className="flex-1 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  )
}
