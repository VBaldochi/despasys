import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8020';
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export async function GET(
  req: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { customerId } = params;

    // Buscar cliente com histórico
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        veiculos: true,
        processes: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    // Preparar dados para ML
    const historyCounts: Record<string, number> = {};
    let valorTotalGasto = 0;
    let ultimaData: Date | null = null;

    customer.processes.forEach((proc) => {
      const service = proc.tipoServico || 'OUTROS';
      historyCounts[service] = (historyCounts[service] || 0) + 1;
      valorTotalGasto += proc.valorTotal || 0;

      if (!ultimaData || proc.dataInicio > ultimaData) {
        ultimaData = proc.dataInicio;
      }
    });

    const totalServicos = customer.processes.length;
    const servicosUnicos = Object.keys(historyCounts).length;
    const diasDesdeUltimo = ultimaData
      ? Math.floor((Date.now() - new Date(ultimaData).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    const vehicle = customer.veiculos[0];
    const idadeVeiculo = vehicle ? new Date().getFullYear() - vehicle.ano : 5;

    const predictRequest = {
      client_info: {
        tipo_cliente: customer.tipoCliente || 'FISICO',
        total_servicos_cliente: totalServicos,
        valor_total_gasto: valorTotalGasto,
        dias_desde_ultimo_servico: diasDesdeUltimo,
        servicos_unicos_utilizados: servicosUnicos,
      },
      vehicle_info: {
        ano_veiculo: vehicle?.ano || 2020,
        tipo_veiculo: 'AUTOMOVEL',
        idade_veiculo: idadeVeiculo,
      },
      history_counts: historyCounts,
    };

    // Gerar token JWT
    const token = jwt.sign(
      { sub: session.user.id, email: session.user.email },
      NEXTAUTH_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' }
    );

    // Buscar tenant domain
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { tenant: true },
    });

    const tenantDomain = user?.tenant.domain || 'demo';

    // Fazer predição
    const mlResponse = await fetch(`${ML_API_URL}/ml/predict?tenant=${tenantDomain}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(predictRequest),
    });

    if (!mlResponse.ok) {
      const error = await mlResponse.text();
      console.error('ML API Error:', error);
      return NextResponse.json(
        { error: 'Erro ao gerar recomendações', model_available: false },
        { status: 500 }
      );
    }

    const prediction = await mlResponse.json();
    return NextResponse.json(prediction);

  } catch (error) {
    console.error('Error generating ML recommendation:', error);
    return NextResponse.json(
      { error: 'Erro interno ao gerar recomendações', model_available: false },
      { status: 500 }
    );
  }
}
