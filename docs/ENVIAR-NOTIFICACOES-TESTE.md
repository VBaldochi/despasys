# 📤 Como Enviar Notificações de Teste

## ✅ Seu Firebase está configurado!

- **Projeto:** despasys-production-80bf2
- **Database URL:** https://despasys-production-80bf2-default-rtdb.firebaseio.com
- **Tenant de teste:** demo
- **Notificações existentes:** 3 (já lidas pelo app)

---

## 🚀 3 Formas de Enviar Novas Notificações

### **Método 1: Firebase Console** (Mais Rápido - 30 segundos)

1. Acesse: https://console.firebase.google.com/project/despasys-production-80bf2/database/despasys-production-80bf2-default-rtdb/data/tenants/demo/notifications

2. Clique no botão **"+"** ao lado de "notifications"

3. Cole este JSON:

```json
{
  "id": "test-2025-10-03",
  "tenantId": "demo",
  "title": "🎉 Teste Tempo Real",
  "message": "Esta notificação foi enviada agora mesmo!",
  "type": "SUCCESS",
  "targetUser": "all",
  "read": false,
  "createdAt": 1730612345000,
  "source": "manual"
}
```

4. Clique em **"Add"**

5. **Ver no mobile em tempo real!** 🎉

---

### **Método 2: Página Web de Teste** (Mais Fácil)

1. **Iniciar servidor Next.js:**
   ```bash
   npm run dev
   ```

2. **Abrir no navegador:**
   ```
   http://localhost:3000/test-notifications
   ```

3. **Preencher formulário:**
   - Título: 🚨 Processo Urgente
   - Mensagem: O processo ABC-123 precisa de atenção
   - Tipo: Warning

4. **Clicar em "Enviar Notificação"**

5. **Ver aparecer no mobile!** ✨

---

### **Método 3: API com cURL/Postman** (Para Desenvolvedores)

**Windows PowerShell:**
```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    title = "🎯 Teste via API"
    message = "Notificação enviada pelo PowerShell!"
    type = "INFO"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/send" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

**Linux/Mac:**
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🎯 Teste via API",
    "message": "Notificação enviada pelo cURL!",
    "type": "INFO"
  }'
```

---

## 📱 Como Ver no Mobile

### **Passo 1: Iniciar Mobile App**

```bash
cd mobile
npm start
```

### **Passo 2: Abrir no Emulador/Dispositivo**

Escanear QR Code ou pressionar `a` para Android

### **Passo 3: Fazer Login**

```
Domínio: demo
Email: admin@demo-despachante.com
Senha: (sua senha)
```

### **Passo 4: Ir para Aba "Sync"**

Última tab do aplicativo (ícone de sync)

### **Passo 5: Enviar Notificação**

Usar qualquer um dos 3 métodos acima

### **Passo 6: Ver Aparecer em Tempo Real!** 🎉

Você deve ver:
- ✅ Contador de notificações aumentar
- ✅ Card do "Último Evento" atualizar
- ✅ Lista de eventos mostrar a nova notificação
- ✅ Logs no terminal do Expo

---

## 🔍 Logs Esperados

### **Mobile (Terminal do Expo):**

```
📡 [MOBILE] Dados recebidos do path tenants/demo/notifications: true
📊 [MOBILE] Dados: [...keys]
🔔 [MOBILE] Notificações recentes: 1
📨 [MOBILE] Novo evento recebido: notification created test-2025-10-03
```

### **Web (Terminal do Next.js):**

```
✅ Notificação criada e sincronizada com Firebase: test-2025-10-03
🔥 Sincronizado com Firebase: notifications/test-2025-10-03
```

---

## 💡 Exemplos de Notificações para Testar

### Sucesso:
```json
{
  "title": "✅ Processo Finalizado",
  "message": "O processo PROC-2025-100 foi concluído com sucesso!",
  "type": "SUCCESS"
}
```

### Aviso:
```json
{
  "title": "⚠️ Documento Pendente",
  "message": "Faltam 2 dias para o prazo do processo PROC-2025-101",
  "type": "WARNING"
}
```

### Erro:
```json
{
  "title": "❌ Pagamento Falhou",
  "message": "Não foi possível processar o pagamento. Tente novamente.",
  "type": "ERROR"
}
```

### Info:
```json
{
  "title": "ℹ️ Atualização Disponível",
  "message": "Nova versão do app disponível com melhorias de performance",
  "type": "INFO"
}
```

---

## 🎯 Checklist de Teste Completo

- [ ] Mobile app aberto e logado
- [ ] Aba "Sync" aberta
- [ ] Status mostrando "🟢 Conectado"
- [ ] Enviar notificação (qualquer método)
- [ ] Ver contador aumentar
- [ ] Ver "Último Evento" atualizar
- [ ] Ver notificação na lista
- [ ] Ver logs corretos no terminal
- [ ] Testar os 4 tipos (INFO, SUCCESS, WARNING, ERROR)

---

## 🐛 Se Não Funcionar

### Mobile não conecta:
```
❌ Verificar se fez login com tenant "demo"
❌ Verificar internet
❌ Verificar Firebase URL
❌ Reiniciar app mobile
```

### Notificação não aparece:
```
❌ Verificar timestamp (deve ser recente)
❌ Verificar tenantId ("demo")
❌ Verificar logs do Expo
❌ Verificar se está na aba Sync
```

### Erro no envio:
```
❌ Servidor Next.js rodando?
❌ Fez login no web?
❌ Verificar logs do Next.js
```

---

## 🎉 Próximos Passos

Depois de testar notificações com sucesso:

1. ✅ Testar eventos de processos
2. ✅ Testar eventos de clientes
3. ✅ Implementar Push Notifications (FCM)
4. ✅ Adicionar DualWrite em endpoints reais
5. ✅ Configurar Firebase Rules seguras

---

**Criado em:** 03/10/2025  
**Status:** ✅ Pronto para enviar notificações!  
**Método Recomendado:** Página Web (`/test-notifications`)
