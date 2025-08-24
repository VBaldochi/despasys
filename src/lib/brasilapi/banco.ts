// Serviços de bancos e PIX
// Útil para validação de dados bancários e PIX

export interface BancoInfo {
  ispb: string;
  name: string;
  code: number;
  fullName: string;
}

export interface ParticipantePix {
  ispb: string;
  nome: string;
  nome_reduzido: string;
  modalidade_participacao: string;
  tipo_participacao: string;
  inicio_operacao: string;
}

export interface ChavePixInfo {
  tipo: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'chave_aleatoria';
  valida: boolean;
  formatada: string;
}

class BancoService {
  private readonly baseUrl = 'https://brasilapi.com.br/api/banks';

  /**
   * Lista todos os bancos brasileiros
   */
  async listarBancos(): Promise<BancoInfo[]> {
    try {
      const response = await fetch('/api/bancos');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar bancos');
      }

      const data = await response.json();
      return data.bancos || [];
    } catch (error) {
      console.error('Erro ao buscar bancos:', error);
      throw error;
    }
  }

  /**
   * Busca banco por código
   */
  async buscarBancoPorCodigo(codigo: string): Promise<BancoInfo> {
    try {
      const response = await fetch(`/api/bancos/${codigo}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Banco não encontrado');
      }

      const data = await response.json();
      return data.banco;
    } catch (error) {
      console.error('Erro ao buscar banco:', error);
      throw error;
    }
  }

  /**
   * Lista participantes do PIX
   */
  async listarParticipantesPix(): Promise<ParticipantePix[]> {
    try {
      const response = await fetch('/api/pix/participantes');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar participantes PIX');
      }

      const data = await response.json();
      return data.participantes || [];
    } catch (error) {
      console.error('Erro ao buscar participantes PIX:', error);
      throw error;
    }
  }

  /**
   * Valida formato de chave PIX
   */
  validarChavePix(chave: string): ChavePixInfo {
    const chaveLimpa = chave.trim();

    // CPF
    if (/^\d{11}$/.test(chaveLimpa.replace(/\D/g, '')) && chaveLimpa.replace(/\D/g, '').length === 11) {
      return {
        tipo: 'cpf',
        valida: this.validarCpf(chaveLimpa.replace(/\D/g, '')),
        formatada: this.formatarCpf(chaveLimpa.replace(/\D/g, ''))
      };
    }

    // CNPJ
    if (/^\d{14}$/.test(chaveLimpa.replace(/\D/g, '')) && chaveLimpa.replace(/\D/g, '').length === 14) {
      return {
        tipo: 'cnpj',
        valida: this.validarCnpj(chaveLimpa.replace(/\D/g, '')),
        formatada: this.formatarCnpj(chaveLimpa.replace(/\D/g, ''))
      };
    }

    // Email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chaveLimpa)) {
      return {
        tipo: 'email',
        valida: true,
        formatada: chaveLimpa.toLowerCase()
      };
    }

    // Telefone
    if (/^\+55\d{10,11}$/.test(chaveLimpa.replace(/\D/g, '+55'))) {
      const numeroLimpo = chaveLimpa.replace(/\D/g, '');
      if (numeroLimpo.length >= 12 && numeroLimpo.length <= 13) {
        return {
          tipo: 'telefone',
          valida: true,
          formatada: `+55${numeroLimpo.slice(-11)}`
        };
      }
    }

    // Chave aleatória (UUID)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chaveLimpa)) {
      return {
        tipo: 'chave_aleatoria',
        valida: true,
        formatada: chaveLimpa.toLowerCase()
      };
    }

    return {
      tipo: 'chave_aleatoria',
      valida: false,
      formatada: chaveLimpa
    };
  }

  /**
   * Valida CPF (algoritmo básico)
   */
  private validarCpf(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf[i]) * (10 - i);
    }
    
    let digito1 = soma % 11;
    digito1 = digito1 < 2 ? 0 : 11 - digito1;
    
    if (parseInt(cpf[9]) !== digito1) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf[i]) * (11 - i);
    }
    
    let digito2 = soma % 11;
    digito2 = digito2 < 2 ? 0 : 11 - digito2;
    
    return parseInt(cpf[10]) === digito2;
  }

  /**
   * Valida CNPJ (algoritmo básico)
   */
  private validarCnpj(cnpj: string): boolean {
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
    
    let soma = 0;
    let peso = 5;
    
    for (let i = 0; i < 12; i++) {
      soma += parseInt(cnpj[i]) * peso;
      peso = peso === 2 ? 9 : peso - 1;
    }
    
    let digito1 = soma % 11;
    digito1 = digito1 < 2 ? 0 : 11 - digito1;
    
    if (parseInt(cnpj[12]) !== digito1) return false;
    
    soma = 0;
    peso = 6;
    
    for (let i = 0; i < 13; i++) {
      soma += parseInt(cnpj[i]) * peso;
      peso = peso === 2 ? 9 : peso - 1;
    }
    
    let digito2 = soma % 11;
    digito2 = digito2 < 2 ? 0 : 11 - digito2;
    
    return parseInt(cnpj[13]) === digito2;
  }

  /**
   * Formata CPF
   */
  private formatarCpf(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Formata CNPJ
   */
  private formatarCnpj(cnpj: string): string {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  /**
   * Lista dos principais bancos brasileiros
   */
  getBancosPrincipais(): BancoInfo[] {
    return [
      { ispb: '00000000', name: 'Banco do Brasil', code: 1, fullName: 'Banco do Brasil S.A.' },
      { ispb: '00000208', name: 'BTG Pactual', code: 208, fullName: 'Banco BTG Pactual S.A.' },
      { ispb: '00000237', name: 'Bradesco', code: 237, fullName: 'Banco Bradesco S.A.' },
      { ispb: '00000341', name: 'Itaú', code: 341, fullName: 'Itaú Unibanco S.A.' },
      { ispb: '00000104', name: 'Caixa Econômica', code: 104, fullName: 'Caixa Econômica Federal' },
      { ispb: '00000260', name: 'Nu Pagamentos', code: 260, fullName: 'Nu Pagamentos S.A.' },
      { ispb: '00000212', name: 'Banco Original', code: 212, fullName: 'Banco Original S.A.' },
      { ispb: '00000290', name: 'PagSeguro', code: 290, fullName: 'PagSeguro Internet S.A.' },
      { ispb: '00000323', name: 'Mercado Pago', code: 323, fullName: 'Mercado Pago S.A.' },
      { ispb: '00000077', name: 'Banco Inter', code: 77, fullName: 'Banco Inter S.A.' }
    ];
  }
}

// Singleton instance
export const bancoService = new BancoService();

// Hook personalizado para React
export function useBanco() {
  return {
    listarBancos: bancoService.listarBancos.bind(bancoService),
    buscarBancoPorCodigo: bancoService.buscarBancoPorCodigo.bind(bancoService),
    listarParticipantesPix: bancoService.listarParticipantesPix.bind(bancoService),
    validarChavePix: bancoService.validarChavePix.bind(bancoService),
    getBancosPrincipais: bancoService.getBancosPrincipais.bind(bancoService),
  };
}
