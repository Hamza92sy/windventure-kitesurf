import { NextResponse } from 'next/server'

export function middleware() {
  const response = NextResponse.next()
  
  response.headers.set('Content-Security-Policy', "default-src 'self' windventure.fr *.windventure.fr *.vercel.app; script-src 'self' windventure.fr *.windventure.fr *.vercel.app 'unsafe-inline' 'unsafe-eval'; style-src 'self' windventure.fr *.windventure.fr *.vercel.app 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.googleapis.com fonts.gstatic.com data:; connect-src 'self' *.sentry.io api.vercel.com vitals.vercel-insights.com; img-src 'self' data: blob: windventure.fr *.windventure.fr *.vercel.app; frame-src 'self' *.vercel.app; object-src 'none'; base-uri 'self'; form-action 'self'")
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Middleware-Force', 'active')
  
  return response
}

export const config = {
  matcher: '/:path*'
}