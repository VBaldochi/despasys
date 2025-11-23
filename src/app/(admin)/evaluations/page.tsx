'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NovaAvaliacaoModal from '@/components/admin/NovaAvaliacaoModal'
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
  TruckIcon
} from '@heroicons/react/24/outline'

interface Evaluation {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  vehiclePlate: string
  evaluationType: 'COMPRA' | 'VENDA' | 'SEGURO' | 'FINANCIAMENTO'
  status: 'SOLICITADA' | 'EM_ANALISE' | 'CONCLUIDA' | 'CANCELADA'
  requestedDate: string
  completedDate?: string
  value: number
  location: string
  notes?: string
  createdAt: string
}

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SOLICITADA' | 'EM_ANALISE' | 'CONCLUIDA' | 'CANCELADA'>('ALL')
  const [filterType, setFilterType] = useState<'ALL' | 'COMPRA' | 'VENDA' | 'SEGURO' | 'FINANCIAMENTO'>('ALL')
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isNovaAvaliacaoModalOpen, setIsNovaAvaliacaoModalOpen] = useState(false)

  // Mock data para demonstração
  const mockEvaluations: Evaluation[] = [
    {
      id: '1',
      customerName: 'João Silva',
      customerPhone: '(16) 99999-1111',
      customerEmail: 'joao@email.com',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      vehicleYear: '2020',
      vehiclePlate: 'ABC-1234',
      evaluationType: 'COMPRA',
      status: 'SOLICITADA',
      requestedDate: '2025-07-28',
      value: 450.00,
      location: 'Franca-SP',
      notes: 'Cliente quer avaliação para compra de carro usado',
      createdAt: '2025-07-27'
    },
    {
      id: '2',
      customerName: 'Maria Santos',
      customerPhone: '(16) 99999-2222',
      customerEmail: 'maria@email.com',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic',
      vehicleYear: '2019',
      vehiclePlate: 'DEF-5678',
      evaluationType: 'SEGURO',
      status: 'EM_ANALISE',
      requestedDate: '2025-07-26',
      value: 380.00,
      location: 'Ribeirão Preto-SP',
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
      evaluationType: 'VENDA',
      status: 'CONCLUIDA',
      requestedDate: '2025-07-24',
      completedDate: '2025-07-25',
      value: 320.00,
      location: 'Franca-SP',
      notes: 'Avaliação concluída - valor de mercado informado',
      createdAt: '2025-07-23'
    }
  ]

  useEffect(() => {
    // Simular carregamento dos dados
    setTimeout(() => {
      setEvaluations(mockEvaluations)
      setFilteredEvaluations(mockEvaluations)
      setLoading(false)
    }, 1000)
  }, [])

  // Filtrar avaliações
  useEffect(() => {
    let filtered = evaluations

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(evaluation =>
        evaluation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.customerPhone.includes(searchTerm) ||
        evaluation.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.id.includes(searchTerm)
      )
    }

    // Filtro por status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(evaluation => evaluation.status === filterStatus)
    }

    // Filtro por tipo
    if (filterType !== 'ALL') {
      filtered = filtered.filter(evaluation => evaluation.evaluationType === filterType)
    }

    setFilteredEvaluations(filtered)
  }, [evaluations, searchTerm, filterStatus, filterType])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SOLICITADA: { color: 'bg-blue-100 text-blue-800', text: 'Solicitada', icon: ClockIcon },
      EM_ANALISE: { color: 'bg-yellow-100 text-yellow-800', text: 'Em Análise', icon: ClockIcon },
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
      COMPRA: { color: 'bg-blue-100 text-blue-800', text: 'Compra' },
      VENDA: { color: 'bg-green-100 text-green-800', text: 'Venda' },
      SEGURO: { color: 'bg-purple-100 text-purple-800', text: 'Seguro' },
      FINANCIAMENTO: { color: 'bg-orange-100 text-orange-800', text: 'Financiamento' }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig]
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
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

  const handleViewEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation)
    setShowModal(true)
  }

  const handleStatusChange = (evaluationId: string, newStatus: 'EM_ANALISE' | 'CONCLUIDA' | 'CANCELADA') => {
    setEvaluations(prev => prev.map(evaluation => 
      evaluation.id === evaluationId ? { ...evaluation, status: newStatus } : evaluation
    ))
  }

  const handleAddEvaluation = async (avaliacao: any) => {
    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(avaliacao)
      })

      if (response.ok) {
        const newEvaluation = await response.json()
        setEvaluations(prev => [newEvaluation, ...prev])
        alert('Avaliação criada com sucesso!')
      } else {
        const error = await response.json()
        alert(`Erro ao criar avaliação: ${error.message || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao criar avaliação:', error)
      alert('Erro ao criar avaliação')
    }
  }

  if (loading) {
    return (
      
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      
    )
  }

  // Estatísticas das avaliações
  const stats = {
    total: evaluations.length,
    pending: evaluations.filter(e => e.status === 'SOLICITADA').length,
    inProgress: evaluations.filter(e => e.status === 'EM_ANALISE').length,
    completed: evaluations.filter(e => e.status === 'CONCLUIDA').length,
    totalValue: evaluations.reduce((sum, e) => sum + e.value, 0),
    avgValue: evaluations.length > 0 ? evaluations.reduce((sum, e) => sum + e.value, 0) / evaluations.length : 0
  }

  return (
    
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                Avaliações Veiculares
              </h1>
              <p className="text-gray-600 mt-2">Gerencie todas as avaliações de veículos</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar
              </button>
              <button 
                onClick={() => setIsNovaAvaliacaoModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Nova Avaliação
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
                <p className="text-sm font-medium text-gray-600">Total de Avaliações</p>
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
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
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
                <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.avgValue)}</p>
              </div>
              <BanknotesIcon className="h-8 w-8 text-purple-600" />
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
                  placeholder="Buscar avaliações..."
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
                  <option value="EM_ANALISE">Em Análise</option>
                  <option value="CONCLUIDA">Concluídas</option>
                  <option value="CANCELADA">Canceladas</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">Todos os Tipos</option>
                  <option value="COMPRA">Compra</option>
                  <option value="VENDA">Venda</option>
                  <option value="SEGURO">Seguro</option>
                  <option value="FINANCIAMENTO">Financiamento</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredEvaluations.length} de {evaluations.length} avaliações
            </div>
          </div>
        </div>

        {/* Evaluations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvaluations.map((evaluation) => (
            <motion.div
              key={evaluation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Avaliação #{evaluation.id}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      {evaluation.customerName}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(evaluation.status)}
                    {getTypeBadge(evaluation.evaluationType)}
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900">
                    {evaluation.vehicleBrand} {evaluation.vehicleModel} {evaluation.vehicleYear}
                  </p>
                  <p className="text-sm text-gray-600">Placa: {evaluation.vehiclePlate}</p>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(evaluation.value)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Local:</span>
                    <span className="text-sm text-gray-900">{evaluation.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data:</span>
                    <span className="text-sm text-gray-900">{formatDate(evaluation.requestedDate)}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleViewEvaluation(evaluation)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Ver Detalhes
                  </button>

                  {evaluation.status === 'SOLICITADA' && (
                    <button
                      onClick={() => handleStatusChange(evaluation.id, 'EM_ANALISE')}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                    >
                      <ClockIcon className="h-4 w-4" />
                      Iniciar
                    </button>
                  )}

                  {evaluation.status === 'EM_ANALISE' && (
                    <button
                      onClick={() => handleStatusChange(evaluation.id, 'CONCLUIDA')}
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
        {filteredEvaluations.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma avaliação encontrada</p>
          </div>
        )}

        {/* Evaluation Details Modal */}
        {showModal && selectedEvaluation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalhes da Avaliação #{selectedEvaluation.id}
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
                      <p><strong>Nome:</strong> {selectedEvaluation.customerName}</p>
                      <p><strong>Telefone:</strong> {selectedEvaluation.customerPhone}</p>
                      {selectedEvaluation.customerEmail && (
                        <p><strong>Email:</strong> {selectedEvaluation.customerEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Informações do Veículo</h4>
                    <div className="space-y-2">
                      <p><strong>Marca:</strong> {selectedEvaluation.vehicleBrand}</p>
                      <p><strong>Modelo:</strong> {selectedEvaluation.vehicleModel}</p>
                      <p><strong>Ano:</strong> {selectedEvaluation.vehicleYear}</p>
                      <p><strong>Placa:</strong> {selectedEvaluation.vehiclePlate}</p>
                    </div>
                  </div>

                  {/* Evaluation Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Informações da Avaliação</h4>
                    <div className="space-y-2">
                      <p><strong>Tipo:</strong> {getTypeBadge(selectedEvaluation.evaluationType)}</p>
                      <p><strong>Valor:</strong> {formatCurrency(selectedEvaluation.value)}</p>
                      <p><strong>Local:</strong> {selectedEvaluation.location}</p>
                    </div>
                  </div>

                  {/* Status and Dates */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Status e Datas</h4>
                    <div className="space-y-2">
                      <p><strong>Status:</strong> {getStatusBadge(selectedEvaluation.status)}</p>
                      <p><strong>Data Solicitada:</strong> {formatDate(selectedEvaluation.requestedDate)}</p>
                      {selectedEvaluation.completedDate && (
                        <p><strong>Data Concluída:</strong> {formatDate(selectedEvaluation.completedDate)}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedEvaluation.notes && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Observações</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedEvaluation.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  {selectedEvaluation.status === 'SOLICITADA' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedEvaluation.id, 'EM_ANALISE')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <ClockIcon className="h-4 w-4" />
                      Iniciar Análise
                    </button>
                  )}

                  {selectedEvaluation.status === 'EM_ANALISE' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedEvaluation.id, 'CONCLUIDA')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Marcar como Concluída
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Nova Avaliação Modal */}
        <NovaAvaliacaoModal
          isOpen={isNovaAvaliacaoModalOpen}
          onClose={() => setIsNovaAvaliacaoModalOpen(false)}
          onSubmit={handleAddEvaluation}
        />
      </div>
    
  )
}
