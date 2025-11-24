'use client'

import { useState, useEffect } from 'react'
import { X, Search, User, Car, FileText, Calendar, DollarSign, Sparkles } from 'lucide-react'
import { MLRecommendations } from '@/components/MLRecommendations'

interface NovoProcessoModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (processo: any) => void
}

interface Cliente {
  id: string
  name: string
  cpfCnpj: string
}

interface Veiculo {
  id: string
  placa: string
  modelo: string
  ano: string
}

export default function NovoProcessoModal({ isOpen, onClose, onSubmit }: NovoProcessoModalProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [loadingVeiculos, setLoadingVeiculos] = useState(false)

  const [formData, setFormData] = useState({
    tipo: '',
    customerId: '',
    veiculoId: '',
    numero: '',
    descricao: '',
    valor: '',
    prazo: '',
    observacoes: ''
  })

  const tiposProcesso = [
    { label: 'Licenciamento', value: 'LICENCIAMENTO' },
    { label: 'Transferência', value: 'TRANSFERENCIA' },
    { label: 'Primeiro Emplacamento', value: 'PRIMEIRO_EMPLACAMENTO' },
    { label: 'Segunda Via', value: 'SEGUNDA_VIA' },
    { label: 'Desbloqueio', value: 'DESBLOQUEIO' },
    { label: 'Alteração de Características', value: 'ALTERACAO_CARACTERISTICAS' },
    { label: 'Baixa de Veículo', value: 'BAIXA_VEICULO' },
    { label: 'Inclusão de Alienação', value: 'INCLUSAO_ALIENACAO' },
    { label: 'Exclusão de Alienação', value: 'EXCLUSAO_ALIENACAO' },
    { label: 'Mudança de Município', value: 'MUDANCA_MUNICIPIO' },
    { label: 'Mudança de UF', value: 'MUDANCA_UF' },
    { label: 'Regularização de Multas', value: 'REGULARIZACAO_MULTAS' }
  ]

  useEffect(() => {
    if (isOpen) {
      fetchClientes()
      fetchVeiculos()
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

  const fetchVeiculos = async () => {
    try {
      setLoadingVeiculos(true)
      const response = await fetch('/api/veiculos')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.tipo || !formData.customerId) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    // Buscar usuário da sessão para usar como responsável
    let responsavelId = ''
    try {
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()
      responsavelId = sessionData?.user?.id || ''
    } catch (error) {
      console.error('Erro ao buscar sessão:', error)
    }

    if (!responsavelId) {
      alert('Erro ao identificar usuário responsável')
      return
    }

    // Encontrar o label do tipo selecionado para usar como título
    const tipoSelecionado = tiposProcesso.find(t => t.value === formData.tipo)
    const titulo = tipoSelecionado?.label || formData.tipo

    const processo = {
      customerId: formData.customerId,
      veiculoId: formData.veiculoId || null,
      tipoServico: formData.tipo, // Agora envia o enum correto (ex: TRANSFERENCIA)
      titulo: titulo, // Label legível (ex: "Transferência")
      descricao: formData.descricao || null,
      responsavelId,
      valorTotal: formData.valor ? parseFloat(formData.valor) : 0,
      prazoLegal: formData.prazo || null,
      observacoes: formData.observacoes || null,
      status: 'AGUARDANDO_DOCUMENTOS'
    }

    onSubmit(processo)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      tipo: '',
      customerId: '',
      veiculoId: '',
      numero: '',
      descricao: '',
      valor: '',
      prazo: '',
      observacoes: ''
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
            <FileText className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Novo Processo</h2>
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
          {/* Tipo de Processo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Processo <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecione o tipo</option>
              {tiposProcesso.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

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

          {/* ML Recommendations - Aparece quando seleciona cliente */}
          {formData.customerId && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-900">Sugestões Inteligentes</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Com base no histórico do cliente, recomendamos:
              </p>
              <MLRecommendations
                customerId={formData.customerId}
                vehicleId={formData.veiculoId || undefined}
                onServiceSelect={(service) => {
                  setFormData({ ...formData, tipo: service })
                }}
              />
            </div>
          )}

          {/* Veículo (Opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Veículo (opcional)
            </label>
            <div className="relative">
              <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={formData.veiculoId}
                onChange={(e) => setFormData({ ...formData, veiculoId: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loadingVeiculos}
              >
                <option value="">
                  {loadingVeiculos ? 'Carregando...' : 'Nenhum veículo (opcional)'}
                </option>
                {veiculos.map((veiculo) => (
                  <option key={veiculo.id} value={veiculo.id}>
                    {veiculo.placa} - {veiculo.modelo} ({veiculo.ano})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Número do Processo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número do Processo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              placeholder="Ex: PROC-2024-001 (ou deixe em branco para gerar automaticamente)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Deixe em branco para gerar automaticamente
            </p>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva os detalhes do processo..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Valor e Prazo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
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
              Criar Processo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
