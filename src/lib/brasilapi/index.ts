// Integração unificada com Brasil API - Todos os serviços essenciais
// Centraliza todos os serviços de dados brasileiros necessários para o sistema

import { cepService } from './cep';
import { cnpjService } from './cnpj';
import { cpfService, type CpfInfo, type CpfValidacao } from './cpf';
import { fipeService, type PrecoFipe, type MarcaFipe, type VeiculoFipe, type TipoVeiculo } from './fipe';
import { dddService } from './ddd';
import { bancoService } from './banco';
import { feriadoService } from './feriado';
import { ibgeService } from './ibge';
import { 
  type EnderecoCep, 
  type EmpresaCnpj 
} from './types';

// Tipos unificados para respostas
export interface ValidacaoCompleta {
  tipo: 'cep' | 'cpf' | 'cnpj';
  valido: boolean;
  formatado: string;
  dados?: any;
  erro?: string;
}

export interface ConsultaVeicular {
  marca: MarcaFipe | null;
  veiculo: VeiculoFipe | null;
  preco: PrecoFipe[] | null;
  valorFormatado?: string;
  valorNumerico?: number;
}

export interface DadosCliente {
  cpf?: CpfInfo;
  cnpj?: EmpresaCnpj;
  endereco?: EnderecoCep;
  valido: boolean;
  erros: string[];
}

class BrasilApiService {
  // Instâncias dos serviços
  public readonly cep = cepService;
  public readonly cnpj = cnpjService;
  public readonly cpf = cpfService;
  public readonly fipe = fipeService;
  public readonly ddd = dddService;
  public readonly banco = bancoService;
  public readonly feriado = feriadoService;
  public readonly ibge = ibgeService;

  /**
   * Validação unificada - detecta tipo automaticamente
   */
  async validarDado(valor: string): Promise<ValidacaoCompleta> {
    const valorLimpo = valor.replace(/\D/g, '');

    try {
      // Detecta tipo baseado no comprimento
      if (valorLimpo.length === 8) {
        // CEP
        try {
          const resultado = await this.cep.buscarCep(valor);
          return {
            tipo: 'cep',
            valido: true,
            formatado: this.cep.formatarCep(valor),
            dados: resultado
          };
        } catch (error) {
          return {
            tipo: 'cep',
            valido: false,
            formatado: this.cep.formatarCep(valor),
            erro: `Erro ao buscar CEP: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
          };
        }
      } else if (valorLimpo.length === 11) {
        // CPF
        const resultado = this.cpf.validar(valor);
        return {
          tipo: 'cpf',
          valido: resultado.valido,
          formatado: resultado.formatado,
          dados: resultado.valido ? this.cpf.obterInfo(valor) : null,
          erro: resultado.erro
        };
      } else if (valorLimpo.length === 14) {
        // CNPJ
        const valido = this.cnpj.validarCnpj(valor);
        const formatado = this.cnpj.formatarCnpj(valor);
        
        if (valido) {
          try {
            const empresa = await this.cnpj.buscarEmpresa(valor);
            return {
              tipo: 'cnpj',
              valido: true,
              formatado,
              dados: empresa
            };
          } catch (error) {
            return {
              tipo: 'cnpj',
              valido: false,
              formatado,
              erro: `Erro ao buscar dados da empresa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            };
          }
        } else {
          return {
            tipo: 'cnpj',
            valido: false,
            formatado,
            erro: 'CNPJ inválido'
          };
        }
      } else {
        return {
          tipo: 'cep', // default
          valido: false,
          formatado: valor,
          erro: 'Formato não reconhecido. Use CEP (8 dígitos), CPF (11 dígitos) ou CNPJ (14 dígitos)'
        };
      }
    } catch (error) {
      return {
        tipo: 'cep', // default
        valido: false,
        formatado: valor,
        erro: `Erro na validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Validação completa de dados do cliente
   */
  async validarCliente(dados: {
    cpf?: string;
    cnpj?: string;
    cep?: string;
  }): Promise<DadosCliente> {
    const resultado: DadosCliente = {
      valido: true,
      erros: []
    };

    try {
      // Validar CPF se fornecido
      if (dados.cpf) {
        const cpfValidacao = this.cpf.validar(dados.cpf);
        if (cpfValidacao.valido) {
          resultado.cpf = this.cpf.obterInfo(dados.cpf);
        } else {
          resultado.erros.push(`CPF: ${cpfValidacao.erro}`);
          resultado.valido = false;
        }
      }

      // Validar CNPJ se fornecido
      if (dados.cnpj) {
        const cnpjValido = this.cnpj.validarCnpj(dados.cnpj);
        if (cnpjValido) {
          try {
            const empresaInfo = await this.cnpj.buscarEmpresa(dados.cnpj);
            resultado.cnpj = empresaInfo;
          } catch (error) {
            resultado.erros.push(`CNPJ: Erro ao buscar dados da empresa`);
            resultado.valido = false;
          }
        } else {
          resultado.erros.push(`CNPJ: CNPJ inválido`);
          resultado.valido = false;
        }
      }

      // Validar CEP se fornecido
      if (dados.cep) {
        try {
          const cepInfo = await this.cep.buscarCep(dados.cep);
          // Mapear CepResponse para EnderecoCep
          const enderecoMapeado: EnderecoCep = {
            cep: cepInfo.cep,
            state: cepInfo.uf,
            city: cepInfo.cidade,
            neighborhood: cepInfo.bairro,
            street: cepInfo.logradouro,
            service: 'brasilapi'
          };
          resultado.endereco = enderecoMapeado;
        } catch (error) {
          resultado.erros.push(`CEP: Erro ao buscar endereço`);
          resultado.valido = false;
        }
      }

    } catch (error) {
      resultado.erros.push(`Erro na validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      resultado.valido = false;
    }

    return resultado;
  }

