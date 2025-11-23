'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  XMarkIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CreditCardIcon,
  DocumentTextIcon,
  TagIcon
} from '@heroicons/react/24/outline'

export interface NovoLancamentoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LancamentoFormData) => void
  tipoInicial?: 'ENTRADA' | 'SAIDA'
}

export interface LancamentoFormData {
  tipo: 'ENTRADA' | 'SAIDA'
  descricao: string
  categoria: string
  valor: number
  data: string
  metodoPagamento: string
  origem?: string // For ENTRADA
  destino?: string // For SAIDA
  observacoes: string
}

const categoriasEntrada = [
  'Serviços Prestados',
  'Transferência',
  'Licenciamento',
  'Emplacamento',
  'Renovação CNH',
  'Desbloqueio',
  'Vistoria',
  'Consultoria',
  'Outros Serviços'
]

const categoriasSaida = [
  'Despesas Fixas',
  'Despesas Variáveis',
  'Despesas Operacionais',
  'Impostos',
  'Folha de Pagamento',
  'Fornecedores',
  'Marketing',
  'Investimentos',
  'Outros'
]

const metodosPagamento = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'pix', label: 'PIX' },
  { value: 'cartao_debito', label: 'Cartão de Débito' },
  { value: 'cartao_credito', label: 'Cartão de Crédito' },
  { value: 'transferencia', label: 'Transferência Bancária' },
  { value: 'boleto', label: 'Boleto' },
  { value: 'cheque', label: 'Cheque' }
]

