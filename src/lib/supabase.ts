import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '.env.local eksik: VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY gerekli.\n' +
    '.env.local.example dosyasını kopyalayıp doldurun.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
