'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  PlayIcon,
  UserIcon,
  PhoneIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'
import { 
  useProcessStore, 
  formatDate, 
  formatDateTime, 
  getStatusColor, 
  getStatusLabel, 
  getPriorityColor, 
  getPriorityLabel,
  ProcessStatus,
  ProcessPriority,
  Process,
  ProcessStep
} from '@/store/processoStore'

export default function ProcessManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)

  const {
    processes,
    searchTerm,
    statusFilter,
    priorityFilter,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    getFilteredProcesses,
    updateProcess,
    deleteProcess,
    updateProcessStep
  } = useProcessStore()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    if (session.user?.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }

    setIsLoading(false)
  }, [session, status, router])

  const filteredProcesses = getFilteredProcesses()

  const handleUpdateStatus = (processId: string, newStatus: ProcessStatus) => {
    updateProcess(processId, { status: newStatus })
  }

  const handleUpdateStepStatus = (processId: string, stepId: string, newStatus: string) => {
    updateProcessStep(processId, stepId, { 
      status: newStatus as 'pending' | 'in_progress' | 'completed' | 'cancelled',
      completedAt: newStatus === 'completed' ? new Date() : undefined
    })
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <PlayIcon className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-gray-400" />
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4 text-red-500" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Processos</h1>
              <p className="text-gray-600">Gerencie todos os processos dos clientes</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Novo Processo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar processos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProcessStatus | 'ALL')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Todos os Status</option>
              <option value="STARTED">Iniciado</option>
              <option value="DOCUMENTS_RECEIVED">Documentos Recebidos</option>
              <option value="PROCESSING">Em Processamento</option>
              <option value="WAITING_CLIENT">Aguardando Cliente</option>
              <option value="COMPLETED">Concluído</option>
              <option value="CANCELLED">Cancelado</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as ProcessPriority | 'ALL')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Todas as Prioridades</option>
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <span>{filteredProcesses.length} processos encontrados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Process List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="space-y-4">
          {filteredProcesses.map((process) => (
            <motion.div
              key={process.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Process Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {process.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        #{process.id} • {process.customerName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <select
                      value={process.status}
                      onChange={(e) => handleUpdateStatus(process.id, e.target.value as ProcessStatus)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(process.status)}`}
                    >
                      <option value="STARTED">Iniciado</option>
                      <option value="DOCUMENTS_RECEIVED">Documentos Recebidos</option>
                      <option value="PROCESSING">Em Processamento</option>
                      <option value="WAITING_CLIENT">Aguardando Cliente</option>
                      <option value="COMPLETED">Concluído</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                    
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(process.priority)}`}>
                      {getPriorityLabel(process.priority)}
                    </span>
                  </div>
                </div>

                {/* Process Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Cliente:</span>
                    <span className="font-medium">{process.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Telefone:</span>
                    <span className="font-medium">{process.customerPhone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Início:</span>
                    <span className="font-medium">{formatDate(process.startDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Previsão:</span>
                    <span className="font-medium">
                      {process.estimatedEndDate ? formatDate(process.estimatedEndDate) : 'A definir'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progresso</span>
                    <span>{process.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${process.progress}%` }}
                    />
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 mb-2">Etapas do Processo</h4>
                  <div className="space-y-2">
                    {process.steps.map((step: ProcessStep) => (
                      <div key={step.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStepIcon(step.status)}
                          <span className="text-sm font-medium text-gray-900">{step.title}</span>
                        </div>
                        <select
                          value={step.status}
                          onChange={(e) => handleUpdateStepStatus(process.id, step.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em Progresso</option>
                          <option value="completed">Concluído</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Criado em {formatDateTime(process.createdAt)}</span>
                    <span>•</span>
                    <span>Atualizado em {formatDateTime(process.updatedAt)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedProcess(process)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>Detalhes</span>
                    </button>
                    <button
                      onClick={() => deleteProcess(process.id)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProcesses.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum processo encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Não há processos que correspondam aos filtros aplicados.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('ALL')
                setPriorityFilter('ALL')
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
