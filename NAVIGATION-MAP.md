# 🗺️ NAVIGATION MAP - PropStay

## 📍 **SEMUA ROUTE & AKSES**

### **PUBLIC PAGES** (User/Customer)
```
/ (root)                    → Auto redirect ke /public
/public                     → Landing page (Airbnb-style)
/public/[id]                → Detail properti (dengan ?mode=rent atau ?mode=invest)
/public/profile             → Profil user (perlu login)
/public/my-bookings         → Daftar booking user (perlu login)
```

### **ADMIN PAGES** (Property Manager)
```
/dashboard                  → Dashboard overview
/inventory                  → Manage properti (CRUD)
/bookings                   → Manage booking requests
/customers                  → Database customer
/reports                    → Analytics & ROI reports
```

---

## 🔗 **NAVIGASI ANTAR HALAMAN**

### **Dari Public ke Admin:**
1. **Navbar Public** → Tombol "Admin" (desktop, kanan atas)
2. **URL langsung** → ketik `/dashboard` di browser

### **Dari Admin ke Public:**
1. **Sidebar Admin** → Tombol "← Kembali ke Website" (di footer sidebar)
2. **URL langsung** → ketik `/public` di browser

### **Navigasi Internal Public:**
```
Public Landing (/public)
  ├─→ Property Card → Detail Page (/public/[id])
  ├─→ Navbar "Masuk" → Auth Modal → Profile (/public/profile)
  ├─→ Bottom Nav "Favorit" → Filter favorit di landing
  └─→ Bottom Nav "Masuk" → Auth Modal atau Profile

Profile Page (/public/profile)
  ├─→ "Booking Saya" → My Bookings (/public/my-bookings)
  ├─→ "Favorit Saya" → Public Landing dengan filter favorit
  ├─→ "Keluar" → Logout & kembali ke Public Landing
  └─→ "Kembali" → router.back()

My Bookings (/public/my-bookings)
  ├─→ Booking Card → Detail Property (/public/[id])
  ├─→ "Kembali" → router.back()
  └─→ "Mulai Cari Properti" → Public Landing

Detail Page (/public/[id])
  ├─→ "Kembali" → router.back()
  ├─→ "Booking Sekarang" → Booking Modal
  ├─→ "Explore More" → Public Landing
  └─→ Breadcrumb "PropStay" → Public Landing
```

### **Navigasi Internal Admin:**
```
Dashboard (/dashboard)
  ├─→ Sidebar → Inventory, Bookings, Customers, Reports
  └─→ Property Card → Property Modal (view/book)

Inventory (/inventory)
  ├─→ "+ Tambah Properti" → Property Form Modal
  ├─→ Property Card → Property Form Modal (edit)
  └─→ Delete button → Hapus properti

Bookings (/bookings)
  ├─→ Approve button → Update status & properti jadi occupied
  └─→ Reject button → Update status booking

Customers (/customers)
  └─→ Filter by type (Rent/Buyer)

Reports (/reports)
  └─→ View analytics & charts
```

---

## 🎯 **INTERAKTIVITAS UI/UX**

### **✅ YANG SUDAH BERFUNGSI:**

#### **Public Pages:**
- ✅ Mode toggle (Rent/Invest) - smooth transition
- ✅ Search bar - real-time filter
- ✅ Filter by type (Kost, Apartment, Villa, Homestay)
- ✅ Property cards - klik → detail page
- ✅ Favorite toggle - heart icon, counter badge
- ✅ Bottom navigation (mobile) - 3 tabs
- ✅ Language toggle (ID/EN)
- ✅ Auth modal - login/register
- ✅ Booking modal - form validation
- ✅ WhatsApp booking - auto-generate message
- ✅ Photo gallery modal - 4 tabs (Foto, Fasilitas, Ulasan, Lokasi)
- ✅ Calendar picker - date selection
- ✅ Guest selector - counter +/-
- ✅ Clear date button - X icon
- ✅ Image display - real Unsplash photos

#### **Admin Pages:**
- ✅ Sidebar navigation - active state
- ✅ Mobile hamburger menu - slide-in
- ✅ Property CRUD - add, edit, delete
- ✅ Booking approval - approve/reject
- ✅ Customer filter - by type
- ✅ Charts - horizontal bar, ring chart
- ✅ Stats cards - real-time calculation
- ✅ Search & filter - inventory page

### **🔄 SMOOTH TRANSITIONS:**
- ✅ Hover effects - scale, shadow, color
- ✅ Modal animations - fade in/out
- ✅ Button states - loading, disabled
- ✅ Form validation - real-time errors
- ✅ Toast notifications - success/error (via modal)

---

## 📱 **RESPONSIVE DESIGN**

### **Mobile (< 640px):**
- ✅ Bottom navigation (3 tabs)
- ✅ Hamburger menu (admin)
- ✅ 2-column grid (property cards)
- ✅ Compact spacing & text
- ✅ Touch-friendly buttons (min 44x44px)
- ✅ Horizontal scroll (filter tabs)

### **Tablet (640px - 1024px):**
- ✅ 2-3 column grid
- ✅ Sidebar visible (admin)
- ✅ Larger text & spacing

### **Desktop (> 1024px):**
- ✅ 4 column grid
- ✅ Full sidebar (admin)
- ✅ Hover effects
- ✅ Desktop navigation

---

## 🚀 **CARA AKSES SEMUA HALAMAN**

### **Tanpa Ganti Direktori:**

1. **Start dev server:**
   ```bash
   cd pms-app
   npm run dev
   ```

