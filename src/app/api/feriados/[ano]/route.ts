import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ano: string }> }
) {
  try {
    const { ano } = await params;

    if (!ano || !/^\d{4}$/.test(ano)) {
      return NextResponse.json(
        { error: 'Ano deve ser um número de 4 dígitos' },
        { status: 400 }
      );
    }

    const anoNum = parseInt(ano);
    const anoAtual = new Date().getFullYear();
    
    if (anoNum < 2000 || anoNum > anoAtual + 5) {
      return NextResponse.json(
        { error: 'Ano deve estar entre 2000 e ' + (anoAtual + 5) },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://brasilapi.com.br/api/feriados/v1/${ano}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      }
    );

    if (response.status === 404) {
      return NextResponse.json(
        { 
          error: 'Feriados não encontrados para este ano',
          code: 'HOLIDAYS_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

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
          error: 'Erro ao buscar feriados',
          code: 'API_ERROR' 
        },
        { status: response.status }
      );
    }

    const feriados = await response.json();
    
    return NextResponse.json({ 
      feriados,
      ano: anoNum,
      total: feriados.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API de feriados:', error);
    
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
