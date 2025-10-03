export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  success: '#10b981',
  warning: '#f59e0b', 
  error: '#ef4444',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    900: '#111827'
  }
}

export const statusColors = {
  // Status de Processo
  'AGUARDANDO_DOCUMENTOS': '#f59e0b', // warning
  'EM_ANDAMENTO': '#3b82f6',          // primary  
  'AGUARDANDO_PAGAMENTO': '#f97316',  // orange
  'CONCLUIDO': '#10b981',             // success
  'CANCELADO': '#ef4444',             // error
  
  // Prioridade
  'BAIXA': '#6b7280',    // gray
  'MEDIA': '#3b82f6',    // blue
  'ALTA': '#f59e0b',     // warning
  'URGENTE': '#ef4444'   // error
}

export const TIPOS_SERVICO = [
  { 
    id: 'LICENCIAMENTO', 
    label: 'Licenciamento Anual',
    icon: 'file-document',
    color: '#3b82f6',
    prazoMedio: 5 // dias
  },
  { 
    id: 'TRANSFERENCIA', 
    label: 'Transferência',
    icon: 'car-arrow-right',
    color: '#f59e0b',
    prazoMedio: 15
  },
  { 
    id: 'PRIMEIRA_HABILITACAO', 
    label: 'Primeira Habilitação',
    icon: 'card-account-details',
    color: '#10b981',
    prazoMedio: 30
  },
  { 
    id: 'RENOVACAO_CNH', 
    label: 'Renovação CNH',
    icon: 'card-refresh',
    color: '#8b5cf6',
    prazoMedio: 10
  },
  { 
    id: 'IPVA', 
    label: 'IPVA',
    icon: 'cash',
    color: '#f97316',
    prazoMedio: 3
  },
  { 
    id: 'MULTA', 
    label: 'Multa',
    icon: 'alert',
    color: '#ef4444',
    prazoMedio: 7
  },
  { 
    id: 'VISTORIA', 
    label: 'Vistoria',
    icon: 'magnify',
    color: '#06b6d4',
    prazoMedio: 5
  }
]

export const CATEGORIAS_RECEITA = [
  'Serviços Prestados',
  'Emolumentos', 
  'Taxas Administrativas',
  'Consultoria'
]

export const CATEGORIAS_DESPESA = [
  'Emolumentos Cartório',
  'Taxas DETRAN',
  'Despesas Operacionais',
  'Material de Escritório'
]
