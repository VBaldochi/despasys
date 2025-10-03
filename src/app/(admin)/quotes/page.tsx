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
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

interface Quote {
  id: string
  customerName: string
  customerPhone: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  vehicleColor: string
  services: string[]
  totalValue: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  createdAt: string
  validUntil: string
  notes?: string
  estimatedDays: number
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED'>('ALL')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Mock data - será substituído por dados reais do banco
  const mockQuotes: Quote[] = [
    {
      id: '1',
      customerName: 'João Silva',
      customerPhone: '(16) 99999-1111',
      vehicleBrand: 'Volkswagen',
      vehicleModel: 'Gol',
      vehicleYear: '2018',
      vehicleColor: 'Branco',
      services: ['Pintura completa', 'Polimento', 'Enceramento'],
      totalValue: 2500.00,
      status: 'PENDING',
      createdAt: '2025-07-20',
      validUntil: '2025-08-20',
      estimatedDays: 5,
      notes: 'Cliente solicitou desconto para pagamento à vista'
    },
    {
      id: '2',
      customerName: 'Maria Santos',
      customerPhone: '(16) 99999-2222',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic',
      vehicleYear: '2020',
      vehicleColor: 'Prata',
      services: ['Retoque de pintura', 'Polimento de faróis'],
      totalValue: 800.00,
      status: 'APPROVED',
      createdAt: '2025-07-18',
      validUntil: '2025-08-18',
      estimatedDays: 2
    },
    {
      id: '3',
      customerName: 'Carlos Oliveira',
      customerPhone: '(16) 99999-3333',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      vehicleYear: '2019',
      vehicleColor: 'Azul',
      services: ['Pintura do capô', 'Reparos estruturais'],
      totalValue: 1800.00,
      status: 'REJECTED',
      createdAt: '2025-07-15',
      validUntil: '2025-08-15',
      estimatedDays: 4,
      notes: 'Cliente considerou valor alto'
    }
  ]

  useEffect(() => {
    // Simular carregamento dos dados
    setTimeout(() => {
      setQuotes(mockQuotes)
      setFilteredQuotes(mockQuotes)
      setLoading(false)
    }, 1000)
  }, [])

  // Filtrar orçamentos
  useEffect(() => {
    let filtered = quotes

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(quote =>
        quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customerPhone.includes(searchTerm) ||
        quote.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.id.includes(searchTerm)
      )
    }

    // Filtro por status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(quote => quote.status === filterStatus)
    }

    setFilteredQuotes(filtered)
  }, [quotes, searchTerm, filterStatus])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente', icon: ClockIcon },
      APPROVED: { color: 'bg-green-100 text-green-800', text: 'Aprovado', icon: CheckIcon },
      REJECTED: { color: 'bg-red-100 text-red-800', text: 'Rejeitado', icon: XMarkIcon },
      EXPIRED: { color: 'bg-gray-100 text-gray-800', text: 'Expirado', icon: ClockIcon }
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote)
    setShowModal(true)
  }

  const handleStatusChange = (quoteId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setQuotes(prev => prev.map(quote => 
      quote.id === quoteId ? { ...quote, status: newStatus } : quote
    ))
  }

  if (loading) {
    return (
      
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      
    )
  }

  // Estatísticas dos orçamentos
  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'PENDING').length,
    approved: quotes.filter(q => q.status === 'APPROVED').length,
    rejected: quotes.filter(q => q.status === 'REJECTED').length,
    totalValue: quotes.reduce((sum, q) => sum + q.totalValue, 0),
    approvedValue: quotes.filter(q => q.status === 'APPROVED').reduce((sum, q) => sum + q.totalValue, 0)
  }

  return (
    
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                Gestão de Orçamentos
              </h1>
              <p className="text-gray-600">Acompanhe todos os orçamentos da Lazuli</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Orçamentos</p>
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
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
              </div>
              <BanknotesIcon className="h-8 w-8 text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Valor Aprovado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.approvedValue)}</p>
              </div>
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar orçamentos..."
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
                  <option value="ALL">Todos</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="APPROVED">Aprovados</option>
                  <option value="REJECTED">Rejeitados</option>
                  <option value="EXPIRED">Expirados</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredQuotes.length} de {quotes.length} orçamentos
            </div>
          </div>
        </div>

        {/* Quotes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuotes.map((quote) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Orçamento #{quote.id}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      {quote.customerName}
                    </p>
                  </div>
                  {getStatusBadge(quote.status)}
                </div>

                {/* Vehicle Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900">
                    {quote.vehicleBrand} {quote.vehicleModel} {quote.vehicleYear}
                  </p>
                  <p className="text-sm text-gray-600">Cor: {quote.vehicleColor}</p>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Serviços:</p>
                  <div className="flex flex-wrap gap-1">
                    {quote.services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Value and Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor Total:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(quote.totalValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prazo:</span>
                    <span className="text-sm text-gray-900">{quote.estimatedDays} dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Válido até:</span>
                    <span className={`text-sm ${isExpired(quote.validUntil) ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatDate(quote.validUntil)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleViewQuote(quote)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Ver Detalhes
                  </button>

                  {quote.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(quote.id, 'APPROVED')}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <CheckIcon className="h-4 w-4" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleStatusChange(quote.id, 'REJECTED')}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum orçamento encontrado</p>
          </div>
        )}
      </div>

      {/* Quote Details Modal */}
      {showModal && selectedQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalhes do Orçamento #{selectedQuote.id}
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
                    <p><strong>Nome:</strong> {selectedQuote.customerName}</p>
                    <p><strong>Telefone:</strong> {selectedQuote.customerPhone}</p>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Informações do Veículo</h4>
                  <div className="space-y-2">
                    <p><strong>Marca:</strong> {selectedQuote.vehicleBrand}</p>
                    <p><strong>Modelo:</strong> {selectedQuote.vehicleModel}</p>
                    <p><strong>Ano:</strong> {selectedQuote.vehicleYear}</p>
                    <p><strong>Cor:</strong> {selectedQuote.vehicleColor}</p>
                  </div>
                </div>

                {/* Services */}
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Serviços Solicitados</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedQuote.services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Financial Info */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Informações Financeiras</h4>
                  <div className="space-y-2">
                    <p><strong>Valor Total:</strong> {formatCurrency(selectedQuote.totalValue)}</p>
                    <p><strong>Prazo Estimado:</strong> {selectedQuote.estimatedDays} dias</p>
                  </div>
                </div>

                {/* Status and Dates */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Status e Datas</h4>
                  <div className="space-y-2">
                    <p><strong>Status:</strong> {getStatusBadge(selectedQuote.status)}</p>
                    <p><strong>Criado em:</strong> {formatDate(selectedQuote.createdAt)}</p>
                    <p><strong>Válido até:</strong> {formatDate(selectedQuote.validUntil)}</p>
                  </div>
                </div>

                {/* Notes */}
                {selectedQuote.notes && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Observações</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedQuote.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedQuote.status === 'PENDING' && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedQuote.id, 'REJECTED')
                      setShowModal(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Rejeitar
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedQuote.id, 'APPROVED')
                      setShowModal(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckIcon className="h-4 w-4" />
                    Aprovar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      </div>
    
  )
}
