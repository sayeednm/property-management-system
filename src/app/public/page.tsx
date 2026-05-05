'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, Building2, TreePine, House, Star, TrendingUp, Globe, Heart, User } from 'lucide-react'
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

  const availableProperties = properties.filter((p) => p.status === 'available')
  const filtered = availableProperties.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
    const matchType = filter === 'all' || p.type === filter
    return matchSearch && matchType
  })

  // Filter favorites
  const favoriteProperties = showFavorites 
    ? properties.filter((p) => favorites.includes(p.id))
    : filtered

  const displayProperties = showFavorites ? favoriteProperties : filtered

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
              <span className="text-base sm:text-lg font-bold text-slate-800">PropStay</span>
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

            {/* Right - Language Toggle */}
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      {!showFavorites && (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">
              {viewMode === 'rent' ? t('heroTitleRent', lang) : t('heroTitleInvest', lang)}
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 mb-6 sm:mb-10 max-w-2xl mx-auto px-4">
              {viewMode === 'rent' ? t('heroSubtitleRent', lang) : t('heroSubtitleInvest', lang)}
            </p>

            {/* Search bar - Mobile Optimized */}
            <div className="relative max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl sm:rounded-full shadow-xl border border-[#E5E7EB] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 p-4 sm:px-6 sm:py-4">
                <div className="flex items-center flex-1">
                  <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder', lang)}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 text-slate-700 placeholder-slate-400 focus:outline-none text-sm sm:text-base"
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

        {/* Stats */}
        {!showFavorites && (
          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-slate-500">
              <span className="font-semibold text-slate-900">{displayProperties.length}</span> {t('propertiesAvailable', lang)}
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
                onClick={() => router.push(`/public/${property.id}?lang=${lang}`)}
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
                <span className="text-base sm:text-lg font-bold text-slate-800">PropStay</span>
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
        <div className="grid grid-cols-3 h-16">
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
  const type = typeConfig[property.type]
  const TypeIcon = type.icon
  const roi = calculateROI(property.price_monthly, property.assets_value)
  const { toggleFavorite, isFavorite } = usePropertyStore()
  const favorite = isFavorite(property.id)
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    toggleFavorite(property.id)
  }
  
  return (
    <div onClick={onClick} className="group cursor-pointer transform transition-all duration-300 active:scale-95">
      {/* Image - Optimized for Mobile */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-300">
        <div className={cn('absolute inset-0 bg-gradient-to-br', type.gradient)} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <TypeIcon className="w-16 h-16 sm:w-20 sm:h-20 text-white/70 group-hover:scale-110 group-hover:text-white/90 transition-all duration-500" />
        </div>
        
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
