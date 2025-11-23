'use client'

import { useState, useEffect } from 'react'
import { X, User, Car, DollarSign, MapPin, FileText } from 'lucide-react'

interface NovaAvaliacaoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (avaliacao: any) => void
}

interface Cliente {
  id: string
  name: string
  cpfCnpj: string
  phone: string
}

interface Veiculo {
  id: string
  placa: string
  marca: string
  modelo: string
  ano: number
  customerId: string
}

export default function NovaAvaliacaoModal({ isOpen, onClose, onSubmit }: NovaAvaliacaoModalProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [loadingVeiculos, setLoadingVeiculos] = useState(false)

  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    evaluationType: 'COMPRA',
    value: '',
    requestedDate: '',
    location: '',
    notes: '',
    // Dados adicionais do cliente
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    // Dados adicionais do veículo
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: ''
  })

  const tiposAvaliacao = [
    { value: 'COMPRA', label: 'Compra de Veículo' },
    { value: 'VENDA', label: 'Venda de Veículo' },
    { value: 'SEGURO', label: 'Avaliação para Seguro' },
    { value: 'FINANCIAMENTO', label: 'Avaliação para Financiamento' }
  ]

  useEffect(() => {
    if (isOpen) {
      fetchClientes()
      // Preencher data padrão (hoje)
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ ...prev, requestedDate: today }))
    }
  }, [isOpen])

  useEffect(() => {
    if (formData.customerId) {
      fetchVeiculos(formData.customerId)
      // Preencher dados do cliente selecionado
      const cliente = clientes.find(c => c.id === formData.customerId)
      if (cliente) {
        setFormData(prev => ({
          ...prev,
          customerName: cliente.name,
          customerPhone: cliente.phone,
          customerEmail: ''
        }))
      }
    } else {
      setVeiculos([])
      setFormData(prev => ({
        ...prev,
        vehicleId: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: '',
        vehiclePlate: ''
      }))
    }
  }, [formData.customerId, clientes])

  useEffect(() => {
    if (formData.vehicleId) {
      // Preencher dados do veículo selecionado
      const veiculo = veiculos.find(v => v.id === formData.vehicleId)
      if (veiculo) {
        setFormData(prev => ({
          ...prev,
          vehicleBrand: veiculo.marca,
          vehicleModel: veiculo.modelo,
          vehicleYear: veiculo.ano.toString(),
          vehiclePlate: veiculo.placa
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: '',
        vehiclePlate: ''
      }))
    }
  }, [formData.vehicleId, veiculos])

  const fetchClientes = async () => {
    try {
      setLoadingClientes(true)
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setClientes(data)
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    } finally {
      setLoadingClientes(false)
    }
  }

  const fetchVeiculos = async (customerId: string) => {
    try {
      setLoadingVeiculos(true)
      const response = await fetch(`/api/veiculos?customerId=${customerId}`)
      if (response.ok) {
        const data = await response.json()
        setVeiculos(data)
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error)
    } finally {
      setLoadingVeiculos(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.customerId || !formData.evaluationType || !formData.value || !formData.requestedDate) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    if (!formData.vehicleId && (!formData.vehicleBrand || !formData.vehicleModel || !formData.vehicleYear || !formData.vehiclePlate)) {
      alert('Selecione um veículo ou preencha os dados do veículo manualmente')
      return
    }

    const avaliacao = {
      customerId: formData.customerId,
      vehicleId: formData.vehicleId || null,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || null,
      vehicleBrand: formData.vehicleBrand,
      vehicleModel: formData.vehicleModel,
      vehicleYear: formData.vehicleYear,
      vehiclePlate: formData.vehiclePlate,
      evaluationType: formData.evaluationType,
      status: 'SOLICITADA',
      requestedDate: formData.requestedDate,
      value: parseFloat(formData.value),
      location: formData.location || null,
      notes: formData.notes || null
    }

    onSubmit(avaliacao)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      customerId: '',
      vehicleId: '',
      evaluationType: 'COMPRA',
      value: '',
      requestedDate: '',
      location: '',
      notes: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '',
      vehiclePlate: ''
    })
    setVeiculos([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Nova Avaliação Veicular</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loadingClientes}
              >
                <option value="">
                  {loadingClientes ? 'Carregando...' : 'Selecione o cliente'}
                </option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.name} - {cliente.cpfCnpj}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Veículo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Veículo (Opcional - selecione se já cadastrado)
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!formData.customerId || loadingVeiculos}
              >
                <option value="">
                  {!formData.customerId
                    ? 'Selecione um cliente primeiro'
                    : loadingVeiculos
                    ? 'Carregando veículos...'
                    : veiculos.length === 0
                    ? 'Nenhum veículo cadastrado - preencha manualmente'
                    : 'Selecione um veículo ou preencha manualmente'}
                </option>
                {veiculos.map((veiculo) => (
                  <option key={veiculo.id} value={veiculo.id}>
                    {veiculo.marca} {veiculo.modelo} {veiculo.ano} - {veiculo.placa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dados do Veículo Manual */}
          {!formData.vehicleId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="col-span-full text-sm font-medium text-gray-700">
                Dados do Veículo <span className="text-red-500">*</span>
              </h3>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Marca</label>
                <input
                  type="text"
                  value={formData.vehicleBrand}
                  onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                  placeholder="Ex: Toyota"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!formData.vehicleId}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Modelo</label>
                <input
                  type="text"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  placeholder="Ex: Corolla"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!formData.vehicleId}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ano</label>
                <input
                  type="text"
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                  placeholder="Ex: 2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!formData.vehicleId}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Placa</label>
                <input
                  type="text"
                  value={formData.vehiclePlate}
                  onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value.toUpperCase() })}
                  placeholder="ABC-1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!formData.vehicleId}
                />
              </div>
            </div>
          )}

          {/* Tipo de Avaliação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Avaliação <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.evaluationType}
              onChange={(e) => setFormData({ ...formData, evaluationType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {tiposAvaliacao.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor da Avaliação (R$) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Solicitada <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.requestedDate}
                onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Localização */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Franca-SP"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Detalhes adicionais sobre a avaliação..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
