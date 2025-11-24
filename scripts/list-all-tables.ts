import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📊 Listando todas as tabelas do banco Neon...\n')

  try {
    // Buscar tenant para usar como filtro
    const tenant = await prisma.tenant.findFirst()
    const tenantId = tenant?.id

    console.log('🔍 Tabelas e contagem de registros:\n')

    // Listar todas as tabelas com contagem
    const tables = [
      { name: 'Tenants', model: 'tenant', hasTenant: false },
      { name: 'Users', model: 'user', hasTenant: true },
      { name: 'Customers', model: 'customer', hasTenant: true },
      { name: 'Vehicles (Veículos)', model: 'veiculo', hasTenant: true },
      { name: 'Processes (Processos)', model: 'process', hasTenant: true },
      { name: 'Documents (Documentos)', model: 'documento', hasTenant: false },
      { name: 'Timeline Events', model: 'timelineEvent', hasTenant: false },
      { name: 'Transactions (Transações)', model: 'transacao', hasTenant: true },
      { name: 'Assessments (Avaliações)', model: 'avaliacao', hasTenant: true },
      { name: 'Records (Registros)', model: 'registro', hasTenant: true },
      { name: 'Licenses (Licenciamentos)', model: 'licenciamento', hasTenant: true },
      { name: 'Transfers (Transferências)', model: 'transferencia', hasTenant: true },
      { name: 'Unlocks (Desbloqueios)', model: 'desbloqueio', hasTenant: true },
      { name: 'Technical Reports (Laudos)', model: 'laudoTecnico', hasTenant: true },
      { name: 'Expenses (Despesas)', model: 'despesa', hasTenant: true },
      { name: 'Revenues (Receitas)', model: 'receita', hasTenant: true },
      { name: 'Cash Flows (Fluxo Caixa)', model: 'fluxoCaixa', hasTenant: true },
    ]

    const results = []

    for (const table of tables) {
      try {
        let count = 0
        
        if (table.hasTenant && tenantId) {
          count = await (prisma as any)[table.model].count({
            where: { tenantId }
          })
        } else {
          count = await (prisma as any)[table.model].count()
        }

        results.push({
          name: table.name,
          count,
          isEmpty: count === 0
        })

        const status = count === 0 ? '❌ VAZIA' : '✅ COM DADOS'
        const countStr = count.toString().padStart(5, ' ')
        console.log(`${status} | ${countStr} registros | ${table.name}`)
      } catch (error: any) {
        console.log(`⚠️  ERRO  |     ? registros | ${table.name} (${error.message})`)
        results.push({
          name: table.name,
          count: -1,
          isEmpty: true,
          error: error.message
        })
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('\n📈 Resumo:')
    
    const tablesWithData = results.filter(r => r.count > 0).length
    const emptyTables = results.filter(r => r.isEmpty).length
    const totalRecords = results.reduce((sum, r) => sum + (r.count > 0 ? r.count : 0), 0)

    console.log(`  ✅ Tabelas com dados: ${tablesWithData}`)
    console.log(`  ❌ Tabelas vazias: ${emptyTables}`)
    console.log(`  📊 Total de registros: ${totalRecords}`)

    console.log('\n🔴 Tabelas vazias que precisam de atenção:')
    results
      .filter(r => r.isEmpty && !r.error)
      .forEach(r => console.log(`  - ${r.name}`))

    if (results.some(r => r.error)) {
      console.log('\n⚠️  Tabelas com erro (podem não existir no schema):')
      results
        .filter(r => r.error)
        .forEach(r => console.log(`  - ${r.name}: ${r.error}`))
    }

    console.log('\n✅ Verificação concluída!')

  } catch (error) {
    console.error('❌ Erro ao listar tabelas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
