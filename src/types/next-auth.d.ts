import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role?: string
      tenantId?: string
      tenant?: {
        id: string
        name: string
        domain: string
        plan: string
      }
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role?: string
    tenantId?: string
    tenant?: {
      id: string
      name: string
      domain: string
      plan: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    tenantId?: string
    tenant?: {
      id: string
      name: string
      domain: string
      plan: string
    }
  }
}
