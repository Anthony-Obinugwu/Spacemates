import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Update session and refresh tokens if needed
  let supabaseResponse = await updateSession(request)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  if (user) {
    // If the user is logged in, fetch their profile status and role
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_status, profile_completion')
      .eq('id', user.id)
      .single()

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    // Admin Route Guard
    if (path.startsWith('/admin')) {
      if (roleData?.role !== 'ADMIN') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }

    // Listing Route Guard: Only allow listing properties for property/host roles
    if (path.startsWith('/list')) {
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)

      const roles = userRoles?.map(r => r.role) || []
      const allowedListingRoles = ['PROPERTY_OWNER', 'PROPERTY_AGENT', 'PROPERTY_MANAGER', 'ROOMMATE', 'ADMIN']
      const isAllowed = roles.some(r => allowedListingRoles.includes(r))

      if (!isAllowed) {
        const url = request.nextUrl.clone()
        url.pathname = '/search'
        return NextResponse.redirect(url)
      }
    }

    const isMarketplaceRoute = path.startsWith('/search') || path.startsWith('/list') || path.startsWith('/profile') || path.startsWith('/messages');
    
    // Strict onboarding guard
    if (profile?.account_status === 'PENDING' && isMarketplaceRoute && path !== '/onboarding') {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }

    // Prevent fully onboarded users from going back to the onboarding flow
    if (profile?.account_status !== 'PENDING' && path === '/onboarding') {
      const url = request.nextUrl.clone()
      url.pathname = '/search'
      return NextResponse.redirect(url)
    }
  } else {
    // Redirect unauthenticated users trying to access protected routes
    const isProtectedRoute = path.startsWith('/search') || path.startsWith('/list') || path.startsWith('/profile') || path.startsWith('/messages') || path.startsWith('/admin') || path === '/onboarding'
    
    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