2. **Buka browser:**
   ```
   http://localhost:3000
   ```

3. **Navigasi:**
   - **Public Landing** → Otomatis redirect dari root
   - **Admin Dashboard** → Klik tombol "Admin" di navbar public
   - **Profile** → Klik "Masuk" → Login → Klik nama user
   - **My Bookings** → Profile → "Booking Saya"
   - **Detail Property** → Klik property card
   - **Kembali ke Public** → Sidebar admin → "← Kembali ke Website"

### **Direct URL Access:**
```
http://localhost:3000/public           → Landing
http://localhost:3000/public/1         → Detail property ID 1
http://localhost:3000/public/profile   → Profile (perlu login)
http://localhost:3000/dashboard        → Admin dashboard
http://localhost:3000/inventory        → Admin inventory
http://localhost:3000/bookings         → Admin bookings
http://localhost:3000/customers        → Admin customers
http://localhost:3000/reports          → Admin reports
```

---

## 🎨 **UI COMPONENTS CHECKLIST**

### **Buttons:**
- ✅ Primary (indigo gradient)
- ✅ Secondary (outline)
- ✅ Danger (red)
- ✅ Success (emerald)
- ✅ WhatsApp (emerald with icon)
- ✅ Icon buttons (heart, close, etc)

### **Forms:**
- ✅ Text input
- ✅ Email input
- ✅ Phone input
- ✅ Date picker (with clear button)
- ✅ Number input (duration)
- ✅ Select/dropdown
- ✅ Radio buttons (customer type)
- ✅ Validation errors

### **Modals:**
- ✅ Booking modal (with image)
- ✅ Property modal (admin)
- ✅ Property form modal (CRUD)
- ✅ Auth modal (login/register)
- ✅ Photo gallery modal (4 tabs)
- ✅ Lightbox (fullscreen photo)

### **Cards:**
- ✅ Property card (with image)
- ✅ Stats card
- ✅ Booking card
- ✅ Customer card

### **Navigation:**
- ✅ Navbar (public)
- ✅ Sidebar (admin)
- ✅ Bottom nav (mobile)
- ✅ Breadcrumb
- ✅ Tabs (photo gallery)

### **Feedback:**
- ✅ Success state (checkmark)
- ✅ Error messages
- ✅ Loading states
- ✅ Empty states
- ✅ Badges (status, count)

---

## 🔐 **AUTHENTICATION FLOW**

```
Guest User
  ├─→ Klik "Masuk" → Auth Modal
  ├─→ Tab "Masuk" → Login (auto-login for demo)
  ├─→ Tab "Daftar" → Register (auto-login after)
  └─→ Logged In → Redirect ke profile atau stay di current page

Logged In User
  ├─→ Navbar → Show user name
  ├─→ Bottom nav → Show user name
  ├─→ Profile page → Edit profile, view stats
  ├─→ My Bookings → View booking history
  └─→ Logout → Clear session, redirect to public

Protected Routes
  ├─→ /public/profile → Redirect to /public if not logged in
  └─→ /public/my-bookings → Redirect to /public if not logged in
```

---

## 📊 **DATA FLOW**

### **Zustand Store (localStorage persistence):**
```
usePropertyStore
  ├─→ properties (15 dummy properties di Yogyakarta)
  ├─→ bookings (booking requests)
  ├─→ favorites (property IDs)
  └─→ version: 4 (auto-reset on version change)

useUserStore
  ├─→ currentUser (logged in user)
  ├─→ users (5 dummy users)
  └─→ isAuthenticated (boolean)
```

### **Data Persistence:**
- ✅ Properties → localStorage
- ✅ Bookings → localStorage
- ✅ Favorites → localStorage
- ✅ User session → localStorage
- ✅ Auto-reset on version change

---

## 🎯 **TESTING CHECKLIST**

### **Public Pages:**
- [ ] Landing page load
- [ ] Search & filter
- [ ] Mode toggle (Rent/Invest)
- [ ] Property card click → detail
- [ ] Favorite toggle
- [ ] Auth modal (login/register)
- [ ] Booking modal (form validation)
- [ ] WhatsApp booking
- [ ] Photo gallery modal
- [ ] Calendar picker
- [ ] Guest selector
- [ ] Mobile bottom nav
- [ ] Language toggle

### **Admin Pages:**
- [ ] Dashboard stats
- [ ] Inventory CRUD
- [ ] Booking approval
- [ ] Customer filter
- [ ] Reports charts
- [ ] Mobile hamburger menu
- [ ] Sidebar navigation

### **Navigation:**
- [ ] Public → Admin
- [ ] Admin → Public
- [ ] Profile → My Bookings
- [ ] Detail → Back
- [ ] Breadcrumb links

### **Responsive:**
- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)

---

## 🚨 **KNOWN ISSUES & FIXES**

### **Issue: Data lama masih muncul (Semarang)**
**Fix:** Version store dinaikkan jadi 4, auto-reset localStorage

### **Issue: Gambar tidak muncul**
**Fix:** Update semua component pakai `property.images[0]`

### **Issue: Navigasi tidak smooth**
**Fix:** Tambah tombol "Admin" di public navbar & "Kembali ke Website" di admin sidebar

---

## 📝 **NOTES**

- Semua navigasi pakai `router.push()` atau `<Link>` dari Next.js
- Tidak ada hard refresh, semua client-side navigation
- localStorage auto-sync antar tabs
- Demo mode: auto-login, no password required
- WhatsApp number: ganti di `PublicBookingModal.tsx` line 102
