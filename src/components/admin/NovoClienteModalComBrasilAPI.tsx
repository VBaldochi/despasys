'use client'

import { useState } from 'react'
import { X, User, Building, Phone, Mail, MapPin, Save, FileText, CheckCircle, XCircle, Clock, Loader } from 'lucide-react'
import { brasilApi } from '@/lib/brasilapi'

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
  const [cpfCnpjValidation, setCpfCnpjValidation] = useState<{
    status: 'vazio' | 'incompleto' | 'invalido' | 'valido';
    mensagem: string;
    formatado: string;
  }>({ status: 'vazio', mensagem: '', formatado: '' })
  const [cepLoading, setCepLoading] = useState(false)
  const [empresaInfo, setEmpresaInfo] = useState<any>(null)

  // Validação de CPF/CNPJ em tempo real
  const handleCpfCnpjChange = async (value: string) => {
    if (formData.tipoCliente === 'FISICO') {
      const validation = brasilApi.formularios.validarCpfTempoReal(value)
      setCpfCnpjValidation(validation)
      return validation.formatado
    } else {
      const formatted = brasilApi.formatadores.cnpj(value)
      
      if (formatted.replace(/\D/g, '').length === 14) {
        setCpfCnpjValidation({
          status: 'incompleto',
          mensagem: 'Validando CNPJ...',
          formatado: formatted
        })
        
        try {
          const resultado = await brasilApi.buscarEmpresaPorCnpj(formatted)
          if (resultado.success && resultado.empresa) {
            setEmpresaInfo(resultado.empresa)
            setCpfCnpjValidation({
              status: 'valido',
              mensagem: `CNPJ válido - ${resultado.empresa.razao_social}`,
              formatado: formatted
            })
            // Auto-preencher dados da empresa
            setFormData(prev => ({
              ...prev,
              name: resultado.empresa!.razao_social,
              endereco: `${resultado.empresa!.logradouro}, ${resultado.empresa!.numero}`,
              cidade: resultado.empresa!.municipio,
              cep: resultado.empresa!.cep
            }))
          } else {
            setCpfCnpjValidation({
              status: 'invalido',
              mensagem: 'CNPJ não encontrado na Receita Federal',
              formatado: formatted
            })
            setEmpresaInfo(null)
          }
        } catch (error) {
          const valido = brasilApi.validadores.cnpj(formatted)
          setCpfCnpjValidation({
            status: valido ? 'valido' : 'invalido',
            mensagem: valido ? 'CNPJ válido' : 'CNPJ inválido',
            formatado: formatted
          })
        }
      } else if (formatted.replace(/\D/g, '').length > 0) {
        setCpfCnpjValidation({
          status: 'incompleto',
          mensagem: `${formatted.replace(/\D/g, '').length}/14 dígitos`,
          formatado: formatted
        })
        setEmpresaInfo(null)
      } else {
        setCpfCnpjValidation({
          status: 'vazio',
          mensagem: '',
          formatado: ''
        })
        setEmpresaInfo(null)
      }
      
      return formatted
    }
  }

  // Auto-completar endereço por CEP
  const handleCepChange = async (value: string) => {
    const formatted = brasilApi.formatadores.cep(value)
    
    if (formatted.replace(/\D/g, '').length === 8) {
      setCepLoading(true)
      try {
        const resultado = await brasilApi.autocompletarEndereco(formatted)
        if (resultado.success && resultado.endereco) {
          setFormData(prev => ({
            ...prev,
            endereco: resultado.endereco!.logradouro,
            cidade: resultado.endereco!.cidade
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      } finally {
        setCepLoading(false)
      }
    }
    
    return formatted
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.cpfCnpj.trim()) newErrors.cpfCnpj = 'CPF/CNPJ é obrigatório'
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
    
    // Validação com Brasil API
    if (cpfCnpjValidation.status !== 'valido') {
      newErrors.cpfCnpj = 'CPF/CNPJ inválido'
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
      processosAtivos: 0,
      empresaInfo: empresaInfo // Incluir dados da empresa se CNPJ
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
    setCpfCnpjValidation({ status: 'vazio', mensagem: '', formatado: '' })
    setEmpresaInfo(null)
    onClose()
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
                  onChange={(e) => {
                    setFormData({ ...formData, tipoCliente: e.target.value as 'FISICO', cpfCnpj: '' })
                    setCpfCnpjValidation({ status: 'vazio', mensagem: '', formatado: '' })
                    setEmpresaInfo(null)
                  }}
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
                  onChange={(e) => {
                    setFormData({ ...formData, tipoCliente: e.target.value as 'JURIDICO', cpfCnpj: '' })
                    setCpfCnpjValidation({ status: 'vazio', mensagem: '', formatado: '' })
                    setEmpresaInfo(null)
                  }}
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
                onChange={async (e) => {
                  const formatted = await handleCpfCnpjChange(e.target.value)
                  setFormData({ ...formData, cpfCnpj: formatted })
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  errors.cpfCnpj ? 'border-red-300 focus:ring-red-500' : 
                  cpfCnpjValidation.status === 'valido' ? 'border-green-300 focus:ring-green-500' :
                  cpfCnpjValidation.status === 'invalido' ? 'border-red-300 focus:ring-red-500' :
                  'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder={formData.tipoCliente === 'FISICO' ? '000.000.000-00' : '00.000.000/0000-00'}
              />
              {cpfCnpjValidation.status !== 'vazio' && (
                <div className={`mt-1 text-sm flex items-center gap-1 ${
                  cpfCnpjValidation.status === 'valido' ? 'text-green-600' :
                  cpfCnpjValidation.status === 'invalido' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {cpfCnpjValidation.status === 'valido' && <CheckCircle className="w-4 h-4" />}
                  {cpfCnpjValidation.status === 'invalido' && <XCircle className="w-4 h-4" />}
                  {cpfCnpjValidation.status === 'incompleto' && <Clock className="w-4 h-4" />}
                  {cpfCnpjValidation.mensagem}
                </div>
              )}
              {errors.cpfCnpj && <p className="text-red-500 text-sm mt-1">{errors.cpfCnpj}</p>}
            </div>
          </div>

          {/* Informações da Empresa (se CNPJ válido) */}
          {empresaInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Dados da Empresa
              </h4>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Razão Social:</strong> {empresaInfo.razao_social}</p>
                {empresaInfo.nome_fantasia && (
                  <p><strong>Nome Fantasia:</strong> {empresaInfo.nome_fantasia}</p>
                )}
                <p><strong>Situação:</strong> {empresaInfo.descricao_situacao_cadastral}</p>
                <p><strong>Porte:</strong> {empresaInfo.descricao_porte}</p>
                <p><strong>CNAE:</strong> {empresaInfo.cnae_fiscal_descricao}</p>
              </div>
            </div>
          )}

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={async (e) => {
                      const formatted = await handleCepChange(e.target.value)
                      setFormData({ ...formData, cep: formatted })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="14400-000"
                  />
                  {cepLoading && (
                    <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4 animate-spin" />
                  )}
                </div>
              </div>

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
            </div>

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
