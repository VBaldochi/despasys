const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Iniciando população do banco de dados...')
    
    // Limpar dados existentes (opcional)
    console.log('🧹 Limpando dados existentes...')
    await prisma.process.deleteMany()
    await prisma.veiculo.deleteMany()
    await prisma.customer.deleteMany()
    
    console.log('👥 Criando clientes...')
    
    // Criar clientes de exemplo
    const cliente1 = await prisma.customer.create({
      data: {
        name: 'João Silva Santos',
        email: 'joao@email.com',
        phone: '(16) 99999-1234',
        cpfCnpj: '123.456.789-01',
        tipoCliente: 'FISICO',
        endereco: 'Rua das Flores, 123',
        numero: '123',
        bairro: 'Centro',
        cidade: 'Franca',
        estado: 'SP',
        cep: '14400-000',
        rg: '12.345.678-9',
        orgaoEmissor: 'SSP-SP'
      }
    })

    const cliente2 = await prisma.customer.create({
      data: {
        name: 'Transportadora ABC Ltda',
        email: 'contato@transportadoraabc.com',
        phone: '(16) 3333-5678',
        cpfCnpj: '12.345.678/0001-90',
        tipoCliente: 'JURIDICO',
        endereco: 'Av. Industrial, 456',
        numero: '456',
        bairro: 'Distrito Industrial',
        cidade: 'Ribeirão Preto',
        estado: 'SP',
        cep: '14000-000',
        razaoSocial: 'Transportadora ABC Ltda',
        nomeFantasia: 'ABC Transportes'
      }
    })

    const cliente3 = await prisma.customer.create({
      data: {
        name: 'Maria Oliveira',
        email: 'maria@outlook.com',
        phone: '(16) 98888-5555',
        cpfCnpj: '987.654.321-09',
        tipoCliente: 'FISICO',
        endereco: 'Rua Central, 789',
        numero: '789',
        bairro: 'Vila Nova',
        cidade: 'Franca',
        estado: 'SP',
        cep: '14401-000',
        rg: '98.765.432-1',
        orgaoEmissor: 'SSP-SP'
      }
    })
    
    console.log('🚗 Criando veículos...')

    // Criar veículos de exemplo
    const veiculo1 = await prisma.veiculo.create({
      data: {
        placa: 'ABC-1234',
        renavam: '12345678901',
        chassi: '9BWSU19F08B302158',
        modelo: 'Civic',
        marca: 'Honda',
        ano: 2020,
        anoModelo: 2020,
        cor: 'Prata',
        combustivel: 'Flex',
        categoria: 'Carro',
        customerId: cliente1.id
      }
    })

    const veiculo2 = await prisma.veiculo.create({
      data: {
        placa: 'DEF-5678',
        renavam: '12345678902',
        chassi: '9BWSU19F08B302159',
        modelo: 'Sprinter',
        marca: 'Mercedes-Benz',
        ano: 2019,
        anoModelo: 2019,
        cor: 'Branco',
        combustivel: 'Diesel',
        categoria: 'Van',
        customerId: cliente2.id
      }
    })

    const veiculo3 = await prisma.veiculo.create({
      data: {
        placa: 'GHI-9012',
        renavam: '12345678903',
        chassi: '9BWSU19F08B302160',
        modelo: 'Onix',
        marca: 'Chevrolet',
        ano: 2021,
        anoModelo: 2021,
        cor: 'Azul',
        combustivel: 'Flex',
        categoria: 'Carro',
        customerId: cliente3.id
      }
    })
    
    console.log('📋 Criando processos...')
    
    // Buscar usuário admin para ser responsável
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (!adminUser) {
      throw new Error('Usuário admin não encontrado. Execute primeiro: npm run create-admin')
    }

    // Criar processos de exemplo - usando os campos corretos do schema
    const processo1 = await prisma.process.create({
      data: {
        numero: 'PR-2025-001',
        customerId: cliente1.id,
        veiculoId: veiculo1.id,
        responsavelId: adminUser.id,
        tipoServico: 'TRANSFERENCIA',
        titulo: 'Transferência de Propriedade',
        descricao: 'Transferência de propriedade - Honda Civic',
        status: 'EM_ANALISE',
        prioridade: 'MEDIA',
        valorTotal: 500.00,
        valorTaxas: 200.00,
        valorServico: 300.00
      }
    })

    const processo2 = await prisma.process.create({
      data: {
        numero: 'PR-2025-002',
        customerId: cliente2.id,
        veiculoId: veiculo2.id,
        responsavelId: adminUser.id,
        tipoServico: 'LICENCIAMENTO',
        titulo: 'Licenciamento Anual',
        descricao: 'Licenciamento anual - Mercedes Sprinter',
        status: 'AGUARDANDO_DOCUMENTOS',
        prioridade: 'ALTA',
        valorTotal: 800.00,
        valorTaxas: 400.00,
        valorServico: 400.00
      }
    })

    const processo3 = await prisma.process.create({
      data: {
        numero: 'PR-2025-003',
        customerId: cliente3.id,
        veiculoId: veiculo3.id,
        responsavelId: adminUser.id,
        tipoServico: 'SEGUNDA_VIA',
        titulo: 'Segunda Via de Documento',
        descricao: 'Segunda via do documento - Chevrolet Onix',
        status: 'FINALIZADO',
        prioridade: 'BAIXA',
        valorTotal: 150.00,
        valorTaxas: 50.00,
        valorServico: 100.00,
        dataFinalizacao: new Date()
      }
    })

    console.log('✅ Banco de dados populado com sucesso!')
    console.log('\n📊 Dados criados:')
    console.log(`👥 Clientes: ${cliente1.name}, ${cliente2.name}, ${cliente3.name}`)
    console.log(`🚗 Veículos: ${veiculo1.placa}, ${veiculo2.placa}, ${veiculo3.placa}`)
    console.log(`📋 Processos: ${processo1.numero}, ${processo2.numero}, ${processo3.numero}`)
    
    // Verificar se os dados foram criados corretamente
    const totalClientes = await prisma.customer.count()
    const totalVeiculos = await prisma.veiculo.count()
    const totalProcessos = await prisma.process.count()
    
    console.log('\n🔍 Verificação:')
    console.log(`📊 Total de clientes: ${totalClientes}`)
    console.log(`🚗 Total de veículos: ${totalVeiculos}`)
    console.log(`📋 Total de processos: ${totalProcessos}`)
    
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('💥 Erro fatal:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
