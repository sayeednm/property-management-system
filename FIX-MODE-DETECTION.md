# 🔧 Fix: Mode Detection di Detail Page

## ❌ Masalah Sebelumnya

Ketika user klik property card di mode **Invest**, detail page tetap menampilkan konten **Rent** mode. Ini karena mode parameter tidak di-pass ke URL saat navigasi.

## ✅ Solusi

### 1. **Update PropertyCard Component**

Sebelumnya, `onClick` prop langsung dipanggil tanpa pass mode parameter:
```tsx
// ❌ BEFORE
<PropertyCard
  onClick={() => router.push(`/public/${property.id}`)} // No mode parameter!
/>
```

Sekarang, `PropertyCard` handle navigation sendiri dengan mode parameter:
```tsx
// ✅ AFTER
const handleCardClick = () => {
  router.push(`/public/${property.id}?mode=${viewMode}&lang=${lang}`)
}

<div onClick={handleCardClick}>
  {/* Card content */}
</div>
```

### 2. **Mode Detection di Detail Page**

Detail page sudah benar mendeteksi mode dari URL query:
```tsx
const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
const viewMode = (searchParams.get('mode') as 'rent' | 'invest') || 'rent'
```

### 3. **Conditional Rendering Based on Mode**

Detail page sekarang menampilkan konten berbeda based on mode:

#### **RENT MODE** (`?mode=rent`)
- ✅ "Tentang properti ini"
- ✅ Fasilitas section (WiFi, Parkir, Dapur, dll)
- ✅ Button: "Booking Sekarang"
- ✅ Description: fokus pada kenyamanan hunian

#### **INVEST MODE** (`?mode=invest`)
- ✅ "Tentang investasi ini"
- ✅ Analisis Investasi section:
  - Nilai Aset
  - ROI Tahunan
  - Pendapatan/Bulan
  - Pendapatan/Tahun
  - Payback Period
  - Passive Income
  - Capital Gain
  - Lokasi Strategis
- ✅ Button: "Ajukan Penawaran"
- ✅ Description: fokus pada ROI dan passive income

## 🧪 Cara Testing

### Test Rent Mode:
1. Di public page, pastikan toggle di **Rent**
2. Click property card
3. Detail page harus show:
   - "Tentang properti ini"
   - Fasilitas section
   - Button "Booking Sekarang"

### Test Invest Mode:
1. Di public page, toggle ke **Invest**
2. Click property card
3. Detail page harus show:
   - "Tentang investasi ini"
   - Analisis Investasi section (ROI, payback period, dll)
   - Button "Ajukan Penawaran"

### Verify URL:
- Rent mode: `/public/[id]?mode=rent&lang=id`
- Invest mode: `/public/[id]?mode=invest&lang=id`

## 📝 Files Changed

1. `pms-app/src/app/public/page.tsx`
   - Updated `PropertyCard` component
   - Added `handleCardClick` function
   - Pass `viewMode` and `lang` to URL

2. `pms-app/src/app/public/[id]/page.tsx`
   - Already has correct mode detection
   - Already has conditional rendering

## ✅ Status: FIXED!

Sekarang ketika klik property card di mode **Invest**, detail page akan menampilkan konten investasi yang berbeda dari mode **Rent**. 🎉
