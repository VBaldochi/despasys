# Sistema de Recomendações ML - Guia de Uso

## 🎯 Visão Geral

O sistema de recomendações ML usa Machine Learning para sugerir os próximos serviços que um cliente provavelmente precisará, baseado no histórico de serviços realizados.

## 🚀 Como Usar

### 1. Componente MLRecommendations

O componente `MLRecommendations` pode ser inserido em qualquer página que tenha acesso ao ID do cliente:

```tsx
import { MLRecommendations } from '@/components/MLRecommendations';

// Exemplo de uso básico
<MLRecommendations customerId={cliente.id} />

// Com callback para selecionar serviço
<MLRecommendations 
  customerId={cliente.id}
  vehicleId={veiculo?.id}
  onServiceSelect={(service) => {
    console.log('Serviço selecionado:', service);
    // Abrir modal de novo processo com o serviço pré-selecionado
  }}
/>
```

### 2. Locais Recomendados para Integração

#### 2.1 Página de Detalhes do Cliente

**Arquivo:** `src/app/(dashboard)/customers/[id]/page.tsx`

Adicione o componente na sidebar ou em uma seção após os dados do cliente:

```tsx
<div className="space-y-6">
  {/* Dados do cliente */}
  <CustomerDetails customer={customer} />
  
  {/* Recomendações ML */}
  <MLRecommendations 
    customerId={customer.id}
    onServiceSelect={(service) => {
      // Redirecionar para criar novo processo com o serviço sugerido
      router.push(`/processes/new?customerId=${customer.id}&service=${service}`);
    }}
  />
  
  {/* Histórico de processos */}
  <CustomerProcesses customerId={customer.id} />
</div>
```

#### 2.2 Modal de Finalização de Processo

Quando um processo é finalizado, mostrar sugestões do próximo serviço:

```tsx
// Em ProcessDetailsPage ou modal de finalização
{processo.status === 'CONCLUIDO' && (
  <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Processo Finalizado com Sucesso! 🎉</DialogTitle>
        <DialogDescription>
          Com base no histórico do cliente, recomendamos:
        </DialogDescription>
      </DialogHeader>
      
      <MLRecommendations 
        customerId={processo.customerId}
        vehicleId={processo.veiculoId}
        onServiceSelect={(service) => {
          // Criar novo processo automaticamente
          router.push(`/processes/new?customerId=${processo.customerId}&service=${service}`);
        }}
      />
      
      <DialogFooter>
        <Button variant="outline" onClick={() => setShowRecommendations(false)}>
          Fechar
        </Button>
        <Button onClick={() => router.push('/processes/new')}>
          Criar Novo Processo
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}
```

#### 2.3 Dashboard Principal

Mostrar recomendações para clientes com processos recentes:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Próximos Serviços Sugeridos</CardTitle>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="cliente1">
      {clientesRecentes.map(cliente => (
        <TabsContent key={cliente.id} value={cliente.id}>
          <MLRecommendations 
            customerId={cliente.id}
            onServiceSelect={(service) => {
              router.push(`/processes/new?customerId=${cliente.id}&service=${service}`);
            }}
          />
        </TabsContent>
      ))}
    </Tabs>
  </CardContent>
</Card>
```

#### 2.4 Formulário de Novo Processo

Sugerir serviços ao selecionar um cliente:

```tsx
<Form {...form}>
  <FormField
    control={form.control}
    name="customerId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Cliente</FormLabel>
        <Select onValueChange={(value) => {
          field.onChange(value);
          setShowRecommendations(true);
        }}>
          {/* Options de clientes */}
        </Select>
      </FormItem>
    )}
  />
  
  {showRecommendations && form.watch('customerId') && (
    <MLRecommendations 
      customerId={form.watch('customerId')}
      onServiceSelect={(service) => {
        form.setValue('tipoServico', service);
        setShowRecommendations(false);
      }}
    />
  )}
  
  <FormField
    control={form.control}
    name="tipoServico"
    render={({ field }) => (
      // Campo de seleção de serviço
    )}
  />
</Form>
```

## 🔧 Personalização

### Estilização

O componente usa Tailwind CSS e pode ser customizado através de classes:

```tsx
<div className="my-custom-container">
  <MLRecommendations 
    customerId={id}
    className="custom-recommendations"
  />
