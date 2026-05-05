'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Home, Building2, TreePine, House, Search } from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { useThemeStore } from '@/store/useThemeStore'
import { Property } from '@/lib/supabase'
import { formatCurrency, calculateROI, cn } from '@/lib/utils'
import PropertyFormModal from '@/components/PropertyFormModal'

const typeConfig = {
  kost: { label: 'Kost', icon: Home, color: 'bg-blue-50 text-blue-600' },
  apartment: { label: 'Apartment', icon: Building2, color: 'bg-purple-50 text-purple-600' },
  villa: { label: 'Villa', icon: TreePine, color: 'bg-green-50 text-green-600' },
  homestay: { label: 'Homestay', icon: House, color: 'bg-orange-50 text-orange-600' },
}

const statusConfig = {
  available: { label: 'Available', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  occupied: { label: 'Occupied', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  maintenance: { label: 'Maintenance', color: 'bg-amber-50 text-amber-600 border-amber-200' },
}

export default function InventoryPage() {
  const { properties, addProperty, updateProperty, deleteProperty } = usePropertyStore()
  const { darkMode: d } = useThemeStore()
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Property | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const filtered = properties.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (data: Omit<Property, 'id'>) => {
    if (editTarget) { updateProperty(editTarget.id, data) } else { addProperty(data) }
    setShowForm(false); setEditTarget(null)
  }

  if (!mounted) return null

  return (
    <div className={cn('flex-1 min-h-screen', d ? 'bg-[#001117]' : 'bg-[#F9FAFB]')}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className={cn('text-xl sm:text-2xl font-bold', d ? 'text-white' : 'text-slate-800')}>Inventory Properti</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Kelola semua data properti</p>
          </div>
          <button onClick={() => { setEditTarget(null); setShowForm(true) }}
            className={cn('flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition shadow-sm',
              d ? 'bg-gradient-to-r from-[#E6A854] to-[#D4AF37] text-[#001117]' : 'bg-slate-900 text-white hover:bg-slate-800')}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Property</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Cari properti..." value={search} onChange={(e) => setSearch(e.target.value)}
            className={cn('w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition',
              d ? 'bg-[#001117]/50 border-[#E6A854]/30 text-white placeholder-slate-500 focus:ring-[#E6A854]/50 focus:border-[#E6A854]'
                : 'bg-white border-[#E5E7EB] text-slate-700 placeholder-slate-400 focus:ring-[#E6A854]/20 focus:border-[#E6A854]')} />
        </div>

        {/* Mobile Cards / Desktop Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Home className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Tidak ada properti ditemukan.</p>
          </div>
        ) : (
          <>
            {/* Mobile: Cards */}
            <div className="sm:hidden space-y-3">
              {filtered.map((p) => {
                const type = typeConfig[p.type]
                const status = statusConfig[p.status]
                const TypeIcon = type.icon
                const roi = calculateROI(p.price_monthly, p.assets_value)
                return (
                  <div key={p.id} className={cn('rounded-2xl border p-4', d ? 'bg-[#001117] border-[#E6A854]/20' : 'bg-white border-[#E5E7EB]')}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-semibold text-sm truncate', d ? 'text-white' : 'text-slate-800')}>{p.name}</p>
                        <p className="text-xs text-slate-400 truncate">{p.location}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button onClick={() => { setEditTarget(p); setShowForm(true) }}
                          className={cn('w-8 h-8 flex items-center justify-center rounded-lg transition', d ? 'hover:bg-[#E6A854]/10 text-slate-400 hover:text-[#E6A854]' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700')}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteConfirm(p.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md', type.color)}>
                        <TypeIcon className="w-3 h-3" />{type.label}
                      </span>
                      <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full border', status.color)}>{status.label}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-slate-400">Harga/Bulan</p>
                        <p className={cn('font-semibold', d ? 'text-white' : 'text-slate-700')}>{formatCurrency(p.price_monthly)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Nilai Aset</p>
                        <p className={cn('font-semibold', d ? 'text-slate-300' : 'text-slate-600')}>{formatCurrency(p.assets_value)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">ROI</p>
                        <p className={cn('font-bold', d ? 'text-[#E6A854]' : 'text-emerald-600')}>{roi.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop: Table */}
            <div className={cn('hidden sm:block rounded-2xl border overflow-hidden', d ? 'bg-[#001117] border-[#E6A854]/20' : 'bg-white border-[#E5E7EB]')}>
              <table className="w-full">
                <thead>
                  <tr className={cn('border-b', d ? 'bg-[#E6A854]/5 border-[#E6A854]/20' : 'bg-[#F9FAFB] border-[#E5E7EB]')}>
                    {['Properti','Tipe','Status','Harga/Bulan','Nilai Aset','ROI','Aksi'].map((h) => (
                      <th key={h} className={cn('text-left text-xs font-semibold px-5 py-3', d ? 'text-[#E6A854]' : 'text-slate-500')}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const type = typeConfig[p.type]
                    const status = statusConfig[p.status]
                    const TypeIcon = type.icon
                    const roi = calculateROI(p.price_monthly, p.assets_value)
                    return (
                      <tr key={p.id} className={cn('border-b last:border-0 transition-colors', d ? 'border-[#E6A854]/10 hover:bg-[#E6A854]/5' : 'border-[#E5E7EB] hover:bg-slate-50')}>
                        <td className="px-5 py-3.5">
                          <p className={cn('text-sm font-semibold', d ? 'text-white' : 'text-slate-700')}>{p.name}</p>
                          <p className="text-xs text-slate-400">{p.location}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md', type.color)}>
                            <TypeIcon className="w-3 h-3" />{type.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', status.color)}>{status.label}</span>
                        </td>
                        <td className={cn('px-5 py-3.5 text-sm', d ? 'text-slate-200' : 'text-slate-700')}>{formatCurrency(p.price_monthly)}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-400">{formatCurrency(p.assets_value)}</td>
                        <td className="px-5 py-3.5">
                          <span className={cn('text-sm font-bold', d ? 'text-[#E6A854]' : 'text-emerald-600')}>{roi.toFixed(2)}%</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setEditTarget(p); setShowForm(true) }}
                              className={cn('w-8 h-8 flex items-center justify-center rounded-lg transition', d ? 'hover:bg-[#E6A854]/10 text-slate-400 hover:text-[#E6A854]' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700')}>
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteConfirm(p.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showForm && <PropertyFormModal property={editTarget} onSave={handleSave} onClose={() => { setShowForm(false); setEditTarget(null) }} />}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className={cn('rounded-2xl shadow-xl w-full max-w-sm p-6 text-center', d ? 'bg-[#001117] border border-[#E6A854]/20' : 'bg-white')}>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <p className={cn('text-base font-bold mb-1', d ? 'text-white' : 'text-slate-800')}>Hapus Properti?</p>
            <p className="text-sm text-slate-400 mb-6">Data properti ini akan dihapus permanen.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)} className={cn('flex-1 py-2.5 border text-sm font-medium rounded-xl transition', d ? 'border-[#E6A854]/30 text-slate-400 hover:bg-[#E6A854]/10' : 'border-[#E5E7EB] text-slate-500 hover:bg-slate-50')}>Batal</button>
              <button onClick={() => { deleteProperty(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const statusConfig = {
  available: { label: 'Available', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  occupied: { label: 'Occupied', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  maintenance: { label: 'Maintenance', color: 'bg-amber-50 text-amber-600 border-amber-200' },
}

export default function InventoryPage() {
  const { properties, setProperties, addProperty, updateProperty, deleteProperty } = usePropertyStore()
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editTarget, setEditTarget] = useState<Property | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filtered = properties.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (data: Omit<Property, 'id'>) => {
    if (editTarget) {
      updateProperty(editTarget.id, data)
    } else {
      addProperty(data)
    }
    setShowForm(false)
    setEditTarget(null)
  }

  const handleEdit = (p: Property) => {
    setEditTarget(p)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteProperty(id)
    setDeleteConfirm(null)
  }

  if (!mounted) return null

  return (
    <div className="flex-1 bg-[#F9FAFB] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Inventory Properti</h1>
            <p className="text-slate-400 text-sm mt-1">Kelola semua data properti — tambah, edit, dan hapus</p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari properti..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Home className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Tidak ada properti ditemukan.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Properti</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Tipe</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Harga/Bulan</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Nilai Aset</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">ROI</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const type = typeConfig[p.type]
                  const status = statusConfig[p.status]
                  const TypeIcon = type.icon
                  const roi = calculateROI(p.price_monthly, p.assets_value)

                  return (
                    <tr key={p.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-slate-700">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.location}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md', type.color)}>
                          <TypeIcon className="w-3 h-3" />{type.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full border', status.color)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-700">{formatCurrency(p.price_monthly)}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{formatCurrency(p.assets_value)}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-bold text-emerald-600">{roi.toFixed(2)}%</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(p)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <PropertyFormModal
          property={editTarget}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-base font-bold text-slate-800 mb-1">Hapus Properti?</p>
            <p className="text-sm text-slate-400 mb-6">Data properti ini akan dihapus permanen dan tidak bisa dikembalikan.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-[#E5E7EB] text-slate-500 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
