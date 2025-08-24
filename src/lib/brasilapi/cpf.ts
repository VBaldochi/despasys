// Serviços de validação e formatação de CPF
// Essencial para validação de dados de clientes

export interface CpfValidacao {
  valido: boolean;
  formatado: string;
  limpo: string;
  erro?: string;
}

export interface CpfInfo {
  cpf: string;
  valido: boolean;
  formatado: string;
  estado?: string;
  regiao?: string;
  digito1: number;
  digito2: number;
}

class CpfService {
  /**
   * Valida CPF usando algoritmo oficial
   */
  validar(cpf: string): CpfValidacao {
    const cpfLimpo = this.limparCpf(cpf);
    
    // Validações básicas
    if (!cpfLimpo) {
      return {
        valido: false,
        formatado: '',
        limpo: '',
        erro: 'CPF não informado'
      };
    }

    if (cpfLimpo.length !== 11) {
      return {
        valido: false,
        formatado: cpf,
        limpo: cpfLimpo,
        erro: 'CPF deve ter 11 dígitos'
      };
    }

    // Verifica se todos os dígitos são iguais
    if (this.todosDigitosIguais(cpfLimpo)) {
      return {
        valido: false,
        formatado: this.formatarCpf(cpfLimpo),
        limpo: cpfLimpo,
        erro: 'CPF inválido: todos os dígitos são iguais'
      };
    }

    // Validação dos dígitos verificadores
    const valido = this.calcularDigitoVerificador(cpfLimpo);
    
    return {
      valido,
      formatado: this.formatarCpf(cpfLimpo),
      limpo: cpfLimpo,
      erro: valido ? undefined : 'CPF inválido: dígitos verificadores incorretos'
    };
  }

  /**
   * Formata CPF para exibição (000.000.000-00)
   */
  formatarCpf(cpf: string): string {
    const cpfLimpo = this.limparCpf(cpf);
    
    if (cpfLimpo.length !== 11) {
      return cpf; // Retorna como recebido se inválido
    }

    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Remove formatação do CPF
   */
  limparCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  /**
   * Gera CPF válido para testes (NUNCA usar em produção real)
   */
  gerarCpfTeste(): string {
    // Gera os 9 primeiros dígitos
    const primeiros9 = Array.from({length: 9}, () => 
      Math.floor(Math.random() * 10)
    );

    // Calcula os dígitos verificadores
    const cpfParcial = primeiros9.join('');
    const digito1 = this.calcularPrimeiroDigito(cpfParcial);
    const digito2 = this.calcularSegundoDigito(cpfParcial + digito1);

    const cpfCompleto = cpfParcial + digito1 + digito2;
    return this.formatarCpf(cpfCompleto);
  }

  /**
   * Obtém informações detalhadas do CPF
   */
  obterInfo(cpf: string): CpfInfo {
    const validacao = this.validar(cpf);
    const cpfLimpo = validacao.limpo;

    if (!validacao.valido) {
      return {
        cpf: validacao.formatado,
        valido: false,
        formatado: validacao.formatado,
        digito1: 0,
        digito2: 0
      };
    }

    // Determina estado baseado no 9º dígito (região fiscal)
    const estadoInfo = this.obterEstadoPorDigito(parseInt(cpfLimpo[8]));

    return {
      cpf: cpfLimpo,
      valido: true,
      formatado: validacao.formatado,
      estado: estadoInfo.estado,
      regiao: estadoInfo.regiao,
      digito1: parseInt(cpfLimpo[9]),
      digito2: parseInt(cpfLimpo[10])
    };
  }

  /**
   * Verifica se todos os dígitos são iguais
   */
  private todosDigitosIguais(cpf: string): boolean {
    return cpf.split('').every(digito => digito === cpf[0]);
  }

  /**
   * Calcula e verifica os dígitos verificadores
   */
  private calcularDigitoVerificador(cpf: string): boolean {
    const primeiros9 = cpf.substring(0, 9);
    const digito1Calculado = this.calcularPrimeiroDigito(primeiros9);
    const digito2Calculado = this.calcularSegundoDigito(primeiros9 + digito1Calculado);

    const digito1Informado = parseInt(cpf[9]);
    const digito2Informado = parseInt(cpf[10]);

    return digito1Calculado === digito1Informado && digito2Calculado === digito2Informado;
  }

  /**
   * Calcula o primeiro dígito verificador
   */
  private calcularPrimeiroDigito(primeiros9: string): number {
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(primeiros9[i]) * (10 - i);
    }
    
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }

