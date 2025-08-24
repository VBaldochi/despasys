# Integração Brasil API 🇧🇷

Integração completa e robusta com a Brasil API para validação e consulta de dados brasileiros essenciais.

## 📋 Funcionalidades

### ✅ Serviços Disponíveis

- **CEP** - Consulta de endereços com geolocalização
- **CPF** - Validação e informações regionais
- **CNPJ** - Validação e dados empresariais completos
- **FIPE** - Consulta de preços de veículos (carros, motos, caminhões)

### 🎯 Casos de Uso Principais

- Validação de documentos em formulários
- Autocompletar endereços por CEP
- Consulta de dados empresariais
- Avaliação de veículos por tabela FIPE
- Formatação inteligente de documentos

## 🚀 Instalação e Uso

### Importação Básica

```typescript
import { brasilApi, brasilApiUtils } from '@/lib/brasilapi';
```

### Importação de Serviços Específicos

```typescript
import { 
  cepService, 
  cnpjService, 
  cpfService, 
  fipeService 
} from '@/lib/brasilapi';
```

### Hook para React

```typescript
import { useBrasilApi } from '@/lib/brasilapi';

function MeuComponente() {
  const { validarDado, autocompletarEndereco, consultarVeiculo } = useBrasilApi();
  
  // Usar os serviços...
}
```

## 📖 Exemplos de Uso

### 1. Validação Automática de Documentos

```typescript
// Detecta automaticamente o tipo (CPF, CNPJ, CEP) e valida
const resultado = await brasilApi.validarDado('12345678909');

console.log(resultado.tipo);      // 'cpf'
console.log(resultado.valido);    // true/false
console.log(resultado.formatado); // '123.456.789-09'
console.log(resultado.dados);     // Dados específicos do tipo
```

### 2. Validação Completa de Cliente

```typescript
const dadosCliente = {
  cpf: '12345678909',
  cnpj: '11222333000181',
  cep: '01310-100'
};

const resultado = await brasilApi.validarCliente(dadosCliente);

if (resultado.valido) {
  console.log('Cliente válido!');
  console.log('CPF:', resultado.cpf);
  console.log('Empresa:', resultado.cnpj);
  console.log('Endereço:', resultado.endereco);
} else {
  console.log('Erros:', resultado.erros);
}
```

### 3. Autocompletar Endereço por CEP

```typescript
const resultado = await brasilApi.autocompletarEndereco('01310-100');

if (resultado.success) {
  const { logradouro, bairro, cidade, estado } = resultado.endereco;
  // Preencher formulário automaticamente
}
```

### 4. Consulta de Veículo FIPE

```typescript
const veiculo = await brasilApi.consultarVeiculo('carros', 'FIAT', 'UNO');

if (veiculo.preco) {
  console.log('Valor FIPE:', veiculo.valorFormatado);
  console.log('Valor numérico:', veiculo.valorNumerico);
}
```

### 5. Formatação Inteligente

```typescript
// Detecta tipo automaticamente e formata
const formatado = brasilApi.formularios.autoFormatar('12345678909');
console.log(formatado); // '123.456.789-09'

// Formatação específica
const cpfFormatado = brasilApi.formatadores.cpf('12345678909');
const cnpjFormatado = brasilApi.formatadores.cnpj('12345678000123');
const cepFormatado = brasilApi.formatadores.cep('01310100');
```

### 6. Validação em Tempo Real

```typescript
// Para uso em formulários - validação conforme usuário digita
const resultado = brasilApi.formularios.validarCpfTempoReal('12345');

console.log(resultado.status);    // 'incompleto' | 'valido' | 'invalido' | 'vazio'
console.log(resultado.mensagem);  // Mensagem para exibir ao usuário
console.log(resultado.formatado); // Valor formatado
```

### 7. Validações Rápidas

```typescript
// Apenas retorna boolean
const cpfValido = brasilApi.validadores.cpf('12345678909');
const cnpjValido = await brasilApi.validadores.cnpj('12345678000123');
const cepValido = await brasilApi.validadores.cep('01310-100');
```

## 🛠️ Serviços Individuais

### CEP Service

```typescript
import { cepService } from '@/lib/brasilapi';

// Buscar endereço
const endereco = await cepService.buscarCep('01310-100');

// Buscar com coordenadas (V2)
const enderecoV2 = await cepService.buscarCepV2('01310-100');

// Calcular distância entre CEPs
const distancia = await cepService.calcularDistancia('01310-100', '20040-020');
```

### CPF Service

```typescript
import { cpfService } from '@/lib/brasilapi';

// Validar CPF
const validacao = cpfService.validar('12345678909');

// Obter informações detalhadas
const info = cpfService.obterInfo('12345678909');
console.log(info.estado);  // Estado baseado no dígito regional
console.log(info.regiao);  // Região fiscal

// Formatação
const formatado = cpfService.formatarCpf('12345678909');
```

### CNPJ Service

```typescript
import { cnpjService } from '@/lib/brasilapi';

// Validar CNPJ
const valido = cnpjService.validarCnpj('12345678000123');

// Consultar dados da empresa
const empresa = await cnpjService.consultarCnpj('12345678000123');
console.log(empresa.razao_social);
console.log(empresa.situacao_cadastral);
```

### FIPE Service

