const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verificando usuário admin...')

  // Check if admin user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'admin@demo-despachante.com' }
  })

  if (existingUser) {
    console.log('✅ Usuário admin já existe!')
    console.log('Email:', existingUser.email)
    console.log('Role:', existingUser.role)
    return
  }

  console.log('📝 Criando usuário admin...')

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.create({
    data: {
      tenantId: 'tenant-default',
      email: 'admin@demo-despachante.com',
      name: 'Administrador Demo',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    }
  })

  console.log('✅ Usuário admin criado com sucesso!')
  console.log('Email:', user.email)
  console.log('Nome:', user.name)
  console.log('Role:', user.role)
  console.log('\n🔑 Credenciais:')
  console.log('Email: admin@demo-despachante.com')
  console.log('Senha: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e.message)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
