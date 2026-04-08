import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function proxy(request: NextRequest) {
  const supabase = await createClient()

  // Check if a user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Define routes that require authentication
  const protectedPrefixes = ['/dashboard', '/goals', '/transactions', '/reports', '/profile', '/deposit', '/withdraw']
  const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix))

  // Define routes for unauthenticated users (login and register)
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(pathname)

  // 1. If not logged in and trying to access a protected route -> redirect to /login
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If logged in and trying to access login/register -> redirect to /dashboard
  // Commented out so you can see these pages during development even if logged in
  // if (user && isAuthRoute) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  // Apply proxy to all routes except static files, images, and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           request.cookies.set({ name, value, ...options })
//           response = NextResponse.next({
//             request: { headers: request.headers },
//           })
//           response.cookies.set({ name, value, ...options })
//         },
//         remove(name: string, options: CookieOptions) {
//           request.cookies.set({ name, value: '', ...options })
//           response = NextResponse.next({
//             request: { headers: request.headers },
//           })
//           response.cookies.set({ name, value: '', ...options })
//         },
//       },
//     }
//   )

//   await supabase.auth.getUser()

//   return response
// }

// export const config = {
//   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
// }