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

    const veiculos = await prisma.veiculo.findMany({
      where: {
        tenantId: tenantId,
      },
      select: {
        id: true,
        placa: true,
        modelo: true,
        marca: true,
        ano: true,
        cor: true,
        renavam: true,
        chassi: true,
        customerId: true,
        customer: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        placa: 'asc',
      },
    });

    return NextResponse.json(veiculos);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
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
    const { placa, modelo, marca, ano, cor, renavam, chassi, customerId } = body;

    // Validação básica
    if (!placa || !modelo) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: placa, modelo' },
        { status: 400 }
      );
    }

    // Verificar se veículo já existe (por placa)
    const existingVeiculo = await prisma.veiculo.findFirst({
      where: {
        placa: placa.toUpperCase(),
        tenantId,
      },
    });

    if (existingVeiculo) {
      return NextResponse.json(
        { error: 'Veículo já cadastrado com esta placa' },
        { status: 400 }
      );
    }

    const veiculo = await prisma.veiculo.create({
      data: {
        tenantId,
        placa: placa.toUpperCase(),
        modelo,
        marca: marca || null,
        ano: ano || null,
        cor: cor || null,
        renavam: renavam || null,
        chassi: chassi || null,
        customerId: customerId || null,
      },
      include: {
        customer: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json(veiculo, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar veículo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
