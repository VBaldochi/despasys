import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;

    if (!codigo) {
      return NextResponse.json(
        { error: 'Código do banco é obrigatório' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://brasilapi.com.br/api/banks/v1/${codigo}`,
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
          error: 'Banco não encontrado',
          code: 'BANK_NOT_FOUND' 
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
          error: 'Erro ao buscar banco',
          code: 'API_ERROR' 
        },
        { status: response.status }
      );
    }

    const banco = await response.json();
    
    return NextResponse.json({ 
      banco,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API de banco:', error);
    
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
