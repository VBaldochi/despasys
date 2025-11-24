# 🚀 Guia Rápido - Integração ML

## ✅ Integração Completa!

A API de Machine Learning já está totalmente integrada ao sistema web. 

## 📦 O que foi criado:

### 1. **Endpoints Next.js** (`/api/ml/*`)
- ✅ `/api/ml/train` - Treinar modelo com JSON
- ✅ `/api/ml/train/import` - Treinar modelo com CSV  
- ✅ `/api/ml/predict` - Obter recomendação para 1 cliente
- ✅ `/api/ml/predict/batch` - Obter recomendações em lote
- ✅ `/api/ml/model` - Ver info do modelo treinado

### 2. **Cliente TypeScript** (`src/lib/ml-client.ts`)
- ✅ Classe `MLClient` para fácil uso
- ✅ Funções auxiliares para calcular features
- ✅ TypeScript completo com tipos

### 3. **Configuração**
- ✅ `.env` atualizado com `ML_API_URL`
- ✅ `reco-api/.env` criado com Neon DB
- ✅ `package.json` com jsonwebtoken

## 🔧 Próximos Passos:

### 1. Instalar Dependências

**Feche o npm dev primeiro**, depois:

```powershell
npm install
```

### 2. Configurar Python (primeira vez)

```powershell
cd reco-api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Iniciar Serviços

**Terminal 1 - Next.js:**
```powershell
npm run dev
```

**Terminal 2 - ML API:**
```powershell
cd reco-api
.\.venv\Scripts\Activate.ps1
uvicorn app:app --reload --port 8020
```

### 4. Treinar Modelo (primeira vez)

Acesse: http://localhost:8020/docs

Ou use PowerShell:

```powershell
# Token de teste
$TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBkZW1vLmNvbSIsIm5hbWUiOiJBZG1pbiBEZXYifQ.B0gRcbFcTyiDwKpIN2AUJECyE_Hgg-2no17prqBtVi0"

# Criar tenant (primeira vez)
Invoke-RestMethod -Method POST http://localhost:8020/dev/ensure-tenant `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"slug":"demo","name":"Demo Tenant"}'

# Treinar com dataset.csv
$Url = "http://127.0.0.1:8020/ml/train/import?tenant=demo&fmt=csv"
$CsvPath = ".\dataset.csv"
$http = [System.Net.Http.HttpClient]::new()
$mp = [System.Net.Http.MultipartFormDataContent]::new()
$fs = [System.IO.File]::OpenRead($CsvPath)
$fc = New-Object System.Net.Http.StreamContent($fs)
$fc.Headers.ContentType = 'text/csv'
$mp.Add($fc, "file", "dataset.csv")
$req = [System.Net.Http.HttpRequestMessage]::new([System.Net.Http.HttpMethod]::Post, $Url)
$req.Headers.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue('Bearer', $TOKEN)
$req.Content = $mp
$resp = $http.SendAsync($req).Result
$resp.StatusCode
$resp.Content.ReadAsStringAsync().Result
$fs.Dispose(); $mp.Dispose(); $http.Dispose()
```

## 💻 Como Usar no Código

```typescript
import { MLClient, prepareClientData } from '@/lib/ml-client';

// Criar cliente
const ml = new MLClient('demo');

// Obter recomendação para cliente
const customer = { tipoCliente: 'FISICO', name: 'João Silva' };
const processes = [
  { tipoServico: 'LICENCIAMENTO', valorTotal: 200, dataInicio: new Date() },
  { tipoServico: 'LICENCIAMENTO', valorTotal: 250, dataInicio: new Date() }
];
const vehicle = { ano: 2018 };

const request = prepareClientData(customer, processes, vehicle);
const prediction = await ml.predict(request);

console.log('Serviço recomendado:', prediction.top_service);
console.log('Confiança:', prediction.confidence);
console.log('Probabilidades:', prediction.probabilities);
// {
//   LICENCIAMENTO: 0.65,
//   TRANSFERENCIA: 0.20,
//   DESBLOQUEIO: 0.10,
//   PRIMEIRA_VIA: 0.05
// }
```

## 📊 Arquitetura

```
Cliente → Next.js (/api/ml/*) → FastAPI ML → Neon DB
          (porta 3001)           (porta 8020)
```

- **Next.js**: Faz proxy e autentica requests
- **FastAPI**: Processa ML e salva modelo no banco
- **Neon DB**: Armazena modelos treinados por tenant

## 🎯 Features

✅ Multi-tenant (cada tenant tem seu modelo)
✅ Treino com dataset.csv (751 exemplos)
✅ Predição única ou em lote
✅ Autenticação JWT automática
✅ TypeScript completo
✅ Fallback se modelo não treinado

## 📝 URLs

- **Next.js**: http://localhost:3001
- **ML API**: http://localhost:8020
- **ML Docs**: http://localhost:8020/docs

## 🐛 Troubleshooting

**Erro: "Connection refused 8020"**
→ ML API não está rodando

**Erro: "Model not available"**
→ Precisa treinar o modelo primeiro

**Erro: "Tenant not found"**
→ Execute `/dev/ensure-tenant` primeiro

---

📚 **Documentação completa**: `docs/ML-INTEGRATION.md`
