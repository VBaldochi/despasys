import { create } from 'zustand'
import { addDays, format, isWeekend, setHours, setMinutes } from 'date-fns'

export interface Appointment {
  id: string
  title: string
  start: Date
  end: Date
  customerInfo: {
    name: string
    phone: string
    email?: string
  }
  serviceType: string
  appointmentType: 'presencial' | 'online' | 'coleta'
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido'
  notes?: string
  createdAt: Date
}

export interface TimeSlot {
  id: string
  date: Date
  startTime: string
  endTime: string
  available: boolean
  appointmentId?: string
}

interface AppointmentState {
  appointments: Appointment[]
  availableSlots: TimeSlot[]
  selectedDate: Date | null
  selectedSlot: TimeSlot | null
  isLoading: boolean
  businessHours: {
    start: number // 9 (9:00 AM)
    end: number   // 17 (5:00 PM)
    interval: number // 60 (minutos)
  }
  setSelectedDate: (date: Date | null) => void
  setSelectedSlot: (slot: TimeSlot | null) => void
  generateAvailableSlots: (date: Date) => TimeSlot[]
  bookAppointment: (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => Promise<string>
  cancelAppointment: (appointmentId: string) => Promise<void>
  getAppointment: (id: string) => Appointment | undefined
  getAppointmentsByDate: (date: Date) => Appointment[]
  isSlotAvailable: (date: Date, startTime: string) => boolean
}

// Dados mock para demonstração
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Licenciamento - João Silva',
    start: new Date(2025, 0, 20, 9, 0),
    end: new Date(2025, 0, 20, 10, 0),
    customerInfo: {
      name: 'João Silva',
      phone: '(16) 99999-9999',
      email: 'joao@email.com'
    },
    serviceType: 'licenciamento',
    appointmentType: 'presencial',
    status: 'confirmado',
    createdAt: new Date()
  },
  {
    id: '2',
    title: 'Transferência - Maria Santos',
    start: new Date(2025, 0, 20, 14, 0),
    end: new Date(2025, 0, 20, 15, 0),
    customerInfo: {
      name: 'Maria Santos',
      phone: '(16) 88888-8888',
      email: 'maria@email.com'
    },
    serviceType: 'transferencia',
    appointmentType: 'presencial',
    status: 'agendado',
    createdAt: new Date()
  }
]

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: MOCK_APPOINTMENTS,
  availableSlots: [],
  selectedDate: null,
  selectedSlot: null,
  isLoading: false,
  businessHours: {
    start: 9,   // 9:00 AM
    end: 17,    // 5:00 PM
    interval: 60 // 60 minutos
  },

  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),

  generateAvailableSlots: (date) => {
    const { businessHours, appointments } = get()
    const slots: TimeSlot[] = []
    
    // Não gerar slots para finais de semana
    if (isWeekend(date)) {
      return slots
    }

    // Gerar slots baseados no horário comercial
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`
      
      const slotStart = setMinutes(setHours(date, hour), 0)
      const slotEnd = setMinutes(setHours(date, hour + 1), 0)
      
      // Verificar se o slot está ocupado
      const isOccupied = appointments.some(appointment => 
        appointment.start.getTime() === slotStart.getTime() &&
        appointment.status !== 'cancelado'
      )
      
      slots.push({
        id: `${format(date, 'yyyy-MM-dd')}-${startTime}`,
        date: date,
        startTime,
        endTime,
        available: !isOccupied,
        appointmentId: isOccupied ? 
          appointments.find(a => a.start.getTime() === slotStart.getTime())?.id : undefined
      })
    }
    
    return slots
  },

  bookAppointment: async (appointmentData) => {
    const { selectedSlot, appointments } = get()
    
    if (!selectedSlot) {
      throw new Error('Nenhum horário selecionado')
    }

    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      start: setMinutes(setHours(selectedSlot.date, parseInt(selectedSlot.startTime.split(':')[0])), 0),
      end: setMinutes(setHours(selectedSlot.date, parseInt(selectedSlot.endTime.split(':')[0])), 0)
    }

    set({ 
      appointments: [...appointments, newAppointment],
      selectedSlot: null
    })

    return newAppointment.id
  },

  cancelAppointment: async (appointmentId) => {
    const { appointments } = get()
    
    set({
      appointments: appointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: 'cancelado' as const }
          : appointment
      )
    })
  },

  getAppointment: (id) => {
    const { appointments } = get()
    return appointments.find(appointment => appointment.id === id)
  },

  getAppointmentsByDate: (date) => {
    const { appointments } = get()
    return appointments.filter(appointment =>
      format(appointment.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') &&
      appointment.status !== 'cancelado'
    )
  },

  isSlotAvailable: (date, startTime) => {
    const { appointments } = get()
    const [hour] = startTime.split(':').map(Number)
    const slotStart = setMinutes(setHours(date, hour), 0)
    
    return !appointments.some(appointment => 
      appointment.start.getTime() === slotStart.getTime() &&
      appointment.status !== 'cancelado'
    )
  }
}))

// Função helper para formatar data
export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy')
}

// Função helper para formatar horário
export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm')
}

// Função helper para obter próximos dias úteis
export const getNextBusinessDays = (count: number = 30): Date[] => {
  const days: Date[] = []
  let currentDate = new Date()
  
  while (days.length < count) {
    if (!isWeekend(currentDate)) {
      days.push(new Date(currentDate))
    }
    currentDate = addDays(currentDate, 1)
  }
  
  return days
}

// Função helper para verificar se uma data é válida para agendamento
export const isValidAppointmentDate = (date: Date): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return date >= today && !isWeekend(date)
}
