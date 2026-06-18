import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * A server-side protected page.
 * Users who are not authenticated are redirected to /login.
 */
export default async function DashboardPage() {
  const supabase = await createClient()

  // Use getClaims() for fast local JWT validation (no network call)
  const { data: claimsData } = await supabase.auth.getClaims()

  if (!claimsData?.claims) {
    // Not authenticated — redirect to login
    redirect('/login')
  }

  const { claims } = claimsData

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome back, <span className="font-medium">{claims.email}</span>
      </p>

      {/* Sign out form */}
      <form action="/auth/signout" method="post" className="mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Sign out
        </button>
      </form>
    </main>
  )
}
