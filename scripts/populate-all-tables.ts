import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Populando TODAS as tabelas do sistema...\n')

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

    // Buscar clientes e processos existentes
    const customers = await prisma.customer.findMany({
      where: { tenantId: tenant.id },
      take: 20
    })

    const processes = await prisma.process.findMany({
      where: { tenantId: tenant.id },
      take: 20
    })

    console.log(`📊 Base: ${customers.length} clientes, ${processes.length} processos\n`)

    // ==================== TRANSAÇÕES ====================
    console.log('💰 Criando transações...')
    let transacoesCount = 0
    
    for (let i = 0; i < 30; i++) {
      const customer = customers[i % customers.length]
      const process = i < processes.length ? processes[i] : null
      const isPago = i % 3 !== 0 // 66% pagos
      const isReceita = i % 2 === 0
      
      const dataVencimento = new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
      const dataPagamento = isPago ? new Date(dataVencimento.getTime() + 2 * 24 * 60 * 60 * 1000) : null

      try {
        await prisma.transacao.create({
          data: {
            tenantId: tenant.id,
            numero: `TXN-${(i + 1).toString().padStart(4, '0')}`,
            processoId: process?.id || null,
            customerId: customer.id,
            tipo: isReceita ? 'RECEITA' : 'DESPESA',
            categoria: isReceita ? 'Serviços Prestados' : ['Taxas Detran', 'Despachante', 'Documentação'][i % 3],
            descricao: isReceita 
              ? `Pagamento do processo ${process?.numero || 'avulso'}`
              : `Despesa com ${['taxas', 'documentação', 'vistoria'][i % 3]}`,
            valor: 150 + (i * 50),
            dataVencimento,
            dataPagamento,
            status: isPago ? 'PAGO' : (dataVencimento < new Date() ? 'VENCIDO' : 'PENDENTE'),
            metodoPagamento: isPago ? ['PIX', 'CARTAO', 'DINHEIRO', 'BOLETO'][i % 4] : null,
            observacoes: `Transação ${i + 1}`
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

    // ==================== RECEITAS ====================
    console.log('💵 Criando receitas...')
    let receitasCount = 0
    
    for (let i = 0; i < 25; i++) {
      const customer = customers[i % customers.length]
      const isPago = i % 4 !== 0
      
      try {
        await prisma.receita.create({
          data: {
            tenantId: tenant.id,
            numero: `REC-${String(receitasCount + i + 1).padStart(4, '0')}`,
            customerId: customer.id,
            customerName: customer.name,
            servico: `Serviço de ${['Licenciamento', 'Transferência', 'Emplacamento', 'Segunda Via'][i % 4]}`,
            descricao: `Serviço de ${['Licenciamento', 'Transferência', 'Emplacamento', 'Segunda Via'][i % 4]}`,
            valor: 300 + (i * 75),
            dataEmissao: new Date(Date.now() - (25 - i) * 24 * 60 * 60 * 1000),
            dataVencimento: new Date(Date.now() - (25 - i - 7) * 24 * 60 * 60 * 1000),
            dataPagamento: isPago ? new Date(Date.now() - (25 - i - 5) * 24 * 60 * 60 * 1000) : null,
            status: isPago ? 'PAGO' : 'PENDENTE',
            metodoPagamento: isPago ? ['PIX', 'CARTAO', 'DINHEIRO'][i % 3] : null
          }
        })
        receitasCount++
      } catch (error: any) {
        if (!error.message.includes('Unique constraint')) {
          console.error(`Erro na receita ${i}:`, error.message)
        }
      }
    }
    console.log(`✅ ${receitasCount} receitas criadas\n`)

    // ==================== DESPESAS ====================
    console.log('💸 Atualizando despesas existentes...')
    const despesas = await prisma.despesa.findMany({
      where: { tenantId: tenant.id },
      take: 60
    })
    
    let despesasUpdated = 0
    for (let i = 0; i < despesas.length; i++) {
      const isPago = i % 3 !== 0
      const tipoDespesa = ['FIXA', 'VARIAVEL', 'OPERACIONAL', 'IMPOSTO'][i % 4]
      
      try {
        await prisma.despesa.update({
          where: { id: despesas[i].id },
          data: {
            tipoDespesa,
            dataPagamento: isPago ? new Date(Date.now() - (i * 24 * 60 * 60 * 1000)) : null,
            status: isPago ? 'PAGO' : (despesas[i].dataVencimento < new Date() ? 'VENCIDO' : 'PENDENTE')
          }
        })
        despesasUpdated++
      } catch (error: any) {
        console.error(`Erro ao atualizar despesa ${i}:`, error.message)
      }
    }
    console.log(`✅ ${despesasUpdated} despesas atualizadas\n`)

    // ==================== FLUXO DE CAIXA ====================
    console.log('📊 Criando entradas de fluxo de caixa...')
    let fluxoCount = 0
    
    for (let i = 0; i < 30; i++) {
      const data = new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
      const receitas = 1000 + (i * 200)
      const despesas = 600 + (i * 100)
      
      try {
        await prisma.fluxoCaixa.create({
          data: {
            tenantId: tenant.id,
            data,
            tipo: i % 2 === 0 ? 'ENTRADA' : 'SAIDA',
            categoria: i % 2 === 0 ? 'Receita de Serviços' : 'Despesa Operacional',
            descricao: `Movimento do dia ${data.toLocaleDateString('pt-BR')}`,
            valor: i % 2 === 0 ? receitas : despesas,
            metodoPagamento: ['PIX', 'DINHEIRO', 'CARTAO', 'BOLETO'][i % 4],
            origem: i % 2 === 0 ? 'Cliente' : 'Fornecedor',
            observacoes: `Fluxo dia ${i + 1} - ${i % 2 === 0 ? 'Entrada' : 'Saída'} de R$ ${(i % 2 === 0 ? receitas : despesas).toFixed(2)}`
          }
        })
        fluxoCount++
      } catch (error: any) {
        if (!error.message.includes('Unique constraint')) {
          console.error(`Erro no fluxo ${i}:`, error.message)
        }
      }
    }
    console.log(`✅ ${fluxoCount} entradas de fluxo criadas\n`)

    // ==================== DOCUMENTOS ====================
    console.log('📄 Criando documentos...')
    let documentosCount = 0
    
    for (let i = 0; i < Math.min(20, processes.length); i++) {
      const process = processes[i]
      
      try {
        await prisma.documento.create({
          data: {
            processoId: process.id,
            tipo: ['RG', 'CPF', 'CNH', 'COMPROVANTE_RESIDENCIA', 'CRV'][i % 5] as any,
            nome: `Documento ${i + 1} - ${process.numero}.pdf`,
            arquivo: `/uploads/documentos/doc-${i + 1}.pdf`,
            tamanho: 1024 * (100 + i * 10),
            hash: `hash-${i + 1}-${Date.now()}`,
            status: ['PENDENTE', 'APROVADO', 'REJEITADO'][i % 3] as any
          }
        })
        documentosCount++
      } catch (error: any) {
        if (!error.message.includes('Unique constraint')) {
          console.error(`Erro no documento ${i}:`, error.message)
        }
      }
    }
    console.log(`✅ ${documentosCount} documentos criados\n`)

    // ==================== TIMELINE EVENTS ====================
    console.log('📅 Criando eventos de timeline...')
    let timelineCount = 0
    
    for (let i = 0; i < Math.min(30, processes.length); i++) {
      const process = processes[i]
      const eventsPerProcess = 3
      
      for (let j = 0; j < eventsPerProcess; j++) {
        try {
          await prisma.timelineEvent.create({
            data: {
              processoId: process.id,
              tipo: ['CRIACAO', 'DOCUMENTO_ADICIONADO', 'ATUALIZACAO_STATUS', 'PAGAMENTO_RECEBIDO'][j % 4] as any,
              titulo: ['Processo criado', 'Documento enviado', 'Status atualizado', 'Pagamento recebido'][j % 4],
              descricao: `Evento ${j + 1} do processo ${process.numero}`,
              autor: user.name || 'Sistema'
            }
          })
          timelineCount++
        } catch (error: any) {
          console.error(`Erro no timeline:`, error.message)
        }
      }
    }
    console.log(`✅ ${timelineCount} eventos de timeline criados\n`)

    // ==================== ESTATÍSTICAS FINAIS ====================
    console.log('\n' + '='.repeat(60))
    console.log('📊 ESTATÍSTICAS FINAIS:\n')

    const stats = {
      clientes: await prisma.customer.count({ where: { tenantId: tenant.id } }),
      veiculos: await prisma.veiculo.count({ where: { tenantId: tenant.id } }),
      processos: await prisma.process.count({ where: { tenantId: tenant.id } }),
      transacoes: await prisma.transacao.count({ where: { tenantId: tenant.id } }),
      receitas: await prisma.receita.count({ where: { tenantId: tenant.id } }),
      despesas: await prisma.despesa.count({ where: { tenantId: tenant.id } }),
      fluxoCaixa: await prisma.fluxoCaixa.count({ where: { tenantId: tenant.id } }),
      documentos: await prisma.documento.count(),
      timeline: await prisma.timelineEvent.count()
    }

    Object.entries(stats).forEach(([key, value]) => {
      const icon = value > 0 ? '✅' : '❌'
      console.log(`${icon} ${key.padEnd(15)}: ${value}`)
    })

    console.log('\n✅ Banco de dados completamente populado!')

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
