# 🚀 Guia de Instalação e Uso da API ML

## 📋 Pré-requisitos

1. Python 3.8+
2. Banco Neon configurado (já está!)
3. Next.js rodando (porta 3001)

## 🔧 Setup Inicial

### 1. Instalar dependências do Next.js

```bash
npm install
```

### 2. Configurar ambiente virtual Python (primeira vez)

```powershell
# Na raiz do projeto
cd reco-api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. Iniciar a API ML

```powershell
# Dentro da pasta reco-api com venv ativado
uvicorn app:app --reload --port 8020
```

A API estará em: `http://localhost:8020`

Docs: `http://localhost:8020/docs`

## 🎯 Como Usar

### 1. Treinar o Modelo (Primeira Vez)

A API ML precisa ser treinada com o dataset.csv. Após iniciar ambas as APIs (Next.js na 3001 e ML na 8020):

**Opção A - Via Interface Web (em desenvolvimento)**

Acesse: `http://localhost:3001/admin/ml`

**Opção B - Via Script PowerShell**

```powershell
# Gerar token de teste
$TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBkZW1vLmNvbSIsIm5hbWUiOiJBZG1pbiBEZXYifQ.B0gRcbFcTyiDwKpIN2AUJECyE_Hgg-2no17prqBtVi0"

# Enviar dataset para treino
$Url = "http://127.0.0.1:8020/ml/train/import?tenant=demo&fmt=csv"
$CsvPath = ".\reco-api\dataset.csv"

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

### 2. Verificar Status do Modelo

```powershell
curl http://localhost:8020/ml/model?tenant=demo `
  -H "Authorization: Bearer $TOKEN"
```

### 3. Obter Recomendação para um Cliente

**Via Next.js API (recomendado):**

```typescript
import { MLClient, prepareClientData } from '@/lib/ml-client';

const mlClient = new MLClient('demo');

// Preparar dados do cliente
const request = prepareClientData(
  customer,  // { tipoCliente: 'FISICO', name: '...' }
  processes, // Array de processos do cliente
  vehicle    // { ano: 2018 }
);

// Obter recomendação
const prediction = await mlClient.predict(request);

console.log('Serviço recomendado:', prediction.top_service);
console.log('Confiança:', prediction.confidence);
console.log('Todas as probabilidades:', prediction.probabilities);
```

## 🏗️ Arquitetura

```
┌─────────────────┐
│   Next.js App   │  Porta 3001
│  (Frontend +    │
│   API Routes)   │
└────────┬────────┘
         │
         │ HTTP (proxy)
         ▼
┌─────────────────┐
│   FastAPI ML    │  Porta 8020
│   (Python)      │
└────────┬────────┘
         │
         │ asyncpg
         ▼
┌─────────────────┐
│   Neon DB       │
│  (PostgreSQL)   │
└─────────────────┘
```

## 📊 Endpoints Disponíveis

### Next.js (Frontend)

- `POST /api/ml/train` - Treinar com JSON
- `POST /api/ml/train/import` - Treinar com CSV
- `POST /api/ml/predict` - Predição única
- `POST /api/ml/predict/batch` - Predição em lote
- `GET /api/ml/model` - Info do modelo

### FastAPI (Backend ML)

- `POST /ml/train?tenant=demo`
- `POST /ml/train/import?tenant=demo&fmt=csv`
- `POST /ml/predict?tenant=demo`
- `POST /ml/predict/batch?tenant=demo`
- `GET /ml/model?tenant=demo`
- `GET /health` - Health check
- `POST /dev/ensure-tenant` - Criar tenant

## 🔐 Autenticação

A API ML usa JWT do NextAuth. O Next.js gera tokens compatíveis automaticamente usando o `NEXTAUTH_SECRET` compartilhado.

## 📝 Exemplo de Uso Completo

```typescript
// 1. Importar cliente
import { MLClient } from '@/lib/ml-client';

// 2. Criar instância
const ml = new MLClient('demo');

// 3. Verificar se modelo está treinado
const info = await ml.getModelInfo();
if (!info.model_available) {
  console.log('Modelo não treinado! Treine primeiro.');
}

// 4. Fazer predição
const prediction = await ml.predict({
  client_info: {
    tipo_cliente: 'FISICO',
    total_servicos_cliente: 5,
    valor_total_gasto: 1200,
    dias_desde_ultimo_servico: 45,
    servicos_unicos_utilizados: 3
  },
  vehicle_info: {
    idade_veiculo: 7
  },
  history_counts: {
    LICENCIAMENTO: 4,
    TRANSFERENCIA: 1,
    DESBLOQUEIO: 0
  }
});

console.log('Recomendação:', prediction.top_service);
console.log('Confiança:', prediction.confidence);
```

## 🐛 Troubleshooting

### Erro: "Connection refused" na porta 8020

- Verifique se a API ML está rodando: `uvicorn app:app --reload --port 8020`
- Confirme que está na pasta `reco-api` com venv ativado

### Erro: "Tenant não encontrado"

- Execute na API ML:
```powershell
curl -X POST http://localhost:8020/dev/ensure-tenant `
  -H "Content-Type: application/json" `
  -d '{"slug":"demo","name":"Demo Tenant"}'
```

### Erro: "Model not available"

- O modelo precisa ser treinado primeiro usando `/ml/train/import` com o dataset.csv

### Erro: "Invalid token"

- Verifique se `NEXTAUTH_SECRET` é o mesmo em `.env` e `reco-api/.env`
- Token de teste: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBkZW1vLmNvbSIsIm5hbWUiOiJBZG1pbiBEZXYifQ.B0gRcbFcTyiDwKpIN2AUJECyE_Hgg-2no17prqBtVi0`

## 🚀 Fluxo de Desenvolvimento

1. **Iniciar Next.js**: `npm run dev` (porta 3001)
2. **Iniciar ML API**: `cd reco-api && .\.venv\Scripts\Activate.ps1 && uvicorn app:app --reload --port 8020`
3. **Treinar modelo** (primeira vez): Upload dataset.csv
4. **Usar no frontend**: Import `MLClient` e fazer predições

## 📚 Recursos Úteis

- **Dataset**: `reco-api/dataset.csv` (751 exemplos)
- **Cliente TS**: `src/lib/ml-client.ts`
- **API Routes**: `src/app/api/ml/*/route.ts`
- **Docs API**: http://localhost:8020/docs (quando rodando)
