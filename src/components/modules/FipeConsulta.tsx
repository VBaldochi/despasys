'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  TruckIcon, 
  CalendarDaysIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';
import { fipeService, TipoVeiculo, MarcaFipe, VeiculoFipe, PrecoFipe } from '@/lib/brasilapi/fipe';

interface FipeConsultaProps {
  onResultado?: (resultado: PrecoFipe[]) => void;
}

export default function FipeConsulta({ onResultado }: FipeConsultaProps) {
  const [tipoVeiculo, setTipoVeiculo] = useState<TipoVeiculo>('carros');
  const [marcas, setMarcas] = useState<MarcaFipe[]>([]);
  const [veiculos, setVeiculos] = useState<VeiculoFipe[]>([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [veiculoSelecionado, setVeiculoSelecionado] = useState('');
  const [resultado, setResultado] = useState<PrecoFipe[] | null>(null);
  const [loading, setLoading] = useState({
    marcas: false,
    veiculos: false,
    preco: false
  });
  const [error, setError] = useState<string | null>(null);

  // Carregar marcas quando tipo de veículo muda
  useEffect(() => {
    async function carregarMarcas() {
      if (!tipoVeiculo) return;
      
      setLoading(prev => ({ ...prev, marcas: true }));
      setError(null);
      setMarcaSelecionada('');
      setVeiculoSelecionado('');
      setVeiculos([]);
      setResultado(null);
      
      try {
        const marcasData = await fipeService.getMarcas(tipoVeiculo);
        setMarcas(marcasData);
      } catch (err) {
        setError('Erro ao carregar marcas. Tente novamente.');
        console.error('Erro ao carregar marcas:', err);
      } finally {
        setLoading(prev => ({ ...prev, marcas: false }));
      }
    }

    carregarMarcas();
  }, [tipoVeiculo]);

  // Carregar veículos quando marca é selecionada
  useEffect(() => {
    async function carregarVeiculos() {
      if (!marcaSelecionada) return;
      
      setLoading(prev => ({ ...prev, veiculos: true }));
      setError(null);
      setVeiculoSelecionado('');
      setResultado(null);
      
      try {
        const veiculosData = await fipeService.getVeiculos(tipoVeiculo, marcaSelecionada);
        setVeiculos(veiculosData);
      } catch (err) {
        setError('Erro ao carregar veículos. Tente novamente.');
        console.error('Erro ao carregar veículos:', err);
      } finally {
        setLoading(prev => ({ ...prev, veiculos: false }));
      }
    }

    carregarVeiculos();
  }, [marcaSelecionada, tipoVeiculo]);

  // Consultar preço quando veículo é selecionado
  const consultarPreco = async () => {
    if (!veiculoSelecionado) return;
    
    const veiculo = veiculos.find(v => v.modelo === veiculoSelecionado);
    if (!veiculo) return;
    
    setLoading(prev => ({ ...prev, preco: true }));
    setError(null);
    
    try {
      const precoData = await fipeService.getPreco(veiculoSelecionado);
      setResultado(precoData);
      onResultado?.(precoData);
    } catch (err) {
      setError('Erro ao consultar preço. Tente novamente.');
      console.error('Erro ao consultar preço:', err);
    } finally {
      setLoading(prev => ({ ...prev, preco: false }));
    }
  };

  const tiposVeiculo = [
    { value: 'carros', label: 'Automóveis', icon: '🚗' },
    { value: 'motos', label: 'Motocicletas', icon: '🏍️' },
    { value: 'caminhoes', label: 'Caminhões', icon: '🚛' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <TruckIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consulta FIPE</h2>
          <p className="text-gray-600">Consulte o preço de mercado do seu veículo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Tipo de Veículo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Veículo
          </label>
          <select
            value={tipoVeiculo}
            onChange={(e) => setTipoVeiculo(e.target.value as TipoVeiculo)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tiposVeiculo.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.icon} {tipo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca
          </label>
          <select
            value={marcaSelecionada}
            onChange={(e) => setMarcaSelecionada(e.target.value)}
            disabled={loading.marcas || marcas.length === 0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.marcas ? 'Carregando...' : 'Selecione a marca'}
            </option>
            {marcas.map((marca) => (
              <option key={marca.valor} value={marca.valor}>
                {marca.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelo
          </label>
          <select
            value={veiculoSelecionado}
            onChange={(e) => setVeiculoSelecionado(e.target.value)}
            disabled={loading.veiculos || veiculos.length === 0 || !marcaSelecionada}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">
              {loading.veiculos ? 'Carregando...' : 'Selecione o modelo'}
            </option>
            {veiculos.map((veiculo) => (
              <option key={veiculo.valor} value={veiculo.valor}>
                {veiculo.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Botão Consultar */}
        <div className="flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={consultarPreco}
            disabled={!veiculoSelecionado || loading.preco}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading.preco ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <MagnifyingGlassIcon className="h-4 w-4" />
            )}
            {loading.preco ? 'Consultando...' : 'Consultar'}
          </motion.button>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4"
        >
          {error}
        </motion.div>
      )}

      {/* Resultado */}
      {resultado && resultado.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
            Resultado da Consulta FIPE
          </h3>
          
          {resultado.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Marca/Modelo</p>
                  <p className="font-semibold text-gray-900">{item.marca}</p>
                  <p className="text-sm text-gray-700">{item.modelo}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Valor FIPE</p>
                  <p className="text-2xl font-bold text-green-600">
                    {fipeService.formatarValor(item.valor)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Ano Modelo</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {item.anoModelo}
                  </p>
                  <p className="text-sm text-gray-600">{item.combustivel}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Código FIPE</p>
                  <p className="font-mono text-sm text-gray-700">{item.codigoFipe}</p>
                  <p className="text-xs text-gray-500">{item.mesReferencia}</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Consulta realizada em: {new Date(item.dataConsulta).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
          
          <div className="mt-4 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <strong>💡 Importante:</strong> Os valores FIPE são uma referência de mercado e podem variar conforme o estado de conservação, quilometragem e região do veículo.
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Componente auxiliar para exibir apenas o resultado
export function FipeResultado({ resultado }: { resultado: PrecoFipe[] }) {
  if (!resultado || resultado.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="font-semibold text-gray-900 mb-2">Valor FIPE</h4>
      {resultado.map((item, index) => (
        <div key={index} className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {fipeService.formatarValor(item.valor)}
          </p>
          <p className="text-sm text-gray-600">{item.marca} {item.modelo}</p>
          <p className="text-xs text-gray-500">Ref: {item.mesReferencia}</p>
        </div>
      ))}
    </div>
  );
}
