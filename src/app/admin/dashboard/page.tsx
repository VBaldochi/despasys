'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useSWR from 'swr'
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  FileText, 
  Users
} from 'lucide-react'

interface Stats {
  totalClientes: number
  processosAtivos: number
  veiculos: number
  usuarios: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  cpfCnpj: string
  tipoCliente: string
  createdAt: string
}

interface Process {
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
  }
  tipoServico: string
  titulo: string
  status: string
  valorTotal: number
  dataInicio: string
}

// Fetcher function para SWR
const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      const currentUrl = window.location.pathname + window.location.search
      const tenant = new URLSearchParams(window.location.search).get('tenant') || 'demo'
      router.push(`/auth/login?tenant=${tenant}&callbackUrl=${encodeURIComponent(currentUrl)}`)
      return
    }
  }, [session, status, router])
  
  // SWR hooks para cache automático e revalidação
  const { data: stats, error: statsError } = useSWR<Stats>(
    session ? '/api/dashboard/stats' : null, 
    fetcher,
    { 
      refreshInterval: 60000,
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    }
  )
  
  const { data: customers, error: customersError } = useSWR<Customer[]>(
    session ? '/api/customers' : null, 
    fetcher,
    { 
      refreshInterval: 120000,
      revalidateOnFocus: false
    }
  )
  
  const { data: processes, error: processesError } = useSWR<Process[]>(
    session ? '/api/processes' : null, 
    fetcher,
    { 
      refreshInterval: 90000,
      revalidateOnFocus: false
    }
  )

  // Loading state durante autenticação
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Se não está autenticado
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const loading = !stats || !customers || !processes
  const hasError = statsError || customersError || processesError

  const tenantInfo = session?.user?.tenant

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
    const styles = {
      'AGUARDANDO_DOCUMENTOS': 'bg-yellow-100 text-yellow-800',
      'EM_PROCESSAMENTO': 'bg-blue-100 text-blue-800',
      'FINALIZADO': 'bg-green-100 text-green-800',
      'CANCELADO': 'bg-red-100 text-red-800',
      'AGUARDANDO_PAGAMENTO': 'bg-orange-100 text-orange-800'
    }
    
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  const processosEmAndamento = processes?.filter(p => 
    p.status === 'EM_PROCESSAMENTO' || p.status === 'AGUARDANDO_DOCUMENTOS'
  ).length || 0

  const processosFinalizados = processes?.filter(p => p.status === 'FINALIZADO').length || 0
  
  const faturamentoTotal = processes?.reduce((acc, p) => acc + p.valorTotal, 0) || 0

  const recentCustomers = customers?.slice(0, 5) || []
  const recentProcesses = processes?.slice(0, 5) || []

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar dados</h3>
          <p className="mt-1 text-sm text-gray-500">Tente recarregar a página</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard - {tenantInfo?.name || 'Despachante Demo Ltda'}
                </h1>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Plano: {tenantInfo?.plan?.replace('_', ' ') || 'DESPACHANTE SOLO'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Domain: {tenantInfo?.domain || 'demo'}
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-2 font-medium">
                  Bem-vindo, {session?.user?.name}! ({session?.user?.email})
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-lg font-semibold text-gray-900 mt-1">
                  {new Date().toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Clientes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Clientes</p>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats?.totalClientes || 0
                  )}
                </div>
                <p className="text-xs text-green-600 mt-1 font-medium">
                  +{recentCustomers.length} este mês
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Processos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Processos Ativos</p>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    processosEmAndamento
                  )}
                </div>
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  {recentProcesses.length} total
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Veículos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Veículos</p>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-12 rounded"></div>
                  ) : (
                    stats?.veiculos || 0
                  )}
                </div>
                <p className="text-xs text-purple-600 mt-1 font-medium">
                  Cadastrados
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Faturamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Faturamento</p>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                  ) : (
                    <span className="text-2xl">{formatCurrency(faturamentoTotal)}</span>
                  )}
                </div>
                <p className="text-xs text-yellow-600 mt-1 font-medium">
                  Este período
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl">
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid de conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Processos Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Processos Recentes</h3>
                <span className="text-sm text-gray-500">{recentProcesses.length} processos</span>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-200 h-12 w-12 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                          <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                        </div>
                        <div className="bg-gray-200 h-4 w-20 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentProcesses.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum processo</h3>
                  <p className="mt-1 text-sm text-gray-500">Comece criando seu primeiro processo.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProcesses.map((processo) => (
                    <div key={processo.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-gray-900 text-sm">{processo.numero}</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(processo.status)}`}>
                              {processo.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{processo.customer.name}</p>
                          <p className="text-xs text-gray-500">{processo.tipoServico}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 text-sm">{formatCurrency(processo.valorTotal)}</p>
                        <p className="text-xs text-gray-500">{formatDate(processo.dataInicio)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clientes Recentes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Clientes Recentes</h3>
                <span className="text-sm text-gray-500">{recentCustomers.length} clientes</span>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-200 h-12 w-12 rounded-full"></div>
                        <div className="flex-1">
                          <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                          <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                        </div>
                        <div className="bg-gray-200 h-6 w-8 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentCustomers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente</h3>
                  <p className="mt-1 text-sm text-gray-500">Comece adicionando seu primeiro cliente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentCustomers.map((cliente) => (
                    <div key={cliente.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{cliente.name}</p>
                        <p className="text-sm text-gray-600 truncate">{cliente.email}</p>
                        <p className="text-xs text-gray-500">{cliente.phone}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cliente.tipoCliente === 'FISICO' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {cliente.tipoCliente === 'FISICO' ? 'PF' : 'PJ'}
                        </span>
                        <p className="text-xs text-gray-500 mt-2">{formatDate(cliente.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resumo do Sistema */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
              Resumo do Sistema
            </h3>
            <div className="text-sm text-gray-500">
              Atualizado em {new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{processosFinalizados}</div>
              <div className="text-sm font-medium text-gray-600">Processos Finalizados</div>
              <div className="text-xs text-gray-500 mt-1">Concluídos com sucesso</div>
            </div>
            
            <div className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{processosEmAndamento}</div>
              <div className="text-sm font-medium text-gray-600">Em Andamento</div>
              <div className="text-xs text-gray-500 mt-1">Aguardando finalização</div>
            </div>
            
            <div className="text-center bg-white rounded-lg p-6 shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats?.usuarios || 1}</div>
              <div className="text-sm font-medium text-gray-600">Usuários Ativos</div>
              <div className="text-xs text-gray-500 mt-1">Conectados no sistema</div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">{((processosFinalizados / (recentProcesses.length || 1)) * 100).toFixed(0)}%</div>
                <div className="text-xs text-gray-500">Taxa de Conclusão</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{formatCurrency(faturamentoTotal / (recentProcesses.length || 1))}</div>
                <div className="text-xs text-gray-500">Ticket Médio</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{recentCustomers.filter(c => c.tipoCliente === 'FISICO').length}</div>
                <div className="text-xs text-gray-500">Clientes PF</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{recentCustomers.filter(c => c.tipoCliente === 'JURIDICO').length}</div>
                <div className="text-xs text-gray-500">Clientes PJ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
