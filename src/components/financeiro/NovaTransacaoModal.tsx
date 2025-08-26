'use client'

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Customer {
  id: string;
  name: string;
}

interface Process {
  id: string;
  numero: string;
}

interface NovaTransacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NovaTransacaoModal({ isOpen, onClose, onSuccess }: NovaTransacaoModalProps) {
  const categorias = {
    RECEITA: [
      { value: 'Serviços Prestados', requiresCustomer: true, requiresProcess: true },
      { value: 'Emolumentos', requiresCustomer: true, requiresProcess: true },
      { value: 'Taxas Administrativas', requiresCustomer: true, requiresProcess: false },
      { value: 'Consultoria', requiresCustomer: true, requiresProcess: false },
      { value: 'Outros Serviços', requiresCustomer: false, requiresProcess: false }
    ],
    DESPESA: [
      { value: 'Emolumentos Cartório', requiresCustomer: false, requiresProcess: true },
      { value: 'Taxas DETRAN', requiresCustomer: false, requiresProcess: true },
      { value: 'Despesas Operacionais', requiresCustomer: false, requiresProcess: false },
      { value: 'Material de Escritório', requiresCustomer: false, requiresProcess: false },
      { value: 'Telecomunicações', requiresCustomer: false, requiresProcess: false },
      { value: 'Combustível', requiresCustomer: false, requiresProcess: false },
      { value: 'Aluguel', requiresCustomer: false, requiresProcess: false },
      { value: 'Energia Elétrica', requiresCustomer: false, requiresProcess: false },
      { value: 'Água', requiresCustomer: false, requiresProcess: false },
      { value: 'Internet', requiresCustomer: false, requiresProcess: false },
      { value: 'Outros', requiresCustomer: false, requiresProcess: false }
    ]
  };

  const [formData, setFormData] = useState({
    tipo: 'RECEITA',
    categoria: '',
    descricao: '',
    valor: '',
    dataVencimento: '',
    customerId: '',
    processoId: '',
    metodoPagamento: '',
    observacoes: ''
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Obter configuração da categoria selecionada
  const selectedCategoryConfig = formData.categoria 
    ? categorias[formData.tipo as keyof typeof categorias]?.find(cat => cat.value === formData.categoria)
    : null;
  
  const showCustomerField = selectedCategoryConfig?.requiresCustomer || false;
  const showProcessField = selectedCategoryConfig?.requiresProcess || false;

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchProcesses();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      console.log('Buscando clientes...');
      const response = await fetch('/api/customers');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Clientes recebidos:', data);
        // A API retorna diretamente o array de customers
        setCustomers(Array.isArray(data) ? data : []);
      } else {
        console.error('Erro na resposta:', response.status);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const fetchProcesses = async () => {
    try {
      console.log('Buscando processos...');
      const response = await fetch('/api/processes');
      console.log('Response status processos:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Processos recebidos:', data);
        // A API pode retornar diretamente o array ou em data.processes
        setProcesses(Array.isArray(data) ? data : (data.processes || []));
      } else {
        console.error('Erro na resposta processos:', response.status);
      }
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero';
    }
    if (!formData.dataVencimento) newErrors.dataVencimento = 'Data de vencimento é obrigatória';

    // Validar campos condicionais baseados na categoria
    if (selectedCategoryConfig?.requiresCustomer && !formData.customerId) {
      newErrors.customerId = 'Cliente é obrigatório para esta categoria';
    }
    if (selectedCategoryConfig?.requiresProcess && !formData.processoId) {
      newErrors.processoId = 'Processo é obrigatório para esta categoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Limpar campos que não são necessários baseado na categoria
      const submitData = {
        ...formData,
        valor: parseFloat(formData.valor),
        customerId: showCustomerField ? (formData.customerId || null) : null,
        processoId: showProcessField ? (formData.processoId || null) : null
      };

      const response = await fetch('/api/financeiro/transacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          tipo: 'RECEITA',
          categoria: '',
          descricao: '',
          valor: '',
          dataVencimento: '',
          customerId: '',
          processoId: '',
          metodoPagamento: '',
          observacoes: ''
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar transação');
      }
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      alert('Erro ao criar transação');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Se mudou a categoria, limpar cliente e processo se não são necessários
      if (name === 'categoria') {
        const categoryConfig = categorias[prev.tipo as keyof typeof categorias]
          .find(cat => cat.value === value);
        
        if (!categoryConfig?.requiresCustomer) {
          newData.customerId = '';
        }
        if (!categoryConfig?.requiresProcess) {
          newData.processoId = '';
        }
      }
      
      return newData;
    });
    
    // Limpar erro quando campo for preenchido
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nova Transação</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="RECEITA">Receita</option>
              <option value="DESPESA">Despesa</option>
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.categoria ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecione uma categoria</option>
              {categorias[formData.tipo as keyof typeof categorias].map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.value}</option>
              ))}
            </select>
            {errors.categoria && (
              <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.descricao ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Serviço de transferência de veículo"
            />
            {errors.descricao && (
              <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>
            )}
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor *
              </label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.valor ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0,00"
              />
              {errors.valor && (
                <p className="text-red-500 text-sm mt-1">{errors.valor}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Vencimento *
              </label>
              <input
                type="date"
                name="dataVencimento"
                value={formData.dataVencimento}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.dataVencimento ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dataVencimento && (
                <p className="text-red-500 text-sm mt-1">{errors.dataVencimento}</p>
              )}
            </div>
          </div>

          {/* Cliente e Processo - condicionais */}
          {(showCustomerField || showProcessField) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cliente */}
              {showCustomerField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente {selectedCategoryConfig?.requiresCustomer ? '*' : ''}
                  </label>
                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.customerId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                  {errors.customerId && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>
                  )}
                  {customers.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">Nenhum cliente encontrado</p>
                  )}
                </div>
              )}

              {/* Processo */}
              {showProcessField && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processo {selectedCategoryConfig?.requiresProcess ? '*' : ''}
                  </label>
                  <select
                    name="processoId"
                    value={formData.processoId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.processoId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione um processo</option>
                    {processes.map((process) => (
                      <option key={process.id} value={process.id}>
                        {process.numero}
                      </option>
                    ))}
                  </select>
                  {errors.processoId && (
                    <p className="text-red-500 text-sm mt-1">{errors.processoId}</p>
                  )}
                  {processes.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">Nenhum processo encontrado</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Método de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Pagamento
            </label>
            <select
              name="metodoPagamento"
              value={formData.metodoPagamento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o método</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="pix">PIX</option>
              <option value="cartao_credito">Cartão de Crédito</option>
              <option value="cartao_debito">Cartão de Débito</option>
              <option value="transferencia">Transferência Bancária</option>
              <option value="boleto">Boleto</option>
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Transação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
