'use client'

import { useState } from 'react'
import { X, Mail, User as UserIcon, Phone } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { cn } from '@/lib/utils'

interface AuthModalProps {
  onClose: () => void
  lang: 'id' | 'en'
}

export default function AuthModal({ onClose, lang }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const { login, register } = useUserStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError(lang === 'id' ? 'Email harus diisi' : 'Email is required')
      return
    }

    if (mode === 'register' && !name) {
      setError(lang === 'id' ? 'Nama harus diisi' : 'Name is required')
      return
    }

    try {
      if (mode === 'login') {
        const user = login(email, name)
        if (user) {
          // Small delay for better UX
          setTimeout(() => {
            onClose()
          }, 300)
        } else {
          setError(lang === 'id' ? 'Email tidak ditemukan' : 'Email not found')
        }
      } else {
        register(name, email, phone)
        // Small delay for better UX
        setTimeout(() => {
          onClose()
        }, 300)
      }
    } catch (err) {
      setError(lang === 'id' ? 'Terjadi kesalahan' : 'An error occurred')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'login'
              ? lang === 'id'
                ? 'Masuk ke StayVest'
                : 'Login to StayVest'
              : lang === 'id'
              ? 'Daftar StayVest'
              : 'Register StayVest'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] px-6">
          <button
            onClick={() => setMode('login')}
            className={cn(
              'flex-1 py-3 text-sm font-semibold border-b-2 transition',
              mode === 'login'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500'
            )}
          >
            {lang === 'id' ? 'Masuk' : 'Login'}
          </button>
          <button
            onClick={() => setMode('register')}
            className={cn(
              'flex-1 py-3 text-sm font-semibold border-b-2 transition',
              mode === 'register'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500'
            )}
          >
            {lang === 'id' ? 'Daftar' : 'Register'}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {lang === 'id' ? 'Nama Lengkap' : 'Full Name'}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'id' ? 'Masukkan nama lengkap' : 'Enter your full name'}
                  className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'id' ? 'Masukkan email' : 'Enter your email'}
                className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {lang === 'id' ? 'Nomor Telepon (Opsional)' : 'Phone Number (Optional)'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={lang === 'id' ? 'Masukkan nomor telepon' : 'Enter phone number'}
                  className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
          >
            {mode === 'login'
              ? lang === 'id'
                ? 'Masuk'
                : 'Login'
              : lang === 'id'
              ? 'Daftar'
              : 'Register'}
          </button>

          <p className="text-xs text-center text-slate-500">
            {lang === 'id'
              ? 'Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami'
              : 'By continuing, you agree to our Terms & Conditions'}
          </p>
        </form>
      </div>
    </div>
  )
}
