'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  MagnifyingGlassIcon as SearchIcon,
  FunnelIcon as FilterIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
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
  ProcessStep,
  ProcessDocument,
  ProcessNotification
} from '@/store/processoStore'
import ChatWidget from './ChatWidget'
import { brasilApi } from '@/lib/brasilapi'

const searchSchema = z.object({
  phone: z.string().optional(),
  cpf: z.string().optional(),
  processId: z.string().optional()
}).refine(data => data.phone || data.cpf || data.processId, {
  message: "Informe pelo menos um campo: telefone, CPF ou código do processo",
  path: ["phone"]
})

type SearchForm = z.infer<typeof searchSchema>

export default function ClientPortal() {
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [customerPhone, setCustomerPhone] = useState('')
  const [cpfValidation, setCpfValidation] = useState<{
    status: 'vazio' | 'incompleto' | 'invalido' | 'valido';
    mensagem: string;
    formatado: string;
  }>({ status: 'vazio', mensagem: '', formatado: '' })
  
  const {
    processes,
    searchTerm,
    statusFilter,
    priorityFilter,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    getFilteredProcesses,
    getProcessesByCustomer
  } = useProcessStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema)
  })

  const [customerProcesses, setCustomerProcesses] = useState<Process[]>([])

  // Funções de validação e formatação com Brasil API
  const handleCpfChange = (value: string) => {
    const validation = brasilApi.formularios.validarCpfTempoReal(value)
    setCpfValidation(validation)
    return validation.formatado
  }

  const onSubmit = async (data: SearchForm) => {
    // Validar CPF se fornecido
    if (data.cpf && cpfValidation.status !== 'valido') {
      alert('Por favor, digite um CPF válido')
      return
    }

    // Simular busca por telefone ou CPF
    const foundProcesses = processes.filter(process => {
      const phoneMatch = data.phone && process.customerPhone.replace(/\D/g, '') === data.phone.replace(/\D/g, '')
      const cpfMatch = data.cpf && process.customerCPF?.replace(/\D/g, '') === data.cpf.replace(/\D/g, '')
      const processIdMatch = data.processId && process.id === data.processId
      
      return phoneMatch || cpfMatch || processIdMatch
    })
    
    if (foundProcesses.length > 0) {
      setIsAuthenticated(true)
      setCustomerPhone(data.phone || data.cpf || '')
      setCustomerProcesses(foundProcesses)
    } else {
      alert('Nenhum processo encontrado com esses dados')
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCustomerPhone('')
    setCustomerProcesses([])
    reset()
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <PlayIcon className="h-5 w-5 text-blue-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-400" />
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Portal do Cliente
            </h1>
            <p className="text-gray-600">
              Acompanhe seus processos em tempo real
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Informe pelo menos um dos campos abaixo para acessar
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone/WhatsApp (opcional)
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(16) 99999-9999"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CPF (opcional)
              </label>
              <input
                {...register('cpf')}
                type="text"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 ${
                  cpfValidation.status === 'valido' 
                    ? 'border-green-300 focus:ring-green-500' 
                    : cpfValidation.status === 'invalido' 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="123.456.789-00"
                maxLength={14}
                onChange={(e) => {
                  const formatted = handleCpfChange(e.target.value)
                  e.target.value = formatted
                }}
              />
              {cpfValidation.status !== 'vazio' && (
                <div className={`mt-1 text-sm flex items-center gap-1 ${
                  cpfValidation.status === 'valido' 
                    ? 'text-green-600' 
                    : cpfValidation.status === 'invalido' 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  {cpfValidation.status === 'valido' && <CheckCircleIcon className="w-4 h-4" />}
                  {cpfValidation.status === 'invalido' && <XCircleIcon className="w-4 h-4" />}
                  {cpfValidation.status === 'incompleto' && <ClockIcon className="w-4 h-4" />}
                  {cpfValidation.mensagem}
                </div>
              )}
              {errors.cpf && (
                <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código do Processo (opcional)
              </label>
              <input
                {...register('processId')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 123456"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Acessar Meus Processos
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Não consegue acessar? Entre em contato:</p>
            <p className="font-medium text-blue-600">(16) 98247-7126</p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Dados para teste:</strong><br/>
                CPF: 123.456.789-00 ou 987.654.321-00<br/>
                Telefone: (16) 99999-9999 ou (16) 88888-8888
              </p>
            </div>
          </div>
        </motion.div>
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
              <h1 className="text-2xl font-bold text-gray-900">Meus Processos</h1>
              <p className="text-gray-600">Acompanhe o andamento dos seus processos</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Process List */}
        <div className="space-y-6">
          {customerProcesses.map((process) => (
            <motion.div
              key={process.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Process Header */}
              <div className="p-6 border-b border-gray-200">
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
                        Processo #{process.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(process.status)}`}>
                      {getStatusLabel(process.status)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(process.priority)}`}>
                      {getPriorityLabel(process.priority)}
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
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(process.progress)}`}
                      style={{ width: `${process.progress}%` }}
                    />
                  </div>
                </div>

                {/* Process Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Data de Início:</span>
                    <p className="font-medium">{formatDate(process.startDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Previsão de Conclusão:</span>
                    <p className="font-medium">
                      {process.estimatedEndDate ? formatDate(process.estimatedEndDate) : 'A definir'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Valor Total:</span>
                    <p className="font-medium text-green-600">
                      {process.totalCost ? `R$ ${process.totalCost.toFixed(2)}` : 'A definir'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowDetails(showDetails === process.id ? null : process.id)}
                  className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>{showDetails === process.id ? 'Ocultar Detalhes' : 'Ver Detalhes'}</span>
                </button>
              </div>

              {/* Process Details */}
              {showDetails === process.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-gray-50"
                >
                  {/* Timeline */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Andamento do Processo
                    </h4>
                    <div className="space-y-4">
                      {process.steps.map((step: ProcessStep, index: number) => (
                        <div key={step.id} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {getStepIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900">{step.title}</h5>
                              <span className="text-sm text-gray-500">
                                {step.completedAt 
                                  ? formatDateTime(step.completedAt)
                                  : step.estimatedDate 
                                  ? `Previsto: ${formatDate(step.estimatedDate)}`
                                  : ''
                                }
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            {step.notes && (
                              <p className="text-sm text-orange-600 mt-1 font-medium">
                                📝 {step.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Documents */}
                  {process.documents.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Documentos
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {process.documents.map((doc: ProcessDocument) => (
                          <div key={doc.id} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{doc.name}</h5>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {doc.status === 'approved' ? 'Aprovado' :
                                 doc.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Enviado em {formatDateTime(doc.uploadedAt)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(doc.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notifications */}
                  {process.notifications.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Notificações Recentes
                      </h4>
                      <div className="space-y-3">
                        {process.notifications.slice(0, 3).map((notification: ProcessNotification) => (
                          <div
                            key={notification.id}
                            className={`p-4 rounded-lg border ${
                              notification.type === 'success' ? 'bg-green-50 border-green-200' :
                              notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                              notification.type === 'error' ? 'bg-red-50 border-red-200' :
                              'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {notification.type === 'success' ? (
                                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                ) : notification.type === 'warning' ? (
                                  <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
                                ) : notification.type === 'error' ? (
                                  <XCircleIcon className="h-5 w-5 text-red-500" />
                                ) : (
                                  <BellIcon className="h-5 w-5 text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{notification.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {formatDateTime(notification.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {customerProcesses.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum processo encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Não encontramos processos para o telefone informado.
            </p>
            <button
              onClick={logout}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>

      {/* Chat Widget */}
      {isAuthenticated && customerProcesses.length > 0 && (
        <ChatWidget
          processId={customerProcesses[0]?.id}
          customerName={customerProcesses[0]?.customerName}
          customerPhone={customerPhone}
        />
      )}
    </div>
  )
}
