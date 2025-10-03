import { create } from 'zustand'
import { DashboardData } from '../types'
import api from '../services/api'

interface DashboardState {
  data: DashboardData | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  
  // Actions
  fetchDashboard: () => Promise<void>
  refreshDashboard: () => Promise<void>
  clearError: () => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null })
    
    try {
      const response = await api.get('/api/mobile/dashboard')
      
      if (response.data) {
        // Usar os dados retornados pela API mobile
        const dashboardData: DashboardData = {
          processos: {
            total: response.data.totalProcessos || 0,
            pendentes: response.data.processosPendentes || 0,
            emAndamento: response.data.processosAndamento || 0,
            concluidos: response.data.processosConcluidos || 0,
            vencidos: response.data.processosVencidos || 0
          },
          financeiro: {
            receitasMes: response.data.receitasMes || 0,
            despesasMes: response.data.despesasMes || 0,
            saldoAtual: response.data.saldoAtual || 0,
            contasPendentes: response.data.contasPendentes || 0
          },
          clientes: {
            total: response.data.totalClientes || 0,
            novosEsteMes: response.data.novosClientesMes || 0
          },
          proximosVencimentos: response.data.proximosVencimentos || []
        }
        
        set({ 
          data: dashboardData, 
          loading: false,
          lastUpdated: new Date()
        })
      } else {
        throw new Error('Dados de dashboard não encontrados')
      }
    } catch (error: any) {
      console.error('Dashboard error:', error)
      set({
        loading: false,
        error: error.response?.data?.error || error.message || 'Erro ao carregar dashboard'
      })
    }
  },

  refreshDashboard: async () => {
    // Refresh sem mostrar loading se já temos dados
    const { data } = get()
    if (!data) {
      set({ loading: true })
    }
    
    try {
      const response = await api.get('/api/mobile/dashboard')
      
      if (response.data) {
        // Usar os dados retornados pela API mobile
        const dashboardData: DashboardData = {
          processos: {
            total: response.data.totalProcessos || 0,
            pendentes: response.data.processosPendentes || 0,
            emAndamento: response.data.processosAndamento || 0,
            concluidos: response.data.processosConcluidos || 0,
            vencidos: response.data.processosVencidos || 0
          },
          financeiro: {
            receitasMes: response.data.receitasMes || 0,
            despesasMes: response.data.despesasMes || 0,
            saldoAtual: response.data.saldoAtual || 0,
            contasPendentes: response.data.contasPendentes || 0
          },
          clientes: {
            total: response.data.totalClientes || 0,
            novosEsteMes: response.data.novosClientesMes || 0
          },
          proximosVencimentos: response.data.proximosVencimentos || []
        }
        
        set({ 
          data: dashboardData, 
          loading: false,
          lastUpdated: new Date(),
          error: null
        })
      } else {
        throw new Error('Dados não encontrados')
      }
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.error || error.message || 'Erro ao atualizar dashboard'
      })
    }
  },

  clearError: () => set({ error: null })
}))
