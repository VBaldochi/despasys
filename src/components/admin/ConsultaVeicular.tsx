'use client'

import { useState } from 'react'
import { Search, Car, AlertTriangle, CheckCircle, Clock, FileText, DollarSign, Calendar } from 'lucide-react'
import { DetranAPI, DadosVeiculo } from '@/lib/detran-api'

export default function ConsultaVeicular() {
  const [placa, setPlaca] = useState('')
  const [consultando, setConsultando] = useState(false)
  const [dadosVeiculo, setDadosVeiculo] = useState<DadosVeiculo | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const formatarPlaca = (valor: string) => {
    // Permitir letras e números, converter para maiúsculo
    const limpo = valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    if (limpo.length <= 3) return limpo
    if (limpo.length <= 7) return `${limpo.slice(0, 3)}-${limpo.slice(3)}`
    return `${limpo.slice(0, 3)}-${limpo.slice(3, 7)}`
  }

  const handleConsulta = async () => {
    if (!placa.trim()) return
    
    setConsultando(true)
    setErro(null)
    setDadosVeiculo(null)
    
    try {
      const resultado = await DetranAPI.consultarVeiculo({ placa })
      
      if (resultado.sucesso && resultado.dados) {
        setDadosVeiculo(resultado.dados)
      } else {
        setErro(resultado.erro || 'Erro na consulta')
      }
    } catch (error) {
      setErro('Erro na comunicação com o DETRAN')
    } finally {
      setConsultando(false)
    }
  }

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'REGULAR':
        return 'text-green-600 bg-green-100'
      case 'BLOQUEADO':
        return 'text-red-600 bg-red-100'
      case 'PENDENTE':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAGO':
      case 'LICENCIADO':
        return 'text-green-600 bg-green-100'
      case 'PENDENTE':
        return 'text-yellow-600 bg-yellow-100'
      case 'VENCIDO':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Car className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Consulta Veicular DETRAN-SP</h2>
      </div>

      {/* Formulário de Consulta */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placa do Veículo
          </label>
          <input
            type="text"
            value={placa}
            onChange={(e) => setPlaca(formatarPlaca(e.target.value))}
            placeholder="ABC-1234"
            maxLength={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleConsulta}
            disabled={consultando || !placa.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {consultando ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {consultando ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
      </div>

      {/* Estado de Loading */}
      {consultando && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Consultando dados no DETRAN-SP...</span>
          </div>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{erro}</span>
          </div>
        </div>
      )}

      {/* Resultados da Consulta */}
      {dadosVeiculo && (
        <div className="space-y-6">
          {/* Dados Básicos */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5" />
              Dados do Veículo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Placa:</span>
                <p className="font-medium">{dadosVeiculo.placa}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Marca/Modelo:</span>
                <p className="font-medium">{dadosVeiculo.marca} {dadosVeiculo.modelo}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Ano:</span>
                <p className="font-medium">{dadosVeiculo.anoFabricacao}/{dadosVeiculo.anoModelo}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Cor:</span>
                <p className="font-medium">{dadosVeiculo.cor}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Combustível:</span>
                <p className="font-medium">{dadosVeiculo.combustivel}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Situação:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSituacaoColor(dadosVeiculo.situacao)}`}>
                  {dadosVeiculo.situacao}
                </span>
              </div>
            </div>
          </div>

          {/* Proprietário */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Proprietário
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Nome:</span>
                <p className="font-medium">{dadosVeiculo.proprietario.nome}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Documento:</span>
                <p className="font-medium">{dadosVeiculo.proprietario.documento}</p>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Licenciamento */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Licenciamento {dadosVeiculo.licenciamento.exercicio}</h4>
                {dadosVeiculo.licenciamento.situacao === 'LICENCIADO' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : dadosVeiculo.licenciamento.situacao === 'VENCIDO' ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dadosVeiculo.licenciamento.situacao)}`}>
                {dadosVeiculo.licenciamento.situacao}
              </span>
              <p className="text-sm text-gray-600 mt-2">
                Vencimento: {new Date(dadosVeiculo.licenciamento.vencimento).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* IPVA */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">IPVA 2025</h4>
                <DollarSign className="w-5 h-5 text-purple-500" />
              </div>
              {dadosVeiculo.ipva.map((ipva) => (
                <div key={ipva.exercicio} className="mb-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ipva.situacao)}`}>
                    {ipva.situacao}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    R$ {ipva.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">
                    Venc: {new Date(ipva.vencimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>

            {/* Multas */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Multas</h4>
                {dadosVeiculo.multas.quantidade > 0 ? (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{dadosVeiculo.multas.quantidade}</p>
                <p className="text-sm text-gray-600">
                  {dadosVeiculo.multas.quantidade === 0 
                    ? 'Nenhuma multa' 
                    : `R$ ${dadosVeiculo.multas.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Restrições */}
          {dadosVeiculo.restricoes.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Restrições
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {dadosVeiculo.restricoes.map((restricao, index) => (
                  <li key={index} className="text-yellow-800">{restricao}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Criar Processo
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Consultar Débitos
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Agendar Serviço
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
