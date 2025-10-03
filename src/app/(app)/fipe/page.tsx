'use client';

import React, { useState } from 'react';
import { Car, Search, Plus, TrendingUp, Info } from 'lucide-react';
import ConsultaFipe from '@/components/modules/ConsultaFipe';
import ModalConsultaVeiculo from '@/components/modules/ModalConsultaVeiculo';

interface VeiculoSalvo {
  id: string;
  marca: string;
  modelo: string;
  preco: string;
  ano: number;
  combustivel: string;
  dataConsulta: string;
}

export default function FipePage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [veiculosSalvos, setVeiculosSalvos] = useState<VeiculoSalvo[]>([]);

  const handleVeiculoAdicionado = (veiculo: any) => {
    const novoVeiculo: VeiculoSalvo = {
      id: Date.now().toString(),
      ...veiculo,
      dataConsulta: new Date().toLocaleDateString('pt-BR')
    };
    
    setVeiculosSalvos(prev => [novoVeiculo, ...prev]);
  };

  const removerVeiculo = (id: string) => {
    setVeiculosSalvos(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Car className="w-8 h-8 text-blue-600" />
                Consulta FIPE
              </h1>
              <p className="text-gray-600 mt-2">
                Consulte preços de veículos segundo a tabela FIPE
              </p>
            </div>
            
            <button
              onClick={() => setModalAberto(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nova Consulta
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consulta Principal */}
          <div className="lg:col-span-2">
            <ConsultaFipe onVeiculoSelecionado={handleVeiculoAdicionado} />
          </div>

          {/* Sidebar - Informações e Histórico */}
          <div className="space-y-6">
            {/* Informações da FIPE */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Sobre a FIPE
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  A <strong>FIPE</strong> (Fundação Instituto de Pesquisas Econômicas) 
                  é responsável pela divulgação da Tabela FIPE de preços médios de veículos.
                </p>
                <p>
                  Os preços são atualizados mensalmente e servem como referência 
                  para o mercado de veículos usados no Brasil.
                </p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Dica</span>
                  </div>
                  <p className="text-blue-600 text-xs mt-1">
                    Use a consulta FIPE para avaliar veículos em 
                    transferências e documentações.
                  </p>
                </div>
              </div>
            </div>

            {/* Veículos Consultados */}
            {veiculosSalvos.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-green-600" />
                  Últimas Consultas
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {veiculosSalvos.map((veiculo) => (
                    <div key={veiculo.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {veiculo.marca} {veiculo.modelo}
                          </p>
                          <p className="text-xs text-gray-500">
                            {veiculo.ano} • {veiculo.combustivel}
                          </p>
                          <p className="text-sm font-bold text-green-600 mt-1">
                            {veiculo.preco}
                          </p>
                          <p className="text-xs text-gray-400">
                            {veiculo.dataConsulta}
                          </p>
                        </div>
                        <button
                          onClick={() => removerVeiculo(veiculo.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <ModalConsultaVeiculo
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
          onVeiculoAdicionado={handleVeiculoAdicionado}
        />
      </div>
    </div>
  );
}
