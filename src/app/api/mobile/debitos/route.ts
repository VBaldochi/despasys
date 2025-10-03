import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateMobileAuth } from '@/lib/mobile-auth';

// Função para mapear status do banco para mobile
function mapStatusToMobile(status: string): 'pendente' | 'pago' | 'vencido' | 'cancelado' {
  const statusMap: { [key: string]: 'pendente' | 'pago' | 'vencido' | 'cancelado' } = {
    'PENDENTE': 'pendente',
    'PAGO': 'pago',
    'VENCIDO': 'vencido',
    'CANCELADO': 'cancelado',
    'ESTORNADO': 'cancelado',
  };
  return statusMap[status] || 'pendente';
}

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

    // Buscar transações (débitos) pendentes
    const transacoes = await prisma.transacao.findMany({
      where: {
        tenantId: user.tenantId,
        tipo: 'RECEITA',
        status: {
          in: ['PENDENTE', 'VENCIDO'],
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        processo: {
          select: {
            id: true,
            numero: true,
            titulo: true,
            tipoServico: true,
          },
        },
      },
      orderBy: {
        dataVencimento: 'asc',
      },
    });

    const debitosFormatted = transacoes.map(transacao => ({
      id: transacao.id,
      cliente: transacao.customer?.name || 'Cliente não informado',
      clienteId: transacao.customerId,
      processo: transacao.processo?.numero || transacao.descricao,
      processoId: transacao.processoId,
      servico: transacao.processo?.tipoServico || 'Serviço',
      valor: transacao.valor,
      dataVencimento: transacao.dataVencimento.toISOString(),
      status: mapStatusToMobile(transacao.status),
      descricao: transacao.descricao,
      telefone: transacao.customer?.phone || '',
      createdAt: transacao.createdAt.toISOString(),
    }));

    return NextResponse.json(debitosFormatted);
  } catch (error) {
    console.error('Erro ao buscar débitos:', error);
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
    const { clienteId, processoId, valor, dataVencimento, descricao } = body;

    // Verificar se o cliente existe
    const customer = await prisma.customer.findFirst({
      where: {
        id: clienteId,
        tenantId: user.tenantId,
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    // Verificar se o processo existe (opcional)
    let processo = null;
    if (processoId) {
      processo = await prisma.process.findFirst({
        where: {
          id: processoId,
          tenantId: user.tenantId,
        },
      });
    }

    const transacao = await prisma.transacao.create({
      data: {
        tenantId: user.tenantId,
        numero: `TRANS-${Date.now()}`,
        customerId: clienteId,
        processoId: processoId || null,
        tipo: 'RECEITA',
        categoria: 'SERVICOS',
        descricao: descricao || 'Cobrança de serviço',
        valor: valor,
        dataVencimento: new Date(dataVencimento),
        status: 'PENDENTE',
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        processo: {
          select: {
            id: true,
            numero: true,
            titulo: true,
            tipoServico: true,
          },
        },
      },
    });

    const debitoFormatted = {
      id: transacao.id,
      cliente: transacao.customer?.name || 'Cliente não informado',
      clienteId: transacao.customerId,
      processo: transacao.processo?.numero || transacao.descricao,
      processoId: transacao.processoId,
      servico: transacao.processo?.tipoServico || 'Serviço',
      valor: transacao.valor,
      dataVencimento: transacao.dataVencimento.toISOString(),
      status: mapStatusToMobile(transacao.status),
      descricao: transacao.descricao,
      telefone: transacao.customer?.phone || '',
      createdAt: transacao.createdAt.toISOString(),
    };

    return NextResponse.json(debitoFormatted);
  } catch (error) {
    console.error('Erro ao criar débito:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
