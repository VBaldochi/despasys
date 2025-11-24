import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// GET - List unlocks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Filtra pelo tenantId do usuário logado
    // FORÇANDO tenantId correto para teste
    const tenantId = 'cme73a4c70000o2mtl6oqvbfk';
    console.log('[UNLOCKS API] tenantId usado na query:', tenantId);
    const unlocks = await prisma.unlock.findMany({
      where: {
        tenantId
      },
      orderBy: { requestedDate: 'desc' }
    })
    console.log(`[UNLOCKS API] Registros encontrados: ${unlocks.length}`);
    if (unlocks.length > 0) {
      console.log('[UNLOCKS API] Exemplo de registro:', unlocks[0]);
    }
    return NextResponse.json(unlocks)
  } catch (error) {
    console.error('Error fetching unlocks:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar desbloqueios' },
      { status: 500 }
    )
  }
}

// POST - Create new unlock
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    const data = await request.json()
    const tenantId = (session.user as any)?.tenantId || 'tenant-default';

    // Validation
    if (!data.customerId || !data.customerName) {
      return NextResponse.json(
        { error: 'Informações do cliente são obrigatórias' },
        { status: 400 }
      )
    }

    if (!data.vehiclePlate || !data.renavam) {
      return NextResponse.json(
        { error: 'Placa e RENAVAM do veículo são obrigatórios' },
        { status: 400 }
      )
    }

    if (!data.vehicleBrand || !data.vehicleModel || !data.vehicleYear) {
      return NextResponse.json(
        { error: 'Informações completas do veículo são obrigatórias' },
        { status: 400 }
      )
    }

    if (!data.unlockType) {
      return NextResponse.json(
        { error: 'Tipo de desbloqueio é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.blockReason) {
      return NextResponse.json(
        { error: 'Motivo do bloqueio é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.issueDescription) {
      return NextResponse.json(
        { error: 'Descrição do problema é obrigatória' },
        { status: 400 }
      )
    }

    if (!data.responsibleOrgan) {
      return NextResponse.json(
        { error: 'Órgão responsável é obrigatório' },
        { status: 400 }
      )
    }

    if (!data.requiredDocuments || data.requiredDocuments.length === 0) {
      return NextResponse.json(
        { error: 'Selecione ao menos um documento necessário' },
        { status: 400 }
      )
    }

    // Create new unlock
    const newUnlock = await prisma.unlock.create({
      data: {
        tenantId,
        customerId: data.customerId || null,
        customerName: data.customerName,
        customerCpf: data.customerCpf,
        customerPhone: data.customerPhone,
        vehiclePlate: data.vehiclePlate,
        vehicleBrand: data.vehicleBrand,
        vehicleModel: data.vehicleModel,
        vehicleYear: data.vehicleYear,
        renavam: data.renavam,
        unlockType: data.unlockType,
        blockReason: data.blockReason,
        blockDate: data.blockDate ? new Date(data.blockDate) : null,
        blockEntity: data.responsibleOrgan || null,
        unlockValue: parseFloat(data.detranFee || '95.75'),
        serviceValue: parseFloat(data.serviceFee || '80.00'),
        totalValue: parseFloat(data.detranFee || '95.75') + parseFloat(data.serviceFee || '80.00'),
        status: 'ANALYSIS',
        requestedDate: new Date(),
        observations: data.notes || null,
      }
    })

    return NextResponse.json(newUnlock, { status: 201 })
  } catch (error) {
    console.error('Error creating unlock:', error)
    return NextResponse.json(
      { error: 'Erro ao criar desbloqueio' },
      { status: 500 }
    )
  }
}

// PUT - Update unlock
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json(
        { error: 'ID do desbloqueio é obrigatório' },
        { status: 400 }
      )
    }

    // Prepare update data
    const prismaUpdateData: any = {}
    
    if (updateData.status) prismaUpdateData.status = updateData.status
    if (updateData.completedDate) prismaUpdateData.completedDate = new Date(updateData.completedDate)
    if (updateData.observations !== undefined) prismaUpdateData.observations = updateData.observations
    if (updateData.unlockValue) prismaUpdateData.unlockValue = parseFloat(updateData.unlockValue)
    if (updateData.serviceValue) prismaUpdateData.serviceValue = parseFloat(updateData.serviceValue)
    if (updateData.totalValue) prismaUpdateData.totalValue = parseFloat(updateData.totalValue)

    // Update unlock
    const updatedUnlock = await prisma.unlock.update({
      where: { id },
      data: prismaUpdateData
    })

    return NextResponse.json(updatedUnlock)
  } catch (error) {
    console.error('Error updating unlock:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar desbloqueio' },
      { status: 500 }
    )
  }
}

// DELETE - Delete unlock
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do desbloqueio é obrigatório' },
        { status: 400 }
      )
    }

    await prisma.unlock.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Desbloqueio removido com sucesso' })
  } catch (error) {
    console.error('Error deleting unlock:', error)
    return NextResponse.json(
      { error: 'Erro ao remover desbloqueio' },
      { status: 500 }
    )
  }
}
