import { create } from 'zustand'
import { User, Tenant, LoginCredentials } from '../types'
import AuthService from '../services/auth'

interface AuthState {
  user: User | null
  tenant: Tenant | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  checkAuthStatus: () => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tenant: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null })
    
    try {
      const result = await AuthService.login(credentials)
      
      if (result && 'success' in result && result.success && result.user) {
        set({
          user: result.user,
          token: result.sessionToken || '',
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
      } else {
        const errorMessage = result && 'error' in result ? result.error : 'Erro ao fazer login'
        set({
          isLoading: false,
          error: errorMessage,
          isAuthenticated: false,
          user: null,
          token: null
        })
        throw new Error(errorMessage)
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao fazer login'
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        user: null,
        token: null
      })
      throw error
      throw error
    }
  },

  logout: async () => {
    set({ isLoading: true })
    
    try {
      await AuthService.logout()
      
      set({
        user: null,
        tenant: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erro ao fazer logout'
      })
    }
  },

  refreshToken: async () => {
    try {
      const isValid = await AuthService.refreshSession()
      if (!isValid) {
        get().logout()
      }
    } catch (error: any) {
      // Se falhar o refresh, fazer logout
      get().logout()
    }
  },

  checkAuthStatus: async () => {
    set({ isLoading: true })
    
    try {
      const isAuthenticated = await AuthService.isAuthenticated()
      
      if (isAuthenticated) {
        const user = await AuthService.getCurrentUser()
        const sessionToken = await AuthService.getSessionToken()
        
        set({
          user,
          token: sessionToken,
          isAuthenticated: true,
          isLoading: false
        })
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
}))
