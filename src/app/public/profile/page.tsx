'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User as UserIcon, Mail, Phone, Calendar, Heart, ClipboardList, LogOut, Home } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { usePropertyStore } from '@/store/usePropertyStore'

export default function ProfilePage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, logout, updateProfile } = useUserStore()
  const { bookings, favorites } = usePropertyStore()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/public')
      return
    }
    if (currentUser) {
      setName(currentUser.name)
      setEmail(currentUser.email)
      setPhone(currentUser.phone || '')
    }
  }, [isAuthenticated, currentUser, router])

  if (!currentUser) return null

  const userBookings = bookings.filter((b) => b.customerEmail === currentUser.email)
  const activeBookings = userBookings.filter((b) => b.status === 'approved').length

  const handleSave = () => {
    if (currentUser) {
      updateProfile(currentUser.id, { name, email, phone })
      setIsEditing(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/public')
  }

  // Get initials for avatar
  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

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
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 mb-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{currentUser.name}</h1>
              <p className="text-sm text-slate-500 mb-3">{currentUser.email}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Bergabung {new Date(currentUser.joinedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 text-center">
            <ClipboardList className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{userBookings.length}</p>
            <p className="text-xs text-slate-500">Total Booking</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 text-center">
            <ClipboardList className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{activeBookings}</p>
            <p className="text-xs text-slate-500">Aktif</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 text-center">
            <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-slate-900">{favorites.length}</p>
            <p className="text-xs text-slate-500">Favorit</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Informasi Profil</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setName(currentUser.name)
                    setEmail(currentUser.email)
                    setPhone(currentUser.phone || '')
                  }}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Simpan
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Telepon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Masukkan nomor telepon"
                  className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] mb-6 overflow-hidden">
          <button
            onClick={() => router.push('/public/my-bookings')}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition border-b border-[#E5E7EB]"
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-900">Booking Saya</span>
            </div>
            <span className="text-slate-400">→</span>
          </button>

          <button
            onClick={() => router.push('/public?favorites=true')}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-900">Favorit Saya</span>
            </div>
            <span className="text-slate-400">→</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  )
}
