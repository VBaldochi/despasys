'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  XMarkIcon,
  DocumentCheckIcon,
  UserIcon,
  TruckIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export interface NovoLaudoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LaudoFormData) => void
}

export interface LaudoFormData {
  customerName: string
  customerPhone: string
  customerEmail?: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  vehiclePlate: string
  chassisNumber?: string
  reportType: 'VISTORIA' | 'PERICIA' | 'AVALIACAO' | 'SINISTRO' | 'TRANSFERENCIA'
  purpose: 'COMPRA' | 'VENDA' | 'SEGURO' | 'FINANCIAMENTO' | 'JUDICIAL' | 'ADMINISTRATIVO'
  priority: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
  value: number
  location: string
  scheduledDate?: string
  notes?: string
}

const reportTypes = [
  { value: 'VISTORIA', label: 'Vistoria', description: 'Inspeção veicular padrão' },
  { value: 'PERICIA', label: 'Perícia', description: 'Análise técnica detalhada' },
  { value: 'AVALIACAO', label: 'Avaliação', description: 'Avaliação de valor de mercado' },
  { value: 'SINISTRO', label: 'Sinistro', description: 'Análise de acidentes/danos' },
  { value: 'TRANSFERENCIA', label: 'Transferência', description: 'Vistoria para transferência' }
]

const purposes = [
  { value: 'COMPRA', label: 'Compra' },
  { value: 'VENDA', label: 'Venda' },
  { value: 'SEGURO', label: 'Seguro' },
  { value: 'FINANCIAMENTO', label: 'Financiamento' },
  { value: 'JUDICIAL', label: 'Judicial' },
  { value: 'ADMINISTRATIVO', label: 'Administrativo' }
]

const priorities = [
  { value: 'BAIXA', label: 'Baixa', color: 'text-gray-700' },
  { value: 'MEDIA', label: 'Média', color: 'text-blue-700' },
  { value: 'ALTA', label: 'Alta', color: 'text-yellow-700' },
  { value: 'URGENTE', label: 'Urgente', color: 'text-red-700' }
]

