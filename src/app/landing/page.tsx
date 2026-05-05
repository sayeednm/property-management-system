'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Building2, Calendar, TrendingUp, ArrowRight, Menu, X, Sun, Moon } from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { formatCurrency, calculateROI } from '@/lib/utils'

export default function LandingPage() {
  const router = useRouter()
  const { properties } = usePropertyStore()
  const availableProperties = properties.filter(p => p.status === 'available').slice(0, 6)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleCheckAvailability = () => {
    router.push('/public')
    // Scroll to search bar after navigation
    setTimeout(() => {
      const searchSection = document.querySelector('input[type="text"]') as HTMLInputElement
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        searchSection.focus()
      }
    }, 100)
  }

  return (
    <div className={darkMode ? 'min-h-screen bg-[#001117] text-white' : 'min-h-screen bg-white text-slate-900'}>
      {/* Navbar */}
      <nav className={darkMode ? 'bg-[#001117]/95 backdrop-blur-sm border-b border-[#E6A854]/20 sticky top-0 z-50' : 'bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] sticky top-0 z-50'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className={darkMode ? 'w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#E6A854] to-[#D4AF37] rounded-lg flex items-center justify-center' : 'w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#D4AF37] to-[#E6A854] rounded-lg flex items-center justify-center'}>
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-[#001117]" />
              </div>
              <span className={darkMode ? 'text-lg sm:text-xl font-bold text-[#E6A854]' : 'text-lg sm:text-xl font-bold text-slate-800'}>
                STAY<span className="text-[#E6A854]">VEST</span>
              </span>
            </div>

            {/* Menu - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => router.push('/landing')}
                className={darkMode ? 'text-sm font-medium text-[#E6A854] hover:text-[#D4AF37]' : 'text-sm font-medium text-[#D4AF37] hover:text-[#E6A854]'}
              >
                Beranda
              </button>
              <button 
                onClick={() => router.push('/public')}
                className={darkMode ? 'text-sm font-medium text-slate-300 hover:text-white' : 'text-sm font-medium text-slate-600 hover:text-slate-900'}
              >
                Katalog
              </button>
              <button 
                onClick={handleCheckAvailability}
                className={darkMode ? 'text-sm font-medium text-slate-300 hover:text-white' : 'text-sm font-medium text-slate-600 hover:text-slate-900'}
              >
                Cek Ketersediaan
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={darkMode ? 'p-2 bg-[#E6A854]/10 text-[#E6A854] rounded-lg hover:bg-[#E6A854]/20 transition' : 'p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Dashboard Button */}
              <button
                onClick={() => router.push('/dashboard')}
                className={darkMode ? 'px-4 sm:px-6 py-2 bg-gradient-to-r from-[#E6A854] to-[#D4AF37] text-[#001117] text-xs sm:text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-[#E6A854]/20 transition' : 'px-4 sm:px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#E6A854] text-white text-xs sm:text-sm font-semibold rounded-full hover:shadow-lg transition'}
              >
                Dashboard
              </button>

              {/* Hamburger Menu - Mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={darkMode ? 'md:hidden p-2 text-[#E6A854] hover:bg-[#E6A854]/10 rounded-lg transition' : 'md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={darkMode ? 'md:hidden bg-[#001117] border-t border-[#E6A854]/20 shadow-lg' : 'md:hidden bg-white border-t border-[#E5E7EB] shadow-lg'}>
            <div className="px-4 py-3 space-y-1">
              <button 
                onClick={() => {
                  router.push('/landing')
                  setMobileMenuOpen(false)
                }}
                className={darkMode ? 'block w-full text-left px-4 py-3 text-sm font-medium text-[#E6A854] hover:bg-[#E6A854]/10 rounded-lg transition' : 'block w-full text-left px-4 py-3 text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition'}
              >
                Beranda
              </button>
              <button 
                onClick={() => {
                  router.push('/public')
                  setMobileMenuOpen(false)
                }}
                className={darkMode ? 'block w-full text-left px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition' : 'block w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition'}
              >
                Katalog
              </button>
              <button 
                onClick={() => {
                  handleCheckAvailability()
                  setMobileMenuOpen(false)
                }}
                className={darkMode ? 'block w-full text-left px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition' : 'block w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition'}
              >
                Cek Ketersediaan
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className={darkMode ? 'absolute inset-0 bg-gradient-to-r from-[#001117]/90 via-[#001117]/70 to-[#001117]/50' : 'absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent'} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <p className={darkMode ? 'text-sm text-[#E6A854] mb-4 font-medium' : 'text-sm text-[#D4AF37] mb-4 font-medium'}>• Property management Indonesia</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Sewa, kelola, & hitung<br />
              hasil properti<br />
              <span className="text-[#E6A854]">dalam satu rumah.</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-xl">
              Kost, apartemen, villa, dan homestay—semua tertata. Cek unit kosong dengan hitungan detik. Lacak ROI real-time untuk investasi ideal.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleCheckAvailability}
                className={darkMode ? 'px-6 py-3 bg-gradient-to-r from-[#E6A854] to-[#D4AF37] text-[#001117] font-semibold rounded-full hover:shadow-lg hover:shadow-[#E6A854]/30 transition flex items-center gap-2' : 'px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#E6A854] text-white font-semibold rounded-full hover:shadow-lg transition flex items-center gap-2'}
              >
                <Calendar className="w-5 h-5" />
                Cek Ketersediaan
              </button>
              <button
                onClick={() => router.push('/public')}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition border border-white/30 flex items-center gap-2"
              >
                Lihat Katalog
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={darkMode ? 'py-16 bg-[#001117]' : 'py-16 bg-[#F9FAFB]'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className={darkMode ? 'w-12 h-12 bg-[#E6A854]/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#E6A854]/20' : 'w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0'}>
                <Building2 className={darkMode ? 'w-6 h-6 text-[#E6A854]' : 'w-6 h-6 text-[#D4AF37]'} />
              </div>
              <div>
                <h3 className={darkMode ? 'text-lg font-bold text-white mb-2' : 'text-lg font-bold text-slate-900 mb-2'}>Listing terpadu</h3>
                <p className={darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>
                  Kost, apartemen, villa, homestay—satu database. Semua unit tercatat rapi.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className={darkMode ? 'w-12 h-12 bg-[#C0C0C0]/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#C0C0C0]/20' : 'w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0'}>
                <Calendar className={darkMode ? 'w-6 h-6 text-[#C0C0C0]' : 'w-6 h-6 text-slate-600'} />
              </div>
              <div>
                <h3 className={darkMode ? 'text-lg font-bold text-white mb-2' : 'text-lg font-bold text-slate-900 mb-2'}>Cek kosong instan</h3>
                <p className={darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>
                  Tahu unit available untuk tanggal apa pun. Respon cepat, booking lancar.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className={darkMode ? 'w-12 h-12 bg-[#E6A854]/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#E6A854]/20' : 'w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0'}>
                <TrendingUp className={darkMode ? 'w-6 h-6 text-[#E6A854]' : 'w-6 h-6 text-emerald-600'} />
              </div>
              <div>
                <h3 className={darkMode ? 'text-lg font-bold text-white mb-2' : 'text-lg font-bold text-slate-900 mb-2'}>ROI real-time</h3>
                <p className={darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>
                  Yield aset dihitung otomatis dari setiap booking. Investasi makin jelas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Grid Section */}
      <section className={darkMode ? 'py-16 bg-[#0a1a20]' : 'py-16 bg-white'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className={darkMode ? 'text-sm text-[#E6A854] mb-2' : 'text-sm text-slate-500 mb-2'}>PILIHAN UNGGULAN</p>
              <h2 className={darkMode ? 'text-3xl font-bold text-white' : 'text-3xl font-bold text-slate-900'}>Properti aktif kami</h2>
            </div>
            <button
              onClick={() => router.push('/public')}
              className={darkMode ? 'text-sm font-semibold text-[#E6A854] hover:text-[#D4AF37] flex items-center gap-2' : 'text-sm font-semibold text-[#D4AF37] hover:text-[#E6A854] flex items-center gap-2'}
            >
              Lihat semua
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableProperties.map((property) => {
              const roi = calculateROI(property.price_monthly, property.assets_value)
              return (
                <div
                  key={property.id}
                  onClick={() => router.push(`/public/${property.id}?mode=rent`)}
                  className={darkMode ? 'bg-[#001117] rounded-2xl overflow-hidden border border-[#E6A854]/20 hover:shadow-xl hover:shadow-[#E6A854]/10 transition-all duration-300 cursor-pointer group' : 'bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:shadow-xl transition-all duration-300 cursor-pointer group'}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={darkMode ? 'absolute top-3 left-3 px-3 py-1 bg-[#E6A854]/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#001117]' : 'absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-slate-800'}>
                      {property.type === 'kost' ? 'Kost' : property.type === 'apartment' ? 'Apartment' : property.type === 'villa' ? 'Villa' : 'Homestay'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className={darkMode ? 'font-bold text-white mb-1 line-clamp-1' : 'font-bold text-slate-900 mb-1 line-clamp-1'}>{property.name}</h3>
                    <p className={darkMode ? 'text-sm text-slate-400 mb-3' : 'text-sm text-slate-500 mb-3'}>{property.location}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className={darkMode ? 'text-xs text-slate-500' : 'text-xs text-slate-400'}>Mulai dari</p>
                        <p className={darkMode ? 'text-lg font-bold text-white' : 'text-lg font-bold text-slate-900'}>{formatCurrency(property.price_monthly)}</p>
                        <p className={darkMode ? 'text-xs text-slate-500' : 'text-xs text-slate-500'}>/bulan</p>
                      </div>
                      <div className="text-right">
                        <p className={darkMode ? 'text-xs text-[#E6A854] font-semibold' : 'text-xs text-emerald-600 font-semibold'}>ROI</p>
                        <p className={darkMode ? 'text-lg font-bold text-[#E6A854]' : 'text-lg font-bold text-emerald-700'}>{roi.toFixed(1)}%</p>
                      </div>
                    </div>

                    <button className={darkMode ? 'w-full py-2 bg-[#E6A854]/10 text-[#E6A854] text-sm font-semibold rounded-lg hover:bg-[#E6A854]/20 transition border border-[#E6A854]/20' : 'w-full py-2 bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-100 transition'}>
                      Lihat Detail
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={darkMode ? 'py-20 bg-gradient-to-br from-[#E6A854] via-[#D4AF37] to-[#C0C0C0]' : 'py-20 bg-gradient-to-br from-[#D4AF37] via-[#E6A854] to-[#C0C0C0]'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#001117] mb-4">
            Siap kelola properti lebih efisien?
          </h2>
          <p className="text-lg text-[#001117]/80 mb-8">
            Mulai atur listing, lacak booking, dan hitung ROI—semua dalam satu platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/public')}
              className="px-8 py-3 bg-[#001117] text-white font-bold rounded-full hover:bg-[#0a1a20] transition"
            >
              Mulai Sekarang
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-white/20 backdrop-blur-sm text-[#001117] font-bold rounded-full hover:bg-white/30 transition border border-[#001117]/20"
            >
              Lihat Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={darkMode ? 'bg-[#001117] text-white py-12 border-t border-[#E6A854]/20' : 'bg-slate-900 text-white py-12'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className={darkMode ? 'w-8 h-8 bg-gradient-to-br from-[#E6A854] to-[#D4AF37] rounded-lg flex items-center justify-center' : 'w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#E6A854] rounded-lg flex items-center justify-center'}>
                  <Home className="w-4 h-4 text-[#001117]" />
                </div>
                <span className="text-lg font-bold">
                  STAY<span className="text-[#E6A854]">VEST</span>
                </span>
              </div>
              <p className={darkMode ? 'text-sm text-slate-400' : 'text-sm text-slate-400'}>
                Platform manajemen properti untuk sewa & investasi.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Produk</h4>
              <ul className={darkMode ? 'space-y-2 text-sm text-slate-400' : 'space-y-2 text-sm text-slate-400'}>
                <li><button onClick={() => router.push('/public')} className="hover:text-[#E6A854]">Katalog</button></li>
                <li><button onClick={() => router.push('/dashboard')} className="hover:text-[#E6A854]">Dashboard</button></li>
                <li><button onClick={() => router.push('/reports')} className="hover:text-[#E6A854]">Reports</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Perusahaan</h4>
              <ul className={darkMode ? 'space-y-2 text-sm text-slate-400' : 'space-y-2 text-sm text-slate-400'}>
                <li><a href="#" className="hover:text-[#E6A854]">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-[#E6A854]">Karir</a></li>
                <li><a href="#" className="hover:text-[#E6A854]">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Bantuan</h4>
              <ul className={darkMode ? 'space-y-2 text-sm text-slate-400' : 'space-y-2 text-sm text-slate-400'}>
                <li><a href="#" className="hover:text-[#E6A854]">FAQ</a></li>
                <li><a href="#" className="hover:text-[#E6A854]">Kontak</a></li>
                <li><a href="#" className="hover:text-[#E6A854]">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>
          <div className={darkMode ? 'border-t border-[#E6A854]/20 pt-8 text-center text-sm text-slate-400' : 'border-t border-slate-800 pt-8 text-center text-sm text-slate-400'}>
            <p>© 2025 StayVest. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