export default function NovoLancamentoModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  tipoInicial = 'ENTRADA'
}: NovoLancamentoModalProps) {
  const [formData, setFormData] = useState<LancamentoFormData>({
    tipo: tipoInicial,
    descricao: '',
    categoria: '',
    valor: 0,
    data: new Date().toISOString().split('T')[0],
    metodoPagamento: '',
    origem: '',
    destino: '',
    observacoes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update tipo when tipoInicial changes
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        tipo: tipoInicial,
        categoria: '' // Reset category when tipo changes
      }))
    }
  }, [tipoInicial, isOpen])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        tipo: tipoInicial,
        descricao: '',
        categoria: '',
        valor: 0,
        data: new Date().toISOString().split('T')[0],
        metodoPagamento: '',
        origem: '',
        destino: '',
        observacoes: ''
      })
      setErrors({})
    }
  }, [isOpen, tipoInicial])

  const categorias = formData.tipo === 'ENTRADA' ? categoriasEntrada : categoriasSaida

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória'
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória'
    }

    if (!formData.valor || formData.valor <= 0) {
      newErrors.valor = 'Valor deve ser maior que zero'
    }

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória'
    }

    if (!formData.metodoPagamento) {
      newErrors.metodoPagamento = 'Método de pagamento é obrigatório'
    }

    if (formData.tipo === 'ENTRADA' && !formData.origem?.trim()) {
      newErrors.origem = 'Origem é obrigatória para entradas'
    }

    if (formData.tipo === 'SAIDA' && !formData.destino?.trim()) {
      newErrors.destino = 'Destino é obrigatório para saídas'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
    onClose()
  }

  const tipoColor = formData.tipo === 'ENTRADA' ? 'green' : 'red'
  const tipoIcon = formData.tipo === 'ENTRADA' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className={`bg-${tipoColor}-50 px-6 py-4 border-b border-${tipoColor}-100`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {formData.tipo === 'ENTRADA' ? (
                        <div className="p-2 bg-green-100 rounded-lg">
                          <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-2 bg-red-100 rounded-lg">
                          <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
                        </div>
                      )}
                      <div>
                        <Dialog.Title
                          as="h3"
                          className={`text-lg font-semibold text-${tipoColor}-900`}
                        >
                          Novo Lançamento - {formData.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                        </Dialog.Title>
                        <p className={`text-sm text-${tipoColor}-600`}>
                          Registre uma {formData.tipo === 'ENTRADA' ? 'entrada' : 'saída'} de caixa
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`rounded-lg p-1 hover:bg-${tipoColor}-100 transition-colors`}
                      onClick={onClose}
                    >
                      <XMarkIcon className={`h-6 w-6 text-${tipoColor}-600`} />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4">
                  <div className="space-y-6">
                    {/* Tipo Toggle */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <TagIcon className="h-5 w-5 text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">
                          Tipo de Lançamento
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, tipo: 'ENTRADA', categoria: '' }))}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                            formData.tipo === 'ENTRADA'
                              ? 'bg-green-600 text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <ArrowTrendingUpIcon className="h-5 w-5" />
                            Entrada
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, tipo: 'SAIDA', categoria: '' }))}
                          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                            formData.tipo === 'SAIDA'
                              ? 'bg-red-600 text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <ArrowTrendingDownIcon className="h-5 w-5" />
                            Saída
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Descrição */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição *
                      </label>
                      <input
                        type="text"
                        value={formData.descricao}
                        onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                        className={`w-full rounded-lg border ${
                          errors.descricao ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${tipoColor}-500`}
                        placeholder="Ex: Pagamento de cliente João Silva"
                      />
                      {errors.descricao && (
                        <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>
                      )}
                    </div>

                    {/* Categoria */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria *
                      </label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                        className={`w-full rounded-lg border ${
                          errors.categoria ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${tipoColor}-500`}
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.categoria && (
                        <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
                      )}
                    </div>

                    {/* Origem/Destino */}
                    {formData.tipo === 'ENTRADA' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Origem (Pagador) *
                        </label>
                        <input
                          type="text"
                          value={formData.origem || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, origem: e.target.value }))}
                          className={`w-full rounded-lg border ${
                            errors.origem ? 'border-red-300' : 'border-gray-300'
                          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                          placeholder="Ex: Cliente João Silva"
                        />
                        {errors.origem && (
                          <p className="mt-1 text-sm text-red-600">{errors.origem}</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Destino (Beneficiário) *
                        </label>
                        <input
                          type="text"
                          value={formData.destino || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, destino: e.target.value }))}
                          className={`w-full rounded-lg border ${
                            errors.destino ? 'border-red-300' : 'border-gray-300'
                          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500`}
                          placeholder="Ex: Fornecedor ABC Ltda"
                        />
                        {errors.destino && (
                          <p className="mt-1 text-sm text-red-600">{errors.destino}</p>
                        )}
                      </div>
                    )}

                    {/* Valor e Data */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <CurrencyDollarIcon className="h-4 w-4" />
                            Valor *
                          </div>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">R$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.valor || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, valor: parseFloat(e.target.value) }))}
                            className={`w-full rounded-lg border ${
                              errors.valor ? 'border-red-300' : 'border-gray-300'
                            } pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-${tipoColor}-500`}
                            placeholder="0,00"
                          />
                        </div>
                        {errors.valor && (
                          <p className="mt-1 text-sm text-red-600">{errors.valor}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            Data *
                          </div>
                        </label>
                        <input
                          type="date"
                          value={formData.data}
                          onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                          className={`w-full rounded-lg border ${
                            errors.data ? 'border-red-300' : 'border-gray-300'
                          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${tipoColor}-500`}
                        />
                        {errors.data && (
                          <p className="mt-1 text-sm text-red-600">{errors.data}</p>
                        )}
                      </div>
                    </div>

                    {/* Método de Pagamento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <div className="flex items-center gap-2">
                          <CreditCardIcon className="h-4 w-4" />
                          Método de Pagamento *
                        </div>
                      </label>
                      <select
                        value={formData.metodoPagamento}
                        onChange={(e) => setFormData(prev => ({ ...prev, metodoPagamento: e.target.value }))}
                        className={`w-full rounded-lg border ${
                          errors.metodoPagamento ? 'border-red-300' : 'border-gray-300'
                        } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-${tipoColor}-500`}
                      >
                        <option value="">Selecione o método</option>
                        {metodosPagamento.map((metodo) => (
                          <option key={metodo.value} value={metodo.value}>
                            {metodo.label}
                          </option>
                        ))}
                      </select>
                      {errors.metodoPagamento && (
                        <p className="mt-1 text-sm text-red-600">{errors.metodoPagamento}</p>
                      )}
                    </div>

                    {/* Observações */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <div className="flex items-center gap-2">
                          <DocumentTextIcon className="h-4 w-4" />
                          Observações
                        </div>
                      </label>
                      <textarea
                        value={formData.observacoes}
                        onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Informações adicionais sobre este lançamento..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 text-sm font-medium text-white bg-${tipoColor}-600 rounded-lg hover:bg-${tipoColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${tipoColor}-500`}
                    >
                      Registrar {formData.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
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
