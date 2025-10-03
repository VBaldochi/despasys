import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface MobileAuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
  };
  error?: string;
}

export async function validateMobileAuth(request: NextRequest): Promise<MobileAuthResult> {
  try {
    // Extrair headers de autenticação mobile
    const authorization = request.headers.get('Authorization');
    const userId = request.headers.get('X-User-Id');
    const tenantId = request.headers.get('X-Tenant-Id');
    const tenantDomain = request.headers.get('X-Tenant-Domain');

    // Verificar se os headers necessários estão presentes
    if (!authorization || !userId || !tenantId || !tenantDomain) {
      return {
        success: false,
        error: 'Headers de autenticação mobile faltando'
      };
    }

    // Extrair token do header Authorization
    const token = authorization.replace('Bearer ', '');
    
    // Validar que existe um token (qualquer formato por enquanto)
    if (!token || token.length < 10) {
      return {
        success: false,
        error: 'Token mobile inválido'
      };
    }

    // Verificar se o usuário existe no banco de dados
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId: tenantId
      },
      include: {
        tenant: {
          select: {
            id: true,
            domain: true
          }
        }
      }
    });

    if (!user) {
      return {
        success: false,
        error: 'Usuário não encontrado'
      };
    }

    // Verificar se o domínio do tenant corresponde (opcional)
    if (user.tenant?.domain && user.tenant.domain !== tenantDomain) {
      console.warn(`Domínio diferente: esperado ${user.tenant.domain}, recebido ${tenantDomain}`);
    }

    // TODO: Adicionar validação de expiração de token quando necessário
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role,
        tenantId: user.tenantId
      }
    };

  } catch (error) {
    console.error('Erro na validação de autenticação mobile:', error);
    return {
      success: false,
      error: 'Erro interno do servidor'
    };
  }
}
