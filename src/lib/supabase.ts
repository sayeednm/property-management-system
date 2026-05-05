import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type PropertyType = 'kost' | 'apartment' | 'villa' | 'homestay'
export type PropertyStatus = 'available' | 'occupied' | 'maintenance'

export interface Property {
  id: string
  name: string
  type: PropertyType
  location: string
  price_monthly: number
  price_daily: number
  assets_value: number
  status: PropertyStatus
  images: string[]
}
