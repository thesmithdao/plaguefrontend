import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations with elevated privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Types for our database tables
export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  ip_address?: string
  user_agent?: string
  status: "new" | "read" | "replied" | "archived"
  created_at: string
  updated_at: string
}

export interface RateLimitAttempt {
  id: string
  ip_address: string
  endpoint: string
  attempts: number
  window_start: string
  created_at: string
}
