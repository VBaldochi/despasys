# 🧪 Guia de Testes de Conexão com Neon

## 🚀 **Teste Rápido (Recomendado)**
```bash
cd /home/baldochi/lazuli-saas
./test-connection.sh
```

---

## 🔧 **Testes Individuais**

### **1. Testar Variáveis de Ambiente**
```bash
# Verificar se .env foi carregado
echo $DATABASE_URL

# Deve mostrar algo como:
# postgresql://user:pass@ep-xxx.sa-east-1.aws.neon.tech/neondb?sslmode=require
```

### **2. Testar Geração do Cliente Prisma**
```bash
npx prisma generate
# ✅ Sucesso: "Generated Prisma Client"
# ❌ Erro: problemas no schema
```

### **3. Testar Conexão com Banco**
```bash
npx prisma db push
# ✅ Sucesso: "Your database is now in sync with your schema"
# ❌ Erro: problemas de conexão ou credenciais
```

### **4. Testar com Force Reset (se necessário)**
```bash
npx prisma db push --force-reset
# ⚠️ CUIDADO: Apaga todos os dados!
```

### **5. Verificar Status da Conexão**
```bash
npx prisma studio
# Abre interface web em http://localhost:5555
# ✅ Se abrir = conexão OK
```

### **6. Testar Criação de Usuário**
```bash
npm run create-admin
# ✅ Sucesso: "Usuário admin criado"
# ❌ Erro: problemas na conexão ou usuário já existe
```

### **7. Testar Servidor Completo**
```bash
npm run dev
# ✅ Sucesso: "Ready - started server on 0.0.0.0:3001"
# ❌ Erro: verificar logs de erro
```

---

## 🐛 **Diagnóstico de Problemas**

### **Se der erro de conexão:**
```bash
# Testar conectividade básica
ping sa-east-1.aws.neon.tech

# Verificar se SSL está funcionando
openssl s_client -connect ep-billowing-darkness-ac5bs3ay-pooler.sa-east-1.aws.neon.tech:5432 -servername ep-billowing-darkness-ac5bs3ay-pooler.sa-east-1.aws.neon.tech
```

### **Se der erro de SSL:**
```bash
# Verificar se a URL tem sslmode=require
grep "sslmode=require" .env

# Adicionar se não tiver:
# DATABASE_URL='...?sslmode=require&channel_binding=require'
```

### **Se der erro de schema:**
```bash
# Verificar schema atual
npx prisma db pull

# Resetar completamente
npx prisma migrate reset
```

---

## 📊 **Verificação no Dashboard Neon**

1. 🌐 Acesse: https://console.neon.tech
2. 📁 Selecione seu projeto
3. 🗄️ Vá em "Tables" 
4. ✅ Verifique se as tabelas foram criadas:
   - `User`
   - `Account` 
   - `Session`
   - `Customer`
   - `Quote`
   - `Appointment`
   - `Process`

---

## 🎯 **Teste Final**

### **Acesso ao Sistema:**
1. Execute: `npm run dev`
2. Abra: http://localhost:3001
3. Faça login com:
   - **Email:** admin@lazuli.com
   - **Senha:** admin123

### **Se o login funcionar:**
✅ **Conexão 100% configurada!**

### **Se não conseguir fazer login:**
- Verifique se o usuário foi criado: `npm run create-admin`
- Verifique logs no terminal
- Teste conexão: `./test-connection.sh`

---

## 📋 **Checklist de Validação**

- [ ] ✅ Arquivo `.env` configurado
- [ ] ✅ `npx prisma generate` funciona
- [ ] ✅ `npx prisma db push` funciona  
- [ ] ✅ `npm run create-admin` funciona
- [ ] ✅ `npm run dev` inicia sem erros
- [ ] ✅ Login no painel funciona
- [ ] ✅ Dashboard carrega corretamente

**Se todos os itens estão ✅, sua conexão está perfeita!**
