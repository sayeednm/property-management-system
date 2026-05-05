'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar, Heart, ClipboardList, LogOut, Home, Sun, Moon } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { usePropertyStore } from '@/store/usePropertyStore'
import { useThemeStore } from '@/store/useThemeStore'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, logout, updateProfile } = useUserStore()
  const { bookings, favorites } = usePropertyStore()
  const { darkMode: d, toggleDarkMode } = useThemeStore()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (!isAuthenticated) { router.push('/public'); return }
    if (currentUser) { setName(currentUser.name); setEmail(currentUser.email); setPhone(currentUser.phone || '') }
  }, [isAuthenticated, currentUser, router])

  if (!currentUser) return null

  const userBookings = bookings.filter((b) => b.customerEmail === currentUser.email)
  const activeBookings = userBookings.filter((b) => b.status === 'approved').length
  const initials = currentUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const handleSave = () => {
    if (currentUser) { updateProfile(currentUser.id, { name, email, phone }); setIsEditing(false) }
  }

  const handleLogout = () => { logout(); router.push('/public') }

  const card = cn('rounded-2xl border p-6 mb-6', d ? 'bg-[#001117] border-[#E6A854]/20' : 'bg-white border-[#E5E7EB] shadow-sm')
  const text = d ? 'text-white' : 'text-slate-900'
  const subtext = d ? 'text-slate-400' : 'text-slate-500'
  const inputCls = cn(
    'w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition',
    d ? 'bg-[#001117]/50 border-[#E6A854]/30 text-white placeholder-slate-500 focus:ring-[#E6A854]/50 focus:border-[#E6A854] disabled:opacity-50'
      : 'border-[#E5E7EB] focus:ring-[#E6A854]/30 focus:border-[#E6A854] disabled:bg-slate-50 disabled:text-slate-600'
  )

  return (
    <div className={d ? 'min-h-screen bg-[#001117]' : 'min-h-screen bg-[#F9FAFB]'}>
      {/* Header */}
      <header className={cn('sticky top-0 z-40 border-b shadow-sm', d ? 'bg-[#001117]/95 backdrop-blur-sm border-[#E6A854]/20' : 'bg-white border-[#E5E7EB]')}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className={cn('flex items-center gap-2 transition', d ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}>
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className={cn('p-1.5 rounded-lg transition', d ? 'bg-[#E6A854]/10 text-[#E6A854] hover:bg-[#E6A854]/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}>
              {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => router.push('/landing')} className="flex items-center gap-2">
              <div className={d ? 'w-8 h-8 bg-gradient-to-br from-[#E6A854] to-[#D4AF37] rounded-lg flex items-center justify-center' : 'w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#E6A854] rounded-lg flex items-center justify-center'}>
                <Home className="w-4 h-4 text-[#001117]" />
              </div>
              <span className={cn('text-lg font-bold', d ? 'text-white' : 'text-slate-800')}>
                STAY<span className="text-[#E6A854]">VEST</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 sm:pb-8">
        {/* Profile Header */}
        <div className={card}>
          <div className="flex items-start gap-4">
            <div className={d ? 'w-20 h-20 bg-gradient-to-br from-[#E6A854] to-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0' : 'w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#E6A854] rounded-full flex items-center justify-center flex-shrink-0'}>
              <span className="text-2xl font-bold text-[#001117]">{initials}</span>
            </div>
            <div className="flex-1">
              <h1 className={cn('text-2xl font-bold mb-1', text)}>{currentUser.name}</h1>
              <p className={cn('text-sm mb-3', subtext)}>{currentUser.email}</p>
              <div className={cn('flex items-center gap-2 text-xs', subtext)}>
                <Calendar className="w-4 h-4" />
                <span>Bergabung {new Date(currentUser.joinedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: ClipboardList, value: userBookings.length, label: 'Total Booking', color: d ? 'text-[#E6A854]' : 'text-[#D4AF37]' },
            { icon: ClipboardList, value: activeBookings, label: 'Aktif', color: 'text-emerald-500' },
            { icon: Heart, value: favorites.length, label: 'Favorit', color: 'text-red-500' },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className={cn('rounded-xl border p-4 text-center', d ? 'bg-[#001117] border-[#E6A854]/20' : 'bg-white border-[#E5E7EB] shadow-sm')}>
              <Icon className={cn('w-6 h-6 mx-auto mb-2', color)} />
              <p className={cn('text-2xl font-bold', text)}>{value}</p>
              <p className={cn('text-xs', subtext)}>{label}</p>
            </div>
          ))}
        </div>

        {/* Profile Form */}
        <div className={card}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={cn('text-lg font-semibold', text)}>Informasi Profil</h2>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className={d ? 'text-sm font-semibold text-[#E6A854] hover:text-[#D4AF37]' : 'text-sm font-semibold text-[#D4AF37] hover:text-[#E6A854]'}>Edit</button>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => { setIsEditing(false); setName(currentUser.name); setEmail(currentUser.email); setPhone(currentUser.phone || '') }}
                  className={cn('text-sm font-semibold', subtext)}>Batal</button>
                <button onClick={handleSave} className={d ? 'text-sm font-semibold text-[#E6A854]' : 'text-sm font-semibold text-[#D4AF37]'}>Simpan</button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {[
              { label: 'Nama Lengkap', icon: UserIcon, value: name, onChange: setName, type: 'text', placeholder: 'Masukkan nama lengkap' },
              { label: 'Email', icon: Mail, value: email, onChange: setEmail, type: 'email', placeholder: 'Masukkan email' },
              { label: 'Nomor Telepon', icon: Phone, value: phone, onChange: setPhone, type: 'tel', placeholder: 'Masukkan nomor telepon' },
            ].map(({ label, icon: Icon, value, onChange, type, placeholder }) => (
              <div key={label}>
                <label className={cn('block text-sm font-medium mb-2', d ? 'text-slate-300' : 'text-slate-700')}>{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
                    disabled={!isEditing} placeholder={placeholder} className={inputCls} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className={cn('rounded-2xl border mb-6 overflow-hidden', d ? 'bg-[#001117] border-[#E6A854]/20' : 'bg-white border-[#E5E7EB] shadow-sm')}>
          {[
            { label: 'Booking Saya', icon: ClipboardList, onClick: () => router.push('/public/my-bookings'), border: true },
            { label: 'Favorit Saya', icon: Heart, onClick: () => router.push('/public'), border: false },
          ].map(({ label, icon: Icon, onClick, border }) => (
            <button key={label} onClick={onClick}
              className={cn('w-full flex items-center justify-between p-4 transition', border ? (d ? 'border-b border-[#E6A854]/20' : 'border-b border-[#E5E7EB]') : '', d ? 'hover:bg-[#E6A854]/10' : 'hover:bg-slate-50')}>
              <div className="flex items-center gap-3">
                <Icon className={d ? 'w-5 h-5 text-[#E6A854]' : 'w-5 h-5 text-slate-600'} />
                <span className={cn('font-medium', text)}>{label}</span>
              </div>
              <span className={subtext}>→</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className={cn('w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition', d ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100')}>
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  )
}
