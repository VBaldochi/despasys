'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DocumentCheckIcon,
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
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import NovoLaudoModal, { LaudoFormData } from '@/components/admin/NovoLaudoModal'

interface TechnicalReport {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  vehiclePlate: string
  chassisNumber?: string
  reportType: 'VISTORIA' | 'PERICIA' | 'AVALIACAO' | 'SINISTRO' | 'TRANSFERENCIA'
  purpose: 'COMPRA' | 'VENDA' | 'SEGURO' | 'FINANCIAMENTO' | 'JUDICIAL' | 'ADMINISTRATIVO'
  status: 'SOLICITADO' | 'EM_ANALISE' | 'EM_CAMPO' | 'ELABORANDO' | 'CONCLUIDO' | 'CANCELADO'
  requestedDate: string
  scheduledDate?: string
  completedDate?: string
  value: number
  location: string
  findings?: string[]
  conclusion?: string
  recommendations?: string[]
  attachments?: string[]
  priority: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
  notes?: string
  createdAt: string
}

export default function TechnicalReportsPage() {
  const [reports, setReports] = useState<TechnicalReport[]>([])
  const [filteredReports, setFilteredReports] = useState<TechnicalReport[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SOLICITADO' | 'EM_ANALISE' | 'EM_CAMPO' | 'ELABORANDO' | 'CONCLUIDO' | 'CANCELADO'>('ALL')
  const [filterType, setFilterType] = useState<'ALL' | 'VISTORIA' | 'PERICIA' | 'AVALIACAO' | 'SINISTRO' | 'TRANSFERENCIA'>('ALL')
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'>('ALL')
  const [selectedReport, setSelectedReport] = useState<TechnicalReport | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showNovoLaudoModal, setShowNovoLaudoModal] = useState(false)

  // Statistics
  const [stats, setStats] = useState({
    totalLaudos: 0,
    emAndamento: 0,
    concluidos: 0,
    valorMedio: 0
  })

  // Fetch reports from API
  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter reports
  useEffect(() => {
    let filtered = reports

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.customerPhone.includes(searchTerm) ||
        report.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.includes(searchTerm)
      )
    }

    // Filtro por status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(report => report.status === filterStatus)
    }

    // Filtro por tipo
    if (filterType !== 'ALL') {
      filtered = filtered.filter(report => report.reportType === filterType)
    }

    // Filtro por prioridade
    if (filterPriority !== 'ALL') {
      filtered = filtered.filter(report => report.priority === filterPriority)
    }

    setFilteredReports(filtered)
  }, [reports, searchTerm, filterStatus, filterType, filterPriority])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SOLICITADO: { color: 'bg-blue-100 text-blue-800', text: 'Solicitado', icon: ClockIcon },
      EM_ANALISE: { color: 'bg-yellow-100 text-yellow-800', text: 'Em Análise', icon: ClockIcon },
      EM_CAMPO: { color: 'bg-orange-100 text-orange-800', text: 'Em Campo', icon: TruckIcon },
      ELABORANDO: { color: 'bg-purple-100 text-purple-800', text: 'Elaborando', icon: DocumentCheckIcon },
      CONCLUIDO: { color: 'bg-green-100 text-green-800', text: 'Concluído', icon: CheckIcon },
      CANCELADO: { color: 'bg-red-100 text-red-800', text: 'Cancelado', icon: XMarkIcon }
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
      VISTORIA: { color: 'bg-blue-100 text-blue-800', text: 'Vistoria' },
      PERICIA: { color: 'bg-red-100 text-red-800', text: 'Perícia' },
      AVALIACAO: { color: 'bg-green-100 text-green-800', text: 'Avaliação' },
      SINISTRO: { color: 'bg-orange-100 text-orange-800', text: 'Sinistro' },
      TRANSFERENCIA: { color: 'bg-purple-100 text-purple-800', text: 'Transferência' }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig]
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      BAIXA: { color: 'bg-gray-100 text-gray-800', text: 'Baixa', icon: null },
      MEDIA: { color: 'bg-blue-100 text-blue-800', text: 'Média', icon: null },
      ALTA: { color: 'bg-yellow-100 text-yellow-800', text: 'Alta', icon: null },
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
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleViewReport = (report: TechnicalReport) => {
    setSelectedReport(report)
    setShowModal(true)
  }

  const handleStatusChange = (reportId: string, newStatus: 'EM_ANALISE' | 'EM_CAMPO' | 'ELABORANDO' | 'CONCLUIDO' | 'CANCELADO') => {
    handleChangeStatus(reportId, newStatus)
  }

  const handleAddLaudo = async (data: LaudoFormData) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchReports() // Reload reports
        setShowNovoLaudoModal(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar laudo')
      }
    } catch (error) {
      console.error('Error creating report:', error)
      alert('Erro ao criar laudo')
    }
  }

  const handleChangeStatus = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportId, status: newStatus })
      })

      if (response.ok) {
        await fetchReports() // Reload reports
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Erro ao atualizar status')
    }
  }

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Tem certeza que deseja excluir este laudo?')) return

    try {
      const response = await fetch(`/api/reports?id=${reportId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchReports() // Reload reports
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao excluir laudo')
      }
    } catch (error) {
      console.error('Error deleting report:', error)
      alert('Erro ao excluir laudo')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <DocumentCheckIcon className="h-8 w-8 text-blue-600" />
                Laudos Técnicos
              </h1>
              <p className="text-gray-600 mt-2">Gerencie todas as vistorias, perícias e avaliações técnicas</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar
              </button>
              <button 
                onClick={() => setShowNovoLaudoModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Novo Laudo
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
                <p className="text-sm font-medium text-gray-600">Total de Laudos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLaudos}</p>
              </div>
              <DocumentCheckIcon className="h-8 w-8 text-blue-600" />
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
                <p className="text-2xl font-bold text-yellow-600">{stats.emAndamento}</p>
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
                <p className="text-2xl font-bold text-green-600">{stats.concluidos}</p>
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
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.valorMedio)}</p>
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
                  placeholder="Buscar laudos..."
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
                  <option value="EM_ANALISE">Em Análise</option>
                  <option value="EM_CAMPO">Em Campo</option>
                  <option value="ELABORANDO">Elaborando</option>
                  <option value="CONCLUIDO">Concluídos</option>
                  <option value="CANCELADO">Cancelados</option>
                </select>
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todos os Tipos</option>
                <option value="VISTORIA">Vistoria</option>
                <option value="PERICIA">Perícia</option>
                <option value="AVALIACAO">Avaliação</option>
                <option value="SINISTRO">Sinistro</option>
                <option value="TRANSFERENCIA">Transferência</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todas as Prioridades</option>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredReports.length} de {reports.length} laudos
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Laudo #{report.id}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      {report.customerName}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(report.status)}
                    {getPriorityBadge(report.priority)}
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900">
                    {report.vehicleBrand} {report.vehicleModel} {report.vehicleYear}
                  </p>
                  <p className="text-sm text-gray-600">Placa: {report.vehiclePlate}</p>
                </div>

                {/* Report Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tipo:</span>
                    {getTypeBadge(report.reportType)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(report.value)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Local:</span>
                    <span className="text-sm text-gray-900">{report.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Solicitado:</span>
                    <span className="text-sm text-gray-900">{formatDate(report.requestedDate)}</span>
                  </div>
                  {report.scheduledDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Agendado:</span>
                      <span className="text-sm text-gray-900">{formatDate(report.scheduledDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleViewReport(report)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Ver Detalhes
                  </button>

                  {report.status === 'SOLICITADO' && (
                    <button
                      onClick={() => handleStatusChange(report.id, 'EM_ANALISE')}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                    >
                      <ClockIcon className="h-4 w-4" />
                      Analisar
                    </button>
                  )}

                  {report.status === 'EM_ANALISE' && (
                    <button
                      onClick={() => handleStatusChange(report.id, 'EM_CAMPO')}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                    >
                      <TruckIcon className="h-4 w-4" />
                      Ir ao Campo
                    </button>
                  )}

                  {report.status === 'EM_CAMPO' && (
                    <button
                      onClick={() => handleStatusChange(report.id, 'ELABORANDO')}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <DocumentCheckIcon className="h-4 w-4" />
                      Elaborar
                    </button>
                  )}

                  {report.status === 'ELABORANDO' && (
                    <button
                      onClick={() => handleStatusChange(report.id, 'CONCLUIDO')}
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
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <DocumentCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum laudo encontrado</p>
          </div>
        )}

        {/* Report Details Modal */}
        {showModal && selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalhes do Laudo #{selectedReport.id}
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
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Informações do Cliente</h4>
                    <div className="space-y-2">
                      <p><strong>Nome:</strong> {selectedReport.customerName}</p>
                      <p><strong>Telefone:</strong> {selectedReport.customerPhone}</p>
                      {selectedReport.customerEmail && (
                        <p><strong>Email:</strong> {selectedReport.customerEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Informações do Veículo</h4>
                    <div className="space-y-2">
                      <p><strong>Marca:</strong> {selectedReport.vehicleBrand}</p>
                      <p><strong>Modelo:</strong> {selectedReport.vehicleModel}</p>
                      <p><strong>Ano:</strong> {selectedReport.vehicleYear}</p>
                      <p><strong>Placa:</strong> {selectedReport.vehiclePlate}</p>
                      {selectedReport.chassisNumber && (
                        <p><strong>Chassi:</strong> {selectedReport.chassisNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Report Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Informações do Laudo</h4>
                    <div className="space-y-2">
                      <p><strong>Tipo:</strong> {getTypeBadge(selectedReport.reportType)}</p>
                      <p><strong>Finalidade:</strong> {selectedReport.purpose}</p>
                      <p><strong>Prioridade:</strong> {getPriorityBadge(selectedReport.priority)}</p>
                      <p><strong>Valor:</strong> {formatCurrency(selectedReport.value)}</p>
                      <p><strong>Local:</strong> {selectedReport.location}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Cronograma</h4>
                    <div className="space-y-2">
                      <p><strong>Status:</strong> {getStatusBadge(selectedReport.status)}</p>
                      <p><strong>Solicitado:</strong> {formatDate(selectedReport.requestedDate)}</p>
                      {selectedReport.scheduledDate && (
                        <p><strong>Agendado:</strong> {formatDate(selectedReport.scheduledDate)}</p>
                      )}
                      {selectedReport.completedDate && (
                        <p><strong>Concluído:</strong> {formatDate(selectedReport.completedDate)}</p>
                      )}
                    </div>
                  </div>

                  {/* Findings */}
                  {selectedReport.findings && selectedReport.findings.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Constatações</h4>
                      <ul className="space-y-1">
                        {selectedReport.findings.map((finding, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Conclusion */}
                  {selectedReport.conclusion && (
                    <div className="md:col-span-full">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Conclusão</h4>
                      <p className="text-gray-700 bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                        {selectedReport.conclusion}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {selectedReport.recommendations && selectedReport.recommendations.length > 0 && (
                    <div className="md:col-span-full">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Recomendações</h4>
                      <ul className="space-y-2">
                        {selectedReport.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2 bg-yellow-50 p-2 rounded">
                            <ShieldCheckIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Attachments */}
                  {selectedReport.attachments && selectedReport.attachments.length > 0 && (
                    <div className="md:col-span-full">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Anexos</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedReport.attachments.map((attachment, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                          >
                            <ArrowDownIcon className="h-3 w-3" />
                            {attachment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedReport.notes && (
                    <div className="md:col-span-full">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Observações</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  {/* Status Change Buttons */}
                  {selectedReport.status === 'SOLICITADO' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, 'EM_ANALISE')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <ClockIcon className="h-4 w-4" />
                      Iniciar Análise
                    </button>
                  )}

                  {selectedReport.status === 'EM_ANALISE' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, 'EM_CAMPO')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <TruckIcon className="h-4 w-4" />
                      Ir ao Campo
                    </button>
                  )}

                  {selectedReport.status === 'EM_CAMPO' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, 'ELABORANDO')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <DocumentCheckIcon className="h-4 w-4" />
                      Elaborar Laudo
                    </button>
                  )}

                  {selectedReport.status === 'ELABORANDO' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, 'CONCLUIDO')
                        setShowModal(false)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckIcon className="h-4 w-4" />
                      Finalizar Laudo
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

        {/* Novo Laudo Modal */}
        <NovoLaudoModal
          isOpen={showNovoLaudoModal}
          onClose={() => setShowNovoLaudoModal(false)}
          onSubmit={handleAddLaudo}
        />
      </div>
  )
}
