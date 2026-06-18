import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /auth/signout
 * Signs out the current user and clears the session cookie.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Verify the user is actually logged in before signing out
  const { data: claimsData } = await supabase.auth.getClaims()

  if (claimsData?.claims) {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/login', req.url), { status: 302 })
}
