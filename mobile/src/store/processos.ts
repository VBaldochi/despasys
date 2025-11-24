import { create } from 'zustand'
import { Process } from '../types'
import api from '../services/api'

interface ProcessosState {
  processos: Process[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null

  // Actions
  fetchProcessos: () => Promise<void>
  refreshProcessos: () => Promise<void>
  clearError: () => void

  // Real-time actions
  addProcesso: (processo: Process) => void
  updateProcesso: (processo: Process) => void
  removeProcesso: (id: string) => void
}

export const useProcessosStore = create<ProcessosState>((set, get) => ({
  processos: [],
  loading: false,
  error: null,
  lastUpdated: null,

  fetchProcessos: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await api.get('/api/mobile/processos')
      
      if (response.data && Array.isArray(response.data.data)) {
        set({ 
          processos: response.data.data,
          loading: false,
          lastUpdated: new Date()
        })
      } else if (Array.isArray(response.data)) {
        set({
          processos: response.data,
          loading: false,
          lastUpdated: new Date()
        })
      } else {
        throw new Error('Falha ao carregar processos')
      }
    } catch (error: any) {
      console.error('Processos error:', error)
      set({
        loading: false,
        error: error.response?.data?.error || error.message || 'Erro ao carregar processos'
      })
    }
  },

  refreshProcessos: async () => {
    const { processos } = get()
    if (processos.length === 0) {
      set({ loading: true })
    }
    
    try {
      const response = await api.get('/api/mobile/processos')
      
      if (response.data && Array.isArray(response.data.data)) {
        set({ 
          processos: response.data.data,
          loading: false,
          lastUpdated: new Date(),
          error: null
        })
      } else if (Array.isArray(response.data)) {
        set({
          processos: response.data,
          loading: false,
          lastUpdated: new Date(),
          error: null
        })
      } else {
        throw new Error('Falha ao atualizar processos')
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.error || error.message || 'Erro ao atualizar processos'
      })
    }
  },

  clearError: () => set({ error: null }),

  addProcesso: (processo) => set(state => ({
    processos: [processo, ...state.processos.filter(p => p.id !== processo.id)]
  })),
  updateProcesso: (processo) => set(state => ({
    processos: state.processos.map(p => p.id === processo.id ? processo : p)
  })),
  removeProcesso: (id) => set(state => ({
    processos: state.processos.filter(p => p.id !== id)
  })),
}))
