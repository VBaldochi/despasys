import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Populando banco de dados com processos de teste...\n')

  try {
    // Buscar tenant e usuário
    const tenant = await prisma.tenant.findFirst()
    if (!tenant) {
      console.error('❌ Nenhum tenant encontrado!')
      return
    }

    const user = await prisma.user.findFirst({
      where: { tenantId: tenant.id }
    })
    if (!user) {
      console.error('❌ Nenhum usuário encontrado!')
      return
    }

    // Buscar ou criar clientes
    let customers = await prisma.customer.findMany({
      where: { tenantId: tenant.id },
      take: 10
    })

    if (customers.length === 0) {
      console.log('📝 Criando clientes de teste...')
      
      const newCustomers = []
      for (let i = 1; i <= 10; i++) {
        const customer = await prisma.customer.create({
          data: {
            tenantId: tenant.id,
            name: `Cliente Teste ${i}`,
            email: `cliente${i}@teste.com`,
            phone: `(16) 99999-${i.toString().padStart(4, '0')}`,
            cpfCnpj: `${i.toString().padStart(11, '0')}`,
            tipo: i % 2 === 0 ? 'PESSOA_JURIDICA' : 'PESSOA_FISICA',
            status: 'ATIVO'
          }
        })
        newCustomers.push(customer)
      }
      customers = newCustomers
      console.log(`✅ ${customers.length} clientes criados\n`)
    }

    // Criar veículos para alguns clientes
    console.log('🚗 Criando veículos de teste...')
    const veiculos = []
    for (let i = 0; i < Math.min(5, customers.length); i++) {
      const anoFabricacao = 2020 + i;
      const placa = `ABC${i}${i}${i}${i}`;
      let veiculo = await prisma.veiculo.findFirst({
        where: { tenantId: tenant.id, placa }
      });
      if (!veiculo) {
        veiculo = await prisma.veiculo.create({
          data: {
            tenantId: tenant.id,
            customerId: customers[i].id,
            placa,
            marca: ['FIAT', 'VW', 'CHEVROLET', 'FORD', 'HONDA'][i],
            modelo: ['UNO', 'GOL', 'ONIX', 'KA', 'CIVIC'][i],
            ano: anoFabricacao,
            anoModelo: anoFabricacao + 1,
            cor: ['BRANCO', 'PRATA', 'PRETO', 'VERMELHO', 'AZUL'][i],
            combustivel: ['GASOLINA', 'FLEX', 'FLEX', 'GASOLINA', 'FLEX'][i],
            chassi: `9BWZZZ377VT${i.toString().padStart(6, '0')}`,
            renavam: `${(100000000 + i).toString()}`,
            categoria: 'B'
          }
        });
      }
      veiculos.push(veiculo);
    }
    console.log(`✅ ${veiculos.length} veículos criados\n`)

    // Criar processos de teste
    console.log('📋 Criando processos de teste...')
    
    const tiposServico = [
      'LICENCIAMENTO',
      'TRANSFERENCIA',
      'PRIMEIRO_EMPLACAMENTO',
      'SEGUNDA_VIA',
      'DESBLOQUEIO'
    ]

    const statusList = [
      'AGUARDANDO_DOCUMENTOS',
      'DOCUMENTOS_RECEBIDOS',
      'EM_ANALISE',
      'AGUARDANDO_PAGAMENTO',
      'PAGAMENTO_CONFIRMADO',
      'EM_PROCESSAMENTO',
      'FINALIZADO'
    ]

    let processosCreated = 0

    for (let i = 0; i < 20; i++) {
      const customer = customers[i % customers.length]
      const veiculo = i < veiculos.length ? veiculos[i] : null
      const tipoServico = tiposServico[i % tiposServico.length]
      const status = statusList[i % statusList.length]

      const numero = `PROC-${(i + 1).toString().padStart(3, '0')}`

      try {
        await prisma.process.create({
          data: {
            tenantId: tenant.id,
            numero,
            customerId: customer.id,
            veiculoId: veiculo?.id || null,
            responsavelId: user.id,
            tipoServico,
            titulo: getTituloServico(tipoServico),
            descricao: `Processo de ${getTituloServico(tipoServico).toLowerCase()} para ${customer.name}`,
            status,
            prioridade: i % 3 === 0 ? 'ALTA' : i % 3 === 1 ? 'MEDIA' : 'BAIXA',
            valorTotal: 250 + (i * 50),
            valorTaxas: 150 + (i * 20),
            valorServico: 100 + (i * 30),
            statusPagamento: status === 'FINALIZADO' ? 'PAGO' : status.includes('PAGAMENTO') ? 'PENDENTE' : 'PENDENTE',
            dataInicio: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // Subtrair dias
            prazoLegal: new Date(Date.now() + ((30 - i) * 24 * 60 * 60 * 1000)), // Adicionar dias
            observacoes: `Observações do processo ${numero}`
          }
        })
        processosCreated++
      } catch (error: any) {
        if (error.code === 'P2002') {
          console.log(`⚠️  Processo ${numero} já existe, pulando...`)
        } else {
          console.error(`❌ Erro ao criar processo ${numero}:`, error.message)
        }
      }
    }

    console.log(`✅ ${processosCreated} processos criados\n`)

    // Criar transferências de teste
    console.log('🔄 Criando transferências de teste...')
    const transferStatusList = [
      'PENDING_DOCS',
      'DOCS_RECEIVED',
      'WAITING_PAYMENT',
      'PAYMENT_CONFIRMED',
      'DETRAN_PROCESSING',
      'COMPLETED',
      'CANCELLED'
    ]
    let transfersCreated = 0
    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length]
      const veiculo = i < veiculos.length ? veiculos[i] : veiculos[i % veiculos.length]
      const status = transferStatusList[i % transferStatusList.length] as any
      const transferValue = 400 + (i * 50)
      const serviceValue = 100 + (i * 20)
      try {
        await prisma.transfer.create({
          data: {
            tenantId: tenant.id,
            buyerName: customer.name,
            buyerCpf: customer.cpfCnpj,
            buyerPhone: customer.phone,
            sellerName: `Vendedor ${i+1}`,
            sellerCpf: `${(10000000000 + i).toString()}`,
            sellerPhone: `(11) 90000-00${i.toString().padStart(2, '0')}`,
            vehiclePlate: veiculo.placa,
            vehicleBrand: veiculo.marca,
            vehicleModel: veiculo.modelo,
            vehicleYear: veiculo.ano.toString(),
            renavam: veiculo.renavam || '',
            transferValue,
            serviceValue,
            status: status,
            requestedDate: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)),
            completedDate: status === 'COMPLETED' ? new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) : null,
            observations: `Observação da transferência ${i+1}`
          }
        })
        transfersCreated++
      } catch (error) {
        console.error(`❌ Erro ao criar transferência ${i+1}:`, error)
      }
    }
    console.log(`✅ ${transfersCreated} transferências criadas\n`)

    // Estatísticas finais
    const totalCustomers = await prisma.customer.count({ where: { tenantId: tenant.id } })
    const totalVeiculos = await prisma.veiculo.count({ where: { tenantId: tenant.id } })
    const totalProcesses = await prisma.process.count({ where: { tenantId: tenant.id } })
    const totalTransfers = await prisma.transfer.count({ where: { tenantId: tenant.id } })

    console.log('📊 Estatísticas Finais:')
    console.log(`  - Clientes: ${totalCustomers}`)
    console.log(`  - Veículos: ${totalVeiculos}`)
    console.log(`  - Processos: ${totalProcesses}`)
    console.log(`  - Transferências: ${totalTransfers}`)
    console.log('\n✅ Banco de dados populado com sucesso!')

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error)
  } finally {
    await prisma.$disconnect()
  }
}

function getTituloServico(tipo: string): string {
  const titulos: Record<string, string> = {
    'LICENCIAMENTO': 'Licenciamento',
    'TRANSFERENCIA': 'Transferência de Propriedade',
    'PRIMEIRO_EMPLACAMENTO': 'Primeiro Emplacamento',
    'SEGUNDA_VIA': 'Segunda Via de Documento',
    'DESBLOQUEIO': 'Desbloqueio de Veículo',
    'ALTERACAO_CARACTERISTICAS': 'Alteração de Características',
    'BAIXA_VEICULO': 'Baixa de Veículo',
    'INCLUSAO_ALIENACAO': 'Inclusão de Alienação',
    'EXCLUSAO_ALIENACAO': 'Exclusão de Alienação',
    'MUDANCA_MUNICIPIO': 'Mudança de Município',
    'MUDANCA_UF': 'Mudança de UF',
    'REGULARIZACAO_MULTAS': 'Regularização de Multas'
  }
  return titulos[tipo] || tipo
}

main()