export default function NovoLaudoModal({ isOpen, onClose, onSubmit }: NovoLaudoModalProps) {
  const [formData, setFormData] = useState<LaudoFormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    chassisNumber: '',
    reportType: 'VISTORIA',
    purpose: 'COMPRA',
    priority: 'MEDIA',
    value: 0,
    location: '',
    scheduledDate: '',
    notes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: '',
        vehiclePlate: '',
        chassisNumber: '',
        reportType: 'VISTORIA',
        purpose: 'COMPRA',
        priority: 'MEDIA',
        value: 0,
        location: '',
        scheduledDate: '',
        notes: ''
      })
      setErrors({})
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}

    // Validações
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Nome do cliente é obrigatório'
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Telefone é obrigatório'
    }

    if (!formData.vehicleBrand.trim()) {
      newErrors.vehicleBrand = 'Marca do veículo é obrigatória'
    }

    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Modelo do veículo é obrigatório'
    }

    if (!formData.vehicleYear.trim()) {
      newErrors.vehicleYear = 'Ano do veículo é obrigatório'
    }

    if (!formData.vehiclePlate.trim()) {
      newErrors.vehiclePlate = 'Placa do veículo é obrigatória'
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Valor deve ser maior que zero'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Local é obrigatório'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
    onClose()
  }

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Formata para (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value)
    setFormData(prev => ({ ...prev, customerPhone: formatted }))
  }

  const formatPlate = (value: string) => {
    // Remove caracteres não permitidos e converte para maiúsculas
    let formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    
    // Formato: ABC-1234 ou ABC1D23
    if (formatted.length > 3) {
      formatted = formatted.slice(0, 3) + '-' + formatted.slice(3, 7)
    }
    
    return formatted
  }

  const handlePlateChange = (value: string) => {
    const formatted = formatPlate(value)
    setFormData(prev => ({ ...prev, vehiclePlate: formatted }))
  }

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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <Dialog.Title as="h3" className="text-lg font-semibold text-blue-900">
                          Novo Laudo Técnico
                        </Dialog.Title>
                        <p className="text-sm text-blue-600">
                          Preencha os dados para criar uma nova solicitação de laudo
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-lg p-1 hover:bg-blue-100 transition-colors"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6 text-blue-600" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-6">
                    {/* Dados do Cliente */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <h4 className="text-sm font-medium text-gray-700">Dados do Cliente</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Cliente *
                          </label>
                          <input
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                            className={`w-full rounded-lg border ${
                              errors.customerName ? 'border-red-300' : 'border-gray-300'
                            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Ex: João Silva"
                          />
                          {errors.customerName && (
                            <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefone *
                          </label>
                          <input
                            type="tel"
                            value={formData.customerPhone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className={`w-full rounded-lg border ${
                              errors.customerPhone ? 'border-red-300' : 'border-gray-300'
                            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="(16) 99999-9999"
                            maxLength={15}
                          />
                          {errors.customerPhone && (
                            <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            E-mail
                          </label>
                          <input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="email@exemplo.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dados do Veículo */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <TruckIcon className="h-5 w-5 text-gray-600" />
                        <h4 className="text-sm font-medium text-gray-700">Dados do Veículo</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Marca *
                          </label>
                          <input
                            type="text"
                            value={formData.vehicleBrand}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehicleBrand: e.target.value }))}
                            className={`w-full rounded-lg border ${
                              errors.vehicleBrand ? 'border-red-300' : 'border-gray-300'
                            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Ex: Toyota"
                          />
                          {errors.vehicleBrand && (
                            <p className="mt-1 text-sm text-red-600">{errors.vehicleBrand}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Modelo *
                          </label>
                          <input
                            type="text"
                            value={formData.vehicleModel}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                            className={`w-full rounded-lg border ${
                              errors.vehicleModel ? 'border-red-300' : 'border-gray-300'
                            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Ex: Corolla"
                          />
                          {errors.vehicleModel && (
                            <p className="mt-1 text-sm text-red-600">{errors.vehicleModel}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ano *
                          </label>
                          <input
                            type="text"
                            value={formData.vehicleYear}
                            onChange={(e) => setFormData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                            className={`w-full rounded-lg border ${
                              errors.vehicleYear ? 'border-red-300' : 'border-gray-300'
                            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="2020"
                            maxLength={4}
                          />
                          {errors.vehicleYear && (
                            <p className="mt-1 text-sm text-red-600">{errors.vehicleYear}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Placa *
                          </label>
                          <input
                            type="text"
                            value={formData.vehiclePlate}
                            onChange={(e) => handlePlateChange(e.target.value)}
                            className={`w-full rounded-lg border ${
                              errors.vehiclePlate ? 'border-red-300' : 'border-gray-300'
                            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="ABC-1234"
                            maxLength={8}
                          />
                          {errors.vehiclePlate && (
                            <p className="mt-1 text-sm text-red-600">{errors.vehiclePlate}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número do Chassi
                          </label>
                          <input
                            type="text"
                            value={formData.chassisNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, chassisNumber: e.target.value.toUpperCase() }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="9BR53ZEC4L4123456"
                            maxLength={17}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dados do Laudo */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <DocumentCheckIcon className="h-5 w-5 text-gray-600" />
                        <h4 className="text-sm font-medium text-gray-700">Dados do Laudo</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Laudo *
                          </label>
                          <select
                            value={formData.reportType}
                            onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value as any }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {reportTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label} - {type.description}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Finalidade *
                          </label>
                          <select
                            value={formData.purpose}
                            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value as any }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {purposes.map((purpose) => (
                              <option key={purpose.value} value={purpose.value}>
                                {purpose.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <div className="flex items-center gap-2">
                              <ExclamationTriangleIcon className="h-4 w-4" />
                              Prioridade *
                            </div>
                          </label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {priorities.map((priority) => (
                              <option key={priority.value} value={priority.value}>
                                {priority.label}
                              </option>
                            ))}
                          </select>
                        </div>

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
                              value={formData.value || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                              className={`w-full rounded-lg border ${
                                errors.value ? 'border-red-300' : 'border-gray-300'
                              } pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              placeholder="0,00"
                            />
                          </div>
                          {errors.value && (
                            <p className="mt-1 text-sm text-red-600">{errors.value}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <div className="flex items-center gap-2">
                              <MapPinIcon className="h-4 w-4" />
                              Local *
                            </div>
                          </label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className={`w-full rounded-lg border ${
                              errors.location ? 'border-red-300' : 'border-gray-300'
                            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Ex: Franca-SP"
                          />
                          {errors.location && (
                            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4" />
                              Data Agendada
                            </div>
                          </label>
                          <input
                            type="date"
                            value={formData.scheduledDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
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
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Informações adicionais sobre a solicitação..."
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Criar Laudo
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
