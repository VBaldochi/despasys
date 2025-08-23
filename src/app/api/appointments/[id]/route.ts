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
    const appointmentId = id

    const appointment = await executeWithRetry(async () => {
      return await (prisma as any).appointment.findFirst({
        where: { 
          id: appointmentId,
          customer: {
            tenantId
          }
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              cpfCnpj: true,
              endereco: true,
              cidade: true,
              estado: true
            }
          }
        }
      })
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(appointment)
    
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error)
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
    const appointmentId = id
    const data = await request.json()

    // Verificar se o agendamento existe e pertence ao tenant
    const existingAppointment = await executeWithRetry(async () => {
      return await (prisma as any).appointment.findFirst({
        where: { 
          id: appointmentId,
          customer: {
            tenantId
          }
        }
      })
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar o agendamento
    const updatedAppointment = await executeWithRetry(async () => {
      return await (prisma as any).appointment.update({
        where: { id: appointmentId },
        data: {
          ...data,
          startTime: data.startTime ? new Date(data.startTime) : undefined,
          endTime: data.endTime ? new Date(data.endTime) : undefined,
          updatedAt: new Date()
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              cpfCnpj: true
            }
          }
        }
      })
    })

    return NextResponse.json(updatedAppointment)
    
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error)
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
    const appointmentId = id

    // Verificar se o agendamento existe e pertence ao tenant
    const existingAppointment = await executeWithRetry(async () => {
      return await (prisma as any).appointment.findFirst({
        where: { 
          id: appointmentId,
          customer: {
            tenantId
          }
        }
      })
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      )
    }

    // Deletar o agendamento
    await executeWithRetry(async () => {
      return await (prisma as any).appointment.delete({
        where: { id: appointmentId }
      })
    })

    return NextResponse.json({ message: 'Agendamento excluído com sucesso' })
    
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
