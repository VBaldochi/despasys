import { api } from './api';
import type { ConsultaDebitos, Debito } from '../types/veiculos';

export class DebitosService {
  static async listarDebitos(): Promise<Debito[]> {
    try {
      const response = await api.get('/api/mobile/debitos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar débitos:', error);
      throw error;
    }
  }

  static async consultarDebitos(placa: string): Promise<ConsultaDebitos> {
    try {
      const response = await api.get(`/api/mobile/debitos/consultar?placa=${placa}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar débitos:', error);
      throw error;
    }
  }

  static async consultarIPVA(placa: string): Promise<Debito[]> {
    try {
      const response = await api.get(`/api/mobile/debitos/ipva?placa=${placa}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar IPVA:', error);
      throw error;
    }
  }

  static async consultarMultas(placa: string): Promise<Debito[]> {
    try {
      const response = await api.get(`/api/mobile/debitos/multas?placa=${placa}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar multas:', error);
      throw error;
    }
  }

  static async consultarLicenciamento(placa: string): Promise<Debito[]> {
    try {
      const response = await api.get(`/api/mobile/debitos/licenciamento?placa=${placa}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao consultar licenciamento:', error);
      throw error;
    }
  }

  static async salvarConsulta(placa: string, debitos: Debito[]): Promise<void> {
    try {
      await api.post('/api/mobile/debitos/salvar', {
        placa,
        debitos,
        consultadoEm: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
      throw error;
    }
  }

  static async historico(): Promise<ConsultaDebitos[]> {
    try {
      const response = await api.get('/api/mobile/debitos/historico');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  }

  // Função para formatar placa (adicionar hífen se necessário)
  static formatarPlaca(placa: string): string {
    const cleaned = placa.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    if (cleaned.length === 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    }
    
    return cleaned;
  }

  // Função para validar formato da placa
  static validarPlaca(placa: string): boolean {
    const placaLimpa = placa.replace(/[^A-Za-z0-9]/g, '');
    
    // Formato antigo: ABC1234
    const formatoAntigo = /^[A-Za-z]{3}[0-9]{4}$/;
    
    // Formato Mercosul: ABC1D23
    const formatoMercosul = /^[A-Za-z]{3}[0-9]{1}[A-Za-z]{1}[0-9]{2}$/;
    
    return formatoAntigo.test(placaLimpa) || formatoMercosul.test(placaLimpa);
  }
}
