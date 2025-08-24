import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tipo: string }> }
) {
  try {
    const { tipo } = await params;
    const { searchParams } = new URL(request.url);
    
    // Validar tipo de veículo
    const tiposValidos = ['carros', 'motos', 'caminhoes'];
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { 
          error: 'Tipo de veículo inválido. Use: carros, motos ou caminhoes',
          code: 'INVALID_VEHICLE_TYPE' 
        },
        { status: 400 }
      );
    }

    // Parâmetros opcionais
    const tabelaReferencia = searchParams.get('tabela_referencia');
    
    let url = `https://brasilapi.com.br/api/fipe/marcas/v1/${tipo}`;
    if (tabelaReferencia) {
      url += `?tabela_referencia=${tabelaReferencia}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000) // 15 segundos para FIPE
    });

    if (response.status === 404) {
      return NextResponse.json(
        { 
          error: 'Marcas não encontradas para este tipo de veículo',
          code: 'BRANDS_NOT_FOUND' 
        },
        { status: 404 }
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
          error: 'Erro ao buscar marcas FIPE',
          code: 'API_ERROR' 
        },
        { status: response.status }
      );
    }

    const marcas = await response.json();
    
    return NextResponse.json({ 
      marcas,
      tipo,
      total: marcas.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API FIPE marcas:', error);
    
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
