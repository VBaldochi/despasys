import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

// Função para detectar URL de desenvolvimento correta
const getDevBaseURL = () => 'http://192.168.100.72:3001'

// Configuração da API
const API_CONFIG = {
  baseURL: getDevBaseURL(),
  timeout: 15000
}

// Log da configuração atual
console.log('🌐 API Config:', {
  environment: __DEV__ ? 'DEVELOPMENT' : 'PRODUCTION',
  platform: Platform?.OS || 'unknown',
  baseURL: API_CONFIG.baseURL
})

// Headers padrão
const defaultHeaders = {
  'Content-Type': 'application/json'
}

// Criar instância do axios
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: defaultHeaders
})

// Interceptor para adicionar dados de autenticação
api.interceptors.request.use(
  async (config) => {
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    })
    
    const authData = await AsyncStorage.getItem('@despasys:auth')
    const tenantDomain = await AsyncStorage.getItem('@despasys:tenantDomain')
    const userData = await AsyncStorage.getItem('@despasys:user')
    
    console.log('🔑 Debug Auth Data:', {
      hasAuthData: !!authData,
      hasTenantDomain: !!tenantDomain,
      hasUserData: !!userData,
      authData: authData ? JSON.parse(authData) : null,
      tenantDomain,
      userData: userData ? JSON.parse(userData) : null
    })
    
    if (authData && userData) {
      const { sessionToken } = JSON.parse(authData)
      const user = JSON.parse(userData)
      
      if (sessionToken && user) {
        // Para o mobile, vamos passar os dados do usuário diretamente
        config.headers['Authorization'] = `Bearer ${sessionToken}`
        config.headers['X-User-Id'] = user.id
        config.headers['X-Tenant-Id'] = user.tenantId || user.tenant?.id
        
        console.log('🔑 Added Auth Headers:', {
          Authorization: `Bearer ${sessionToken.substring(0, 20)}...`,
          'X-User-Id': user.id,
          'X-Tenant-Id': user.tenantId || user.tenant?.id
        })
      }
    }
    
    if (tenantDomain) {
      config.headers['X-Tenant-Domain'] = tenantDomain
      console.log('🔑 Added Tenant Domain:', tenantDomain)
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response Success:', {
      status: response.status,
      url: response.config.url,
      dataSize: response.data ? JSON.stringify(response.data).length : 0
    })
    return response
  },
  async (error) => {
    console.error('📥 API Error Details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown URL',
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      // Não autorizado, limpar dados e redirecionar para login
      await AsyncStorage.multiRemove([
        '@despasys:auth',
        '@despasys:user',
        '@despasys:tenant',
        '@despasys:tenantDomain'
      ])
      
      // TODO: Navegar para tela de login
      console.log('Token expirado, redirecionando para login...')
    }
    
    return Promise.reject(error)
  }
)

export { api, API_CONFIG }
export default api