import { api } from './api';
import type { Cliente, ClienteInput } from '../types/veiculos';

export class ClientesService {
  static async listarClientes(): Promise<Cliente[]> {
    try {
      const response = await api.get('/api/mobile/clientes');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  }

  static async buscarCliente(id: string): Promise<Cliente> {
    try {
      const response = await api.get(`/api/mobile/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  static async criarCliente(cliente: ClienteInput): Promise<Cliente> {
    try {
      const response = await api.post('/api/mobile/clientes', cliente);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  static async atualizarCliente(id: string, updates: Partial<ClienteInput>): Promise<Cliente> {
    try {
      const response = await api.put(`/api/mobile/clientes/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  static async removerCliente(id: string): Promise<void> {
    try {
      await api.delete(`/api/mobile/clientes/${id}`);
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      throw error;
    }
  }

  static async buscarPorCPF(cpf: string): Promise<Cliente | null> {
    try {
      const response = await api.get(`/api/mobile/clientes/buscar?cpf=${cpf}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Erro ao buscar por CPF:', error);
      throw error;
    }
  }

  static async buscarPorNome(nome: string): Promise<Cliente[]> {
    try {
      const response = await api.get(`/api/mobile/clientes/buscar?nome=${nome}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar por nome:', error);
      throw error;
    }
  }

  static async listarVeiculosCliente(clienteId: string): Promise<any[]> {
    try {
      const response = await api.get(`/api/mobile/clientes/${clienteId}/veiculos`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar veículos do cliente:', error);
      throw error;
    }
  }
}
