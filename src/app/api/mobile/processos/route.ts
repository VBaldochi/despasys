import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Função para mapear status do banco para mobile
function mapStatusToMobile(status: string): 'aguardando' | 'andamento' | 'finalizado' | 'cancelado' {
  const statusMap: { [key: string]: 'aguardando' | 'andamento' | 'finalizado' | 'cancelado' } = {
    'AGUARDANDO_DOCUMENTOS': 'aguardando',
    'DOCUMENTOS_RECEBIDOS': 'aguardando',
    'EM_ANALISE': 'andamento',
    'AGUARDANDO_PAGAMENTO': 'aguardando',
    'PAGAMENTO_CONFIRMADO': 'andamento',
    'EM_PROCESSAMENTO': 'andamento',
    'AGUARDANDO_VISTORIA': 'andamento',
    'VISTORIA_REALIZADA': 'andamento',
    'FINALIZADO': 'finalizado',
    'CANCELADO': 'cancelado',
    'ERRO': 'cancelado',
  };
  return statusMap[status] || 'aguardando';
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!session.user.tenantId) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const clienteId = searchParams.get('clienteId');
    const veiculoId = searchParams.get('veiculoId');

    const where: any = {
      tenantId: session.user.tenantId,
    };

    if (statusParam) {
      // Mapear status do mobile para banco
      const statusMap: { [key: string]: string[] } = {
        'aguardando': ['AGUARDANDO_DOCUMENTOS', 'DOCUMENTOS_RECEBIDOS', 'AGUARDANDO_PAGAMENTO'],
        'andamento': ['EM_ANALISE', 'PAGAMENTO_CONFIRMADO', 'EM_PROCESSAMENTO', 'AGUARDANDO_VISTORIA', 'VISTORIA_REALIZADA'],
        'finalizado': ['FINALIZADO'],
        'cancelado': ['CANCELADO', 'ERRO'],
      };
      const statusArray = statusMap[statusParam];
      if (statusArray) {
        where.status = { in: statusArray };
      }
    }

    if (clienteId) {
      where.customerId = clienteId;
    }

    if (veiculoId) {
      where.veiculoId = veiculoId;
    }

    const processos = await prisma.process.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        veiculo: {
          select: {
            id: true,
            placa: true,
            marca: true,
            modelo: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const processosFormatted = processos.map(processo => ({
      id: processo.id,
      numero: processo.numero,
      titulo: processo.titulo,
      cliente: processo.customer.name,
      clienteId: processo.customerId,
      placa: processo.veiculo?.placa || '',
      veiculoId: processo.veiculoId,
      servico: processo.tipoServico,
      status: mapStatusToMobile(processo.status),
      prioridade: processo.prioridade,
      prazo: processo.prazoLegal?.toISOString(),
      valor: processo.valorTotal,
      responsavel: processo.responsavel.name,
      telefone: processo.customer.phone || '',
      observacoes: processo.observacoes,
      createdAt: processo.createdAt.toISOString(),
      updatedAt: processo.updatedAt.toISOString(),
    }));

    return NextResponse.json(processosFormatted);
  } catch (error) {
    console.error('Erro ao buscar processos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!session.user.tenantId) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 400 });
    }

    const body = await request.json();
    const { titulo, clienteId, veiculoId, tipoServico, prazo, valor, descricao, prioridade } = body;

    // Verificar se o cliente existe
    const customer = await prisma.customer.findFirst({
      where: {
        id: clienteId,
        tenantId: session.user.tenantId,
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    // Verificar se o veículo existe (opcional)
    let veiculo = null;
    if (veiculoId) {
      veiculo = await prisma.veiculo.findFirst({
        where: {
          id: veiculoId,
          tenantId: session.user.tenantId,
        },
      });
    }

    // Mapear tipo de serviço
    const tipoServicoMap: { [key: string]: string } = {
      'Licenciamento': 'LICENCIAMENTO',
      'Transferência': 'TRANSFERENCIA',
      'Primeiro Emplacamento': 'PRIMEIRO_EMPLACAMENTO',
      'Segunda Via': 'SEGUNDA_VIA',
      'Desbloqueio': 'DESBLOQUEIO',
    };

    const tipoServicoEnum = tipoServicoMap[tipoServico] || 'LICENCIAMENTO';

    const processo = await prisma.process.create({
      data: {
        tenantId: session.user.tenantId,
        numero: `PROC-${Date.now()}`,
        customerId: clienteId,
        veiculoId: veiculoId || null,
        responsavelId: session.user.id,
        tipoServico: tipoServicoEnum as any,
        titulo: titulo || `${tipoServico} - ${veiculo?.placa || 'N/A'}`,
        descricao: descricao || null,
        status: 'AGUARDANDO_DOCUMENTOS',
        prioridade: (prioridade || 'MEDIA') as any,
        prazoLegal: prazo ? new Date(prazo) : null,
        valorTotal: valor || 0,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        veiculo: {
          select: {
            id: true,
            placa: true,
            marca: true,
            modelo: true,
          },
        },
        responsavel: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const processoFormatted = {
      id: processo.id,
      numero: processo.numero,
      titulo: processo.titulo,
      cliente: processo.customer.name,
      clienteId: processo.customerId,
      placa: processo.veiculo?.placa || '',
      veiculoId: processo.veiculoId,
      servico: processo.tipoServico,
      status: mapStatusToMobile(processo.status),
      prioridade: processo.prioridade,
      prazo: processo.prazoLegal?.toISOString(),
      valor: processo.valorTotal,
      responsavel: processo.responsavel.name || '',
      telefone: processo.customer.phone || '',
      observacoes: processo.observacoes,
      createdAt: processo.createdAt.toISOString(),
      updatedAt: processo.updatedAt.toISOString(),
    };

    return NextResponse.json(processoFormatted);
  } catch (error) {
    console.error('Erro ao criar processo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
