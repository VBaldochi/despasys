'use client'

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  CurrencyDollarIcon, 
  BanknotesIcon, 
  ExclamationCircleIcon,
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import TransacoesList from './TransacoesList';
import NovaTransacaoModal from './NovaTransacaoModal';

interface FinanceData {
  totalReceitas: number;
  totalDespesas: number;
  saldoAtual: number;
  contasPendentes: number;
  contasVencidas: number;
  transacoesRecentes: any[];
}

export default function FinanceiroDashboard() {
  const { data: session } = useSession();
  const [financeData, setFinanceData] = useState<FinanceData>({
    totalReceitas: 0,
    totalDespesas: 0,
    saldoAtual: 0,
    contasPendentes: 0,
    contasVencidas: 0,
    transacoesRecentes: []
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transacoes'>('dashboard');

  useEffect(() => {
    if (session) {
      fetchFinanceData();
    }
  }, [session]);

  const fetchFinanceData = async () => {
    try {
      const response = await fetch('/api/financeiro/dashboard');
      if (response.ok) {
        const data = await response.json();
        setFinanceData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
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

  const handleNovaTransacao = () => {
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    fetchFinanceData();
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
        <button 
          onClick={handleNovaTransacao}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Nova Transação
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('transacoes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transacoes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transações
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'dashboard' ? (
        <>
          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Saldo Atual */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BanknotesIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
                  <p className={`text-2xl font-bold ${financeData.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(financeData.saldoAtual)}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Receitas */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receitas (mês)</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(financeData.totalReceitas)}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Despesas */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Despesas (mês)</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(financeData.totalDespesas)}
                  </p>
                </div>
              </div>
            </div>

            {/* Contas Vencidas */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contas Vencidas</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {financeData.contasVencidas}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transações Recentes */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Transações Recentes</h2>
              <button
                onClick={() => setActiveTab('transacoes')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver todas
              </button>
            </div>
            <div className="p-6">
              {financeData.transacoesRecentes.length > 0 ? (
                <div className="space-y-4">
                  {financeData.transacoesRecentes.slice(0, 5).map((transacao) => (
                    <div key={transacao.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{transacao.descricao}</p>
                        <p className="text-sm text-gray-500">{transacao.categoria}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transacao.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                          {transacao.tipo === 'RECEITA' ? '+' : '-'} {formatCurrency(transacao.valor)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(transacao.dataVencimento).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma transação encontrada</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <TransacoesList onNovaTransacao={handleNovaTransacao} />
      )}

      {/* Modal */}
      <NovaTransacaoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
