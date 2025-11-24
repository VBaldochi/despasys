'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClockIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import NovaFaturaModal, { FaturaFormData } from '@/components/admin/NovaFaturaModal'

interface Fatura {
  id: string
  numero: string
  customerName: string
  servico: string
  valor: number
  dataVencimento: string
  dataPagamento?: string
  status: 'PENDENTE' | 'PAGA' | 'VENCIDA'
  metodoPagamento?: string
}

interface Stats {
  totalReceitas: number
  totalPendente: number
  faturasEmitidas: number
  ticketMedio: number
  faturasVencidas: number
}

export default function ReceitasPage() {
  const [faturas, setFaturas] = useState<Fatura[]>([])
  const [stats, setStats] = useState<Stats>({
    totalReceitas: 0,
    totalPendente: 0,
    faturasEmitidas: 0,
    ticketMedio: 0,
    faturasVencidas: 0
  })
  const [loading, setLoading] = useState(true)
  const [isNovaFaturaModalOpen, setIsNovaFaturaModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'faturas' | 'recebimentos' | 'analise'>('faturas')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDENTE' | 'PAGA' | 'VENCIDA'>('ALL')

  useEffect(() => {
    fetchFaturas()
  }, [filterStatus])

  const fetchFaturas = async () => {
    setLoading(true)
    try {
      const url = filterStatus !== 'ALL' 
        ? `/api/receitas?status=${filterStatus}`
        : '/api/receitas'
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setFaturas(data.faturas)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFatura = async (data: FaturaFormData) => {
    try {
      const response = await fetch('/api/receitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        await fetchFaturas()
      } else {
        const error = await response.json()
        console.error('Error creating invoice:', error)
      }
    } catch (error) {
      console.error('Error creating invoice:', error)
    }
  }

  const handleRegistrarPagamento = async (faturaId: string) => {
    try {
      const response = await fetch('/api/receitas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: faturaId,
          status: 'PAGA',
          dataPagamento: new Date().toISOString().split('T')[0]
        })
      })

      if (response.ok) {
        await fetchFaturas()
      }
    } catch (error) {
      console.error('Error registering payment:', error)
    }
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PAGA: { color: 'bg-green-100 text-green-800', text: 'Paga', icon: CheckIcon },
      PAGO: { color: 'bg-green-100 text-green-800', text: 'Paga', icon: CheckIcon },
      PENDENTE: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente', icon: ClockIcon },
      VENCIDA: { color: 'bg-red-100 text-red-800', text: 'Vencida', icon: ClockIcon },
      VENCIDO: { color: 'bg-red-100 text-red-800', text: 'Vencida', icon: ClockIcon }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: 'bg-gray-100 text-gray-800',
      text: status || 'Desconhecido',
      icon: ClockIcon
    }
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Receitas</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsNovaFaturaModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Nova Fatura
          </button>
        </div>
      </div>
      
      {/* Cards de Métricas Consolidadas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Receitas</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalReceitas)}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faturas Emitidas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.faturasEmitidas}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">A Receber</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPendente)}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.ticketMedio)}</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Abas para Organizar Receitas */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('faturas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'faturas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Faturas
            </button>
            <button
              onClick={() => setActiveTab('recebimentos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'recebimentos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Recebimentos
            </button>
            <button
              onClick={() => setActiveTab('analise')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analise'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Análise
            </button>
          </nav>
        </div>
        
        {/* Conteúdo da Aba Faturas */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Todos os Status</option>
                <option value="PENDENTE">Pendentes</option>
                <option value="PAGA">Pagas</option>
                <option value="VENCIDA">Vencidas</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {faturas.length} {faturas.length === 1 ? 'fatura' : 'faturas'}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faturas.map((fatura) => (
                  <tr key={fatura.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fatura.numero}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fatura.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fatura.servico}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(fatura.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(fatura.dataVencimento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(fatura.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        {fatura.status !== 'PAGA' && (
                          <button
                            onClick={() => handleRegistrarPagamento(fatura.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Registrar Pagamento"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {faturas.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma fatura encontrada</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Fatura */}
      <NovaFaturaModal
        isOpen={isNovaFaturaModalOpen}
        onClose={() => setIsNovaFaturaModalOpen(false)}
        onSubmit={handleAddFatura}
      />
    </div>
  )
}
