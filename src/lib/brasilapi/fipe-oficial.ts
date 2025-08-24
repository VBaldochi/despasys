// Integração direta com a API FIPE oficial (paralipipedon.com.br)
// Esta é uma alternativa à Brasil API para obter preços reais

export interface FipeOficialMarca {
  Label: string;
  Value: string;
}

export interface FipeOficialVeiculo {
  Label: string;
  Value: string;
}

export interface FipeOficialPreco {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

class FipeOficialService {
  private readonly baseUrl = 'https://parallelum.com.br/fipe/api/v1';

  /**
   * Converte tipo de veículo para código da API oficial
   */
  private getTipoVeiculoCodigo(tipo: 'carros' | 'motos' | 'caminhoes'): string {
    const tipos = {
      carros: '1',
      motos: '2', 
      caminhoes: '3'
    };
    return tipos[tipo];
  }

  /**
   * Busca marcas da API FIPE oficial
   */
  async getMarcas(tipoVeiculo: 'carros' | 'motos' | 'caminhoes'): Promise<FipeOficialMarca[]> {
    try {
      const tipoCodigo = this.getTipoVeiculoCodigo(tipoVeiculo);
      const response = await fetch(`${this.baseUrl}/${tipoVeiculo}/marcas`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar marcas: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API FIPE oficial - marcas:', error);
      throw new Error('Falha ao consultar marcas FIPE');
    }
  }

  /**
   * Busca modelos/veículos da API FIPE oficial
   */
  async getModelos(tipoVeiculo: 'carros' | 'motos' | 'caminhoes', codigoMarca: string): Promise<{
    anos: { codigo: string; nome: string }[];
    modelos: FipeOficialVeiculo[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${tipoVeiculo}/marcas/${codigoMarca}/modelos`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar modelos: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        anos: data.anos || [],
        modelos: data.modelos || []
      };
    } catch (error) {
      console.error('Erro na API FIPE oficial - modelos:', error);
      throw new Error('Falha ao consultar modelos FIPE');
    }
  }

  /**
   * Busca anos disponíveis para um modelo
   */
  async getAnos(tipoVeiculo: 'carros' | 'motos' | 'caminhoes', codigoMarca: string, codigoModelo: string): Promise<{ codigo: string; nome: string }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar anos: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API FIPE oficial - anos:', error);
      throw new Error('Falha ao consultar anos FIPE');
    }
  }

  /**
   * Busca preço específico
   */
  async getPreco(
    tipoVeiculo: 'carros' | 'motos' | 'caminhoes',
    codigoMarca: string,
    codigoModelo: string,
    codigoAno: string
  ): Promise<FipeOficialPreco> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${tipoVeiculo}/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar preço: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na API FIPE oficial - preço:', error);
      throw new Error('Falha ao consultar preço FIPE');
    }
  }

  /**
   * Busca completa com preços para um modelo específico
   */
  async getBuscaCompletaComPrecos(
    tipoVeiculo: 'carros' | 'motos' | 'caminhoes',
    codigoMarca: string,
    codigoModelo: string
  ): Promise<{
    marca: string;
    modelo: string;
    precos: FipeOficialPreco[];
  }> {
    try {
      // Buscar anos disponíveis
      const anos = await this.getAnos(tipoVeiculo, codigoMarca, codigoModelo);
      
      // Buscar preços para todos os anos (limitado aos últimos 5 para performance)
      const anosLimitados = anos.slice(0, 5);
      const precosPromises = anosLimitados.map(ano => 
        this.getPreco(tipoVeiculo, codigoMarca, codigoModelo, ano.codigo)
      );
      
      const precos = await Promise.all(precosPromises);
      
      return {
        marca: precos[0]?.Marca || '',
        modelo: precos[0]?.Modelo || '',
        precos
      };
    } catch (error) {
      console.error('Erro na busca completa FIPE oficial:', error);
      throw new Error('Falha na consulta completa FIPE');
    }
  }
}

export const fipeOficialService = new FipeOficialService();
