'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  SearchIcon, 
  CarIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DollarSignIcon,
  FileTextIcon
} from 'lucide-react'
import { detranAPI, VehicleInfo, Multa } from '@/lib/detran'

const searchSchema = z.object({
  placa: z.string()
    .min(7, 'Placa deve ter 7 caracteres')
    .max(8, 'Placa deve ter no máximo 8 caracteres')
    .regex(/^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/, 'Formato de placa inválido')
    .transform(val => val.replace(/[^A-Z0-9]/g, '').toUpperCase())
})

type SearchForm = z.infer<typeof searchSchema>

export default function DetranConsulta() {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema)
  })

  const placa = watch('placa')

  const formatPlaca = (value: string) => {
    // Permitir apenas letras e números, converter para maiúsculo
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    
    if (cleaned.length <= 3) {
      return cleaned
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`
    }
  }

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlaca(e.target.value)
    setValue('placa', formatted.replace('-', ''))
  }

  const onSubmit = async (data: SearchForm) => {
    setLoading(true)
    setError('')
    setVehicleInfo(null)

    try {
      const info = await detranAPI.consultarVeiculo(data.placa)
      setVehicleInfo(info)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar veículo')
    } finally {
      setLoading(false)
    }
  }

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'regular': return 'text-green-600 bg-green-50'
      case 'irregular': return 'text-red-600 bg-red-50'
      case 'bloqueado': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSituacaoIcon = (situacao: string) => {
    switch (situacao) {
      case 'regular': return <CheckCircleIcon className="h-5 w-5" />
      case 'irregular': return <XCircleIcon className="h-5 w-5" />
      case 'bloqueado': return <AlertTriangleIcon className="h-5 w-5" />
      default: return <ClockIcon className="h-5 w-5" />
    }
  }

  const getMultaColor = (situacao: string) => {
    switch (situacao) {
      case 'pendente': return 'text-yellow-600 bg-yellow-50'
      case 'paga': return 'text-green-600 bg-green-50'
      case 'vencida': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTotalPendencias = () => {
    if (!vehicleInfo) return 0
    
    let total = 0
    
    // IPVA
    if (vehicleInfo.ipva.situacao !== 'pago') {
      total += vehicleInfo.ipva.valor
    }
    
    // Seguro Obrigatório
    if (vehicleInfo.seguroObrigatorio.situacao !== 'pago') {
      total += vehicleInfo.seguroObrigatorio.valor
    }
    
    // Multas pendentes
    vehicleInfo.multas.forEach(multa => {
      if (multa.situacao === 'pendente') {
        total += multa.valor
      }
    })
    
    return total
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <SearchIcon className="h-12 w-12 text-blue-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Consulta DETRAN
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Consulte informações do seu veículo, multas e débitos em tempo real
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Formulário de Busca */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <CarIcon className="h-5 w-5 inline mr-2" />
                  Placa do Veículo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ABC-1234"
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                    onChange={handlePlacaChange}
                    value={formatPlaca(placa || '')}
                    disabled={loading}
                  />
                  {errors.placa && (
                    <p className="mt-2 text-sm text-red-600">{errors.placa.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Consultando...
                  </>
                ) : (
                  <>
                    <SearchIcon className="h-5 w-5 mr-2" />
                    Consultar Veículo
                  </>
                )}
              </button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Resultados */}
          {vehicleInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Informações do Veículo */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <CarIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Informações do Veículo
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Placa
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPlaca(vehicleInfo.placa)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Situação
                    </label>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSituacaoColor(vehicleInfo.situacao)}`}>
                      {getSituacaoIcon(vehicleInfo.situacao)}
                      <span className="ml-2 capitalize">{vehicleInfo.situacao}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Modelo
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {vehicleInfo.marca} {vehicleInfo.modelo}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Ano
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {vehicleInfo.ano}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Cor
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {vehicleInfo.cor}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Combustível
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {vehicleInfo.combustivel}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Proprietário
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {vehicleInfo.proprietario}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Licenciamento
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(vehicleInfo.licenciamentoVencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resumo de Pendências */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <DollarSignIcon className="h-8 w-8 text-red-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      Resumo de Pendências
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-red-600">
                      R$ {getTotalPendencias().toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* IPVA */}
                  <div className={`p-4 rounded-lg border ${vehicleInfo.ipva.situacao === 'pago' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">IPVA {vehicleInfo.ipva.ano}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${vehicleInfo.ipva.situacao === 'pago' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {vehicleInfo.ipva.situacao.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      R$ {vehicleInfo.ipva.valor.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Vencimento: {new Date(vehicleInfo.ipva.dataVencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  {/* Seguro Obrigatório */}
                  <div className={`p-4 rounded-lg border ${vehicleInfo.seguroObrigatorio.situacao === 'pago' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Seguro Obrigatório</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${vehicleInfo.seguroObrigatorio.situacao === 'pago' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {vehicleInfo.seguroObrigatorio.situacao.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      R$ {vehicleInfo.seguroObrigatorio.valor.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Vencimento: {new Date(vehicleInfo.seguroObrigatorio.dataVencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Multas */}
              {vehicleInfo.multas.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center mb-6">
                    <AlertTriangleIcon className="h-8 w-8 text-yellow-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      Multas ({vehicleInfo.multas.length})
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {vehicleInfo.multas.map((multa, index) => (
                      <div key={multa.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">
                            {multa.infracao}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMultaColor(multa.situacao)}`}>
                            {multa.situacao.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Valor</p>
                            <p className="font-semibold text-gray-900">
                              R$ {multa.valor.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Data</p>
                            <p className="font-semibold text-gray-900">
                              {new Date(multa.data).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Pontos</p>
                            <p className="font-semibold text-gray-900">
                              {multa.pontos} pontos
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Local</p>
                            <p className="font-semibold text-gray-900">
                              {multa.local}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Precisa de Ajuda?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <FileTextIcon className="h-5 w-5 mr-2" />
                    Solicitar Orçamento
                  </button>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
                    <SearchIcon className="h-5 w-5 mr-2" />
                    Agendar Atendimento
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
