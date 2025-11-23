const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando tenant padrão...')

  // Check if default tenant exists
  const existingTenant = await prisma.tenant.findUnique({
    where: { id: 'tenant-default' }
  })

  if (existingTenant) {
    console.log('✅ Tenant padrão já existe!')
    console.log('Nome:', existingTenant.name)
    console.log('Status:', existingTenant.status)
    return
  }

  console.log('📝 Criando tenant padrão...')

  const tenant = await prisma.tenant.create({
    data: {
      id: 'tenant-default',
      name: 'DespaSys - Sistema Principal',
      domain: 'default.despasys.com',
      plan: 'ESCRITORIO_GRANDE',
      status: 'ACTIVE',
      maxUsers: 100,
      maxCustomers: 10000,
      maxProcesses: 50000,
      settings: {
        theme: 'default',
        currency: 'BRL',
        timezone: 'America/Sao_Paulo'
      }
    }
  })

  console.log('✅ Tenant padrão criado com sucesso!')
  console.log('ID:', tenant.id)
  console.log('Nome:', tenant.name)
  console.log('Plano:', tenant.plan)
  console.log('Status:', tenant.status)
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
