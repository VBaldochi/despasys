'use client'

import { useState, useEffect } from 'react'
import { X, User, Car, FileText, DollarSign, MapPin, AlertTriangle } from 'lucide-react'

interface NovoRegistroModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (registro: any) => void
}

interface Cliente {
  id: string
  name: string
  cpfCnpj: string
  phone: string
  endereco?: string
}

export default function NovoRegistroModal({ isOpen, onClose, onSubmit }: NovoRegistroModalProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loadingClientes, setLoadingClientes] = useState(false)

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerCpf: '',
    customerAddress: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    chassisNumber: '',
    renavam: '',
    vehicleType: 'CARRO',
    isZeroKm: true,
    dealershipName: '',
    invoiceNumber: '',
    category: 'B',
    priority: 'NORMAL',
    requestedDate: '',
    notes: '',
    // Taxas
    detranFee: '',
    serviceFee: '',
    emplacamentoFee: ''
  })

  const tiposVeiculo = [
    { value: 'CARRO', label: 'Carro 🚗' },
    { value: 'MOTO', label: 'Moto 🏍️' },
    { value: 'CAMINHAO', label: 'Caminhão 🚛' },
    { value: 'UTILITARIO', label: 'Utilitário 🚐' },
    { value: 'ONIBUS', label: 'Ônibus 🚌' }
  ]

  const categorias = [
    { value: 'A', label: 'A - Motocicletas' },
    { value: 'B', label: 'B - Automóveis' },
    { value: 'C', label: 'C - Caminhões' },
    { value: 'D', label: 'D - Ônibus' },
    { value: 'E', label: 'E - Combinações' }
  ]

  useEffect(() => {
    if (isOpen) {
      fetchClientes()
      // Preencher data padrão (hoje)
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ 
        ...prev, 
        requestedDate: today,
        // Taxas padrão
        detranFee: '250.75',
        serviceFee: '180.00',
        emplacamentoFee: '120.50'
      }))
    }
  }, [isOpen])

  useEffect(() => {
    if (formData.customerId) {
      const cliente = clientes.find(c => c.id === formData.customerId)
      if (cliente) {
        setFormData(prev => ({
          ...prev,
          customerName: cliente.name,
          customerPhone: cliente.phone,
          customerCpf: cliente.cpfCnpj,
          customerAddress: cliente.endereco || ''
        }))
      }
    }
  }, [formData.customerId, clientes])

  // Atualizar categoria baseado no tipo de veículo
  useEffect(() => {
    const categoryMap: Record<string, string> = {
      'MOTO': 'A',
      'CARRO': 'B',
      'CAMINHAO': 'C',
      'ONIBUS': 'D',
      'UTILITARIO': 'B'
    }
    const newCategory = categoryMap[formData.vehicleType] || 'B'
    setFormData(prev => ({ ...prev, category: newCategory }))
  }, [formData.vehicleType])

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

  const calculateTotal = () => {
    const detran = parseFloat(formData.detranFee) || 0
    const service = parseFloat(formData.serviceFee) || 0
    const emplacamento = parseFloat(formData.emplacamentoFee) || 0
    return detran + service + emplacamento
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.customerId) {
      alert('Selecione um cliente')
      return
    }

    if (!formData.vehicleBrand || !formData.vehicleModel || !formData.vehicleYear) {
      alert('Preencha os dados do veículo')
      return
    }

    if (!formData.chassisNumber || !formData.renavam) {
      alert('Chassi e Renavam são obrigatórios')
      return
    }

    if (formData.isZeroKm && (!formData.dealershipName || !formData.invoiceNumber)) {
      alert('Para veículos 0km, informe concessionária e nota fiscal')
      return
    }

    const total = calculateTotal()

    const registro = {
      customerId: formData.customerId,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || null,
      customerCpf: formData.customerCpf,
      customerAddress: formData.customerAddress,
      vehicleBrand: formData.vehicleBrand,
      vehicleModel: formData.vehicleModel,
      vehicleYear: formData.vehicleYear,
      chassisNumber: formData.chassisNumber,
      renavam: formData.renavam,
      vehicleType: formData.vehicleType,
      isZeroKm: formData.isZeroKm,
      dealershipName: formData.isZeroKm ? formData.dealershipName : null,
      invoiceNumber: formData.isZeroKm ? formData.invoiceNumber : null,
      category: formData.category,
      priority: formData.priority,
      status: 'SOLICITADO',
      requestedDate: formData.requestedDate,
      notes: formData.notes || null,
      fees: {
        detran: parseFloat(formData.detranFee),
        service: parseFloat(formData.serviceFee),
        emplacamento: parseFloat(formData.emplacamentoFee),
        total: total
      },
      documents: {
        required: getRequiredDocuments(),
        received: []
      }
    }

    onSubmit(registro)
    handleClose()
  }

  const getRequiredDocuments = () => {
    const docs = [
      'CNH',
      'CPF',
      'Comprovante de Residência',
      'Certificado de Registro'
    ]

    if (formData.isZeroKm) {
      docs.unshift('Nota Fiscal')
      docs.push('Seguro DPVAT')
    } else {
      docs.push('Laudo de Vistoria')
    }

    if (formData.vehicleType === 'CAMINHAO') {
      docs.push('ANTT')
    }

    if (formData.category === 'A') {
      docs[0] = 'CNH Categoria A'
    } else if (formData.category === 'C') {
      docs[0] = 'CNH Categoria C'
    } else if (formData.category === 'D') {
      docs[0] = 'CNH Categoria D'
    } else if (formData.category === 'E') {
      docs[0] = 'CNH Categoria E'
    }

    return docs
  }

  const handleClose = () => {
    setFormData({
      customerId: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerCpf: '',
      customerAddress: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '',
      chassisNumber: '',
      renavam: '',
      vehicleType: 'CARRO',
      isZeroKm: true,
      dealershipName: '',
      invoiceNumber: '',
      category: 'B',
      priority: 'NORMAL',
      requestedDate: '',
      notes: '',
      detranFee: '',
      serviceFee: '',
      emplacamentoFee: ''
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Novo 1° Registro / Emplacamento</h2>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados do Cliente</h3>
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
            
            {formData.customerId && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-1 text-sm">
                <p><strong>Nome:</strong> {formData.customerName}</p>
                <p><strong>Telefone:</strong> {formData.customerPhone}</p>
                <p><strong>CPF/CNPJ:</strong> {formData.customerCpf}</p>
                {formData.customerAddress && <p><strong>Endereço:</strong> {formData.customerAddress}</p>}
              </div>
            )}
          </div>

          {/* Dados do Veículo */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dados do Veículo</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Veículo <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {tiposVeiculo.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria CNH <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categorias.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vehicleBrand}
                  onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                  placeholder="Ex: Toyota"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  placeholder="Ex: Corolla"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                  placeholder="2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chassi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.chassisNumber}
                  onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value.toUpperCase() })}
                  placeholder="9BWZZZ377VT004251"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Renavam <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.renavam}
                  onChange={(e) => setFormData({ ...formData, renavam: e.target.value })}
                  placeholder="00123456789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isZeroKm}
                    onChange={(e) => setFormData({ ...formData, isZeroKm: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Veículo 0km ⭐</span>
                </label>
              </div>
            </div>

            {/* Dados 0km */}
            {formData.isZeroKm && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-900 mb-3">Dados de Veículo 0km</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Concessionária <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.dealershipName}
                      onChange={(e) => setFormData({ ...formData, dealershipName: e.target.value })}
                      placeholder="Nome da concessionária"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={formData.isZeroKm}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Nota Fiscal <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.invoiceNumber}
                      onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                      placeholder="NF001234"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={formData.isZeroKm}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Taxas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Taxas e Valores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taxa DETRAN (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.detranFee}
                  onChange={(e) => setFormData({ ...formData, detranFee: e.target.value })}
                  placeholder="250.75"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taxa Serviço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.serviceFee}
                  onChange={(e) => setFormData({ ...formData, serviceFee: e.target.value })}
                  placeholder="180.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taxa Emplacamento (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.emplacamentoFee}
                  onChange={(e) => setFormData({ ...formData, emplacamentoFee: e.target.value })}
                  placeholder="120.50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-lg font-bold text-green-700">
                Total: R$ {calculateTotal().toFixed(2)}
              </p>
            </div>
          </div>

          {/* Configurações Adicionais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Solicitação</label>
              <input
                type="date"
                value={formData.requestedDate}
                onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
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

          {/* Documentos Necessários */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Documentos Necessários:</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              {getRequiredDocuments().map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
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
              Criar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
