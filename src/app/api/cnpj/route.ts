import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cnpj = searchParams.get('cnpj')
  
  if (!cnpj) {
    return NextResponse.json(
      { error: 'CNPJ é obrigatório' },
      { status: 400 }
    )
  }

  // Limpar CNPJ (apenas números)
  const cnpjLimpo = cnpj.replace(/\D/g, '')
  
  if (cnpjLimpo.length !== 14) {
    return NextResponse.json(
      { error: 'CNPJ deve ter 14 dígitos' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'CNPJ não encontrado' },
          { status: 404 }
        )
      }
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      empresa: {
        cnpj: data.cnpj,
        razao_social: data.legal_name,
        nome_fantasia: data.trade_name,
        descricao_situacao_cadastral: data.registration_status,
        descricao_porte: data.company_size,
        cnae_fiscal_descricao: data.primary_activity?.[0]?.text || '',
        logradouro: data.address?.street || '',
        numero: data.address?.number || '',
        municipio: data.address?.city || '',
        cep: data.address?.zip_code || ''
      }
    })
  } catch (error) {
    console.error('Erro ao buscar CNPJ:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
