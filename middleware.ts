import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
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
