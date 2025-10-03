# 🔥 PASSO-A-PASSO: Configurar Firebase

## 1. Acesse o Firebase Console
- Vá para: https://console.firebase.google.com/
- Selecione seu projeto "despasys-production"

## 2. Configurar Web App (se ainda não criou)
- Clique em "Project Settings" (ícone de engrenagem)
- Vá na aba "General"
- Em "Your apps", clique em "</>" (Web)
- Registre um novo app com nome "DespaSys Web"

## 3. Copiar Configuração Firebase
Após criar o app, você verá algo assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "despasys-production.firebaseapp.com",
  databaseURL: "https://despasys-production-default-rtdb.firebaseio.com/",
  projectId: "despasys-production",
  storageBucket: "despasys-production.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

## 4. Atualizar arquivo .env
Substitua no arquivo `.env` os valores:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="sua-api-key-aqui"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="seu-sender-id-aqui"  
NEXT_PUBLIC_FIREBASE_APP_ID="seu-app-id-aqui"
```

## 5. Ativar Realtime Database
- No Firebase Console, vá em "Realtime Database"
- Clique "Create Database"
- Escolha "Start in test mode" (por enquanto)
- Selecione região "us-central1"

## 6. Testar Configuração
Após configurar, execute:
```bash
npm run dev
curl http://localhost:3000/api/test/connectivity
```

## ⚠️ IMPORTANTE
- Mantenha o arquivo `despasys-production-765a8e33a3f3.json` na raiz
- Nunca commite esse arquivo (já está no .gitignore)
- Os valores NEXT_PUBLIC_* são seguros para commit
