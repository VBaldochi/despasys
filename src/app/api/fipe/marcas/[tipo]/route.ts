import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tipo: string }> }
) {
  try {
    const { tipo } = await params;
    
    // Map Portuguese types to English for the new API v2
    const typeMap: { [key: string]: string } = {
      'carros': 'cars',
      'motos': 'motorcycles', 
      'caminhoes': 'trucks'
    };
    
    const vehicleType = typeMap[tipo];
    if (!vehicleType) {
      return NextResponse.json(
        { 
          error: 'Tipo de veículo inválido. Use: carros, motos ou caminhoes',
          code: 'INVALID_VEHICLE_TYPE' 
        },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      // Usar a nova API v2 da FIPE
      const response = await fetch(
        `https://fipe.parallelum.com.br/api/v2/${vehicleType}/brands`,
        {
          signal: controller.signal,
          headers: {
            'User-Agent': 'DespaSys/1.0 (Sistema de Gestão)',
            'Accept': 'application/json',
          },
        }
      );

      clearTimeout(timeoutId);

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

      const data = await response.json();
      
      // Convert v2 format (code/name) to v1 format (valor/nome) for compatibility
      const marcas = data.map((item: any) => ({
        valor: item.code,
        nome: item.name
      }));
      
      return NextResponse.json({ 
        marcas,
        tipo: vehicleType,
        total: marcas.length,
        timestamp: new Date().toISOString(),
        source: 'FIPE API v2'
      });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }

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
