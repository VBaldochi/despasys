'use client'

import { useState, useEffect } from 'react'
import NovoAgendamentoModal from '@/components/admin/NovoAgendamentoModal'

export default function AppointmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = async (agendamento: any) => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agendamento)
      })

      if (response.ok) {
        await fetchAppointments()
        alert('Agendamento criado com sucesso!')
      } else {
        const error = await response.json()
        alert(`Erro ao criar agendamento: ${error.message || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      alert('Erro ao criar agendamento')
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      SCHEDULED: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Agendado' },
      CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmado' },
      COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Concluído' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' },
      NO_SHOW: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Não Compareceu' }
    }
    const badge = badges[status] || badges.SCHEDULED
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime)
      return aptDate.getDate() === date.getDate() &&
             aptDate.getMonth() === date.getMonth() &&
             aptDate.getFullYear() === date.getFullYear()
    })
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)
    const days = []
    const today = new Date()
    
    // Células vazias antes do primeiro dia
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[80px] bg-gray-50"></div>)
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayAppointments = getAppointmentsForDate(date)
      const isToday = date.toDateString() === today.toDateString()
      
      days.push(
        <div
          key={day}
          className={`min-h-[80px] border border-gray-200 p-1 ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-blue-600' : 'text-gray-700'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayAppointments.slice(0, 2).map((apt) => (
              <div
                key={apt.id}
                className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                title={`${apt.customer?.name} - ${apt.serviceType}`}
              >
                {new Date(apt.startTime).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })} {apt.customer?.name}
              </div>
            ))}
            {dayAppointments.length > 2 && (
              <div className="text-xs text-gray-500 px-1">
                +{dayAppointments.length - 2} mais
              </div>
            )}
          </div>
        </div>
      )
    }
    
    return days
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Novo Agendamento
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Calendário de Agendamentos</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setMonth(newDate.getMonth() - 1)
                  setCurrentDate(newDate)
                }}
                className="p-2 hover:bg-gray-100 rounded"
              >
                ←
              </button>
              <span className="font-medium min-w-[150px] text-center">
                {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => {
                  const newDate = new Date(currentDate)
                  newDate.setMonth(newDate.getMonth() + 1)
                  setCurrentDate(newDate)
                }}
                className="p-2 hover:bg-gray-100 rounded"
              >
                →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>
        
        {/* Próximos Agendamentos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Próximos Agendamentos</h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-500">Carregando...</p>
            ) : appointments.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum agendamento próximo</p>
            ) : (
              appointments.slice(0, 3).map((apt) => (
                <div key={apt.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-medium text-sm">{apt.customer?.name}</p>
                  <p className="text-xs text-gray-500">{apt.serviceType}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(apt.startTime)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Lista de Agendamentos */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Todos os Agendamentos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Carregando agendamentos...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum agendamento encontrado
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {apt.customer?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {apt.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(apt.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(apt.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                      <button className="text-red-600 hover:text-red-900">Cancelar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NovoAgendamentoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddAppointment}
      />
    </div>
  );
}
