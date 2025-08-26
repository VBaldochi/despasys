'use client'

import React from 'react'
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Bell
} from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { name: 'Clientes Ativos', value: '247', icon: Users, change: '+12%', color: 'text-blue-600 bg-blue-100' },
    { name: 'Processos Pendentes', value: '89', icon: FileText, change: '+4%', color: 'text-yellow-600 bg-yellow-100' },
    { name: 'Receita Mensal', value: 'R$ 45.280', icon: DollarSign, change: '+18%', color: 'text-green-600 bg-green-100' },
    { name: 'Taxa de Conversão', value: '68%', icon: TrendingUp, change: '+8%', color: 'text-purple-600 bg-purple-100' },
  ]

  const recentActivities = [
    { id: 1, type: 'Novo Cliente', description: 'João Silva foi cadastrado', time: '2 min atrás', icon: Users, color: 'text-blue-600' },
    { id: 2, type: 'Processo Concluído', description: 'Transferência de veículo finalizada', time: '15 min atrás', icon: CheckCircle, color: 'text-green-600' },
    { id: 3, type: 'Pagamento Recebido', description: 'R$ 850,00 - Maria Santos', time: '1 hora atrás', icon: DollarSign, color: 'text-green-600' },
    { id: 4, type: 'Agendamento', description: 'Consulta DETRAN às 14:00', time: '2 horas atrás', icon: Calendar, color: 'text-purple-600' },
  ]

  const pendingTasks = [
    { id: 1, task: 'Revisar documentos do processo #1234', priority: 'Alta', due: 'Hoje' },
    { id: 2, task: 'Contatar cliente sobre renovação', priority: 'Média', due: 'Amanhã' },
    { id: 3, task: 'Atualizar sistema DETRAN', priority: 'Baixa', due: '2 dias' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change} vs mês anterior</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Atividades Recentes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-50 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Tarefas Pendentes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">{task.task}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                      task.priority === 'Média' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">{task.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Receita dos Últimos 6 Meses
            </h3>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end justify-between space-x-2">
              {[40, 65, 50, 80, 75, 90].map((height, index) => (
                <div key={index} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${height}%` }}>
                  <div className="text-xs text-center text-white pt-2">
                    {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Distribuição de Serviços
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { service: 'Transferência de Veículos', percentage: 45, color: 'bg-blue-500' },
                { service: 'Licenciamento', percentage: 30, color: 'bg-green-500' },
                { service: 'Consultas DETRAN', percentage: 15, color: 'bg-yellow-500' },
                { service: 'Outros Serviços', percentage: 10, color: 'bg-purple-500' },
              ].map((item) => (
                <div key={item.service} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-gray-700">{item.service}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
