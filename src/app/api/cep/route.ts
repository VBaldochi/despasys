import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cep = searchParams.get('cep')
  
  if (!cep) {
    return NextResponse.json(
      { error: 'CEP é obrigatório' },
      { status: 400 }
    )
  }

  // Limpar CEP (apenas números)
  const cepLimpo = cep.replace(/\D/g, '')
  
  if (cepLimpo.length !== 8) {
    return NextResponse.json(
      { error: 'CEP deve ter 8 dígitos' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'CEP não encontrado' },
          { status: 404 }
        )
      }
      if (response.status === 504 || response.status === 502 || response.status === 503) {
        return NextResponse.json(
          { error: 'Serviço temporariamente indisponível. Tente novamente em alguns segundos.' },
          { status: 503 }
        )
      }
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      endereco: {
        cep: data.cep,
        logradouro: data.street,
        bairro: data.neighborhood,
        cidade: data.city,
        uf: data.state,
        ddd: data.ddd
      }
    })
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
