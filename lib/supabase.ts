import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase URL or anon key not configured')
}

// Client untuk frontend (pakai anon key)
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder')

// Server client (sama seperti anon client dengan RLS policy)
export const supabaseServer = supabase

// Type untuk user
export interface UserData {
  id?: string
  username: string
  email: string
  full_name: string
  phone_number: string
  password?: string
  account_number: string
  bank_type: 'BRI' | 'DANA'
  created_at?: string
}
