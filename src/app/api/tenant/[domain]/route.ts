import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain } = await params

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain é obrigatório' },
        { status: 400 }
      )
    }

    const tenant = await prisma.tenant.findUnique({
      where: { domain },
      select: {
        id: true,
        name: true,
        domain: true,
        status: true,
        plan: true,
        trialEndsAt: true,
        createdAt: true
      }
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error('Erro ao buscar tenant:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
