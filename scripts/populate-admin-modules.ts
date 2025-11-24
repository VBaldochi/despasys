
import { PrismaClient, UnlockType, UnlockStatus, TransferStatus, LicensingStatus, RegistrationStatus, EvaluationType, EvaluationStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Populando módulos administrativos (Unlock, Transfer, Licensing, Registration, Quote, Evaluation, Appointment)...\n')

  // Buscar tenant, user e clientes
  const tenant = await prisma.tenant.findFirst()
  if (!tenant) {
    console.error('❌ Nenhum tenant encontrado!')
    return
  }
  const user = await prisma.user.findFirst({ where: { tenantId: tenant.id } })
  if (!user) {
    console.error('❌ Nenhum usuário encontrado!')
    return
  }
  const customers = await prisma.customer.findMany({ where: { tenantId: tenant.id }, take: 20 })
  if (customers.length === 0) {
    console.error('❌ Nenhum cliente encontrado!')
    return
  }

  // ==================== UNLOCKS ====================
  console.log('🔓 Criando desbloqueios...')
  for (let i = 0; i < 10; i++) {
    const customer = customers[i % customers.length]
    await prisma.unlock.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        customerName: customer.name,
        customerCpf: customer.cpfCnpj,
        customerPhone: customer.phone,
        vehiclePlate: `ABC${1000 + i}`,
        vehicleBrand: ['VW', 'GM', 'Ford', 'Fiat'][i % 4],
        vehicleModel: ['Gol', 'Onix', 'Ka', 'Uno'][i % 4],
        vehicleYear: `${2015 + (i % 7)}`,
        renavam: `RENAVAM${i + 1}`,
        unlockType: [UnlockType.JUDICIAL, UnlockType.MULTA, UnlockType.ROUBO_FURTO, UnlockType.RESTRICAO_AMBIENTAL, UnlockType.RESTRICAO_JUDICIAL, UnlockType.OUTROS][i % 6],
        blockReason: ['Multa', 'Judicial', 'Roubo', 'Ambiental'][i % 4],
        blockDate: new Date(Date.now() - (i + 10) * 86400000),
        blockEntity: ['DETRAN', 'JUIZADO', 'POLICIA'][i % 3],
        unlockValue: 200 + i * 10,
        serviceValue: 100 + i * 5,
        totalValue: 300 + i * 15,
        status: [UnlockStatus.ANALYSIS, UnlockStatus.PENDING_DOCS, UnlockStatus.PROCESSING, UnlockStatus.DETRAN_PROCESSING, UnlockStatus.COMPLETED, UnlockStatus.CANCELLED][i % 6],
        requestedDate: new Date(Date.now() - (i + 5) * 86400000),
        completedDate: i % 3 === 0 ? new Date(Date.now() - i * 86400000) : null,
        observations: `Observação desbloqueio ${i + 1}`
      }
    })
  }

  // ==================== TRANSFERS ====================
  console.log('🔄 Criando transferências...')
  for (let i = 0; i < 10; i++) {
    const buyer = customers[i % customers.length]
    const seller = customers[(i + 1) % customers.length]
    await prisma.transfer.create({
      data: {
        tenantId: tenant.id,
        buyerId: buyer.id,
        buyerName: buyer.name,
        buyerCpf: buyer.cpfCnpj,
        buyerPhone: buyer.phone,
        buyerAddress: buyer.endereco || 'Rua Exemplo, 123',
        sellerId: seller.id,
        sellerName: seller.name,
        sellerCpf: seller.cpfCnpj,
        sellerPhone: seller.phone,
        vehiclePlate: `XYZ${2000 + i}`,
        vehicleBrand: ['VW', 'GM', 'Ford', 'Fiat'][i % 4],
        vehicleModel: ['Gol', 'Onix', 'Ka', 'Uno'][i % 4],
        vehicleYear: `${2012 + (i % 10)}`,
        chassisNumber: `CHASSI${i + 1}`,
        renavam: `RENAVAM${i + 11}`,
        transferValue: 500 + i * 50,
        serviceValue: 150 + i * 10,
        status: [TransferStatus.PENDING_DOCS, TransferStatus.DOCS_RECEIVED, TransferStatus.WAITING_PAYMENT, TransferStatus.PAYMENT_CONFIRMED, TransferStatus.DETRAN_PROCESSING, TransferStatus.COMPLETED, TransferStatus.CANCELLED][i % 7],
        requestedDate: new Date(Date.now() - (i + 7) * 86400000),
        completedDate: i % 4 === 0 ? new Date(Date.now() - i * 86400000) : null,
        observations: `Observação transferência ${i + 1}`
      }
    })
  }

  // ==================== LICENSINGS ====================
  console.log('📄 Criando licenciamentos...')
  for (let i = 0; i < 10; i++) {
    const customer = customers[i % customers.length]
    await prisma.licensing.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        customerName: customer.name,
        vehiclePlate: `LIC${3000 + i}`,
        vehicleBrand: ['VW', 'GM', 'Ford', 'Fiat'][i % 4],
        vehicleModel: ['Gol', 'Onix', 'Ka', 'Uno'][i % 4],
        vehicleYear: `${2010 + (i % 12)}`,
        renavam: `RENAVAM${i + 21}`,
        exercicio: `${2023 - (i % 3)}`,
        expirationDate: new Date(Date.now() + (i + 10) * 86400000),
        paymentDate: i % 2 === 0 ? new Date(Date.now() - i * 86400000) : null,
        status: [LicensingStatus.PENDING, LicensingStatus.DOCS_SENT, LicensingStatus.PROCESSING, LicensingStatus.COMPLETED, LicensingStatus.OVERDUE, LicensingStatus.CANCELLED][i % 6],
        taxValue: 120 + i * 10,
        serviceValue: 80 + i * 5,
        totalValue: 200 + i * 15,
        paymentMethod: ['PIX', 'CARTAO', 'DINHEIRO', 'BOLETO'][i % 4],
        observations: `Observação licenciamento ${i + 1}`
      }
    })
  }

  // ==================== REGISTRATIONS ====================
  console.log('📝 Criando registros...')
  for (let i = 0; i < 10; i++) {
    const customer = customers[i % customers.length]
    await prisma.registration.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        customerName: customer.name,
        customerCpf: customer.cpfCnpj,
        vehicleBrand: ['VW', 'GM', 'Ford', 'Fiat'][i % 4],
        vehicleModel: ['Gol', 'Onix', 'Ka', 'Uno'][i % 4],
        vehicleYear: `${2018 + (i % 5)}`,
        vehicleColor: ['Prata', 'Preto', 'Branco', 'Vermelho'][i % 4],
        vehicleType: ['Passeio', 'SUV', 'Utilitário'][i % 3],
        chassisNumber: `CHASSI${i + 21}`,
        isZeroKm: i % 2 === 0,
        invoice: i % 2 === 0 ? `NF${i + 1}` : null,
        invoiceDate: i % 2 === 0 ? new Date(Date.now() - (i + 2) * 86400000) : null,
        dealership: i % 2 === 0 ? 'Concessionária Exemplo' : null,
        status: [RegistrationStatus.PENDING_DOCS, RegistrationStatus.DOCS_RECEIVED, RegistrationStatus.IN_ANALYSIS, RegistrationStatus.DETRAN_PROCESSING, RegistrationStatus.COMPLETED, RegistrationStatus.CANCELLED][i % 6],
        requestedDate: new Date(Date.now() - (i + 3) * 86400000),
        completedDate: i % 3 === 0 ? new Date(Date.now() - i * 86400000) : null,
        observations: `Observação registro ${i + 1}`
      }
    })
  }

  // ==================== QUOTES ====================
  console.log('💬 Criando cotações...')
  for (let i = 0; i < 10; i++) {
    const customer = customers[i % customers.length]
    await prisma.quote.create({
      data: {
        customerId: customer.id,
        serviceType: ['LICENCIAMENTO', 'TRANSFERENCIA', 'DESBLOQUEIO', 'REGISTRO'][i % 4],
        vehicleType: ['Passeio', 'SUV', 'Utilitário'][i % 3],
        totalPrice: 400 + i * 30,
        status: ['PENDING', 'APPROVED', 'REJECTED'][i % 3],
        validUntil: new Date(Date.now() + (i + 5) * 86400000),
        items: [{
          descricao: `Serviço ${i + 1}`,
          valor: 200 + i * 10
        }],
      }
    })
  }

  // ==================== EVALUATIONS ====================
  console.log('🧐 Criando avaliações...')
  for (let i = 0; i < 10; i++) {
    const customer = customers[i % customers.length]
    await prisma.evaluation.create({
      data: {
        tenantId: tenant.id,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        vehicleBrand: ['VW', 'GM', 'Ford', 'Fiat'][i % 4],
        vehicleModel: ['Gol', 'Onix', 'Ka', 'Uno'][i % 4],
        vehicleYear: `${2016 + (i % 6)}`,
        vehiclePlate: `EVAL${4000 + i}`,
        evaluationType: [EvaluationType.COMPLETA, EvaluationType.BASICA, EvaluationType.LAUDO, EvaluationType.PERICIA][i % 4],
        purpose: ['COMPRA', 'VENDA', 'SEGURO', 'FINANCIAMENTO'][i % 4],
        requestedDate: new Date(Date.now() - (i + 4) * 86400000),
        scheduledDate: i % 2 === 0 ? new Date(Date.now() - (i + 2) * 86400000) : null,
        completedDate: i % 3 === 0 ? new Date(Date.now() - i * 86400000) : null,
        estimatedValue: 25000 + i * 1000,
        finalValue: i % 2 === 0 ? 26000 + i * 900 : null,
        status: [EvaluationStatus.REQUESTED, EvaluationStatus.SCHEDULED, EvaluationStatus.IN_PROGRESS, EvaluationStatus.COMPLETED, EvaluationStatus.CANCELLED][i % 5],
        location: ['SP', 'RJ', 'MG', 'PR'][i % 4],
        observations: `Observação avaliação ${i + 1}`
      }
    })
  }

  // ==================== APPOINTMENTS ====================
  console.log('📅 Criando agendamentos...')
  for (let i = 0; i < 10; i++) {
    const customer = customers[i % customers.length]
    const startTime = new Date(Date.now() + (i + 1) * 86400000)
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000)
    await prisma.appointment.create({
      data: {
        customerId: customer.id,
        title: `Agendamento ${i + 1}`,
        description: `Descrição do agendamento ${i + 1}`,
        serviceType: ['LICENCIAMENTO', 'TRANSFERENCIA', 'DESBLOQUEIO', 'REGISTRO'][i % 4],
        appointmentType: ['PRESENCIAL', 'ONLINE'][i % 2],
        startTime,
        endTime,
        status: ['SCHEDULED', 'COMPLETED', 'CANCELLED'][i % 3],
        notes: `Notas do agendamento ${i + 1}`
      }
    })
  }

  console.log('\n✅ Módulos administrativos populados com sucesso!')
}

main().catch(e => {
  console.error('Erro ao popular módulos administrativos:', e)
}).finally(async () => {
  await prisma.$disconnect()
})
