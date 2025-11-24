'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  BanknotesIcon,
  CalendarIcon,
  UserIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  TruckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import NovoLicenciamentoModal from '@/components/admin/NovoLicenciamentoModal'

interface Licensing {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  vehiclePlate: string
  chassisNumber?: string
  renavam: string
  status: 'SOLICITADO' | 'EM_PROCESSAMENTO' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDO' | 'VENCIDO'
  expirationDate: string
  requestedDate: string
  completedDate?: string
  value: number
  fees: {
    detran: number
    service: number
    total: number
  }
  documents: string[]
  notes?: string
  priority: 'NORMAL' | 'URGENTE'
  createdAt: string
}

export default function LicensingPage() {
  const [licensings, setLicensings] = useState<Licensing[]>([])
  const [filteredLicensings, setFilteredLicensings] = useState<Licensing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SOLICITADO' | 'EM_PROCESSAMENTO' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDO' | 'VENCIDO'>('ALL')
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'NORMAL' | 'URGENTE'>('ALL')
  const [selectedLicensing, setSelectedLicensing] = useState<Licensing | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isNovoLicenciamentoModalOpen, setIsNovoLicenciamentoModalOpen] = useState(false)

  // Mock data para demonstração
  const mockLicensings: Licensing[] = [
    {
      id: '1',
      customerName: 'João Silva',
      customerPhone: '(16) 99999-1111',
      customerEmail: 'joao@email.com',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic',
      vehicleYear: '2020',
      vehiclePlate: 'ABC-1234',
      chassisNumber: '9BWZZZ377VT004251',
      renavam: '00123456789',
      status: 'SOLICITADO',
      expirationDate: '2025-08-15',
      requestedDate: '2025-07-27',
      value: 198.50,
      fees: {
        detran: 148.50,
        service: 50.00,
        total: 198.50
      },
      documents: ['CNH', 'CRLV', 'Comprovante Residência'],
      priority: 'NORMAL',
      createdAt: '2025-07-27'
    },
    {
      id: '2',
      customerName: 'Maria Santos',
      customerPhone: '(16) 99999-2222',
      customerEmail: 'maria@email.com',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      vehicleYear: '2019',
      vehiclePlate: 'DEF-5678',
      renavam: '00987654321',
      status: 'EM_PROCESSAMENTO',
      expirationDate: '2025-07-30',
      requestedDate: '2025-07-25',
      value: 215.75,
      fees: {
        detran: 165.75,
        service: 50.00,
        total: 215.75
      },
      documents: ['CNH', 'CRLV', 'Comprovante Residência', 'Laudo de Vistoria'],
      priority: 'URGENTE',
      notes: 'Licenciamento próximo do vencimento',
      createdAt: '2025-07-25'
    },
    {
      id: '3',
      customerName: 'Carlos Oliveira',
      customerPhone: '(16) 99999-3333',
      vehicleBrand: 'Volkswagen',
      vehicleModel: 'Gol',
      vehicleYear: '2018',
      vehiclePlate: 'GHI-9012',
      renavam: '00456789123',
      status: 'CONCLUIDO',
      expirationDate: '2026-03-20',
      requestedDate: '2025-07-20',
      completedDate: '2025-07-22',
      value: 180.25,
      fees: {
        detran: 130.25,
        service: 50.00,
        total: 180.25
      },
      documents: ['CNH', 'CRLV', 'Comprovante Residência'],
      priority: 'NORMAL',
      createdAt: '2025-07-20'
    },
    {
      id: '4',
      customerName: 'Ana Costa',
      customerPhone: '(16) 99999-4444',
      customerEmail: 'ana@email.com',
      vehicleBrand: 'Ford',
      vehicleModel: 'Ka',
      vehicleYear: '2021',
      vehiclePlate: 'JKL-3456',
      renavam: '00789123456',
      status: 'VENCIDO',
      expirationDate: '2025-07-15',
      requestedDate: '2025-07-26',
      value: 245.80,
      fees: {
        detran: 195.80,
        service: 50.00,
        total: 245.80
      },
      documents: ['CNH', 'CRLV', 'Comprovante Residência'],
      priority: 'URGENTE',
      notes: 'Licenciamento vencido - multa aplicada',
      createdAt: '2025-07-26'
    }
  ]

  useEffect(() => {
    fetchLicensings()
  }, [])

  const fetchLicensings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/licensings')
      if (response.ok) {
        const data = await response.json()
        const licensingsData = data.length > 0 ? data : mockLicensings
        setLicensings(licensingsData)
        setFilteredLicensings(licensingsData)
      }
    } catch (error) {
      console.error('Erro ao buscar licenciamentos:', error)
      setLicensings(mockLicensings)
      setFilteredLicensings(mockLicensings)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLicensing = async (licenciamentoData: any) => {
    try {
      const response = await fetch('/api/licensings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(licenciamentoData)
      })

      if (response.ok) {
        await fetchLicensings()
        setIsNovoLicenciamentoModalOpen(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar licenciamento')
      }
    } catch (error) {
      console.error('Erro ao criar licenciamento:', error)
      alert('Erro ao criar licenciamento')
    }
  }

  // Filtrar licenciamentos
  useEffect(() => {
    let filtered = licensings

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(licensing =>
        licensing.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        licensing.customerPhone.includes(searchTerm) ||
        licensing.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        licensing.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        licensing.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        licensing.renavam.includes(searchTerm) ||
        licensing.id.includes(searchTerm)
      )
    }

    // Filtro por status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(licensing => licensing.status === filterStatus)
    }

    // Filtro por prioridade
    if (filterPriority !== 'ALL') {
      filtered = filtered.filter(licensing => licensing.priority === filterPriority)
    }

    setFilteredLicensings(filtered)
  }, [licensings, searchTerm, filterStatus, filterPriority])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-blue-100 text-blue-800', text: 'Pendente', icon: ClockIcon },
      DOCS_SENT: { color: 'bg-blue-100 text-blue-800', text: 'Docs Enviados', icon: ClockIcon },
      PROCESSING: { color: 'bg-yellow-100 text-yellow-800', text: 'Processando', icon: ClockIcon },
      COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Concluído', icon: CheckIcon },
      OVERDUE: { color: 'bg-red-100 text-red-800', text: 'Vencido', icon: ExclamationTriangleIcon },
      CANCELLED: { color: 'bg-gray-200 text-gray-600', text: 'Cancelado', icon: XMarkIcon },
      SOLICITADO: { color: 'bg-blue-100 text-blue-800', text: 'Solicitado', icon: ClockIcon },
      EM_PROCESSAMENTO: { color: 'bg-yellow-100 text-yellow-800', text: 'Processando', icon: ClockIcon },
      AGUARDANDO_PAGAMENTO: { color: 'bg-orange-100 text-orange-800', text: 'Aguardando Pgto', icon: BanknotesIcon },
      CONCLUIDO: { color: 'bg-green-100 text-green-800', text: 'Concluído', icon: CheckIcon },
      VENCIDO: { color: 'bg-red-100 text-red-800', text: 'Vencido', icon: ExclamationTriangleIcon }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
          {status || 'Desconhecido'}
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      NORMAL: { color: 'bg-gray-100 text-gray-800', text: 'Normal', icon: null },
      URGENTE: { color: 'bg-red-100 text-red-800', text: 'Urgente', icon: ExclamationTriangleIcon }
    }
    
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {Icon && <Icon className="h-3 w-3" />}
        {config.text}
      </span>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    if (!dateString || isNaN(Date.parse(dateString))) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  const isNearExpiration = (expirationDate: string) => {
    const expDate = new Date(expirationDate)
    const today = new Date()
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isExpired = (expirationDate: string) => {
    const expDate = new Date(expirationDate)
    const today = new Date()
    return expDate < today
  }

  const handleViewLicensing = (licensing: Licensing) => {
    setSelectedLicensing(licensing)
    setShowModal(true)
  }

  const handleStatusChange = (licensingId: string, newStatus: 'EM_PROCESSAMENTO' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDO') => {
    setLicensings(prev => prev.map(licensing => 
      licensing.id === licensingId ? { 
        ...licensing, 
        status: newStatus,
        ...(newStatus === 'CONCLUIDO' ? { completedDate: new Date().toISOString().split('T')[0] } : {})
      } : licensing
    ))
  }

  if (loading) {
    return (
      
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      
    )
  }

  // Estatísticas dos licenciamentos
  const stats = {
    total: licensings.length,
    pending: licensings.filter(l => ['PENDING', 'PROCESSING', 'DOCS_SENT', 'SOLICITADO', 'EM_PROCESSAMENTO', 'AGUARDANDO_PAGAMENTO'].includes(l.status)).length,
    completed: licensings.filter(l => ['COMPLETED', 'CONCLUIDO'].includes(l.status)).length,
    expired: licensings.filter(l => ['OVERDUE', 'VENCIDO'].includes(l.status)).length,
    nearExpiration: licensings.filter(l => isNearExpiration(l.expirationDate)).length,
    totalValue: licensings.reduce((sum, l) => sum + (typeof l.totalValue === 'number' ? l.totalValue : 0), 0)
  }

  return (
    
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                Licenciamentos
              </h1>
              <p className="text-gray-600 mt-2">Gerencie renovações de licenciamento veicular</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar
              </button>
              <button 
                onClick={() => setIsNovoLicenciamentoModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Novo Licenciamento
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Próximos ao Venc.</p>
                <p className="text-2xl font-bold text-orange-600">{stats.nearExpiration}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
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
                  placeholder="Buscar licenciamentos..."
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
                  <option value="EM_PROCESSAMENTO">Em Processamento</option>
                  <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                  <option value="CONCLUIDO">Concluídos</option>
                  <option value="VENCIDO">Vencidos</option>
                </select>
              </div>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todas as Prioridades</option>
                <option value="NORMAL">Normal</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredLicensings.length} de {licensings.length} licenciamentos
            </div>
          </div>
        </div>

        {/* Licensings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLicensings.map((licensing) => (
            <motion.div
              key={licensing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Licenciamento #{licensing.id}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      {licensing.customerName}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(licensing.status)}
                    {licensing.priority === 'URGENTE' && getPriorityBadge(licensing.priority)}
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900">
                    {licensing.vehicleBrand} {licensing.vehicleModel} {licensing.vehicleYear}
                  </p>
                  <p className="text-sm text-gray-600">Placa: {licensing.vehiclePlate}</p>
                  <p className="text-sm text-gray-600">RENAVAM: {licensing.renavam}</p>
                </div>

                {/* Expiration Warning */}
                {isExpired(licensing.expirationDate) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      Vencido em {formatDate(licensing.expirationDate)}
                    </p>
                  </div>
                )}

                {isNearExpiration(licensing.expirationDate) && !isExpired(licensing.expirationDate) && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-orange-800 font-medium flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      Vence em {formatDate(licensing.expirationDate)}
                    </p>
                  </div>
                )}

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(typeof licensing.totalValue === 'number' ? licensing.totalValue : 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Solicitado:</span>
                    <span className="text-sm text-gray-900">{formatDate(licensing.requestedDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Vencimento:</span>
                    <span className={`text-sm ${isExpired(licensing.expirationDate) ? 'text-red-600 font-medium' : 
                      isNearExpiration(licensing.expirationDate) ? 'text-orange-600 font-medium' : 'text-gray-900'}`}>
                      {formatDate(licensing.expirationDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleViewLicensing(licensing)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Ver Detalhes
                  </button>

                  {licensing.status === 'SOLICITADO' && (
                    <button
                      onClick={() => handleStatusChange(licensing.id, 'EM_PROCESSAMENTO')}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                    >
                      <ClockIcon className="h-4 w-4" />
                      Processar
                    </button>
                  )}

                  {licensing.status === 'EM_PROCESSAMENTO' && (
                    <button
                      onClick={() => handleStatusChange(licensing.id, 'CONCLUIDO')}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Concluir
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLicensings.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum licenciamento encontrado</p>
          </div>
        )}

        {/* Licensing Details Modal */}
        {showModal && selectedLicensing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalhes do Licenciamento #{selectedLicensing.id}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Informações do Cliente</h4>
                    <div className="space-y-2">
                      <p><strong>Nome:</strong> {selectedLicensing.customerName}</p>
                      <p><strong>Telefone:</strong> {selectedLicensing.customerPhone}</p>
                      {selectedLicensing.customerEmail && (
                        <p><strong>Email:</strong> {selectedLicensing.customerEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Informações do Veículo</h4>
                    <div className="space-y-2">
                      <p><strong>Marca:</strong> {selectedLicensing.vehicleBrand}</p>
                      <p><strong>Modelo:</strong> {selectedLicensing.vehicleModel}</p>
                      <p><strong>Ano:</strong> {selectedLicensing.vehicleYear}</p>
                      <p><strong>Placa:</strong> {selectedLicensing.vehiclePlate}</p>
                      <p><strong>RENAVAM:</strong> {selectedLicensing.renavam}</p>
                      {selectedLicensing.chassisNumber && (
                        <p><strong>Chassi:</strong> {selectedLicensing.chassisNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Status and Dates */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Status e Datas</h4>
                    <div className="space-y-2">
                      <p><strong>Status:</strong> {getStatusBadge(selectedLicensing.status)}</p>
                      <p><strong>Prioridade:</strong> {getPriorityBadge(selectedLicensing.priority)}</p>
                      <p><strong>Solicitado:</strong> {formatDate(selectedLicensing.requestedDate)}</p>
                      <p><strong>Vencimento:</strong> <span className={isExpired(selectedLicensing.expirationDate) ? 'text-red-600 font-medium' : 
                        isNearExpiration(selectedLicensing.expirationDate) ? 'text-orange-600 font-medium' : ''}>
                        {formatDate(selectedLicensing.expirationDate)}
                      </span></p>
                      {selectedLicensing.completedDate && (
                        <p><strong>Concluído:</strong> {formatDate(selectedLicensing.completedDate)}</p>
                      )}
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Informações Financeiras</h4>
                    <div className="space-y-2">
                      <p><strong>Taxa DETRAN:</strong> {formatCurrency(selectedLicensing.fees.detran)}</p>
                      <p><strong>Taxa de Serviço:</strong> {formatCurrency(selectedLicensing.fees.service)}</p>
                      <p><strong>Total:</strong> <span className="text-lg font-bold text-green-600">{formatCurrency(selectedLicensing.fees.total)}</span></p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Documentos Necessários</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLicensing.documents.map((doc, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedLicensing.notes && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Observações</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedLicensing.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  {selectedLicensing.status === 'SOLICITADO' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedLicensing.id, 'EM_PROCESSAMENTO')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <ClockIcon className="h-4 w-4" />
                      Iniciar Processamento
                    </button>
                  )}

                  {selectedLicensing.status === 'EM_PROCESSAMENTO' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedLicensing.id, 'CONCLUIDO')
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

        {/* Modal Novo Licenciamento */}
        <NovoLicenciamentoModal
          isOpen={isNovoLicenciamentoModalOpen}
          onClose={() => setIsNovoLicenciamentoModalOpen(false)}
          onSubmit={handleAddLicensing}
        />
      </div>
    
  )
}
