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
    
    // Validar formato do token mobile
    if (!token.startsWith('mobile_')) {
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

    // Verificar se o domínio do tenant corresponde
    if (user.tenant?.domain !== tenantDomain) {
      return {
        success: false,
        error: 'Domínio do tenant não corresponde'
      };
    }

    // Extrair timestamp do token para validar expiração (opcional)
    const tokenParts = token.split('_');
    if (tokenParts.length >= 4) {
      const timestamp = parseInt(tokenParts[3]);
      const tokenAge = Date.now() - timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 horas
      
      if (tokenAge > maxAge) {
        return {
          success: false,
          error: 'Token expirado'
        };
      }
    }

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
