'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { motion } from 'framer-motion'
import {
  ArrowsRightLeftIcon,
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
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Transfer {
  id: string
  // Seller Info
  sellerName: string
  sellerPhone: string
  sellerEmail?: string
  sellerCpf: string
  // Buyer Info  
  buyerName: string
  buyerPhone: string
  buyerEmail?: string
  buyerCpf: string
  // Vehicle Info
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  vehiclePlate: string
  chassisNumber?: string
  renavam: string
  // Transfer Info
  status: 'SOLICITADA' | 'DOCUMENTOS_PENDENTES' | 'EM_PROCESSAMENTO' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDA' | 'CANCELADA'
  transferType: 'COMPRA_VENDA' | 'DOACAO' | 'HERANCA' | 'JUDICIAL'
  saleValue?: number
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
  notes?: string
  priority: 'NORMAL' | 'URGENTE'
  createdAt: string
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SOLICITADA' | 'DOCUMENTOS_PENDENTES' | 'EM_PROCESSAMENTO' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDA' | 'CANCELADA'>('ALL')
  const [filterType, setFilterType] = useState<'ALL' | 'COMPRA_VENDA' | 'DOACAO' | 'HERANCA' | 'JUDICIAL'>('ALL')
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Mock data para demonstração
  const mockTransfers: Transfer[] = [
    {
      id: '1',
      sellerName: 'João Silva',
      sellerPhone: '(16) 99999-1111',
      sellerEmail: 'joao@email.com',
      sellerCpf: '123.456.789-01',
      buyerName: 'Maria Santos',
      buyerPhone: '(16) 99999-2222',
      buyerEmail: 'maria@email.com',
      buyerCpf: '987.654.321-02',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic',
      vehicleYear: '2020',
      vehiclePlate: 'ABC-1234',
      chassisNumber: '9BWZZZ377VT004251',
      renavam: '00123456789',
      status: 'SOLICITADA',
      transferType: 'COMPRA_VENDA',
      saleValue: 65000,
      requestedDate: '2025-07-27',
      fees: {
        detran: 180.50,
        service: 120.00,
        total: 300.50
      },
      documents: {
        required: ['CRV', 'CNH Vendedor', 'CNH Comprador', 'Comprovante Residência Vendedor', 'Comprovante Residência Comprador', 'Contrato Compra/Venda'],
        received: ['CRV', 'CNH Vendedor', 'CNH Comprador']
      },
      priority: 'NORMAL',
      createdAt: '2025-07-27'
    },
    {
      id: '2',
      sellerName: 'Carlos Oliveira',
      sellerPhone: '(16) 99999-3333',
      sellerCpf: '111.222.333-44',
      buyerName: 'Ana Costa',
      buyerPhone: '(16) 99999-4444',
      buyerEmail: 'ana@email.com',
      buyerCpf: '555.666.777-88',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      vehicleYear: '2019',
      vehiclePlate: 'DEF-5678',
      renavam: '00987654321',
      status: 'EM_PROCESSAMENTO',
      transferType: 'COMPRA_VENDA',
      saleValue: 58000,
      requestedDate: '2025-07-25',
      fees: {
        detran: 180.50,
        service: 120.00,
        total: 300.50
      },
      documents: {
        required: ['CRV', 'CNH Vendedor', 'CNH Comprador', 'Comprovante Residência Vendedor', 'Comprovante Residência Comprador', 'Contrato Compra/Venda'],
        received: ['CRV', 'CNH Vendedor', 'CNH Comprador', 'Comprovante Residência Vendedor', 'Comprovante Residência Comprador', 'Contrato Compra/Venda']
      },
      priority: 'URGENTE',
      notes: 'Cliente precisa da transferência até sexta-feira',
      createdAt: '2025-07-25'
    },
    {
      id: '3',
      sellerName: 'Roberto Mendes',
      sellerPhone: '(16) 99999-5555',
      sellerCpf: '222.333.444-55',
      buyerName: 'Lucia Ferreira',
      buyerPhone: '(16) 99999-6666',
      buyerCpf: '666.777.888-99',
      vehicleBrand: 'Volkswagen',
      vehicleModel: 'Gol',
      vehicleYear: '2018',
      vehiclePlate: 'GHI-9012',
      renavam: '00456789123',
      status: 'CONCLUIDA',
      transferType: 'COMPRA_VENDA',
      saleValue: 35000,
      requestedDate: '2025-07-20',
      completedDate: '2025-07-23',
      fees: {
        detran: 180.50,
        service: 120.00,
        total: 300.50
      },
      documents: {
        required: ['CRV', 'CNH Vendedor', 'CNH Comprador', 'Comprovante Residência Vendedor', 'Comprovante Residência Comprador', 'Contrato Compra/Venda'],
        received: ['CRV', 'CNH Vendedor', 'CNH Comprador', 'Comprovante Residência Vendedor', 'Comprovante Residência Comprador', 'Contrato Compra/Venda']
      },
      priority: 'NORMAL',
      createdAt: '2025-07-20'
    },
    {
      id: '4',
      sellerName: 'José Santos',
      sellerPhone: '(16) 99999-7777',
      sellerCpf: '333.444.555-66',
      buyerName: 'Pedro Silva',
      buyerPhone: '(16) 99999-8888',
      buyerCpf: '777.888.999-00',
      vehicleBrand: 'Ford',
      vehicleModel: 'Ka',
      vehicleYear: '2021',
      vehiclePlate: 'JKL-3456',
      renavam: '00789123456',
      status: 'DOCUMENTOS_PENDENTES',
      transferType: 'COMPRA_VENDA',
      saleValue: 42000,
      requestedDate: '2025-07-26',
      fees: {
        detran: 180.50,
        service: 120.00,
        total: 300.50
      },
      documents: {
        required: ['CRV', 'CNH Vendedor', 'CNH Comprador', 'Comprovante Residência Vendedor', 'Comprovante Residência Comprador', 'Contrato Compra/Venda'],
        received: ['CRV', 'CNH Vendedor']
      },
      priority: 'NORMAL',
      notes: 'Faltam documentos do comprador',
      createdAt: '2025-07-26'
    }
  ]

  useEffect(() => {
    // Simular carregamento dos dados
    setTimeout(() => {
      setTransfers(mockTransfers)
      setFilteredTransfers(mockTransfers)
      setLoading(false)
    }, 1000)
  }, [])

  // Filtrar transferências
  useEffect(() => {
    let filtered = transfers

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(transfer =>
        transfer.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.sellerPhone.includes(searchTerm) ||
        transfer.buyerPhone.includes(searchTerm) ||
        transfer.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.renavam.includes(searchTerm) ||
        transfer.id.includes(searchTerm)
      )
    }

    // Filtro por status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(transfer => transfer.status === filterStatus)
    }

    // Filtro por tipo
    if (filterType !== 'ALL') {
      filtered = filtered.filter(transfer => transfer.transferType === filterType)
    }

    setFilteredTransfers(filtered)
  }, [transfers, searchTerm, filterStatus, filterType])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SOLICITADA: { color: 'bg-blue-100 text-blue-800', text: 'Solicitada', icon: ClockIcon },
      DOCUMENTOS_PENDENTES: { color: 'bg-orange-100 text-orange-800', text: 'Docs Pendentes', icon: DocumentTextIcon },
      EM_PROCESSAMENTO: { color: 'bg-yellow-100 text-yellow-800', text: 'Processando', icon: ClockIcon },
      AGUARDANDO_PAGAMENTO: { color: 'bg-purple-100 text-purple-800', text: 'Aguardando Pgto', icon: BanknotesIcon },
      CONCLUIDA: { color: 'bg-green-100 text-green-800', text: 'Concluída', icon: CheckIcon },
      CANCELADA: { color: 'bg-red-100 text-red-800', text: 'Cancelada', icon: XMarkIcon }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      COMPRA_VENDA: { color: 'bg-blue-100 text-blue-800', text: 'Compra/Venda' },
      DOACAO: { color: 'bg-green-100 text-green-800', text: 'Doação' },
      HERANCA: { color: 'bg-purple-100 text-purple-800', text: 'Herança' },
      JUDICIAL: { color: 'bg-red-100 text-red-800', text: 'Judicial' }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig]
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    )
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

  const handleViewTransfer = (transfer: Transfer) => {
    setSelectedTransfer(transfer)
    setShowModal(true)
  }

  const handleStatusChange = (transferId: string, newStatus: 'EM_PROCESSAMENTO' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDA') => {
    setTransfers(prev => prev.map(transfer => 
      transfer.id === transferId ? { 
        ...transfer, 
        status: newStatus,
        ...(newStatus === 'CONCLUIDA' ? { completedDate: new Date().toISOString().split('T')[0] } : {})
      } : transfer
    ))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  // Estatísticas das transferências
  const stats = {
    total: transfers.length,
    pending: transfers.filter(t => ['SOLICITADA', 'DOCUMENTOS_PENDENTES', 'EM_PROCESSAMENTO', 'AGUARDANDO_PAGAMENTO'].includes(t.status)).length,
    completed: transfers.filter(t => t.status === 'CONCLUIDA').length,
    documentsNeeded: transfers.filter(t => t.status === 'DOCUMENTOS_PENDENTES').length,
    totalValue: transfers.reduce((sum, t) => sum + t.fees.total, 0)
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ArrowsRightLeftIcon className="h-8 w-8 text-blue-600" />
                Transferências
              </h1>
              <p className="text-gray-600 mt-2">Gerencie transferências de propriedade veicular</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="h-4 w-4" />
                Nova Transferência
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
              <ArrowsRightLeftIcon className="h-8 w-8 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
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
                <p className="text-sm font-medium text-gray-600">Docs Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.documentsNeeded}</p>
              </div>
              <DocumentTextIcon className="h-8 w-8 text-orange-600" />
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
                  placeholder="Buscar transferências..."
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
                  <option value="SOLICITADA">Solicitadas</option>
                  <option value="DOCUMENTOS_PENDENTES">Docs Pendentes</option>
                  <option value="EM_PROCESSAMENTO">Em Processamento</option>
                  <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                  <option value="CONCLUIDA">Concluídas</option>
                  <option value="CANCELADA">Canceladas</option>
                </select>
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todos os Tipos</option>
                <option value="COMPRA_VENDA">Compra/Venda</option>
                <option value="DOACAO">Doação</option>
                <option value="HERANCA">Herança</option>
                <option value="JUDICIAL">Judicial</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredTransfers.length} de {transfers.length} transferências
            </div>
          </div>
        </div>

        {/* Transfers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTransfers.map((transfer) => {
            const docProgress = getDocumentProgress(transfer.documents)
            
            return (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Transferência #{transfer.id}
                      </h3>
                      <p className="text-sm text-gray-600">{getTypeBadge(transfer.transferType)}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(transfer.status)}
                      {transfer.priority === 'URGENTE' && getPriorityBadge(transfer.priority)}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-gray-900">
                      {transfer.vehicleBrand} {transfer.vehicleModel} {transfer.vehicleYear}
                    </p>
                    <p className="text-sm text-gray-600">Placa: {transfer.vehiclePlate}</p>
                  </div>

                  {/* Transfer Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Vendedor → Comprador</p>
                      <div className="flex items-center justify-center my-2">
                        <div className="text-sm text-gray-900 font-medium">{transfer.sellerName}</div>
                        <ArrowsRightLeftIcon className="mx-2 h-4 w-4 text-gray-400" />
                        <div className="text-sm text-gray-900 font-medium">{transfer.buyerName}</div>
                      </div>
                    </div>

                    {transfer.saleValue && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Valor da Venda:</span>
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(transfer.saleValue)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taxa Total:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(transfer.fees.total)}
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
                      <span className="text-sm text-gray-600">Solicitada:</span>
                      <span className="text-sm text-gray-900">{formatDate(transfer.requestedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewTransfer(transfer)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Ver Detalhes
                    </button>

                    {transfer.status === 'SOLICITADA' && (
                      <button
                        onClick={() => handleStatusChange(transfer.id, 'EM_PROCESSAMENTO')}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                      >
                        <ClockIcon className="h-4 w-4" />
                        Processar
                      </button>
                    )}

                    {transfer.status === 'EM_PROCESSAMENTO' && (
                      <button
                        onClick={() => handleStatusChange(transfer.id, 'CONCLUIDA')}
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
        {filteredTransfers.length === 0 && (
          <div className="text-center py-12">
            <ArrowsRightLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma transferência encontrada</p>
          </div>
        )}

        {/* Transfer Details Modal */}
        {showModal && selectedTransfer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalhes da Transferência #{selectedTransfer.id}
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
                  {/* Seller Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Vendedor</h4>
                    <div className="space-y-2">
                      <p><strong>Nome:</strong> {selectedTransfer.sellerName}</p>
                      <p><strong>CPF:</strong> {selectedTransfer.sellerCpf}</p>
                      <p><strong>Telefone:</strong> {selectedTransfer.sellerPhone}</p>
                      {selectedTransfer.sellerEmail && (
                        <p><strong>Email:</strong> {selectedTransfer.sellerEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Comprador</h4>
                    <div className="space-y-2">
                      <p><strong>Nome:</strong> {selectedTransfer.buyerName}</p>
                      <p><strong>CPF:</strong> {selectedTransfer.buyerCpf}</p>
                      <p><strong>Telefone:</strong> {selectedTransfer.buyerPhone}</p>
                      {selectedTransfer.buyerEmail && (
                        <p><strong>Email:</strong> {selectedTransfer.buyerEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Veículo</h4>
                    <div className="space-y-2">
                      <p><strong>Marca:</strong> {selectedTransfer.vehicleBrand}</p>
                      <p><strong>Modelo:</strong> {selectedTransfer.vehicleModel}</p>
                      <p><strong>Ano:</strong> {selectedTransfer.vehicleYear}</p>
                      <p><strong>Placa:</strong> {selectedTransfer.vehiclePlate}</p>
                      <p><strong>RENAVAM:</strong> {selectedTransfer.renavam}</p>
                      {selectedTransfer.chassisNumber && (
                        <p><strong>Chassi:</strong> {selectedTransfer.chassisNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Transfer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Transferência</h4>
                    <div className="space-y-2">
                      <p><strong>Tipo:</strong> {getTypeBadge(selectedTransfer.transferType)}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedTransfer.status)}</p>
                      {selectedTransfer.priority === 'URGENTE' && (
                        <p><strong>Prioridade:</strong> {getPriorityBadge(selectedTransfer.priority)}</p>
                      )}
                      <p><strong>Solicitada:</strong> {formatDate(selectedTransfer.requestedDate)}</p>
                      {selectedTransfer.completedDate && (
                        <p><strong>Concluída:</strong> {formatDate(selectedTransfer.completedDate)}</p>
                      )}
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Valores</h4>
                    <div className="space-y-2">
                      {selectedTransfer.saleValue && (
                        <p><strong>Valor Venda:</strong> {formatCurrency(selectedTransfer.saleValue)}</p>
                      )}
                      <p><strong>Taxa DETRAN:</strong> {formatCurrency(selectedTransfer.fees.detran)}</p>
                      <p><strong>Taxa Serviço:</strong> {formatCurrency(selectedTransfer.fees.service)}</p>
                      <p><strong>Total:</strong> <span className="text-lg font-bold text-green-600">{formatCurrency(selectedTransfer.fees.total)}</span></p>
                    </div>
                  </div>

                  {/* Documents Status */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Status dos Documentos</h4>
                    <div className="space-y-3">
                      {selectedTransfer.documents.required.map((doc, index) => {
                        const isReceived = selectedTransfer.documents.received.includes(doc)
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
                  {selectedTransfer.notes && (
                    <div className="lg:col-span-3">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Observações</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedTransfer.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  {selectedTransfer.status === 'SOLICITADA' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedTransfer.id, 'EM_PROCESSAMENTO')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <ClockIcon className="h-4 w-4" />
                      Iniciar Processamento
                    </button>
                  )}

                  {selectedTransfer.status === 'EM_PROCESSAMENTO' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedTransfer.id, 'CONCLUIDA')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Marcar como Concluída
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
      </div>
    </AdminLayout>
  )
}
