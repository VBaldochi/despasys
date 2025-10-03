import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupTestUser() {
  try {
    // Verificar se o tenant demo existe
    let tenant = await prisma.tenant.findUnique({
      where: { domain: 'demo' }
    })

    if (!tenant) {
      console.log('Criando tenant demo...')
      tenant = await prisma.tenant.create({
        data: {
          name: 'Demo Despachante',
          domain: 'demo',
          plan: 'DESPACHANTE_SOLO',
          status: 'ACTIVE',
          email: 'admin@demo-despachante.com'
        }
      })
      console.log('Tenant demo criado:', tenant)
    } else {
      console.log('Tenant demo encontrado:', tenant)
    }

    // Verificar se o usuário admin existe
    let user = await prisma.user.findFirst({
      where: {
        email: 'admin@demo-despachante.com',
        tenantId: tenant.id
      }
    })

    if (!user) {
      console.log('Criando usuário admin...')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      user = await prisma.user.create({
        data: {
          email: 'admin@demo-despachante.com',
          name: 'Admin Demo',
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ATIVO',
          tenantId: tenant.id
        }
      })
      console.log('Usuário admin criado:', { id: user.id, email: user.email, role: user.role })
    } else {
      console.log('Usuário admin encontrado:', { id: user.id, email: user.email, role: user.role })
    }

    console.log('Setup concluído com sucesso!')
    
  } catch (error) {
    console.error('Erro no setup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupTestUser()
