import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or key')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

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
