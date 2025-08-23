'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, addDays, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon,
  MapPinIcon,
  ComputerDesktopIcon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useAppointmentStore, formatDate, getNextBusinessDays, isValidAppointmentDate } from '@/store/agendamentoStore'
import AppointmentCalendar from './CalendarioAgendamento'
import AppointmentConfirmation from './ConfirmacaoAgendamento'

const appointmentSchema = z.object({
  customerInfo: z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
    email: z.string().email('Email inválido').optional()
  }),
  serviceType: z.string().min(1, 'Selecione um serviço'),
  appointmentType: z.enum(['presencial', 'online', 'coleta']),
  notes: z.string().optional()
})

type AppointmentForm = z.infer<typeof appointmentSchema>

const services = [
  { id: 'licenciamento', name: 'Licenciamento', icon: '🆕', duration: '1h' },
  { id: 'transferencia', name: 'Transferência', icon: '🔃', duration: '1h' },
  { id: 'primeiro-registro', name: '1° Registro', icon: '🆙', duration: '1h' },
  { id: 'desbloqueio', name: 'Desbloqueio', icon: '🆗', duration: '1h' },
  { id: 'vistoria', name: 'Vistoria', icon: '🔍', duration: '30min' },
  { id: 'consultoria', name: 'Consultoria', icon: '💬', duration: '30min' }
]

const appointmentTypes = [
  {
    id: 'presencial',
    name: 'Presencial',
    icon: MapPinIcon,
    description: 'Atendimento no escritório',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'online',
    name: 'Online',
    icon: ComputerDesktopIcon,
    description: 'Atendimento via videochamada',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'coleta',
    name: 'Coleta',
    icon: TruckIcon,
    description: 'Busca e entrega de documentos',
    color: 'from-purple-500 to-purple-600'
  }
]

export default function AppointmentSystem() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [timeSlots, setTimeSlots] = useState<string[]>([])

  const {
    selectedSlot,
    setSelectedSlot,
    generateAvailableSlots,
    bookAppointment,
    isSlotAvailable
  } = useAppointmentStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema)
  })

  const selectedService = watch('serviceType')
  const selectedAppointmentType = watch('appointmentType')

  useEffect(() => {
    // Gerar próximos 30 dias úteis
    const businessDays = getNextBusinessDays(30)
    setAvailableDates(businessDays)
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const slots = generateAvailableSlots(selectedDate)
      const availableTimes = slots
        .filter(slot => slot.available)
        .map(slot => slot.startTime)
      setTimeSlots(availableTimes)
    }
  }, [selectedDate, generateAvailableSlots])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime('')
    setCurrentStep(3)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (selectedDate) {
      const slot = generateAvailableSlots(selectedDate)
        .find(s => s.startTime === time)
      if (slot) {
        setSelectedSlot(slot)
        setCurrentStep(4)
      }
    }
  }

  const onSubmit = async (data: AppointmentForm) => {
    if (!selectedSlot) return

    try {
      const appointmentData = {
        title: `${services.find(s => s.id === data.serviceType)?.name} - ${data.customerInfo.name}`,
        customerInfo: data.customerInfo,
        serviceType: data.serviceType,
        appointmentType: data.appointmentType,
        status: 'agendado' as const,
        notes: data.notes,
        start: selectedSlot.date,
        end: selectedSlot.date
      }

      const id = await bookAppointment(appointmentData)
      setAppointmentId(id)
      setCurrentStep(5)
    } catch (error) {
      console.error('Erro ao agendar:', error)
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setSelectedDate(null)
    setSelectedTime('')
    setAppointmentId(null)
    setSelectedSlot(null)
    reset()
  }

  if (currentStep === 5 && appointmentId) {
    return (
      <AppointmentConfirmation
        appointmentId={appointmentId}
        onNewAppointment={resetForm}
      />
    )
  }

  return (
    <section id="agendamento" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <CalendarDaysIcon className="h-12 w-12 text-blue-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Agendamento Online
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Agende seu atendimento de forma rápida e prática
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${
                  step < 4 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step <= currentStep
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Serviço</span>
            <span>Data</span>
            <span>Horário</span>
            <span>Dados</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Selecionar Serviço */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserIcon className="h-6 w-6 mr-2 text-blue-600" />
                Selecione o Serviço
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                      selectedService === service.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      {...register('serviceType')}
                      type="radio"
                      value={service.id}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <span className="text-3xl block mb-2">{service.icon}</span>
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">Duração: {service.duration}</p>
                    </div>
                  </label>
                ))}
              </div>

              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Tipo de Atendimento
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {appointmentTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                      selectedAppointmentType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      {...register('appointmentType')}
                      type="radio"
                      value={type.id}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${type.color} flex items-center justify-center mx-auto mb-3`}>
                        <type.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {(errors.serviceType || errors.appointmentType) && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  {errors.serviceType && (
                    <p className="text-sm text-red-600">{errors.serviceType.message}</p>
                  )}
                  {errors.appointmentType && (
                    <p className="text-sm text-red-600">{errors.appointmentType.message}</p>
                  )}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => selectedService && selectedAppointmentType && setCurrentStep(2)}
                  disabled={!selectedService || !selectedAppointmentType}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próximo
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Selecionar Data */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CalendarDaysIcon className="h-6 w-6 mr-2 text-blue-600" />
                Selecione a Data
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {availableDates.slice(0, 18).map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateSelect(date)}
                    className={`p-3 rounded-lg border-2 transition-all hover:border-blue-300 ${
                      selectedDate && isSameDay(selectedDate, date)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-600">
                        {format(date, 'EEE', { locale: ptBR })}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {format(date, 'dd')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(date, 'MMM', { locale: ptBR })}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Selecionar Horário */}
          {currentStep === 3 && selectedDate && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <ClockIcon className="h-6 w-6 mr-2 text-blue-600" />
                Selecione o Horário
              </h3>
              
              <div className="mb-6">
                <p className="text-lg text-gray-700">
                  Data selecionada: <span className="font-semibold">{formatDate(selectedDate)}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-3 rounded-lg border-2 transition-all hover:border-blue-300 ${
                      selectedTime === time
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {time}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {timeSlots.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">Nenhum horário disponível para esta data.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Tente selecionar outra data.
                  </p>
                </div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Dados do Cliente */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserIcon className="h-6 w-6 mr-2 text-blue-600" />
                Seus Dados
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
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
                      Telefone/WhatsApp
                    </label>
                    <input
                      {...register('customerInfo.phone')}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(16) 98247-7126"
                    />
                    {errors.customerInfo?.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerInfo.phone.message}</p>
                    )}
                  </div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Informações adicionais sobre o seu caso..."
                  />
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Confirmar Agendamento</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