```typescript
import { fipeService } from '@/lib/brasilapi';

// Listar marcas
const marcas = await fipeService.getMarcas('carros');

// Listar veículos de uma marca
const veiculos = await fipeService.getVeiculos('carros', '21'); // Código da FIAT

// Consultar preço
const preco = await fipeService.getPreco('001004-9');

// Busca completa
const resultado = await fipeService.getBuscaCompleta('carros', 'FIAT', 'UNO');
```

## 🎨 Integração com Formulários

### Exemplo com React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { useBrasilApi } from '@/lib/brasilapi';

function FormularioCliente() {
  const { register, handleSubmit, setValue, setError } = useForm();
  const { autocompletarEndereco, validadores } = useBrasilApi();

  const handleCepChange = async (cep: string) => {
    if (cep.replace(/\D/g, '').length === 8) {
      const resultado = await autocompletarEndereco(cep);
      
      if (resultado.success) {
        setValue('logradouro', resultado.endereco.logradouro);
        setValue('bairro', resultado.endereco.bairro);
        setValue('cidade', resultado.endereco.cidade);
        setValue('estado', resultado.endereco.estado);
      }
    }
  };

  const validarCpf = async (cpf: string) => {
    const valido = validadores.cpf(cpf);
    if (!valido) {
      setError('cpf', { message: 'CPF inválido' });
    }
    return valido;
  };

  return (
    <form>
      <input
        {...register('cpf', { validate: validarCpf })}
        placeholder="CPF"
      />
      
      <input
        {...register('cep')}
        onChange={(e) => handleCepChange(e.target.value)}
        placeholder="CEP"
      />
      
      <input {...register('logradouro')} placeholder="Logradouro" />
      <input {...register('bairro')} placeholder="Bairro" />
      <input {...register('cidade')} placeholder="Cidade" />
      <input {...register('estado')} placeholder="Estado" />
    </form>
  );
}
```

### Máscaras de Input

```typescript
import { brasilApi } from '@/lib/brasilapi';

// Máscara dinâmica baseada no tipo detectado
const aplicarMascara = (valor: string) => {
  return brasilApi.formularios.autoFormatar(valor);
};

// Máscaras específicas
const mascaraCpf = (valor: string) => brasilApi.formularios.mascaraCpf(valor);
const mascaraCnpj = (valor: string) => brasilApi.formularios.mascaraCnpj(valor);
const mascaraCep = (valor: string) => brasilApi.formularios.mascaraCep(valor);
```

## 🔧 Configuração Avançada

### Tratamento de Erros

```typescript
try {
  const resultado = await brasilApi.validarDado(documento);
  // Processar resultado
} catch (error) {
  if (error.message.includes('404')) {
    console.log('Documento não encontrado');
  } else if (error.message.includes('rate limit')) {
    console.log('Muitas requisições, tente novamente');
  } else {
    console.log('Erro inesperado:', error.message);
  }
}
```

### Cache e Performance

Os serviços incluem tratamento inteligente de cache e throttling para otimizar performance:

- Cache automático de consultas CEP por 1 hora
- Debouncing em validações em tempo real
- Retry automático em caso de falha temporária

## 📊 Tipos TypeScript

Todos os serviços são totalmente tipados com TypeScript:

```typescript
import type {
  CpfInfo,
  CpfValidacao,
  EnderecoCep,
  EmpresaCnpj,
  PrecoFipe,
  MarcaFipe,
  VeiculoFipe,
  TipoVeiculo,
  ValidacaoCompleta,
  ConsultaVeicular,
  DadosCliente
} from '@/lib/brasilapi';
```

## 📝 Constantes Úteis

```typescript
import { brasilApiUtils } from '@/lib/brasilapi';

// Tipos de veículo FIPE
brasilApiUtils.TIPOS_VEICULO; // ['carros', 'motos', 'caminhoes']

// Estados do Brasil
brasilApiUtils.ESTADOS_BRASIL; // ['AC', 'AL', 'AP', ...]

// Utilitários
brasilApiUtils.formatarDocumento('12345678909'); // Formatação inteligente
brasilApiUtils.ehDocumentoBrasileiroValido('12345678909'); // Validação completa
```

## 🧪 Testes

Para testar a integração, execute o arquivo de exemplos:

```typescript
import { executarTodosExemplos } from '@/lib/brasilapi/exemplos';

// Executa todos os exemplos de uso
await executarTodosExemplos();
```

## 🚨 Limitações e Considerações

1. **Rate Limiting**: A Brasil API tem limitações de uso. Implemente cache quando possível.

2. **Disponibilidade**: Serviços dependem da disponibilidade da Brasil API.

3. **CPF/CNPJ de Teste**: Use apenas para desenvolvimento. Nunca em produção.

4. **Validação Local vs Remota**: 
   - CPF: Validação apenas local (algoritmo)
   - CNPJ: Validação local + consulta remota opcional
   - CEP: Sempre consulta remota
   - FIPE: Sempre consulta remota

## 📞 Suporte

Esta integração foi desenvolvida especificamente para o sistema de despachantes, considerando:

- Validação rigorosa de documentos de clientes
- Autocompletar endereços para agilizar cadastros
- Consulta FIPE para avaliação de veículos
- Formatação consistente em toda a aplicação

Para dúvidas ou problemas, consulte os exemplos em `src/lib/brasilapi/exemplos.ts`.

---

✨ **Desenvolvido para otimizar a experiência do usuário e garantir dados precisos e validados em tempo real.**
