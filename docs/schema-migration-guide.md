# 📋 Guia de Migração do Schema

## 🔄 Transformação Multi-Tenant

### 1. Adicionar modelo Tenant
```prisma
model Tenant {
  id          String   @id @default(cuid())
  name        String
  domain      String   @unique
  plan        String   @default("starter")
  status      String   @default("active")
  
  // Billing
  stripeCustomerId    String?
  subscriptionId      String?
  subscriptionStatus  String?
  trialEndsAt        DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relacionamentos
  users       User[]
  customers   Customer[]
  processes   Process[]
  
  @@map("tenants")
}
```

### 2. Adicionar tenantId em modelos existentes
```prisma
model User {
  // ... campos existentes
  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])
}

model Customer {
  // ... campos existentes  
  tenantId String
  tenant   Tenant @relation(fields: [tenantId], references: [id])
}
```

### 3. Comandos para migração
```bash
# 1. Aplicar mudanças no schema
npx prisma db push

# 2. Criar tenant padrão
npm run create-default-tenant

# 3. Migrar dados existentes
npm run migrate-to-multitenant
```
