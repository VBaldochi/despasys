// Serviços de integração com CNPJ da BrasilAPI
// Útil para validação de dados empresariais e busca de informações

import { EmpresaCnpj } from './types';

export interface CnpjValidacao {
  valido: boolean;
  formatado: string;
  digitos: string;
}

class CnpjService {
  /**
   * Busca dados completos da empresa por CNPJ
   */
  async buscarEmpresa(cnpj: string): Promise<EmpresaCnpj> {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) {
      throw new Error('CNPJ deve ter 14 dígitos');
    }

    try {
      const response = await fetch(`/api/cnpj?cnpj=${cnpjLimpo}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar CNPJ');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('CNPJ não encontrado');
      }

      return data.empresa;
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);
      throw error;
    }
  }

  /**
   * Valida CNPJ usando algoritmo oficial
   */
  validarCnpj(cnpj: string): boolean {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;
    
    // Calcula primeiro dígito verificador
    let soma = 0;
    let peso = 5;
    
    for (let i = 0; i < 12; i++) {
      soma += parseInt(cnpjLimpo[i]) * peso;
      peso = peso === 2 ? 9 : peso - 1;
    }
    
    let digito1 = soma % 11;
    digito1 = digito1 < 2 ? 0 : 11 - digito1;
    
    if (parseInt(cnpjLimpo[12]) !== digito1) return false;
    
    // Calcula segundo dígito verificador
    soma = 0;
    peso = 6;
    
    for (let i = 0; i < 13; i++) {
      soma += parseInt(cnpjLimpo[i]) * peso;
      peso = peso === 2 ? 9 : peso - 1;
    }
    
    let digito2 = soma % 11;
    digito2 = digito2 < 2 ? 0 : 11 - digito2;
    
    return parseInt(cnpjLimpo[13]) === digito2;
  }

  /**
   * Formata CNPJ para exibição
   */
  formatarCnpj(cnpj: string): string {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) return cnpj;
    
    return cnpjLimpo.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }
}

// Singleton instance
export const cnpjService = new CnpjService();
export default cnpjService;
