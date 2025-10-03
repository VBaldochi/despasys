import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, tenantDomain } = body

    console.log('🔍 Debug Auth - Dados recebidos:', { email, tenantDomain, hasPassword: !!password })

    // 1. Buscar tenant
    const tenant = await prisma.tenant.findUnique({
      where: { domain: tenantDomain }
    })

    console.log('🔍 Debug Auth - Tenant encontrado:', tenant ? { id: tenant.id, domain: tenant.domain } : 'Não encontrado')

    if (!tenant) {
      return NextResponse.json({
        success: false,
        error: 'Tenant não encontrado',
        step: 'tenant_lookup'
      })
    }

    // 2. Buscar usuário
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        tenantId: tenant.id
      },
      include: {
        tenant: true
      }
    })

    console.log('🔍 Debug Auth - Usuário encontrado:', user ? { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      hasPassword: !!user.password 
    } : 'Não encontrado')

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Usuário não encontrado',
        step: 'user_lookup',
        searchCriteria: { email, tenantId: tenant.id }
      })
    }

    if (!user.password) {
      return NextResponse.json({
        success: false,
        error: 'Usuário sem senha',
        step: 'password_check'
      })
    }

    // 3. Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    console.log('🔍 Debug Auth - Senha válida:', isPasswordValid)

    return NextResponse.json({
      success: isPasswordValid,
      error: isPasswordValid ? null : 'Senha inválida',
      step: isPasswordValid ? 'success' : 'password_validation',
      user: isPasswordValid ? {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      } : null
    })

  } catch (error) {
    console.error('🔍 Debug Auth - Erro:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      step: 'exception'
    })
  }
}
