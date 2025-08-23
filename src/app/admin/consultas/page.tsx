'use client'

import { useState } from 'react'
import { Search, Car, FileText, DollarSign, AlertTriangle, Info } from 'lucide-react'
import ConsultaVeicular from '@/components/admin/ConsultaVeicular'

export default function ConsultasPage() {
  const [tipoConsulta, setTipoConsulta] = useState<'veiculo' | 'debitos' | 'transferencia' | 'licenciamento'>('veiculo')

  const tiposConsulta = [
    {
      id: 'veiculo' as const,
      titulo: 'Consulta Veicular',
      descricao: 'Dados completos do veículo no DETRAN-SP',
      icon: Car,
      color: 'blue'
    },
    {
      id: 'debitos' as const,
      titulo: 'Consulta de Débitos',
      descricao: 'IPVA, multas e taxas pendentes',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'transferencia' as const,
      titulo: 'Verificar Transferência',
      descricao: 'Pendências para transferência',
      icon: FileText,
      color: 'purple'
    },
    {
      id: 'licenciamento' as const,
      titulo: 'Situação Licenciamento',
      descricao: 'Status do licenciamento anual',
      icon: AlertTriangle,
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string, active: boolean) => {
    const colors = {
      blue: {
        bg: active ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200',
        icon: active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400',
        text: active ? 'text-blue-900' : 'text-gray-900',
        desc: active ? 'text-blue-700' : 'text-gray-600'
      },
      green: {
        bg: active ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200',
        icon: active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400',
        text: active ? 'text-green-900' : 'text-gray-900',
        desc: active ? 'text-green-700' : 'text-gray-600'
      },
      purple: {
        bg: active ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200',
        icon: active ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400',
        text: active ? 'text-purple-900' : 'text-gray-900',
        desc: active ? 'text-purple-700' : 'text-gray-600'
      },
      orange: {
        bg: active ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200',
        icon: active ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400',
        text: active ? 'text-orange-900' : 'text-gray-900',
        desc: active ? 'text-orange-700' : 'text-gray-600'
      }
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Consultas DETRAN</h1>
              <p className="text-gray-600 mt-1">Consulte dados de veículos diretamente no sistema do DETRAN-SP</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">Dados atualizados em tempo real</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Seletor de Tipo de Consulta */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tiposConsulta.map((tipo) => {
            const Icon = tipo.icon
            const isActive = tipoConsulta === tipo.id
            const colors = getColorClasses(tipo.color, isActive)
            
            return (
              <button
                key={tipo.id}
                onClick={() => setTipoConsulta(tipo.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${colors.bg}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${colors.icon}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className={`font-semibold ${colors.text}`}>
                    {tipo.titulo}
                  </h3>
                </div>
                <p className={`text-sm ${colors.desc}`}>
                  {tipo.descricao}
                </p>
              </button>
            )
          })}
        </div>

        {/* Conteúdo da Consulta */}
        <div className="space-y-6">
          {tipoConsulta === 'veiculo' && <ConsultaVeicular />}
          
          {tipoConsulta === 'debitos' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Consulta de Débitos</h2>
              </div>
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Consulta de Débitos</h3>
                <p className="text-gray-600">Em desenvolvimento - Integração com API de débitos do DETRAN-SP</p>
              </div>
            </div>
          )}

          {tipoConsulta === 'transferencia' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Verificação para Transferência</h2>
              </div>
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Verificação de Transferência</h3>
                <p className="text-gray-600">Em desenvolvimento - Verificação de pendências para transferência</p>
              </div>
            </div>
          )}

          {tipoConsulta === 'licenciamento' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Situação do Licenciamento</h2>
              </div>
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Consulta de Licenciamento</h3>
                <p className="text-gray-600">Em desenvolvimento - Verificação da situação do licenciamento anual</p>
              </div>
            </div>
          )}
        </div>

        {/* Informações Importantes */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Informações Importantes</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• As consultas são realizadas diretamente no sistema do DETRAN-SP</li>
                <li>• Os dados são atualizados em tempo real</li>
                <li>• Para usar em produção, é necessário credenciamento no DETRAN-SP</li>
                <li>• Algumas consultas podem ter custo por transação</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
