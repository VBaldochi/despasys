// API endpoint para debug de sessões
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getSessionDebugInfo, cleanupStaleProblems } from '@/lib/session-debug'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const debugInfo = getSessionDebugInfo(session)
    
    // Cleanup automático
    const cleanup = await cleanupStaleProblems()
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      session: debugInfo,
      cleanup,
      cookies: {
        sessionToken: request.cookies.get('next-auth.session-token')?.value ? 'exists' : 'missing',
        secureSessionToken: request.cookies.get('__Secure-next-auth.session-token')?.value ? 'exists' : 'missing',
        callbackUrl: request.cookies.get('next-auth.callback-url')?.value || 'missing',
        csrfToken: request.cookies.get('next-auth.csrf-token')?.value ? 'exists' : 'missing'
      },
      headers: {
        userAgent: request.headers.get('user-agent'),
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        host: request.headers.get('host')
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextauthUrl: process.env.NEXTAUTH_URL,
        hasSecret: !!process.env.NEXTAUTH_SECRET
      }
    })
  } catch (error) {
    console.error('❌ Session debug error:', error)
    return NextResponse.json({
      error: 'Session debug failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'cleanup') {
      const result = await cleanupStaleProblems()
      return NextResponse.json({
        success: true,
        action: 'cleanup',
        result,
        timestamp: new Date().toISOString()
      })
    }
    
    return NextResponse.json({
      error: 'Invalid action',
      availableActions: ['cleanup']
    }, { status: 400 })
    
  } catch (error) {
    console.error('❌ Session action error:', error)
    return NextResponse.json({
      error: 'Action failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
