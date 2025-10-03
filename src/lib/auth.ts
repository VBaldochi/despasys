import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import * as bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantDomain: { label: 'Tenant', type: 'text' }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        console.log('🔐 Authorize - Início:', { 
          hasCredentials: !!credentials,
          email: credentials?.email,
          tenantDomain: credentials?.tenantDomain
        })

        if (!credentials?.email || !credentials?.password || !credentials?.tenantDomain) {
          console.log('🔐 Authorize - Credenciais incompletas')
          return null
        }

        try {
          // Buscar tenant primeiro
          console.log('🔐 Authorize - Buscando tenant:', credentials.tenantDomain)
          const tenant = await (prisma as any).tenant.findUnique({
            where: { domain: credentials.tenantDomain }
          })

          if (!tenant) {
            console.error('🔐 Authorize - Tenant não encontrado:', credentials.tenantDomain)
            return null
          }

          console.log('🔐 Authorize - Tenant encontrado:', { id: tenant.id, name: tenant.name, status: tenant.status })

          if (tenant.status !== 'ACTIVE' && tenant.status !== 'TRIAL') {
            console.error('🔐 Authorize - Tenant inativo:', tenant.status)
            return null
          }

          // Buscar usuário do tenant
          console.log('🔐 Authorize - Buscando usuário:', credentials.email)
          const user = await (prisma as any).user.findFirst({
            where: {
              email: credentials.email,
              tenantId: tenant.id,
              status: 'ATIVO'
            },
            include: {
              tenant: {
                select: {
                  id: true,
                  name: true,
                  domain: true,
                  plan: true
                }
              }
            }
          })

          if (!user) {
            console.error('🔐 Authorize - Usuário não encontrado:', credentials.email)
            return null
          }

          console.log('🔐 Authorize - Usuário encontrado:', { id: user.id, email: user.email, role: user.role })

          // Verificar senha
          if (!user.password) {
            console.error('🔐 Authorize - Usuário sem senha')
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.error('🔐 Authorize - Senha inválida')
            return null
          }

          console.log('🔐 Authorize - Autenticação bem-sucedida, retornando dados do usuário')

          // Retornar dados do usuário para a sessão
          const userResult = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: (user as any).tenantId,
            tenant: (user as any).tenant
          }

          console.log('🔐 Authorize - Dados finais:', userResult)
          return userResult as any
        } catch (error) {
          console.error('🔐 Authorize - Erro na autenticação:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
    updateAge: 60 * 60, // Atualizar a cada 1 hora
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 horas
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      console.log('🔑 JWT Callback - Início:', { hasToken: !!token, hasUser: !!user })
      
      if (user) {
        console.log('🔑 JWT Callback - User dados recebidos:', user)
        token.role = user.role
        token.tenantId = user.tenantId
        token.tenant = user.tenant
        token.loginTime = Date.now()
        console.log('🔑 JWT Callback - Token sendo criado:', token)
      } else {
        console.log('🔑 JWT Callback - Token existente sendo usado:', token)
      }
      
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log('📱 Session Callback - Início:', { hasSession: !!session, hasToken: !!token })
      console.log('📱 Session Callback - Token recebido:', token)
      
      if (token && session?.user) {
        session.user.id = token.sub || ''
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string
        session.user.tenant = token.tenant as any
        ;(session as any).loginTime = token.loginTime
        
        console.log('📱 Session Callback - Sessão final criada:', session)
      } else {
        console.log('📱 Session Callback - Erro: Token ou session.user não encontrado')
      }
      
      return session
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log('🔄 Redirect Callback - Início:', { url, baseUrl })
      
      // Forçar uso do baseUrl correto em produção
      const productionBaseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL || baseUrl
        : baseUrl
      
      console.log('🔄 Redirect Callback - Base URL final:', productionBaseUrl)
      
      // Se for callback após login bem-sucedido, redirecionar para dashboard
      if (url.includes('/api/auth/callback') || url.includes('/api/auth/signin')) {
        const dashboardUrl = `${productionBaseUrl}/dashboard`
        console.log('🔄 Redirect Callback - Redirecionando para dashboard:', dashboardUrl)
        return dashboardUrl
      }
      
      // Se for login, redirecionar para dashboard
      if (url.includes('/auth/login') || url === productionBaseUrl || url === baseUrl) {
        const dashboardUrl = `${productionBaseUrl}/dashboard`
        console.log('🔄 Redirect Callback - Login redirect para dashboard:', dashboardUrl)
        return dashboardUrl
      }
      
      // Se a URL for relativa, adicionar baseUrl
      if (url.startsWith('/')) {
        const fullUrl = `${productionBaseUrl}${url}`
        console.log('🔄 Redirect Callback - URL relativa convertida:', fullUrl)
        return fullUrl
      }
      
      // Se a URL for do mesmo domínio, permitir
      try {
        const urlObj = new URL(url)
        const baseUrlObj = new URL(productionBaseUrl)
        if (urlObj.origin === baseUrlObj.origin) {
          console.log('🔄 Redirect Callback - URL do mesmo domínio permitida:', url)
          return url
        }
      } catch (e) {
        console.error('🔄 Redirect Callback - Erro ao processar URLs:', e)
      }
      
      console.log('🔄 Redirect Callback - Fallback para base URL:', productionBaseUrl)
      return productionBaseUrl
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  debug: true, // Debug temporário para investigar problema
  logger: {
    error(code: any, metadata: any) {
      console.error('NextAuth Error:', code, metadata)
    },
    warn(code: any) {
      console.warn('NextAuth Warning:', code)
    },
    debug(code: any, metadata: any) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', code, metadata)
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}
