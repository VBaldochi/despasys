import { create } from 'zustand'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export type ProcessStatus = 'STARTED' | 'DOCUMENTS_RECEIVED' | 'PROCESSING' | 'WAITING_CLIENT' | 'COMPLETED' | 'CANCELLED'
export type ProcessPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface ProcessStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  completedAt?: Date
  estimatedDate?: Date
  documents?: string[]
  notes?: string
}

export interface ProcessDocument {
  id: string
  name: string
  type: string
  url: string
  uploadedAt: Date
  size: number
  status: 'pending' | 'approved' | 'rejected'
}

export interface ProcessNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  createdAt: Date
  read: boolean
}

export interface Process {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerCPF?: string
  title: string
  description: string
  serviceType: string
  status: ProcessStatus
  priority: ProcessPriority
  startDate: Date
  endDate?: Date
  estimatedEndDate?: Date
  steps: ProcessStep[]
  documents: ProcessDocument[]
  notifications: ProcessNotification[]
  progress: number
  totalCost?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface ProcessState {
  processes: Process[]
  selectedProcess: Process | null
  isLoading: boolean
  searchTerm: string
  statusFilter: ProcessStatus | 'ALL'
  priorityFilter: ProcessPriority | 'ALL'
  
  // Actions
  setProcesses: (processes: Process[]) => void
  setSelectedProcess: (process: Process | null) => void
  setIsLoading: (loading: boolean) => void
  setSearchTerm: (term: string) => void
  setStatusFilter: (status: ProcessStatus | 'ALL') => void
  setPriorityFilter: (priority: ProcessPriority | 'ALL') => void
  addProcess: (process: Omit<Process, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProcess: (id: string, updates: Partial<Process>) => void
  deleteProcess: (id: string) => void
  updateProcessStep: (processId: string, stepId: string, updates: Partial<ProcessStep>) => void
  addDocument: (processId: string, document: Omit<ProcessDocument, 'id' | 'uploadedAt'>) => void
  addNotification: (processId: string, notification: Omit<ProcessNotification, 'id' | 'createdAt'>) => void
  markNotificationAsRead: (processId: string, notificationId: string) => void
  getProcessById: (id: string) => Process | undefined
  getProcessesByCustomer: (customerId: string) => Process[]
  getFilteredProcesses: () => Process[]
  calculateProgress: (process: Process) => number
}

// Mock data para demonstração
const MOCK_PROCESSES: Process[] = [
  {
    id: '1',
    customerId: 'customer-1',
    customerName: 'João Silva',
    customerPhone: '(16) 99999-9999',
    customerEmail: 'joao@email.com',
    customerCPF: '12345678900',
    title: 'Licenciamento Anual - Honda Civic',
    description: 'Licenciamento anual do veículo Honda Civic 2020',
    serviceType: 'licenciamento',
    status: 'PROCESSING',
    priority: 'MEDIUM',
    startDate: new Date('2024-01-15'),
    estimatedEndDate: new Date('2024-01-25'),
    progress: 75,
    totalCost: 280.50,
    steps: [
      {
        id: 'step-1',
        title: 'Recebimento dos Documentos',
        description: 'Documentos do veículo e proprietário recebidos',
        status: 'completed',
        completedAt: new Date('2024-01-16'),
        documents: ['doc1.pdf', 'doc2.pdf']
      },
      {
        id: 'step-2',
        title: 'Análise da Documentação',
        description: 'Verificação e validação dos documentos',
        status: 'completed',
        completedAt: new Date('2024-01-18'),
      },
      {
        id: 'step-3',
        title: 'Pagamento das Taxas',
        description: 'Pagamento das taxas no DETRAN',
        status: 'in_progress',
        estimatedDate: new Date('2024-01-22'),
      },
      {
        id: 'step-4',
        title: 'Emissão do Licenciamento',
        description: 'Emissão do documento de licenciamento',
        status: 'pending',
        estimatedDate: new Date('2024-01-24'),
      },
      {
        id: 'step-5',
        title: 'Entrega dos Documentos',
        description: 'Entrega dos documentos ao cliente',
        status: 'pending',
        estimatedDate: new Date('2024-01-25'),
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'CNH.pdf',
        type: 'application/pdf',
        url: '/documents/cnh.pdf',
        uploadedAt: new Date('2024-01-15'),
        size: 1024000,
        status: 'approved'
      },
      {
        id: 'doc-2',
        name: 'CRLV.pdf',
        type: 'application/pdf',
        url: '/documents/crlv.pdf',
        uploadedAt: new Date('2024-01-15'),
        size: 2048000,
        status: 'approved'
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        title: 'Processo Iniciado',
        message: 'Seu processo de licenciamento foi iniciado',
        type: 'info',
        createdAt: new Date('2024-01-15'),
        read: true
      },
      {
        id: 'notif-2',
        title: 'Documentos Aprovados',
        message: 'Todos os documentos foram aprovados',
        type: 'success',
        createdAt: new Date('2024-01-18'),
        read: false
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    customerId: 'customer-2',
    customerName: 'Maria Santos',
    customerPhone: '(16) 88888-8888',
    customerEmail: 'maria@email.com',
    customerCPF: '98765432100',
    title: 'Transferência de Propriedade - Toyota Corolla',
    description: 'Transferência de propriedade do veículo Toyota Corolla 2019',
    serviceType: 'transferencia',
    status: 'WAITING_CLIENT',
    priority: 'HIGH',
    startDate: new Date('2024-01-10'),
    estimatedEndDate: new Date('2024-01-30'),
    progress: 40,
    totalCost: 450.00,
    steps: [
      {
        id: 'step-1',
        title: 'Recebimento dos Documentos',
        description: 'Documentos do veículo e proprietário recebidos',
        status: 'completed',
        completedAt: new Date('2024-01-11'),
      },
      {
        id: 'step-2',
        title: 'Análise da Documentação',
        description: 'Verificação e validação dos documentos',
        status: 'completed',
        completedAt: new Date('2024-01-13'),
      },
      {
        id: 'step-3',
        title: 'Aguardando Assinatura',
        description: 'Aguardando assinatura do comprador',
        status: 'in_progress',
        estimatedDate: new Date('2024-01-25'),
        notes: 'Cliente precisa comparecer para assinatura'
      },
      {
        id: 'step-4',
        title: 'Protocolo no DETRAN',
        description: 'Protocolo da transferência no DETRAN',
        status: 'pending',
        estimatedDate: new Date('2024-01-28'),
      }
    ],
    documents: [],
    notifications: [
      {
        id: 'notif-1',
        title: 'Ação Necessária',
        message: 'Você precisa comparecer ao escritório para assinatura',
        type: 'warning',
        createdAt: new Date('2024-01-20'),
        read: false
      }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20')
  }
]

export const useProcessStore = create<ProcessState>((set, get) => ({
  processes: MOCK_PROCESSES,
  selectedProcess: null,
  isLoading: false,
  searchTerm: '',
  statusFilter: 'ALL',
  priorityFilter: 'ALL',

  setProcesses: (processes) => set({ processes }),
  setSelectedProcess: (process) => set({ selectedProcess: process }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),

  addProcess: (processData) => {
    const newProcess: Process = {
      ...processData,
      id: `process-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    set((state) => ({
      processes: [...state.processes, newProcess]
    }))
  },

  updateProcess: (id, updates) => {
    set((state) => ({
      processes: state.processes.map(process =>
        process.id === id
          ? { ...process, ...updates, updatedAt: new Date() }
          : process
      )
    }))
  },

  deleteProcess: (id) => {
    set((state) => ({
      processes: state.processes.filter(process => process.id !== id)
    }))
  },

  updateProcessStep: (processId, stepId, updates) => {
    set((state) => ({
      processes: state.processes.map(process =>
        process.id === processId
          ? {
              ...process,
              steps: process.steps.map(step =>
                step.id === stepId ? { ...step, ...updates } : step
              ),
              updatedAt: new Date()
            }
          : process
      )
    }))
  },

  addDocument: (processId, documentData) => {
    const newDocument: ProcessDocument = {
      ...documentData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date()
    }
    set((state) => ({
      processes: state.processes.map(process =>
        process.id === processId
          ? {
              ...process,
              documents: [...process.documents, newDocument],
              updatedAt: new Date()
            }
          : process
      )
    }))
  },

  addNotification: (processId, notificationData) => {
    const newNotification: ProcessNotification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      createdAt: new Date(),
      read: false
    }
    set((state) => ({
      processes: state.processes.map(process =>
        process.id === processId
          ? {
              ...process,
              notifications: [...process.notifications, newNotification],
              updatedAt: new Date()
            }
          : process
      )
    }))
  },

  markNotificationAsRead: (processId, notificationId) => {
    set((state) => ({
      processes: state.processes.map(process =>
        process.id === processId
          ? {
              ...process,
              notifications: process.notifications.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
              ),
              updatedAt: new Date()
            }
          : process
      )
    }))
  },

  getProcessById: (id) => {
    return get().processes.find(process => process.id === id)
  },

  getProcessesByCustomer: (customerId) => {
    return get().processes.filter(process => process.customerId === customerId)
  },

  getFilteredProcesses: () => {
    const { processes, searchTerm, statusFilter, priorityFilter } = get()
    
    return processes.filter(process => {
      const matchesSearch = !searchTerm || 
        process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'ALL' || process.status === statusFilter
      const matchesPriority = priorityFilter === 'ALL' || process.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
  },

  calculateProgress: (process) => {
    const completedSteps = process.steps.filter(step => step.status === 'completed').length
    const totalSteps = process.steps.length
    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
  }
}))

// Utility functions
export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

export const getStatusColor = (status: ProcessStatus): string => {
  switch (status) {
    case 'STARTED':
      return 'bg-blue-100 text-blue-800'
    case 'DOCUMENTS_RECEIVED':
      return 'bg-purple-100 text-purple-800'
    case 'PROCESSING':
      return 'bg-yellow-100 text-yellow-800'
    case 'WAITING_CLIENT':
      return 'bg-orange-100 text-orange-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getStatusLabel = (status: ProcessStatus): string => {
  switch (status) {
    case 'STARTED':
      return 'Iniciado'
    case 'DOCUMENTS_RECEIVED':
      return 'Documentos Recebidos'
    case 'PROCESSING':
      return 'Em Processamento'
    case 'WAITING_CLIENT':
      return 'Aguardando Cliente'
    case 'COMPLETED':
      return 'Concluído'
    case 'CANCELLED':
      return 'Cancelado'
    default:
      return 'Desconhecido'
  }
}

export const getPriorityColor = (priority: ProcessPriority): string => {
  switch (priority) {
    case 'LOW':
      return 'bg-gray-100 text-gray-800'
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-800'
    case 'HIGH':
      return 'bg-orange-100 text-orange-800'
    case 'URGENT':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getPriorityLabel = (priority: ProcessPriority): string => {
  switch (priority) {
    case 'LOW':
      return 'Baixa'
    case 'MEDIUM':
      return 'Média'
    case 'HIGH':
      return 'Alta'
    case 'URGENT':
      return 'Urgente'
    default:
      return 'Desconhecida'
  }
}
