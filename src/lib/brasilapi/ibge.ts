// Serviços de dados do IBGE
// Útil para localização e dados geográficos brasileiros

export interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

export interface Cidade {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        sigla: string;
        nome: string;
        regiao: {
          id: number;
          sigla: string;
          nome: string;
        };
      };
    };
  };
}

export interface LocalizacaoCompleta {
  cidade: Cidade;
  estado: Estado;
  regiao: string;
  codigoIbge: number;
  populacao?: number;
  area?: number;
}

class IbgeService {
  /**
   * Lista todos os estados brasileiros
   */
  async listarEstados(): Promise<Estado[]> {
    try {
      const response = await fetch('/api/ibge/estados');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar estados');
      }

      const data = await response.json();
      return data.estados || this.getEstadosLocais();
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      return this.getEstadosLocais();
    }
  }

  /**
   * Busca estado por ID ou sigla
   */
  async buscarEstado(identificador: string | number): Promise<Estado | null> {
    try {
      const response = await fetch(`/api/ibge/estados/${identificador}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Estado não encontrado');
      }

      const data = await response.json();
      return data.estado;
    } catch (error) {
      console.error('Erro ao buscar estado:', error);
      
      // Fallback para busca local
      const estados = this.getEstadosLocais();
      const estado = estados.find(e => 
        e.sigla === String(identificador).toUpperCase() || 
        e.id === Number(identificador)
      );
      
      return estado || null;
    }
  }

  /**
   * Lista cidades de um estado
   */
  async listarCidadesPorEstado(estadoId: number | string): Promise<Cidade[]> {
    try {
      const response = await fetch(`/api/ibge/estados/${estadoId}/cidades`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar cidades');
      }

      const data = await response.json();
      return data.cidades || [];
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      return [];
    }
  }

  /**
   * Busca cidade por nome ou ID
   */
  async buscarCidade(identificador: string | number, estadoId?: number | string): Promise<Cidade[]> {
    try {
      let url = `/api/ibge/cidades/${identificador}`;
      if (estadoId) {
        url += `?estado=${estadoId}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Cidade não encontrada');
      }

      const data = await response.json();
      return Array.isArray(data.cidades) ? data.cidades : [data.cidade];
    } catch (error) {
      console.error('Erro ao buscar cidade:', error);
      return [];
    }
  }

  /**
   * Busca completa por localização
   */
  async buscarLocalizacaoCompleta(cidade: string, estado?: string): Promise<LocalizacaoCompleta | null> {
    try {
      // Primeiro busca o estado se fornecido
      let estadoObj: Estado | null = null;
      if (estado) {
        estadoObj = await this.buscarEstado(estado);
      }

      // Busca a cidade
      const cidades = estadoObj 
        ? await this.listarCidadesPorEstado(estadoObj.id)
        : await this.buscarCidade(cidade);

      const cidadeEncontrada = cidades.find(c => 
        c.nome.toLowerCase().includes(cidade.toLowerCase())
      );

      if (!cidadeEncontrada) return null;

      // Busca o estado da cidade se não foi fornecido
      if (!estadoObj) {
        estadoObj = await this.buscarEstado(cidadeEncontrada.microrregiao.mesorregiao.UF.id);
      }

      return {
        cidade: cidadeEncontrada,
        estado: estadoObj!,
        regiao: estadoObj!.regiao.nome,
        codigoIbge: cidadeEncontrada.id
      };
    } catch (error) {
      console.error('Erro ao buscar localização completa:', error);
      return null;
    }
  }

  /**
   * Valida se cidade pertence ao estado
   */
  async validarCidadeEstado(cidade: string, estado: string): Promise<boolean> {
    try {
      const localizacao = await this.buscarLocalizacaoCompleta(cidade, estado);
      return localizacao !== null;
    } catch {
      return false;
    }
  }

  /**
   * Lista cidades por região
   */
  async listarCidadesPorRegiao(regiao: string): Promise<Cidade[]> {
    try {
      const estados = await this.listarEstados();
      const estadosRegiao = estados.filter(e => 
        e.regiao.nome.toLowerCase() === regiao.toLowerCase() ||
        e.regiao.sigla.toLowerCase() === regiao.toLowerCase()
      );

      const todasCidades: Cidade[] = [];
      
      for (const estado of estadosRegiao) {
        const cidades = await this.listarCidadesPorEstado(estado.id);
        todasCidades.push(...cidades);
      }

      return todasCidades;
    } catch (error) {
      console.error('Erro ao buscar cidades por região:', error);
      return [];
    }
  }

  /**
   * Busca cidades próximas (por nome similar)
   */
  buscarCidadesSimilares(termo: string, cidades: Cidade[]): Cidade[] {
    const termoLower = termo.toLowerCase();
    
    return cidades
      .filter(cidade => cidade.nome.toLowerCase().includes(termoLower))
      .sort((a, b) => {
        // Prioriza matches exatos
        const aExato = a.nome.toLowerCase() === termoLower;
        const bExato = b.nome.toLowerCase() === termoLower;
        
        if (aExato && !bExato) return -1;
        if (!aExato && bExato) return 1;
        
        // Depois por início da palavra
        const aInicio = a.nome.toLowerCase().startsWith(termoLower);
        const bInicio = b.nome.toLowerCase().startsWith(termoLower);
        
        if (aInicio && !bInicio) return -1;
        if (!aInicio && bInicio) return 1;
        
        // Por fim, alfabética
        return a.nome.localeCompare(b.nome);
      })
      .slice(0, 10); // Limita a 10 resultados
  }

  /**
   * Estados brasileiros como fallback
   */
  private getEstadosLocais(): Estado[] {
    return [
      { id: 11, sigla: 'RO', nome: 'Rondônia', regiao: { id: 1, sigla: 'N', nome: 'Norte' } },
      { id: 12, sigla: 'AC', nome: 'Acre', regiao: { id: 1, sigla: 'N', nome: 'Norte' } },
      { id: 13, sigla: 'AM', nome: 'Amazonas', regiao: { id: 1, sigla: 'N', nome: 'Norte' } },
      { id: 14, sigla: 'RR', nome: 'Roraima', regiao: { id: 1, sigla: 'N', nome: 'Norte' } },
      { id: 15, sigla: 'PA', nome: 'Pará', regiao: { id: 1, sigla: 'N', nome: 'Norte' } },
      { id: 16, sigla: 'AP', nome: 'Amapá', regiao: { id: 1, sigla: 'N', nome: 'Norte' } },
      { id: 17, sigla: 'TO', nome: 'Tocantins', regiao: { id: 1, sigla: 'N', nome: 'Norte' } },
      { id: 21, sigla: 'MA', nome: 'Maranhão', regiao: { id: 2, sigla: 'NE', nome: 'Nordeste' } },
      { id: 22, sigla: 'PI', nome: 'Piauí', regiao: { id: 2, sigla: 'NE', nome: 'Nordeste' } },
      { id: 23, sigla: 'CE', nome: 'Ceará', regiao: { id: 2, sigla: 'NE', nome: 'Nordeste' } },
      { id: 24, sigla: 'RN', nome: 'Rio Grande do Norte', regiao: { id: 2, sigla: 'NE', nome: 'Nordeste' } },
      { id: 25, sigla: 'PB', nome: 'Paraíba', regiao: { id: 2, sigla: 'NE', nome: 'Nordeste' } },
      { id: 26, sigla: 'PE', nome: 'Pernambuco', regiao: { id: 2, sigla: 'NE', nome: 'Nordeste' } },
      { id: 27, sigla: 'AL', nome: 'Alagoas', regiao: { id: 2, sigla: 'NE', nome: 'Nordeste' } },
      { id: 28, sigla: 'SE', nome: 'Sergipe', regiao: { id: 2, sigla: 'NE', nome: 'Nordeste' } },
      { id: 29, sigla: 'BA', nome: 'Bahia', regiao: { id: 2, sigla: 'NE', nome: 'Nordeste' } },
      { id: 31, sigla: 'MG', nome: 'Minas Gerais', regiao: { id: 3, sigla: 'SE', nome: 'Sudeste' } },
      { id: 32, sigla: 'ES', nome: 'Espírito Santo', regiao: { id: 3, sigla: 'SE', nome: 'Sudeste' } },
      { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro', regiao: { id: 3, sigla: 'SE', nome: 'Sudeste' } },
      { id: 35, sigla: 'SP', nome: 'São Paulo', regiao: { id: 3, sigla: 'SE', nome: 'Sudeste' } },
      { id: 41, sigla: 'PR', nome: 'Paraná', regiao: { id: 4, sigla: 'S', nome: 'Sul' } },
      { id: 42, sigla: 'SC', nome: 'Santa Catarina', regiao: { id: 4, sigla: 'S', nome: 'Sul' } },
      { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul', regiao: { id: 4, sigla: 'S', nome: 'Sul' } },
      { id: 50, sigla: 'MS', nome: 'Mato Grosso do Sul', regiao: { id: 5, sigla: 'CO', nome: 'Centro-Oeste' } },
      { id: 51, sigla: 'MT', nome: 'Mato Grosso', regiao: { id: 5, sigla: 'CO', nome: 'Centro-Oeste' } },
      { id: 52, sigla: 'GO', nome: 'Goiás', regiao: { id: 5, sigla: 'CO', nome: 'Centro-Oeste' } },
      { id: 53, sigla: 'DF', nome: 'Distrito Federal', regiao: { id: 5, sigla: 'CO', nome: 'Centro-Oeste' } }
    ];
  }

  /**
   * Regiões brasileiras
   */
  getRegioes() {
    return [
      { id: 1, sigla: 'N', nome: 'Norte' },
      { id: 2, sigla: 'NE', nome: 'Nordeste' },
      { id: 3, sigla: 'SE', nome: 'Sudeste' },
      { id: 4, sigla: 'S', nome: 'Sul' },
      { id: 5, sigla: 'CO', nome: 'Centro-Oeste' }
    ];
  }

  /**
   * Autocomplete para cidades
   */
  async autocompleteCidades(termo: string, estadoId?: number | string): Promise<string[]> {
    try {
      let cidades: Cidade[] = [];
      
      if (estadoId) {
        cidades = await this.listarCidadesPorEstado(estadoId);
      } else {
        // Busca em alguns estados principais se não especificado
        const estadosPrincipais = [35, 33, 31, 41, 43]; // SP, RJ, MG, PR, RS
        for (const id of estadosPrincipais) {
          const cidadesEstado = await this.listarCidadesPorEstado(id);
          cidades.push(...cidadesEstado);
        }
      }
      
      return this.buscarCidadesSimilares(termo, cidades)
        .map(cidade => cidade.nome)
        .slice(0, 5);
    } catch (error) {
      console.error('Erro no autocomplete:', error);
      return [];
    }
  }
}

// Singleton instance
export const ibgeService = new IbgeService();

// Hook personalizado para React
export function useIbge() {
  return {
    listarEstados: ibgeService.listarEstados.bind(ibgeService),
    buscarEstado: ibgeService.buscarEstado.bind(ibgeService),
    listarCidadesPorEstado: ibgeService.listarCidadesPorEstado.bind(ibgeService),
    buscarCidade: ibgeService.buscarCidade.bind(ibgeService),
    buscarLocalizacaoCompleta: ibgeService.buscarLocalizacaoCompleta.bind(ibgeService),
    validarCidadeEstado: ibgeService.validarCidadeEstado.bind(ibgeService),
    listarCidadesPorRegiao: ibgeService.listarCidadesPorRegiao.bind(ibgeService),
    buscarCidadesSimilares: ibgeService.buscarCidadesSimilares.bind(ibgeService),
    autocompleteCidades: ibgeService.autocompleteCidades.bind(ibgeService),
    getRegioes: ibgeService.getRegioes.bind(ibgeService),
  };
}
