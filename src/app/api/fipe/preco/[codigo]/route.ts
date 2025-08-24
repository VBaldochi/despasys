import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;
    const { searchParams } = new URL(request.url);
    
    if (!codigo) {
      return NextResponse.json(
        { 
          error: 'Código FIPE é obrigatório',
          code: 'FIPE_CODE_REQUIRED' 
        },
        { status: 400 }
      );
    }

    // Validar formato básico do código FIPE (normalmente números e letras)
    if (!/^[A-Za-z0-9\-]{3,10}$/.test(codigo)) {
      return NextResponse.json(
        { 
          error: 'Formato de código FIPE inválido',
          code: 'INVALID_FIPE_CODE_FORMAT' 
        },
        { status: 400 }
      );
    }

    // Parâmetros opcionais
    const tabelaReferencia = searchParams.get('tabela_referencia');
    
    let url = `https://brasilapi.com.br/api/fipe/preco/v1/${codigo}`;
    if (tabelaReferencia) {
      url += `?tabela_referencia=${tabelaReferencia}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000)
    });

    if (response.status === 404) {
      return NextResponse.json(
        { 
          error: 'Código FIPE não encontrado',
          code: 'FIPE_CODE_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    if (response.status === 400) {
      return NextResponse.json(
        { 
          error: 'Código FIPE inválido',
          code: 'INVALID_FIPE_CODE' 
        },
        { status: 400 }
      );
    }

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
          error: 'Erro ao buscar preço FIPE',
          code: 'API_ERROR' 
        },
        { status: response.status }
      );
    }

    const preco = await response.json();
    
    return NextResponse.json({ 
      preco,
      codigo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API FIPE preço:', error);
    
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
