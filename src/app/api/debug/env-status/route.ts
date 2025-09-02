import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const envStatus = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      nextauth: {
        url: process.env.NEXTAUTH_URL || 'NOT_SET',
        secret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
        secretLength: process.env.NEXTAUTH_SECRET?.length || 0
      },
      database: {
        url: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
        urlType: process.env.DATABASE_URL?.includes('neon') ? 'NEON' : 
                 process.env.DATABASE_URL?.includes('postgres') ? 'POSTGRES' : 'OTHER'
      },
      vercel: {
        url: process.env.VERCEL_URL || 'NOT_SET',
        env: process.env.VERCEL_ENV || 'NOT_SET'
      }
    }

    return NextResponse.json(envStatus, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Erro ao verificar variáveis de ambiente',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
