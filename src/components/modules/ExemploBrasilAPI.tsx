'use client'

import { useState } from 'react'
import NovoClienteModal from '@/components/admin/NovoClienteModal'
import { User, Building, Plus } from 'lucide-react'

export default function ExemploBrasilAPI() {
  const [modalOpen, setModalOpen] = useState(false)
  const [clientes, setClientes] = useState<any[]>([])

  const handleSalvarCliente = (cliente: any) => {
    setClientes(prev => [...prev, cliente])
    console.log('Cliente salvo:', cliente)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🇧🇷 Brasil API - Demo Completa
          </h1>
          <p className="text-gray-600">
            Demonstração da integração completa com validação de CPF/CNPJ, 
            consulta de empresas e auto-completar por CEP
          </p>
        </div>

        {/* Cards de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold">Validação CPF</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Formatação automática</li>
              <li>✅ Validação em tempo real</li>
              <li>✅ Feedback visual</li>
              <li>✅ Indicadores de status</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">Consulta CNPJ</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Consulta Receita Federal</li>
              <li>✅ Auto-preenchimento</li>
              <li>✅ Dados da empresa</li>
              <li>✅ Informações completas</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Auto-completar CEP</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Busca automática</li>
              <li>✅ Endereço completo</li>
              <li>✅ Cidade e estado</li>
              <li>✅ Indicador loading</li>
            </ul>
          </div>
        </div>

        {/* Botão para abrir modal */}
        <div className="text-center mb-8">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-3 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Testar Brasil API - Novo Cliente
          </button>
        </div>

        {/* Instruções de Teste */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🧪 Como Testar</h2>
          
          <div className="space-y-6">
            {/* Teste CPF */}
            <div>
              <h3 className="font-medium text-green-700 mb-2">
                1. Teste Validação de CPF (Pessoa Física)
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700 mb-2">
                  <strong>CPF para teste:</strong> 11144477735
                </p>
                <ol className="text-sm text-green-600 space-y-1">
                  <li>• Selecione "Pessoa Física"</li>
                  <li>• Digite o CPF acima</li>
                  <li>• Veja a formatação automática: 111.444.777-35</li>
                  <li>• Observe o feedback visual em tempo real</li>
                </ol>
              </div>
            </div>

            {/* Teste CNPJ */}
            <div>
              <h3 className="font-medium text-blue-700 mb-2">
                2. Teste Consulta de CNPJ (Pessoa Jurídica)
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700 mb-2">
                  <strong>CNPJ para teste:</strong> 11222333000181
                </p>
                <ol className="text-sm text-blue-600 space-y-1">
                  <li>• Selecione "Pessoa Jurídica"</li>
                  <li>• Digite o CNPJ acima</li>
                  <li>• Veja a formatação: 11.222.333/0001-81</li>
                  <li>• Aguarde a consulta na Receita Federal</li>
                  <li>• Dados da empresa são preenchidos automaticamente</li>
                  <li>• Painel verde mostra informações da empresa</li>
                </ol>
              </div>
            </div>

            {/* Teste CEP */}
            <div>
              <h3 className="font-medium text-purple-700 mb-2">
                3. Teste Auto-completar por CEP
              </h3>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-700 mb-2">
                  <strong>CEP para teste:</strong> 01310-100 (Av. Paulista, São Paulo)
                </p>
                <ol className="text-sm text-purple-600 space-y-1">
                  <li>• Digite o CEP acima</li>
                  <li>• Veja a formatação: 01310-100</li>
                  <li>• Observe o indicador de carregamento</li>
                  <li>• Endereço é preenchido automaticamente</li>
                  <li>• Cidade "São Paulo" é preenchida</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Clientes Salvos */}
        {clientes.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              👥 Clientes Cadastrados ({clientes.length})
            </h2>
            <div className="space-y-3">
              {clientes.map((cliente, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    {cliente.tipoCliente === 'FISICO' ? (
                      <User className="w-5 h-5 text-green-600" />
                    ) : (
                      <Building className="w-5 h-5 text-blue-600" />
                    )}
                    <h3 className="font-medium">{cliente.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      cliente.tipoCliente === 'FISICO' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {cliente.tipoCliente === 'FISICO' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}
                    </div>
                    <div>
                      <strong>Telefone:</strong> {cliente.phone}
                    </div>
                    <div>
                      <strong>E-mail:</strong> {cliente.email || 'Não informado'}
                    </div>
                    <div>
                      <strong>Endereço:</strong> {cliente.endereco || 'Não informado'}
                    </div>
                    <div>
                      <strong>Cidade:</strong> {cliente.cidade || 'Não informado'}
                    </div>
                    <div>
                      <strong>CEP:</strong> {cliente.cep || 'Não informado'}
                    </div>
                  </div>
                  {cliente.empresaInfo && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-1">Dados da Empresa:</h4>
                      <div className="text-sm text-green-700">
                        <p><strong>Situação:</strong> {cliente.empresaInfo.descricao_situacao_cadastral}</p>
                        <p><strong>Porte:</strong> {cliente.empresaInfo.descricao_porte}</p>
                        {cliente.empresaInfo.nome_fantasia && (
                          <p><strong>Nome Fantasia:</strong> {cliente.empresaInfo.nome_fantasia}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        <NovoClienteModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSalvarCliente}
        />
      </div>
    </div>
  )
}
