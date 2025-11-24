'use client'

import { useState, useEffect } from 'react'
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
  TruckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import NovaTransferenciaModal from '@/components/admin/NovaTransferenciaModal'

interface Transfer {
  id: string
  sellerName: string
  buyerName: string
  sellerPhone: string
  buyerPhone: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  vehiclePlate: string
  renavam: string
  status: 'SOLICITADO' | 'EM_PROCESSAMENTO' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDO' | 'CANCELADO'
  transferDate: string
  requestedDate: string
  completedDate?: string
  saleValue: number
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

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SOLICITADO' | 'EM_PROCESSAMENTO' | 'AGUARDANDO_PAGAMENTO' | 'CONCLUIDO' | 'CANCELADO'>('ALL')
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'NORMAL' | 'URGENTE'>('ALL')
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [isNovaTransferenciaModalOpen, setIsNovaTransferenciaModalOpen] = useState(false)

  const mockTransfers: Transfer[] = [
    {
      id: '1',
      sellerName: 'João Silva',
      buyerName: 'Maria Santos',
      sellerPhone: '(16) 99999-1111',
      buyerPhone: '(16) 99999-2222',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic',
      vehicleYear: '2020',
      vehiclePlate: 'ABC-1234',
      renavam: '00123456789',
      status: 'SOLICITADO',
      transferDate: '2025-11-25',
      requestedDate: '2025-11-22',
      saleValue: 85000,
      value: 435,
      fees: {
        detran: 285,
        service: 150,
        total: 435
      },
      documents: ['RG Vendedor', 'RG Comprador', 'CRLV', 'CRV'],
      priority: 'NORMAL',
      createdAt: '2025-11-22'
    },
    {
      id: '2',
      sellerName: 'Carlos Oliveira',
      buyerName: 'Ana Costa',
      sellerPhone: '(16) 99999-3333',
      buyerPhone: '(16) 99999-4444',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      vehicleYear: '2019',
      vehiclePlate: 'DEF-5678',
      renavam: '00987654321',
      status: 'EM_PROCESSAMENTO',
      transferDate: '2025-11-23',
      requestedDate: '2025-11-20',
      saleValue: 72000,
      value: 485,
      fees: {
        detran: 285,
        service: 200,
        total: 485
      },
      documents: ['RG Vendedor', 'RG Comprador', 'CRLV', 'CRV', 'Comprovantes'],
      priority: 'URGENTE',
      notes: 'Transferência urgente - financiamento aprovado',
      createdAt: '2025-11-20'
    },
    {
      id: '3',
      sellerName: 'Pedro Alves',
      buyerName: 'Lucas Ferreira',
      sellerPhone: '(16) 99999-5555',
      buyerPhone: '(16) 99999-6666',
      vehicleBrand: 'Volkswagen',
      vehicleModel: 'Gol',
      vehicleYear: '2018',
      vehiclePlate: 'GHI-9012',
      renavam: '00456789123',
      status: 'CONCLUIDO',
      transferDate: '2025-11-18',
      requestedDate: '2025-11-15',
      completedDate: '2025-11-19',
      saleValue: 38000,
      value: 435,
      fees: {
        detran: 285,
        service: 150,
        total: 435
      },
      documents: ['RG Vendedor', 'RG Comprador', 'CRLV', 'CRV'],
      priority: 'NORMAL',
      createdAt: '2025-11-15'
    }
  ]

  useEffect(() => {
    fetchTransfers()
  }, [])

