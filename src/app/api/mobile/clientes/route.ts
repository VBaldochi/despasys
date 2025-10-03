import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateMobileAuth } from '@/lib/mobile-auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateMobileAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Não autorizado' }, { status: 401 });
    }

    const { user } = authResult;

    if (!user.tenantId) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 400 });
    }

    const clientes = await prisma.customer.findMany({
      where: {
        tenantId: user.tenantId,
        status: 'ATIVO',
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        cpfCnpj: true,
        tipoCliente: true,
        endereco: true,
        cidade: true,
        estado: true,
        createdAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const clientesFormatted = clientes.map(cliente => ({
      id: cliente.id,
      nome: cliente.name,
      telefone: cliente.phone || '',
      email: cliente.email || '',
      cpfCnpj: cliente.cpfCnpj,
      tipo: cliente.tipoCliente === 'FISICO' ? 'Pessoa Física' : 'Pessoa Jurídica',
      endereco: cliente.endereco || '',
      cidade: cliente.cidade || '',
      estado: cliente.estado || 'SP',
      createdAt: cliente.createdAt.toISOString(),
    }));

    return NextResponse.json(clientesFormatted);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateMobileAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Não autorizado' }, { status: 401 });
    }

    const { user } = authResult;

    if (!user.tenantId) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 400 });
    }

    const body = await request.json();
    const { nome, telefone, email, cpfCnpj, tipo, endereco, cidade, estado } = body;

    // Verificar se cliente já existe
    const clienteExistente = await prisma.customer.findFirst({
      where: {
        cpfCnpj,
        tenantId: user.tenantId,
      },
    });

    if (clienteExistente) {
      return NextResponse.json({ error: 'Cliente já cadastrado com este CPF/CNPJ' }, { status: 400 });
    }

    const tipoCliente = tipo === 'Pessoa Física' ? 'FISICO' : 'JURIDICO';

    const cliente = await prisma.customer.create({
      data: {
        tenantId: user.tenantId,
        name: nome,
        phone: telefone,
        email: email || null,
        cpfCnpj,
        tipoCliente: tipoCliente as any,
        endereco: endereco || null,
        cidade: cidade || null,
        estado: estado || 'SP',
        status: 'ATIVO',
      },
    });

    const clienteFormatted = {
      id: cliente.id,
      nome: cliente.name,
      telefone: cliente.phone || '',
      email: cliente.email || '',
      cpfCnpj: cliente.cpfCnpj,
      tipo: cliente.tipoCliente === 'FISICO' ? 'Pessoa Física' : 'Pessoa Jurídica',
      endereco: cliente.endereco || '',
      cidade: cliente.cidade || '',
      estado: cliente.estado || 'SP',
      createdAt: cliente.createdAt.toISOString(),
    };

    return NextResponse.json(clienteFormatted);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
