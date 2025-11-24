'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, MoreHorizontal, User, Building, Phone, Mail, MapPin, Eye } from 'lucide-react'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import NovoClienteModal from '@/components/admin/NovoClienteModal'

interface Cliente {
  id: string
  name: string
  cpfCnpj: string
  tipoCliente: 'FISICO' | 'JURIDICO'
  phone: string
  email?: string
  cidade?: string
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO'
  createdAt: string
  processosAtivos: number
  ultimoProcesso?: string
}

// Dados mock para demonstração
const clientesMock: Cliente[] = [
  {
    id: '1',
    name: 'João Silva Santos',
    cpfCnpj: '123.456.789-01',
    tipoCliente: 'FISICO',
    phone: '(16) 99999-1234',
    email: 'joao@email.com',
    cidade: 'Franca',
    status: 'ATIVO',
    createdAt: '2024-01-15',
    processosAtivos: 2,
    ultimoProcesso: 'Transferência Honda Civic'
  },
  {
    id: '2',
    name: 'Transportadora ABC Ltda',
    cpfCnpj: '12.345.678/0001-90',
    tipoCliente: 'JURIDICO',
    phone: '(16) 3333-5678',
    email: 'contato@transportadoraabc.com',
    cidade: 'Ribeirão Preto',
    status: 'ATIVO',
    createdAt: '2024-02-20',
    processosAtivos: 5,
    ultimoProcesso: 'Licenciamento Frota'
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    cpfCnpj: '987.654.321-09',
    tipoCliente: 'FISICO',
    phone: '(16) 98888-5555',
    email: 'maria@outlook.com',
    cidade: 'Franca',
    status: 'ATIVO',
    createdAt: '2024-03-10',
    processosAtivos: 1,
    ultimoProcesso: 'Primeiro Emplacamento'
  }
]

function ClientesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'FISICO' | 'JURIDICO'>('TODOS')
  const [filtroStatus, setFiltroStatus] = useState<'TODOS' | 'ATIVO' | 'INATIVO' | 'SUSPENSO'>('TODOS')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customers')
      
      if (response.ok) {
        const data = await response.json()
        // Converter dados do banco para o formato esperado
        const clientesFormatados = data.map((customer: any) => ({
          id: customer.id,
          name: customer.name,
          cpfCnpj: customer.cpfCnpj,
          tipoCliente: customer.tipoCliente,
          phone: customer.phone,
          email: customer.email,
          cidade: customer.cidade,
          status: 'ATIVO', // Por enquanto todos ativos
          createdAt: new Date(customer.createdAt).toLocaleDateString('pt-BR'),
          processosAtivos: 0, // Implementar depois
          ultimoProcesso: undefined
        }))
        setClientes(clientesFormatados)
      } else {
        console.error('Erro ao buscar clientes')
        // Em caso de erro, usar dados mock temporariamente
        setClientes(clientesMock)
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      setClientes(clientesMock)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCliente = async (novoCliente: any) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoCliente)
      })

      if (response.ok) {
        await fetchClientes() // Recarregar lista
        setIsModalOpen(false)
      } else {
        const error = await response.json()
        console.error('Erro ao criar cliente:', error.error)
        alert('Erro ao criar cliente: ' + error.error)
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      alert('Erro ao criar cliente')
    }
  }

  const clientesFiltrados = clientes.filter(cliente => {
    const matchSearch = cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       cliente.cpfCnpj.includes(searchTerm) ||
                       cliente.phone.includes(searchTerm)
    
    const matchTipo = filtroTipo === 'TODOS' || cliente.tipoCliente === filtroTipo
    const matchStatus = filtroStatus === 'TODOS' || cliente.status === filtroStatus
    
    return matchSearch && matchTipo && matchStatus
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      ATIVO: 'bg-green-100 text-green-800 border-green-200',
      INATIVO: 'bg-gray-100 text-gray-800 border-gray-200',
      SUSPENSO: 'bg-red-100 text-red-800 border-red-200'
    }
    return styles[status as keyof typeof styles] || styles.ATIVO
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === 'FISICO' ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
              <p className="text-gray-600 mt-1">
                {session?.user?.tenant?.name} - {loading ? 'Carregando...' : `${clientes.length} clientes cadastrados`}
              </p>
            </div>
            <div className="flex space-x-3">
              <a
                href="/dashboard"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                Voltar ao Dashboard
              </a>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Cliente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF/CNPJ ou telefone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as any)}
            >
              <option value="TODOS">Todos os Tipos</option>
              <option value="FISICO">Pessoa Física</option>
              <option value="JURIDICO">Pessoa Jurídica</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as any)}
            >
              <option value="TODOS">Todos os Status</option>
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="SUSPENSO">Suspenso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pessoa Física</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientes.filter(c => c.tipoCliente === 'FISICO').length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pessoa Jurídica</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientes.filter(c => c.tipoCliente === 'JURIDICO').length}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clientes.reduce((acc, c) => acc + c.processosAtivos, 0)}
                </p>
              </div>
              <div className="bg-orange-100 p-2 rounded-lg">
                <Filter className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atividade
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          {getTipoIcon(cliente.tipoCliente)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{cliente.name}</div>
                          <div className="text-sm text-gray-500">{cliente.cpfCnpj}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {cliente.phone}
                      </div>
                      {cliente.email && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {cliente.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {cliente.cidade || 'Não informado'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(cliente.status)}`}>
                        {cliente.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cliente.processosAtivos} processo{cliente.processosAtivos !== 1 ? 's' : ''} ativo{cliente.processosAtivos !== 1 ? 's' : ''}
                      </div>
                      {cliente.ultimoProcesso && (
                        <div className="text-sm text-gray-500">{cliente.ultimoProcesso}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => router.push(`/admin/clientes/${cliente.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          title="Ver detalhes e recomendações ML"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {clientesFiltrados.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filtroTipo !== 'TODOS' || filtroStatus !== 'TODOS'
                ? 'Tente ajustar os filtros ou termo de busca'
                : 'Comece adicionando seu primeiro cliente ao sistema'
              }
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Adicionar Cliente
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <NovoClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCliente}
      />
    </div>
  )
}

function ClientesPageWrapper() {
  return (
    <ProtectedRoute>
      <ClientesPage />
    </ProtectedRoute>
  )
}

export default ClientesPageWrapper
