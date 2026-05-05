'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Users, BarChart3, Building2, ClipboardCheck, Menu, X, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/useThemeStore'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/bookings', label: 'Bookings', icon: ClipboardCheck },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { darkMode, toggleDarkMode } = useThemeStore()

  const d = darkMode

  return (
    <>
      {/* Mobile Header */}
      <div className={d ? 'lg:hidden sticky top-0 z-40 bg-[#001117] border-b border-[#E6A854]/20 px-4 py-3 flex items-center justify-between' : 'lg:hidden sticky top-0 z-40 bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between'}>
        <div className="flex items-center gap-2">
          <div className={d ? 'w-7 h-7 bg-gradient-to-br from-[#E6A854] to-[#D4AF37] rounded-lg flex items-center justify-center' : 'w-7 h-7 bg-gradient-to-br from-[#D4AF37] to-[#E6A854] rounded-lg flex items-center justify-center'}>
            <Building2 className="w-3.5 h-3.5 text-[#001117]" />
          </div>
          <div>
            <p className={d ? 'text-sm font-bold text-white' : 'text-sm font-bold text-slate-800'}>
              STAY<span className="text-[#E6A854]">VEST</span>
            </p>
            <p className="text-[10px] text-slate-400">Admin Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className={d ? 'p-1.5 bg-[#E6A854]/10 text-[#E6A854] rounded-lg' : 'p-1.5 bg-slate-100 text-slate-700 rounded-lg'}>
            {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={d ? 'p-2 hover:bg-[#E6A854]/10 rounded-lg transition' : 'p-2 hover:bg-slate-100 rounded-lg transition'}>
            {mobileMenuOpen ? <X className={d ? 'w-5 h-5 text-[#E6A854]' : 'w-5 h-5 text-slate-600'} /> : <Menu className={d ? 'w-5 h-5 text-[#E6A854]' : 'w-5 h-5 text-slate-600'} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed lg:sticky top-0 z-40 w-60 min-h-screen flex flex-col transition-transform lg:translate-x-0',
        d ? 'bg-[#001117] border-r border-[#E6A854]/20' : 'bg-white border-r border-[#E5E7EB]',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo - Desktop Only */}
        <div className={d ? 'hidden lg:block px-6 py-5 border-b border-[#E6A854]/20' : 'hidden lg:block px-6 py-5 border-b border-[#E5E7EB]'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={d ? 'w-8 h-8 bg-gradient-to-br from-[#E6A854] to-[#D4AF37] rounded-lg flex items-center justify-center' : 'w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#E6A854] rounded-lg flex items-center justify-center'}>
                <Building2 className="w-4 h-4 text-[#001117]" />
              </div>
              <div>
                <p className={d ? 'text-sm font-bold text-white' : 'text-sm font-bold text-slate-800'}>
                  STAY<span className="text-[#E6A854]">VEST</span>
                </p>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </div>
            <button onClick={toggleDarkMode} className={d ? 'p-1.5 bg-[#E6A854]/10 text-[#E6A854] rounded-lg hover:bg-[#E6A854]/20 transition' : 'p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition'}>
              {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 mt-16 lg:mt-0">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? d ? 'bg-[#E6A854]/20 text-[#E6A854]' : 'bg-slate-900 text-white'
                    : d ? 'text-slate-400 hover:bg-[#E6A854]/10 hover:text-[#E6A854]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                )}
              >
                <Icon className={cn('w-4 h-4', active ? (d ? 'text-[#E6A854]' : 'text-white') : (d ? 'text-slate-500' : 'text-slate-400'))} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={d ? 'px-6 py-4 border-t border-[#E6A854]/20' : 'px-6 py-4 border-t border-[#E5E7EB]'}>
          <button
            onClick={() => router.push('/public')}
            className={d ? 'w-full mb-3 px-4 py-2 bg-[#E6A854]/10 text-[#E6A854] rounded-lg text-sm font-semibold hover:bg-[#E6A854]/20 transition border border-[#E6A854]/20' : 'w-full mb-3 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition'}
          >
            ← Kembali ke Website
          </button>
          <p className="text-xs text-slate-400">© 2025 StayVest</p>
        </div>
      </aside>
    </>
  )
}
