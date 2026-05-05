'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onDateSelect: (checkIn: Date | null, checkOut: Date | null) => void
  onGuestChange: (adults: number, children: number, infants: number) => void
}

export default function BookingCalendar({ onDateSelect, onGuestChange }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [showGuestPicker, setShowGuestPicker] = useState(false)
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 })

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (number | null)[] = []
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    
    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      setCheckIn(selectedDate)
      setCheckOut(null)
      onDateSelect(selectedDate, null)
    } else if (checkIn && !checkOut) {
      // Complete selection
      if (selectedDate > checkIn) {
        setCheckOut(selectedDate)
        onDateSelect(checkIn, selectedDate)
      } else {
        // If selected date is before check-in, restart
        setCheckIn(selectedDate)
        setCheckOut(null)
        onDateSelect(selectedDate, null)
      }
    }
  }

  const isDateInRange = (day: number) => {
    if (!checkIn || !checkOut) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date > checkIn && date < checkOut
  }

  const isDateSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return (checkIn && date.toDateString() === checkIn.toDateString()) ||
           (checkOut && date.toDateString() === checkOut.toDateString())
  }

  const isPastDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const updateGuests = (type: 'adults' | 'children' | 'infants', delta: number) => {
    const newGuests = { ...guests }
    newGuests[type] = Math.max(type === 'adults' ? 1 : 0, newGuests[type] + delta)
    setGuests(newGuests)
    onGuestChange(newGuests.adults, newGuests.children, newGuests.infants)
  }

  const totalGuests = guests.adults + guests.children

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Date Inputs */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="border border-[#E5E7EB] rounded-xl p-2 sm:p-3">
          <label className="text-[10px] sm:text-xs font-semibold text-slate-900 block mb-1">CHECK-IN</label>
          <div className="flex items-center gap-1 sm:gap-2">
            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-slate-600 truncate">
              {checkIn ? checkIn.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Pilih tanggal'}
            </span>
          </div>
        </div>
        <div className="border border-[#E5E7EB] rounded-xl p-2 sm:p-3">
          <label className="text-[10px] sm:text-xs font-semibold text-slate-900 block mb-1">CHECK-OUT</label>
          <div className="flex items-center gap-1 sm:gap-2">
            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-slate-600 truncate">
              {checkOut ? checkOut.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Pilih tanggal'}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="border border-[#E5E7EB] rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button onClick={prevMonth} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <h3 className="text-sm sm:text-base font-semibold text-slate-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-[10px] sm:text-xs font-medium text-slate-500 py-1 sm:py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {getDaysInMonth(currentMonth).map((day, index) => (
            <button
              key={index}
              onClick={() => day && !isPastDate(day) && handleDateClick(day)}
              disabled={!day || isPastDate(day)}
              className={cn(
                'aspect-square flex items-center justify-center text-xs sm:text-sm rounded-lg transition',
                !day && 'invisible',
                day && isPastDate(day) && 'text-slate-300 cursor-not-allowed',
                day && !isPastDate(day) && !isDateSelected(day) && !isDateInRange(day) && 'hover:bg-slate-100 text-slate-700',
                day && isDateInRange(day) && 'bg-indigo-50 text-indigo-700',
                day && isDateSelected(day) && 'bg-indigo-600 text-white font-semibold'
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Picker */}
      <div className="border border-[#E5E7EB] rounded-xl">
        <button
          onClick={() => setShowGuestPicker(!showGuestPicker)}
          className="w-full p-3 sm:p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-[10px] sm:text-xs font-semibold text-slate-900">TAMU</p>
              <p className="text-xs sm:text-sm text-slate-600">{totalGuests} tamu{guests.infants > 0 ? `, ${guests.infants} bayi` : ''}</p>
            </div>
          </div>
          <ChevronRight className={cn('w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition', showGuestPicker && 'rotate-90')} />
        </button>

        {showGuestPicker && (
          <div className="border-t border-[#E5E7EB] p-3 sm:p-4 space-y-3 sm:space-y-4">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base font-medium text-slate-900">Dewasa</p>
                <p className="text-xs sm:text-sm text-slate-500">Usia 13+</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => updateGuests('adults', -1)}
                  disabled={guests.adults <= 1}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{guests.adults}</span>
                <button
                  onClick={() => updateGuests('adults', 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-900 transition"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base font-medium text-slate-900">Anak</p>
                <p className="text-xs sm:text-sm text-slate-500">Usia 2-12</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => updateGuests('children', -1)}
                  disabled={guests.children <= 0}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{guests.children}</span>
                <button
                  onClick={() => updateGuests('children', 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-900 transition"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Infants */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base font-medium text-slate-900">Bayi</p>
                <p className="text-xs sm:text-sm text-slate-500">Di bawah 2 tahun</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => updateGuests('infants', -1)}
                  disabled={guests.infants <= 0}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{guests.infants}</span>
                <button
                  onClick={() => updateGuests('infants', 1)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-900 transition"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info text */}
      {checkIn && checkOut && (
        <p className="text-xs text-slate-500 text-center">
          {Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} malam · {totalGuests} tamu
        </p>
      )}
    </div>
  )
}
