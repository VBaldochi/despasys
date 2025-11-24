'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LockOpenIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  BanknotesIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline'
import NovoDesbloqueioModal, { UnlockFormData } from '@/components/admin/NovoDesbloqueioModal'

interface Unlock {
  id: string
  // Customer Info
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerCpf: string
  // Vehicle Info
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  vehiclePlate: string
  chassisNumber?: string
  renavam: string
  // Unlock Info
  status: 'SOLICITADO' | 'DOCUMENTOS_PENDENTES' | 'ANALISE_ORGAO' | 'EM_PROCESSAMENTO' | 'CONCLUIDO' | 'REJEITADO'
  unlockType: 'ADMINISTRATIVO' | 'JUDICIAL' | 'MULTAS' | 'IPVA' | 'FURTO_ROUBO' | 'OUTROS'
  issueDescription: string
  requestedDate: string
  completedDate?: string
  fees: {
    detran: number
    service: number
    total: number
  }
  documents: {
    required: string[]
    received: string[]
  }
  blockReason: string
  blockDate?: string
  responsibleOrgan: string // DETRAN, Polícia Civil, Judiciário, etc
  notes?: string
  priority: 'NORMAL' | 'URGENTE'
  createdAt: string
}

export default function UnlocksPage() {
  const [unlocks, setUnlocks] = useState<Unlock[]>([])
  const [filteredUnlocks, setFilteredUnlocks] = useState<Unlock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SOLICITADO' | 'DOCUMENTOS_PENDENTES' | 'ANALISE_ORGAO' | 'EM_PROCESSAMENTO' | 'CONCLUIDO' | 'REJEITADO'>('ALL')
  const [filterType, setFilterType] = useState<'ALL' | 'ADMINISTRATIVO' | 'JUDICIAL' | 'MULTAS' | 'IPVA' | 'FURTO_ROUBO' | 'OUTROS'>('ALL')
  const [selectedUnlock, setSelectedUnlock] = useState<Unlock | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isNovoDesbloqueioModalOpen, setIsNovoDesbloqueioModalOpen] = useState(false)

  // Mock data para demonstração
  const mockUnlocks: Unlock[] = [
    {
      id: '1',
      customerName: 'João Silva',
      customerPhone: '(16) 99999-1111',
      customerEmail: 'joao@email.com',
      customerCpf: '123.456.789-01',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic',
      vehicleYear: '2020',
      vehiclePlate: 'ABC-1234',
      chassisNumber: '9BWZZZ377VT004251',
      renavam: '00123456789',
      status: 'SOLICITADO',
      unlockType: 'MULTAS',
      issueDescription: 'Veículo bloqueado por excesso de multas pendentes',
      blockReason: 'Excesso de multas não pagas',
      blockDate: '2025-06-15',
      responsibleOrgan: 'DETRAN/SP',
      requestedDate: '2025-07-27',
      fees: {
        detran: 95.75,
        service: 80.00,
        total: 175.75
      },
      documents: {
        required: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'Quitação Multas'],
        received: ['CRV', 'CNH', 'CPF']
      },
      priority: 'NORMAL',
      createdAt: '2025-07-27'
    },
    {
      id: '2',
      customerName: 'Maria Santos',
      customerPhone: '(16) 99999-2222',
      customerEmail: 'maria@email.com',
      customerCpf: '987.654.321-02',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      vehicleYear: '2019',
      vehiclePlate: 'DEF-5678',
      renavam: '00987654321',
      status: 'EM_PROCESSAMENTO',
      unlockType: 'IPVA',
      issueDescription: 'Bloqueio por IPVA em atraso',
      blockReason: 'IPVA 2024 não pago',
      blockDate: '2025-03-01',
      responsibleOrgan: 'SEFAZ/SP',
      requestedDate: '2025-07-25',
      fees: {
        detran: 95.75,
        service: 80.00,
        total: 175.75
      },
      documents: {
        required: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'Quitação IPVA'],
        received: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'Quitação IPVA']
      },
      priority: 'URGENTE',
      notes: 'Cliente precisa do veículo para trabalho urgente',
      createdAt: '2025-07-25'
    },
    {
      id: '3',
      customerName: 'Carlos Oliveira',
      customerPhone: '(16) 99999-3333',
      customerCpf: '111.222.333-44',
      vehicleBrand: 'Volkswagen',
      vehicleModel: 'Gol',
      vehicleYear: '2018',
      vehiclePlate: 'GHI-9012',
      renavam: '00456789123',
      status: 'CONCLUIDO',
      unlockType: 'FURTO_ROUBO',
      issueDescription: 'Desbloqueio após recuperação de veículo roubado',
      blockReason: 'Registro de furto/roubo',
      blockDate: '2025-04-10',
      responsibleOrgan: 'Polícia Civil/SP',
      requestedDate: '2025-07-20',
      completedDate: '2025-07-23',
      fees: {
        detran: 145.50,
        service: 120.00,
        total: 265.50
      },
      documents: {
        required: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'BO Recuperação', 'Laudo Pericial'],
        received: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'BO Recuperação', 'Laudo Pericial']
      },
      priority: 'NORMAL',
      createdAt: '2025-07-20'
    },
    {
      id: '4',
      customerName: 'Roberto Mendes',
      customerPhone: '(16) 99999-4444',
      customerCpf: '555.666.777-88',
      vehicleBrand: 'Ford',
      vehicleModel: 'Ka',
      vehicleYear: '2021',
      vehiclePlate: 'JKL-3456',
      renavam: '00789123456',
      status: 'DOCUMENTOS_PENDENTES',
      unlockType: 'ADMINISTRATIVO',
      issueDescription: 'Bloqueio administrativo por pendência documental',
      blockReason: 'Irregularidade na documentação',
      blockDate: '2025-05-20',
      responsibleOrgan: 'DETRAN/SP',
      requestedDate: '2025-07-26',
      fees: {
        detran: 75.50,
        service: 60.00,
        total: 135.50
      },
      documents: {
        required: ['CRV', 'CNH', 'CPF', 'Comprovante Residência', 'Certidão Negativa'],
        received: ['CRV', 'CNH']
      },
      priority: 'NORMAL',
      notes: 'Faltam documentos de comprovante de residência e certidão negativa',
      createdAt: '2025-07-26'
    }
  ]

  useEffect(() => {
    fetchUnlocks()
  }, [])

  const normalizeUnlock = (unlock: any): Unlock => {
    // Garante que fees e documents existem e têm estrutura esperada
    return {
      ...unlock,
      fees: unlock.fees ?? {
        detran: unlock.unlockValue ?? 0,
        service: unlock.serviceValue ?? 0,
        total: unlock.totalValue ?? ((unlock.unlockValue ?? 0) + (unlock.serviceValue ?? 0))
      },
      documents: unlock.documents ?? { required: [], received: [] },
    }
  }

  const fetchUnlocks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/unlocks')
      if (response.ok) {
        const data = await response.json()
        // Normaliza todos os unlocks recebidos do backend
        const normalized = Array.isArray(data) ? data.map(normalizeUnlock) : []
        setUnlocks(normalized)
        setFilteredUnlocks(normalized)
      } else {
        setUnlocks(mockUnlocks)
        setFilteredUnlocks(mockUnlocks)
      }
    } catch (error) {
      console.error('Error fetching unlocks:', error)
      setUnlocks(mockUnlocks)
      setFilteredUnlocks(mockUnlocks)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar desbloqueios
  useEffect(() => {
    let filtered = unlocks

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(unlock =>
        unlock.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unlock.customerPhone.includes(searchTerm) ||
        unlock.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unlock.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unlock.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unlock.renavam.includes(searchTerm) ||
        unlock.id.includes(searchTerm) ||
        unlock.issueDescription.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(unlock => unlock.status === filterStatus)
    }

    // Filtro por tipo
    if (filterType !== 'ALL') {
      filtered = filtered.filter(unlock => unlock.unlockType === filterType)
    }

    setFilteredUnlocks(filtered)
  }, [unlocks, searchTerm, filterStatus, filterType])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SOLICITADO: { color: 'bg-blue-100 text-blue-800', text: 'Solicitado', icon: ClockIcon },
      DOCUMENTOS_PENDENTES: { color: 'bg-orange-100 text-orange-800', text: 'Docs Pendentes', icon: DocumentTextIcon },
      ANALISE_ORGAO: { color: 'bg-purple-100 text-purple-800', text: 'Análise Órgão', icon: ShieldExclamationIcon },
      EM_PROCESSAMENTO: { color: 'bg-yellow-100 text-yellow-800', text: 'Processando', icon: ClockIcon },
      CONCLUIDO: { color: 'bg-green-100 text-green-800', text: 'Concluído', icon: CheckIcon },
      REJEITADO: { color: 'bg-red-100 text-red-800', text: 'Rejeitado', icon: XMarkIcon },
      // Backend enums
      ANALYSIS: { color: 'bg-blue-100 text-blue-800', text: 'Em Análise', icon: ClockIcon },
      PENDING_DOCS: { color: 'bg-orange-100 text-orange-800', text: 'Docs Pendentes', icon: DocumentTextIcon },
      PROCESSING: { color: 'bg-yellow-100 text-yellow-800', text: 'Processando', icon: ClockIcon },
      DETRAN_PROCESSING: { color: 'bg-purple-100 text-purple-800', text: 'Processando DETRAN', icon: ShieldExclamationIcon },
      COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Concluído', icon: CheckIcon },
      CANCELLED: { color: 'bg-red-100 text-red-800', text: 'Cancelado', icon: XMarkIcon }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) {
      // Status desconhecido: fallback visual
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
          ?
          {status}
        </span>
      );
    }
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      ADMINISTRATIVO: { color: 'bg-blue-100 text-blue-800', text: 'Administrativo' },
      JUDICIAL: { color: 'bg-red-100 text-red-800', text: 'Judicial' },
      MULTAS: { color: 'bg-orange-100 text-orange-800', text: 'Multas' },
      IPVA: { color: 'bg-purple-100 text-purple-800', text: 'IPVA' },
      FURTO_ROUBO: { color: 'bg-gray-100 text-gray-800', text: 'Furto/Roubo' },
      OUTROS: { color: 'bg-green-100 text-green-800', text: 'Outros' },
      // Backend enums
      MULTA: { color: 'bg-orange-100 text-orange-800', text: 'Multa' },
      ROUBO_FURTO: { color: 'bg-gray-100 text-gray-800', text: 'Roubo/Furto' },
      RESTRICAO_AMBIENTAL: { color: 'bg-green-100 text-green-800', text: 'Restrição Ambiental' },
      RESTRICAO_JUDICIAL: { color: 'bg-red-100 text-red-800', text: 'Restrição Judicial' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    if (!config) {
      // Tipo desconhecido: fallback visual
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
          ? {type}
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === 'URGENTE') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          <ExclamationTriangleIcon className="h-3 w-3" />
          Urgente
        </span>
      )
    }
    return null
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getDocumentProgress = (documents: { required: string[]; received: string[] }) => {
    const progress = (documents.received.length / documents.required.length) * 100
    return {
      progress: Math.round(progress),
      received: documents.received.length,
      total: documents.required.length
    }
  }

  const handleViewUnlock = (unlock: Unlock) => {
    setSelectedUnlock(unlock)
    setShowModal(true)
  }

  const handleStatusChange = (unlockId: string, newStatus: 'ANALISE_ORGAO' | 'EM_PROCESSAMENTO' | 'CONCLUIDO') => {
    setUnlocks(prev => prev.map(unlock => 
      unlock.id === unlockId ? { 
        ...unlock, 
        status: newStatus,
        ...(newStatus === 'CONCLUIDO' ? { completedDate: new Date().toISOString().split('T')[0] } : {})
      } : unlock
    ))
  }

  const handleAddUnlock = async (data: UnlockFormData) => {
    try {
      const response = await fetch('/api/unlocks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchUnlocks()
      } else {
        const error = await response.json()
        console.error('Error creating unlock:', error)
      }
    } catch (error) {
      console.error('Error creating unlock:', error)
    }
  }

  if (loading) {
    return (
      
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      
    )
  }

  // Estatísticas dos desbloqueios
  // Considera todos os enums possíveis do backend e frontend
  const pendingStatuses = [
    'SOLICITADO', 'DOCUMENTOS_PENDENTES', 'ANALISE_ORGAO', 'EM_PROCESSAMENTO',
    'ANALYSIS', 'PENDING_DOCS', 'PROCESSING', 'DETRAN_PROCESSING'
  ];
  const completedStatuses = ['CONCLUIDO', 'COMPLETED'];
  const rejectedStatuses = ['REJEITADO', 'CANCELLED'];
  const docsNeededStatuses = ['DOCUMENTOS_PENDENTES', 'PENDING_DOCS'];

  const stats = {
    total: unlocks.length,
    pending: unlocks.filter(u => pendingStatuses.includes(u.status)).length,
    completed: unlocks.filter(u => completedStatuses.includes(u.status)).length,
    rejected: unlocks.filter(u => rejectedStatuses.includes(u.status)).length,
    documentsNeeded: unlocks.filter(u => docsNeededStatuses.includes(u.status)).length,
    totalValue: unlocks.reduce((sum, u) => sum + (u.fees?.total || 0), 0)
  };

  return (
    
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <LockOpenIcon className="h-8 w-8 text-blue-600" />
                Desbloqueios
              </h1>
              <p className="text-gray-600 mt-2">Gerencie desbloqueios de veículos</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar
              </button>
              <button 
                onClick={() => setIsNovoDesbloqueioModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Novo Desbloqueio
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <LockOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XMarkIcon className="h-6 w-6 text-red-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Docs Pendentes</p>
                <p className="text-xl font-bold text-orange-600">{stats.documentsNeeded}</p>
              </div>
              <DocumentTextIcon className="h-6 w-6 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(stats.totalValue)}</p>
              </div>
              <BanknotesIcon className="h-6 w-6 text-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar desbloqueios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="SOLICITADO">Solicitados</option>
                  <option value="DOCUMENTOS_PENDENTES">Docs Pendentes</option>
                  <option value="ANALISE_ORGAO">Análise Órgão</option>
                  <option value="EM_PROCESSAMENTO">Em Processamento</option>
                  <option value="CONCLUIDO">Concluídos</option>
                  <option value="REJEITADO">Rejeitados</option>
                </select>
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todos os Tipos</option>
                <option value="ADMINISTRATIVO">Administrativo</option>
                <option value="JUDICIAL">Judicial</option>
                <option value="MULTAS">Multas</option>
                <option value="IPVA">IPVA</option>
                <option value="FURTO_ROUBO">Furto/Roubo</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredUnlocks.length} de {unlocks.length} desbloqueios
            </div>
          </div>
        </div>

        {/* Unlocks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUnlocks.map((unlock, idx) => {
            const docProgress = getDocumentProgress(unlock.documents);
            const displayNumber = idx + 1;
            return (
              <motion.div
                key={unlock.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Desbloqueio #{displayNumber}
                      </h3>
                      <p className="text-sm text-gray-600">{getTypeBadge(unlock.unlockType)}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(unlock.status)}
                      {unlock.priority === 'URGENTE' && getPriorityBadge(unlock.priority)}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-gray-900">
                      {unlock.vehicleBrand} {unlock.vehicleModel} {unlock.vehicleYear}
                    </p>
                    <p className="text-sm text-gray-600">Placa: {unlock.vehiclePlate}</p>
                    <p className="text-sm text-red-600 font-medium">
                      <ExclamationCircleIcon className="inline h-4 w-4 mr-1" />
                      Bloqueado: {unlock.blockReason}
                    </p>
                  </div>

                  {/* Issue Description */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Motivo do Bloqueio</p>
                      <p className="text-sm text-gray-700">{unlock.issueDescription}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Cliente</p>
                      <p className="text-sm font-medium text-gray-900">{unlock.customerName}</p>
                      <p className="text-sm text-gray-600">{unlock.customerPhone}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Órgão Responsável</p>
                      <p className="text-sm text-gray-700">{unlock.responsibleOrgan}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taxa Total:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(unlock.fees.total)}
                      </span>
                    </div>

                    {/* Document Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Documentos:</span>
                        <span className="text-sm text-gray-900">{docProgress.received}/{docProgress.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${docProgress.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${docProgress.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Solicitado:</span>
                      <span className="text-sm text-gray-900">{formatDate(unlock.requestedDate)}</span>
                    </div>

                    {unlock.blockDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Bloqueado em:</span>
                        <span className="text-sm text-red-600">{formatDate(unlock.blockDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewUnlock(unlock)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Ver Detalhes
                    </button>

                    {unlock.status === 'SOLICITADO' && (
                      <button
                        onClick={() => handleStatusChange(unlock.id, 'ANALISE_ORGAO')}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <ShieldExclamationIcon className="h-4 w-4" />
                        Analisar
                      </button>
                    )}

                    {unlock.status === 'ANALISE_ORGAO' && (
                      <button
                        onClick={() => handleStatusChange(unlock.id, 'EM_PROCESSAMENTO')}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                      >
                        <ClockIcon className="h-4 w-4" />
                        Processar
                      </button>
                    )}

                    {unlock.status === 'EM_PROCESSAMENTO' && (
                      <button
                        onClick={() => handleStatusChange(unlock.id, 'CONCLUIDO')}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <CheckIcon className="h-4 w-4" />
                        Concluir
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredUnlocks.length === 0 && (
          <div className="text-center py-12">
            <LockOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum desbloqueio encontrado</p>
          </div>
        )}

        {/* Unlock Details Modal */}
        {showModal && selectedUnlock && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalhes do Desbloqueio #{selectedUnlock.id}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Cliente</h4>
                    <div className="space-y-2">
                      <p><strong>Nome:</strong> {selectedUnlock.customerName}</p>
                      <p><strong>CPF:</strong> {selectedUnlock.customerCpf}</p>
                      <p><strong>Telefone:</strong> {selectedUnlock.customerPhone}</p>
                      {selectedUnlock.customerEmail && (
                        <p><strong>Email:</strong> {selectedUnlock.customerEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Veículo</h4>
                    <div className="space-y-2">
                      <p><strong>Marca:</strong> {selectedUnlock.vehicleBrand}</p>
                      <p><strong>Modelo:</strong> {selectedUnlock.vehicleModel}</p>
                      <p><strong>Ano:</strong> {selectedUnlock.vehicleYear}</p>
                      <p><strong>Placa:</strong> {selectedUnlock.vehiclePlate}</p>
                      <p><strong>RENAVAM:</strong> {selectedUnlock.renavam}</p>
                      {selectedUnlock.chassisNumber && (
                        <p><strong>Chassi:</strong> {selectedUnlock.chassisNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Unlock Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Desbloqueio</h4>
                    <div className="space-y-2">
                      <p><strong>Status:</strong> {getStatusBadge(selectedUnlock.status)}</p>
                      <p><strong>Tipo:</strong> {getTypeBadge(selectedUnlock.unlockType)}</p>
                      {selectedUnlock.priority === 'URGENTE' && (
                        <p><strong>Prioridade:</strong> {getPriorityBadge(selectedUnlock.priority)}</p>
                      )}
                      <p><strong>Solicitado:</strong> {formatDate(selectedUnlock.requestedDate)}</p>
                      {selectedUnlock.completedDate && (
                        <p><strong>Concluído:</strong> {formatDate(selectedUnlock.completedDate)}</p>
                      )}
                      <p><strong>Órgão:</strong> {selectedUnlock.responsibleOrgan}</p>
                    </div>
                  </div>

                  {/* Block Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Informações do Bloqueio</h4>
                    <div className="space-y-2">
                      <p><strong>Motivo:</strong> {selectedUnlock.blockReason}</p>
                      <p><strong>Descrição:</strong> {selectedUnlock.issueDescription}</p>
                      {selectedUnlock.blockDate && (
                        <p><strong>Data do Bloqueio:</strong> {formatDate(selectedUnlock.blockDate)}</p>
                      )}
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Valores</h4>
                    <div className="space-y-2">
                      <p><strong>Taxa DETRAN:</strong> {formatCurrency(selectedUnlock.fees.detran)}</p>
                      <p><strong>Taxa Serviço:</strong> {formatCurrency(selectedUnlock.fees.service)}</p>
                      <p><strong>Total:</strong> <span className="text-lg font-bold text-green-600">{formatCurrency(selectedUnlock.fees.total)}</span></p>
                    </div>
                  </div>

                  {/* Documents Status */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Status dos Documentos</h4>
                    <div className="space-y-3">
                      {selectedUnlock.documents.required.map((doc, index) => {
                        const isReceived = selectedUnlock.documents.received.includes(doc)
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{doc}</span>
                            {isReceived ? (
                              <CheckIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <XMarkIcon className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedUnlock.notes && (
                    <div className="lg:col-span-3">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Observações</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedUnlock.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  {selectedUnlock.status === 'SOLICITADO' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedUnlock.id, 'ANALISE_ORGAO')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <ShieldExclamationIcon className="h-4 w-4" />
                      Enviar para Análise
                    </button>
                  )}

                  {selectedUnlock.status === 'ANALISE_ORGAO' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedUnlock.id, 'EM_PROCESSAMENTO')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <ClockIcon className="h-4 w-4" />
                      Iniciar Processamento
                    </button>
                  )}

                  {selectedUnlock.status === 'EM_PROCESSAMENTO' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedUnlock.id, 'CONCLUIDO')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Marcar como Concluído
                    </button>
                  )}

                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Novo Desbloqueio */}
        <NovoDesbloqueioModal
          isOpen={isNovoDesbloqueioModalOpen}
          onClose={() => setIsNovoDesbloqueioModalOpen(false)}
          onSubmit={handleAddUnlock}
        />
      </div>
    
  )
}
