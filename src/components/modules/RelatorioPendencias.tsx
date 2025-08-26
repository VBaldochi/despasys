'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  FileTextIcon, 
  UserIcon, 
  CarIcon,
  DollarSignIcon,
  AlertTriangleIcon,
  DownloadIcon,
  PrinterIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from 'lucide-react'
import { detranAPI } from '@/lib/detran'

const reportSchema = z.object({
  cpf: z.string()
    .min(11, 'CPF deve ter 11 dígitos')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato de CPF inválido')
})

type ReportForm = z.infer<typeof reportSchema>

interface RelatorioPendencias {
  cpf: string
  nome: string
  veiculos: Array<{
    placa: string
    modelo: string
    pendencias: Array<{
      tipo: string
      valor: number
      vencimento: string
    }>
  }>
  totalPendencias: number
}

export default function RelatorioPendencias() {
  const [relatorio, setRelatorio] = useState<RelatorioPendencias | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema)
  })

  const cpf = watch('cpf')

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return cleaned
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setValue('cpf', formatted)
  }

  const onSubmit = async (data: ReportForm) => {
    setLoading(true)
    setError('')
    setRelatorio(null)

    try {
      const result = await detranAPI.gerarRelatorioPendencias(data.cpf)
      setRelatorio(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar relatório')
    } finally {
      setLoading(false)
    }
  }

  const getPendenciaIcon = (tipo: string) => {
    switch (tipo) {
      case 'IPVA':
        return <CarIcon className="h-5 w-5 text-blue-600" />
      case 'Seguro Obrigatório':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'Multa':
        return <AlertTriangleIcon className="h-5 w-5 text-red-600" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getPendenciaColor = (tipo: string) => {
    switch (tipo) {
      case 'IPVA':
        return 'bg-blue-50 border-blue-200'
      case 'Seguro Obrigatório':
        return 'bg-green-50 border-green-200'
      case 'Multa':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const handleDownloadPDF = () => {
    // Implementar geração de PDF do relatório
    console.log('Gerando PDF do relatório...')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <FileTextIcon className="h-12 w-12 text-indigo-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Relatório de Pendências
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gere um relatório completo das pendências de todos os seus veículos
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
                  <UserIcon className="h-5 w-5 inline mr-2" />
                  CPF do Proprietário
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={handleCPFChange}
                  value={cpf || ''}
                  disabled={loading}
                />
                {errors.cpf && (
                  <p className="mt-2 text-sm text-red-600">{errors.cpf.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Gerando Relatório...
                  </>
                ) : (
                  <>
                    <FileTextIcon className="h-5 w-5 mr-2" />
                    Gerar Relatório
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

          {/* Relatório */}
          {relatorio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Cabeçalho do Relatório */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Relatório de Pendências
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Proprietário: {relatorio.nome}
                    </p>
                    <p className="text-gray-600">
                      CPF: {relatorio.cpf}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total de Pendências</p>
                    <p className="text-3xl font-bold text-red-600">
                      R$ {relatorio.totalPendencias.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <DownloadIcon className="h-5 w-5 mr-2" />
                    Baixar PDF
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <PrinterIcon className="h-5 w-5 mr-2" />
                    Imprimir
                  </button>
                </div>
              </div>

              {/* Veículos */}
              {relatorio.veiculos.map((veiculo, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center mb-6">
                    <CarIcon className="h-8 w-8 text-indigo-600 mr-3" />
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {veiculo.placa}
                      </h4>
                      <p className="text-gray-600">{veiculo.modelo}</p>
                    </div>
                  </div>

                  {veiculo.pendencias.length > 0 ? (
                    <div className="space-y-4">
                      {veiculo.pendencias.map((pendencia, pendenciaIndex) => (
                        <div
                          key={pendenciaIndex}
                          className={`p-4 rounded-lg border ${getPendenciaColor(pendencia.tipo)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getPendenciaIcon(pendencia.tipo)}
                              <div className="ml-3">
                                <h5 className="font-semibold text-gray-900">
                                  {pendencia.tipo}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  Vencimento: {new Date(pendencia.vencimento).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                R$ {pendencia.valor.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">
                            Total do Veículo:
                          </span>
                          <span className="text-lg font-bold text-red-600">
                            R$ {veiculo.pendencias.reduce((sum, p) => sum + p.valor, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-green-600">
                        Nenhuma pendência encontrada
                      </p>
                      <p className="text-gray-600">
                        Este veículo está em dia com todas as obrigações
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Resumo Final */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    Resumo Geral
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-indigo-200">Total de Veículos</p>
                      <p className="text-3xl font-bold">{relatorio.veiculos.length}</p>
                    </div>
                    <div>
                      <p className="text-indigo-200">Veículos com Pendências</p>
                      <p className="text-3xl font-bold">
                        {relatorio.veiculos.filter(v => v.pendencias.length > 0).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-indigo-200">Total de Pendências</p>
                      <p className="text-3xl font-bold">
                        R$ {relatorio.totalPendencias.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
