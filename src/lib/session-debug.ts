// Utilitário para debug e limpeza de sessões
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { prisma } from './prisma'

export async function debugSession(req: any, res: any) {
  try {
    const session = await getServerSession(req, res, authOptions)
    console.log('🔍 Debug Session:', {
      hasSession: !!session,
      user: session?.user,
      expires: session?.expires,
      userAgent: req?.headers?.['user-agent'],
      cookies: Object.keys(req?.cookies || {}),
      timestamp: new Date().toISOString()
    })
    return session
  } catch (error) {
    console.error('❌ Error debugging session:', error)
    return null
  }
}

export async function cleanupStaleProblems() {
  try {
    // Limpar sessões expiradas do banco (se usando adapter)
    const expiredSessions = await prisma.session?.deleteMany({
      where: {
        expires: {
          lt: new Date()
        }
      }
    }).catch(() => null)

    console.log('🧹 Cleaned up expired sessions:', expiredSessions?.count || 0)
    
    return { success: true, cleaned: expiredSessions?.count || 0 }
  } catch (error) {
    console.error('❌ Error cleaning up sessions:', error)
    return { success: false, error }
  }
}

export function getSessionDebugInfo(session: any) {
  return {
    isValid: !!session,
    hasUser: !!session?.user,
    hasToken: !!session?.user?.id,
    hasTenant: !!session?.user?.tenantId,
    userRole: session?.user?.role,
    tenantDomain: session?.user?.tenant?.domain,
    expires: session?.expires,
    loginTime: (session as any)?.loginTime,
    timeSinceLogin: (session as any)?.loginTime 
      ? Date.now() - (session as any).loginTime 
      : null
  }
}