  /**
   * Consulta completa de veículo
   */
  async consultarVeiculo(
    tipoVeiculo: TipoVeiculo,
    marca: string,
    modelo: string
  ): Promise<ConsultaVeicular> {
    try {
      const resultado = await this.fipe.getBuscaCompleta(tipoVeiculo, marca, modelo);
      
      let valorFormatado: string | undefined;
      let valorNumerico: number | undefined;

      if (resultado.preco && resultado.preco.length > 0) {
        const primeiroPreco = resultado.preco[0];
        valorFormatado = this.fipe.formatarValor(primeiroPreco.valor);
        valorNumerico = this.fipe.extrairValorNumerico(primeiroPreco.valor);
      }

      return {
        ...resultado,
        valorFormatado,
        valorNumerico
      };
    } catch (error) {
      console.error('Erro na consulta veicular:', error);
      return {
        marca: null,
        veiculo: null,
        preco: null
      };
    }
  }

  /**
   * Autocompletar endereço baseado no CEP
   */
  async autocompletarEndereco(cep: string): Promise<{
    success: boolean;
    endereco?: {
      logradouro: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
    };
    erro?: string;
  }> {
    try {
      // Timeout de 8 segundos para evitar esperas muito longas
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const cepInfo = await this.cep.buscarCep(cep);
      clearTimeout(timeoutId);
      
      return {
        success: true,
        endereco: {
          logradouro: cepInfo.logradouro || '',
          bairro: cepInfo.bairro || '',
          cidade: cepInfo.cidade || '',
          estado: cepInfo.uf || '',
          cep: cepInfo.cep || ''
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return {
        success: false,
        erro: errorMessage.includes('abort') ? 
          'Serviço temporariamente indisponível. Tente novamente.' :
          `Erro ao buscar endereço: ${errorMessage}`
      };
    }
  }

  /**
   * Buscar dados da empresa por CNPJ
   */
  async buscarEmpresaPorCnpj(cnpj: string): Promise<{
    success: boolean;
    empresa?: EmpresaCnpj;
    erro?: string;
  }> {
    try {
      // Primeiro valida o CNPJ
      const valido = this.cnpj.validarCnpj(cnpj);
      if (!valido) {
        return {
          success: false,
          erro: 'CNPJ inválido'
        };
      }

      // Busca dados da empresa
      const empresa = await this.cnpj.buscarEmpresa(cnpj);
      return {
        success: true,
        empresa
      };
    } catch (error) {
      return {
        success: false,
        erro: `Erro ao buscar empresa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Formatadores unificados
   */
  formatadores = {
    cpf: (cpf: string) => this.cpf.formatarCpf(cpf),
    cnpj: (cnpj: string) => this.cnpj.formatarCnpj(cnpj),
    cep: (cep: string) => this.cep.formatarCep(cep),
    valor: (valor: string) => this.fipe.formatarValor(valor),
    
    // Limpar formatação
    limpar: (valor: string) => valor.replace(/\D/g, ''),
    
    // Detectar tipo de documento
    detectarTipo: (valor: string): 'cpf' | 'cnpj' | 'cep' | 'desconhecido' => {
      const limpo = valor.replace(/\D/g, '');
      if (limpo.length === 11) return 'cpf';
      if (limpo.length === 14) return 'cnpj';
      if (limpo.length === 8) return 'cep';
      return 'desconhecido';
    }
  };

  /**
   * Validadores rápidos (apenas boolean)
   */
  validadores = {
    cpf: (cpf: string) => this.cpf.validar(cpf).valido,
    cep: async (cep: string) => {
      try {
        await this.cep.buscarCep(cep);
        return true;
      } catch {
        return false;
      }
    },
    cnpj: (cnpj: string) => this.cnpj.validarCnpj(cnpj)
  };

  /**
   * Utilitários para formulários
   */
  formularios = {
    // Máscaras para inputs
    mascaraCpf: (valor: string) => this.cpf.formatarCpf(valor),
    mascaraCnpj: (valor: string) => this.cnpj.formatarCnpj(valor),
    mascaraCep: (valor: string) => this.cep.formatarCep(valor),
    
    // Validação em tempo real
    validarCpfTempoReal: (cpf: string) => this.cpf.validarEmTempoReal(cpf),
    
    // Auto-formatação baseada no tipo detectado
    autoFormatar: (valor: string): string => {
      const tipo = this.formatadores.detectarTipo(valor);
      switch (tipo) {
        case 'cpf': return this.formatadores.cpf(valor);
        case 'cnpj': return this.formatadores.cnpj(valor);
        case 'cep': return this.formatadores.cep(valor);
        default: return valor;
      }
    }
  };
}

// Singleton instance
export const brasilApi = new BrasilApiService();

// Hook para React
export function useBrasilApi() {
  return {
    // Serviços individuais
    cep: brasilApi.cep,
    cnpj: brasilApi.cnpj,
    cpf: brasilApi.cpf,
    fipe: brasilApi.fipe,
    ddd: brasilApi.ddd,
    banco: brasilApi.banco,
    feriado: brasilApi.feriado,
    ibge: brasilApi.ibge,
    
    // Serviços unificados
    validarDado: brasilApi.validarDado.bind(brasilApi),
    validarCliente: brasilApi.validarCliente.bind(brasilApi),
    consultarVeiculo: brasilApi.consultarVeiculo.bind(brasilApi),
    autocompletarEndereco: brasilApi.autocompletarEndereco.bind(brasilApi),
    buscarEmpresaPorCnpj: brasilApi.buscarEmpresaPorCnpj.bind(brasilApi),
    
    // Utilitários
    formatadores: brasilApi.formatadores,
    validadores: brasilApi.validadores,
    formularios: brasilApi.formularios
  };
}

// Exportar tipos principais
export type {
  CpfInfo,
  CpfValidacao,
  EnderecoCep,
  EmpresaCnpj,
  PrecoFipe,
  MarcaFipe,
  VeiculoFipe,
  TipoVeiculo
};

// Exportar serviços individuais também
export { cepService, cnpjService, cpfService, fipeService, dddService, bancoService, feriadoService, ibgeService };

// Utilitários globais
export const brasilApiUtils = {
  // Constantes úteis
  TIPOS_VEICULO: ['carros', 'motos', 'caminhoes'] as const,
  ESTADOS_BRASIL: [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ],
  
  // Validações combinadas
  validarDocumentoCompleto: async (documento: string): Promise<ValidacaoCompleta> => {
    return brasilApi.validarDado(documento);
  },
  
  // Formatação inteligente
  formatarDocumento: (documento: string): string => {
    return brasilApi.formularios.autoFormatar(documento);
  },
  
  // Verificar se valor é um documento brasileiro válido
  ehDocumentoBrasileiroValido: async (documento: string): Promise<boolean> => {
    const resultado = await brasilApi.validarDado(documento);
    return resultado.valido;
  }
};
