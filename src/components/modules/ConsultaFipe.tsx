'use client';

import React, { useState, useEffect } from 'react';
import { Search, Car, DollarSign, Calendar, Fuel, Info, Loader, AlertCircle } from 'lucide-react';
import { fipeService, type MarcaFipe, type VeiculoFipe, type PrecoFipe, type TipoVeiculo } from '@/lib/brasilapi';

interface ConsultaFipeProps {
  onVeiculoSelecionado?: (dados: {
    marca: string;
    modelo: string;
    preco: string;
    ano: number;
    combustivel: string;
  }) => void;
  className?: string;
}

interface EstadoConsulta {
  status: 'idle' | 'loading' | 'success' | 'error';
  erro?: string;
}

export default function ConsultaFipe({ onVeiculoSelecionado, className = '' }: ConsultaFipeProps) {
  // Estados principais
  const [tipoVeiculo, setTipoVeiculo] = useState<TipoVeiculo>('carros');
  const [marcas, setMarcas] = useState<MarcaFipe[]>([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState<string>('');
  const [veiculos, setVeiculos] = useState<VeiculoFipe[]>([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<string>('');
  const [precos, setPrecos] = useState<PrecoFipe[]>([]);
  
  // Estados de controle
  const [estadoMarcas, setEstadoMarcas] = useState<EstadoConsulta>({ status: 'idle' });
  const [estadoVeiculos, setEstadoVeiculos] = useState<EstadoConsulta>({ status: 'idle' });
  const [estadoPrecos, setEstadoPrecos] = useState<EstadoConsulta>({ status: 'idle' });
  
  // Buscar marcas quando tipo de veículo muda
  useEffect(() => {
    buscarMarcas();
  }, [tipoVeiculo]);

  // Buscar veículos quando marca muda
  useEffect(() => {
    if (marcaSelecionada) {
      buscarVeiculos();
    } else {
      setVeiculos([]);
      setVeiculoSelecionado('');
      setPrecos([]);
    }
  }, [marcaSelecionada]);

  // Buscar preços quando veículo muda
  useEffect(() => {
    if (veiculoSelecionado) {
      buscarPrecos();
    } else {
      setPrecos([]);
    }
  }, [veiculoSelecionado]);

  const buscarMarcas = async () => {
    setEstadoMarcas({ status: 'loading' });
    setMarcaSelecionada('');
    
    try {
      const resultados = await fipeService.getMarcas(tipoVeiculo);
      setMarcas(resultados);
      setEstadoMarcas({ status: 'success' });
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
      setEstadoMarcas({ 
        status: 'error', 
        erro: 'Erro ao carregar marcas. Tente novamente.' 
      });
      setMarcas([]);
    }
  };

  const buscarVeiculos = async () => {
    if (!marcaSelecionada) return;
    
    setEstadoVeiculos({ status: 'loading' });
    setVeiculoSelecionado('');
    
    try {
      const resultados = await fipeService.getVeiculos(tipoVeiculo, marcaSelecionada);
      setVeiculos(resultados);
      setEstadoVeiculos({ status: 'success' });
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      setEstadoVeiculos({ 
        status: 'error', 
        erro: 'Erro ao carregar veículos. Tente novamente.' 
      });
      setVeiculos([]);
    }
  };

  const buscarPrecos = async () => {
    if (!veiculoSelecionado || !marcaSelecionada) return;
    
    setEstadoPrecos({ status: 'loading' });
    
    try {
      console.log('Buscando preços FIPE reais para:', { 
        tipo: tipoVeiculo, 
        marca: marcaSelecionada, 
        modelo: veiculoSelecionado 
      });
      
      const response = await fetch('/api/fipe/precos-reais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipoVeiculo: tipoVeiculo,
          codigoMarca: marcaSelecionada,
          modeloNome: veiculoSelecionado
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na consulta FIPE');
      }

      const data = await response.json();
      
      if (data.success && data.precos?.length > 0) {
        // Mapear dados da FIPE oficial para o formato esperado
        const precosFormatados = data.precos.map((preco: any) => ({
          valor: preco.Valor || 'N/A',
          marca: marcas.find(m => m.valor === marcaSelecionada)?.nome || '',
          modelo: data.modelo || veiculoSelecionado,
          anoModelo: parseInt(preco.AnoModelo) || 0,
          combustivel: preco.Combustivel || 'N/A',
          codigoFipe: preco.CodigoFipe || 'N/A',
          mesReferencia: preco.MesReferencia || 'N/A',
          tipoVeiculo: preco.TipoVeiculo || 1,
          siglaCombustivel: preco.SiglaCombustivel || 'N/A',
          dataConsulta: new Date().toLocaleString('pt-BR')
        }));
        
        setPrecos(precosFormatados);
        setEstadoPrecos({ status: 'success' });
        
        // Notificar componente pai com o primeiro preço (mais recente)
        if (onVeiculoSelecionado && precosFormatados.length > 0) {
          const precoMaisRecente = precosFormatados[0];
          const marcaNome = marcas.find(m => m.valor === marcaSelecionada)?.nome || '';
          
          onVeiculoSelecionado({
            marca: marcaNome,
            modelo: precoMaisRecente.modelo,
            preco: precoMaisRecente.valor,
            ano: precoMaisRecente.anoModelo,
            combustivel: precoMaisRecente.combustivel
          });
        }
      } else {
        throw new Error('Nenhum preço encontrado para este veículo');
      }
      
    } catch (error) {
      console.error('Erro ao buscar preços FIPE:', error);
      setEstadoPrecos({ 
        status: 'error', 
        erro: error instanceof Error ? error.message : 'Erro ao carregar preços. Tente novamente.' 
      });
      setPrecos([]);
    }
  };

  const formatarValor = (valor: string): string => {
    return fipeService.formatarValor(valor);
  };

  const resetarConsulta = () => {
    setTipoVeiculo('carros');
    setMarcaSelecionada('');
    setVeiculoSelecionado('');
    setVeiculos([]);
    setPrecos([]);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Consulta FIPE</h3>
        </div>
        <button
          onClick={resetarConsulta}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Limpar consulta
        </button>
      </div>

      <div className="space-y-6">
        {/* Tipo de Veículo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Veículo
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['carros', 'motos', 'caminhoes'] as TipoVeiculo[]).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setTipoVeiculo(tipo)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  tipoVeiculo === tipo
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-center">
                  <Car className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium capitalize">{tipo}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca
          </label>
          <div className="relative">
            <select
              value={marcaSelecionada}
              onChange={(e) => setMarcaSelecionada(e.target.value)}
              disabled={estadoMarcas.status === 'loading'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            >
              <option value="">Selecione uma marca</option>
              {marcas.map((marca, index) => (
                <option key={`${marca.valor}-${index}`} value={marca.valor}>
                  {marca.nome}
                </option>
              ))}
            </select>
            {estadoMarcas.status === 'loading' && (
              <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
            )}
          </div>
          {estadoMarcas.status === 'error' && (
            <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {estadoMarcas.erro}
            </div>
          )}
        </div>

        {/* Veículo */}
        {marcaSelecionada && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo
            </label>
            <div className="relative">
              <select
                value={veiculoSelecionado}
                onChange={(e) => setVeiculoSelecionado(e.target.value)}
                disabled={estadoVeiculos.status === 'loading'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              >
                <option value="">Selecione um modelo</option>
                {veiculos.map((veiculo, index) => (
                  <option key={`${veiculo.modelo}-${index}`} value={veiculo.modelo}>
                    {veiculo.modelo}
                  </option>
                ))}
              </select>
              {estadoVeiculos.status === 'loading' && (
                <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />
              )}
            </div>
            {estadoVeiculos.status === 'error' && (
              <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {estadoVeiculos.erro}
              </div>
            )}
          </div>
        )}

        {/* Resultados */}
        {veiculoSelecionado && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Informações do Veículo
            </h4>
            
            {estadoPrecos.status === 'loading' && (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Buscando preços...</span>
              </div>
            )}
            
            {estadoPrecos.status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Erro ao buscar preços</span>
                </div>
                <p className="text-red-600 text-sm mt-1">{estadoPrecos.erro}</p>
              </div>
            )}
            
            {estadoPrecos.status === 'success' && precos.length > 0 && (
              <div className="space-y-4">
                {precos.map((preco, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Car className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{preco.modelo}</span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Ano: {preco.anoModelo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Fuel className="w-4 h-4" />
                            <span>Combustível: {preco.combustivel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            <span>Código FIPE: {preco.codigoFipe}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {formatarValor(preco.valor)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Ref: {preco.mesReferencia}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Fonte: FIPE
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
