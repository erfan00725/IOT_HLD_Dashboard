'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'

/**
 * Custom hook to retrieve and keep the Supabase bearer access token up to date.
 *
 * Usage:
 *   const { accessToken, session, loading } = useAccessToken()
 *
 *   // Use with fetch:
 *   fetch('/api/iot/data', {
 *     headers: { Authorization: `Bearer ${accessToken}` }
 *   })
 */
export function useAccessToken() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get the initial session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // Listen for session changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setLoading(false)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return {
    session,
    loading,
    // The raw JWT bearer token — use this in Authorization headers
    accessToken: session?.access_token ?? null,
    user: session?.user ?? null,
  }
}
