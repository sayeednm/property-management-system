'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/useThemeStore'

interface Props {
  onDateSelect: (checkIn: Date | null, checkOut: Date | null) => void
  onGuestChange: (adults: number, children: number, infants: number) => void
}

export default function BookingCalendar({ onDateSelect, onGuestChange }: Props) {
  const { darkMode: d } = useThemeStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 })

  const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  const dayNames = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null)
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(i)
    return days
  }

  const handleDateClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(selected); setCheckOut(null); onDateSelect(selected, null)
    } else {
      if (selected > checkIn) { setCheckOut(selected); onDateSelect(checkIn, selected) }
      else { setCheckIn(selected); setCheckOut(null); onDateSelect(selected, null) }
    }
  }

  const isInRange = (day: number) => {
    if (!checkIn || !checkOut) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date > checkIn && date < checkOut
  }

  const isSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return (checkIn && date.toDateString() === checkIn.toDateString()) ||
           (checkOut && date.toDateString() === checkOut.toDateString())
  }

  const isPast = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date(); today.setHours(0,0,0,0)
    return date < today
  }

  const updateGuests = (type: 'adults' | 'children' | 'infants', delta: number) => {
    const g = { ...guests }
    g[type] = Math.max(type === 'adults' ? 1 : 0, g[type] + delta)
    setGuests(g)
    onGuestChange(g.adults, g.children, g.infants)
  }

  const totalGuests = guests.adults + guests.children
  const border = d ? 'border border-[#E6A854]/30' : 'border border-[#E5E7EB]'
  const bg = d ? 'bg-[#001117]' : 'bg-white'
  const text = d ? 'text-white' : 'text-slate-900'
  const subtext = d ? 'text-slate-400' : 'text-slate-500'

  return (
    <div className="space-y-3">
      {/* Date Inputs */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'CHECK-IN', date: checkIn },
          { label: 'CHECK-OUT', date: checkOut },
        ].map(({ label, date }) => (
          <div key={label} className={cn('rounded-xl p-2 sm:p-3', border, d ? 'bg-[#001117]/50' : 'bg-white')}>
            <label className={cn('text-[10px] font-semibold block mb-1', d ? 'text-[#E6A854]' : 'text-slate-900')}>{label}</label>
            <div className="flex items-center gap-1">
              <CalendarIcon className={cn('w-3 h-3 flex-shrink-0', d ? 'text-[#E6A854]' : 'text-slate-400')} />
              <span className={cn('text-xs truncate', date ? (d ? 'text-white' : 'text-slate-800') : subtext)}>
                {date ? date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Pilih tanggal'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className={cn('rounded-xl p-3', border, d ? 'bg-[#001117]/50' : 'bg-white')}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className={cn('p-1.5 rounded-lg transition', d ? 'hover:bg-[#E6A854]/10 text-[#E6A854]' : 'hover:bg-slate-100 text-slate-700')}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className={cn('text-sm font-semibold', text)}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className={cn('p-1.5 rounded-lg transition', d ? 'hover:bg-[#E6A854]/10 text-[#E6A854]' : 'hover:bg-slate-100 text-slate-700')}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {dayNames.map((day) => (
            <div key={day} className={cn('text-center text-[10px] font-medium py-1', d ? 'text-[#E6A854]/70' : 'text-slate-500')}>
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-0.5">
          {getDaysInMonth(currentMonth).map((day, i) => (
            <button
              key={i}
              onClick={() => day && !isPast(day) && handleDateClick(day)}
              disabled={!day || isPast(day)}
              className={cn(
                'aspect-square flex items-center justify-center text-xs rounded-lg transition',
                !day && 'invisible',
                day && isPast(day) && (d ? 'text-slate-700 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'),
                day && !isPast(day) && !isSelected(day) && !isInRange(day) && (d ? 'hover:bg-[#E6A854]/10 text-slate-300' : 'hover:bg-slate-100 text-slate-700'),
                day && isInRange(day) && (d ? 'bg-[#E6A854]/20 text-[#E6A854]' : 'bg-slate-100 text-slate-700'),
                day && isSelected(day) && (d ? 'bg-[#E6A854] text-[#001117] font-semibold' : 'bg-slate-900 text-white font-semibold')
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Picker */}
      <div className={cn('rounded-xl', border, d ? 'bg-[#001117]/50' : 'bg-white')}>
        <button onClick={() => setShowGuestPicker(!showGuestPicker)} className="w-full p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className={cn('w-4 h-4 flex-shrink-0', d ? 'text-[#E6A854]' : 'text-slate-400')} />
            <div className="text-left">
              <p className={cn('text-[10px] font-semibold', d ? 'text-[#E6A854]' : 'text-slate-900')}>TAMU</p>
              <p className={cn('text-xs', d ? 'text-slate-300' : 'text-slate-600')}>{totalGuests} tamu{guests.infants > 0 ? `, ${guests.infants} bayi` : ''}</p>
            </div>
          </div>
          <ChevronRight className={cn('w-4 h-4 transition', d ? 'text-[#E6A854]' : 'text-slate-400', showGuestPicker && 'rotate-90')} />
        </button>

        {showGuestPicker && (
          <div className={cn('border-t p-3 space-y-3', d ? 'border-[#E6A854]/20' : 'border-[#E5E7EB]')}>
            {[
              { key: 'adults' as const, label: 'Dewasa', sub: 'Usia 13+', min: 1 },
              { key: 'children' as const, label: 'Anak', sub: 'Usia 2-12', min: 0 },
              { key: 'infants' as const, label: 'Bayi', sub: 'Di bawah 2 tahun', min: 0 },
            ].map(({ key, label, sub, min }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className={cn('text-sm font-medium', text)}>{label}</p>
                  <p className={cn('text-xs', subtext)}>{sub}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateGuests(key, -1)} disabled={guests[key] <= min}
                    className={cn('w-7 h-7 rounded-full border flex items-center justify-center transition disabled:opacity-30',
                      d ? 'border-[#E6A854]/40 text-[#E6A854] hover:border-[#E6A854]' : 'border-slate-300 hover:border-slate-900')}>
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className={cn('w-6 text-center text-sm font-medium', text)}>{guests[key]}</span>
                  <button onClick={() => updateGuests(key, 1)}
                    className={cn('w-7 h-7 rounded-full border flex items-center justify-center transition',
                      d ? 'border-[#E6A854]/40 text-[#E6A854] hover:border-[#E6A854]' : 'border-slate-300 hover:border-slate-900')}>
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {checkIn && checkOut && (
        <p className={cn('text-xs text-center', subtext)}>
          {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} malam · {totalGuests} tamu
        </p>
      )}
    </div>
  )
}
