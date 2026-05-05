'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, Building2, TreePine, House, Star, TrendingUp, Globe, Heart, User, LayoutDashboard } from 'lucide-react'
import { usePropertyStore } from '@/store/usePropertyStore'
import { useUserStore } from '@/store/useUserStore'
import { Property, PropertyType } from '@/lib/supabase'
import { formatCurrency, calculateROI, cn } from '@/lib/utils'
import { t, Language } from '@/lib/translations'
import AuthModal from '@/components/AuthModal'

const typeConfig = {
  kost: { label: 'Kost', icon: Home, gradient: 'from-blue-400 to-blue-600' },
  apartment: { label: 'Apartment', icon: Building2, gradient: 'from-purple-400 to-purple-600' },
  villa: { label: 'Villa', icon: TreePine, gradient: 'from-green-400 to-green-600' },
  homestay: { label: 'Homestay', icon: House, gradient: 'from-orange-400 to-orange-600' },
}

type ViewMode = 'rent' | 'invest'

export default function PublicPage() {
  const { properties, favorites } = usePropertyStore()
  const { isAuthenticated, currentUser } = useUserStore()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<PropertyType | 'all'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('rent')
  const [lang, setLang] = useState<Language>('id')
  const [showFavorites, setShowFavorites] = useState(false)
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'favorites' | 'account'>('home')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'roi-high' | 'roi-low'>('default')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000])
  const [selectedLocation, setSelectedLocation] = useState<string>('all')

  const availableProperties = properties.filter((p) => p.status === 'available')
  
  // Get unique locations
  const locations = Array.from(new Set(availableProperties.map(p => {
    const parts = p.location.split(',')
    return parts[0].trim()
  }))).sort()

  const filtered = availableProperties.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
    const matchType = filter === 'all' || p.type === filter
    
    // Filter by price range (Rent mode)
    const matchPrice = viewMode === 'invest' || (p.price_monthly >= priceRange[0] && p.price_monthly <= priceRange[1])
    
    // Filter by location
    const matchLocation = selectedLocation === 'all' || p.location.includes(selectedLocation)
    
    return matchSearch && matchType && matchPrice && matchLocation
  })

  // Sort properties
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price_monthly - b.price_monthly
    if (sortBy === 'price-high') return b.price_monthly - a.price_monthly
    if (sortBy === 'roi-high') return calculateROI(b.price_monthly, b.assets_value) - calculateROI(a.price_monthly, a.assets_value)
    if (sortBy === 'roi-low') return calculateROI(a.price_monthly, a.assets_value) - calculateROI(b.price_monthly, b.assets_value)
    return 0
  })

  // Filter favorites
  const favoriteProperties = showFavorites 
    ? properties.filter((p) => favorites.includes(p.id))
    : sorted

  const displayProperties = showFavorites ? favoriteProperties : sorted

  const handleTabChange = (tab: 'home' | 'search' | 'favorites' | 'account') => {
    setActiveTab(tab)
    if (tab === 'home') {
      setShowFavorites(false)
    } else if (tab === 'favorites') {
      setShowFavorites(true)
      setActiveTab('favorites')
    } else if (tab === 'account') {
      if (isAuthenticated) {
        router.push('/public/profile')
      } else {
        setShowAuthModal(true)
      }
    }
  }

  const filterOptions = [
    { label: t('all', lang), value: 'all' as const },
    { label: t('kost', lang), value: 'kost' as const },
    { label: t('apartment', lang), value: 'apartment' as const },
    { label: t('villa', lang), value: 'villa' as const },
    { label: t('homestay', lang), value: 'homestay' as const },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar - Clean Single Row */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-800">StayVest</span>
            </div>

            {/* Center - Mode Toggle & Favorites */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 rounded-full p-1">
                <button
                  onClick={() => {
                    setViewMode('rent')
                    setShowFavorites(false)
                  }}
                  className={cn(
                    'px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all',
                    viewMode === 'rent' && !showFavorites
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600'
                  )}
                >
                  {t('rent', lang)}
                </button>
                <button
                  onClick={() => {
                    setViewMode('invest')
                    setShowFavorites(false)
                  }}
                  className={cn(
                    'px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all',
                    viewMode === 'invest' && !showFavorites
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600'
                  )}
                >
                  {t('invest', lang)}
                </button>
              </div>

              {/* Favorites Button */}
              <button
                onClick={() => {
                  setShowFavorites(!showFavorites)
                  setActiveTab(showFavorites ? 'home' : 'favorites')
                }}
                className={cn(
                  'relative hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all',
                  (showFavorites || activeTab === 'favorites')
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                <Heart className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4', (showFavorites || activeTab === 'favorites') && 'fill-red-600')} />
                <span className="hidden sm:inline">{lang === 'id' ? 'Favorit' : 'Favorites'}</span>
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>

            {/* Right - Language Toggle & Account */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang.toUpperCase()}</span>
              </button>

              {/* Admin Link - Desktop Only */}
              <button
                onClick={() => router.push('/dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full text-xs font-semibold text-white hover:bg-slate-900 transition"
              >
                <span>Admin</span>
              </button>

              {/* Account Button - Desktop Only */}
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    router.push('/public/profile')
                  } else {
                    setShowAuthModal(true)
                  }
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
              >
                <User className="w-4 h-4" />
                <span>
                  {isAuthenticated && currentUser
                    ? currentUser.name.split(' ')[0]
                    : lang === 'id'
                    ? 'Masuk'
                    : 'Login'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized with Background Image */}
      {!showFavorites && (
        <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-b border-[#E5E7EB] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80" 
              alt="Background"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/90 via-purple-50/90 to-pink-50/90" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">
              {viewMode === 'rent' ? t('heroTitleRent', lang) : t('heroTitleInvest', lang)}
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 mb-6 sm:mb-10 max-w-2xl mx-auto px-4">
              {viewMode === 'rent' ? t('heroSubtitleRent', lang) : t('heroSubtitleInvest', lang)}
            </p>

            {/* Search bar - Mobile Optimized */}
            <div className="relative max-w-2xl mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-full shadow-xl border border-[#E5E7EB] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 p-4 sm:px-6 sm:py-4">
                <div className="flex items-center flex-1">
                  <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder', lang)}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-slate-700 placeholder-slate-400 focus:outline-none text-sm sm:text-base bg-transparent"
                  />
                </div>
                <button className="w-full sm:w-auto sm:ml-3 px-6 py-2.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl sm:rounded-full hover:shadow-lg transition">
                  {t('searchButton', lang)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-24 sm:pb-10">
        {/* Page Title for Favorites */}
        {showFavorites && (
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {lang === 'id' ? '❤️ Properti Favorit Saya' : '❤️ My Favorite Properties'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              {lang === 'id' 
                ? `Anda memiliki ${favorites.length} properti favorit` 
                : `You have ${favorites.length} favorite properties`}
            </p>
          </div>
        )}

        {/* Filter tabs - Only show when not in favorites view */}
        {!showFavorites && (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 sm:mb-8">
            <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:flex-wrap pb-2 sm:pb-0">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={cn(
                    'px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all border whitespace-nowrap',
                    filter === opt.value
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-white border-[#E5E7EB] text-slate-600'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Filters - Only show when not in favorites view */}
        {!showFavorites && (
          <div className="mb-6 sm:mb-8 bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sort By */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {lang === 'id' ? 'Urutkan' : 'Sort By'}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                >
                  <option value="default">{lang === 'id' ? 'Default' : 'Default'}</option>
                  {viewMode === 'rent' ? (
                    <>
                      <option value="price-low">{lang === 'id' ? 'Harga Termurah' : 'Lowest Price'}</option>
                      <option value="price-high">{lang === 'id' ? 'Harga Termahal' : 'Highest Price'}</option>
                    </>
                  ) : (
                    <>
                      <option value="roi-high">{lang === 'id' ? '🏆 ROI Tertinggi' : '🏆 Highest ROI'}</option>
                      <option value="roi-low">{lang === 'id' ? 'ROI Terendah' : 'Lowest ROI'}</option>
                    </>
                  )}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  {lang === 'id' ? 'Lokasi (Kecamatan)' : 'Location (District)'}
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                >
                  <option value="all">{lang === 'id' ? 'Semua Lokasi' : 'All Locations'}</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Price Range - Only for Rent Mode */}
              {viewMode === 'rent' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    {lang === 'id' ? 'Rentang Harga/Bulan' : 'Price Range/Month'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </p>
                </div>
              )}

              {/* ROI Info - Only for Invest Mode */}
              {viewMode === 'invest' && displayProperties.length > 0 && (
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    {lang === 'id' ? 'Info ROI' : 'ROI Info'}
                  </label>
                  <div className="bg-emerald-50 rounded-xl px-4 py-2.5 border border-emerald-200">
                    <p className="text-xs text-emerald-700 font-semibold">
                      {lang === 'id' 
                        ? `🏆 ROI Tertinggi: ${calculateROI(displayProperties[0].price_monthly, displayProperties[0].assets_value).toFixed(2)}%`
                        : `🏆 Highest ROI: ${calculateROI(displayProperties[0].price_monthly, displayProperties[0].assets_value).toFixed(2)}%`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setSortBy('default')
                setPriceRange([0, 20000000])
                setSelectedLocation('all')
                setFilter('all')
                setSearch('')
              }}
              className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {lang === 'id' ? '🔄 Reset Semua Filter' : '🔄 Reset All Filters'}
            </button>
          </div>
        )}

        {/* Stats */}
        {!showFavorites && (
          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{displayProperties.length}</span> {t('propertiesAvailable', lang)}
              {sortBy !== 'default' && (
                <span className="ml-2 text-indigo-600">
                  • {sortBy === 'price-low' ? (lang === 'id' ? 'Termurah' : 'Lowest') : sortBy === 'price-high' ? (lang === 'id' ? 'Termahal' : 'Highest') : sortBy === 'roi-high' ? (lang === 'id' ? 'ROI Tertinggi' : 'Highest ROI') : (lang === 'id' ? 'ROI Terendah' : 'Lowest ROI')}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Grid - Responsive */}
        {displayProperties.length === 0 ? (
          <div className="text-center py-16 sm:py-20 text-slate-400">
            {showFavorites ? (
              <>
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-30" />
                <p className="text-sm sm:text-base mb-2">
                  {lang === 'id' ? 'Belum ada properti favorit' : 'No favorite properties yet'}
                </p>
                <p className="text-xs sm:text-sm">
                  {lang === 'id' 
                    ? 'Klik ikon ❤️ pada properti untuk menambahkan ke favorit' 
                    : 'Click the ❤️ icon on properties to add to favorites'}
                </p>
              </>
            ) : (
              <>
                <Home className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-30" />
                <p className="text-sm">No properties found.</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                viewMode={viewMode}
                lang={lang}
                onClick={() => {}} // Not used anymore, handled inside PropertyCard
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-slate-50 border-t border-[#E5E7EB] mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-base sm:text-lg font-bold text-slate-800">StayVest</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">{t('footerTagline', lang)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2 sm:mb-3 text-xs sm:text-sm">{t('about', lang)}</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900">{t('aboutUs', lang)}</a></li>
                <li><a href="#" className="hover:text-slate-900">{t('career', lang)}</a></li>
                <li><a href="#" className="hover:text-slate-900">{t('blog', lang)}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2 sm:mb-3 text-xs sm:text-sm">{t('support', lang)}</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900">{t('helpCenter', lang)}</a></li>
                <li><a href="#" className="hover:text-slate-900">{t('contact', lang)}</a></li>
                <li><a href="#" className="hover:text-slate-900">{t('faq', lang)}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-2 sm:mb-3 text-xs sm:text-sm">{t('legal', lang)}</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-500">
                <li><a href="#" className="hover:text-slate-900">{t('terms', lang)}</a></li>
                <li><a href="#" className="hover:text-slate-900">{t('privacy', lang)}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#E5E7EB] pt-4 sm:pt-6 text-center text-xs sm:text-sm text-slate-400">
            <p>{t('copyright', lang)}</p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] shadow-lg sm:hidden z-50">
        <div className="grid grid-cols-4 h-16">
          {/* Search/Home */}
          <button
            onClick={() => handleTabChange('home')}
            className={cn(
              'flex flex-col items-center justify-center gap-1 transition-colors',
              activeTab === 'home' ? 'text-red-600' : 'text-slate-400'
            )}
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">{lang === 'id' ? 'Telusuri' : 'Search'}</span>
          </button>

          {/* Favorites */}
          <button
            onClick={() => handleTabChange('favorites')}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 transition-colors',
              activeTab === 'favorites' ? 'text-red-600' : 'text-slate-400'
            )}
          >
            <Heart className={cn('w-5 h-5', activeTab === 'favorites' && 'fill-red-600')} />
            <span className="text-[10px] font-medium">{lang === 'id' ? 'Favorit' : 'Favorites'}</span>
            {favorites.length > 0 && (
              <span className="absolute top-1 right-6 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Admin */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex flex-col items-center justify-center gap-1 text-slate-800 transition-colors hover:text-indigo-600"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-medium">Admin</span>
          </button>

          {/* Account */}
          <button
            onClick={() => handleTabChange('account')}
            className={cn(
              'flex flex-col items-center justify-center gap-1 transition-colors',
              activeTab === 'account' ? 'text-red-600' : 'text-slate-400'
            )}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">
              {isAuthenticated 
                ? currentUser?.name.split(' ')[0] 
                : lang === 'id' ? 'Masuk' : 'Login'}
            </span>
          </button>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} lang={lang} />
      )}
    </div>
  )
}

function PropertyCard({ property, viewMode, lang, onClick }: { property: Property; viewMode: ViewMode; lang: Language; onClick: () => void }) {
  const router = useRouter()
  const type = typeConfig[property.type]
  const TypeIcon = type.icon
  const roi = calculateROI(property.price_monthly, property.assets_value)
  const { toggleFavorite, isFavorite } = usePropertyStore()
  const favorite = isFavorite(property.id)
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    toggleFavorite(property.id)
  }
  
  const handleCardClick = () => {
    router.push(`/public/${property.id}?mode=${viewMode}&lang=${lang}`)
  }
  
  return (
    <div onClick={handleCardClick} className="group cursor-pointer transform transition-all duration-300 active:scale-95">
      {/* Image - Optimized for Mobile */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-300">
        <img 
          src={property.images[0]} 
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md z-10"
        >
          <svg 
            className={cn(
              "w-4 h-4 transition-all",
              favorite ? "fill-red-500 text-red-500" : "fill-none text-slate-700"
            )} 
            stroke="currentColor" 
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-lg">
          {type.label}
        </div>
      </div>

      {/* Info - Compact */}
      <div className="px-1">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-slate-900 text-sm line-clamp-1 flex-1">
            {property.name}
          </h3>
          {viewMode === 'rent' && (
            <div className="flex items-center gap-1 ml-2">
              <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
              <span className="text-xs font-semibold text-slate-900">4.9</span>
            </div>
          )}
        </div>
        
        <p className="text-xs text-slate-500 mb-2 line-clamp-1">{property.location}</p>

        {viewMode === 'rent' ? (
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-slate-900">{formatCurrency(property.price_monthly)}</span>
            <span className="text-xs text-slate-500 font-medium">{t('perMonth', lang)}</span>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1 mb-1.5">
              <span className="text-base font-bold text-slate-900">{formatCurrency(property.assets_value)}</span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-50 rounded-lg px-2 py-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">ROI {roi.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
