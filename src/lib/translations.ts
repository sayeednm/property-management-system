export type Language = 'id' | 'en'

export const translations = {
  id: {
    // Navbar
    rent: 'Sewa',
    invest: 'Investasi',
    about: 'Tentang Kami',
    contact: 'Kontak',
    
    // Hero
    heroTitleRent: 'Temukan Hunian Impian di Yogyakarta',
    heroTitleInvest: 'Investasi Properti Menguntungkan',
    heroSubtitleRent: 'Properti berkualitas di Yogyakarta. Kost, Apartment, Villa, dan Homestay dengan harga terjangkau.',
    heroSubtitleInvest: 'Analisis ROI transparan untuk setiap properti. Temukan investasi terbaik dengan return optimal.',
    searchPlaceholder: 'Cari lokasi atau nama properti...',
    searchButton: 'Cari',
    
    // Filters
    all: 'Semua',
    kost: 'Kost',
    apartment: 'Apartment',
    villa: 'Villa',
    homestay: 'Homestay',
    
    // Stats
    propertiesAvailable: 'properti tersedia',
    
    // Card
    perMonth: '/bulan',
    assetValue: 'Nilai Aset',
    roiPerYear: 'ROI {roi}% per tahun',
    
    // Footer
    footerTagline: 'Hunian berkualitas di Jawa Tengah',
    aboutUs: 'Tentang Kami',
    career: 'Karir',
    blog: 'Blog',
    support: 'Dukungan',
    helpCenter: 'Pusat Bantuan',
    faq: 'FAQ',
    legal: 'Legal',
    terms: 'Syarat & Ketentuan',
    privacy: 'Kebijakan Privasi',
    copyright: '© 2025 PropStay. Semua hak dilindungi.',
    
    // Detail page
    back: 'Kembali',
    reviews: 'ulasan',
    managedBy: 'Dikelola oleh PropStay',
    verifiedHost: 'Verified Host · 5 tahun pengalaman',
    aboutProperty: 'Tentang properti ini',
    facilities: 'Fasilitas',
    investmentInfo: 'Informasi Investasi',
    annualRevenue: 'Pendapatan/Tahun',
    monthlyRevenue: 'Pendapatan/Bulan',
    annualROI: 'ROI Tahunan',
    location: 'Lokasi',
    thingsToKnow: 'Hal yang perlu diketahui',
    cancellationPolicy: 'Kebijakan pembatalan',
    houseRules: 'Peraturan rumah',
    safetyProperty: 'Keselamatan & properti',
    learnMore: 'Pelajari selengkapnya',
    bookNow: 'Booking Sekarang',
    noCharge: 'Anda tidak akan dikenakan biaya',
    securePayment: 'Pembayaran aman',
    flexibleCheckin: 'Fleksibel check-in',
    verifiedHostBadge: 'Host terverifikasi',
    exploreMore: 'Telusuri pilihan lainnya di Yogyakarta',
    rentalPlace: 'Sewa tempat liburan',
  },
  en: {
    // Navbar
    rent: 'Rent',
    invest: 'Invest',
    about: 'About Us',
    contact: 'Contact',
    
    // Hero
    heroTitleRent: 'Find Your Dream Home in Yogyakarta',
    heroTitleInvest: 'Profitable Property Investment',
    heroSubtitleRent: 'Quality properties in Yogyakarta. Kost, Apartments, Villas, and Homestays at affordable prices.',
    heroSubtitleInvest: 'Transparent ROI analysis for every property. Find the best investment with optimal returns.',
    searchPlaceholder: 'Search location or property name...',
    searchButton: 'Search',
    
    // Filters
    all: 'All',
    kost: 'Boarding House',
    apartment: 'Apartment',
    villa: 'Villa',
    homestay: 'Homestay',
    
    // Stats
    propertiesAvailable: 'properties available',
    
    // Card
    perMonth: '/month',
    assetValue: 'Asset Value',
    roiPerYear: 'ROI {roi}% per year',
    
    // Footer
    footerTagline: 'Quality housing in Central Java',
    aboutUs: 'About Us',
    career: 'Career',
    blog: 'Blog',
    support: 'Support',
    helpCenter: 'Help Center',
    faq: 'FAQ',
    legal: 'Legal',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    copyright: '© 2025 PropStay. All rights reserved.',
    
    // Detail page
    back: 'Back',
    reviews: 'reviews',
    managedBy: 'Managed by PropStay',
    verifiedHost: 'Verified Host · 5 years experience',
    aboutProperty: 'About this property',
    facilities: 'Facilities',
    investmentInfo: 'Investment Information',
    annualRevenue: 'Annual Revenue',
    monthlyRevenue: 'Monthly Revenue',
    annualROI: 'Annual ROI',
    location: 'Location',
    thingsToKnow: 'Things to know',
    cancellationPolicy: 'Cancellation policy',
    houseRules: 'House rules',
    safetyProperty: 'Safety & property',
    learnMore: 'Learn more',
    bookNow: 'Book Now',
    noCharge: 'You won\'t be charged yet',
    securePayment: 'Secure payment',
    flexibleCheckin: 'Flexible check-in',
    verifiedHostBadge: 'Verified host',
    exploreMore: 'Explore more options in Yogyakarta',
    rentalPlace: 'Vacation rentals',
  },
}

export function t(key: keyof typeof translations.id, lang: Language, params?: Record<string, string>): string {
  let text = translations[lang][key]
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
  }
  return text
}
