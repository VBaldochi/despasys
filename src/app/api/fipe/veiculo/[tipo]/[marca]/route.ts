import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tipo: string; marca: string }> }
) {
  try {
    const { tipo, marca } = await params;
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

    if (!marca) {
      return NextResponse.json(
        { 
          error: 'Código da marca é obrigatório',
          code: 'BRAND_CODE_REQUIRED' 
        },
        { status: 400 }
      );
    }

    // Parâmetros opcionais
    const tabelaReferencia = searchParams.get('tabela_referencia');
    
    let url = `https://brasilapi.com.br/api/fipe/veiculos/v1/${tipo}/${marca}`;
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
          error: 'Veículos não encontrados para esta marca',
          code: 'VEHICLES_NOT_FOUND' 
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
          error: 'Erro ao buscar veículos FIPE',
          code: 'API_ERROR' 
        },
        { status: response.status }
      );
    }

    const veiculos = await response.json();
    
    return NextResponse.json({ 
      veiculos,
      tipo,
      marca,
      total: Array.isArray(veiculos) ? veiculos.length : 1,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API FIPE veículos:', error);
    
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
