// Tipos para o sistema de veículos
export type StatusVeiculo = 'EM_ANDAMENTO' | 'PRONTO' | 'PENDENTE_DOCS' | 'AGUARDANDO_PAGTO';

export interface Veiculo {
  id: string;
  placa: string;
  cliente: string;
  clienteId: string;
  servico: string;
  status: StatusVeiculo;
  prazo: string;
  valor: number;
  documentos: string[];
  telefone: string;
  createdAt: string;
  updatedAt: string;
}

export interface VeiculoInput {
  placa: string;
  clienteId: string;
  servico: string;
  prazo: string;
  valor: number;
  documentos: string[];
}

// Tipos para clientes
export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    cep: string;
    uf: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClienteInput {
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  endereco?: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    cep: string;
    uf: string;
  };
}

// Tipos para débitos
export interface Debito {
  tipo: 'IPVA' | 'MULTA' | 'DPVAT' | 'LICENCIAMENTO';
  descricao: string;
  valor: number;
  vencimento: string;
  orgao: string;
  status: 'PENDENTE' | 'VENCIDO' | 'QUITADO';
  codigoRenavam?: string;
  numeroAuto?: string;
}

export interface ConsultaDebitos {
  placa: string;
  debitos: Debito[];
  totalPendente: number;
  totalVencido: number;
  ultimaConsulta: string;
}

// Tipos para dashboard
export interface DashboardStats {
  veiculosEmAndamento: number;
  veiculosProntos: number;
  veiculosPendentes: number;
  faturamentoMes: number;
  clientesAtivos: number;
  notificacoesNaoLidas: number;
}

// Tipos para notificações
export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  lida: boolean;
  createdAt: string;
  veiculoId?: string;
  clienteId?: string;
}
