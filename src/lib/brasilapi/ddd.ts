// Serviços de DDD e validação de telefones
// Útil para validação e formatação de números de telefone brasileiros

export interface InfoDDD {
  ddd: string;
  estado: string;
  cidades: string[];
  regiao: string;
}

export interface TelefoneInfo {
  numero: string;
  ddd: string;
  tipo: 'fixo' | 'celular';
  estado: string;
  valido: boolean;
  formatado: string;
}

class DddService {
  private readonly baseUrl = 'https://brasilapi.com.br/api/ddd';

  /**
   * Busca informações de um DDD
   */
  async buscarDDD(ddd: string): Promise<InfoDDD> {
    const dddLimpo = ddd.replace(/\D/g, '');
    
    if (dddLimpo.length !== 2) {
      throw new Error('DDD deve ter 2 dígitos');
    }

    try {
      const response = await fetch(`/api/ddd?ddd=${dddLimpo}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar DDD');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('DDD não encontrado');
      }

      return data.ddd;
    } catch (error) {
      console.error('Erro ao buscar DDD:', error);
      throw error;
    }
  }

  /**
   * Valida e analisa um número de telefone brasileiro
   */
  async analisarTelefone(telefone: string): Promise<TelefoneInfo> {
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      throw new Error('Telefone deve ter 10 ou 11 dígitos');
    }

    const ddd = numeroLimpo.slice(0, 2);
    const numero = numeroLimpo.slice(2);
    const tipo = numeroLimpo.length === 11 ? 'celular' : 'fixo';

    try {
      const infoDdd = await this.buscarDDD(ddd);
      
      return {
        numero: numeroLimpo,
        ddd,
        tipo,
        estado: infoDdd.estado,
        valido: this.validarTelefone(numeroLimpo),
        formatado: this.formatarTelefone(numeroLimpo)
      };
    } catch (error) {
      return {
        numero: numeroLimpo,
        ddd,
        tipo,
        estado: 'Desconhecido',
        valido: this.validarTelefone(numeroLimpo),
        formatado: this.formatarTelefone(numeroLimpo)
      };
    }
  }

  /**
   * Valida formato de telefone
   */
  validarTelefone(telefone: string): boolean {
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // Deve ter 10 ou 11 dígitos
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      return false;
    }

    // DDD válido (11-99)
    const ddd = parseInt(numeroLimpo.slice(0, 2));
    if (ddd < 11 || ddd > 99) {
      return false;
    }

    // Primeiro dígito do número não pode ser 0 ou 1
    const primeiroDigito = parseInt(numeroLimpo[2]);
    if (primeiroDigito <= 1) {
      return false;
    }

    // Para celular (11 dígitos), deve começar com 9
    if (numeroLimpo.length === 11 && numeroLimpo[2] !== '9') {
      return false;
    }

    return true;
  }

  /**
   * Formata telefone para exibição
   */
  formatarTelefone(telefone: string): string {
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    if (numeroLimpo.length === 10) {
      // Telefone fixo: (00) 0000-0000
      return numeroLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (numeroLimpo.length === 11) {
      // Celular: (00) 90000-0000
      return numeroLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return telefone;
  }

  /**
   * Lista todos os DDDs e seus estados
   */
  listarDDDs(): { [ddd: string]: string } {
    return {
      '11': 'SP', '12': 'SP', '13': 'SP', '14': 'SP', '15': 'SP', '16': 'SP', '17': 'SP', '18': 'SP', '19': 'SP',
      '21': 'RJ', '22': 'RJ', '24': 'RJ',
      '27': 'ES', '28': 'ES',
      '31': 'MG', '32': 'MG', '33': 'MG', '34': 'MG', '35': 'MG', '37': 'MG', '38': 'MG',
      '41': 'PR', '42': 'PR', '43': 'PR', '44': 'PR', '45': 'PR', '46': 'PR',
      '47': 'SC', '48': 'SC', '49': 'SC',
      '51': 'RS', '53': 'RS', '54': 'RS', '55': 'RS',
      '61': 'DF', '62': 'GO', '64': 'GO',
      '63': 'TO',
      '65': 'MT', '66': 'MT',
      '67': 'MS',
      '68': 'AC',
      '69': 'RO',
      '71': 'BA', '73': 'BA', '74': 'BA', '75': 'BA', '77': 'BA',
      '79': 'SE',
      '81': 'PE', '87': 'PE',
      '82': 'AL',
      '83': 'PB',
      '84': 'RN',
      '85': 'CE', '88': 'CE',
      '86': 'PI', '89': 'PI',
      '91': 'PA', '93': 'PA', '94': 'PA',
      '92': 'AM', '97': 'AM',
      '95': 'RR',
      '96': 'AP',
      '98': 'MA', '99': 'MA'
    };
  }
}

// Singleton instance
export const dddService = new DddService();

// Hook personalizado para React
export function useDdd() {
  return {
    buscarDDD: dddService.buscarDDD.bind(dddService),
    analisarTelefone: dddService.analisarTelefone.bind(dddService),
    validarTelefone: dddService.validarTelefone.bind(dddService),
    formatarTelefone: dddService.formatarTelefone.bind(dddService),
    listarDDDs: dddService.listarDDDs.bind(dddService),
  };
}
