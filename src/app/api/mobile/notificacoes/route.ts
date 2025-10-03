import { NextRequest, NextResponse } from 'next/server';
import { validateMobileAuth } from '@/lib/mobile-auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateMobileAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Não autorizado' }, { status: 401 });
    }

    // Mock notifications for now
    const notificacoes = [
      {
        id: '1',
        titulo: 'Processo Atualizado',
        mensagem: 'O processo ABC-123 foi atualizado',
        tipo: 'info',
        lida: false,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}