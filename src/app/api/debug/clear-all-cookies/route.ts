import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ 
      success: true, 
      message: 'Todos os cookies de autenticação foram limpos' 
    })

    // Limpar todos os possíveis cookies de autenticação
    const cookiesToClear = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token', 
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token'
    ]

    cookiesToClear.forEach(cookieName => {
      // Limpar para o domínio atual
      response.cookies.set(cookieName, '', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      })
      
      // Limpar para subdomínios também
      response.cookies.set(cookieName, '', {
        maxAge: 0,
        path: '/',
        domain: '.vercel.app',
        httpOnly: true,
        secure: true,
        sameSite: 'lax'
      })
    })

    console.log('🧹 Limpando todos os cookies de autenticação')
    
    return response
  } catch (error) {
    console.error('❌ Erro ao limpar cookies:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao limpar cookies' 
    }, { status: 500 })
  }
}
