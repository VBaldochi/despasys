// Tipos base para o módulo financeiro

export type TipoCobranca = 'boleto' | 'pix' | 'cartao' | 'dinheiro' | 'transferencia';

export interface Cobranca {
  id: string;
  descricao: string;
  valor: number;
  vencimento: string; // ISO date
  status: 'pendente' | 'pago' | 'cancelado';
  tipo: TipoCobranca;
  cliente?: string;
  criadoEm: string;
}

export interface LancamentoFinanceiro {
  id: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  descricao: string;
  data: string; // ISO date
  categoria?: string;
}
