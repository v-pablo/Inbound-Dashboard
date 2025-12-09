import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase keys are missing! Check your .env file.')
}

// ⚠️ THIS LINE IS THE FIX. It must say "export const", NOT "const" or "export default"
export const supabase = createClient(supabaseUrl, supabaseKey)