  const fetchTransfers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/transfers')
      if (response.ok) {
        const data = await response.json()
        const transfersData = data.length > 0 ? data : mockTransfers
        setTransfers(transfersData)
        setFilteredTransfers(transfersData)
      }
    } catch (error) {
      console.error('Erro ao buscar transferências:', error)
      setTransfers(mockTransfers)
      setFilteredTransfers(mockTransfers)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransfer = async (transferenciaData: any) => {
    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferenciaData)
      })

      if (response.ok) {
        await fetchTransfers()
        setIsNovaTransferenciaModalOpen(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar transferência')
      }
    } catch (error) {
      console.error('Erro ao criar transferência:', error)
      alert('Erro ao criar transferência')
    }
  }

  useEffect(() => {
    let filtered = transfers

    if (searchTerm) {
      filtered = filtered.filter(transfer =>
        transfer.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.renavam.includes(searchTerm) ||
        transfer.id.includes(searchTerm)
      )
    }

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(transfer => transfer.status === filterStatus)
    }

    if (filterPriority !== 'ALL') {
      filtered = filtered.filter(transfer => transfer.priority === filterPriority)
    }

    setFilteredTransfers(filtered)
  }, [transfers, searchTerm, filterStatus, filterPriority])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SOLICITADO: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Solicitado' },
      EM_PROCESSAMENTO: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Em Processamento' },
      AGUARDANDO_PAGAMENTO: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Aguardando Pagamento' },
      CONCLUIDO: { bg: 'bg-green-100', text: 'text-green-800', label: 'Concluído' },
      CANCELADO: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
      // Backend enums
      PENDING_DOCS: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Docs Pendentes' },
      WAITING_PAYMENT: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Aguardando Pagamento' },
      PAYMENT_CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pagamento Confirmado' },
      DETRAN_PROCESSING: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Processando DETRAN' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Concluído' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) {
      // Status desconhecido: fallback visual
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
          {status}
        </span>
      );
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  }

  const totalTransfers = transfers.length
  // Considera todos os enums possíveis do backend e frontend
  const pendingStatuses = [
    'SOLICITADO', 'EM_PROCESSAMENTO', 'PENDING_DOCS', 'WAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'DETRAN_PROCESSING'
  ];
  const completedStatuses = ['CONCLUIDO', 'COMPLETED'];
  const pendingTransfers = transfers.filter(t => pendingStatuses.includes(t.status)).length;
  const completedTransfers = transfers.filter(t => completedStatuses.includes(t.status)).length;
  const totalRevenue = transfers
    .filter(t => completedStatuses.includes(t.status))
    .reduce((sum, t) => {
      // Receita: soma transferValue das concluídas
      if (typeof t.transferValue === 'number' && t.transferValue > 0) {
        return sum + t.transferValue;
      }
      return sum;
    }, 0);
    function formatCurrencyBRL(value: number) {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ArrowsRightLeftIcon className="h-8 w-8 text-blue-600" />
                Transferências de Veículos
              </h1>
              <p className="text-gray-600 mt-2">Gerencie transferências de propriedade</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Exportar
              </button>
              <button 
                onClick={() => setIsNovaTransferenciaModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Nova Transferência
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransfers}</p>
              </div>
              <ArrowsRightLeftIcon className="h-12 w-12 text-blue-600 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTransfers}</p>
              </div>
              <ClockIcon className="h-12 w-12 text-yellow-600 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{completedTransfers}</p>
              </div>
              <CheckIcon className="h-12 w-12 text-green-600 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrencyBRL(totalRevenue)}</p>
              </div>
              <BanknotesIcon className="h-12 w-12 text-blue-600 opacity-50" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por vendedor, comprador, placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Todos os Status</option>
              <option value="SOLICITADO">Solicitado</option>
              <option value="EM_PROCESSAMENTO">Em Processamento</option>
              <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="CANCELADO">Cancelado</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Todas as Prioridades</option>
              <option value="NORMAL">Normal</option>
              <option value="URGENTE">Urgente</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto md:overflow-x-visible">
            <table className="w-full divide-y divide-gray-200 text-xs md:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-1 py-2 text-left font-bold text-gray-700 uppercase tracking-wide">Veículo</th>
                  <th className="px-1 py-2 text-left font-bold text-gray-700 uppercase tracking-wide">Vendedor</th>
                  <th className="px-1 py-2 text-left font-bold text-gray-700 uppercase tracking-wide">Comprador</th>
                  <th className="px-1 py-2 text-left font-bold text-gray-700 uppercase tracking-wide">Data</th>
                  <th className="px-1 py-2 text-left font-bold text-gray-700 uppercase tracking-wide">Status</th>
                  <th className="px-1 py-2 text-left font-bold text-gray-700 uppercase tracking-wide">Valor</th>
                  <th className="px-1 py-2 text-left font-bold text-gray-700 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransfers.map((transfer) => (
                  <motion.tr
                    key={transfer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-base font-bold text-gray-900">{transfer.vehiclePlate}</div>
                      <div className="text-base text-gray-600">{transfer.vehicleBrand} {transfer.vehicleModel}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-base font-semibold text-gray-900">{transfer.sellerName}</div>
                      <div className="text-sm text-gray-600">{transfer.sellerPhone}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-base font-semibold text-gray-900">{transfer.buyerName}</div>
                      <div className="text-sm text-gray-600">{transfer.buyerPhone}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-gray-900">
                      {transfer.requestedDate && !isNaN(Date.parse(transfer.requestedDate))
                        ? new Date(transfer.requestedDate).toLocaleDateString('pt-BR')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(transfer.status)}
                      {transfer.priority === 'URGENTE' && (
                        <ExclamationTriangleIcon className="inline h-4 w-4 text-red-500 ml-2" />
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-base font-bold text-green-600">
                      {(() => {
                        // Usar transferValue (valor da transferência) e serviceValue (taxa de serviço) do backend
                        const valor = (typeof transfer.transferValue === 'number' && transfer.transferValue > 0)
                          ? transfer.transferValue
                          : (typeof transfer.serviceValue === 'number' && transfer.serviceValue > 0 ? transfer.serviceValue : 0);
                        return `R$ ${valor.toFixed(2)}`;
                      })()}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedTransfer(transfer)
                          setShowModal(true)
                        }}
                        className="p-3 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <EyeIcon className="h-6 w-6" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Detalhes */}
        {showModal && selectedTransfer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Detalhes da Transferência</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">ID</p>
                      <p className="font-medium">#{selectedTransfer.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      {getStatusBadge(selectedTransfer.status)}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Vendedor</h3>
                    <p className="text-sm"><strong>Nome:</strong> {selectedTransfer.sellerName}</p>
                    <p className="text-sm"><strong>Telefone:</strong> {selectedTransfer.sellerPhone}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Comprador</h3>
                    <p className="text-sm"><strong>Nome:</strong> {selectedTransfer.buyerName}</p>
                    <p className="text-sm"><strong>Telefone:</strong> {selectedTransfer.buyerPhone}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Veículo</h3>
                    <p className="text-sm"><strong>Placa:</strong> {selectedTransfer.vehiclePlate}</p>
                    <p className="text-sm"><strong>Marca/Modelo:</strong> {selectedTransfer.vehicleBrand} {selectedTransfer.vehicleModel}</p>
                    <p className="text-sm"><strong>Ano:</strong> {selectedTransfer.vehicleYear}</p>
                    <p className="text-sm"><strong>RENAVAM:</strong> {selectedTransfer.renavam}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Valores</h3>
                    <p className="text-sm"><strong>Valor de Venda:</strong> R$ {(selectedTransfer.saleValue ?? 0).toFixed(2)}</p>
                    <p className="text-sm"><strong>Taxa DETRAN:</strong> R$ {(selectedTransfer.fees?.detran ?? 0).toFixed(2)}</p>
                    <p className="text-sm"><strong>Taxa de Serviço:</strong> R$ {(selectedTransfer.fees?.service ?? 0).toFixed(2)}</p>
                    <p className="text-sm font-bold"><strong>Total:</strong> R$ {(selectedTransfer.fees?.total ?? 0).toFixed(2)}</p>
                  </div>

                  {selectedTransfer.notes && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-2">Observações</h3>
                      <p className="text-sm text-gray-700">{selectedTransfer.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
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

        {/* Modal Nova Transferência */}
        <NovaTransferenciaModal
          isOpen={isNovaTransferenciaModalOpen}
          onClose={() => setIsNovaTransferenciaModalOpen(false)}
          onSubmit={handleAddTransfer}
        />
      </div>
    </div>
  )
}
