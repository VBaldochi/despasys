'use client'

import { motion } from 'framer-motion'
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useToast } from '../ui/Toast'

export default function NotificationCenter() {
  const { showToast } = useToast()

  const notifications = [
    {
      id: 1,
      type: 'success' as const,
      title: 'Consulta realizada com sucesso',
      message: 'Dados do veículo PLZ-1234 consultados.',
      time: '2 min atrás',
      read: false
    },
    {
      id: 2,
      type: 'warning' as const,
      title: 'Documento pendente',
      message: 'Licenciamento vencido para veículo ABC-9876.',
      time: '1 hora atrás',
      read: true
    },
    {
      id: 3,
      type: 'info' as const,
      title: 'Nova funcionalidade',
      message: 'Agora você pode exportar relatórios em PDF.',
      time: '1 dia atrás',
      read: true
    }
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    showToast(notification.message, notification.type)
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-md w-full"
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Notificações
            </h3>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
              {notifications.filter(n => !n.read).length}
            </span>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ backgroundColor: '#f9fafb' }}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 rounded-b-lg">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todas as notificações
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Hook para notificações do sistema
export function useNotifications() {
  const { showToast } = useToast()

  const notifySuccess = (message: string) => {
    showToast(message, 'success')
  }

  const notifyError = (message: string) => {
    showToast(message, 'error')
  }

  const notifyInfo = (message: string) => {
    showToast(message, 'info')
  }

  const notifyWarning = (message: string) => {
    showToast(message, 'warning')
  }

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
    notifyWarning
  }
}
