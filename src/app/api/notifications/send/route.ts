import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DualWriteService } from '@/lib/dual-write'

/**
 * API para criar notificação e sincronizar com Firebase
 * POST /api/notifications/send
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, message, type = 'INFO', targetUser, tenantId } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title e message são obrigatórios' },
        { status: 400 }
      )
    }

    // Usar tenantId do body se fornecido (para testes), senão usar da sessão
    const finalTenantId = tenantId || session.user.tenantId
    console.log('🎯 Enviando para tenant:', finalTenantId)

    // Criar notificação usando DualWriteService
    const notification = await DualWriteService.createNotification(
      finalTenantId,
      title,
      message,
      type,
      targetUser
    )

    console.log('✅ Notificação criada e sincronizada com Firebase:', notification.id)

    return NextResponse.json({
      success: true,
      notification,
      tenantId: finalTenantId
    })

  } catch (error) {
    console.error('❌ Erro ao criar notificação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
