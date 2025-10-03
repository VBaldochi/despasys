import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const cookies = request.cookies.getAll()
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      baseUrl: process.env.NEXTAUTH_URL,
      hasSession: !!session,
      sessionData: session ? {
        userId: session.user?.id,
        email: session.user?.email,
        role: (session.user as any)?.role,
        tenantId: (session.user as any)?.tenantId,
        loginTime: (session as any)?.loginTime
      } : null,
      cookies: cookies.map(cookie => ({
        name: cookie.name,
        hasValue: !!cookie.value,
        valueLength: cookie.value?.length || 0
      })),
      authCookies: {
        sessionToken: cookies.find(c => c.name.includes('session-token')),
        callbackUrl: cookies.find(c => c.name.includes('callback-url')),
        csrfToken: cookies.find(c => c.name.includes('csrf-token'))
      },
      headers: {
        userAgent: request.headers.get('user-agent'),
        host: request.headers.get('host'),
        referer: request.headers.get('referer')
      }
    }

    return NextResponse.json(debugInfo, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Erro ao obter informações de debug',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
