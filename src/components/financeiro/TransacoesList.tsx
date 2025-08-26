'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Transacao {
  id: string;
  numero: string;
  descricao: string;
  categoria: string;
  valor: number;
  tipo: 'RECEITA' | 'DESPESA';
  status: 'PENDENTE' | 'PAGO' | 'VENCIDO' | 'CANCELADO';
  dataVencimento: string;
  dataPagamento?: string;
  cliente?: { id: string; name: string };
  processo?: { id: string; numero: string };
}

interface TransacoesListProps {
  onNovaTransacao?: () => void;
}

export default function TransacoesList({ onNovaTransacao }: TransacoesListProps) {
  const { data: session } = useSession();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (session) {
      console.log('Buscando transações...');
      fetchTransacoes();
    }
  }, [session, search, filtroTipo, filtroStatus, page]);

  const fetchTransacoes = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (search) params.append('search', search);
      if (filtroTipo) params.append('tipo', filtroTipo);
      if (filtroStatus) params.append('status', filtroStatus);

      console.log('Fazendo requisição para:', `/api/financeiro/transacoes?${params}`);
      const response = await fetch(`/api/financeiro/transacoes?${params}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Transações recebidas:', data);
        setTransacoes(data.transacoes);
        setTotal(data.pagination.total);
      } else {
        console.error('Erro na resposta:', response.status);
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDENTE: 'bg-yellow-100 text-yellow-800',
      PAGO: 'bg-green-100 text-green-800',
      VENCIDO: 'bg-red-100 text-red-800',
      CANCELADO: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600';
  };

  const marcarComoPago = async (transacaoId: string) => {
    try {
      const response = await fetch(`/api/financeiro/transacoes/${transacaoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'PAGO',
          dataPagamento: new Date().toISOString()
        })
      });

      if (response.ok) {
        fetchTransacoes(); // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao marcar como pago:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Transações</h2>
        <button
          onClick={onNovaTransacao}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Nova Transação
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descrição, categoria ou cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Botão Filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5" />
            Filtros
          </button>
        </div>

        {/* Filtros Expandidos */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago</option>
                <option value="VENCIDO">Vencido</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Transações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transação
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
                  Cliente/Processo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transacoes.map((transacao) => (
                <tr key={transacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {transacao.descricao}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transacao.categoria} • {transacao.numero}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-bold ${getTipoColor(transacao.tipo)}`}>
                      {transacao.tipo === 'RECEITA' ? '+' : '-'} {formatCurrency(transacao.valor)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transacao.tipo}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(transacao.dataVencimento)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transacao.status)}`}>
                      {transacao.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transacao.cliente && (
                      <div>{transacao.cliente.name}</div>
                    )}
                    {transacao.processo && (
                      <div className="text-gray-500">{transacao.processo.numero}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {transacao.status === 'PENDENTE' && (
                        <button
                          onClick={() => marcarComoPago(transacao.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Marcar como pago"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Visualizar"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transacoes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>

      {/* Paginação */}
      {total > 10 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Mostrando {(page - 1) * 10 + 1} até {Math.min(page * 10, total)} de {total} resultados
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * 10 >= total}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
