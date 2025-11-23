import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando dados no banco Neon...\n')

  // Check Tenants
  const tenants = await prisma.tenant.findMany()
  console.log(`📊 Tenants: ${tenants.length}`)
  tenants.forEach(t => console.log(`  - ${t.id}: ${t.name} (${t.status})`))
  console.log()

  // Check Users
  const users = await prisma.user.findMany()
  console.log(`👤 Users: ${users.length}`)
  users.forEach(u => console.log(`  - ${u.email} (${u.role})`))
  console.log()

  // Check Customers
  const customers = await prisma.customer.findMany()
  console.log(`👥 Customers: ${customers.length}`)
  console.log()

  // Check new models
  const despesas = await prisma.despesa.findMany()
  console.log(`💰 Despesas: ${despesas.length}`)
  
  const receitas = await prisma.receita.findMany()
  console.log(`💵 Receitas: ${receitas.length}`)
  
  const fluxoCaixa = await prisma.fluxoCaixa.findMany()
  console.log(`📊 Fluxo de Caixa: ${fluxoCaixa.length}`)
  
  const evaluations = await prisma.evaluation.findMany()
  console.log(`🔍 Avaliações: ${evaluations.length}`)
  
  const registrations = await prisma.registration.findMany()
  console.log(`📋 Registros: ${registrations.length}`)
  
  const licensings = await prisma.licensing.findMany()
  console.log(`📝 Licenciamentos: ${licensings.length}`)
  
  const transfers = await prisma.transfer.findMany()
  console.log(`🔄 Transferências: ${transfers.length}`)
  
  const unlocks = await prisma.unlock.findMany()
  console.log(`🔓 Desbloqueios: ${unlocks.length}`)
  
  const reports = await prisma.technicalReport.findMany()
  console.log(`📄 Laudos Técnicos: ${reports.length}`)
  
  console.log('\n✅ Verificação concluída!')
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
