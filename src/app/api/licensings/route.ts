import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Filtra pelo tenantId do usuário logado
    const tenantId = (session.user as any)?.tenantId || 'tenant-default';
    const licensings = await prisma.licensing.findMany({
      where: {
        tenantId
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(licensings)
  } catch (error) {
    console.error('Erro ao buscar licenciamentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar licenciamentos' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()

    // Validações
    if (!body.customerName) {
      return NextResponse.json(
        { error: 'Nome do cliente é obrigatório' },
        { status: 400 }
      )
    }

    if (!body.vehiclePlate || !body.renavam) {
      return NextResponse.json(
        { error: 'Placa e RENAVAM são obrigatórios' },
        { status: 400 }
      )
    }

    if (!body.expirationDate) {
      return NextResponse.json(
        { error: 'Data de vencimento é obrigatória' },
        { status: 400 }
      )
    }

    if (!body.exercicio) {
      return NextResponse.json(
        { error: 'Exercício é obrigatório' },
        { status: 400 }
      )
    }

    // Create licensing
    const tenantId = (session.user as any)?.tenantId || 'tenant-default';
    const newLicensing = await prisma.licensing.create({
      data: {
        tenantId,
        customerId: body.customerId || null,
        customerName: body.customerName,
        vehiclePlate: body.vehiclePlate,
        vehicleBrand: body.vehicleBrand,
        vehicleModel: body.vehicleModel,
        vehicleYear: body.vehicleYear,
        renavam: body.renavam,
        exercicio: body.exercicio,
        expirationDate: new Date(body.expirationDate),
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        status: body.status || 'PENDING',
        taxValue: parseFloat(body.taxValue || '148.50'),
        serviceValue: parseFloat(body.serviceValue || '50.00'),
        totalValue: parseFloat(body.taxValue || '148.50') + parseFloat(body.serviceValue || '50.00'),
        paymentMethod: body.paymentMethod || null,
        observations: body.observations || null,
      }
    })

    return NextResponse.json(newLicensing, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar licenciamento:', error)
    return NextResponse.json(
      { error: 'Erro ao criar licenciamento' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID é obrigatório' },
        { status: 400 }
      )
    }

    // Prepare update data
    const prismaUpdateData: any = {}
    
    if (updateData.status) prismaUpdateData.status = updateData.status
    if (updateData.paymentDate) prismaUpdateData.paymentDate = new Date(updateData.paymentDate)
    if (updateData.paymentMethod) prismaUpdateData.paymentMethod = updateData.paymentMethod
    if (updateData.observations !== undefined) prismaUpdateData.observations = updateData.observations

    const updatedLicensing = await prisma.licensing.update({
      where: { id },
      data: prismaUpdateData
    })

    return NextResponse.json(updatedLicensing)
  } catch (error) {
    console.error('Erro ao atualizar licenciamento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar licenciamento' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID é obrigatório' },
        { status: 400 }
      )
    }

    await prisma.licensing.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Licenciamento cancelado com sucesso' })
  } catch (error) {
    console.error('Erro ao cancelar licenciamento:', error)
    return NextResponse.json(
      { error: 'Erro ao cancelar licenciamento' },
      { status: 500 }
    )
  }
}
