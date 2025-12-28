import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined

let supabase: SupabaseClient<Database> | null = null

if (!supabaseUrl || !supabaseKey) {
	// Clear, actionable message for developers when env vars are missing
	// This avoids an uncaught error from the Supabase client internals.
	// Ensure you have a `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
	// Example `.env` entries:
	// VITE_SUPABASE_URL=https://xyzcompany.supabase.co
	// VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=public-anon-key
	console.error(
		'Supabase env vars missing: set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY in .env'
	)
} else {
	supabase = createClient<Database>(supabaseUrl, supabaseKey)
}

export default supabase
export { supabase }