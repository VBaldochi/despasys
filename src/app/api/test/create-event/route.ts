// API para testar eventos em tempo real
import { NextRequest, NextResponse } from 'next/server'
import { DualWriteService } from '../../../../lib/dual-write'
import { DespaSysEventBus } from '../../../../lib/pubsub'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Criando evento de teste...')

    const body = await request.json()
    const { 
      tenantId = 'demo', 
      type = 'process',
      title = 'Teste de Sincronização',
      description = 'Evento criado pelo sistema web'
    } = body

    // 1. Criar evento via Event Bus
    const eventId = await DespaSysEventBus.publishEvent(
      tenantId,
      type,
      'test_created',
      {
        title,
        description,
        createdAt: new Date().toISOString(),
        source: 'web_test_endpoint'
      }
    )

    console.log(`📡 Evento publicado: ${eventId}`)

    // 2. Se for processo, criar via Dual-Write também
    if (type === 'process') {
      await DualWriteService.createProcess(
        {
          numero: `TEST-${Date.now()}`,
          tipo: 'LICENCIAMENTO', 
          status: 'NOVO',
          customerId: 'demo-client-id',
          descricao: description
        },
        tenantId,
        'test-user'
      )
      console.log('📋 Processo criado via Dual-Write')
    }

    // 3. Se for notificação, criar via Dual-Write
    if (type === 'notification') {
      await DualWriteService.createNotification(
        tenantId,
        title,
        description,
        'INFO'
      )
      console.log('🔔 Notificação criada via Dual-Write')
    }

    return NextResponse.json({
      success: true,
      message: 'Evento de teste criado com sucesso!',
      data: {
        eventId,
        tenantId,
        type,
        title,
        description,
        timestamp: Date.now()
      }
    })

  } catch (error) {
    console.error('❌ Erro ao criar evento de teste:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Erro ao criar evento de teste',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
