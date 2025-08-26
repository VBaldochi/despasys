'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ShieldCheckIcon, 
  UserIcon, 
  BuildingIcon,
  CheckCircleIcon,
  XCircleIcon,
  LoaderIcon,
  MapPinIcon,
  SearchIcon
} from 'lucide-react'
import { detranAPI, DocumentValidation } from '@/lib/detran'

const validationSchema = z.object({
  documentType: z.enum(['cpf', 'cnpj', 'cep']),
  document: z.string().min(1, 'Documento é obrigatório')
})

type ValidationForm = z.infer<typeof validationSchema>

export default function DocumentValidator() {
  const [validation, setValidation] = useState<DocumentValidation | null>(null)
  const [cepData, setCepData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ValidationForm>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      documentType: 'cpf'
    }
  })

  const documentType = watch('documentType')
  const document = watch('document')

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return cleaned
  }

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
    return cleaned
  }

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 8) {
      return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2')
    }
    return cleaned
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formatted = e.target.value
    
    switch (documentType) {
      case 'cpf':
        formatted = formatCPF(e.target.value)
        break
      case 'cnpj':
        formatted = formatCNPJ(e.target.value)
        break
      case 'cep':
        formatted = formatCEP(e.target.value)
        break
    }
    
    setValue('document', formatted)
  }

  const onSubmit = async (data: ValidationForm) => {
    setLoading(true)
    setError('')
    setValidation(null)
    setCepData(null)

    try {
      const cleanDocument = data.document.replace(/\D/g, '')
      
      switch (data.documentType) {
        case 'cpf':
          const cpfResult = await detranAPI.validarCPF(cleanDocument)
          setValidation(cpfResult)
          break
        case 'cnpj':
          const cnpjResult = await detranAPI.validarCNPJ(cleanDocument)
          setValidation(cnpjResult)
          break
        case 'cep':
          const cepResult = await detranAPI.consultarCEP(cleanDocument)
          setCepData(cepResult)
          break
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar documento')
    } finally {
      setLoading(false)
    }
  }

  const handleTypeChange = (type: string) => {
    setValue('documentType', type as any)
    setValue('document', '')
    setValidation(null)
    setCepData(null)
    setError('')
  }

  const getDocumentPlaceholder = () => {
    switch (documentType) {
      case 'cpf':
        return '000.000.000-00'
      case 'cnpj':
        return '00.000.000/0000-00'
      case 'cep':
        return '00000-000'
      default:
        return ''
    }
  }

  const getDocumentLabel = () => {
    switch (documentType) {
      case 'cpf':
        return 'CPF'
      case 'cnpj':
        return 'CNPJ'
      case 'cep':
        return 'CEP'
      default:
        return 'Documento'
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <ShieldCheckIcon className="h-12 w-12 text-green-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Validador de Documentos
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Valide CPF, CNPJ e consulte CEP de forma rápida e segura
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Tipo de Documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Documento
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('cpf')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      documentType === 'cpf'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <UserIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">CPF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('cnpj')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      documentType === 'cnpj'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <BuildingIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">CNPJ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('cep')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      documentType === 'cep'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MapPinIcon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">CEP</span>
                  </button>
                </div>
              </div>

              {/* Input do Documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {getDocumentLabel()}
                </label>
                <input
                  type="text"
                  placeholder={getDocumentPlaceholder()}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleDocumentChange}
                  value={document || ''}
                  disabled={loading}
                />
                {errors.document && (
                  <p className="mt-2 text-sm text-red-600">{errors.document.message}</p>
                )}
              </div>

              {/* Botão de Validação */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <LoaderIcon className="h-5 w-5 mr-2 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    <SearchIcon className="h-5 w-5 mr-2" />
                    Validar {getDocumentLabel()}
                  </>
                )}
              </button>
            </form>

            {/* Erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Resultado CPF/CNPJ */}
            {validation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className={`p-6 rounded-lg border-2 ${
                  validation.isValid
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center mb-4">
                    {validation.isValid ? (
                      <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                    ) : (
                      <XCircleIcon className="h-8 w-8 text-red-600 mr-3" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {validation.isValid ? 'Documento Válido' : 'Documento Inválido'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {documentType.toUpperCase()}: {validation.cpf || validation.cnpj}
                      </p>
                    </div>
                  </div>

                  {validation.isValid && validation.name && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Nome
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {validation.name}
                        </p>
                      </div>
                      
                      {validation.birthDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">
                            Data de Nascimento
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(validation.birthDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                      
                      {validation.situation && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">
                            Situação
                          </label>
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                            validation.situation === 'regular'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {validation.situation.charAt(0).toUpperCase() + validation.situation.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Resultado CEP */}
            {cepData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className={`p-6 rounded-lg border-2 ${
                  cepData.isValid
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-center mb-4">
                    {cepData.isValid ? (
                      <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                    ) : (
                      <XCircleIcon className="h-8 w-8 text-red-600 mr-3" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cepData.isValid ? 'CEP Encontrado' : 'CEP Inválido'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        CEP: {cepData.cep}
                      </p>
                    </div>
                  </div>

                  {cepData.isValid && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Logradouro
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {cepData.logradouro}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Bairro
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {cepData.bairro}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Cidade
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {cepData.cidade}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-500">
                          Estado
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {cepData.uf}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
