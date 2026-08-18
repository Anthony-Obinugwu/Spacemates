import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logoutAction } from '@/app/actions/auth'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  let role = null
  let canListProperty = true

  if (user) {
    const { data: p } = await supabase.from('profiles').select('full_name, account_status').eq('id', user.id).single()
    const { data: userRoles } = await supabase.from('user_roles').select('role').eq('user_id', user.id)
    profile = p
    const roles = userRoles?.map(r => r.role) || []
    role = roles.find(r => r === 'ADMIN') || roles[0]

    if (roles.length === 1 && roles[0] === 'ROOM_SEEKER') {
      canListProperty = false
    }
  }

  return (
    <header className="w-full border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="text-xl font-black text-gradient tracking-tight">
          Spacemates
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/search" className="hover:text-foreground transition-colors">Find Roommates & Flats</Link>
          {canListProperty && <Link href="/list" className="hover:text-foreground transition-colors">List a Property</Link>}
          {user && <Link href="/applications" className="hover:text-foreground transition-colors">Applications</Link>}
          {user && <Link href="/messages" className="hover:text-foreground transition-colors">Messages</Link>}
          {role === 'ADMIN' && <Link href="/admin" className="text-red-400 font-bold hover:underline">Admin Dashboard</Link>}
        </nav>

        {/* Auth / Profile Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs text-primary font-bold">
                  {profile?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline">{profile?.full_name || user.email}</span>
              </Link>
              
              <form action={logoutAction}>
                <button type="submit" className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-foreground hover:bg-surface transition-colors">
                  Log Out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                Log In
              </Link>
              <Link href="/register" className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-all shadow-md shadow-primary/20">
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
