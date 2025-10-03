export interface Tenant {
  id: string
  name: string
  domain: string
  plan: 'DESPACHANTE_SOLO' | 'PEQUENO' | 'GRANDE'
  status: 'TRIAL' | 'ACTIVE' | 'SUSPENDED'
  maxUsers: number
  maxCustomers: number
  maxProcesses: number
}

export interface User {
  id: string
  tenantId: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  status: 'ATIVO' | 'INATIVO'
}

export interface Customer {
  id: string
  tenantId: string
  name: string
  email?: string
  phone: string
  cpfCnpj: string
  tipoCliente: 'FISICO' | 'JURIDICO'
  endereco?: string
  cidade?: string
  estado?: string
  status: 'ATIVO' | 'INATIVO'
}

export interface Process {
  id: string
  tenantId: string
  numero: string
  customerId: string
  tipoServico: 'LICENCIAMENTO' | 'TRANSFERENCIA' | 'PRIMEIRA_HABILITACAO' | 'RENOVACAO_CNH' | 'IPVA' | 'MULTA' | 'VISTORIA'
  titulo: string
  descricao?: string
  status: 'AGUARDANDO_DOCUMENTOS' | 'EM_ANDAMENTO' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDO' | 'CANCELADO'
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
  valorTotal: number
  valorTaxas: number
  valorServico: number
  statusPagamento: 'PENDENTE' | 'PAGO' | 'VENCIDO'
  dataInicio: Date
  prazoLegal?: Date
  dataFinalizacao?: Date
  customer: Customer
}

export interface Transacao {
  id: string
  tenantId: string
  tipo: 'RECEITA' | 'DESPESA'
  categoria: string
  descricao: string
  valor: number
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO'
  dataVencimento: Date
  dataPagamento?: Date
  customerId?: string
  processoId?: string
}

export interface DashboardData {
  processos: {
    total: number
    pendentes: number
    emAndamento: number
    concluidos: number
    vencidos: number
  }
  financeiro: {
    receitasMes: number
    despesasMes: number
    saldoAtual: number
    contasPendentes: number
  }
  clientes: {
    total: number
    novosEsteMes: number
  }
  proximosVencimentos: Process[]
}

export interface AuthResponse {
  success: boolean
  user?: User
  sessionToken?: string
  token?: string
  error?: string
}

export interface AuthError {
  success: false
  error: string
}

export interface LoginCredentials {
  email: string
  password: string
  tenantDomain: string
}
