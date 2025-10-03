import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipoVeiculo, codigoMarca, modeloNome } = body;

    if (!tipoVeiculo || !codigoMarca || !modeloNome) {
      return NextResponse.json(
        { 
          error: 'Parâmetros obrigatórios: tipoVeiculo, codigoMarca, modeloNome',
          code: 'MISSING_PARAMETERS' 
        },
        { status: 400 }
      );
    }

    // Buscar modelos da marca para encontrar o código do modelo
    const modelosResponse = await fetch(
      `https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos`
    );

    if (!modelosResponse.ok) {
      return NextResponse.json(
        { 
          error: 'Erro ao buscar modelos FIPE',
          code: 'FIPE_MODELS_ERROR' 
        },
        { status: 500 }
      );
    }

    const modelosData = await modelosResponse.json();
    const modelo = modelosData.modelos.find((m: any) => 
      m.nome.toLowerCase().includes(modeloNome.toLowerCase()) ||
      modeloNome.toLowerCase().includes(m.nome.toLowerCase())
    );

    if (!modelo) {
      return NextResponse.json(
        { 
          error: 'Modelo não encontrado na base FIPE',
          code: 'MODEL_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Buscar anos disponíveis para o modelo
    const anosResponse = await fetch(
      `https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${modelo.codigo}/anos`
    );

    if (!anosResponse.ok) {
      return NextResponse.json(
        { 
          error: 'Erro ao buscar anos FIPE',
          code: 'FIPE_YEARS_ERROR' 
        },
        { status: 500 }
      );
    }

    const anos = await anosResponse.json();

    // Buscar preços para os últimos 3 anos para performance
    const anosLimitados = anos.slice(0, 3);
    const precosPromises = anosLimitados.map(async (ano: any) => {
      try {
        const precoResponse = await fetch(
          `https://parallelum.com.br/fipe/api/v1/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${modelo.codigo}/anos/${ano.codigo}`
        );
        
        if (precoResponse.ok) {
          return await precoResponse.json();
        }
        return null;
      } catch {
        return null;
      }
    });

    const precos = (await Promise.all(precosPromises)).filter(Boolean);

    return NextResponse.json({
      success: true,
      modelo: modelo.nome,
      totalPrecos: precos.length,
      precos,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API FIPE preços:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR' 
      },
      { status: 500 }
    );
  }
}
