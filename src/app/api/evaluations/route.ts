import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Filtra pelo tenantId do usuário logado
    const tenantId = (session.user as any)?.tenantId || 'tenant-default';
    const evaluations = await prisma.evaluation.findMany({
      where: {
        tenantId
      },
      orderBy: { requestedDate: 'desc' }
    });
    return NextResponse.json(evaluations);
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 400 });
    }

    const body = await request.json();
    const {
      customerId,
      customerName,
      customerPhone,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehiclePlate,
      evaluationType,
      purpose,
      location,
      estimatedValue,
      observations
    } = body;

    // Validação básica
    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Nome e telefone do cliente são obrigatórios' },
        { status: 400 }
      );
    }

    if (!vehicleBrand || !vehicleModel || !vehicleYear || !vehiclePlate) {
      return NextResponse.json(
        { error: 'Dados do veículo são obrigatórios: vehicleBrand, vehicleModel, vehicleYear, vehiclePlate' },
        { status: 400 }
      );
    }

    if (!evaluationType) {
      return NextResponse.json(
        { error: 'Tipo de avaliação é obrigatório' },
        { status: 400 }
      );
    }

    if (!purpose) {
      return NextResponse.json(
        { error: 'Finalidade é obrigatória' },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        { error: 'Local é obrigatório' },
        { status: 400 }
      );
    }

    // Create evaluation
    const evaluation = await prisma.evaluation.create({
      data: {
        tenantId,
        customerId: customerId || null,
        customerName,
        customerPhone,
        vehicleBrand,
        vehicleModel,
        vehicleYear,
        vehiclePlate,
        evaluationType,
        purpose,
        location,
        estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
        observations: observations || null,
        status: 'REQUESTED',
      }
    });

    return NextResponse.json(evaluation, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 400 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID da avaliação é obrigatório' }, { status: 400 });
    }

    // Prepare update data
    const prismaUpdateData: any = {}
    
    if (updateData.status) prismaUpdateData.status = updateData.status
    if (updateData.scheduledDate) prismaUpdateData.scheduledDate = new Date(updateData.scheduledDate)
    if (updateData.completedDate) prismaUpdateData.completedDate = new Date(updateData.completedDate)
    if (updateData.estimatedValue) prismaUpdateData.estimatedValue = parseFloat(updateData.estimatedValue)
    if (updateData.finalValue) prismaUpdateData.finalValue = parseFloat(updateData.finalValue)
    if (updateData.observations !== undefined) prismaUpdateData.observations = updateData.observations

    const updatedEvaluation = await prisma.evaluation.update({
      where: { id },
      data: prismaUpdateData
    });

    return NextResponse.json(updatedEvaluation);
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da avaliação é obrigatório' }, { status: 400 });
    }

    await prisma.evaluation.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Avaliação removida com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
