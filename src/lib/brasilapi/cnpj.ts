// Serviços de integração com CNPJ da BrasilAPI
// Essencial para validação de clientes empresariais

export interface EmpresaCnpj {
  cnpj: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia: string | null;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: number;
  nome_cidade_exterior: string | null;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string | null;
  telefone_1: string | null;
  ddd_telefone_2: string | null;
  telefone_2: string | null;
  ddd_fax: string | null;
  fax: string | null;
  correio_eletronico: string | null;
  qualificacao_do_responsavel: number;
  capital_social: number;
  porte: string;
  descricao_porte: string;
  opcao_pelo_simples: boolean;
  data_opcao_pelo_simples: string | null;
  data_exclusao_do_simples: string | null;
  opcao_pelo_mei: boolean;
  situacao_especial: string | null;
  data_situacao_especial: string | null;
  faturamento_presumido: number | null;
  cnaes_secundarios: Array<{
    codigo: number;
    descricao: string;
  }>;
  qsa: Array<{
    identificador_de_socio: number;
    nome_socio: string;
    cnpj_cpf_do_socio: string;
    codigo_qualificacao_socio: number;
    percentual_capital_social: number;
    data_entrada_sociedade: string;
    cpf_representante_legal: string | null;
    nome_representante_legal: string | null;
    codigo_qualificacao_representante_legal: number | null;
  }>;
}

class CnpjService {
  private readonly baseUrl = 'https://brasilapi.com.br/api/cnpj/v1';

