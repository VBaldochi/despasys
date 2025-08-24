// Serviços de integração com CEP da BrasilAPI
// Útil para validação de endereços e auto-preenchimento

export interface CepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  ddd: string;
}

export interface EnderecoCep {
  cep: string;
  state: string;
  city: string;
  neighborhood: string | null;
  street: string | null;
  service: string;
}

export interface EnderecoCepV2 extends EnderecoCep {
  location: {
    type: string;
    coordinates: {
      longitude: string | null;
      latitude: string | null;
    };
  };
}

class CepService {
  private readonly baseUrl = 'https://brasilapi.com.br/api/cep';

  /**
   * Busca endereço por CEP (versão 1)
   */
  async buscarCep(cep: string): Promise<CepResponse> {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    try {
      const response = await fetch(`/api/cep?cep=${cepLimpo}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao buscar CEP');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('CEP não encontrado');
      }

      return data.endereco;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      throw error;
    }
  }

  /**
   * Busca endereço por CEP com geolocalização (versão 2)
   */
  async buscarCepV2(cep: string): Promise<EnderecoCepV2> {
    const cepLimpo = this.limparCep(cep);
    
    if (!this.validarCep(cepLimpo)) {
      throw new Error('CEP inválido. Use o formato 12345678 ou 12345-678');
    }

    try {
      const response = await fetch(`${this.baseUrl}/v2/${cepLimpo}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('CEP não encontrado');
        }
        throw new Error(`Erro ao buscar CEP: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro na consulta de CEP V2:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Falha ao consultar CEP');
    }
  }

  /**
   * Remove formatação do CEP
   */
  private limparCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  /**
   * Valida formato do CEP
   */
  validarCep(cep: string): boolean {
    const cepLimpo = this.limparCep(cep);
    return /^\d{8}$/.test(cepLimpo);
  }

  /**
   * Formata CEP para exibição
   */
  formatarCep(cep: string): string {
    const cepLimpo = this.limparCep(cep);
    if (!this.validarCep(cepLimpo)) return cep;
    
    return `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`;
  }

  /**
   * Monta endereço completo para exibição
   */
  montarEnderecoCompleto(endereco: EnderecoCep): string {
    const partes = [
      endereco.street,
      endereco.neighborhood,
      endereco.city,
      endereco.state
    ].filter(Boolean);
    
    return partes.join(', ');
  }

  /**
   * Verifica se o endereço tem coordenadas (apenas V2)
   */
  temCoordenadas(endereco: EnderecoCepV2): boolean {
    return !!(
      endereco.location?.coordinates?.latitude && 
      endereco.location?.coordinates?.longitude
    );
  }

  /**
   * Converte coordenadas para números
   */
  obterCoordenadas(endereco: EnderecoCepV2): { lat: number; lng: number } | null {
    if (!this.temCoordenadas(endereco)) return null;
    
    const lat = parseFloat(endereco.location.coordinates.latitude || '0');
    const lng = parseFloat(endereco.location.coordinates.longitude || '0');
    
    if (isNaN(lat) || isNaN(lng)) return null;
    
    return { lat, lng };
  }
}

// Singleton instance
export const cepService = new CepService();

// Hook personalizado para React
export function useCep() {
  return {
    buscarCep: cepService.buscarCep.bind(cepService),
    buscarCepV2: cepService.buscarCepV2.bind(cepService),
    validarCep: cepService.validarCep.bind(cepService),
    formatarCep: cepService.formatarCep.bind(cepService),
    montarEnderecoCompleto: cepService.montarEnderecoCompleto.bind(cepService),
    temCoordenadas: cepService.temCoordenadas.bind(cepService),
    obterCoordenadas: cepService.obterCoordenadas.bind(cepService),
  };
}

// Utilitários para CEP
export const cepUtils = {
  /**
   * Estados brasileiros com suas siglas
   */
  estados: {
    'AC': 'Acre',
    'AL': 'Alagoas', 
    'AP': 'Amapá',
    'AM': 'Amazonas',
    'BA': 'Bahia',
    'CE': 'Ceará',
    'DF': 'Distrito Federal',
    'ES': 'Espírito Santo',
    'GO': 'Goiás',
    'MA': 'Maranhão',
    'MT': 'Mato Grosso',
    'MS': 'Mato Grosso do Sul',
    'MG': 'Minas Gerais',
    'PA': 'Pará',
    'PB': 'Paraíba',
    'PR': 'Paraná',
    'PE': 'Pernambuco',
    'PI': 'Piauí',
    'RJ': 'Rio de Janeiro',
    'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul',
    'RO': 'Rondônia',
    'RR': 'Roraima',
    'SC': 'Santa Catarina',
    'SP': 'São Paulo',
    'SE': 'Sergipe',
    'TO': 'Tocantins'
  },

  /**
   * Obter nome completo do estado
   */
  nomeCompleto(sigla: string): string {
    return this.estados[sigla as keyof typeof this.estados] || sigla;
  },

  /**
   * Calcular distância aproximada entre dois pontos (fórmula de Haversine)
   */
  calcularDistancia(
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(coord2.lat - coord1.lat);
    const dLng = this.toRad(coord2.lng - coord1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.lat)) * Math.cos(this.toRad(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  },

  /**
   * Converter graus para radianos
   */
  toRad(valor: number): number {
    return valor * (Math.PI / 180);
  },

  /**
   * Gerar URL do Google Maps
   */
  gerarUrlMaps(endereco: EnderecoCep): string {
    const enderecoCompleto = cepService.montarEnderecoCompleto(endereco);
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;
  },

  /**
   * Verificar se CEP é de determinado estado
   */
  verificarEstado(cep: string, siglaEstado: string): boolean {
    const cepLimpo = cep.replace(/\D/g, '');
    if (!cepService.validarCep(cepLimpo)) return false;
    
    // Faixas aproximadas de CEP por estado (simplificado)
    const faixasCep: Record<string, string[]> = {
      'SP': ['01000', '20000'],
      'RJ': ['20000', '29000'],
      'MG': ['30000', '40000'],
      'BA': ['40000', '49000'],
      'RS': ['90000', '100000'],
      // Adicionar outras faixas conforme necessário
    };
    
    const faixa = faixasCep[siglaEstado];
    if (!faixa) return false;
    
    const cepNum = parseInt(cepLimpo.slice(0, 5));
    const min = parseInt(faixa[0]);
    const max = parseInt(faixa[1]);
    
    return cepNum >= min && cepNum < max;
  }
};
