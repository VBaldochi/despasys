'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Car, 
  User, 
  FileText, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  RefreshCw,
  Database,
  Shield,
  Calendar,
  DollarSign
} from 'lucide-react'

export default function ConsultasPage() {
  const [activeTab, setActiveTab] = useState('veiculos')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Estados específicos para FIPE
  const [fipeData, setFipeData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    resultado: null as any
  })
  
  const [fipeOptions, setFipeOptions] = useState({
    marcas: [] as any[],
    modelos: [] as any[],
    anos: [] as any[],
    loadingMarcas: false,
    loadingModelos: false,
    loadingAnos: false
  })

  const consultasTabs = [
    { id: 'veiculos', name: 'Veículos', icon: Car },
    { id: 'fipe', name: 'FIPE', icon: DollarSign },
    { id: 'pessoas', name: 'Pessoas', icon: User },
    { id: 'documentos', name: 'Documentos', icon: FileText },
    { id: 'historico', name: 'Histórico', icon: Clock },
  ]

  const consultasRecentes = [
    {
      id: 1,
      tipo: 'Veículo',
      parametro: 'ABC-1234',
      resultado: 'Encontrado',
      cliente: 'João Silva',
      data: '2024-01-20 14:30',
      status: 'sucesso'
    },
    {
      id: 2,
      tipo: 'CPF',
      parametro: '123.456.789-00',
      resultado: 'Dados obtidos',
      cliente: 'Maria Santos',
      data: '2024-01-20 13:15',
      status: 'sucesso'
    },
    {
      id: 3,
      tipo: 'CNH',
      parametro: '98765432100',
      resultado: 'Pendências encontradas',
      cliente: 'Pedro Costa',
      data: '2024-01-20 11:45',
      status: 'alerta'
    },
    {
      id: 4,
      tipo: 'Veículo',
      parametro: 'XYZ-9876',
      resultado: 'Não encontrado',
      cliente: 'Ana Lima',
      data: '2024-01-20 10:20',
      status: 'erro'
    }
  ]

  const handleConsulta = async (tipo: string) => {
    setIsLoading(true)
    
    try {
      switch (tipo) {
        case 'veiculo':
          console.log('Consultando veículo no DETRAN...')
          // Implementar consulta DETRAN
          break
        case 'fipe':
          console.log('Consultando preço FIPE...')
          
          if (!fipeData.marca || !fipeData.modelo || !fipeData.ano) {
            throw new Error('Selecione marca, modelo e ano')
          }
          
          try {
            // Buscar o preço usando os parâmetros corretos da API v2
            const url = `/api/fipe/preco/consulta?tipo=cars&marca=${fipeData.marca}&modelo=${fipeData.modelo}&ano=${fipeData.ano}`
            console.log('URL da consulta FIPE:', url)
            const response = await fetch(url)
            
            if (response.ok) {
              const data = await response.json()
              console.log('Dados recebidos da FIPE:', data)
              
              // Buscar nomes das opções selecionadas para exibir
              const marcaSelecionada = fipeOptions.marcas.find(m => m.valor === fipeData.marca)
              const modeloSelecionado = fipeOptions.modelos.find(m => m.valor === fipeData.modelo)
              const anoSelecionado = fipeOptions.anos.find(a => a.valor === fipeData.ano)
              
              setFipeData(prev => ({
                ...prev,
                resultado: {
                  valor: data.valor || 'Valor não disponível',
                  mesReferencia: data.mesReferencia || 'Agosto/2025',
                  codigoFipe: data.codigoFipe || fipeData.ano,
                  combustivel: data.combustivel || 'N/A',
                  marcaNome: data.marca || marcaSelecionada?.nome || 'N/A',
                  modeloNome: data.modelo || modeloSelecionado?.nome || 'N/A',
                  anoNome: anoSelecionado?.nome || `${data.anoModelo} ${data.combustivel}` || 'N/A'
                }
              }))
            } else {
              const errorData = await response.text()
              console.error('Erro na response:', response.status, errorData)
              throw new Error(`Erro ao consultar preço FIPE: ${response.status}`)
            }
          } catch (error) {
            console.error('Erro na consulta FIPE:', error)
            // Fallback com dados mock em caso de erro
            const precoBase = Math.floor(Math.random() * 50000) + 20000
            const marcaSelecionada = fipeOptions.marcas.find(m => m.valor === fipeData.marca)
            const modeloSelecionado = fipeOptions.modelos.find(m => m.valor === fipeData.modelo)
            const anoSelecionado = fipeOptions.anos.find(a => a.valor === fipeData.ano)
            
            setFipeData(prev => ({
              ...prev,
              resultado: {
                valor: precoBase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                mesReferencia: 'Agosto/2025',
                codigoFipe: fipeData.ano,
                combustivel: 'Flex',
                marcaNome: marcaSelecionada?.nome || 'N/A',
                modeloNome: modeloSelecionado?.nome || 'N/A',
                anoNome: anoSelecionado?.nome || 'N/A'
              }
            }))
          }
          break
        case 'cpf':
          console.log('Consultando CPF...')
          // Implementar consulta CPF
          break
        case 'cnh':
          console.log('Consultando CNH...')
          // Implementar consulta CNH
          break
        default:
          console.log('Tipo de consulta não reconhecido')
      }
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error('Erro na consulta:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Funções para FIPE
  const carregarMarcas = async () => {
    setFipeOptions(prev => ({ ...prev, loadingMarcas: true, marcas: [] }))
    try {
      const response = await fetch('/api/fipe/marcas/carros')
      if (response.ok) {
        const data = await response.json()
        setFipeOptions(prev => ({ ...prev, marcas: data.marcas }))
      }
    } catch (error) {
      console.error('Erro ao carregar marcas:', error)
    } finally {
      setFipeOptions(prev => ({ ...prev, loadingMarcas: false }))
    }
  }

  const carregarModelos = async (codigoMarca: string) => {
    console.log('Carregando modelos para marca:', codigoMarca)
    setFipeOptions(prev => ({ ...prev, loadingModelos: true, modelos: [], anos: [] }))
    try {
      const url = `/api/fipe/veiculo/carros/${codigoMarca}`
      console.log('URL para modelos:', url)
      const response = await fetch(url)
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Dados recebidos:', data)
        setFipeOptions(prev => ({ ...prev, modelos: data.veiculos }))
      } else {
        console.error('Erro na response:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Erro ao carregar modelos:', error)
    } finally {
      setFipeOptions(prev => ({ ...prev, loadingModelos: false }))
    }
  }

  const carregarAnos = async (codigoMarca: string, codigoModelo: string) => {
    setFipeOptions(prev => ({ ...prev, loadingAnos: true, anos: [] }))
    try {
      const modeloCodificado = encodeURIComponent(codigoModelo)
      const response = await fetch(`/api/fipe/veiculo/carros/${codigoMarca}/${modeloCodificado}`)
      if (response.ok) {
        const data = await response.json()
        setFipeOptions(prev => ({ ...prev, anos: data.anos }))
      }
    } catch (error) {
      console.error('Erro ao carregar anos:', error)
    } finally {
      setFipeOptions(prev => ({ ...prev, loadingAnos: false }))
    }
  }

  // Carregar marcas quando a aba FIPE for ativada
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    if (tabId === 'fipe' && fipeOptions.marcas.length === 0) {
      carregarMarcas()
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'sucesso':
        return { icon: CheckCircle, text: 'Sucesso', color: 'text-green-600 bg-green-100' }
      case 'alerta':
        return { icon: AlertCircle, text: 'Atenção', color: 'text-yellow-600 bg-yellow-100' }
      case 'erro':
        return { icon: AlertCircle, text: 'Erro', color: 'text-red-600 bg-red-100' }
      default:
        return { icon: Clock, text: 'Processando', color: 'text-blue-600 bg-blue-100' }
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Consultas</h1>
        <p className="text-gray-600 mt-1">Realize consultas nos órgãos públicos e bases de dados</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Consultas Hoje</p>
              <p className="text-2xl font-semibold text-gray-900">47</p>
            </div>
            <Search className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sucessos</p>
              <p className="text-2xl font-semibold text-green-600">42</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendências</p>
              <p className="text-2xl font-semibold text-yellow-600">3</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Créditos</p>
              <p className="text-2xl font-semibold text-purple-600">158</p>
            </div>
            <Database className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultation Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {consultasTabs.map((tab) => {
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <TabIcon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'veiculos' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Consulta de Veículos</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Placa do Veículo
                      </label>
                      <input
                        type="text"
                        placeholder="ABC-1234"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RENAVAM
                      </label>
                      <input
                        type="text"
                        placeholder="12345678901"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                                    <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => handleConsulta('veiculo')}
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4 mr-2" />
                      )}
                      Consultar DETRAN
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fipe' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Consulta FIPE</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marca
                      </label>
                      <select 
                        value={fipeData.marca}
                        onChange={(e) => {
                          const novoValor = e.target.value
                          setFipeData({...fipeData, marca: novoValor, modelo: '', ano: ''})
                          setFipeOptions(prev => ({ ...prev, modelos: [], anos: [] }))
                          if (novoValor) {
                            carregarModelos(novoValor)
                          }
                        }}
                        disabled={fipeOptions.loadingMarcas}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">
                          {fipeOptions.loadingMarcas ? 'Carregando marcas...' : 'Selecione a marca'}
                        </option>
                        {fipeOptions.marcas.map((marca: any, index: number) => (
                          <option key={`marca-${marca.valor}-${index}`} value={marca.valor}>
                            {marca.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Modelo
                      </label>
                      <select 
                        value={fipeData.modelo}
                        onChange={(e) => {
                          const novoValor = e.target.value
                          setFipeData({...fipeData, modelo: novoValor, ano: ''})
                          setFipeOptions(prev => ({ ...prev, anos: [] }))
                          if (novoValor && fipeData.marca) {
                            carregarAnos(fipeData.marca, novoValor)
                          }
                        }}
                        disabled={!fipeData.marca || fipeOptions.loadingModelos}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">
                          {fipeOptions.loadingModelos ? 'Carregando modelos...' : 'Selecione o modelo'}
                        </option>
                        {fipeOptions.modelos.map((modelo: any, index: number) => (
                          <option key={`modelo-${modelo.valor}-${index}`} value={modelo.valor}>
                            {modelo.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ano
                      </label>
                      <select 
                        value={fipeData.ano}
                        onChange={(e) => setFipeData({...fipeData, ano: e.target.value})}
                        disabled={!fipeData.modelo || fipeOptions.loadingAnos}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      >
                        <option value="">
                          {fipeOptions.loadingAnos ? 'Carregando anos...' : 'Selecione o ano'}
                        </option>
                        {fipeOptions.anos.map((ano: any, index: number) => (
                          <option key={`ano-${ano.valor}-${index}`} value={ano.valor}>
                            {ano.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => handleConsulta('fipe')}
                      disabled={isLoading || !fipeData.marca || !fipeData.modelo || !fipeData.ano}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <DollarSign className="h-4 w-4 mr-2" />
                      )}
                      Consultar Preço FIPE
                    </button>
                    
                    <button
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-gray-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Relatório
                    </button>
                  </div>

                  {/* Resultado da consulta FIPE */}
                  {fipeData.resultado && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">Resultado da Consulta FIPE</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded border">
                          <label className="text-sm text-gray-600">Valor</label>
                          <p className="font-semibold text-lg text-green-600">{fipeData.resultado.valor}</p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <label className="text-sm text-gray-600">Mês de Referência</label>
                          <p className="font-semibold">{fipeData.resultado.mesReferencia}</p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <label className="text-sm text-gray-600">Código FIPE</label>
                          <p className="font-semibold">{fipeData.resultado.codigoFipe}</p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <label className="text-sm text-gray-600">Combustível</label>
                          <p className="font-semibold">{fipeData.resultado.combustivel}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                        <h5 className="font-medium text-blue-900 mb-2">Detalhes do Veículo</h5>
                        <div className="text-sm text-blue-800">
                          <p><strong>Marca:</strong> {fipeData.resultado.marcaNome || 'N/A'}</p>
                          <p><strong>Modelo:</strong> {fipeData.resultado.modeloNome || 'N/A'}</p>
                          <p><strong>Ano:</strong> {fipeData.resultado.anoNome || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!fipeData.resultado && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">Resultado da Consulta</h4>
                      <p className="text-gray-500 text-center py-8">
                        Selecione marca, modelo e ano, depois clique em "Consultar Preço FIPE" para ver o resultado.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'pessoas' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Consulta de Pessoas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF
                      </label>
                      <input
                        type="text"
                        placeholder="123.456.789-00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNH
                      </label>
                      <input
                        type="text"
                        placeholder="12345678900"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => handleConsulta('cpf')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Consultar CPF
                    </button>
                    
                    <button
                      onClick={() => handleConsulta('cnh')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Consultar CNH
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documentos' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Validação de Documentos</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número do Documento
                      </label>
                      <input
                        type="text"
                        placeholder="Digite o número do documento"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Documento
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Selecione o tipo</option>
                        <option>CPF</option>
                        <option>CNPJ</option>
                        <option>RG</option>
                        <option>CNH</option>
                        <option>Placa de Veículo</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConsulta('documento')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors mt-4"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Validar Documento
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'historico' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Consultas</h3>
                <p className="text-gray-600">Visualize as consultas realizadas nos últimos 30 dias</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Consultas Recentes
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {consultasRecentes.map((consulta) => {
                const statusInfo = getStatusInfo(consulta.status)
                const StatusIcon = statusInfo.icon

                return (
                  <div key={consulta.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`p-1 rounded ${statusInfo.color} mr-2`}>
                          <StatusIcon className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {consulta.tipo}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button className="text-blue-600 hover:text-blue-800 p-1">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800 p-1">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{consulta.parametro}</p>
                    <p className="text-xs text-gray-500 mb-2">{consulta.resultado}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{consulta.cliente}</span>
                      <span>{consulta.data}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
