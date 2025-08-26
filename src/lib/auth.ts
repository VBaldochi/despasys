import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

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
        if (!credentials?.email || !credentials?.password || !credentials?.tenantDomain) {
          return null
        }

        try {
          // Buscar tenant primeiro
          const tenant = await (prisma as any).tenant.findUnique({
            where: { domain: credentials.tenantDomain }
          })

          if (!tenant) {
            console.error('Tenant não encontrado:', credentials.tenantDomain)
            return null
          }

          if (tenant.status !== 'ACTIVE' && tenant.status !== 'TRIAL') {
            console.error('Tenant inativo:', tenant.status)
            return null
          }

          // Buscar usuário do tenant
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
            console.error('Usuário não encontrado:', credentials.email)
            return null
          }

          // Verificar senha
          if (!user.password) {
            console.error('Usuário sem senha')
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.error('Senha inválida')
            return null
          }

          // Retornar dados do usuário para a sessão
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: (user as any).tenantId,
            tenant: (user as any).tenant
          } as any
        } catch (error) {
          console.error('Erro na autenticação:', error)
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
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT Callback - User:', user)
        token.role = user.role
        token.tenantId = user.tenantId
        token.tenant = user.tenant
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        console.log('Session Callback - Token:', token)
        session.user.id = token.sub || ''
        session.user.role = token.role as string
        session.user.tenantId = token.tenantId as string
        session.user.tenant = token.tenant as any
      }
      console.log('Session Callback - Final Session:', session)
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}
