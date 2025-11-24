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
    const registrations = await prisma.registration.findMany({
      where: {
        tenantId
      },
      orderBy: { requestedDate: 'desc' }
    });
    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
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
      customerCpf,
      vehicleBrand,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      vehicleType,
      chassisNumber,
      isZeroKm,
      invoice,
      invoiceDate,
      dealership,
      observations
    } = body;

    // Validação básica
    if (!customerName || !customerCpf) {
      return NextResponse.json(
        { error: 'Nome e CPF do cliente são obrigatórios' },
        { status: 400 }
      );
    }

    if (!vehicleBrand || !vehicleModel || !vehicleYear) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: vehicleBrand, vehicleModel, vehicleYear' },
        { status: 400 }
      );
    }

    if (!vehicleColor || !vehicleType) {
      return NextResponse.json(
        { error: 'Cor e tipo do veículo são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar 0km
    if (isZeroKm && (!dealership || !invoice)) {
      return NextResponse.json(
        { error: 'Para veículos 0km, concessionária e nota fiscal são obrigatórios' },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        tenantId,
        customerId: customerId || null,
        customerName,
        customerCpf,
        vehicleBrand,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vehicleType,
        chassisNumber: chassisNumber || null,
        isZeroKm: isZeroKm || false,
        invoice: isZeroKm ? invoice : null,
        invoiceDate: isZeroKm && invoiceDate ? new Date(invoiceDate) : null,
        dealership: isZeroKm ? dealership : null,
        observations: observations || null,
        status: 'PENDING_DOCS',
      }
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar registro:', error);
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
      return NextResponse.json({ error: 'ID do registro é obrigatório' }, { status: 400 });
    }

    // Prepare update data
    const prismaUpdateData: any = {}
    
    if (updateData.status) prismaUpdateData.status = updateData.status
    if (updateData.completedDate) prismaUpdateData.completedDate = new Date(updateData.completedDate)
    if (updateData.observations !== undefined) prismaUpdateData.observations = updateData.observations

    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: prismaUpdateData
    });

    return NextResponse.json(updatedRegistration);
  } catch (error) {
    console.error('Erro ao atualizar registro:', error);
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
      return NextResponse.json({ error: 'ID do registro é obrigatório' }, { status: 400 });
    }

    await prisma.registration.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Registro removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
