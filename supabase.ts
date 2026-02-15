/**
 * Supabase Client Configuration
 * 
 * This file sets up the Supabase client for both server and client components.
 * We use two different clients:
 * - Browser client: For client-side operations
 * - Server client: For server-side operations with SSR support
 */

import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Browser client for client-side operations
 * Use this in React components and client-side code
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Service role client for server-side admin operations
 * WARNING: Only use this in API routes or server components
 * This bypasses Row Level Security (RLS)
 */
export function createServiceSupabaseClient() {
  if (!supabaseServiceKey) {
    throw new Error('Missing Supabase service role key')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Get the current user from the browser client
 */
export async function getCurrentUser() {
  const supabase = createBrowserSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  
  return user
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, fullName?: string) {
  const supabase = createBrowserSupabaseClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || '',
      },
    },
  })
  
  if (error) {
    throw error
  }
  
  return data
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
  const supabase = createBrowserSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  return data
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw error
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  const supabase = createBrowserSupabaseClient()
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })
  
  if (error) {
    throw error
  }
}
