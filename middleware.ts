import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // Log de debug para sessões em produção
  if (process.env.NODE_ENV === 'production') {
    console.log('🔍 Middleware Debug:', {
      path: request.nextUrl.pathname,
      method: request.method,
      cookies: Object.keys(request.cookies.getAll().reduce((acc, cookie) => {
        acc[cookie.name] = cookie.value ? 'exists' : 'empty'
        return acc
      }, {} as Record<string, string>)),
      userAgent: request.headers.get('user-agent')?.substring(0, 50),
      timestamp: new Date().toISOString()
    })
  }
  
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
            ? process.env.MOBILE_APP_DOMAIN || 'https://yourmobileapp.com'
            : '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID',
          'Access-Control-Allow-Credentials': 'true',
        },
      })
    }
  }
  
  // Extrair tenant do query param ou usar 'demo' como padrão
  let tenantDomain = request.nextUrl.searchParams.get('tenant')
  
  if (!tenantDomain) {
    // Para desenvolvimento, usar 'demo' como padrão
    tenantDomain = 'demo'
  }

  // Rotas que não precisam de tenant ou autenticação
  const publicRoutes = [
    '/api/health',
    '/api/auth',
    '/api/tenant',
    '/auth/login',
    '/auth/error',
    '/select-tenant',
    '/login',
    '/register',
    '/_next',
    '/favicon.ico',
    '/manifest.json',
    '/sw.js'
  ]

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Minimizar headers para melhor performance
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-domain', tenantDomain)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Add CORS headers to API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
      ? process.env.MOBILE_APP_DOMAIN || 'https://yourmobileapp.com'
      : '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-ID')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // Cache headers para recursos estáticos
  if (request.nextUrl.pathname.includes('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

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
    '/((?!api/health|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
