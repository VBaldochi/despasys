'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCalculatorStore } from '@/store/calculadoraStore'
import { 
  Calculator, 
  FileTextIcon,
  DollarSignIcon,
  PhoneIcon
} from 'lucide-react'
import QuoteResult from './ResultadoCotacao'

const calculatorSchema = z.object({
  serviceType: z.string().min(1, 'Selecione um serviço'),
  vehicleType: z.string().min(1, 'Selecione o tipo de veículo'),
  customerInfo: z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
    email: z.string().email('Email inválido').optional()
  })
})

type CalculatorForm = z.infer<typeof calculatorSchema>

const services = [
  { id: 'licenciamento', name: 'Licenciamento', icon: '📄', description: 'Renovação anual' },
  { id: 'transferencia', name: 'Transferência', icon: '🔄', description: 'Mudança de propriedade' },
  { id: 'primeiro-registro', name: '1° Registro', icon: '🆕', description: 'Veículo zero km' },
  { id: 'desbloqueio', name: 'Desbloqueio', icon: '🔓', description: 'Resolver pendências' }
]

const vehicleTypes = [
  { id: 'carro', name: 'Carro', icon: '🚗' },
  { id: 'moto', name: 'Moto', icon: '🏍️' },
  { id: 'caminhao', name: 'Caminhão', icon: '🚚' },
  { id: 'onibus', name: 'Ônibus', icon: '🚌' },
  { id: 'reboque', name: 'Reboque', icon: '🚛' }
]

const basePrice = {
  licenciamento: { carro: 180, moto: 120, caminhao: 250, onibus: 280, reboque: 150 },
  transferencia: { carro: 220, moto: 160, caminhao: 320, onibus: 380, reboque: 200 },
  'primeiro-registro': { carro: 300, moto: 200, caminhao: 400, onibus: 450, reboque: 250 },
  desbloqueio: { carro: 150, moto: 100, caminhao: 200, onibus: 250, reboque: 130 }
}

const despachanteFee = 50

