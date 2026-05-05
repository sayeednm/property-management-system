'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Property, PropertyType, PropertyStatus } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface FormData {
  name: string
  type: PropertyType
  location: string
  price_monthly: string
  price_daily: string
  assets_value: string
  status: PropertyStatus
}

const defaultForm: FormData = {
  name: '',
  type: 'kost',
  location: '',
  price_monthly: '',
  price_daily: '',
  assets_value: '',
  status: 'available',
}

interface Props {
  property?: Property | null
  onSave: (data: Omit<Property, 'id'>) => void
  onClose: () => void
}

export default function PropertyFormModal({ property, onSave, onClose }: Props) {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    if (property) {
      setForm({
        name: property.name,
        type: property.type,
        location: property.location,
        price_monthly: String(property.price_monthly),
        price_daily: String(property.price_daily),
        assets_value: String(property.assets_value),
        status: property.status,
      })
    }
  }, [property])

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'Wajib diisi'
    if (!form.location.trim()) e.location = 'Wajib diisi'
    if (!form.price_monthly || isNaN(Number(form.price_monthly))) e.price_monthly = 'Angka valid'
    if (!form.price_daily || isNaN(Number(form.price_daily))) e.price_daily = 'Angka valid'
    if (!form.assets_value || isNaN(Number(form.assets_value))) e.assets_value = 'Angka valid'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSave({
      name: form.name.trim(),
      type: form.type,
      location: form.location.trim(),
      price_monthly: Number(form.price_monthly),
      price_daily: Number(form.price_daily),
      assets_value: Number(form.assets_value),
      status: form.status,
      images: [],
    })
  }

  const field = (
    key: keyof FormData,
    label: string,
    placeholder: string,
    type = 'text'
  ) => (
    <div>
      <label className="text-xs font-medium text-slate-500 mb-1 block">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className={cn(
          'w-full px-3 py-2.5 border rounded-xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition',
          errors[key] ? 'border-red-300' : 'border-[#E5E7EB]'
        )}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-base font-bold text-slate-800">
            {property ? 'Edit Properti' : 'Tambah Properti Baru'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {field('name', 'Nama Properti', 'Contoh: Kost Seturan Residence')}
          {field('location', 'Lokasi', 'Contoh: Seturan, Yogyakarta')}

          {/* Type & Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Tipe</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as PropertyType })}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition bg-white"
              >
                <option value="kost">Kost</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="homestay">Homestay</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as PropertyStatus })}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition bg-white"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Pricing row */}
          <div className="grid grid-cols-2 gap-3">
            {field('price_monthly', 'Harga/Bulan (Rp)', '1200000', 'number')}
            {field('price_daily', 'Harga/Hari (Rp)', '80000', 'number')}
          </div>

          {field('assets_value', 'Nilai Aset (Rp)', '350000000', 'number')}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#E5E7EB] text-slate-500 text-sm font-medium rounded-xl hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
            >
              {property ? 'Simpan Perubahan' : 'Tambah Properti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
