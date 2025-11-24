import { create } from 'zustand'
import { Customer } from '../types'
import api from '../services/api'

interface ClientesState {
  clientes: Customer[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  
  // Actions
  fetchClientes: () => Promise<void>
  refreshClientes: () => Promise<void>
  clearError: () => void
}

export const useClientesStore = create<ClientesState>((set, get) => ({
  clientes: [],
  loading: false,
  error: null,
  lastUpdated: null,

  fetchClientes: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await api.get('/api/mobile/clientes')
      
      if (response.data && Array.isArray(response.data.data)) {
        set({ 
          clientes: response.data.data,
          loading: false,
          lastUpdated: new Date()
        })
      } else if (Array.isArray(response.data)) {
        set({
          clientes: response.data,
          loading: false,
          lastUpdated: new Date()
        })
      } else {
        throw new Error('Falha ao carregar clientes')
      }
    } catch (error: any) {
      console.error('Clientes error:', error)
      set({
        loading: false,
        error: error.response?.data?.error || error.message || 'Erro ao carregar clientes'
      })
    }
  },

  refreshClientes: async () => {
    const { clientes } = get()
    if (clientes.length === 0) {
      set({ loading: true })
    }
    
    try {
      const response = await api.get('/api/mobile/clientes')
      
      if (response.data && Array.isArray(response.data.data)) {
        set({ 
          clientes: response.data.data,
          loading: false,
          lastUpdated: new Date(),
          error: null
        })
      } else if (Array.isArray(response.data)) {
        set({
          clientes: response.data,
          loading: false,
          lastUpdated: new Date(),
          error: null
        })
      } else {
        throw new Error('Falha ao atualizar clientes')
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.error || error.message || 'Erro ao atualizar clientes'
      })
    }
  },

  clearError: () => set({ error: null })
}))
