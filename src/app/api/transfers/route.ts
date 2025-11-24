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
    const transfers = await prisma.transfer.findMany({
      where: {
        tenantId
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(transfers)
  } catch (error) {
    console.error('Erro ao buscar transferências:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar transferências' },
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

    if (!body.sellerName || !body.sellerCpf) {
      return NextResponse.json(
        { error: 'Dados do vendedor são obrigatórios' },
        { status: 400 }
      )
    }

    if (!body.buyerName || !body.buyerCpf) {
      return NextResponse.json(
        { error: 'Dados do comprador são obrigatórios' },
        { status: 400 }
      )
    }

    if (body.sellerCpf === body.buyerCpf) {
      return NextResponse.json(
        { error: 'Vendedor e comprador não podem ser a mesma pessoa' },
        { status: 400 }
      )
    }

    if (!body.vehiclePlate || !body.renavam) {
      return NextResponse.json(
        { error: 'Placa e RENAVAM são obrigatórios' },
        { status: 400 }
      )
    }

    // Create transfer
    const tenantId = (session.user as any)?.tenantId || 'tenant-default';
    const newTransfer = await prisma.transfer.create({
      data: {
        tenantId,
        sellerId: body.sellerId || null,
        sellerName: body.sellerName,
        sellerCpf: body.sellerCpf,
        sellerPhone: body.sellerPhone,
        buyerId: body.buyerId || null,
        buyerName: body.buyerName,
        buyerCpf: body.buyerCpf,
        buyerPhone: body.buyerPhone,
        buyerAddress: body.buyerAddress || null,
        vehiclePlate: body.vehiclePlate,
        vehicleBrand: body.vehicleBrand,
        vehicleModel: body.vehicleModel,
        vehicleYear: body.vehicleYear,
        chassisNumber: body.chassisNumber || null,
        renavam: body.renavam,
        transferValue: body.saleValue ? parseFloat(body.saleValue) : null,
        serviceValue: parseFloat(body.serviceValue || '150.00'),
        status: body.status || 'PENDING_DOCS',
        observations: body.notes || null,
      }
    })

    return NextResponse.json(newTransfer, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar transferência:', error)
    return NextResponse.json(
      { error: 'Erro ao criar transferência' },
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
    if (updateData.completedDate) prismaUpdateData.completedDate = new Date(updateData.completedDate)
    if (updateData.observations !== undefined) prismaUpdateData.observations = updateData.observations
    if (updateData.transferValue) prismaUpdateData.transferValue = parseFloat(updateData.transferValue)
    if (updateData.serviceValue) prismaUpdateData.serviceValue = parseFloat(updateData.serviceValue)

    const updatedTransfer = await prisma.transfer.update({
      where: { id },
      data: prismaUpdateData
    })

    return NextResponse.json(updatedTransfer)
  } catch (error) {
    console.error('Erro ao atualizar transferência:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar transferência' },
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

    await prisma.transfer.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Transferência cancelada com sucesso' })
  } catch (error) {
    console.error('Erro ao cancelar transferência:', error)
    return NextResponse.json(
      { error: 'Erro ao cancelar transferência' },
      { status: 500 }
    )
  }
}
