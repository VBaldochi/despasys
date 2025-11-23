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

    const tenantId = (session.user as any).tenantId;
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 400 });
    }

    // Buscar agendamentos dos clientes do tenant
    const appointments = await prisma.appointment.findMany({
      where: {
        customer: {
          tenantId: tenantId,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            cpfCnpj: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
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
      title, 
      description, 
      serviceType, 
      appointmentType, 
      startTime, 
      endTime, 
      notes,
      status 
    } = body;

    // Validação básica
    if (!customerId || !title || !serviceType || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: customerId, title, serviceType, startTime, endTime' },
        { status: 400 }
      );
    }

    // Verificar se o cliente pertence ao tenant
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        tenantId,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Cliente não encontrado ou não pertence ao tenant' },
        { status: 400 }
      );
    }

    // Validar que endTime > startTime
    if (new Date(endTime) <= new Date(startTime)) {
      return NextResponse.json(
        { error: 'O horário de término deve ser após o horário de início' },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        customerId,
        title,
        description: description || null,
        serviceType,
        appointmentType: appointmentType || 'PRESENCIAL',
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: status || 'SCHEDULED',
        notes: notes || null,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            cpfCnpj: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
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
      return NextResponse.json({ error: 'ID do agendamento é obrigatório' }, { status: 400 });
    }

    // Verificar se o agendamento pertence ao tenant
    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        customer: {
          tenantId,
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    // Converter datas se presentes
    if (updateData.startTime) {
      updateData.startTime = new Date(updateData.startTime);
    }
    if (updateData.endTime) {
      updateData.endTime = new Date(updateData.endTime);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            cpfCnpj: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
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
      return NextResponse.json({ error: 'ID do agendamento é obrigatório' }, { status: 400 });
    }

    // Verificar se o agendamento pertence ao tenant
    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        customer: {
          tenantId,
        },
      },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 });
    }

    // Cancelar agendamento (não deletar)
    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({ message: 'Agendamento cancelado com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
