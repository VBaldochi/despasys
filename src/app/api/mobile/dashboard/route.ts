import { NextRequest, NextResponse } from 'next/server';
import { validateMobileAuth } from '@/lib/mobile-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateMobileAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Não autorizado' }, { status: 401 });
    }

    const tenantId = authResult.user!.tenantId;

    // Buscar estatísticas do tenant
    const [
      totalClientes,
      totalVeiculos,
      processosAndamento,
      processosFinalizados,
      transacoesPendentes,
      transacoesPagas,
      receita30Dias
    ] = await Promise.all([
      // Total de clientes ativos
      prisma.customer.count({
        where: {
          tenantId,
          status: 'ATIVO',
        },
      }),

      // Total de veículos
      prisma.veiculo.count({
        where: {
          tenantId,
          status: 'ATIVO',
        },
      }),

      // Processos em andamento
      prisma.process.count({
        where: {
          tenantId,
          status: {
            in: ['AGUARDANDO_DOCUMENTOS', 'DOCUMENTOS_RECEBIDOS', 'EM_ANALISE', 'EM_PROCESSAMENTO'],
          },
        },
      }),

      // Processos finalizados
      prisma.process.count({
        where: {
          tenantId,
          status: 'FINALIZADO',
        },
      }),

      // Transações pendentes
      prisma.transacao.aggregate({
        where: {
          tenantId,
          tipo: 'RECEITA',
          status: {
            in: ['PENDENTE', 'VENCIDO'],
          },
        },
        _count: true,
        _sum: {
          valor: true,
        },
      }),

      // Transações pagas
      prisma.transacao.aggregate({
        where: {
          tenantId,
          tipo: 'RECEITA',
          status: 'PAGO',
        },
        _count: true,
        _sum: {
          valor: true,
        },
      }),

      // Receita dos últimos 30 dias
      prisma.transacao.aggregate({
        where: {
          tenantId,
          tipo: 'RECEITA',
          status: 'PAGO',
          dataPagamento: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
          },
        },
        _sum: {
          valor: true,
        },
      }),
    ]);

    // Buscar processos por status para o gráfico
    const processosPorStatus = await prisma.process.groupBy({
      by: ['status'],
      where: {
        tenantId,
      },
      _count: {
        status: true,
      },
    });

    // Mapear status para labels mais amigáveis
    const statusMap: { [key: string]: string } = {
      'AGUARDANDO_DOCUMENTOS': 'Aguardando Docs',
      'DOCUMENTOS_RECEBIDOS': 'Docs Recebidos',
      'EM_ANALISE': 'Em Análise',
      'AGUARDANDO_PAGAMENTO': 'Aguardando Pgto',
      'PAGAMENTO_CONFIRMADO': 'Pgto Confirmado',
      'EM_PROCESSAMENTO': 'Em Processamento',
      'AGUARDANDO_VISTORIA': 'Aguardando Vistoria',
      'VISTORIA_REALIZADA': 'Vistoria Realizada',
      'FINALIZADO': 'Finalizado',
      'CANCELADO': 'Cancelado',
      'ERRO': 'Erro',
    };

    const processosPorStatusFormatted = processosPorStatus.map(item => ({
      status: statusMap[item.status] || item.status,
      count: item._count.status,
    }));

    // Buscar receita por mês dos últimos 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const receitaPorMes = await prisma.transacao.groupBy({
      by: ['createdAt'],
      where: {
        tenantId,
        tipo: 'RECEITA',
        status: 'PAGO',
        dataPagamento: {
          gte: sixMonthsAgo,
        },
      },
      _sum: {
        valor: true,
      },
    });

    // Agrupar por mês
    const receitaMensal = new Map<string, number>();
    receitaPorMes.forEach(item => {
      const month = item.createdAt.toISOString().substring(0, 7); // YYYY-MM
      const current = receitaMensal.get(month) || 0;
      receitaMensal.set(month, current + (item._sum.valor || 0));
    });

    const receitaMensalFormatted = Array.from(receitaMensal.entries()).map(([month, valor]) => ({
      mes: month,
      valor,
    }));

    const dashboardData = {
      estatisticas: {
        totalClientes,
        totalVeiculos,
        processosAndamento,
        processosFinalizados,
        totalProcessos: processosAndamento + processosFinalizados,
        debitosPendentes: {
          quantidade: transacoesPendentes._count,
          valor: transacoesPendentes._sum.valor || 0,
        },
        receitaRecebida: {
          quantidade: transacoesPagas._count,
          valor: transacoesPagas._sum.valor || 0,
        },
        receita30Dias: receita30Dias._sum.valor || 0,
      },
      processosPorStatus: processosPorStatusFormatted,
      receitaMensal: receitaMensalFormatted,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
