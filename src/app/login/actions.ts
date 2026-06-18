'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles user login with email and password.
 * On success, redirects to /dashboard.
 * On failure, returns an error message to display in the UI.
 */
export async function login(formData: FormData) {
  const supabase = await createClient()

  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Basic validation
  if (!credentials.email || !credentials.password) {
    return { error: 'Email and password are required.' }
  }

  const { error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    // Return a user-friendly error message
    return { error: error.message ?? 'Invalid email or password.' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
