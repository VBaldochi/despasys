'use client'

import { useState, useEffect } from 'react'
import { X, User, Calendar, Clock, FileText } from 'lucide-react'

interface NovoAgendamentoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (agendamento: any) => void
}

interface Cliente {
  id: string
  name: string
  cpfCnpj: string
}

export default function NovoAgendamentoModal({ isOpen, onClose, onSubmit }: NovoAgendamentoModalProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loadingClientes, setLoadingClientes] = useState(false)

  const [formData, setFormData] = useState({
    customerId: '',
    title: '',
    description: '',
    serviceType: '',
    appointmentType: 'PRESENCIAL',
    startTime: '',
    endTime: '',
    notes: ''
  })

  const tiposServico = [
    'Licenciamento',
    'Transferência',
    'Primeiro Emplacamento',
    'Segunda Via',
    'Desbloqueio',
    'Vistoria',
    'Consulta',
    'Regularização de Multas',
    'Outro'
  ]

  const tiposAgendamento = [
    { value: 'PRESENCIAL', label: 'Presencial' },
    { value: 'ONLINE', label: 'Online' },
    { value: 'TELEFONE', label: 'Telefone' },
    { value: 'VISITA', label: 'Visita ao Cliente' }
  ]

  useEffect(() => {
    if (isOpen) {
      fetchClientes()
      // Preencher data/hora padrão (amanhã 9h-10h)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      
      const tomorrowEnd = new Date(tomorrow)
      tomorrowEnd.setHours(10, 0, 0, 0)
      
      setFormData(prev => ({
        ...prev,
        startTime: tomorrow.toISOString().slice(0, 16),
        endTime: tomorrowEnd.toISOString().slice(0, 16)
      }))
    }
  }, [isOpen])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.customerId || !formData.title || !formData.serviceType || !formData.startTime || !formData.endTime) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    // Validar que endTime > startTime
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      alert('O horário de término deve ser após o horário de início')
      return
    }

    const agendamento = {
      customerId: formData.customerId,
      title: formData.title,
      description: formData.description || null,
      serviceType: formData.serviceType,
      appointmentType: formData.appointmentType,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      notes: formData.notes || null,
      status: 'SCHEDULED'
    }

    onSubmit(agendamento)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      customerId: '',
      title: '',
      description: '',
      serviceType: '',
      appointmentType: 'PRESENCIAL',
      startTime: '',
      endTime: '',
      notes: ''
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Novo Agendamento</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do Agendamento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Reunião para transferência de veículo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Tipo de Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Serviço <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione o tipo de serviço</option>
              {tiposServico.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Agendamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Atendimento <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.appointmentType}
              onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {tiposAgendamento.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data/Hora Início <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data/Hora Término <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalhes do agendamento..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações Internas
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas internas (não visível para o cliente)..."
              rows={2}
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
              Criar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
