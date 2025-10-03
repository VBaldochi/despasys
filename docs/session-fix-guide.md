# 🔧 Guia de Solução - Problemas de Sessão/Login

## 🚨 Problema Identificado

**Sintoma**: Após fazer login em uma máquina, não consegue fazer login em outras máquinas/abas anônimas. Fica em loop na tela de "verificando autenticação".

## 🔍 Causa Raiz

O problema está relacionado ao gerenciamento de cookies e sessões do NextAuth.js em ambiente de produção (Vercel). As principais causas são:

1. **Configuração de cookies inadequada para produção**
2. **NEXTAUTH_SECRET inconsistente**
3. **NEXTAUTH_URL incorreto ou ausente**
4. **Conflitos de cookies entre diferentes subdomínios**
5. **Problemas de CORS em ambientes distribuídos**

## ✅ Soluções Implementadas

### 1. **Configuração de Cookies Segura**
```typescript
// Implementado em src/lib/auth.ts
cookies: {
  sessionToken: {
    name: process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token' 
      : 'next-auth.session-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production'
    }
  }
}
```

### 2. **Callback de Redirect Melhorado**
```typescript
// Callback que força uso do baseUrl correto
async redirect({ url, baseUrl }) {
  const productionBaseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXTAUTH_URL || baseUrl
    : baseUrl
  
  // Lógica melhorada de redirect
}
```

### 3. **Debug e Logging**
```typescript
// Sistema de debug implementado
debug: process.env.NODE_ENV === 'development',
logger: {
  error(code, metadata) {
    console.error('NextAuth Error:', code, metadata)
  }
}
```

### 4. **Middleware de Debug**
```typescript
// Logs detalhados em produção para diagnóstico
console.log('🔍 Middleware Debug:', {
  path: request.nextUrl.pathname,
  cookies: Object.keys(request.cookies),
  timestamp: new Date().toISOString()
})
```

## 🛠️ Passos para Resolver

### **PASSO 1: Verificar Variáveis de Ambiente no Vercel**

```bash
# Acessar Vercel Dashboard > Settings > Environment Variables

# Verificar se existem:
NEXTAUTH_SECRET=<valor-gerado>
NEXTAUTH_URL=https://despasys.vercel.app
DATABASE_URL=<connection-string>
```

### **PASSO 2: Gerar Nova NEXTAUTH_SECRET**

```bash
# Executar no terminal:
openssl rand -base64 32

# Copiar o resultado e atualizar no Vercel
```

### **PASSO 3: Fazer Redeploy Completo**

1. Acessar Vercel Dashboard
2. Ir em Deployments
3. Clicar nos 3 pontos do último deploy
4. Selecionar "Redeploy"
5. Marcar "Use existing Build Cache" como FALSE

### **PASSO 4: Limpar Cache Local**

```javascript
// Executar no console do navegador:
localStorage.clear();
sessionStorage.clear();

// Limpar cookies manualmente:
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
```

### **PASSO 5: Testar com Diagnóstico**

```bash
# Acessar URL de debug:
https://despasys.vercel.app/api/debug/session

# Verificar resposta e logs
```

## 🧪 Scripts de Diagnóstico

### **Executar Diagnóstico Local**
```bash
cd /Users/viniciusbaldochi1/despasys
./scripts/diagnose-session.sh
```

### **Debug via API**
```bash
# GET para verificar estado
curl https://despasys.vercel.app/api/debug/session

# POST para cleanup
curl -X POST https://despasys.vercel.app/api/debug/session \
  -H "Content-Type: application/json" \
  -d '{"action":"cleanup"}'
```

## 🔍 Componente de Debug

Adicionado componente `SessionDiagnostic` que aparece apenas em desenvolvimento:

- Mostra status da sessão em tempo real
- Permite debug do servidor
- Botão de cleanup de sessões
- Botão de logout forçado

## 📋 Checklist de Verificação

- [ ] NEXTAUTH_SECRET configurado no Vercel
- [ ] NEXTAUTH_URL apontando para domínio correto  
- [ ] DATABASE_URL funcionando
- [ ] Cookies sendo definidos corretamente
- [ ] Logs do Vercel sem erros
- [ ] Teste em modo anônimo funcionando
- [ ] Teste em diferentes dispositivos funcionando

## 🚀 Validação Final

### **Teste 1: Login Normal**
1. Acessar https://despasys.vercel.app
2. Fazer login com credenciais válidas
3. Verificar redirecionamento para dashboard

### **Teste 2: Múltiplas Sessões**
1. Abrir aba anônima
2. Fazer login com mesmas credenciais
3. Verificar se login funciona sem problemas

### **Teste 3: Diferentes Dispositivos**
1. Acessar do celular
2. Fazer login
3. Verificar funcionamento normal

## ⚠️ Se o Problema Persistir

1. **Verificar logs do Vercel em tempo real**
2. **Considerar usar adapter de banco para sessões**
3. **Implementar fallback de autenticação**
4. **Verificar se não há conflitos de proxy/CDN**

## 📞 Debug Avançado

```typescript
// Adicionar no components/debug/SessionDiagnostic.tsx
// Componente que monitora sessão em tempo real
// Disponível apenas em desenvolvimento
```

---

**Status**: ✅ Soluções implementadas e prontas para deploy
**Próximo passo**: Fazer redeploy no Vercel com as correções
