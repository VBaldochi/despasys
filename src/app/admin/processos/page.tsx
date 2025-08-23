'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Plus, Search, Filter, FileText, Calendar, User, Car, Edit, Eye, Trash2 } from 'lucide-react'

interface Processo {
  id: string
  numero: string
  customer: {
    name: string
    email: string
  }
  veiculo?: {
    marca: string
    modelo: string
    placa: string
    ano: number
  }
  tipoServico: string
  titulo: string
  descricao?: string
  status: string
  prioridade: string
  valorTotal: number
  valorTaxas: number
  valorServico: number
  statusPagamento: string
  dataInicio: string
  prazoLegal?: string
  dataFinalizacao?: string
  observacoes?: string
  responsavel: {
    name: string
    email: string
  }
}

const statusColors = {
  'AGUARDANDO_DOCUMENTOS': 'bg-yellow-100 text-yellow-800',
  'DOCUMENTOS_RECEBIDOS': 'bg-blue-100 text-blue-800',
  'EM_ANALISE': 'bg-purple-100 text-purple-800',
  'AGUARDANDO_PAGAMENTO': 'bg-orange-100 text-orange-800',
  'PAGAMENTO_CONFIRMADO': 'bg-green-100 text-green-800',
  'EM_PROCESSAMENTO': 'bg-indigo-100 text-indigo-800',
  'AGUARDANDO_VISTORIA': 'bg-yellow-100 text-yellow-800',
  'VISTORIA_REALIZADA': 'bg-cyan-100 text-cyan-800',
  'FINALIZADO': 'bg-green-100 text-green-800',
  'CANCELADO': 'bg-red-100 text-red-800',
  'ERRO': 'bg-red-100 text-red-800'
}

const prioridadeColors = {
  'BAIXA': 'bg-gray-100 text-gray-800',
  'MEDIA': 'bg-blue-100 text-blue-800',
  'ALTA': 'bg-orange-100 text-orange-800',
  'URGENTE': 'bg-red-100 text-red-800'
}

