'use client'

import { useState } from 'react'
import { X, Mail, User as UserIcon, Phone } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { useThemeStore } from '@/store/useThemeStore'
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
  const { darkMode: d } = useThemeStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) { setError(lang === 'id' ? 'Email harus diisi' : 'Email is required'); return }
    if (mode === 'register' && !name) { setError(lang === 'id' ? 'Nama harus diisi' : 'Name is required'); return }
    try {
      if (mode === 'login') {
        const user = login(email, name)
        if (user) { setTimeout(() => onClose(), 300) }
        else { setError(lang === 'id' ? 'Email tidak ditemukan' : 'Email not found') }
      } else {
        register(name, email, phone)
        setTimeout(() => onClose(), 300)
      }
    } catch {
      setError(lang === 'id' ? 'Terjadi kesalahan' : 'An error occurred')
    }
  }

  const inputCls = cn(
    'w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition',
    d ? 'bg-[#001117]/50 border-[#E6A854]/30 text-white placeholder-slate-500 focus:ring-[#E6A854]/50 focus:border-[#E6A854]'
      : 'bg-white border-[#E5E7EB] text-slate-700 focus:ring-[#E6A854]/30 focus:border-[#E6A854]'
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={cn('rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto', d ? 'bg-[#001117]' : 'bg-white')}>
        {/* Header */}
        <div className={cn('sticky top-0 border-b px-6 py-4 flex items-center justify-between rounded-t-2xl', d ? 'bg-[#001117] border-[#E6A854]/20' : 'bg-white border-[#E5E7EB]')}>
          <div className="flex items-center gap-3">
            <div className={d ? 'w-8 h-8 bg-gradient-to-br from-[#E6A854] to-[#D4AF37] rounded-lg flex items-center justify-center' : 'w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#E6A854] rounded-lg flex items-center justify-center'}>
              <span className="text-[#001117] font-bold text-xs">SV</span>
            </div>
            <h2 className={cn('text-xl font-bold', d ? 'text-white' : 'text-slate-900')}>
              {mode === 'login'
                ? lang === 'id' ? 'Masuk ke StayVest' : 'Login to StayVest'
                : lang === 'id' ? 'Daftar StayVest' : 'Register StayVest'}
            </h2>
          </div>
          <button onClick={onClose} className={cn('w-8 h-8 rounded-full flex items-center justify-center transition', d ? 'hover:bg-[#E6A854]/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={cn('flex border-b px-6', d ? 'border-[#E6A854]/20' : 'border-[#E5E7EB]')}>
          {(['login', 'register'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              className={cn(
                'flex-1 py-3 text-sm font-semibold border-b-2 transition',
                mode === tab
                  ? d ? 'border-[#E6A854] text-[#E6A854]' : 'border-[#D4AF37] text-[#D4AF37]'
                  : d ? 'border-transparent text-slate-500' : 'border-transparent text-slate-500'
              )}
            >
              {tab === 'login' ? (lang === 'id' ? 'Masuk' : 'Login') : (lang === 'id' ? 'Daftar' : 'Register')}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className={cn('block text-sm font-medium mb-2', d ? 'text-slate-300' : 'text-slate-700')}>
                {lang === 'id' ? 'Nama Lengkap' : 'Full Name'}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'id' ? 'Masukkan nama lengkap' : 'Enter your full name'}
                  className={inputCls} />
              </div>
            </div>
          )}

          <div>
            <label className={cn('block text-sm font-medium mb-2', d ? 'text-slate-300' : 'text-slate-700')}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'id' ? 'Masukkan email' : 'Enter your email'}
                className={inputCls} />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className={cn('block text-sm font-medium mb-2', d ? 'text-slate-300' : 'text-slate-700')}>
                {lang === 'id' ? 'Nomor Telepon (Opsional)' : 'Phone Number (Optional)'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder={lang === 'id' ? 'Masukkan nomor telepon' : 'Enter phone number'}
                  className={inputCls} />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button type="submit"
            className={cn('w-full py-3 font-semibold rounded-xl hover:shadow-lg transition',
              d ? 'bg-gradient-to-r from-[#E6A854] to-[#D4AF37] text-[#001117]'
                : 'bg-gradient-to-r from-[#D4AF37] to-[#E6A854] text-white'
            )}>
            {mode === 'login'
              ? lang === 'id' ? 'Masuk' : 'Login'
              : lang === 'id' ? 'Daftar' : 'Register'}
          </button>

          <p className={cn('text-xs text-center', d ? 'text-slate-500' : 'text-slate-500')}>
            {lang === 'id'
              ? 'Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami'
              : 'By continuing, you agree to our Terms & Conditions'}
          </p>
        </form>
      </div>
    </div>
  )
}
