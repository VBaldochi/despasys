import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Populando dados do mês atual...\n')

  try {
    // Get tenant
    const tenant = await prisma.tenant.findFirst({
      orderBy: { createdAt: 'asc' }
    })

    if (!tenant) {
      console.error('❌ Tenant não encontrado')
      return
    }

    console.log(`✅ Tenant encontrado: ${tenant.id}\n`)

    // Get some customers
    const customers = await prisma.customer.findMany({
      where: { tenantId: tenant.id },
      take: 10
    })

    if (customers.length === 0) {
      console.error('❌ Nenhum cliente encontrado')
      return
    }

    // Get current month dates
    const hoje = new Date()
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)

    // ==================== RECEITAS DO MÊS ATUAL ====================
    console.log('💵 Criando receitas do mês atual...')
    let receitasCount = 0

    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length]
      const diaEmissao = Math.floor(Math.random() * 20) + 1
      const dataEmissao = new Date(hoje.getFullYear(), hoje.getMonth(), diaEmissao)
      const dataVencimento = new Date(dataEmissao)
      dataVencimento.setDate(dataVencimento.getDate() + 15)
      
      const isPago = i % 3 === 0
      const valor = 500 + (Math.random() * 2000)

      try {
        await prisma.receita.create({
          data: {
            tenantId: tenant.id,
            numero: `REC-${Date.now()}-${i}`,
            customerId: customer.id,
            customerName: customer.name,
            servico: ['Licenciamento', 'Transferência', 'Emplacamento', 'Segunda Via', 'Desbloqueio'][i % 5],
            descricao: `Serviço ${i + 1} - Mês atual`,
            valor: Math.round(valor * 100) / 100,
            dataEmissao,
            dataVencimento,
            dataPagamento: isPago ? new Date(dataEmissao.getTime() + (7 * 24 * 60 * 60 * 1000)) : null,
            status: isPago ? 'PAGO' : (dataVencimento < hoje ? 'VENCIDO' : 'PENDENTE'),
            metodoPagamento: isPago ? ['PIX', 'CARTAO', 'DINHEIRO', 'BOLETO'][i % 4] : null
          }
        })
        receitasCount++
      } catch (error: any) {
        if (!error.message.includes('Unique constraint')) {
          console.error(`Erro na receita ${i}:`, error.message)
        }
      }
    }
    console.log(`✅ ${receitasCount} receitas do mês criadas\n`)

    // ==================== DESPESAS DO MÊS ATUAL ====================
    console.log('💸 Criando despesas do mês atual...')
    let despesasCount = 0

    const fornecedores = ['Detran', 'Cartório', 'Vistoriadora', 'Correios', 'Despachante Parceiro']
    const categorias = ['Taxas', 'Serviços', 'Material', 'Transporte', 'Documentação']

    for (let i = 0; i < 20; i++) {
      const diaEmissao = Math.floor(Math.random() * 20) + 1
      const dataEmissao = new Date(hoje.getFullYear(), hoje.getMonth(), diaEmissao)
      const dataVencimento = new Date(dataEmissao)
      dataVencimento.setDate(dataVencimento.getDate() + 10)
      
      const isPago = i % 4 === 0
      const valor = 100 + (Math.random() * 1000)

      try {
        await prisma.despesa.create({
          data: {
            tenantId: tenant.id,
            fornecedor: fornecedores[i % fornecedores.length],
            descricao: `Despesa ${i + 1} - ${categorias[i % categorias.length]}`,
            categoria: categorias[i % categorias.length],
            tipoDespesa: ['FIXA', 'VARIAVEL', 'OPERACIONAL', 'IMPOSTO'][i % 4],
            valor: Math.round(valor * 100) / 100,
            dataEmissao,
            dataVencimento,
            dataPagamento: isPago ? new Date(dataEmissao.getTime() + (5 * 24 * 60 * 60 * 1000)) : null,
            status: isPago ? 'PAGO' : (dataVencimento < hoje ? 'VENCIDO' : 'PENDENTE'),
            recorrente: i % 5 === 0,
            periodicidade: i % 5 === 0 ? 'MENSAL' : null,
            formaPagamento: isPago ? ['PIX', 'CARTAO', 'DINHEIRO', 'BOLETO'][i % 4] : ''
          }
        })
        despesasCount++
      } catch (error: any) {
        console.error(`Erro na despesa ${i}:`, error.message)
      }
    }
    console.log(`✅ ${despesasCount} despesas do mês criadas\n`)

    // ==================== FLUXO DE CAIXA DO MÊS ATUAL ====================
    console.log('📊 Criando lançamentos de fluxo do mês atual...')
    let fluxoCount = 0

    const diasDoMes = hoje.getDate()
    for (let dia = 1; dia <= diasDoMes; dia++) {
      const dataLancamento = new Date(hoje.getFullYear(), hoje.getMonth(), dia)
      
      // Entrada
      try {
        await prisma.fluxoCaixa.create({
          data: {
            tenantId: tenant.id,
            data: dataLancamento,
            tipo: 'ENTRADA',
            categoria: 'Receita de Serviços',
            descricao: `Recebimentos do dia ${dia}`,
            valor: 500 + (Math.random() * 2000),
            metodoPagamento: ['PIX', 'DINHEIRO', 'CARTAO', 'BOLETO'][dia % 4],
            origem: 'Clientes',
            observacoes: `Lançamento do dia ${dia}/${hoje.getMonth() + 1}`
          }
        })
        fluxoCount++
      } catch (error: any) {
        console.error(`Erro no fluxo entrada dia ${dia}:`, error.message)
      }

      // Saída (a cada 2 dias)
      if (dia % 2 === 0) {
        try {
          await prisma.fluxoCaixa.create({
            data: {
              tenantId: tenant.id,
              data: dataLancamento,
              tipo: 'SAIDA',
              categoria: 'Despesa Operacional',
              descricao: `Pagamentos do dia ${dia}`,
              valor: 200 + (Math.random() * 800),
              metodoPagamento: ['PIX', 'DINHEIRO', 'CARTAO', 'BOLETO'][dia % 4],
              destino: 'Fornecedores',
              observacoes: `Pagamento do dia ${dia}/${hoje.getMonth() + 1}`
            }
          })
          fluxoCount++
        } catch (error: any) {
          console.error(`Erro no fluxo saída dia ${dia}:`, error.message)
        }
      }
    }
    console.log(`✅ ${fluxoCount} lançamentos de fluxo criados\n`)

    // ==================== TRANSAÇÕES DO MÊS ====================
    console.log('💰 Criando transações do mês atual...')
    let transacoesCount = 0

    for (let i = 0; i < 10; i++) {
      const customer = customers[i % customers.length]
      const tipo = i % 2 === 0 ? 'RECEITA' : 'DESPESA'
      const diaTransacao = Math.floor(Math.random() * diasDoMes) + 1
      const dataTransacao = new Date(hoje.getFullYear(), hoje.getMonth(), diaTransacao)
      const dataVencimento = new Date(dataTransacao)
      dataVencimento.setDate(dataVencimento.getDate() + 15)
      
      const isPago = i % 3 === 0
      
      try {
        await prisma.transacao.create({
          data: {
            tenantId: tenant.id,
            numero: `TRX-${Date.now()}-${i}`,
            customerId: customer.id,
            tipo,
            descricao: `Transação ${tipo} ${i + 1}`,
            valor: 300 + (Math.random() * 1500),
            dataVencimento,
            dataPagamento: isPago ? dataTransacao : null,
            categoria: tipo === 'RECEITA' ? 'SERVICO' : 'OPERACIONAL',
            status: isPago ? 'PAGO' : 'PENDENTE',
            metodoPagamento: isPago ? ['PIX', 'CARTAO', 'DINHEIRO', 'BOLETO'][i % 4] : null
          }
        })
        transacoesCount++
      } catch (error: any) {
        if (!error.message.includes('Unique constraint')) {
          console.error(`Erro na transação ${i}:`, error.message)
        }
      }
    }
    console.log(`✅ ${transacoesCount} transações criadas\n`)

    console.log('\n============================================================')
    console.log('✅ Dados do mês atual populados com sucesso!')
    console.log('============================================================\n')

  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
