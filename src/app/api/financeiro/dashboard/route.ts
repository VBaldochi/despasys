import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar o usuário e tenant
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const tenantId = user.tenantId;
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Buscar receitas do mês atual
    const receitasMes = await prisma.transacao.aggregate({
      where: {
        tenantId,
        tipo: 'RECEITA',
        dataVencimento: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      },
      _sum: {
        valor: true
      }
    });

    // Buscar despesas do mês atual
    const despesasMes = await prisma.transacao.aggregate({
      where: {
        tenantId,
        tipo: 'DESPESA',
        dataVencimento: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      },
      _sum: {
        valor: true
      }
    });

    // Buscar saldo total (todas as transações pagas)
    const receitasTotal = await prisma.transacao.aggregate({
      where: {
        tenantId,
        tipo: 'RECEITA',
        status: 'PAGO'
      },
      _sum: {
        valor: true
      }
    });

    const despesasTotal = await prisma.transacao.aggregate({
      where: {
        tenantId,
        tipo: 'DESPESA',
        status: 'PAGO'
      },
      _sum: {
        valor: true
      }
    });

    // Contar contas pendentes
    const contasPendentes = await prisma.transacao.count({
      where: {
        tenantId,
        status: 'PENDENTE'
      }
    });

    // Contar contas vencidas
    const contasVencidas = await prisma.transacao.count({
      where: {
        tenantId,
        status: 'VENCIDO'
      }
    });

    // Buscar transações recentes (últimas 10)
    const transacoesRecentes = await prisma.transacao.findMany({
      where: {
        tenantId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      include: {
        customer: {
          select: {
            name: true
          }
        },
        processo: {
          select: {
            numero: true
          }
        }
      }
    });

    const totalReceitas = receitasMes._sum.valor || 0;
    const totalDespesas = despesasMes._sum.valor || 0;
    const saldoAtual = (receitasTotal._sum.valor || 0) - (despesasTotal._sum.valor || 0);

    return NextResponse.json({
      totalReceitas,
      totalDespesas,
      saldoAtual,
      contasPendentes,
      contasVencidas,
      transacoesRecentes: transacoesRecentes.map((t: any) => ({
        id: t.id,
        descricao: t.descricao,
        categoria: t.categoria,
        valor: t.valor,
        tipo: t.tipo,
        status: t.status,
        dataVencimento: t.dataVencimento,
        dataPagamento: t.dataPagamento,
        cliente: t.customer?.name,
        processo: t.processo?.numero
      }))
    });

  } catch (error) {
    console.error('Erro ao buscar dados financeiros:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
