import { api } from './api';
import type { StatusVeiculo } from '../types/veiculos';

export interface Veiculo {
  id: string;
  placa: string;
  cliente: string;
  clienteId: string;
  servico: string;
  status: StatusVeiculo;
  prazo: string;
  valor: number;
  documentos: string[];
  telefone: string;
  createdAt: string;
  updatedAt: string;
}

export interface VeiculoInput {
  placa: string;
  clienteId: string;
  servico: string;
  prazo: string;
  valor: number;
  documentos: string[];
}

export class VeiculosService {
  static async listarVeiculos(filtros?: { status?: string; cliente?: string }): Promise<Veiculo[]> {
    try {
      const params = new URLSearchParams();
      if (filtros?.status) params.append('status', filtros.status);
      if (filtros?.cliente) params.append('cliente', filtros.cliente);
      
      const response = await api.get(`/api/mobile/veiculos?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar veículos:', error);
      throw error;
    }
  }

  static async buscarVeiculo(id: string): Promise<Veiculo> {
    try {
      const response = await api.get(`/api/mobile/veiculos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      throw error;
    }
  }

  static async criarVeiculo(veiculo: VeiculoInput): Promise<Veiculo> {
    try {
      const response = await api.post('/api/mobile/veiculos', veiculo);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw error;
    }
  }

  static async atualizarVeiculo(id: string, updates: Partial<VeiculoInput>): Promise<Veiculo> {
    try {
      const response = await api.put(`/api/mobile/veiculos/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar veículo:', error);
      throw error;
    }
  }

  static async atualizarStatus(id: string, status: StatusVeiculo): Promise<Veiculo> {
    try {
      const response = await api.patch(`/api/mobile/veiculos/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }

  static async removerVeiculo(id: string): Promise<void> {
    try {
      await api.delete(`/api/mobile/veiculos/${id}`);
    } catch (error) {
      console.error('Erro ao remover veículo:', error);
      throw error;
    }
  }

  static async buscarPorPlaca(placa: string): Promise<Veiculo[]> {
    try {
      const response = await api.get(`/api/mobile/veiculos/buscar?placa=${placa}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar por placa:', error);
      throw error;
    }
  }

  static async listarPorStatus(status: StatusVeiculo): Promise<Veiculo[]> {
    try {
      const response = await api.get(`/api/mobile/veiculos?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar por status:', error);
      throw error;
    }
  }

  static async obterEstatisticas(): Promise<{
    total: number;
    aguardando: number;
    andamento: number;
    finalizado: number;
    cancelado: number;
  }> {
    try {
      const response = await api.get('/api/mobile/veiculos/estatisticas');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
}
