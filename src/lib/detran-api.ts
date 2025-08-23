// Simulação da API do DETRAN-SP para demonstração
export interface ConsultaVeiculo {
  placa: string
  chassi?: string
  renavam?: string
}

export interface DadosVeiculo {
  placa: string
  chassi: string
  renavam: string
  marca: string
  modelo: string
  anoFabricacao: number
  anoModelo: number
  cor: string
  combustivel: string
  categoria: string
  especie: string
  situacao: 'REGULAR' | 'BLOQUEADO' | 'BAIXADO' | 'PENDENTE'
  municipio: string
  uf: string
  restricoes: string[]
  multas: {
    quantidade: number
    valor: number
  }
  ipva: {
    exercicio: number
    vencimento: string
    valor: number
    situacao: 'PAGO' | 'PENDENTE' | 'VENCIDO'
  }[]
  licenciamento: {
    exercicio: number
    vencimento: string
    situacao: 'LICENCIADO' | 'PENDENTE' | 'VENCIDO'
  }
  proprietario: {
    nome: string
    documento: string
    tipo: 'FISICA' | 'JURIDICA'
  }
}

export interface StatusConsulta {
  sucesso: boolean
  erro?: string
  dados?: DadosVeiculo
}

// Dados mock para demonstração
const veiculosMock: Record<string, DadosVeiculo> = {
  'ABC1234': {
    placa: 'ABC-1234',
    chassi: '9BD12345678901234',
    renavam: '12345678901',
    marca: 'HONDA',
    modelo: 'CIVIC SEDAN EXL 2.0',
    anoFabricacao: 2020,
    anoModelo: 2020,
    cor: 'PRATA',
    combustivel: 'FLEX',
    categoria: 'PARTICULAR',
    especie: 'PASSAGEIRO',
    situacao: 'REGULAR',
    municipio: 'FRANCA',
    uf: 'SP',
    restricoes: [],
    multas: {
      quantidade: 0,
      valor: 0
    },
    ipva: [
      {
        exercicio: 2024,
        vencimento: '2024-04-30',
        valor: 2340.50,
        situacao: 'PAGO'
      },
      {
        exercicio: 2025,
        vencimento: '2025-04-30',
        valor: 2450.75,
        situacao: 'PENDENTE'
      }
    ],
    licenciamento: {
      exercicio: 2024,
      vencimento: '2024-12-31',
      situacao: 'LICENCIADO'
    },
    proprietario: {
      nome: 'JOÃO SILVA SANTOS',
      documento: '123.456.789-01',
      tipo: 'FISICA'
    }
  },
  'XYZ5678': {
    placa: 'XYZ-5678',
    chassi: '9BD56789012345678',
    renavam: '56789012345',
    marca: 'SCANIA',
    modelo: 'R440 A6X2 HIGHLINE',
    anoFabricacao: 2019,
    anoModelo: 2019,
    cor: 'BRANCA',
    combustivel: 'DIESEL',
    categoria: 'COMERCIAL',
    especie: 'CARGA',
    situacao: 'REGULAR',
    municipio: 'RIBEIRÃO PRETO',
    uf: 'SP',
    restricoes: ['FINANCIAMENTO'],
    multas: {
      quantidade: 2,
      valor: 580.40
    },
    ipva: [
      {
        exercicio: 2024,
        vencimento: '2024-03-31',
        valor: 8920.30,
        situacao: 'PAGO'
      },
      {
        exercicio: 2025,
        vencimento: '2025-03-31',
        valor: 9180.45,
        situacao: 'PENDENTE'
      }
    ],
    licenciamento: {
      exercicio: 2024,
      vencimento: '2024-08-31',
      situacao: 'VENCIDO'
    },
    proprietario: {
      nome: 'TRANSPORTADORA ABC LTDA',
      documento: '12.345.678/0001-90',
      tipo: 'JURIDICA'
    }
  }
}

export class DetranAPI {
  private static readonly BASE_URL = 'https://api.detran.sp.gov.br/v1'
  
  // Simula autenticação com token de acesso
  private static async getAccessToken(): Promise<string> {
    // Em produção, aqui seria a autenticação real
    return 'mock-token-detran-sp-2024'
  }

