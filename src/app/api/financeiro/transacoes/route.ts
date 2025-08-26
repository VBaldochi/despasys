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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const tipo = searchParams.get('tipo');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {
      tenantId: user.tenantId
    };

    if (tipo && (tipo === 'RECEITA' || tipo === 'DESPESA')) {
      where.tipo = tipo;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { descricao: { contains: search, mode: 'insensitive' } },
        { categoria: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Buscar transações
    const [transacoes, total] = await Promise.all([
      prisma.transacao.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true
            }
          },
          processo: {
            select: {
              id: true,
              numero: true
            }
          }
        },
        orderBy: {
          dataVencimento: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.transacao.count({ where })
    ]);

    return NextResponse.json({
      transacoes: transacoes.map((t: any) => ({
        id: t.id,
        numero: t.numero,
        descricao: t.descricao,
        categoria: t.categoria,
        valor: t.valor,
        tipo: t.tipo,
        status: t.status,
        dataVencimento: t.dataVencimento,
        dataPagamento: t.dataPagamento,
        metodoPagamento: t.metodoPagamento,
        cliente: t.customer,
        processo: t.processo,
        createdAt: t.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const data = await request.json();
    const {
      tipo,
      categoria,
      descricao,
      valor,
      dataVencimento,
      customerId,
      processoId,
      metodoPagamento,
      observacoes
    } = data;

    // Validações básicas
    if (!tipo || !categoria || !descricao || !valor || !dataVencimento) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    if (valor <= 0) {
      return NextResponse.json(
        { error: 'Valor deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Gerar número único para a transação
    const count = await prisma.transacao.count({
      where: { tenantId: user.tenantId }
    });
    const numero = `${tipo.charAt(0)}${String(count + 1).padStart(6, '0')}`;

    const transacao = await prisma.transacao.create({
      data: {
        tenantId: user.tenantId,
        numero,
        tipo,
        categoria,
        descricao,
        valor: parseFloat(valor),
        dataVencimento: new Date(dataVencimento),
        customerId: customerId || null,
        processoId: processoId || null,
        metodoPagamento: metodoPagamento || null,
        observacoes: observacoes || null,
        status: 'PENDENTE'
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true
          }
        },
        processo: {
          select: {
            id: true,
            numero: true
          }
        }
      }
    });

    return NextResponse.json({
      transacao: {
        id: transacao.id,
        numero: transacao.numero,
        descricao: transacao.descricao,
        categoria: transacao.categoria,
        valor: transacao.valor,
        tipo: transacao.tipo,
        status: transacao.status,
        dataVencimento: transacao.dataVencimento,
        cliente: transacao.customer,
        processo: transacao.processo
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