  /**
   * Calcula o segundo dígito verificador
   */
  private calcularSegundoDigito(primeiros10: string): number {
    let soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(primeiros10[i]) * (11 - i);
    }
    
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  }

  /**
   * Determina estado baseado no dígito da região fiscal
   */
  private obterEstadoPorDigito(digito: number): { estado: string; regiao: string } {
    const regioes = {
      0: { estado: 'RS', regiao: 'Rio Grande do Sul' },
      1: { estado: 'DF/GO/MS/TO', regiao: 'Distrito Federal, Goiás, Mato Grosso do Sul, Tocantins' },
      2: { estado: 'AC/AM/AP/PA/RO/RR', regiao: 'Acre, Amazonas, Amapá, Pará, Rondônia, Roraima' },
      3: { estado: 'CE/MA/PI', regiao: 'Ceará, Maranhão, Piauí' },
      4: { estado: 'AL/PB/PE/RN', regiao: 'Alagoas, Paraíba, Pernambuco, Rio Grande do Norte' },
      5: { estado: 'BA/SE', regiao: 'Bahia, Sergipe' },
      6: { estado: 'MG', regiao: 'Minas Gerais' },
      7: { estado: 'ES/RJ', regiao: 'Espírito Santo, Rio de Janeiro' },
      8: { estado: 'SP', regiao: 'São Paulo' },
      9: { estado: 'PR/SC', regiao: 'Paraná, Santa Catarina' }
    };

    return regioes[digito as keyof typeof regioes] || { estado: 'Desconhecido', regiao: 'Região não identificada' };
  }

  /**
   * Validação em tempo real para formulários
   */
  validarEmTempoReal(cpf: string): {
    status: 'vazio' | 'incompleto' | 'invalido' | 'valido';
    mensagem: string;
    formatado: string;
  } {
    const cpfLimpo = this.limparCpf(cpf);

    if (!cpfLimpo) {
      return {
        status: 'vazio',
        mensagem: 'Digite o CPF',
        formatado: ''
      };
    }

    if (cpfLimpo.length < 11) {
      return {
        status: 'incompleto',
        mensagem: `${cpfLimpo.length}/11 dígitos`,
        formatado: this.formatarCpf(cpfLimpo)
      };
    }

    const validacao = this.validar(cpfLimpo);
    
    return {
      status: validacao.valido ? 'valido' : 'invalido',
      mensagem: validacao.valido ? 'CPF válido' : (validacao.erro || 'CPF inválido'),
      formatado: validacao.formatado
    };
  }
}

// Singleton instance
export const cpfService = new CpfService();

// Hook para React
export function useCpf() {
  return {
    validar: cpfService.validar.bind(cpfService),
    formatarCpf: cpfService.formatarCpf.bind(cpfService),
    limparCpf: cpfService.limparCpf.bind(cpfService),
    obterInfo: cpfService.obterInfo.bind(cpfService),
    validarEmTempoReal: cpfService.validarEmTempoReal.bind(cpfService),
    gerarCpfTeste: cpfService.gerarCpfTeste.bind(cpfService)
  };
}

// Utilitários adicionais
export const cpfUtils = {
  /**
   * Máscara para input de CPF
   */
  aplicarMascara(valor: string): string {
    return cpfService.formatarCpf(valor);
  },

  /**
   * Validação rápida (apenas boolean)
   */
  ehValido(cpf: string): boolean {
    return cpfService.validar(cpf).valido;
  },

  /**
   * Lista de CPFs inválidos conhecidos
   */
  cpfsInvalidosConhecidos: [
    '00000000000', '11111111111', '22222222222', '33333333333',
    '44444444444', '55555555555', '66666666666', '77777777777',
    '88888888888', '99999999999', '12345678909', '11144477735'
  ],

  /**
   * Verifica se é um CPF de teste/inválido conhecido
   */
  ehCpfTeste(cpf: string): boolean {
    const cpfLimpo = cpfService.limparCpf(cpf);
    return this.cpfsInvalidosConhecidos.includes(cpfLimpo);
  }
};
