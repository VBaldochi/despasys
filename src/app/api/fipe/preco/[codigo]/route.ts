import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;
    
    if (!codigo) {
      return NextResponse.json(
        { error: 'Código do veículo é obrigatório' },
        { status: 400 }
      );
    }

    // Parse código para extrair tipo, marca, modelo e ano
    // Formato esperado: cars/brands/59/models/5940/years/2014-3
    const url = new URL(request.url);
    const tipo = url.searchParams.get('tipo') || 'cars';
    const marca = url.searchParams.get('marca');
    const modelo = url.searchParams.get('modelo');
    const ano = url.searchParams.get('ano');

    // Try new FIPE API v2 first
    try {
      let fipeUrl = '';
      
      if (marca && modelo && ano) {
        // Use full path if we have all parameters
        fipeUrl = `https://fipe.parallelum.com.br/api/v2/${tipo}/brands/${marca}/models/${modelo}/years/${ano}`;
      } else {
        // Fallback: try to use codigo as fipe code
        fipeUrl = `https://fipe.parallelum.com.br/api/v2/${tipo}/${codigo}/years`;
      }

      const response = await fetch(fipeUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; DespaSys/1.0)',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Format response to match expected structure
        return NextResponse.json({
          valor: data.price || data.valor,
          marca: data.brand || data.marca,
          modelo: data.model || data.modelo,
          anoModelo: data.modelYear || data.anoModelo,
          combustivel: data.fuel || data.combustivel,
          codigoFipe: data.codeFipe || data.codigoFipe,
          mesReferencia: data.referenceMonth || data.mesReferencia,
          tipoVeiculo: data.vehicleType || data.tipoVeiculo,
          siglaCombustivel: data.fuelAcronym || data.siglaCombustivel,
          source: 'FIPE API v2',
          timestamp: new Date().toISOString()
        });
      }
    } catch (fipeError) {
      console.warn('New FIPE API v2 failed, trying BrasilAPI fallback:', fipeError);
    }

    // Fallback to BrasilAPI
    const fallbackResponse = await fetch(
      `https://brasilapi.com.br/api/fipe/preco/v1/${codigo}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; DespaSys/1.0)',
        },
      }
    );

    if (!fallbackResponse.ok) {
      return NextResponse.json(
        { error: 'Erro ao consultar preço do veículo' },
        { status: fallbackResponse.status }
      );
    }

    const fallbackData = await fallbackResponse.json();
    
    return NextResponse.json({
      ...fallbackData,
      source: 'BrasilAPI (fallback)',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro ao consultar preço FIPE:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
