'use client'

import { useState, useEffect } from 'react'
import { X, User, Car, DollarSign, Calendar, FileText, AlertTriangle } from 'lucide-react'

interface NovoLicenciamentoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (licenciamento: any) => void
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
  renavam: string
  chassi?: string
}

export default function NovoLicenciamentoModal({ isOpen, onClose, onSubmit }: NovoLicenciamentoModalProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [loadingVeiculos, setLoadingVeiculos] = useState(false)

  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehiclePlate: '',
    renavam: '',
    chassisNumber: '',
    expirationDate: '',
    requestedDate: '',
    detranFee: '',
    serviceFee: '',
    priority: 'NORMAL',
    notes: ''
  })

  useEffect(() => {
    if (isOpen) {
      fetchClientes()
      // Preencher data padrão (hoje)
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ 
        ...prev, 
        requestedDate: today,
        // Taxas padrão
        detranFee: '148.50',
        serviceFee: '50.00'
      }))
    }
  }, [isOpen])

  useEffect(() => {
    if (formData.customerId) {
      fetchVeiculos(formData.customerId)
      const cliente = clientes.find(c => c.id === formData.customerId)
      if (cliente) {
        setFormData(prev => ({
          ...prev,
          customerName: cliente.name,
          customerPhone: cliente.phone
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
        vehiclePlate: '',
        renavam: '',
        chassisNumber: ''
      }))
    }
  }, [formData.customerId, clientes])

  useEffect(() => {
    if (formData.vehicleId) {
      const veiculo = veiculos.find(v => v.id === formData.vehicleId)
      if (veiculo) {
        setFormData(prev => ({
          ...prev,
          vehicleBrand: veiculo.marca,
          vehicleModel: veiculo.modelo,
          vehicleYear: veiculo.ano.toString(),
          vehiclePlate: veiculo.placa,
          renavam: veiculo.renavam || '',
          chassisNumber: veiculo.chassi || ''
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: '',
        vehiclePlate: '',
        renavam: '',
        chassisNumber: ''
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

  const calculateTotal = () => {
    const detran = parseFloat(formData.detranFee) || 0
    const service = parseFloat(formData.serviceFee) || 0
    return detran + service
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.customerId) {
      alert('Selecione um cliente')
      return
    }

    if (!formData.vehicleId && (!formData.vehiclePlate || !formData.renavam)) {
      alert('Selecione um veículo ou preencha placa e RENAVAM')
      return
    }

    if (!formData.expirationDate || !formData.requestedDate) {
      alert('Preencha as datas de vencimento e solicitação')
      return
    }

    const total = calculateTotal()

    const licenciamento = {
      customerId: formData.customerId,
      vehicleId: formData.vehicleId || null,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || null,
      vehicleBrand: formData.vehicleBrand,
      vehicleModel: formData.vehicleModel,
      vehicleYear: formData.vehicleYear,
      vehiclePlate: formData.vehiclePlate,
      renavam: formData.renavam,
      chassisNumber: formData.chassisNumber || null,
      expirationDate: formData.expirationDate,
      requestedDate: formData.requestedDate,
      status: 'SOLICITADO',
      priority: formData.priority,
      value: total,
      fees: {
        detran: parseFloat(formData.detranFee),
        service: parseFloat(formData.serviceFee),
        total: total
      },
      documents: ['CNH', 'CRLV', 'Comprovante de Residência'],
      notes: formData.notes || null
    }

    onSubmit(licenciamento)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      customerId: '',
      vehicleId: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '',
      vehiclePlate: '',
      renavam: '',
      chassisNumber: '',
      expirationDate: '',
      requestedDate: '',
      detranFee: '',
      serviceFee: '',
      priority: 'NORMAL',
      notes: ''
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
            <h2 className="text-xl font-semibold text-gray-900">Novo Licenciamento</h2>
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
              Veículo <span className="text-red-500">*</span>
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
                    : 'Selecione um veículo'}
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
          {!formData.vehicleId && formData.customerId && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <h3 className="text-sm font-medium text-gray-700">
                Dados do Veículo <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm text-gray-600 mb-1">RENAVAM</label>
                  <input
                    type="text"
                    value={formData.renavam}
                    onChange={(e) => setFormData({ ...formData, renavam: e.target.value })}
                    placeholder="00123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!formData.vehicleId}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Marca</label>
                  <input
                    type="text"
                    value={formData.vehicleBrand}
                    onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                    placeholder="Ex: Honda"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Modelo</label>
                  <input
                    type="text"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    placeholder="Ex: Civic"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Ano</label>
                  <input
                    type="text"
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                    placeholder="2020"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Chassi (Opcional)</label>
                  <input
                    type="text"
                    value={formData.chassisNumber}
                    onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value.toUpperCase() })}
                    placeholder="9BWZZZ377VT004251"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Vencimento <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data da Solicitação <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Taxas */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Valores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Taxa DETRAN (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.detranFee}
                    onChange={(e) => setFormData({ ...formData, detranFee: e.target.value })}
                    placeholder="148.50"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Taxa de Serviço (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.serviceFee}
                    onChange={(e) => setFormData({ ...formData, serviceFee: e.target.value })}
                    placeholder="50.00"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-lg font-bold text-green-700">
                Total: R$ {calculateTotal().toFixed(2)}
              </p>
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="NORMAL">Normal</option>
              <option value="URGENTE">⚠️ Urgente</option>
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informações adicionais..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Documentos Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Documentos Necessários:</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>CNH do proprietário</li>
              <li>CRLV (Certificado de Registro e Licenciamento do Veículo)</li>
              <li>Comprovante de Residência</li>
            </ul>
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
              Criar Licenciamento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
