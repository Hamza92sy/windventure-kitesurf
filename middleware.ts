import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // CSP optimisé pour Next.js + Tailwind + Sentry + Vercel
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self' *.windventure.fr windventure.fr",
      "script-src 'self' *.windventure.fr windventure.fr 'unsafe-inline' 'unsafe-eval' *.vercel.app vercel.live",
      "style-src 'self' 'unsafe-inline' *.windventure.fr windventure.fr *.vercel.app fonts.googleapis.com",
      "font-src 'self' fonts.googleapis.com fonts.gstatic.com data:",
      "connect-src 'self' *.windventure.fr windventure.fr *.sentry.io o35838.ingest.sentry.io api.vercel.com vitals.vercel-insights.com",
      "img-src 'self' data: blob: *.windventure.fr windventure.fr *.vercel.app",
      "frame-src 'self' *.vercel.app",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  )

  // Headers de sécurité supplémentaires
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}