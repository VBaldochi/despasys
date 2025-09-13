import { api } from './api';
import type { DashboardStats, Notificacao } from '../types/veiculos';

export class DashboardService {
  static async obterEstatisticas(): Promise<DashboardStats> {
    try {
      const response = await api.get('/api/mobile/dashboard');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  static async listarNotificacoes(limit = 10): Promise<Notificacao[]> {
    try {
      const response = await api.get(`/api/mobile/notificacoes?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      throw error;
    }
  }

  static async marcarNotificacaoLida(id: string): Promise<void> {
    try {
      await api.patch(`/api/mobile/notificacoes/${id}/lida`);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  static async marcarTodasNotificacoesLidas(): Promise<void> {
    try {
      await api.patch('/api/mobile/notificacoes/marcar-todas-lidas');
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw error;
    }
  }

  static async obterResumoFinanceiro(mes?: string): Promise<{
    faturamentoMes: number;
    faturamentoPrevisto: number;
    servicosConcluidos: number;
    servicosAndamento: number;
  }> {
    try {
      const params = mes ? `?mes=${mes}` : '';
      const response = await api.get(`/api/mobile/dashboard/financeiro${params}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter resumo financeiro:', error);
      throw error;
    }
  }

  static async obterGraficoServicosPorStatus(): Promise<{
    labels: string[];
    data: number[];
  }> {
    try {
      const response = await api.get('/api/mobile/dashboard/servicos-status');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter gráfico de serviços:', error);
      throw error;
    }
  }

  static async obterAtividadesRecentes(limit = 5): Promise<{
    id: string;
    tipo: 'veiculo_criado' | 'veiculo_atualizado' | 'cliente_criado' | 'debito_consultado';
    titulo: string;
    descricao: string;
    timestamp: string;
    veiculoId?: string;
    clienteId?: string;
  }[]> {
    try {
      const response = await api.get(`/api/mobile/dashboard/atividades?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter atividades recentes:', error);
      throw error;
    }
  }
}
