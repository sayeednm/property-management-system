'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Property, PropertyType } from '@/lib/supabase'
import { dummyProperties } from '@/lib/dummy-data'

export type CustomerType = 'rent' | 'buyer'
export type BookingStatus = 'pending' | 'approved' | 'rejected'

export interface Booking {
  id: string
  propertyId: string
  customerName: string
  customerEmail?: string
  customerType: CustomerType
  checkIn: string
  duration: number
  status: BookingStatus
  createdAt: string
}

interface PropertyStore {
  searchQuery: string
  filterType: PropertyType | 'all'
  properties: Property[]
  bookings: Booking[]
  setSearchQuery: (query: string) => void
  setFilterType: (type: PropertyType | 'all') => void
  setProperties: (properties: Property[]) => void
  addProperty: (property: Omit<Property, 'id'>) => void
  updateProperty: (id: string, data: Partial<Omit<Property, 'id'>>) => void
  deleteProperty: (id: string) => void
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void
  approveBooking: (id: string) => void
  rejectBooking: (id: string) => void
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set) => ({
      searchQuery: '',
      filterType: 'all',
      properties: dummyProperties,
      bookings: [],
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (type) => set({ filterType: type }),
      setProperties: (properties) => set({ properties }),
      addProperty: (property) =>
        set((state) => ({
          properties: [...state.properties, { ...property, id: crypto.randomUUID() }],
        })),
      updateProperty: (id, data) =>
        set((state) => ({
          properties: state.properties.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      deleteProperty: (id) =>
        set((state) => ({
          properties: state.properties.filter((p) => p.id !== id),
        })),
      addBooking: (booking) =>
        set((state) => ({
          bookings: [
            ...state.bookings,
            {
              ...booking,
              id: crypto.randomUUID(),
              status: 'pending',
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      approveBooking: (id) =>
        set((state) => {
          const booking = state.bookings.find((b) => b.id === id)
          return {
            bookings: state.bookings.map((b) => (b.id === id ? { ...b, status: 'approved' as BookingStatus } : b)),
            properties: booking
              ? state.properties.map((p) => (p.id === booking.propertyId ? { ...p, status: 'occupied' } : p))
              : state.properties,
          }
        }),
      rejectBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === id ? { ...b, status: 'rejected' as BookingStatus } : b)),
        })),
    }),
    {
      name: 'pms-storage',
      version: 2,
      partialize: (state) => ({
        properties: state.properties,
        bookings: state.bookings,
      }),
      migrate: (persistedState: any, version: number) => {
        // If old version, reset to default
        if (version < 2) {
          return {
            properties: dummyProperties,
            bookings: [],
          }
        }
        return persistedState as any
      },
    }
  )
)
