import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, executeWithRetry } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar agendamentos do tenant com relacionamentos
    const appointments = await executeWithRetry(async () => {
      return await (prisma as any).appointment.findMany({
        where: {
          customer: {
            tenantId: session.user.tenantId
          }
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
        },
        orderBy: {
          startTime: 'desc'
        }
      })
    })

    return NextResponse.json(appointments)
    
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const body = await request.json()

    // Validar dados obrigatórios
    const { customerId, title, serviceType, appointmentType, startTime, endTime } = body
    
    if (!customerId || !title || !serviceType || !appointmentType || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Verificar se cliente existe no tenant
    const customer = await (prisma as any).customer.findFirst({
      where: {
        id: customerId,
        tenantId
      }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Criar o agendamento
    const newAppointment = await executeWithRetry(async () => {
      return await (prisma as any).appointment.create({
        data: {
          customerId,
          title,
          description: body.description || null,
          serviceType,
          appointmentType,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          status: body.status || 'SCHEDULED',
          notes: body.notes || null
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

    return NextResponse.json(newAppointment, { status: 201 })
    
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
