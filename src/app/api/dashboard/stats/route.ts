import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, executeWithRetry } from '@/lib/prisma'
import { cache, getCacheKey } from '@/lib/cache'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.tenantId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const cacheKey = getCacheKey('dashboard-stats', tenantId)

    // Verificar cache primeiro
    const cachedStats = cache.get(cacheKey)
    if (cachedStats) {
      return NextResponse.json(cachedStats)
    }

    // Buscar estatísticas em paralelo
    const [
      customersCount,
      processesCount,
      vehiclesCount,
      usersCount
    ] = await executeWithRetry(async () => {
      return await Promise.all([
        (prisma as any).customer.count({ where: { tenantId } }),
        (prisma as any).process.count({ where: { tenantId } }),
        (prisma as any).veiculo.count({ where: { tenantId } }),
        (prisma as any).user.count({ where: { tenantId } })
      ])
    })

    const stats = {
      totalClientes: customersCount,
      processosAtivos: processesCount,
      veiculos: vehiclesCount,
      usuarios: usersCount
    }

    // Cache por 2 minutos
    cache.set(cacheKey, stats, 1000 * 60 * 2)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