export default function PriceCalculator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showResult, setShowResult] = useState(false)
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  const [selectedService, setSelectedService] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger
  } = useForm<CalculatorForm>({
    resolver: zodResolver(calculatorSchema),
    mode: 'onChange'
  })

  const watchedServiceType = watch('serviceType')
  const watchedVehicleType = watch('vehicleType')

  const calculatePrice = (serviceType: string, vehicleType: string) => {
    const base = basePrice[serviceType as keyof typeof basePrice]
    if (!base) return 0
    
    const vehiclePrice = base[vehicleType as keyof typeof base]
    if (!vehiclePrice) return 0
    
    return vehiclePrice + despachanteFee
  }

  const nextStep = async () => {
    let isValid = false
    
    if (currentStep === 1) {
      isValid = await trigger('serviceType')
    } else if (currentStep === 2) {
      isValid = await trigger('vehicleType')
    } else if (currentStep === 3) {
      isValid = await trigger('customerInfo')
    }
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const onSubmit = (data: CalculatorForm) => {
    const price = calculatePrice(data.serviceType, data.vehicleType)
    setCalculatedPrice(price)
    setSelectedService(data.serviceType)
    setSelectedVehicle(data.vehicleType)
    setCustomerData({
      name: data.customerInfo.name,
      phone: data.customerInfo.phone,
      email: data.customerInfo.email || ''
    })
    
    setShowResult(true)
  }

  const resetCalculator = () => {
    setShowResult(false)
    setCurrentStep(1)
    setCalculatedPrice(0)
    setSelectedService('')
    setSelectedVehicle('')
    setCustomerData({ name: '', phone: '', email: '' })
  }

  if (showResult) {
    return (
      <QuoteResult
        calculation={{
          service: selectedService,
          vehicleType: selectedVehicle,
          vehicleYear: 2024,
          urgency: 'normal',
          additionalServices: [],
          basePrice: calculatedPrice - despachanteFee,
          finalPrice: calculatedPrice,
          discount: 0,
          customerInfo: {
            name: customerData.name,
            phone: customerData.phone,
            email: customerData.email
          }
        }}
        onBack={resetCalculator}
      />
    )
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Selecione o Serviço'
      case 2: return 'Tipo de Veículo'
      case 3: return 'Seus Dados'
      default: return 'Calculadora'
    }
  }

  return (
    <section id="calculator" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Calculator className="h-12 w-12 text-blue-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Calculadora de Preços
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calcule o valor dos nossos serviços de forma rápida e transparente
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Progresso</span>
              <span className="text-sm text-blue-600 font-medium">
                {currentStep}/3
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                {currentStep}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {getStepTitle()}
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center mb-4">
                    <FileTextIcon className="h-6 w-6 mr-2 text-blue-600" />
                    <label className="block text-sm font-medium text-gray-700">
                      Qual serviço você precisa?
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <motion.label
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all ${
                          watchedServiceType === service.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          {...register('serviceType')}
                          type="radio"
                          value={service.id}
                          className="sr-only"
                          onChange={(e) => {
                            setValue('serviceType', e.target.value)
                            trigger('serviceType')
                          }}
                        />
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{service.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </div>
                        </div>
                        {watchedServiceType === service.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </motion.label>
                    ))}
                  </div>
                  {errors.serviceType && (
                    <p className="mt-2 text-sm text-red-600">{errors.serviceType.message}</p>
                  )}
                </div>
              )}

              {/* Step 2: Vehicle Type */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-2">🚗</span>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de veículo
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {vehicleTypes.map((type) => (
                      <motion.label
                        key={type.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all text-center ${
                          watchedVehicleType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          {...register('vehicleType')}
                          type="radio"
                          value={type.id}
                          className="sr-only"
                          onChange={(e) => {
                            setValue('vehicleType', e.target.value)
                            trigger('vehicleType')
                          }}
                        />
                        <div className="flex flex-col items-center space-y-2">
                          <span className="text-2xl block mb-1">{type.icon}</span>
                          <span className="text-sm font-medium text-gray-900">{type.name}</span>
                        </div>
                        {watchedVehicleType === type.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </motion.label>
                    ))}
                  </div>
                  {errors.vehicleType && (
                    <p className="mt-2 text-sm text-red-600">{errors.vehicleType.message}</p>
                  )}
                </div>
              )}

              {/* Step 3: Customer Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-2">👤</span>
                    <label className="block text-sm font-medium text-gray-700">
                      Suas informações
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo *
                    </label>
                    <input
                      {...register('customerInfo.name')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Seu nome completo"
                    />
                    {errors.customerInfo?.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerInfo.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone/WhatsApp *
                    </label>
                    <input
                      {...register('customerInfo.phone')}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(16) 99999-9999"
                    />
                    {errors.customerInfo?.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerInfo.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (opcional)
                    </label>
                    <input
                      {...register('customerInfo.email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="seu@email.com"
                    />
                    {errors.customerInfo?.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerInfo.email.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={currentStep === 1}
                >
                  Anterior
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                  >
                    <span className="mr-2">Calcular Preço</span>
                    <Calculator className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Preview */}
          {(watchedServiceType || watchedVehicleType) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 rounded-xl p-6 border border-blue-200"
            >
              <h4 className="font-semibold text-blue-900 mb-3">Prévia do Orçamento</h4>
              <div className="space-y-2 text-sm">
                {watchedServiceType && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Serviço:</span>
                    <span className="font-medium text-blue-900">
                      {services.find(s => s.id === watchedServiceType)?.name}
                    </span>
                  </div>
                )}
                {watchedVehicleType && (
                  <div className="flex justify-between">
                    <span className="text-blue-700">Veículo:</span>
                    <span className="font-medium text-blue-900">
                      {vehicleTypes.find(v => v.id === watchedVehicleType)?.name}
                    </span>
                  </div>
                )}
                {watchedServiceType && watchedVehicleType && (
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-blue-700 font-medium">Total estimado:</span>
                    <span className="font-bold text-blue-900 flex items-center">
                      <DollarSignIcon className="h-4 w-4 mr-1" />
                      R$ {calculatePrice(watchedServiceType, watchedVehicleType).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
