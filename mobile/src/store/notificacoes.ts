import { create } from 'zustand'
import api from '../services/api'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  priority: 'low' | 'medium' | 'high'
  read: boolean
  createdAt: string
}

interface NotificacoesState {
  notificacoes: Notification[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  
  // Actions
  fetchNotificacoes: () => Promise<void>
  refreshNotificacoes: () => Promise<void>
  markAsRead: (id: string) => void
  clearError: () => void
}

export const useNotificacoesStore = create<NotificacoesState>((set, get) => ({
  notificacoes: [],
  loading: false,
  error: null,
  lastUpdated: null,

  fetchNotificacoes: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await api.get('/api/mobile/notificacoes')
      
      if (response.data && Array.isArray(response.data.data)) {
        set({ 
          notificacoes: response.data.data,
          loading: false,
          lastUpdated: new Date()
        })
      } else if (Array.isArray(response.data)) {
        set({
          notificacoes: response.data,
          loading: false,
          lastUpdated: new Date()
        })
      } else {
        throw new Error('Falha ao carregar notificações')
      }
    } catch (error: any) {
      console.error('Notificações error:', error)
      set({
        loading: false,
        error: error.response?.data?.error || error.message || 'Erro ao carregar notificações'
      })
    }
  },

  refreshNotificacoes: async () => {
    const { notificacoes } = get()
    if (notificacoes.length === 0) {
      set({ loading: true })
    }
    
    try {
      const response = await api.get('/api/mobile/notificacoes')
      
      if (response.data && Array.isArray(response.data.data)) {
        set({ 
          notificacoes: response.data.data,
          loading: false,
          lastUpdated: new Date(),
          error: null
        })
      } else if (Array.isArray(response.data)) {
        set({
          notificacoes: response.data,
          loading: false,
          lastUpdated: new Date(),
          error: null
        })
      } else {
        throw new Error('Falha ao atualizar notificações')
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.error || error.message || 'Erro ao atualizar notificações'
      })
    }
  },

  markAsRead: (id: string) => {
    set(state => ({
      notificacoes: state.notificacoes.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    }))
  },

  clearError: () => set({ error: null })
}))
