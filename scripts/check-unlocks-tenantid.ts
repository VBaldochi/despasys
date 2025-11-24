import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const unlocks = await prisma.unlock.findMany({
    select: { id: true, tenantId: true }
  })
  const tenantIds = Array.from(new Set(unlocks.map(u => u.tenantId)))
  console.log('TenantIds encontrados na tabela unlocks:', tenantIds)
  console.log('Total de registros:', unlocks.length)
  if (unlocks.length > 0) {
    console.log('Exemplo de registro:', unlocks[0])
  }
}

main().finally(() => prisma.$disconnect())
