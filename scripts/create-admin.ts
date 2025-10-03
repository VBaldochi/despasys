import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lazulidespachante.com' },
    update: {},
    create: {
      email: 'admin@lazulidespachante.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
      tenant: {
        connect: { domain: 'demo' }
      }
    }
  })

  console.log('Admin user created:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
