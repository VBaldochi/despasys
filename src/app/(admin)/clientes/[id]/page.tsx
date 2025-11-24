'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, Mail, MapPin, FileText, Calendar, TrendingUp } from 'lucide-react';
import { MLRecommendations } from '@/components/MLRecommendations';

interface CustomerDetails {
  id: string;
  name: string;
  cpfCnpj: string;
  tipoCliente: string;
  phone: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  createdAt: string;
}

interface Process {
  id: string;
  numero: string;
  tipoServico: string;
  status: string;
  dataInicio: string;
  valorTotal: number;
}

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetails | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, [params.id]);

  const fetchCustomerData = async () => {
    try {
      // Buscar dados do cliente
      const customerRes = await fetch(`/api/customers/${params.id}`);
      if (customerRes.ok) {
        const customerData = await customerRes.json();
        setCustomer(customerData);
      }

      // Buscar processos do cliente
      const processesRes = await fetch(`/api/processes?customerId=${params.id}`);
      if (processesRes.ok) {
        const processesData = await processesRes.json();
        setProcesses(processesData.slice(0, 5)); // Últimos 5 processos
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: string) => {
    router.push(`/admin/processes/new?customerId=${params.id}&service=${service}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600 mb-4">Cliente não encontrado</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-600 mt-1">Detalhes do cliente e recomendações</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Informações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Informações do Cliente */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informações do Cliente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">CPF/CNPJ</label>
                  <p className="text-gray-900">{customer.cpfCnpj}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-gray-900">
                    {customer.tipoCliente === 'FISICO' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </label>
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
                {customer.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      E-mail
                    </label>
                    <p className="text-gray-900">{customer.email}</p>
                  </div>
                )}
                {customer.endereco && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Endereço
                    </label>
                    <p className="text-gray-900">
                      {customer.endereco}, {customer.cidade} - {customer.estado}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Cliente desde
                  </label>
                  <p className="text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Card de Histórico de Processos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Últimos Processos
              </h2>
              {processes.length > 0 ? (
                <div className="space-y-3">
                  {processes.map((process) => (
                    <div
                      key={process.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {process.numero}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          process.status === 'CONCLUIDO'
                            ? 'bg-green-100 text-green-800'
                            : process.status === 'EM_ANDAMENTO'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {process.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{process.tipoServico}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{new Date(process.dataInicio).toLocaleDateString('pt-BR')}</span>
                        <span className="font-medium text-green-600">
                          R$ {process.valorTotal?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum processo encontrado</p>
              )}
            </div>
          </div>

          {/* Sidebar - Recomendações ML */}
          <div className="lg:col-span-1">
            <MLRecommendations
              customerId={params.id}
              onServiceSelect={handleServiceSelect}
            />

            {/* Botão de Ação Rápida */}
            <button
              onClick={() => router.push(`/admin/processes/new?customerId=${params.id}`)}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="h-5 w-5" />
              Criar Novo Processo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
