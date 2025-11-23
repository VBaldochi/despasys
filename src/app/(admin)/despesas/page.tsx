'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PlusIcon,
  FunnelIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import NovaDespesaModal, { DespesaFormData } from '@/components/admin/NovaDespesaModal'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

interface Despesa {
  id: string
  fornecedor: string
  descricao: string
  categoria: string
  tipoDespesa: string
  valor: number
  dataVencimento: string
  dataPagamento: string | null
  status: string
  recorrente: boolean
  periodicidade?: string
  formaPagamento: string
  observacoes: string
}

interface Stats {
  totalDespesas: number
  emDia: number
  vencendo: number
  vencidas: number
  porCategoria: {
    FIXA: number
    VARIAVEL: number
    OPERACIONAL: number
    IMPOSTO: number
  }
}

export default function DespesasPage() {
  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [stats, setStats] = useState<Stats>({
    totalDespesas: 0,
    emDia: 0,
    vencendo: 0,
    vencidas: 0,
    porCategoria: { FIXA: 0, VARIAVEL: 0, OPERACIONAL: 0, IMPOSTO: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [isNovaDespesaModalOpen, setIsNovaDespesaModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'EM_ABERTO' | 'VENCENDO' | 'VENCIDA' | 'PAGA'>('ALL')
  const [filterTipo, setFilterTipo] = useState<'ALL' | 'FIXA' | 'VARIAVEL' | 'OPERACIONAL' | 'IMPOSTO'>('ALL')

  useEffect(() => {
    fetchDespesas()
  }, [filterStatus, filterTipo])

  const fetchDespesas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'ALL') params.append('status', filterStatus)
      if (filterTipo !== 'ALL') params.append('tipoDespesa', filterTipo)

      const response = await fetch(`/api/despesas?${params.toString()}`)
      const data = await response.json()
      
      setDespesas(data.despesas)
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching despesas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDespesa = async (data: DespesaFormData) => {
    try {
      const response = await fetch('/api/despesas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchDespesas()
        setIsNovaDespesaModalOpen(false)
      }
    } catch (error) {
      console.error('Error adding despesa:', error)
    }
  }

  const handleRegistrarPagamento = async (id: string) => {
    try {
      const response = await fetch('/api/despesas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: 'PAGA',
          dataPagamento: new Date().toISOString().split('T')[0]
        })
      })

      if (response.ok) {
        fetchDespesas()
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
    const badges = {
      'EM_ABERTO': (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
          <ClockIcon className="h-3 w-3" />
          Em Aberto
        </span>
      ),
      'VENCENDO': (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
          <ExclamationCircleIcon className="h-3 w-3" />
          Vencendo
        </span>
      ),
      'VENCIDA': (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
          <ExclamationCircleIcon className="h-3 w-3" />
          Vencida
        </span>
      ),
      'PAGA': (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
          <CheckCircleIcon className="h-3 w-3" />
          Paga
        </span>
      )
    }
    return badges[status as keyof typeof badges] || badges['EM_ABERTO']
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Despesas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as despesas do escritório
          </p>
        </div>
        <button 
          onClick={() => setIsNovaDespesaModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
        >
          <PlusIcon className="h-5 w-5" />
          Nova Despesa
        </button>
      </div>

      {/* Cards de Resumo */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Despesas</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalDespesas)}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Em Dia</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.emDia)}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencendo</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.vencendo)}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vencidas</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.vencidas)}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Categorias de Despesas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Despesas por Categoria</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(stats.porCategoria).map(([tipo, valor]) => {
            const percentage = stats.totalDespesas > 0 ? (valor / stats.totalDespesas * 100).toFixed(0) : 0
            const colors = {
              FIXA: 'bg-blue-600',
              VARIAVEL: 'bg-green-600',
              OPERACIONAL: 'bg-purple-600',
              IMPOSTO: 'bg-red-600'
            }
            return (
              <div key={tipo} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{tipo.charAt(0) + tipo.slice(1).toLowerCase() + 's'}</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(valor)}</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className={`${colors[tipo as keyof typeof colors]} h-2 rounded-full`} style={{width: `${percentage}%`}}></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Filtros e Lista de Contas */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Contas a Pagar</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="rounded-md border-gray-300 text-sm"
                >
                  <option value="ALL">Todos Status</option>
                  <option value="EM_ABERTO">Em Aberto</option>
                  <option value="VENCENDO">Vencendo</option>
                  <option value="VENCIDA">Vencida</option>
                  <option value="PAGA">Paga</option>
                </select>
              </div>
              <select 
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value as any)}
                className="rounded-md border-gray-300 text-sm"
              >
                <option value="ALL">Todos Tipos</option>
                <option value="FIXA">Fixas</option>
                <option value="VARIAVEL">Variáveis</option>
                <option value="OPERACIONAL">Operacionais</option>
                <option value="IMPOSTO">Impostos</option>
              </select>
            </div>
          </div>
          {!loading && (
            <p className="text-sm text-gray-500 mt-2">
              {despesas.length} {despesas.length === 1 ? 'despesa encontrada' : 'despesas encontradas'}
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Carregando...</div>
            </div>
          ) : despesas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BanknotesIcon className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">Nenhuma despesa encontrada</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
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
                {despesas.map((despesa) => (
                  <tr key={despesa.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {despesa.fornecedor}
                      {despesa.recorrente && (
                        <span className="ml-2 text-xs text-blue-600">
                          🔄 {despesa.periodicidade}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {despesa.descricao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {despesa.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                        {despesa.tipoDespesa}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(despesa.valor)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(despesa.dataVencimento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(despesa.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Visualizar">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" title="Editar">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      {despesa.status !== 'PAGA' && (
                        <button 
                          onClick={() => handleRegistrarPagamento(despesa.id)}
                          className="text-green-600 hover:text-green-900" 
                          title="Registrar Pagamento"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      <NovaDespesaModal
        isOpen={isNovaDespesaModalOpen}
        onClose={() => setIsNovaDespesaModalOpen(false)}
        onSubmit={handleAddDespesa}
      />
    </div>
  );
}

