'use client';

import React, { useState } from 'react';
import { X, Car, Plus, Check } from 'lucide-react';
import ConsultaFipe from './ConsultaFipe';

interface ModalConsultaVeiculoProps {
  isOpen: boolean;
  onClose: () => void;
  onVeiculoAdicionado?: (veiculo: {
    marca: string;
    modelo: string;
    preco: string;
    ano: number;
    combustivel: string;
  }) => void;
  titulo?: string;
}

export default function ModalConsultaVeiculo({
  isOpen,
  onClose,
  onVeiculoAdicionado,
  titulo = "Consultar Veículo FIPE"
}: ModalConsultaVeiculoProps) {
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<any>(null);

  const handleVeiculoSelecionado = (dados: any) => {
    setVeiculoSelecionado(dados);
  };

  const handleAdicionarVeiculo = () => {
    if (veiculoSelecionado && onVeiculoAdicionado) {
      onVeiculoAdicionado(veiculoSelecionado);
      setVeiculoSelecionado(null);
      onClose();
    }
  };

  const handleClose = () => {
    setVeiculoSelecionado(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{titulo}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <ConsultaFipe
            onVeiculoSelecionado={handleVeiculoSelecionado}
            className="border-0 shadow-none p-0"
          />

          {/* Veículo Selecionado */}
          {veiculoSelecionado && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Veículo Selecionado
              </h4>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Marca:</strong> {veiculoSelecionado.marca}</p>
                <p><strong>Modelo:</strong> {veiculoSelecionado.modelo}</p>
                <p><strong>Ano:</strong> {veiculoSelecionado.ano}</p>
                <p><strong>Combustível:</strong> {veiculoSelecionado.combustivel}</p>
                <p><strong>Valor FIPE:</strong> {veiculoSelecionado.preco}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          {veiculoSelecionado && (
            <button
              onClick={handleAdicionarVeiculo}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Veículo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
