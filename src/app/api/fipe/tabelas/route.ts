import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      'https://brasilapi.com.br/api/fipe/tabelas/v1',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(15000)
      }
    );

    if (response.status === 504) {
      return NextResponse.json(
        { 
          error: 'Serviço FIPE temporariamente indisponível. Tente novamente em alguns minutos.',
          code: 'SERVICE_UNAVAILABLE' 
        },
        { status: 503 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Erro ao buscar tabelas FIPE',
          code: 'API_ERROR' 
        },
        { status: response.status }
      );
    }

    const tabelas = await response.json();
    
    return NextResponse.json({ 
      tabelas,
      total: tabelas.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API FIPE tabelas:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { 
          error: 'Timeout: Serviço FIPE demorou muito para responder. Tente novamente.',
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
