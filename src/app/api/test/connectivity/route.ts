import { NextRequest, NextResponse } from 'next/server'
import { ConnectivityTests } from '../../../../test/connectivity'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Iniciando testes de conectividade via API...')
    
    // Executar todos os testes
    const results = await ConnectivityTests.runAllTests()
    
    const allPassed = Object.values(results).every(Boolean)
    
    return NextResponse.json({
      success: allPassed,
      message: allPassed ? 'Todos os testes passaram!' : 'Alguns testes falharam',
      results,
      timestamp: new Date().toISOString(),
      environment: 'development'
    }, {
      status: allPassed ? 200 : 500
    })
    
  } catch (error) {
    console.error('❌ Erro nos testes de conectividade:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro interno nos testes',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    })
  }
}
