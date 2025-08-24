import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      'https://brasilapi.com.br/api/banks/v1',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 segundos timeout
      }
    );

    if (response.status === 504) {
      return NextResponse.json(
        { 
          error: 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.',
          code: 'SERVICE_UNAVAILABLE' 
        },
        { status: 503 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Erro ao buscar bancos',
          code: 'API_ERROR' 
        },
        { status: response.status }
      );
    }

    const bancos = await response.json();
    
    return NextResponse.json({ 
      bancos,
      total: bancos.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API de bancos:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { 
          error: 'Timeout: Serviço demorou muito para responder. Tente novamente.',
          code: 'TIMEOUT' 
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}