  /**
   * Consulta dados da empresa por CNPJ
   */
  async consultarCnpj(cnpj: string): Promise<EmpresaCnpj> {
    const cnpjLimpo = this.limparCnpj(cnpj);
    
    if (!this.validarCnpj(cnpjLimpo)) {
      throw new Error('CNPJ inválido. Use o formato 12345678000123');
    }

    try {
      const response = await fetch(`${this.baseUrl}/${cnpjLimpo}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CNPJ não encontrado na Receita Federal');
        }
        throw new Error(`Erro ao consultar CNPJ: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro na consulta de CNPJ:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha ao consultar CNPJ');
    }
  }

  /**
   * Remove formatação do CNPJ
   */
  private limparCnpj(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  /**
   * Valida CNPJ usando algoritmo oficial
   */
  validarCnpj(cnpj: string): boolean {
    const cnpjLimpo = this.limparCnpj(cnpj);
    
    if (cnpjLimpo.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpjLimpo)) return false; // Todos os dígitos iguais
    
    // Calcular primeiro dígito verificador
    let soma = 0;
    let peso = 2;
    
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpjLimpo[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    
    const primeiroDigito = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (parseInt(cnpjLimpo[12]) !== primeiroDigito) return false;
    
    // Calcular segundo dígito verificador
    soma = 0;
    peso = 2;
    
    for (let i = 12; i >= 0; i--) {
      soma += parseInt(cnpjLimpo[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    
    const segundoDigito = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return parseInt(cnpjLimpo[13]) === segundoDigito;
  }

  /**
   * Formata CNPJ para exibição
   */
  formatarCnpj(cnpj: string): string {
    const cnpjLimpo = this.limparCnpj(cnpj);
    if (!this.validarCnpj(cnpjLimpo)) return cnpj;
    
    return cnpjLimpo.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }

  /**
   * Monta endereço completo da empresa
   */
  montarEnderecoCompleto(empresa: EmpresaCnpj): string {
    const partes = [
      empresa.descricao_tipo_logradouro && empresa.logradouro 
        ? `${empresa.descricao_tipo_logradouro} ${empresa.logradouro}`
        : empresa.logradouro,
      empresa.numero,
      empresa.complemento,
      empresa.bairro,
      empresa.municipio,
      empresa.uf,
      this.formatarCep(empresa.cep)
    ].filter(Boolean);
    
    return partes.join(', ');
  }

  /**
   * Formata CEP
   */
  private formatarCep(cep: string): string {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return cep;
    return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
  }

  /**
   * Verifica se a empresa está ativa
   */
  isEmpresaAtiva(empresa: EmpresaCnpj): boolean {
    return empresa.situacao_cadastral === 2; // 2 = ATIVA
  }

  /**
   * Verifica se a empresa é MEI
   */
  isEmpresaMEI(empresa: EmpresaCnpj): boolean {
    return empresa.opcao_pelo_mei;
  }

  /**
   * Verifica se a empresa é do Simples Nacional
   */
  isEmpresaSimples(empresa: EmpresaCnpj): boolean {
    return empresa.opcao_pelo_simples;
  }

  /**
   * Obter telefone principal formatado
   */
  obterTelefonePrincipal(empresa: EmpresaCnpj): string | null {
    if (!empresa.ddd_telefone_1 || !empresa.telefone_1) return null;
    
    const ddd = empresa.ddd_telefone_1;
    const telefone = empresa.telefone_1;
    
    // Formatar telefone baseado no tamanho
    if (telefone.length === 8) {
      return `(${ddd}) ${telefone.slice(0, 4)}-${telefone.slice(4)}`;
    } else if (telefone.length === 9) {
      return `(${ddd}) ${telefone.slice(0, 5)}-${telefone.slice(5)}`;
    }
    
    return `(${ddd}) ${telefone}`;
  }

  /**
   * Obter idade da empresa em anos
   */
  obterIdadeEmpresa(empresa: EmpresaCnpj): number {
    const dataInicio = new Date(empresa.data_inicio_atividade);
    const hoje = new Date();
    const diffTime = Math.abs(hoje.getTime() - dataInicio.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  }

  /**
   * Formatar capital social
   */
  formatarCapitalSocial(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  /**
   * Obter sócios principais (com maior participação)
   */
  obterSociosPrincipais(empresa: EmpresaCnpj, limite: number = 3): Array<{
    nome: string;
    participacao: number;
    cpfCnpj: string;
  }> {
    return empresa.qsa
      .sort((a, b) => b.percentual_capital_social - a.percentual_capital_social)
      .slice(0, limite)
      .map(socio => ({
        nome: socio.nome_socio,
        participacao: socio.percentual_capital_social,
        cpfCnpj: socio.cnpj_cpf_do_socio
      }));
  }
}

// Singleton instance
export const cnpjService = new CnpjService();

// Hook personalizado para React
export function useCnpj() {
  return {
    consultarCnpj: cnpjService.consultarCnpj.bind(cnpjService),
    validarCnpj: cnpjService.validarCnpj.bind(cnpjService),
    formatarCnpj: cnpjService.formatarCnpj.bind(cnpjService),
    montarEnderecoCompleto: cnpjService.montarEnderecoCompleto.bind(cnpjService),
    isEmpresaAtiva: cnpjService.isEmpresaAtiva.bind(cnpjService),
    isEmpresaMEI: cnpjService.isEmpresaMEI.bind(cnpjService),
    isEmpresaSimples: cnpjService.isEmpresaSimples.bind(cnpjService),
    obterTelefonePrincipal: cnpjService.obterTelefonePrincipal.bind(cnpjService),
    obterIdadeEmpresa: cnpjService.obterIdadeEmpresa.bind(cnpjService),
    formatarCapitalSocial: cnpjService.formatarCapitalSocial.bind(cnpjService),
    obterSociosPrincipais: cnpjService.obterSociosPrincipais.bind(cnpjService),
  };
}

// Utilitários CNPJ
export const cnpjUtils = {
  /**
   * Tipos de situação cadastral
   */
  situacoesCadastrais: {
    1: 'NULA',
    2: 'ATIVA',
    3: 'SUSPENSA',
    4: 'INAPTA',
    8: 'BAIXADA'
  },

  /**
   * Obter descrição da situação
   */
  obterSituacao(codigo: number): string {
    return this.situacoesCadastrais[codigo as keyof typeof this.situacoesCadastrais] || 'DESCONHECIDA';
  },

  /**
   * Obter cor da situação para UI
   */
  obterCorSituacao(codigo: number): string {
    const cores = {
      1: 'red',    // NULA
      2: 'green',  // ATIVA
      3: 'yellow', // SUSPENSA
      4: 'orange', // INAPTA
      8: 'red'     // BAIXADA
    };
    return cores[codigo as keyof typeof cores] || 'gray';
  },

  /**
   * Gerar resumo da empresa
   */
  gerarResumo(empresa: EmpresaCnpj): {
    nomeExibicao: string;
    situacao: string;
    corSituacao: string;
    endereco: string;
    telefone: string | null;
    idade: number;
    porte: string;
  } {
    return {
      nomeExibicao: empresa.nome_fantasia || empresa.razao_social,
      situacao: empresa.descricao_situacao_cadastral,
      corSituacao: this.obterCorSituacao(empresa.situacao_cadastral),
      endereco: cnpjService.montarEnderecoCompleto(empresa),
      telefone: cnpjService.obterTelefonePrincipal(empresa),
      idade: cnpjService.obterIdadeEmpresa(empresa),
      porte: empresa.descricao_porte
    };
  }
};
