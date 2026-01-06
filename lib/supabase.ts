import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key')
}

// Client untuk frontend (pakai anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server client (pakai service role key) - gunakan di API routes
export const supabaseServer = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey
)

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