function ProcessosContent() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [prioridadeFilter, setPrioridadeFilter] = useState('ALL')
  const [showNovoProcesso, setShowNovoProcesso] = useState(false)
  const [showFiltrosAvancados, setShowFiltrosAvancados] = useState(false)
  const [showDetalhesProcesso, setShowDetalhesProcesso] = useState(false)
  const [processoSelecionado, setProcessoSelecionado] = useState<Processo | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Estados para o formulário
  const [formData, setFormData] = useState({
    customerId: '',
    veiculoId: '',
    tipoServico: '',
    titulo: '',
    descricao: '',
    status: 'AGUARDANDO_DOCUMENTOS',
    prioridade: 'MEDIA',
    valorTotal: 0,
    valorTaxas: 0,
    valorServico: 0,
    statusPagamento: 'PENDENTE',
    prazoLegal: '',
    observacoes: ''
  })

  // Fetcher function para SWR
  const fetcher = (url: string) => fetch(url).then(res => res.json())
  
  // Usar SWR para buscar processos com cache automático
  const { data: processos = [], isLoading: loading, error, mutate } = useSWR<Processo[]>('/api/processes', fetcher, {
    refreshInterval: 30000, // Atualizar a cada 30 segundos
    dedupingInterval: 5000, // Evitar requests duplicados por 5 segundos
    revalidateOnFocus: false // Não revalidar quando a janela ganha foco
  })

  // Buscar clientes para o formulário
  const { data: clientes = [] } = useSWR('/api/customers', fetcher)

  // Buscar usuários para responsáveis
  const { data: usuarios = [] } = useSWR('/api/users', fetcher)

  const filteredProcessos = processos.filter(processo => {
    const matchesSearch = 
      processo.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (processo.veiculo?.placa || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || processo.status === statusFilter
    const matchesPrioridade = prioridadeFilter === 'ALL' || processo.prioridade === prioridadeFilter

    return matchesSearch && matchesStatus && matchesPrioridade
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Funções para manipular processos
  const handleNovoProcesso = () => {
    setFormData({
      customerId: '',
      veiculoId: '',
      tipoServico: '',
      titulo: '',
      descricao: '',
      status: 'AGUARDANDO_DOCUMENTOS',
      prioridade: 'MEDIA',
      valorTotal: 0,
      valorTaxas: 0,
      valorServico: 0,
      statusPagamento: 'PENDENTE',
      prazoLegal: '',
      observacoes: ''
    })
    setProcessoSelecionado(null)
    setIsEditing(false)
    setShowNovoProcesso(true)
  }

  const handleEditarProcesso = async (processo: Processo) => {
    setLoadingAction('editar')
    try {
      // Buscar dados completos do processo para edição
      const response = await fetch(`/api/processes/${processo.id}`)
      if (response.ok) {
        const processoCompleto = await response.json()
        
        setFormData({
          customerId: processoCompleto.customerId || '',
          veiculoId: processoCompleto.veiculoId || '',
          tipoServico: processoCompleto.tipoServico || '',
          titulo: processoCompleto.titulo || '',
          descricao: processoCompleto.descricao || '',
          status: processoCompleto.status || 'AGUARDANDO_DOCUMENTOS',
          prioridade: processoCompleto.prioridade || 'MEDIA',
          valorTotal: processoCompleto.valorTotal || 0,
          valorTaxas: processoCompleto.valorTaxas || 0,
          valorServico: processoCompleto.valorServico || 0,
          statusPagamento: processoCompleto.statusPagamento || 'PENDENTE',
          prazoLegal: processoCompleto.prazoLegal ? new Date(processoCompleto.prazoLegal).toISOString().split('T')[0] : '',
          observacoes: processoCompleto.observacoes || ''
        })
        
        setProcessoSelecionado(processoCompleto)
        setIsEditing(true)
        setShowNovoProcesso(true)
      }
    } catch (error) {
      alert('Erro ao carregar dados do processo')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleVisualizarProcesso = async (processo: Processo) => {
    setLoadingAction('visualizar')
    try {
      // Buscar dados completos do processo
      const response = await fetch(`/api/processes/${processo.id}`)
      if (response.ok) {
        const processoCompleto = await response.json()
        setProcessoSelecionado(processoCompleto)
        setShowDetalhesProcesso(true)
      }
    } catch (error) {
      alert('Erro ao carregar detalhes do processo')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleSalvarProcesso = async () => {
    setLoadingAction('salvar')
    try {
      const url = isEditing ? `/api/processes/${processoSelecionado?.id}` : '/api/processes'
      const method = isEditing ? 'PUT' : 'POST'
      
      // Para novos processos, adicionar responsavelId (usuário atual)
      const dadosParaEnviar = {
        ...formData,
        responsavelId: session?.user?.id,
        valorTotal: Number(formData.valorTotal),
        valorTaxas: Number(formData.valorTaxas),
        valorServico: Number(formData.valorServico)
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar)
      })

      if (response.ok) {
        mutate() // Revalidar dados
        setShowNovoProcesso(false)
        setProcessoSelecionado(null)
        alert(isEditing ? 'Processo atualizado com sucesso!' : 'Processo criado com sucesso!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao salvar processo')
      }
    } catch (error) {
      alert('Erro ao salvar processo')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleExcluirProcesso = async (processo: Processo) => {
    if (confirm(`Tem certeza que deseja excluir o processo ${processo.numero}?`)) {
      try {
        const response = await fetch(`/api/processes/${processo.id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          mutate() // Revalidar dados
        } else {
          alert('Erro ao excluir processo')
        }
      } catch (error) {
        alert('Erro ao excluir processo')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gerenciamento de Processos
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Acompanhe todos os processos de documentação veicular
              </p>
            </div>
            <button 
              onClick={handleNovoProcesso}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Processo
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por número, cliente ou placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Todos os Status</option>
              <option value="AGUARDANDO_DOCUMENTOS">Aguardando Documentos</option>
              <option value="EM_PROCESSAMENTO">Em Processamento</option>
              <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>

            {/* Filtro de Prioridade */}
            <select
              value={prioridadeFilter}
              onChange={(e) => setPrioridadeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">Todas as Prioridades</option>
              <option value="URGENTE">Urgente</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Média</option>
              <option value="BAIXA">Baixa</option>
            </select>

            {/* Botão de Filtro Avançado */}
            <button 
              onClick={() => setShowFiltrosAvancados(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </button>
          </div>
        </div>

        {/* Lista de Processos */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Carregando processos...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar processos</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não foi possível carregar os processos. Tente novamente.
              </p>
              <button
                onClick={() => mutate()}
                className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Tentar novamente
              </button>
            </div>
          ) : filteredProcessos.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum processo encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'ALL' || prioridadeFilter !== 'ALL'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando um novo processo para um cliente.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredProcessos.map((processo) => (
                <li key={processo.id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <FileText className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 flex-wrap">
                              <p className="text-lg font-semibold text-gray-900 truncate">
                                {processo.numero}
                              </p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[processo.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                                {processo.status.replace(/_/g, ' ')}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prioridadeColors[processo.prioridade as keyof typeof prioridadeColors] || 'bg-gray-100 text-gray-800'}`}>
                                {processo.prioridade}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {processo.titulo}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 flex-wrap">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                <span className="truncate">{processo.customer.name}</span>
                              </div>
                              {processo.veiculo && (
                                <div className="flex items-center">
                                  <Car className="h-4 w-4 mr-1" />
                                  <span className="truncate">{processo.veiculo.marca} {processo.veiculo.modelo} - {processo.veiculo.placa}</span>
                                </div>
                              )}
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Criado em {formatDate(processo.dataInicio)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(processo.valorTotal)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {processo.statusPagamento === 'PAGO' ? (
                              <span className="text-green-600">✓ Pago</span>
                            ) : (
                              <span className="text-orange-600">⏳ Pendente</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleVisualizarProcesso(processo)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                            title="Visualizar"
                            disabled={loadingAction === 'visualizar'}
                          >
                            {loadingAction === 'visualizar' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditarProcesso(processo)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                            title="Editar"
                            disabled={loadingAction === 'editar'}
                          >
                            {loadingAction === 'editar' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            ) : (
                              <Edit className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleExcluirProcesso(processo)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rodapé com estatísticas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{processos.length}</div>
            <div className="text-sm text-gray-500">Total de Processos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              {processos.filter(p => p.status === 'EM_PROCESSAMENTO').length}
            </div>
            <div className="text-sm text-gray-500">Em Processamento</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {processos.filter(p => p.status === 'FINALIZADO').length}
            </div>
            <div className="text-sm text-gray-500">Finalizados</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(processos.reduce((acc, p) => acc + p.valorTotal, 0))}
            </div>
            <div className="text-sm text-gray-500">Valor Total</div>
          </div>
        </div>
      </div>

      {/* Modal Novo/Editar Processo */}
      {showNovoProcesso && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Editar Processo' : 'Novo Processo'}
                </h3>
                <button
                  onClick={() => {
                    setShowNovoProcesso(false)
                    setProcessoSelecionado(null)
                    setIsEditing(false)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loadingAction === 'salvar'}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={(e) => {e.preventDefault(); handleSalvarProcesso()}} className="space-y-6">
                {/* Grid de formulário */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Cliente */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente *
                    </label>
                    <select
                      value={formData.customerId}
                      onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loadingAction === 'salvar'}
                    >
                      <option value="">Selecione um cliente</option>
                      {clientes.map((cliente: any) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.name} - {cliente.cpfCnpj}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de Serviço */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Serviço *
                    </label>
                    <select
                      value={formData.tipoServico}
                      onChange={(e) => setFormData({...formData, tipoServico: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loadingAction === 'salvar'}
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="TRANSFERENCIA">Transferência</option>
                      <option value="LICENCIAMENTO">Licenciamento</option>
                      <option value="SEGUNDA_VIA">Segunda Via</option>
                      <option value="IPVA">IPVA</option>
                      <option value="MULTAS">Multas</option>
                      <option value="CNH">CNH</option>
                      <option value="VISTORIA">Vistoria</option>
                      <option value="OUTROS">Outros</option>
                    </select>
                  </div>

                  {/* Título */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Processo *
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Transferência de propriedade - Honda Civic"
                      required
                      disabled={loadingAction === 'salvar'}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loadingAction === 'salvar'}
                    >
                      <option value="AGUARDANDO_DOCUMENTOS">Aguardando Documentos</option>
                      <option value="DOCUMENTOS_RECEBIDOS">Documentos Recebidos</option>
                      <option value="EM_ANALISE">Em Análise</option>
                      <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
                      <option value="PAGAMENTO_CONFIRMADO">Pagamento Confirmado</option>
                      <option value="EM_PROCESSAMENTO">Em Processamento</option>
                      <option value="AGUARDANDO_VISTORIA">Aguardando Vistoria</option>
                      <option value="VISTORIA_REALIZADA">Vistoria Realizada</option>
                      <option value="FINALIZADO">Finalizado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </div>

                  {/* Prioridade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridade
                    </label>
                    <select
                      value={formData.prioridade}
                      onChange={(e) => setFormData({...formData, prioridade: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loadingAction === 'salvar'}
                    >
                      <option value="BAIXA">Baixa</option>
                      <option value="MEDIA">Média</option>
                      <option value="ALTA">Alta</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>

                  {/* Valor do Serviço */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor do Serviço (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.valorServico}
                      onChange={(e) => setFormData({...formData, valorServico: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      disabled={loadingAction === 'salvar'}
                    />
                  </div>

                  {/* Valor das Taxas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor das Taxas (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.valorTaxas}
                      onChange={(e) => {
                        const valorTaxas = Number(e.target.value)
                        const valorTotal = Number(formData.valorServico) + valorTaxas
                        setFormData({...formData, valorTaxas, valorTotal})
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      disabled={loadingAction === 'salvar'}
                    />
                  </div>

                  {/* Valor Total (calculado automaticamente) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Total (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={Number(formData.valorServico) + Number(formData.valorTaxas)}
                      onChange={(e) => setFormData({...formData, valorTotal: Number(e.target.value)})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      readOnly
                    />
                  </div>

                  {/* Status de Pagamento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status de Pagamento
                    </label>
                    <select
                      value={formData.statusPagamento}
                      onChange={(e) => setFormData({...formData, statusPagamento: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loadingAction === 'salvar'}
                    >
                      <option value="PENDENTE">Pendente</option>
                      <option value="PAGO">Pago</option>
                      <option value="PARCIAL">Parcial</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </div>

                  {/* Prazo Legal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prazo Legal
                    </label>
                    <input
                      type="date"
                      value={formData.prazoLegal}
                      onChange={(e) => setFormData({...formData, prazoLegal: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loadingAction === 'salvar'}
                    />
                  </div>

                  {/* Descrição */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descreva os detalhes do processo..."
                      disabled={loadingAction === 'salvar'}
                    />
                  </div>

                  {/* Observações */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações
                    </label>
                    <textarea
                      value={formData.observacoes}
                      onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Observações adicionais..."
                      disabled={loadingAction === 'salvar'}
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNovoProcesso(false)
                      setProcessoSelecionado(null)
                      setIsEditing(false)
                    }}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    disabled={loadingAction === 'salvar'}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    disabled={loadingAction === 'salvar'}
                  >
                    {loadingAction === 'salvar' && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    {isEditing ? 'Atualizar' : 'Criar'} Processo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalhes do Processo */}
      {showDetalhesProcesso && processoSelecionado && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Detalhes do Processo
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {processoSelecionado.numero}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setShowDetalhesProcesso(false)
                      handleEditarProcesso(processoSelecionado)
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setShowDetalhesProcesso(false)
                      setProcessoSelecionado(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Informações Básicas */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Título</label>
                        <p className="text-sm text-gray-900 mt-1">{processoSelecionado.titulo}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Tipo de Serviço</label>
                        <p className="text-sm text-gray-900 mt-1">{processoSelecionado.tipoServico}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Status</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[processoSelecionado.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'} mt-1`}>
                          {processoSelecionado.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Prioridade</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prioridadeColors[processoSelecionado.prioridade as keyof typeof prioridadeColors] || 'bg-gray-100 text-gray-800'} mt-1`}>
                          {processoSelecionado.prioridade}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Data de Início</label>
                        <p className="text-sm text-gray-900 mt-1">{formatDate(processoSelecionado.dataInicio)}</p>
                      </div>
                      {processoSelecionado.prazoLegal && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Prazo Legal</label>
                          <p className="text-sm text-gray-900 mt-1">{formatDate(processoSelecionado.prazoLegal)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cliente */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Cliente</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Nome</label>
                        <p className="text-sm text-gray-900 mt-1">{processoSelecionado.customer.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="text-sm text-gray-900 mt-1">{processoSelecionado.customer.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Veículo (se houver) */}
                  {processoSelecionado.veiculo && (
                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Veículo</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Marca/Modelo</label>
                          <p className="text-sm text-gray-900 mt-1">
                            {processoSelecionado.veiculo.marca} {processoSelecionado.veiculo.modelo}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Placa</label>
                          <p className="text-sm text-gray-900 mt-1">{processoSelecionado.veiculo.placa}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Ano</label>
                          <p className="text-sm text-gray-900 mt-1">{processoSelecionado.veiculo.ano}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Descrição e Observações */}
                  {(processoSelecionado.descricao || processoSelecionado.observacoes) && (
                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Detalhes</h4>
                      {processoSelecionado.descricao && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-500">Descrição</label>
                          <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{processoSelecionado.descricao}</p>
                        </div>
                      )}
                      {processoSelecionado.observacoes && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Observações</label>
                          <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{processoSelecionado.observacoes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Valores */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Valores</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Serviço:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(processoSelecionado.valorServico)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Taxas:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(processoSelecionado.valorTaxas)}
                        </span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-900">Total:</span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(processoSelecionado.valorTotal)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs text-gray-500">Status do Pagamento:</span>
                        <div className="mt-1">
                          {processoSelecionado.statusPagamento === 'PAGO' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Pago
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              ⏳ {processoSelecionado.statusPagamento}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Responsável */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Responsável</h4>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">
                        {processoSelecionado.responsavel.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {processoSelecionado.responsavel.email}
                      </p>
                    </div>
                  </div>

                  {/* Ações Rápidas */}
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Ações</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setShowDetalhesProcesso(false)
                          handleEditarProcesso(processoSelecionado)
                        }}
                        className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Processo
                      </button>
                      <button
                        onClick={() => handleExcluirProcesso(processoSelecionado)}
                        className="w-full flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir Processo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Filtros Avançados */}
      {showFiltrosAvancados && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filtros Avançados</h3>
                <button
                  onClick={() => setShowFiltrosAvancados(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-700">
                  🔍 <strong>Em desenvolvimento:</strong> Filtros avançados para processos.
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  Incluirá filtros por data, valor, responsável, tipo de serviço, etc.
                </p>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowFiltrosAvancados(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    // Aqui implementaremos a lógica de aplicar filtros
                    alert('Aplicando filtros... (implementar)')
                    setShowFiltrosAvancados(false)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProcessosPage() {
  return (
    <ProtectedRoute>
      <ProcessosContent />
    </ProtectedRoute>
  )
}
