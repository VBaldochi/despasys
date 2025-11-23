'use client'

import { useState, useEffect, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  TruckIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface NovaFaturaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FaturaFormData) => Promise<void>
}

interface Customer {
  id: string
  name: string
  cpf: string
  phone: string
  email?: string
}

interface Process {
  id: string
  numero: string
  tipo: string
}

export interface FaturaFormData {
  customerId: string
  customerName: string
  processoId?: string
  processoNumero?: string
  servico: string
  descricao: string
  valor: number
  dataEmissao: string
  dataVencimento: string
  metodoPagamento?: string
  observacoes?: string
}

const servicosDisponiveis = [
  'Transferência de Veículo',
  'Licenciamento Anual',
  'Primeiro Emplacamento',
  'Segunda Via de Documento',
  'Baixa de Veículo',
  'Mudança de Categoria',
  'Renovação de CNH',
  'Registro de Veículo 0km',
  'Desbloqueio de Veículo',
  'Vistoria Veicular',
  'Consultoria',
  'Outros Serviços'
]

export default function NovaFaturaModal({ isOpen, onClose, onSubmit }: NovaFaturaModalProps) {
  const [formData, setFormData] = useState<FaturaFormData>({
    customerId: '',
    customerName: '',
    processoId: '',
    processoNumero: '',
    servico: '',
    descricao: '',
    valor: 0,
    dataEmissao: new Date().toISOString().split('T')[0],
    dataVencimento: '',
    metodoPagamento: '',
    observacoes: ''
  })

  const [customers, setCustomers] = useState<Customer[]>([])
  const [processes, setProcesses] = useState<Process[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [loadingProcesses, setLoadingProcesses] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
    }
  }, [isOpen])

  useEffect(() => {
    if (formData.customerId) {
      fetchProcesses(formData.customerId)
    } else {
      setProcesses([])
    }
  }, [formData.customerId])

  const fetchCustomers = async () => {
    setLoadingCustomers(true)
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoadingCustomers(false)
    }
  }

  const fetchProcesses = async (customerId: string) => {
    setLoadingProcesses(true)
    try {
      const response = await fetch(`/api/processes?customerId=${customerId}`)
      if (response.ok) {
        const data = await response.json()
        setProcesses(Array.isArray(data) ? data : data.processes || [])
      }
    } catch (error) {
      console.error('Error fetching processes:', error)
    } finally {
      setLoadingProcesses(false)
    }
  }

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId: customer.id,
        customerName: customer.name,
        processoId: '',
        processoNumero: ''
      }))
    }
  }

  const handleProcessChange = (processoId: string) => {
    const process = processes.find(p => p.id === processoId)
    if (process) {
      setFormData(prev => ({
        ...prev,
        processoId: process.id,
        processoNumero: process.numero
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerId) {
      newErrors.customerId = 'Selecione um cliente'
    }

    if (!formData.servico) {
      newErrors.servico = 'Selecione um serviço'
    }

    if (!formData.descricao) {
      newErrors.descricao = 'Descrição é obrigatória'
    }

    if (!formData.valor || formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero'
    }

    if (!formData.dataVencimento) {
      newErrors.dataVencimento = 'Data de vencimento é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(formData)
      handleClose()
    } catch (error) {
      console.error('Error submitting invoice:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      customerId: '',
      customerName: '',
      processoId: '',
      processoNumero: '',
      servico: '',
      descricao: '',
      valor: 0,
      dataEmissao: new Date().toISOString().split('T')[0],
      dataVencimento: '',
      metodoPagamento: '',
      observacoes: ''
    })
    setErrors({})
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="h-6 w-6 text-white" />
                      <Dialog.Title className="text-lg font-semibold text-white">
                        Nova Fatura
                      </Dialog.Title>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {/* Cliente */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="text-sm font-semibold text-blue-900">Cliente</h3>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Selecione o Cliente *
                        </label>
                        <select
                          value={formData.customerId}
                          onChange={(e) => handleCustomerChange(e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.customerId ? 'border-red-500' : 'border-gray-300'
                          }`}
                          disabled={loadingCustomers}
                        >
                          <option value="">
                            {loadingCustomers ? 'Carregando...' : 'Selecione um cliente'}
                          </option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} - {customer.cpf}
                            </option>
                          ))}
                        </select>
                        {errors.customerId && (
                          <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>
                        )}
                      </div>
                    </div>

                    {/* Processo (opcional) */}
                    {formData.customerId && (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <TruckIcon className="h-5 w-5 text-gray-600" />
                          <h3 className="text-sm font-semibold text-gray-900">Processo (Opcional)</h3>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vincular a um Processo
                          </label>
                          <select
                            value={formData.processoId}
                            onChange={(e) => handleProcessChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={loadingProcesses}
                          >
                            <option value="">
                              {loadingProcesses ? 'Carregando...' : 'Nenhum processo selecionado'}
                            </option>
                            {processes.map(process => (
                              <option key={process.id} value={process.id}>
                                {process.numero} - {process.tipo}
                              </option>
                            ))}
                          </select>
                          {processes.length === 0 && formData.customerId && !loadingProcesses && (
                            <p className="text-sm text-gray-500 mt-1">Nenhum processo encontrado para este cliente</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Serviço */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                        <h3 className="text-sm font-semibold text-green-900">Serviço</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Serviço *
                          </label>
                          <select
                            value={formData.servico}
                            onChange={(e) => setFormData(prev => ({ ...prev, servico: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.servico ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Selecione um serviço</option>
                            {servicosDisponiveis.map(servico => (
                              <option key={servico} value={servico}>{servico}</option>
                            ))}
                          </select>
                          {errors.servico && (
                            <p className="text-red-500 text-xs mt-1">{errors.servico}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição *
                          </label>
                          <textarea
                            value={formData.descricao}
                            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.descricao ? 'border-red-500' : 'border-gray-300'
                            }`}
                            rows={3}
                            placeholder="Detalhes do serviço prestado"
                          />
                          {errors.descricao && (
                            <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Valores e Datas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            R$
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.valor || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.valor ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="0,00"
                          />
                        </div>
                        {errors.valor && (
                          <p className="text-red-500 text-xs mt-1">{errors.valor}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Emissão
                        </label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="date"
                            value={formData.dataEmissao}
                            onChange={(e) => setFormData(prev => ({ ...prev, dataEmissao: e.target.value }))}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Vencimento *
                        </label>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="date"
                            value={formData.dataVencimento}
                            onChange={(e) => setFormData(prev => ({ ...prev, dataVencimento: e.target.value }))}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.dataVencimento ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.dataVencimento && (
                          <p className="text-red-500 text-xs mt-1">{errors.dataVencimento}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Método de Pagamento
                        </label>
                        <select
                          value={formData.metodoPagamento}
                          onChange={(e) => setFormData(prev => ({ ...prev, metodoPagamento: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Selecione</option>
                          <option value="dinheiro">Dinheiro</option>
                          <option value="pix">PIX</option>
                          <option value="cartao_credito">Cartão de Crédito</option>
                          <option value="cartao_debito">Cartão de Débito</option>
                          <option value="transferencia">Transferência</option>
                          <option value="boleto">Boleto</option>
                        </select>
                      </div>
                    </div>

                    {/* Observações */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observações
                      </label>
                      <textarea
                        value={formData.observacoes}
                        onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="Informações adicionais"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={submitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Salvando...
                        </>
                      ) : (
                        'Criar Fatura'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
