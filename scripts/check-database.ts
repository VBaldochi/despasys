import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando dados no banco Neon...\n')

  // Listar todas as tabelas principais do schema
  const tables = [
    { label: '📊 Tenants', fn: () => prisma.tenant.count() },
    { label: '👤 Users', fn: () => prisma.user.count() },
    { label: '👥 Customers', fn: () => prisma.customer.count() },
    { label: '🚗 Veículos', fn: () => prisma.veiculo.count() },
    { label: '📄 Processos', fn: () => prisma.process.count() },
    { label: '📑 Documentos', fn: () => prisma.documento.count() },
    { label: '🕒 Timeline Events', fn: () => prisma.timelineEvent.count() },
    { label: '💸 Transações', fn: () => prisma.transacao.count() },
    { label: '💬 Quotes', fn: () => prisma.quote.count() },
    { label: '📅 Appointments', fn: () => prisma.appointment.count() },
    { label: '💰 Despesas', fn: () => prisma.despesa.count() },
    { label: '💵 Receitas', fn: () => prisma.receita.count() },
    { label: '📊 Fluxo de Caixa', fn: () => prisma.fluxoCaixa.count() },
    { label: '🔍 Avaliações', fn: () => prisma.evaluation.count() },
    { label: '📋 Registros', fn: () => prisma.registration.count() },
    { label: '📝 Licenciamentos', fn: () => prisma.licensing.count() },
    { label: '🔄 Transferências', fn: () => prisma.transfer.count() },
    { label: '🔓 Desbloqueios', fn: () => prisma.unlock.count() },
    { label: '📄 Laudos Técnicos', fn: () => prisma.technicalReport.count() },
    { label: '🔑 Accounts', fn: () => prisma.account.count() },
    { label: '🔑 Sessions', fn: () => prisma.session.count() },
    { label: '🔑 VerificationTokens', fn: () => prisma.verificationToken.count() },
  ];

  for (const t of tables) {
    try {
      const count = await t.fn();
      console.log(`${t.label}: ${count}`);
    } catch (e) {
      console.log(`${t.label}: erro ao consultar`);
    }
  }

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
