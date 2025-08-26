'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { isValidAppointmentDate } from '@/store/agendamentoStore'

interface AppointmentCalendarProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  availableDates: Date[]
  minDate?: Date
  maxDate?: Date
}

export default function AppointmentCalendar({
  selectedDate,
  onDateSelect,
  availableDates,
  minDate = new Date(),
  maxDate
}: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  useEffect(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    
    // Pegar o primeiro dia da semana (domingo)
    const startCalendar = new Date(start)
    startCalendar.setDate(start.getDate() - start.getDay())
    
    // Pegar o último dia da semana (sábado)
    const endCalendar = new Date(end)
    endCalendar.setDate(end.getDate() + (6 - end.getDay()))
    
    const days = eachDayOfInterval({
      start: startCalendar,
      end: endCalendar
    })
    
    setCalendarDays(days)
  }, [currentMonth])

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      isSameDay(availableDate, date)
    )
  }

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date())
    return isBefore(date, today) || 
           !isValidAppointmentDate(date) ||
           (maxDate && date > maxDate) ||
           !isDateAvailable(date)
  }

  const getDayClasses = (date: Date) => {
    const baseClasses = 'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all'
    
    if (isDateDisabled(date)) {
      return `${baseClasses} text-gray-300 cursor-not-allowed`
    }
    
    if (selectedDate && isSameDay(selectedDate, date)) {
      return `${baseClasses} bg-blue-600 text-white shadow-lg`
    }
    
    if (isToday(date)) {
      return `${baseClasses} bg-blue-100 text-blue-800 border-2 border-blue-400`
    }
    
    if (date.getMonth() !== currentMonth.getMonth()) {
      return `${baseClasses} text-gray-400 hover:bg-gray-100`
    }
    
    return `${baseClasses} text-gray-700 hover:bg-blue-50 hover:text-blue-600`
  }

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(date)
    }
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        
        <h3 className="text-xl font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dias do Calendário */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => (
          <motion.div
            key={date.toISOString()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            className={getDayClasses(date)}
            onClick={() => handleDateClick(date)}
          >
            {format(date, 'd')}
          </motion.div>
        ))}
      </div>

      {/* Legenda */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded"></div>
          <span className="text-gray-600">Selecionado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
          <span className="text-gray-600">Hoje</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-50 rounded"></div>
          <span className="text-gray-600">Disponível</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-gray-600">Indisponível</span>
        </div>
      </div>
    </div>
  )
}
