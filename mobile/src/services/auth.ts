import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from './api'
import { AuthResponse, AuthError, LoginCredentials, User, Tenant } from '../types'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse | AuthError> {
    try {
      // Usar o endpoint mobile específico
      const response = await api.post('/api/mobile/auth', credentials)
      
      if (response.data.success && response.data.user) {
        const { user } = response.data
        
        // Gerar um token simples para o mobile
        const token = `mobile_${user.id}_${user.tenantId}_${Date.now()}`
        
        // Salvar dados no AsyncStorage
        await AsyncStorage.multiSet([
          ['@despasys:auth', JSON.stringify({
            sessionToken: token,
            loginTime: Date.now()
          })],
          ['@despasys:user', JSON.stringify(user)],
          ['@despasys:tenantDomain', credentials.tenantDomain]
        ])
        
        return {
          success: true,
          user,
          token
        }
      } else {
        throw new Error(response.data.error || 'Resposta inválida do servidor')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Tratar diferentes tipos de erro
      if (error.response?.status === 401) {
        throw new Error(error.response.data?.error || 'Credenciais inválidas')
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || 'Dados de login inválidos')
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Erro de conexão. Verifique sua internet.')
      } else {
        throw new Error(error.response?.data?.error || error.message || 'Erro de conexão')
      }
    }
  }

  async logout(): Promise<void> {
    try {
      // Limpar AsyncStorage com chaves corretas
      await AsyncStorage.multiRemove([
        '@despasys:auth',
        '@despasys:user',
        '@despasys:tenant',
        '@despasys:tenantDomain'
      ])
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('@despasys:user')
      if (userString) {
        return JSON.parse(userString)
      }
      return null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  async getSessionToken(): Promise<string | null> {
    try {
      const authString = await AsyncStorage.getItem('@despasys:auth')
      if (authString) {
        const authData = JSON.parse(authString)
        return authData.sessionToken
      }
      return null
    } catch (error) {
      console.error('Get session token error:', error)
      return null
    }
  }

  async getTenantDomain(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@despasys:tenantDomain')
    } catch (error) {
      console.error('Get tenant domain error:', error)
      return null
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const sessionToken = await this.getSessionToken()
      const user = await this.getCurrentUser()
      const tenantDomain = await this.getTenantDomain()
      
      return !!(sessionToken && user && tenantDomain)
    } catch (error) {
      return false
    }
  }

  async validateSession(): Promise<boolean> {
    try {
      // Verificar se a sessão ainda é válida no servidor
      const response = await api.get('/api/debug/auth-status')
      return response.data.hasSession === true
    } catch (error) {
      console.error('Session validation error:', error)
      return false
    }
  }

  async refreshSession(): Promise<boolean> {
    try {
      // Para NextAuth, tentamos re-validar a sessão
      const isValid = await this.validateSession()
      
      if (!isValid) {
        // Se sessão inválida, fazer logout
        await this.logout()
        return false
      }
      
      return true
    } catch (error) {
      console.error('Refresh session error:', error)
      await this.logout()
      return false
    }
  }

  // Método auxiliar para debug
  async getAuthDebugInfo(): Promise<any> {
    try {
      const authData = await AsyncStorage.getItem('@despasys:auth')
      const userData = await AsyncStorage.getItem('@despasys:user')
      const tenantDomain = await AsyncStorage.getItem('@despasys:tenantDomain')
      
      return {
        hasAuth: !!authData,
        hasUser: !!userData,
        hasTenant: !!tenantDomain,
        authData: authData ? JSON.parse(authData) : null,
        userData: userData ? JSON.parse(userData) : null,
        tenantDomain
      }
    } catch (error) {
      console.error('Get auth debug info error:', error)
      return null
    }
  }
}

export default new AuthService()