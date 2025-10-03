import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const transacao = await prisma.transacao.findFirst({
      where: {
        id,
        tenantId: user.tenantId
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

    if (!transacao) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
    }

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
        dataPagamento: transacao.dataPagamento,
        metodoPagamento: transacao.metodoPagamento,
        observacoes: transacao.observacoes,
        cliente: transacao.customer,
        processo: transacao.processo,
        createdAt: transacao.createdAt
      }
    });

  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se a transação existe e pertence ao tenant
    const transacaoExistente = await prisma.transacao.findFirst({
      where: {
        id,
        tenantId: user.tenantId
      }
    });

    if (!transacaoExistente) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.status) updateData.status = data.status;
    if (data.dataPagamento) updateData.dataPagamento = new Date(data.dataPagamento);
    if (data.metodoPagamento) updateData.metodoPagamento = data.metodoPagamento;
    if (data.observacoes !== undefined) updateData.observacoes = data.observacoes;
    if (data.valor) updateData.valor = parseFloat(data.valor);
    if (data.descricao) updateData.descricao = data.descricao;
    if (data.categoria) updateData.categoria = data.categoria;
    if (data.dataVencimento) updateData.dataVencimento = new Date(data.dataVencimento);

    updateData.updatedAt = new Date();

    const transacaoAtualizada = await prisma.transacao.update({
      where: { id },
      data: updateData,
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
        id: transacaoAtualizada.id,
        numero: transacaoAtualizada.numero,
        descricao: transacaoAtualizada.descricao,
        categoria: transacaoAtualizada.categoria,
        valor: transacaoAtualizada.valor,
        tipo: transacaoAtualizada.tipo,
        status: transacaoAtualizada.status,
        dataVencimento: transacaoAtualizada.dataVencimento,
        dataPagamento: transacaoAtualizada.dataPagamento,
        metodoPagamento: transacaoAtualizada.metodoPagamento,
        observacoes: transacaoAtualizada.observacoes,
        cliente: transacaoAtualizada.customer,
        processo: transacaoAtualizada.processo
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await params;
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Verificar se a transação existe e pertence ao tenant
    const transacao = await prisma.transacao.findFirst({
      where: {
        id,
        tenantId: user.tenantId
      }
    });

    if (!transacao) {
      return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
    }

    // Deletar a transação
    await prisma.transacao.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Transação deletada com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
