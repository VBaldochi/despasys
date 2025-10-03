import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID do estado é obrigatório' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://brasilapi.com.br/api/ibge/uf/v1/${id}`,
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
          error: 'Estado não encontrado',
          code: 'STATE_NOT_FOUND' 
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
          error: 'Erro ao buscar estado',
          code: 'API_ERROR' 
        },
        { status: response.status }
      );
    }

    const estado = await response.json();
    
    return NextResponse.json({ 
      estado,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API de estado:', error);
    
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
