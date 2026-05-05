'use client'

import { useState } from 'react'
import { Users, Search, TrendingUp, ShoppingBag, X, Calendar, Clock, Home } from 'lucide-react'
import { usePropertyStore, Booking, CustomerType } from '@/store/usePropertyStore'
import { formatCurrency, cn } from '@/lib/utils'

type FilterTab = 'all' | CustomerType

const tabs: { label: string; value: FilterTab }[] = [
  { label: 'All Customers', value: 'all' },
  { label: '🏠 Sewa (Rent)', value: 'rent' },
  { label: '🔑 Beli (Buyer)', value: 'buyer' },
]

interface CustomerSummary {
  name: string
  type: CustomerType
  bookings: Booking[]
  lifetimeValue: number
  latestProperty: string
}

export default function CustomersPage() {
  const { bookings, properties } = usePropertyStore()
  const [tab, setTab] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<CustomerSummary | null>(null)

  // Group bookings by customer name
  const customerMap = new Map<string, CustomerSummary>()
  bookings.forEach((b) => {
    const prop = properties.find((p) => p.id === b.propertyId)
    const propName = prop?.name ?? 'Unknown Property'
    const value = prop ? prop.price_monthly * b.duration : 0

    if (customerMap.has(b.customerName)) {
      const existing = customerMap.get(b.customerName)!
      existing.bookings.push(b)
      existing.lifetimeValue += value
      existing.latestProperty = propName
    } else {
      customerMap.set(b.customerName, {
        name: b.customerName,
        type: b.customerType,
        bookings: [b],
        lifetimeValue: value,
        latestProperty: propName,
      })
    }
  })

  const customers = Array.from(customerMap.values()).filter((c) => {
    const matchTab = tab === 'all' || c.type === tab
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const totalRent = Array.from(customerMap.values()).filter((c) => c.type === 'rent').length
  const totalBuyer = Array.from(customerMap.values()).filter((c) => c.type === 'buyer').length

  return (
    <div className="flex-1 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Customer Management</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola dan pantau semua data customer</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{customerMap.size}</p>
              <p className="text-xs text-slate-400">Total Customers</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalRent}</p>
              <p className="text-xs text-slate-400">Penyewa (Rent)</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalBuyer}</p>
              <p className="text-xs text-slate-400">Pembeli (Buyer)</p>
            </div>
          </div>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex gap-1.5">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  tab === t.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-[#E5E7EB] text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 sm:max-w-xs ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          {customers.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {bookings.length === 0
                  ? 'Belum ada customer. Tambahkan booking dari halaman Dashboard.'
                  : 'Tidak ada customer ditemukan.'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Nama Customer</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Properti</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Tipe</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Total Transaksi</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Lifetime Value</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelected(c)}
                    className="border-b border-[#E5E7EB] last:border-0 hover:bg-indigo-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-indigo-600 hover:underline">{c.name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-600">{c.latestProperty}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        'text-xs font-semibold px-2.5 py-1 rounded-full',
                        c.type === 'rent' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      )}>
                        {c.type === 'rent' ? 'Sewa' : 'Beli'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-slate-600">{c.bookings.length}x</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-bold text-emerald-600">{formatCurrency(c.lifetimeValue)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selected && (
        <CustomerDetailModal customer={selected} properties={properties} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function CustomerDetailModal({
  customer,
  properties,
  onClose,
}: {
  customer: CustomerSummary
  properties: ReturnType<typeof usePropertyStore.getState>['properties']
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-base font-bold text-slate-800">{customer.name}</h2>
            <span className={cn(
              'text-xs font-semibold px-2 py-0.5 rounded-full',
              customer.type === 'rent' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
            )}>
              {customer.type === 'rent' ? 'Sewa (Rent)' : 'Beli (Buyer)'}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Lifetime Value */}
        <div className="mx-6 mt-5 bg-emerald-50 rounded-xl px-4 py-3 flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-sm text-emerald-600 font-medium">Lifetime Value</span>
          <span className="text-sm font-bold text-emerald-700 ml-auto">{formatCurrency(customer.lifetimeValue)}</span>
        </div>

        {/* Transaction History */}
        <div className="px-6 pb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Riwayat Transaksi</p>
          <div className="space-y-3">
            {customer.bookings.map((b, i) => {
              const prop = properties.find((p) => p.id === b.propertyId)
              const total = prop ? prop.price_monthly * b.duration : 0
              return (
                <div key={i} className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-700">{prop?.name ?? 'Unknown'}</p>
                    <span className="text-sm font-bold text-emerald-600">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Check-in: {new Date(b.checkIn).toLocaleDateString('id-ID')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {b.duration} bulan
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