  // Consulta dados do veículo por placa
  static async consultarVeiculo(consulta: ConsultaVeiculo): Promise<StatusConsulta> {
    try {
      // Simula delay da API real
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const placaLimpa = consulta.placa.replace(/[^A-Z0-9]/g, '')
      const veiculo = veiculosMock[placaLimpa]
      
      if (!veiculo) {
        return {
          sucesso: false,
          erro: 'Veículo não encontrado nos registros do DETRAN-SP'
        }
      }

      return {
        sucesso: true,
        dados: veiculo
      }
    } catch (error) {
      return {
        sucesso: false,
        erro: 'Erro na comunicação com o DETRAN-SP. Tente novamente.'
      }
    }
  }

  // Consulta situação do licenciamento
  static async consultarLicenciamento(placa: string): Promise<StatusConsulta> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const placaLimpa = placa.replace(/[^A-Z0-9]/g, '')
      const veiculo = veiculosMock[placaLimpa]
      
      if (!veiculo) {
        return {
          sucesso: false,
          erro: 'Veículo não encontrado'
        }
      }

      return {
        sucesso: true,
        dados: {
          ...veiculo,
          // Retorna apenas dados relevantes ao licenciamento
        }
      }
    } catch (error) {
      return {
        sucesso: false,
        erro: 'Erro na consulta de licenciamento'
      }
    }
  }

  // Consulta débitos do veículo
  static async consultarDebitos(placa: string): Promise<{
    sucesso: boolean
    erro?: string
    debitos?: {
      ipva: Array<{
        exercicio: number
        valor: number
        vencimento: string
        situacao: string
      }>
      multas: {
        quantidade: number
        valor: number
        detalhes: Array<{
          auto: string
          data: string
          valor: number
          infracao: string
        }>
      }
      taxas: {
        licenciamento: number
        dpvat: number
      }
    }
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      const placaLimpa = placa.replace(/[^A-Z0-9]/g, '')
      const veiculo = veiculosMock[placaLimpa]
      
      if (!veiculo) {
        return {
          sucesso: false,
          erro: 'Veículo não encontrado'
        }
      }

      return {
        sucesso: true,
        debitos: {
          ipva: veiculo.ipva.filter(i => i.situacao !== 'PAGO'),
          multas: {
            quantidade: veiculo.multas.quantidade,
            valor: veiculo.multas.valor,
            detalhes: veiculo.multas.quantidade > 0 ? [
              {
                auto: '40123456789',
                data: '2024-10-15',
                valor: 293.47,
                infracao: 'Excesso de velocidade acima de 20% até 50%'
              },
              {
                auto: '40987654321',
                data: '2024-11-22',
                valor: 286.93,
                infracao: 'Transitar em local proibido'
              }
            ] : []
          },
          taxas: {
            licenciamento: 142.10,
            dpvat: 67.38
          }
        }
      }
    } catch (error) {
      return {
        sucesso: false,
        erro: 'Erro na consulta de débitos'
      }
    }
  }

  // Verifica se o veículo pode ser transferido
  static async verificarTransferencia(placa: string): Promise<{
    sucesso: boolean
    erro?: string
    podeTransferir?: boolean
    pendencias?: string[]
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const placaLimpa = placa.replace(/[^A-Z0-9]/g, '')
      const veiculo = veiculosMock[placaLimpa]
      
      if (!veiculo) {
        return {
          sucesso: false,
          erro: 'Veículo não encontrado'
        }
      }

      const pendencias: string[] = []
      
      // Verifica débitos
      if (veiculo.multas.valor > 0) {
        pendencias.push(`Multas em aberto: R$ ${veiculo.multas.valor.toFixed(2)}`)
      }
      
      // Verifica IPVA
      const ipvaPendente = veiculo.ipva.find(i => i.situacao === 'PENDENTE' || i.situacao === 'VENCIDO')
      if (ipvaPendente) {
        pendencias.push(`IPVA ${ipvaPendente.exercicio} em aberto: R$ ${ipvaPendente.valor.toFixed(2)}`)
      }
      
      // Verifica licenciamento
      if (veiculo.licenciamento.situacao === 'VENCIDO') {
        pendencias.push('Licenciamento em atraso')
      }
      
      // Verifica restrições
      if (veiculo.restricoes.length > 0) {
        pendencias.push(`Restrições: ${veiculo.restricoes.join(', ')}`)
      }

      return {
        sucesso: true,
        podeTransferir: pendencias.length === 0,
        pendencias
      }
    } catch (error) {
      return {
        sucesso: false,
        erro: 'Erro na verificação de transferência'
      }
    }
  }
}
