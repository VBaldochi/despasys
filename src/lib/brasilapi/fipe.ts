// Serviços de integração com a API FIPE da BrasilAPI
// Essencial para consultoria veicular - consulta de preços de mercado

export interface MarcaFipe {
  nome: string;
  valor: string;
}

export interface VeiculoFipe {
  modelo: string;
  valor: string;
  nome: string;
}

export interface PrecoFipe {
  valor: string;
  marca: string;
  modelo: string;
  anoModelo: number;
  combustivel: string;
  codigoFipe: string;
  mesReferencia: string;
  tipoVeiculo: number;
  siglaCombustivel: string;
  dataConsulta: string;
}

export interface TabelaFipe {
  codigo: number;
  mes: string;
}

export type TipoVeiculo = 'carros' | 'motos' | 'caminhoes';

class FipeService {
  private readonly baseUrl = 'https://brasilapi.com.br/api/fipe';

  /**
   * Busca todas as marcas por tipo de veículo
   */
  async getMarcas(tipoVeiculo: TipoVeiculo, tabelaReferencia?: number): Promise<MarcaFipe[]> {
    try {
      const params = new URLSearchParams();
      if (tabelaReferencia) {
        params.append('tabela_referencia', tabelaReferencia.toString());
      }
      
      const url = `/api/fipe/marcas/${tipoVeiculo}${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao buscar marcas: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.marcas || [];
    } catch (error) {
      console.error('Erro na consulta de marcas FIPE:', error);
      throw new Error('Falha ao consultar marcas na tabela FIPE');
    }
  }

  /**
   * Busca veículos por marca e tipo
   */
  async getVeiculos(
    tipoVeiculo: TipoVeiculo, 
    codigoMarca: string, 
    tabelaReferencia?: number
  ): Promise<VeiculoFipe[]> {
    try {
      const params = new URLSearchParams();
      if (tabelaReferencia) {
        params.append('tabela_referencia', tabelaReferencia.toString());
      }
      
      const url = `/api/fipe/veiculo/${tipoVeiculo}/${codigoMarca}${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao buscar veículos: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data.veiculos) ? data.veiculos : [data.veiculos];
    } catch (error) {
      console.error('Erro na consulta de veículos FIPE:', error);
      throw new Error('Falha ao consultar veículos na tabela FIPE');
    }
  }

  /**
   * Consulta preço específico por código FIPE
   */
  async getPreco(codigoFipe: string, tabelaReferencia?: number): Promise<PrecoFipe[]> {
    try {
      const params = new URLSearchParams();
      if (tabelaReferencia) {
        params.append('tabela_referencia', tabelaReferencia.toString());
      }
      
      const url = `/api/fipe/preco/${codigoFipe}${params.toString() ? `?${params}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao buscar preço: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data.preco) ? data.preco : [data.preco];
    } catch (error) {
      console.error('Erro na consulta de preço FIPE:', error);
      throw new Error('Falha ao consultar preço na tabela FIPE');
    }
  }

  /**
   * Lista todas as tabelas de referência disponíveis
   */
  async getTabelas(): Promise<TabelaFipe[]> {
    try {
      const url = `/api/fipe/tabelas`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ao buscar tabelas: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.tabelas || [];
    } catch (error) {
      console.error('Erro na consulta de tabelas FIPE:', error);
      throw new Error('Falha ao consultar tabelas FIPE');
    }
  }

  /**
   * Busca completa: marca -> veículo -> preço
   * Útil para fluxos completos de consulta
   */
  async getBuscaCompleta(
    tipoVeiculo: TipoVeiculo,
    nomeMarca: string,
    nomeVeiculo: string
  ): Promise<{
    marca: MarcaFipe | null;
    veiculo: VeiculoFipe | null;
    preco: PrecoFipe[] | null;
  }> {
    try {
      // 1. Buscar marcas
      const marcas = await this.getMarcas(tipoVeiculo);
      const marca = marcas.find(m => 
        m.nome.toLowerCase().includes(nomeMarca.toLowerCase())
      );
      
      if (!marca) {
        return { marca: null, veiculo: null, preco: null };
      }

      // 2. Buscar veículos da marca
      const veiculos = await this.getVeiculos(tipoVeiculo, marca.valor);
      const veiculo = veiculos.find(v => 
        v.modelo.toLowerCase().includes(nomeVeiculo.toLowerCase())
      );
      
      if (!veiculo) {
        return { marca, veiculo: null, preco: null };
      }

      // 3. Buscar preço do veículo
      // Nota: A API Brasil não tem endpoint direto para preços por veículo específico
      // Esta funcionalidade requer implementação personalizada
      const preco = null; // await this.getPreco(veiculo.codigoFipe);
      
      return { marca, veiculo, preco };
      
    } catch (error) {
      console.error('Erro na busca completa FIPE:', error);
      throw new Error('Falha na consulta completa FIPE');
    }
  }

  /**
   * Formata valor monetário da FIPE
   */
  formatarValor(valor: string): string {
    // Remove "R$ " e formata para número
    const numeroLimpo = valor.replace(/[^\d,]/g, '').replace(',', '.');
    const numero = parseFloat(numeroLimpo);
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numero);
  }

  /**
   * Extrai apenas o valor numérico
   */
  extrairValorNumerico(valor: string): number {
    const numeroLimpo = valor.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(numeroLimpo) || 0;
  }
}

// Singleton instance
export const fipeService = new FipeService();

// Hook personalizado para React (se usando)
export function useFipe() {
  return {
    getMarcas: fipeService.getMarcas.bind(fipeService),
    getVeiculos: fipeService.getVeiculos.bind(fipeService),
    getPreco: fipeService.getPreco.bind(fipeService),
    getTabelas: fipeService.getTabelas.bind(fipeService),
    getBuscaCompleta: fipeService.getBuscaCompleta.bind(fipeService),
    formatarValor: fipeService.formatarValor.bind(fipeService),
    extrairValorNumerico: fipeService.extrairValorNumerico.bind(fipeService),
  };
}

// Utilitários adicionais
export const fipeUtils = {
  /**
   * Converte tipo de veículo para exibição
   */
  tipoVeiculoParaTexto(tipo: TipoVeiculo): string {
    const tipos = {
      carros: 'Automóveis',
      motos: 'Motocicletas',
      caminhoes: 'Caminhões'
    };
    return tipos[tipo];
  },

  /**
   * Valida código FIPE
   */
  validarCodigoFipe(codigo: string): boolean {
    // Código FIPE geralmente tem formato XXX-XXX-XX
    const regex = /^\d{3}-\d{3}-\d{2}$/;
    return regex.test(codigo);
  },

  /**
   * Calcula depreciação baseada no ano
   */
  calcularDepreciacao(valorAtual: number, anoVeiculo: number): {
    valorEstimado: number;
    percentualDepreciacao: number;
  } {
    const anoAtual = new Date().getFullYear();
    const idadeVeiculo = anoAtual - anoVeiculo;
    
    // Estimativa simples: 10% ao ano (pode ser ajustada)
    const percentualDepreciacao = Math.min(idadeVeiculo * 0.1, 0.8); // Max 80%
    const valorEstimado = valorAtual * (1 - percentualDepreciacao);
    
    return {
      valorEstimado: Math.round(valorEstimado),
      percentualDepreciacao: Math.round(percentualDepreciacao * 100)
    };
  }
};
