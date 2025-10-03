#!/usr/bin/env node

/**
 * 🏢 Script para Criar Tenant de Desenvolvimento
 * Cria um tenant de exemplo para desenvolvimento e testes
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

// Função simples para gerar ID
function generateId(length = 10) {
  const chars = '1234567890abcdef'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function createTenant() {
  console.log('🏢 Criando tenant de desenvolvimento para despachantes...')
  
  try {
    // Gerar dados do tenant
    const tenantData = {
      name: 'Despachante Demo Ltda',
      domain: 'demo',
      plan: 'DESPACHANTE_SOLO',
      status: 'TRIAL',
      registroProfissional: '12345-SP',
      cnpj: '12.345.678/0001-99',
      endereco: 'Rua das Flores, 123',
      telefone: '(11) 99999-9999',
      email: 'contato@demo-despachante.com',
      settings: {
        theme: 'blue',
        notifications: true,
        autoBackup: true
      },
      maxUsers: 1,
      maxCustomers: 100,
      maxProcesses: 300,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 dias
    }

    // Criar tenant
    const tenant = await prisma.tenant.create({
      data: tenantData
    })

    console.log('✅ Tenant criado:', tenant.name)
    console.log('🔗 Domain:', tenant.domain)
    console.log('📅 Trial até:', tenant.trialEndsAt)

    // Criar usuário admin para o tenant
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        name: 'Admin Demo',
        email: 'admin@demo-despachante.com',
        password: hashedPassword,
        role: 'ADMIN',
        registroProfissional: '12345-SP',
        telefone: '(11) 99999-9999',
        status: 'ATIVO'
      }
    })

    console.log('✅ Usuário admin criado:', adminUser.email)

    // Criar alguns clientes de exemplo
    const clientesExemplo = [
      {
        tenantId: tenant.id,
        name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 98888-8888',
        cpfCnpj: '123.456.789-01',
        tipoCliente: 'FISICO',
        endereco: 'Rua A, 100',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567'
      },
      {
        tenantId: tenant.id,
        name: 'Empresa XYZ Ltda',
        email: 'contato@empresa-xyz.com.br',
        phone: '(11) 3333-3333',
        cpfCnpj: '98.765.432/0001-10',
        tipoCliente: 'JURIDICO',
        razaoSocial: 'Empresa XYZ Ltda',
        nomeFantasia: 'XYZ Corp',
        endereco: 'Av. Principal, 500',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04567-890'
      }
    ]

    for (const clienteData of clientesExemplo) {
      const cliente = await prisma.customer.create({
        data: clienteData
      })
      console.log('✅ Cliente criado:', cliente.name)
    }

    console.log('')
    console.log('🎉 TENANT DE DESENVOLVIMENTO CRIADO COM SUCESSO!')
    console.log('=====================================')
    console.log('')
    console.log('📋 DADOS DE ACESSO:')
    console.log('👤 Email:', adminUser.email)
    console.log('🔑 Senha: admin123')
    console.log('🌐 Domain:', tenant.domain)
    console.log('🏢 Tenant ID:', tenant.id)
    console.log('')
    console.log('🚀 Para acessar:')
    console.log('1. Execute: npm run dev')
    console.log('2. Acesse: http://localhost:3001')
    console.log('3. Faça login com as credenciais acima')
    console.log('')

  } catch (error) {
    console.error('❌ Erro ao criar tenant:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Verificar se já existe um tenant
async function checkExistingTenant() {
  try {
    const existingTenant = await prisma.tenant.findFirst({
      where: { domain: 'demo' }
    })

    if (existingTenant) {
      console.log('⚠️  Tenant "demo" já existe!')
      console.log('🗑️  Deseja recriar? (Isso apagará todos os dados)')
      
      // Para desenvolvimento, vamos apagar e recriar
      await prisma.tenant.delete({
        where: { id: existingTenant.id }
      })
      console.log('🗑️  Tenant anterior removido.')
    }
  } catch (error) {
    // Se não encontrar, tudo bem, vamos criar
    console.log('📝 Criando novo tenant...')
  }
}

async function main() {
  await checkExistingTenant()
  await createTenant()
}

main().catch((error) => {
  console.error('❌ Erro geral:', error)
  process.exit(1)
})
