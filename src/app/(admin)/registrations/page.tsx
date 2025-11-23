'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import NovoRegistroModal from '@/components/admin/NovoRegistroModal'
import {
  ClipboardDocumentListIcon,
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
  StarIcon
} from '@heroicons/react/24/outline'

interface Registration {
  id: string
  // Customer Info
  customerName: string
  customerPhone: string
  customerEmail?: string
  customerCpf: string
  customerAddress: string
  // Vehicle Info
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  chassisNumber: string
  renavam: string
  vehicleType: 'CARRO' | 'MOTO' | 'CAMINHAO' | 'UTILITARIO' | 'ONIBUS'
  isZeroKm: boolean
  dealershipName?: string
  invoiceNumber?: string
  // Registration Info
  status: 'SOLICITADO' | 'DOCUMENTOS_PENDENTES' | 'EM_PROCESSAMENTO' | 'EMPLACAMENTO' | 'CONCLUIDO' | 'CANCELADO'
  requestedDate: string
  completedDate?: string
  fees: {
    detran: number
    service: number
    emplacamento: number
    total: number
  }
  documents: {
    required: string[]
    received: string[]
  }
  notes?: string
  priority: 'NORMAL' | 'URGENTE'
  firstPlate?: string
  category: string // Categoria do veículo (A, B, C, D, E)
  createdAt: string
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SOLICITADO' | 'DOCUMENTOS_PENDENTES' | 'EM_PROCESSAMENTO' | 'EMPLACAMENTO' | 'CONCLUIDO' | 'CANCELADO'>('ALL')
  const [filterType, setFilterType] = useState<'ALL' | 'CARRO' | 'MOTO' | 'CAMINHAO' | 'UTILITARIO' | 'ONIBUS'>('ALL')
  const [filterZeroKm, setFilterZeroKm] = useState<'ALL' | 'SIM' | 'NAO'>('ALL')
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isNovoRegistroModalOpen, setIsNovoRegistroModalOpen] = useState(false)

  // Mock data para demonstração
  const mockRegistrations: Registration[] = [
    {
      id: '1',
      customerName: 'João Silva',
      customerPhone: '(16) 99999-1111',
      customerEmail: 'joao@email.com',
      customerCpf: '123.456.789-01',
      customerAddress: 'Rua das Flores, 123 - Centro - Ribeirão Preto/SP',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic EXL',
      vehicleYear: '2024',
      chassisNumber: '9BWZZZ377VT004251',
      renavam: '00123456789',
      vehicleType: 'CARRO',
      isZeroKm: true,
      dealershipName: 'Honda Ribeirão',
      invoiceNumber: 'NF001234',
      status: 'SOLICITADO',
      requestedDate: '2025-07-27',
      fees: {
        detran: 250.75,
        service: 180.00,
        emplacamento: 120.50,
        total: 551.25
      },
      documents: {
        required: ['Nota Fiscal', 'CNH', 'CPF', 'Comprovante Residência', 'Certificado de Registro', 'Seguro DPVAT'],
        received: ['Nota Fiscal', 'CNH', 'CPF']
      },
      priority: 'NORMAL',
      category: 'B',
      createdAt: '2025-07-27'
    },
    {
      id: '2',
      customerName: 'Maria Santos',
      customerPhone: '(16) 99999-2222',
      customerEmail: 'maria@email.com',
      customerCpf: '987.654.321-02',
      customerAddress: 'Av. Independência, 456 - Jardim Califórnia - Ribeirão Preto/SP',
      vehicleBrand: 'Yamaha',
      vehicleModel: 'Fazer 250',
      vehicleYear: '2024',
      chassisNumber: '9C2JC30007R123456',
      renavam: '00987654321',
      vehicleType: 'MOTO',
      isZeroKm: true,
      dealershipName: 'Yamaha Center',
      invoiceNumber: 'NF005678',
      status: 'EM_PROCESSAMENTO',
      requestedDate: '2025-07-25',
      fees: {
        detran: 180.50,
        service: 120.00,
        emplacamento: 85.75,
        total: 386.25
      },
      documents: {
        required: ['Nota Fiscal', 'CNH Categoria A', 'CPF', 'Comprovante Residência', 'Certificado de Registro'],
        received: ['Nota Fiscal', 'CNH Categoria A', 'CPF', 'Comprovante Residência', 'Certificado de Registro']
      },
      priority: 'URGENTE',
      notes: 'Cliente precisa da moto para trabalho na segunda-feira',
      category: 'A',
      createdAt: '2025-07-25'
    },
    {
      id: '3',
      customerName: 'Carlos Oliveira',
      customerPhone: '(16) 99999-3333',
      customerCpf: '111.222.333-44',
      customerAddress: 'Rua São Paulo, 789 - Vila Tibério - Ribeirão Preto/SP',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla XEi',
      vehicleYear: '2023',
      chassisNumber: '9BR53ZEC4P8123456',
      renavam: '00456789123',
      vehicleType: 'CARRO',
      isZeroKm: false,
      status: 'CONCLUIDO',
      requestedDate: '2025-07-20',
      completedDate: '2025-07-23',
      firstPlate: 'ABC-1D23',
      fees: {
        detran: 250.75,
        service: 180.00,
        emplacamento: 120.50,
        total: 551.25
      },
      documents: {
        required: ['Certificado de Registro', 'CNH', 'CPF', 'Comprovante Residência', 'Laudo de Vistoria'],
        received: ['Certificado de Registro', 'CNH', 'CPF', 'Comprovante Residência', 'Laudo de Vistoria']
      },
      priority: 'NORMAL',
      category: 'B',
      createdAt: '2025-07-20'
    },
    {
      id: '4',
      customerName: 'Roberto Mendes',
      customerPhone: '(16) 99999-4444',
      customerCpf: '555.666.777-88',
      customerAddress: 'Av. Nove de Julho, 321 - Centro - Ribeirão Preto/SP',
      vehicleBrand: 'Iveco',
      vehicleModel: 'Daily 35S14',
      vehicleYear: '2024',
      chassisNumber: 'ZCFC635A004123456',
      renavam: '00789123456',
      vehicleType: 'CAMINHAO',
      isZeroKm: true,
      dealershipName: 'Iveco São Paulo',
      invoiceNumber: 'NF009876',
      status: 'DOCUMENTOS_PENDENTES',
      requestedDate: '2025-07-26',
      fees: {
        detran: 450.25,
        service: 280.00,
        emplacamento: 185.75,
        total: 916.00
      },
      documents: {
        required: ['Nota Fiscal', 'CNH Categoria C', 'CPF', 'Comprovante Residência', 'Certificado de Registro', 'ANTT'],
        received: ['Nota Fiscal', 'CNH Categoria C', 'CPF']
      },
      priority: 'NORMAL',
      notes: 'Faltam documentos de comprovante de residência e ANTT',
      category: 'C',
      createdAt: '2025-07-26'
    }
  ]

  useEffect(() => {
    // Simular carregamento dos dados
    setTimeout(() => {
      setRegistrations(mockRegistrations)
      setFilteredRegistrations(mockRegistrations)
      setLoading(false)
    }, 1000)
  }, [])

  // Filtrar registros
  useEffect(() => {
    let filtered = registrations

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(registration =>
        registration.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.customerPhone.includes(searchTerm) ||
        registration.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.renavam.includes(searchTerm) ||
        registration.id.includes(searchTerm) ||
        (registration.firstPlate && registration.firstPlate.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtro por status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(registration => registration.status === filterStatus)
    }

    // Filtro por tipo de veículo
    if (filterType !== 'ALL') {
      filtered = filtered.filter(registration => registration.vehicleType === filterType)
    }

    // Filtro por 0km
    if (filterZeroKm !== 'ALL') {
      filtered = filtered.filter(registration => 
        filterZeroKm === 'SIM' ? registration.isZeroKm : !registration.isZeroKm
      )
    }

    setFilteredRegistrations(filtered)
  }, [registrations, searchTerm, filterStatus, filterType, filterZeroKm])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SOLICITADO: { color: 'bg-blue-100 text-blue-800', text: 'Solicitado', icon: ClockIcon },
      DOCUMENTOS_PENDENTES: { color: 'bg-orange-100 text-orange-800', text: 'Docs Pendentes', icon: DocumentTextIcon },
      EM_PROCESSAMENTO: { color: 'bg-yellow-100 text-yellow-800', text: 'Processando', icon: ClockIcon },
      EMPLACAMENTO: { color: 'bg-purple-100 text-purple-800', text: 'Emplacamento', icon: ClipboardDocumentListIcon },
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

  const getVehicleTypeBadge = (type: string) => {
    const typeConfig = {
      CARRO: { color: 'bg-blue-100 text-blue-800', text: 'Carro', icon: '🚗' },
      MOTO: { color: 'bg-green-100 text-green-800', text: 'Moto', icon: '🏍️' },
      CAMINHAO: { color: 'bg-orange-100 text-orange-800', text: 'Caminhão', icon: '🚛' },
      UTILITARIO: { color: 'bg-purple-100 text-purple-800', text: 'Utilitário', icon: '🚐' },
      ONIBUS: { color: 'bg-red-100 text-red-800', text: 'Ônibus', icon: '🚌' }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig]
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <span>{config.icon}</span>
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

  const getZeroKmBadge = (isZeroKm: boolean) => {
    if (isZeroKm) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <StarIcon className="h-3 w-3" />
          0km
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

  const handleViewRegistration = (registration: Registration) => {
    setSelectedRegistration(registration)
    setShowModal(true)
  }

  const handleStatusChange = (registrationId: string, newStatus: 'EM_PROCESSAMENTO' | 'EMPLACAMENTO' | 'CONCLUIDO') => {
    setRegistrations(prev => prev.map(registration => 
      registration.id === registrationId ? { 
        ...registration, 
        status: newStatus,
        ...(newStatus === 'CONCLUIDO' ? { 
          completedDate: new Date().toISOString().split('T')[0],
          firstPlate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 9)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(10 + Math.random() * 90)}`
        } : {})
      } : registration
    ))
  }

  const handleAddRegistration = async (registro: any) => {
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro)
      })

      if (response.ok) {
        const newRegistration = await response.json()
        setRegistrations(prev => [newRegistration, ...prev])
        alert('Registro criado com sucesso!')
      } else {
        const error = await response.json()
        alert(`Erro ao criar registro: ${error.message || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao criar registro:', error)
      alert('Erro ao criar registro')
    }
  }

  if (loading) {
    return (
      
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      
    )
  }

  // Estatísticas dos registros
  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => ['SOLICITADO', 'DOCUMENTOS_PENDENTES', 'EM_PROCESSAMENTO', 'EMPLACAMENTO'].includes(r.status)).length,
    completed: registrations.filter(r => r.status === 'CONCLUIDO').length,
    zeroKm: registrations.filter(r => r.isZeroKm).length,
    documentsNeeded: registrations.filter(r => r.status === 'DOCUMENTOS_PENDENTES').length,
    totalValue: registrations.reduce((sum, r) => sum + r.fees.total, 0)
  }

  return (
    
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
                1° Registros
              </h1>
              <p className="text-gray-600 mt-2">Gerencie primeiros registros e emplacamentos</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar
              </button>
              <button 
                onClick={() => setIsNovoRegistroModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Novo Registro
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
              <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Veículos 0km</p>
                <p className="text-xl font-bold text-yellow-600">{stats.zeroKm}</p>
              </div>
              <StarIcon className="h-6 w-6 text-yellow-600" />
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
                  placeholder="Buscar registros..."
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
                  <option value="EM_PROCESSAMENTO">Em Processamento</option>
                  <option value="EMPLACAMENTO">Emplacamento</option>
                  <option value="CONCLUIDO">Concluídos</option>
                  <option value="CANCELADO">Cancelados</option>
                </select>
              </div>

              {/* Vehicle Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todos os Tipos</option>
                <option value="CARRO">Carros</option>
                <option value="MOTO">Motos</option>
                <option value="CAMINHAO">Caminhões</option>
                <option value="UTILITARIO">Utilitários</option>
                <option value="ONIBUS">Ônibus</option>
              </select>

              {/* Zero KM Filter */}
              <select
                value={filterZeroKm}
                onChange={(e) => setFilterZeroKm(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">Todos</option>
                <option value="SIM">0km</option>
                <option value="NAO">Seminovos</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredRegistrations.length} de {registrations.length} registros
            </div>
          </div>
        </div>

        {/* Registrations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRegistrations.map((registration) => {
            const docProgress = getDocumentProgress(registration.documents)
            
            return (
              <motion.div
                key={registration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        1° Registro #{registration.id}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getVehicleTypeBadge(registration.vehicleType)}
                        {getZeroKmBadge(registration.isZeroKm)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(registration.status)}
                      {registration.priority === 'URGENTE' && getPriorityBadge(registration.priority)}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-gray-900">
                      {registration.vehicleBrand} {registration.vehicleModel} {registration.vehicleYear}
                    </p>
                    <p className="text-sm text-gray-600">Categoria: {registration.category}</p>
                    {registration.firstPlate && (
                      <p className="text-sm text-green-600 font-medium">Placa: {registration.firstPlate}</p>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Cliente</p>
                      <p className="text-sm font-medium text-gray-900">{registration.customerName}</p>
                      <p className="text-sm text-gray-600">{registration.customerPhone}</p>
                    </div>

                    {registration.dealershipName && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Concessionária</p>
                        <p className="text-sm text-gray-700">{registration.dealershipName}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taxa Total:</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(registration.fees.total)}
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
                      <span className="text-sm text-gray-900">{formatDate(registration.requestedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleViewRegistration(registration)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Ver Detalhes
                    </button>

                    {registration.status === 'SOLICITADO' && (
                      <button
                        onClick={() => handleStatusChange(registration.id, 'EM_PROCESSAMENTO')}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                      >
                        <ClockIcon className="h-4 w-4" />
                        Processar
                      </button>
                    )}

                    {registration.status === 'EM_PROCESSAMENTO' && (
                      <button
                        onClick={() => handleStatusChange(registration.id, 'EMPLACAMENTO')}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <ClipboardDocumentListIcon className="h-4 w-4" />
                        Emplacar
                      </button>
                    )}

                    {registration.status === 'EMPLACAMENTO' && (
                      <button
                        onClick={() => handleStatusChange(registration.id, 'CONCLUIDO')}
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
        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum registro encontrado</p>
          </div>
        )}

        {/* Modal abbreviated for brevity - Would include full detailed modal here */}
        {showModal && selectedRegistration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Detalhes do 1° Registro #{selectedRegistration.id}
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
                <p className="text-gray-600">Detalhes completos do registro...</p>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Novo Registro Modal */}
        <NovoRegistroModal
          isOpen={isNovoRegistroModalOpen}
          onClose={() => setIsNovoRegistroModalOpen(false)}
          onSubmit={handleAddRegistration}
        />
      </div>
    
  )
}
