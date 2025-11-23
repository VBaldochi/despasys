'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import NovoLancamentoModal, { LancamentoFormData } from '@/components/admin/NovoLancamentoModal'
import FluxoCaixaChart from '@/components/admin/FluxoCaixaChart'

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

interface Lancamento {
  id: string
  tipo: 'ENTRADA' | 'SAIDA'
  descricao: string
  categoria: string
  origem?: string
  destino?: string
  valor: number
  data: string
  metodoPagamento: string
  observacoes: string
}

interface Stats {
  entradasMes: number
  saidasMes: number
  saldoAtual: number
  totalEntradas: number
  totalSaidas: number
  saldoTotal: number
  totalLancamentos: number
}

export default function FluxoCaixaPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [stats, setStats] = useState<Stats>({
    entradasMes: 0,
    saidasMes: 0,
    saldoAtual: 0,
    totalEntradas: 0,
    totalSaidas: 0,
    saldoTotal: 0,
    totalLancamentos: 0
  })
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tipoModal, setTipoModal] = useState<'ENTRADA' | 'SAIDA'>('ENTRADA')
  const [filterTipo, setFilterTipo] = useState<'ALL' | 'ENTRADA' | 'SAIDA'>('ALL')

  useEffect(() => {
    fetchLancamentos()
  }, [filterTipo])

  const fetchLancamentos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterTipo !== 'ALL') params.append('tipo', filterTipo)

      const response = await fetch(`/api/fluxo-caixa?${params.toString()}`)
      const data = await response.json()
      
      setLancamentos(data.lancamentos)
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching lancamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddLancamento = async (data: LancamentoFormData) => {
    try {
      const response = await fetch('/api/fluxo-caixa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchLancamentos()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error('Error adding lancamento:', error)
    }
  }

  const handleDeleteLancamento = async (id: string) => {
    if (!confirm('Deseja realmente excluir este lançamento?')) return

    try {
      const response = await fetch(`/api/fluxo-caixa?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchLancamentos()
      }
    } catch (error) {
      console.error('Error deleting lancamento:', error)
    }
  }

  const openModal = (tipo: 'ENTRADA' | 'SAIDA') => {
    setTipoModal(tipo)
    setIsModalOpen(true)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fluxo de Caixa</h1>
          <p className="mt-1 text-sm text-gray-500">
            Controle de entradas e saídas financeiras
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => openModal('ENTRADA')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
          >
            <ArrowTrendingUpIcon className="h-5 w-5" />
            Entrada
          </button>
          <button 
            onClick={() => openModal('SAIDA')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
          >
            <ArrowTrendingDownIcon className="h-5 w-5" />
            Saída
          </button>
        </div>
      </div>
      
      {/* Cards de Resumo */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Entradas do Mês</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.entradasMes)}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saídas do Mês</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.saidasMes)}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BanknotesIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saldo do Mês</p>
              <p className={`text-2xl font-bold ${stats.saldoAtual >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(stats.saldoAtual)}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Gráfico de Fluxo */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Evolução do Fluxo de Caixa</h2>
        <FluxoCaixaChart lancamentos={lancamentos} />
      </div>
      
      {/* Lançamentos Recentes */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Lançamentos Recentes</h2>
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select 
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value as any)}
                className="rounded-md border-gray-300 text-sm"
              >
                <option value="ALL">Todos</option>
                <option value="ENTRADA">Entradas</option>
                <option value="SAIDA">Saídas</option>
              </select>
            </div>
          </div>
          {!loading && (
            <p className="text-sm text-gray-500 mt-2">
              {lancamentos.length} {lancamentos.length === 1 ? 'lançamento encontrado' : 'lançamentos encontrados'}
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Carregando...</div>
            </div>
          ) : lancamentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <BanknotesIcon className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500">Nenhum lançamento encontrado</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origem/Destino
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lancamentos.map((lancamento) => (
                  <tr key={lancamento.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lancamento.data)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {lancamento.descricao}
                      {lancamento.observacoes && (
                        <p className="text-xs text-gray-500 mt-1">{lancamento.observacoes}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lancamento.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lancamento.origem || lancamento.destino || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lancamento.tipo === 'ENTRADA' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          <ArrowTrendingUpIcon className="h-3 w-3" />
                          Entrada
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          <ArrowTrendingDownIcon className="h-3 w-3" />
                          Saída
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={lancamento.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}>
                        {lancamento.tipo === 'ENTRADA' ? '+' : '-'} {formatCurrency(lancamento.valor)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Visualizar">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900" title="Editar">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLancamento(lancamento.id)}
                        className="text-red-600 hover:text-red-900" 
                        title="Excluir"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      <NovoLancamentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLancamento}
        tipoInicial={tipoModal}
      />
    </div>
  );
}

