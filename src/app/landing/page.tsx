'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Building2, Calendar, TrendingUp, ArrowRight, Menu, X } from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { formatCurrency, calculateROI } from '@/lib/utils'

export default function LandingPage() {
  const router = useRouter()
  const { properties } = usePropertyStore()
  const availableProperties = properties.filter(p => p.status === 'available').slice(0, 6)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-800">StayVest</span>
            </div>

            {/* Menu - Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => router.push('/landing')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Beranda
              </button>
              <button 
                onClick={() => router.push('/public')}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Katalog
              </button>
              <button 
                onClick={() => router.push('/public')}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Cek Ketersediaan
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Dashboard Button */}
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 sm:px-6 py-2 bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-slate-800 transition"
              >
                Dashboard
              </button>

              {/* Hamburger Menu - Mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition"
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
          <div className="md:hidden bg-white border-t border-[#E5E7EB] shadow-lg">
            <div className="px-4 py-3 space-y-1">
              <button 
                onClick={() => {
                  router.push('/landing')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              >
                Beranda
              </button>
              <button 
                onClick={() => {
                  router.push('/public')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition"
              >
                Katalog
              </button>
              <button 
                onClick={() => {
                  router.push('/public')
                  setMobileMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition"
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <p className="text-sm text-indigo-400 mb-4 font-medium">• Property management Indonesia</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Sewa, kelola, & hitung<br />
              hasil properti<br />
              <span className="text-indigo-400">dalam satu rumah.</span>
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-xl">
              Kost, apartemen, villa, dan homestay—semua tertata. Cek unit kosong dengan hitungan detik. Lacak ROI real-time untuk investasi ideal.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/public')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition flex items-center gap-2"
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
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Listing terpadu</h3>
                <p className="text-sm text-slate-600">
                  Kost, apartemen, villa, homestay—satu database. Semua unit tercatat rapi.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Cek kosong instan</h3>
                <p className="text-sm text-slate-600">
                  Tahu unit available untuk tanggal apa pun. Respon cepat, booking lancar.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">ROI real-time</h3>
                <p className="text-sm text-slate-600">
                  Yield aset dihitung otomatis dari setiap booking. Investasi makin jelas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Grid Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-slate-500 mb-2">PILIHAN UNGGULAN</p>
              <h2 className="text-3xl font-bold text-slate-900">Properti aktif kami</h2>
            </div>
            <button
              onClick={() => router.push('/public')}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
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
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-slate-800">
                      {property.type === 'kost' ? 'Kost' : property.type === 'apartment' ? 'Apartment' : property.type === 'villa' ? 'Villa' : 'Homestay'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{property.name}</h3>
                    <p className="text-sm text-slate-500 mb-3">{property.location}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-slate-400">Mulai dari</p>
                        <p className="text-lg font-bold text-slate-900">{formatCurrency(property.price_monthly)}</p>
                        <p className="text-xs text-slate-500">/bulan</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-emerald-600 font-semibold">ROI</p>
                        <p className="text-lg font-bold text-emerald-700">{roi.toFixed(1)}%</p>
                      </div>
                    </div>

                    <button className="w-full py-2 bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-100 transition">
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
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Siap kelola properti lebih efisien?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Mulai atur listing, lacak booking, dan hitung ROI—semua dalam satu platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/public')}
              className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-full hover:bg-slate-50 transition"
            >
              Mulai Sekarang
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/20 transition border border-white/30"
            >
              Lihat Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">StayVest</span>
              </div>
              <p className="text-sm text-slate-400">
                Platform manajemen properti untuk sewa & investasi.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Produk</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => router.push('/public')} className="hover:text-white">Katalog</button></li>
                <li><button onClick={() => router.push('/dashboard')} className="hover:text-white">Dashboard</button></li>
                <li><button onClick={() => router.push('/reports')} className="hover:text-white">Reports</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white">Karir</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Bantuan</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Kontak</a></li>
                <li><a href="#" className="hover:text-white">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>© 2025 StayVest. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
