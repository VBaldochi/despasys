import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateMobileAuth } from '@/lib/mobile-auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateMobileAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const placa = searchParams.get('placa');

    let where: any = {
      tenantId: authResult.user!.tenantId,
    };

    if (statusParam) {
      // Mapear status do mobile para banco
      const statusMap: { [key: string]: string } = {
        'aguardando': 'AGUARDANDO_DOCUMENTOS',
        'andamento': 'EM_PROCESSAMENTO',
        'finalizado': 'FINALIZADO',
        'cancelado': 'CANCELADO',
      };
      const status = statusMap[statusParam];
      if (status) {
        where.status = status as any;
      }
    }

    // Buscar processos com veículos
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const veiculosFormatted = processos
      .filter(processo => processo.veiculo) // Só processos que têm veículo
      .filter(processo => {
        if (!placa) return true;
        return processo.veiculo?.placa.toLowerCase().includes(placa.toLowerCase());
      })
      .map(processo => ({
        id: processo.id,
        placa: processo.veiculo?.placa || '',
        cliente: processo.customer.name,
        clienteId: processo.customerId,
        servico: processo.tipoServico,
        status: mapStatusToMobile(processo.status),
        prazo: processo.prazoLegal?.toISOString() || new Date().toISOString(),
        valor: processo.valorTotal,
        documentos: [], // Por enquanto vazio, depois implementar
        telefone: processo.customer.phone,
        createdAt: processo.createdAt.toISOString(),
        updatedAt: processo.updatedAt.toISOString(),
      }));

    return NextResponse.json(veiculosFormatted);
  } catch (error) {
    console.error('Erro ao listar veículos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateMobileAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error || 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { placa, clienteId, servico, prazo, valor, documentos } = body;

    // Verificar se o cliente existe
    const customer = await prisma.customer.findFirst({
      where: {
        id: clienteId,
        tenantId: authResult.user!.tenantId,
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    // Buscar ou criar veículo
    let veiculo = await prisma.veiculo.findFirst({
      where: {
        placa,
        tenantId: authResult.user!.tenantId,
      },
    });

    if (!veiculo) {
      // Criar veículo básico se não existir
      veiculo = await prisma.veiculo.create({
        data: {
          tenantId: authResult.user!.tenantId,
          customerId: clienteId,
          placa,
          marca: 'N/A',
          modelo: 'N/A',
          ano: new Date().getFullYear(),
          anoModelo: new Date().getFullYear(),
          cor: 'N/A',
          combustivel: 'N/A',
          categoria: 'N/A',
        },
      });
    }

    // Mapear servico para TipoServico enum
    const tipoServicoMap: { [key: string]: string } = {
      'Licenciamento': 'LICENCIAMENTO',
      'Transferência': 'TRANSFERENCIA',
      'Primeiro Emplacamento': 'PRIMEIRO_EMPLACAMENTO',
      'Segunda Via': 'SEGUNDA_VIA',
      'Desbloqueio': 'DESBLOQUEIO',
    };

    const tipoServico = tipoServicoMap[servico] || 'LICENCIAMENTO';

    // Criar processo
    const processo = await prisma.process.create({
      data: {
        tenantId: authResult.user!.tenantId,
        numero: `PROC-${Date.now()}`,
        customerId: clienteId,
        veiculoId: veiculo.id,
        responsavelId: authResult.user!.id,
        tipoServico: tipoServico as any,
        titulo: `${servico} - ${placa}`,
        status: 'AGUARDANDO_DOCUMENTOS',
        prazoLegal: new Date(prazo),
        valorTotal: valor,
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
      },
    });

    const processoFormatted = {
      id: processo.id,
      placa: processo.veiculo?.placa || placa,
      cliente: processo.customer.name,
      clienteId: processo.customerId,
      servico: processo.tipoServico,
      status: mapStatusToMobile(processo.status),
      prazo: processo.prazoLegal?.toISOString() || new Date().toISOString(),
      valor: processo.valorTotal,
      documentos: documentos || [],
      telefone: processo.customer.phone || '',
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

// Função para mapear status do banco para o mobile
function mapStatusToMobile(status: string): 'EM_ANDAMENTO' | 'PRONTO' | 'PENDENTE_DOCS' | 'AGUARDANDO_PAGTO' {
  switch (status) {
    case 'PENDING':
      return 'EM_ANDAMENTO';
    case 'COMPLETED':
      return 'PRONTO';
    case 'WAITING_DOCS':
      return 'PENDENTE_DOCS';
    case 'WAITING_PAYMENT':
      return 'AGUARDANDO_PAGTO';
    default:
      return 'EM_ANDAMENTO';
  }
}
