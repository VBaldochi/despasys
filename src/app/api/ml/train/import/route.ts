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
 * POST /api/ml/train/import
 * Treina o modelo ML importando CSV ou JSONL
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

    // Obter tenant e formato
    const tenantSlug = req.headers.get('x-tenant') || 'demo';
    const searchParams = new URL(req.url).searchParams;
    const fmt = searchParams.get('fmt') || 'csv';

    // Obter arquivo do FormData
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      );
    }

    // Forward para ML API
    const mlFormData = new FormData();
    mlFormData.append('file', file);

    const response = await fetch(`${ML_API_URL}/ml/train/import?tenant=${tenantSlug}&fmt=${fmt}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: mlFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Erro ao importar e treinar modelo' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro na rota /api/ml/train/import:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
