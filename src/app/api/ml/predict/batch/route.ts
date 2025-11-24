import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import jwt from 'jsonwebtoken';

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8020';
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

function generateMLToken(userId: string, email: string) {
  return jwt.sign(
    { sub: userId, email },
    NEXTAUTH_SECRET,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
}

/**
 * POST /api/ml/predict/batch
 * Obtém recomendações em lote para múltiplos clientes
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Gerar token JWT compatível com a API ML
    const token = generateMLToken(session.user.id, session.user.email || '');

    // Obter tenant do header ou query
    const tenantSlug = req.headers.get('x-tenant') || 'demo';

    // Forward request para ML API
    const body = await req.json();
    
    const response = await fetch(`${ML_API_URL}/ml/predict/batch?tenant=${tenantSlug}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Erro ao obter predições em lote' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na rota /api/ml/predict/batch:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
