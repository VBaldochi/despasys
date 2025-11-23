'use client'

import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  XMarkIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface NovaDespesaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DespesaFormData) => Promise<void>
}

export interface DespesaFormData {
  fornecedor: string
  descricao: string
  categoria: string
  tipoDespesa: 'FIXA' | 'VARIAVEL' | 'OPERACIONAL' | 'IMPOSTO'
  valor: number
  dataEmissao: string
  dataVencimento: string
  recorrente: boolean
  periodicidade?: 'MENSAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL'
  formaPagamento?: string
  observacoes?: string
}

const categoriasPorTipo = {
  FIXA: [
    'Aluguel',
    'Energia Elétrica',
    'Água',
    'Internet',
    'Telefone',
    'Contador',
    'Advogado',
    'Seguros',
    'Software/Sistemas'
  ],
  VARIAVEL: [
    'Material de Escritório',
    'Combustível',
    'Manutenção',
    'Marketing',
    'Consultoria',
    'Treinamentos',
    'Outros'
  ],
  OPERACIONAL: [
    'Emolumentos Cartório',
    'Taxas DETRAN',
    'Despachantes Terceirizados',
    'Vistorias',
    'Laudos',
    'Autenticações',
    'Outros Serviços'
  ],
  IMPOSTO: [
    'IRPJ',
    'CSLL',
    'PIS',
    'COFINS',
    'ISS',
    'INSS',
    'FGTS',
    'Outros Tributos'
  ]
}

export default function NovaDespesaModal({ isOpen, onClose, onSubmit }: NovaDespesaModalProps) {
  const [formData, setFormData] = useState<DespesaFormData>({
    fornecedor: '',
    descricao: '',
    categoria: '',
    tipoDespesa: 'FIXA',
    valor: 0,
    dataEmissao: new Date().toISOString().split('T')[0],
    dataVencimento: '',
    recorrente: false,
    periodicidade: undefined,
    formaPagamento: '',
    observacoes: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fornecedor) {
      newErrors.fornecedor = 'Fornecedor é obrigatório'
    }

    if (!formData.descricao) {
      newErrors.descricao = 'Descrição é obrigatória'
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória'
    }

    if (!formData.valor || formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero'
    }

    if (!formData.dataVencimento) {
      newErrors.dataVencimento = 'Data de vencimento é obrigatória'
    }

    if (formData.recorrente && !formData.periodicidade) {
      newErrors.periodicidade = 'Selecione a periodicidade'
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
      console.error('Error submitting expense:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      fornecedor: '',
      descricao: '',
      categoria: '',
      tipoDespesa: 'FIXA',
      valor: 0,
      dataEmissao: new Date().toISOString().split('T')[0],
      dataVencimento: '',
      recorrente: false,
      periodicidade: undefined,
      formaPagamento: '',
      observacoes: ''
    })
    setErrors({})
    onClose()
  }

  const categoriasDisponiveis = categoriasPorTipo[formData.tipoDespesa]

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
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CurrencyDollarIcon className="h-6 w-6 text-white" />
                      <Dialog.Title className="text-lg font-semibold text-white">
                        Nova Despesa
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
                    {/* Fornecedor */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="text-sm font-semibold text-blue-900">Fornecedor</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Fornecedor *
                          </label>
                          <input
                            type="text"
                            value={formData.fornecedor}
                            onChange={(e) => setFormData(prev => ({ ...prev, fornecedor: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.fornecedor ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ex: Imobiliária Central, DETRAN/SP, etc."
                          />
                          {errors.fornecedor && (
                            <p className="text-red-500 text-xs mt-1">{errors.fornecedor}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição *
                          </label>
                          <input
                            type="text"
                            value={formData.descricao}
                            onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.descricao ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Ex: Aluguel do escritório - Setembro 2025"
                          />
                          {errors.descricao && (
                            <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Classificação */}
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <TagIcon className="h-5 w-5 text-purple-600" />
                        <h3 className="text-sm font-semibold text-purple-900">Classificação</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Despesa *
                          </label>
                          <select
                            value={formData.tipoDespesa}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              tipoDespesa: e.target.value as any,
                              categoria: '' // Reset category when type changes
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="FIXA">Despesa Fixa</option>
                            <option value="VARIAVEL">Despesa Variável</option>
                            <option value="OPERACIONAL">Despesa Operacional</option>
                            <option value="IMPOSTO">Impostos e Tributos</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoria *
                          </label>
                          <select
                            value={formData.categoria}
                            onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.categoria ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Selecione uma categoria</option>
                            {categoriasDisponiveis.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          {errors.categoria && (
                            <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Valores e Datas */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                        <h3 className="text-sm font-semibold text-green-900">Valores e Datas</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      </div>
                    </div>

                    {/* Recorrência */}
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.recorrente}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            recorrente: e.target.checked,
                            periodicidade: e.target.checked ? prev.periodicidade : undefined
                          }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Esta é uma despesa recorrente
                        </label>
                      </div>

                      {formData.recorrente && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Periodicidade *
                          </label>
                          <select
                            value={formData.periodicidade}
                            onChange={(e) => setFormData(prev => ({ ...prev, periodicidade: e.target.value as any }))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              errors.periodicidade ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Selecione a periodicidade</option>
                            <option value="MENSAL">Mensal</option>
                            <option value="BIMESTRAL">Bimestral</option>
                            <option value="TRIMESTRAL">Trimestral</option>
                            <option value="SEMESTRAL">Semestral</option>
                            <option value="ANUAL">Anual</option>
                          </select>
                          {errors.periodicidade && (
                            <p className="text-red-500 text-xs mt-1">{errors.periodicidade}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Forma de Pagamento e Observações */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Forma de Pagamento
                        </label>
                        <select
                          value={formData.formaPagamento}
                          onChange={(e) => setFormData(prev => ({ ...prev, formaPagamento: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Selecione</option>
                          <option value="dinheiro">Dinheiro</option>
                          <option value="pix">PIX</option>
                          <option value="cartao_credito">Cartão de Crédito</option>
                          <option value="cartao_debito">Cartão de Débito</option>
                          <option value="transferencia">Transferência</option>
                          <option value="boleto">Boleto</option>
                          <option value="debito_automatico">Débito Automático</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Observações
                        </label>
                        <textarea
                          value={formData.observacoes}
                          onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          placeholder="Informações adicionais sobre a despesa"
                        />
                      </div>
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
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Salvando...
                        </>
                      ) : (
                        'Criar Despesa'
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
