import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, executeWithRetry } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const tenantId = session.user.tenantId
    const processId = id

    const process = await executeWithRetry(async () => {
      return await (prisma as any).process.findFirst({
        where: { 
          id: processId,
          tenantId 
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          },
          veiculo: {
            select: {
              marca: true,
              modelo: true,
              placa: true,
              ano: true,
              cor: true
            }
          },
          responsavel: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    })

    if (!process) {
      return NextResponse.json(
        { error: 'Processo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(process)
    
  } catch (error) {
    console.error('Erro ao buscar processo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const tenantId = session.user.tenantId
    const processId = id
    const data = await request.json()

    // Verificar se o processo existe e pertence ao tenant
    const existingProcess = await executeWithRetry(async () => {
      return await (prisma as any).process.findFirst({
        where: { 
          id: processId,
          tenantId 
        }
      })
    })

    if (!existingProcess) {
      return NextResponse.json(
        { error: 'Processo não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar o processo
    const updatedProcess = await executeWithRetry(async () => {
      return await (prisma as any).process.update({
        where: { id: processId },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
    })

    return NextResponse.json(updatedProcess)
    
  } catch (error) {
    console.error('Erro ao atualizar processo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const tenantId = session.user.tenantId
    const processId = id

    // Verificar se o processo existe e pertence ao tenant
    const existingProcess = await executeWithRetry(async () => {
      return await (prisma as any).process.findFirst({
        where: { 
          id: processId,
          tenantId 
        }
      })
    })

    if (!existingProcess) {
      return NextResponse.json(
        { error: 'Processo não encontrado' },
        { status: 404 }
      )
    }

    // Deletar o processo
    await executeWithRetry(async () => {
      return await (prisma as any).process.delete({
        where: { id: processId }
      })
    })

    return NextResponse.json({ message: 'Processo excluído com sucesso' })
    
  } catch (error) {
    console.error('Erro ao excluir processo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
