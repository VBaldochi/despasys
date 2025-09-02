import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ 
      message: 'Cookies de sessão limpos',
      timestamp: new Date().toISOString()
    })

    // Limpar todos os cookies relacionados ao NextAuth
    const cookiesToClear = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      'next-auth.state',
      'next-auth.pkce.code_verifier'
    ]

    cookiesToClear.forEach(cookieName => {
      // Limpar para domínio atual
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: cookieName.includes('session-token') || cookieName.includes('csrf-token'),
        sameSite: 'lax'
      })

      // Limpar para subdomínio também
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        domain: '.vercel.app',
        secure: true,
        httpOnly: cookieName.includes('session-token') || cookieName.includes('csrf-token'),
        sameSite: 'lax'
      })
    })

    return response
  } catch (error) {
    return NextResponse.json({
      error: 'Erro ao limpar cookies',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
