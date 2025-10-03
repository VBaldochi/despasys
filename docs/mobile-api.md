# API Mobile - Documentação

## Configuração Base

**URL Base (Desenvolvimento):** `http://localhost:3001`
**URL Base (Produção):** `https://yourdomain.com`

## Autenticação

Todas as requisições para a API mobile devem incluir:

1. **X-API-Key** (header): Chave de API válida
2. **Authorization** (header): Bearer token (após login)
3. **X-Tenant-ID** (header): Domain do tenant

## Endpoints Disponíveis

### 1. Autenticação

**POST** `/api/mobile/auth`

**Headers:**
```
Content-Type: application/json
X-API-Key: mobile-dev-key-123
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123",
  "tenantDomain": "demo"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "name": "Nome do Usuário",
    "email": "user@example.com",
    "role": "ADMIN",
    "tenant": {
      "id": "tenant-id",
      "name": "Nome do Tenant",
      "domain": "demo"
    }
  },
  "token": "base64-encoded-token"
}
```

### 2. Listar Processos

**GET** `/api/mobile/processes`

**Headers:**
```
Authorization: Bearer {token}
X-API-Key: mobile-dev-key-123
X-Tenant-ID: demo
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "processo-id",
      "numero": "PROC-001",
      "tipo": "LICENCIAMENTO",
      "status": "PENDENTE",
      "valor": 150.00,
      "dataVencimento": "2025-09-15T00:00:00.000Z",
      "descricao": "Licenciamento de veículo",
      "cliente": {
        "id": "cliente-id",
        "nome": "João Silva",
        "cpf": "12345678901",
        "telefone": "11999999999"
      },
      "createdAt": "2025-09-01T10:00:00.000Z",
      "updatedAt": "2025-09-01T10:00:00.000Z"
    }
  ]
}
```

## Códigos de Erro

- **400**: Bad Request - Dados inválidos
- **401**: Unauthorized - API Key ou token inválido
- **404**: Not Found - Recurso não encontrado
- **500**: Internal Server Error - Erro do servidor

## Exemplo de Uso (React Native)

```javascript
// Configuração base
const API_BASE_URL = 'http://localhost:3001';
const API_KEY = 'mobile-dev-key-123';

// Função de login
async function login(email, password, tenantDomain) {
  const response = await fetch(`${API_BASE_URL}/api/mobile/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({
      email,
      password,
      tenantDomain
    }),
  });
  
  return await response.json();
}

// Função para buscar processos
async function getProcesses(token, tenantDomain) {
  const response = await fetch(`${API_BASE_URL}/api/mobile/processes`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-API-Key': API_KEY,
      'X-Tenant-ID': tenantDomain,
    },
  });
  
  return await response.json();
}
```

## Limitações

- Máximo de 50 processos por requisição
- Rate limiting: 100 requisições por minuto por API key
- Tamanho máximo do payload: 1MB

## Próximos Endpoints a Implementar

- GET `/api/mobile/customers` - Listar clientes
- POST `/api/mobile/processes` - Criar processo
- PUT `/api/mobile/processes/:id` - Atualizar processo
- GET `/api/mobile/dashboard` - Dados do dashboard
- GET `/api/mobile/financeiro` - Dados financeiros
