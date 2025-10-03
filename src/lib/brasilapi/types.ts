// Tipos TypeScript consolidados para todas as integrações BrasilAPI

// ============= FIPE =============
export interface MarcaFipe {
  nome: string;
  codigo: string;
}

export interface VeiculoFipe {
  nome: string;
  codigo: string;
  codigoFipe: string;
}

export interface PrecoFipe {
  valor: string;
  marca: string;
  modelo: string;
  anoModelo: number;
  combustivel: string;
  codigoFipe: string;
  mesReferencia: string;
  tipoVeiculo: number;
  siglaCombustivel: string;
  dataConsulta: string;
}

export interface TabelaFipe {
  codigo: number;
  mes: string;
}

export type TipoVeiculo = 'carros' | 'motos' | 'caminhoes';

// ============= CEP =============
export interface EnderecoCep {
  cep: string;
  state: string;
  city: string;
  neighborhood: string | null;
  street: string | null;
  service: string;
}

export interface EnderecoCepV2 extends EnderecoCep {
  location: {
    type: string;
    coordinates: {
      longitude: string | null;
      latitude: string | null;
    };
  };
}

export interface Coordenadas {
  lat: number;
  lng: number;
}

// ============= CNPJ =============
export interface EmpresaCnpj {
  cnpj: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia: string | null;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: number;
  nome_cidade_exterior: string | null;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string | null;
  telefone_1: string | null;
  ddd_telefone_2: string | null;
  telefone_2: string | null;
  ddd_fax: string | null;
  fax: string | null;
  correio_eletronico: string | null;
  qualificacao_do_responsavel: number;
  capital_social: number;
  porte: string;
  descricao_porte: string;
  opcao_pelo_simples: boolean;
  data_opcao_pelo_simples: string | null;
  data_exclusao_do_simples: string | null;
  opcao_pelo_mei: boolean;
  situacao_especial: string | null;
  data_situacao_especial: string | null;
  faturamento_presumido: number | null;
  cnaes_secundarios: CnaeSecundario[];
  qsa: QuadroSocietario[];
}

export interface CnaeSecundario {
  codigo: number;
  descricao: string;
}

export interface QuadroSocietario {
  identificador_de_socio: number;
  nome_socio: string;
  cnpj_cpf_do_socio: string;
  codigo_qualificacao_socio: number;
  percentual_capital_social: number;
  data_entrada_sociedade: string;
  cpf_representante_legal: string | null;
  nome_representante_legal: string | null;
  codigo_qualificacao_representante_legal: number | null;
}

// ============= DDD =============
export interface InfoDDD {
  state: string;
  cities: string[];
}

// ============= IBGE =============
export interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

export interface Municipio {
  nome: string;
  codigo_ibge: string;
}

// ============= PIX =============
export interface ParticipantePix {
  ispb: string;
  nome: string;
  nome_reduzido: string;
  modalidade_participacao: string;
  tipo_participacao: string;
  inicio_operacao: string;
}

// ============= BANCOS =============
export interface Banco {
  ispb: string;
  name: string;
  code: number;
  fullName: string;
}

// ============= FERIADOS =============
export interface Feriado {
  date: string;
  name: string;
  type: string;
}

// ============= TAXAS =============
export interface Taxa {
  nome: string;
  valor: number;
}

// ============= ERRORS =============
export interface BrasilApiError {
  name: string;
  message: string;
  type: string;
  errors?: Array<{
    message: string;
  }>;
}

// ============= UTILS =============
export interface ResultadoBusca<T> {
  sucesso: boolean;
  dados?: T;
  erro?: string;
}

export interface ConfiguracaoCache {
  tempoExpiracao: number; // em minutos
  chaveCache: string;
}

// ============= INTEGRAÇÃO COM PROJETO LAZULI =============
export interface DadosClienteCompleto {
  // Dados básicos
  nome: string;
  email?: string;
  telefone?: string;
  
  // Dados de endereço (via CEP)
  cep?: string;
  endereco?: EnderecoCep;
  coordenadas?: Coordenadas;
  
  // Dados empresariais (via CNPJ)
  cnpj?: string;
  dadosEmpresa?: EmpresaCnpj;
  
  // Dados do veículo (via FIPE)
  tipoVeiculo?: TipoVeiculo;
  marca?: string;
  modelo?: string;
  codigoFipe?: string;
  valorFipe?: PrecoFipe[];
}

export interface OrcamentoCompleto {
  cliente: DadosClienteCompleto;
  servicos: string[];
  valorTotal: number;
  valorFipeReferencia?: number;
  observacoes?: string;
  dataOrcamento: string;
  validoAte: string;
}

// ============= HOOKS E COMPOSABLES =============
export interface UseBrasilApiReturn {
  // FIPE
  consultarFipe: (tipoVeiculo: TipoVeiculo, marca: string, modelo: string) => Promise<ResultadoBusca<PrecoFipe[]>>;
  
  // CEP
  consultarCep: (cep: string, comCoordenadas?: boolean) => Promise<ResultadoBusca<EnderecoCep | EnderecoCepV2>>;
  
  // CNPJ
  consultarCnpj: (cnpj: string) => Promise<ResultadoBusca<EmpresaCnpj>>;
  
  // Estados de loading
  loading: {
    fipe: boolean;
    cep: boolean;
    cnpj: boolean;
  };
  
  // Estados de erro
  errors: {
    fipe: string | null;
    cep: string | null;
    cnpj: string | null;
  };
}

// ============= CONFIGURAÇÕES =============
export interface ConfigBrasilApi {
  baseUrl: string;
  timeout: number;
  retries: number;
  cache: {
    habilitado: boolean;
    tempoExpiracao: number;
  };
}

export const configPadrao: ConfigBrasilApi = {
  baseUrl: 'https://brasilapi.com.br/api',
  timeout: 10000, // 10 segundos
  retries: 3,
  cache: {
    habilitado: true,
    tempoExpiracao: 30 // 30 minutos
  }
};

// ============= MAPEAMENTOS =============
export const mapeamentos = {
  tiposVeiculo: {
    carros: { label: 'Automóveis', icon: '🚗' },
    motos: { label: 'Motocicletas', icon: '🏍️' },
    caminhoes: { label: 'Caminhões', icon: '🚛' }
  },
  
  situacoesCnpj: {
    1: { label: 'NULA', cor: 'red' },
    2: { label: 'ATIVA', cor: 'green' },
    3: { label: 'SUSPENSA', cor: 'yellow' },
    4: { label: 'INAPTA', cor: 'orange' },
    8: { label: 'BAIXADA', cor: 'red' }
  },
  
  regioesBrasil: {
    1: { nome: 'Norte', sigla: 'N' },
    2: { nome: 'Nordeste', sigla: 'NE' },
    3: { nome: 'Sudeste', sigla: 'SE' },
    4: { nome: 'Sul', sigla: 'S' },
    5: { nome: 'Centro-Oeste', sigla: 'CO' }
  }
} as const;
