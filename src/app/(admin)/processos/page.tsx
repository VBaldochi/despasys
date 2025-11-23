'use client'

import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Car,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react'
import NovoProcessoModal from '@/components/admin/NovoProcessoModal'

export default function ProcessosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [processos, setProcessos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProcessos()
  }, [])

  const fetchProcessos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/processes')
      
      if (response.ok) {
        const data = await response.json()
        setProcessos(data.map((p: any) => ({
          id: p.numero || p.id,
          tipo: p.tipo || 'Sem tipo',
          cliente: p.customer?.name || 'Cliente não informado',
          veiculo: p.veiculo?.placa ? `${p.veiculo.modelo} ${p.veiculo.ano}` : '-',
          status: p.status?.toLowerCase() || 'pendente',
          dataInicio: new Date(p.createdAt).toLocaleDateString('pt-BR'),
          prazo: p.prazo ? new Date(p.prazo).toLocaleDateString('pt-BR') : '-',
          valor: p.valor || 0
        })))
      } else {
        console.error('Erro ao buscar processos')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProcesso = async (processo: any) => {
    try {
      const response = await fetch('/api/processes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processo)
      })

      if (response.ok) {
        await fetchProcessos() // Recarregar lista
        setIsModalOpen(false)
      } else {
        const error = await response.json()
        console.error('Erro ao criar processo:', error.error)
        alert('Erro ao criar processo: ' + error.error)
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      alert('Erro ao criar processo')
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'concluido':
        return { icon: CheckCircle, text: 'Concluído', color: 'text-green-600 bg-green-100' }
      case 'em_andamento':
        return { icon: Clock, text: 'Em Andamento', color: 'text-blue-600 bg-blue-100' }
      case 'pendente':
        return { icon: AlertCircle, text: 'Pendente', color: 'text-yellow-600 bg-yellow-100' }
      case 'atrasado':
        return { icon: XCircle, text: 'Atrasado', color: 'text-red-600 bg-red-100' }
      default:
        return { icon: Clock, text: 'Indefinido', color: 'text-gray-600 bg-gray-100' }
    }
  }

  const filteredProcessos = processos.filter(processo => {
    const matchesSearch = processo.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         processo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         processo.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'todos' || processo.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Processos</h1>
            <p className="text-gray-600 mt-1">Gerencie todos os processos em andamento</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Processo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Pesquisar por cliente, processo ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Processos</p>
              <p className="text-2xl font-semibold text-gray-900">{processos.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Em Andamento</p>
              <p className="text-2xl font-semibold text-blue-600">
                {processos.filter(p => p.status === 'em_andamento').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Concluídos</p>
              <p className="text-2xl font-semibold text-green-600">
                {processos.filter(p => p.status === 'concluido').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Atrasados</p>
              <p className="text-2xl font-semibold text-red-600">
                {processos.filter(p => p.status === 'atrasado').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Processes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Processo</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Cliente</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Tipo</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Prazo</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Valor</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProcessos.map((processo) => {
                const statusInfo = getStatusInfo(processo.status)
                const StatusIcon = statusInfo.icon

                return (
                  <tr key={processo.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{processo.id}</div>
                      <div className="text-sm text-gray-500">{processo.dataInicio}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{processo.cliente}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900">{processo.tipo}</div>
                      {processo.veiculo !== '-' && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Car className="h-3 w-3 mr-1" />
                          {processo.veiculo}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900">{processo.prazo}</div>
                      {processo.status === 'atrasado' && (
                        <div className="text-xs text-red-600">Vencido</div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900 font-medium">
                        R$ {processo.valor.toFixed(2).replace('.', ',')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 p-1">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredProcessos.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum processo encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou criar um novo processo.</p>
          </div>
        )}
      </div>

      {/* Modal Novo Processo */}
      <NovoProcessoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProcesso}
      />
    </div>
  )
}