</div>
```

### Tradução de Serviços

Edite o objeto `SERVICE_LABELS` em `MLRecommendations.tsx`:

```tsx
const SERVICE_LABELS: Record<string, string> = {
  LICENCIAMENTO: 'Licenciamento Anual',
  TRANSFERENCIA: 'Transferência de Veículo',
  // Adicione mais conforme necessário
};
```

### Quantidade de Recomendações

Altere o `.slice(0, 5)` para mostrar mais ou menos sugestões:

```tsx
.slice(0, 3) // Apenas top 3
```

## 📊 Funcionamento Técnico

### Fluxo de Dados

1. **Componente React** (`MLRecommendations.tsx`)
   - Envia `customerId` para a API

2. **API Route** (`/api/customers/[id]/ml-recommendation`)
   - Busca dados do cliente no banco (Prisma)
   - Calcula features: histórico, valores, dias desde último serviço
   - Prepara request para ML API

3. **ML API Python** (FastAPI em `reco-api/`)
   - Recebe features do cliente
   - Aplica modelo treinado (LogisticRegression)
   - Retorna probabilidades para cada tipo de serviço

4. **Resposta ao Frontend**
   - Exibe top 5 serviços com probabilidades
   - Destaca o mais provável
   - Permite seleção interativa

### Features Utilizadas pelo Modelo

- **Cliente:**
  - `tipo_cliente`: FISICO ou JURIDICO
  - `total_servicos_cliente`: quantidade total de serviços realizados
  - `valor_total_gasto`: soma de todos os valores pagos
  - `dias_desde_ultimo_servico`: dias desde o último atendimento
  - `servicos_unicos_utilizados`: variedade de serviços já usados

- **Veículo:**
  - `ano_veiculo`: ano do veículo
  - `tipo_veiculo`: categoria (AUTOMOVEL, MOTO, etc)
  - `idade_veiculo`: anos desde fabricação

- **Histórico:**
  - `history_counts`: contagem de cada tipo de serviço já realizado
    - Ex: `{ "LICENCIAMENTO": 3, "TRANSFERENCIA": 1 }`

## 🎨 Exemplo Visual

```
┌─────────────────────────────────────────┐
│ 🌟 Recomendações Inteligentes           │
│ Com base no histórico do cliente        │
├─────────────────────────────────────────┤
│ 1  Licenciamento         ████████ 45.2% │
│ 2  Emissão de ATPVE      ████░░░░ 23.1% │
│ 3  Vistoria Veicular     ███░░░░░ 15.8% │
│ 4  Desbloqueio           ██░░░░░░  8.5% │
│ 5  Transferência         ██░░░░░░  7.4% │
├─────────────────────────────────────────┤
│ 📈 Próximo serviço sugerido:            │
│    Licenciamento (45% de probabilidade) │
└─────────────────────────────────────────┘
```

## 🔄 Retreinamento do Modelo

Para melhorar as predições, retreine periodicamente com novos dados:

```bash
# Exportar dados de produção
npx tsx scripts/export-training-data.ts > reco-api/dataset-new.csv

# Treinar modelo (PowerShell)
$TOKEN = "seu-jwt-token"
$boundary = [System.Guid]::NewGuid().ToString()
# ... (comando de upload do CSV)

# Ou via API do Next.js
POST /api/ml/train/import
Content-Type: multipart/form-data
```

## 🐛 Troubleshooting

### Recomendações não aparecem

1. Verifique se o ML API está rodando: `http://localhost:8020/healthz`
2. Verifique se o modelo foi treinado: `http://localhost:8020/ml/model?tenant=demo`
3. Veja logs no console do navegador (F12)
4. Veja logs do ML API no terminal

### Probabilidades muito baixas

- Cliente tem pouco histórico (< 5 serviços)
- Modelo precisa ser retreinado com mais dados
- Padrão de serviços do cliente é atípico

### Erro 401 Unauthorized

- Sessão expirada, faça login novamente
- Verifique `NEXTAUTH_SECRET` nas variáveis de ambiente

## 📈 Métricas e Análises

Para acompanhar a eficácia das recomendações:

1. **Taxa de Aceite**: % de recomendações que viraram processos
2. **Acurácia**: serviço sugerido foi realmente o próximo realizado
3. **Tempo até próximo serviço**: dias entre recomendação e novo processo

Implemente tracking:

```tsx
onServiceSelect={(service) => {
  // Analytics
  track('ml_recommendation_selected', {
    customerId,
    service,
    probability: recommendations[0].probability,
  });
  
  // Criar processo
  router.push(`/processes/new?customerId=${customerId}&service=${service}`);
}}
```

## 🎯 Roadmap Futuro

- [ ] Notificações automáticas quando probabilidade > 80%
- [ ] Dashboard de análise de recomendações
- [ ] A/B testing de diferentes modelos
- [ ] Integração com WhatsApp para envio de sugestões
- [ ] Recomendações baseadas em sazonalidade (janeiro = licenciamento)
- [ ] Predição de valor estimado do próximo serviço
