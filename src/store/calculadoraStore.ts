import { create } from 'zustand'

export interface PriceCalculation {
  service: string
  vehicleType: string
  vehicleYear: number
  urgency: string
  additionalServices: string[]
  basePrice: number
  finalPrice: number
  discount: number
  customerInfo: {
    name: string
    phone: string
    email?: string
  }
}

interface CalculatorState {
  calculation: PriceCalculation | null
  priceTable: PriceTable
  isLoading: boolean
  setCalculation: (calculation: PriceCalculation) => void
  calculatePrice: (data: Partial<PriceCalculation>) => PriceCalculation
  resetCalculation: () => void
}

export interface PriceTable {
  services: {
    [key: string]: {
      name: string
      basePrice: number
      vehicleMultiplier: {
        [key: string]: number
      }
      yearMultiplier: {
        [key: string]: number
      }
      urgencyMultiplier: {
        [key: string]: number
      }
    }
  }
  additionalServices: {
    [key: string]: {
      name: string
      price: number
    }
  }
}

// Tabela de preços configurável
const DEFAULT_PRICE_TABLE: PriceTable = {
  services: {
    'licenciamento': {
      name: 'Licenciamento',
      basePrice: 80,
      vehicleMultiplier: {
        'carro': 1.0,
        'moto': 0.8,
        'caminhao': 1.5,
        'onibus': 1.8,
        'reboque': 1.2
      },
      yearMultiplier: {
        'ate-2010': 1.0,
        '2011-2015': 1.1,
        '2016-2020': 1.2,
        'acima-2020': 1.3
      },
      urgencyMultiplier: {
        'normal': 1.0,
        'urgente': 1.5,
        'expresso': 2.0
      }
    },
    'transferencia': {
      name: 'Transferência',
      basePrice: 150,
      vehicleMultiplier: {
        'carro': 1.0,
        'moto': 0.8,
        'caminhao': 1.5,
        'onibus': 1.8,
        'reboque': 1.2
      },
      yearMultiplier: {
        'ate-2010': 1.0,
        '2011-2015': 1.1,
        '2016-2020': 1.2,
        'acima-2020': 1.3
      },
      urgencyMultiplier: {
        'normal': 1.0,
        'urgente': 1.5,
        'expresso': 2.0
      }
    },
    'primeiro-registro': {
      name: '1° Registro',
      basePrice: 200,
      vehicleMultiplier: {
        'carro': 1.0,
        'moto': 0.8,
        'caminhao': 1.5,
        'onibus': 1.8,
        'reboque': 1.2
      },
      yearMultiplier: {
        'ate-2010': 1.0,
        '2011-2015': 1.1,
        '2016-2020': 1.2,
        'acima-2020': 1.3
      },
      urgencyMultiplier: {
        'normal': 1.0,
        'urgente': 1.5,
        'expresso': 2.0
      }
    },
    'desbloqueio': {
      name: 'Desbloqueio',
      basePrice: 120,
      vehicleMultiplier: {
        'carro': 1.0,
        'moto': 0.8,
        'caminhao': 1.5,
        'onibus': 1.8,
        'reboque': 1.2
      },
      yearMultiplier: {
        'ate-2010': 1.0,
        '2011-2015': 1.1,
        '2016-2020': 1.2,
        'acima-2020': 1.3
      },
      urgencyMultiplier: {
        'normal': 1.0,
        'urgente': 1.5,
        'expresso': 2.0
      }
    }
  },
  additionalServices: {
    'vistoria': {
      name: 'Vistoria',
      price: 50
    },
    'leilao': {
      name: 'Leilão',
      price: 100
    },
    'guincho': {
      name: 'Guincho',
      price: 80
    },
    'autenticacao': {
      name: 'Autenticação de Documentos',
      price: 30
    },
    'busca-documento': {
      name: 'Busca de Documento',
      price: 40
    }
  }
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  calculation: null,
  priceTable: DEFAULT_PRICE_TABLE,
  isLoading: false,

  setCalculation: (calculation) => set({ calculation }),

  calculatePrice: (data) => {
    const { priceTable } = get()
    const service = priceTable.services[data.service || '']
    
    if (!service) {
      throw new Error('Serviço não encontrado')
    }

    // Cálculo base
    let basePrice = service.basePrice

    // Aplicar multiplicador do tipo de veículo
    if (data.vehicleType) {
      const vehicleMultiplier = service.vehicleMultiplier[data.vehicleType] || 1.0
      basePrice *= vehicleMultiplier
    }

    // Aplicar multiplicador do ano
    if (data.vehicleYear) {
      let yearCategory = 'ate-2010'
      if (data.vehicleYear >= 2021) yearCategory = 'acima-2020'
      else if (data.vehicleYear >= 2016) yearCategory = '2016-2020'
      else if (data.vehicleYear >= 2011) yearCategory = '2011-2015'
      
      const yearMultiplier = service.yearMultiplier[yearCategory] || 1.0
      basePrice *= yearMultiplier
    }

    // Aplicar multiplicador de urgência
    if (data.urgency) {
      const urgencyMultiplier = service.urgencyMultiplier[data.urgency] || 1.0
      basePrice *= urgencyMultiplier
    }

    // Adicionar serviços adicionais
    let additionalPrice = 0
    if (data.additionalServices) {
      data.additionalServices.forEach(serviceId => {
        const additionalService = priceTable.additionalServices[serviceId]
        if (additionalService) {
          additionalPrice += additionalService.price
        }
      })
    }

    const finalPrice = basePrice + additionalPrice
    const discount = 0 // Pode ser configurado posteriormente

    const calculation: PriceCalculation = {
      service: data.service || '',
      vehicleType: data.vehicleType || '',
      vehicleYear: data.vehicleYear || new Date().getFullYear(),
      urgency: data.urgency || 'normal',
      additionalServices: data.additionalServices || [],
      basePrice: Math.round(basePrice),
      finalPrice: Math.round(finalPrice - discount),
      discount: discount,
      customerInfo: data.customerInfo || {
        name: '',
        phone: '',
        email: ''
      }
    }

    set({ calculation })
    return calculation
  },

  resetCalculation: () => set({ calculation: null })
}))

// Função helper para formatar preço
export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Função helper para obter ano atual
export const getCurrentYear = (): number => {
  return new Date().getFullYear()
}
