'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon,
  MapPinIcon,
  ComputerDesktopIcon,
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { useAppointmentStore } from '@/store/agendamentoStore'
import { Appointment } from '@/store/agendamentoStore'

interface AppointmentConfirmationProps {
  appointmentId: string
  onNewAppointment: () => void
}

export default function AppointmentConfirmation({ 
  appointmentId, 
  onNewAppointment 
}: AppointmentConfirmationProps) {
  const { getAppointment } = useAppointmentStore()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [whatsappSent, setWhatsappSent] = useState(false)

  useEffect(() => {
    const appointmentData = getAppointment(appointmentId)
    if (appointmentData) {
      setAppointment(appointmentData)
    }
  }, [appointmentId, getAppointment])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  if (!appointment) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Carregando dados do agendamento...</p>
      </div>
    )
  }

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'presencial':
        return MapPinIcon
      case 'online':
        return ComputerDesktopIcon
      case 'coleta':
        return TruckIcon
      default:
        return MapPinIcon
    }
  }

  const getAppointmentTypeLabel = (type: string) => {
    switch (type) {
      case 'presencial':
        return 'Presencial'
      case 'online':
        return 'Online'
      case 'coleta':
        return 'Coleta'
      default:
        return 'Presencial'
    }
  }

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'presencial':
        return 'from-blue-500 to-blue-600'
      case 'online':
        return 'from-green-500 to-green-600'
      case 'coleta':
        return 'from-purple-500 to-purple-600'
      default:
        return 'from-blue-500 to-blue-600'
    }
  }

  const sendWhatsAppConfirmation = () => {
    const message = `🗓️ *AGENDAMENTO CONFIRMADO*

📋 *Dados do Agendamento:*
• Serviço: ${appointment.title}
• Data: ${formatDate(appointment.start)}
• Horário: ${appointment.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
• Tipo: ${getAppointmentTypeLabel(appointment.appointmentType)}
• Cliente: ${appointment.customerInfo.name}
• Telefone: ${appointment.customerInfo.phone}

📍 *Próximos Passos:*
${appointment.appointmentType === 'presencial' ? 
  '• Compareça ao nosso escritório no horário marcado\n• Traga seus documentos originais' :
  appointment.appointmentType === 'online' ?
  '• Aguarde o link da videochamada\n• Tenha os documentos em mãos' :
  '• Aguarde nossa equipe entrar em contato\n• Prepare os documentos para coleta'
}

🏢 *Lazuli Despachante*
📞 (16) 98247-7126
📧 contato@lazulidespachante.com.br

Em caso de dúvidas ou necessidade de reagendamento, entre em contato conosco!`

    const whatsappUrl = `https://wa.me/5516982477126?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setWhatsappSent(true)
  }

  const AppointmentTypeIcon = getAppointmentTypeIcon(appointment.appointmentType)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto"
    >
      {/* Header de Sucesso */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Agendamento Confirmado!
        </h2>
        <p className="text-lg text-gray-600">
          Seu atendimento foi agendado com sucesso
        </p>
      </div>

      {/* Dados do Agendamento */}
      <div className="space-y-6">
        {/* Serviço */}
        <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <DocumentTextIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Serviço</p>
            <p className="text-lg font-semibold text-gray-900">{appointment.title}</p>
          </div>
        </div>

        {/* Data e Horário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CalendarDaysIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Data</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(appointment.start)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Horário</p>
              <p className="text-lg font-semibold text-gray-900">
                {appointment.start.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Tipo de Atendimento */}
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className={`w-12 h-12 bg-gradient-to-r ${getAppointmentTypeColor(appointment.appointmentType)} rounded-lg flex items-center justify-center`}>
            <AppointmentTypeIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Tipo de Atendimento</p>
            <p className="text-lg font-semibold text-gray-900">
              {getAppointmentTypeLabel(appointment.appointmentType)}
            </p>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
            Seus Dados
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{appointment.customerInfo.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{appointment.customerInfo.phone}</span>
            </div>
            {appointment.customerInfo.email && (
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">{appointment.customerInfo.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Observações */}
        {appointment.notes && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Observações</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {appointment.notes}
            </p>
          </div>
        )}

        {/* Próximos Passos */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Próximos Passos
          </h3>
          <div className="space-y-3 text-gray-700">
            {appointment.appointmentType === 'presencial' && (
              <>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">1</span>
                  </div>
                  <p>Compareça ao nosso escritório no horário marcado</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-semibold">2</span>
                  </div>
                  <p>Traga seus documentos originais e cópias</p>
                </div>
              </>
            )}
            {appointment.appointmentType === 'online' && (
              <>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-semibold">1</span>
                  </div>
                  <p>Aguarde o link da videochamada que será enviado por WhatsApp</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-semibold">2</span>
                  </div>
                  <p>Tenha os documentos em mãos para análise</p>
                </div>
              </>
            )}
            {appointment.appointmentType === 'coleta' && (
              <>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-semibold">1</span>
                  </div>
                  <p>Nossa equipe entrará em contato para confirmar o endereço</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-semibold">2</span>
                  </div>
                  <p>Prepare os documentos para coleta no horário agendado</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
        <button
          onClick={sendWhatsAppConfirmation}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          <span>Enviar Confirmação</span>
        </button>

        <button
          onClick={onNewAppointment}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Novo Agendamento
        </button>
      </div>

      {whatsappSent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-green-800 text-sm text-center">
            ✅ Confirmação enviada via WhatsApp!
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
