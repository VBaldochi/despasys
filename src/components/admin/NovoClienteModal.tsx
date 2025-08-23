'use client'

import { useState } from 'react'
import { X, User, Building, Phone, Mail, MapPin, Save, FileText } from 'lucide-react'

interface NovoClienteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (cliente: any) => void
}

export default function NovoClienteModal({ isOpen, onClose, onSave }: NovoClienteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    cpfCnpj: '',
    tipoCliente: 'FISICO' as 'FISICO' | 'JURIDICO',
    phone: '',
    email: '',
    endereco: '',
    cidade: '',
    cep: '',
    observacoes: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.cpfCnpj.trim()) newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório'
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
    
    // Validação de CPF/CNPJ básica
    const cpfCnpjLimpo = formData.cpfCnpj.replace(/\D/g, '')
    if (formData.tipoCliente === 'FISICO' && cpfCnpjLimpo.length !== 11) {
      newErrors.cpfCnpj = 'CPF deve ter 11 dígitos'
    }
    if (formData.tipoCliente === 'JURIDICO' && cpfCnpjLimpo.length !== 14) {
      newErrors.cpfCnpj = 'CNPJ deve ter 14 dígitos'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Criar cliente
    const novoCliente = {
      id: Date.now().toString(),
      ...formData,
      status: 'ATIVO',
      createdAt: new Date().toISOString().split('T')[0],
      processosAtivos: 0
    }

    onSave(novoCliente)
    
    // Reset form
    setFormData({
      name: '',
      cpfCnpj: '',
      tipoCliente: 'FISICO',
      phone: '',
      email: '',
      endereco: '',
      cidade: '',
      cep: '',
      observacoes: ''
    })
    setErrors({})
    onClose()
  }

  const formatCpfCnpj = (value: string) => {
    const numero = value.replace(/\D/g, '')
    
    if (formData.tipoCliente === 'FISICO') {
      // Formato CPF: 000.000.000-00
      return numero
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .slice(0, 14)
    } else {
      // Formato CNPJ: 00.000.000/0000-00
      return numero
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .slice(0, 18)
    }
  }

  const formatPhone = (value: string) => {
    const numero = value.replace(/\D/g, '')
    
    if (numero.length <= 10) {
      // Telefone fixo: (00) 0000-0000
      return numero
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{1,4})/, '$1-$2')
    } else {
      // Celular: (00) 00000-0000
      return numero
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})/, '$1-$2')
        .slice(0, 15)
    }
  }

  const formatCep = (value: string) => {
    const numero = value.replace(/\D/g, '')
    return numero.replace(/(\d{5})(\d{1,3})/, '$1-$2').slice(0, 9)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Novo Cliente</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Cliente
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoCliente"
                  value="FISICO"
                  checked={formData.tipoCliente === 'FISICO'}
                  onChange={(e) => setFormData({ ...formData, tipoCliente: e.target.value as 'FISICO', cpfCnpj: '' })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <User className="w-4 h-4" />
                <span>Pessoa Física</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoCliente"
                  value="JURIDICO"
                  checked={formData.tipoCliente === 'JURIDICO'}
                  onChange={(e) => setFormData({ ...formData, tipoCliente: e.target.value as 'JURIDICO', cpfCnpj: '' })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Building className="w-4 h-4" />
                <span>Pessoa Jurídica</span>
              </label>
            </div>
          </div>

          {/* Dados Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.tipoCliente === 'FISICO' ? 'Nome Completo' : 'Razão Social'} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={formData.tipoCliente === 'FISICO' ? 'João Silva Santos' : 'Empresa Ltda'}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.tipoCliente === 'FISICO' ? 'CPF' : 'CNPJ'} *
              </label>
              <input
                type="text"
                value={formData.cpfCnpj}
                onChange={(e) => setFormData({ ...formData, cpfCnpj: formatCpfCnpj(e.target.value) })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.cpfCnpj ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={formData.tipoCliente === 'FISICO' ? '000.000.000-00' : '00.000.000/0000-00'}
              />
              {errors.cpfCnpj && <p className="text-red-500 text-sm mt-1">{errors.cpfCnpj}</p>}
            </div>
          </div>

          {/* Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="(16) 99999-9999"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="cliente@email.com"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Endereço
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço Completo
              </label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rua das Flores, 123, Centro"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Franca"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: formatCep(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="14400-000"
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Informações adicionais sobre o cliente..."
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
