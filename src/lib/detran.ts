// Simulação de API do DETRAN para consultas
// Em produção, seria integrado com APIs oficiais

export interface VehicleInfo {
  placa: string
  renavam: string
  chassi: string
  modelo: string
  marca: string
  ano: number
  cor: string
  combustivel: string
  categoria: string
  proprietario: string
  cpf: string
  cidade: string
  uf: string
  situacao: 'regular' | 'irregular' | 'bloqueado'
  licenciamentoVencimento: string
  multas: Multa[]
  ipva: IPVA
  seguroObrigatorio: SeguroObrigatorio
}

export interface Multa {
  id: string
  infracao: string
  valor: number
  data: string
  local: string
  pontos: number
  situacao: 'pendente' | 'paga' | 'vencida'
}

export interface IPVA {
  ano: number
  valor: number
  situacao: 'pago' | 'pendente' | 'vencido'
  dataVencimento: string
}

export interface SeguroObrigatorio {
  ano: number
  valor: number
  situacao: 'pago' | 'pendente' | 'vencido'
  dataVencimento: string
}

export interface DocumentValidation {
  cpf: string
  cnpj?: string
  isValid: boolean
  name?: string
  birthDate?: string
  situation?: 'regular' | 'irregular' | 'cancelado'
}

// Simulação de dados do DETRAN
const mockVehicles: VehicleInfo[] = [
  {
    placa: 'ABC1234',
    renavam: '12345678901',
    chassi: '9BWZZZ377VT004251',
    modelo: 'CIVIC',
    marca: 'HONDA',
    ano: 2020,
    cor: 'PRATA',
    combustivel: 'FLEX',
    categoria: 'PARTICULAR',
    proprietario: 'João Silva',
    cpf: '123.456.789-00',
    cidade: 'Ribeirão Preto',
    uf: 'SP',
    situacao: 'regular',
    licenciamentoVencimento: '2024-12-31',
    multas: [
      {
        id: 'M001',
        infracao: 'Excesso de velocidade',
        valor: 195.23,
        data: '2024-06-15',
        local: 'Av. Presidente Vargas',
        pontos: 5,
        situacao: 'pendente'
      }
    ],
    ipva: {
      ano: 2024,
      valor: 1250.00,
      situacao: 'pago',
      dataVencimento: '2024-03-31'
    },
    seguroObrigatorio: {
      ano: 2024,
      valor: 89.25,
      situacao: 'pago',
      dataVencimento: '2024-12-31'
    }
  },
  {
    placa: 'XYZ5678',
    renavam: '98765432109',
    chassi: '9BWZZZ377VT004252',
    modelo: 'COROLLA',
    marca: 'TOYOTA',
    ano: 2019,
    cor: 'BRANCO',
    combustivel: 'FLEX',
    categoria: 'PARTICULAR',
    proprietario: 'Maria Santos',
    cpf: '987.654.321-00',
    cidade: 'Ribeirão Preto',
    uf: 'SP',
    situacao: 'irregular',
    licenciamentoVencimento: '2023-12-31',
    multas: [
      {
        id: 'M002',
        infracao: 'Estacionamento irregular',
        valor: 88.38,
        data: '2024-07-01',
        local: 'Rua XV de Novembro',
        pontos: 3,
        situacao: 'pendente'
      },
      {
        id: 'M003',
        infracao: 'Falta de licenciamento',
        valor: 293.47,
        data: '2024-01-15',
        local: 'Av. Francisco Junqueira',
        pontos: 7,
        situacao: 'vencida'
      }
    ],
    ipva: {
      ano: 2024,
      valor: 980.00,
      situacao: 'pendente',
      dataVencimento: '2024-03-31'
    },
    seguroObrigatorio: {
      ano: 2024,
      valor: 89.25,
      situacao: 'vencido',
      dataVencimento: '2024-12-31'
    }
  }
]

export class DetranAPI {
  private static instance: DetranAPI
  
  private constructor() {}
  
  static getInstance(): DetranAPI {
    if (!DetranAPI.instance) {
      DetranAPI.instance = new DetranAPI()
    }
    return DetranAPI.instance
  }

  async consultarVeiculo(placa: string): Promise<VehicleInfo | null> {
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const normalizedPlaca = placa.replace(/[^A-Z0-9]/g, '').toUpperCase()
    const vehicle = mockVehicles.find(v => 
      v.placa.replace(/[^A-Z0-9]/g, '') === normalizedPlaca
    )
    
    if (!vehicle) {
      throw new Error('Veículo não encontrado')
    }
    
    return vehicle
  }

  async consultarMultas(placa: string): Promise<Multa[]> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const vehicle = await this.consultarVeiculo(placa)
    return vehicle?.multas || []
  }

  async validarCPF(cpf: string): Promise<DocumentValidation> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const cleanCPF = cpf.replace(/[^0-9]/g, '')
    
    // Validação básica de CPF
    if (cleanCPF.length !== 11) {
      return { cpf, isValid: false }
    }
    
    // Algoritmo de validação do CPF
    const isValidCPF = this.validateCPFAlgorithm(cleanCPF)
    
    if (!isValidCPF) {
      return { cpf, isValid: false }
    }
    
    // Simular consulta na Receita Federal
    const mockNames = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa']
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)]
    
    return {
      cpf,
      isValid: true,
      name: randomName,
      birthDate: '1985-03-15',
      situation: 'regular'
    }
  }

  async validarCNPJ(cnpj: string): Promise<DocumentValidation> {
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const cleanCNPJ = cnpj.replace(/[^0-9]/g, '')
    
    if (cleanCNPJ.length !== 14) {
      return { cpf: '', cnpj, isValid: false }
    }
    
    const isValidCNPJ = this.validateCNPJAlgorithm(cleanCNPJ)
    
    if (!isValidCNPJ) {
      return { cpf: '', cnpj, isValid: false }
    }
    
    return {
      cpf: '',
      cnpj,
      isValid: true,
      name: 'Empresa Exemplo LTDA',
      situation: 'regular'
    }
  }

  private validateCPFAlgorithm(cpf: string): boolean {
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false
    }
    
    // Calcular primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf[9])) return false
    
    // Calcular segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cpf[10])) return false
    
    return true
  }

  private validateCNPJAlgorithm(cnpj: string): boolean {
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) {
      return false
    }
    
    // Calcular primeiro dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj[i]) * weights1[i]
    }
    let remainder = sum % 11
    const digit1 = remainder < 2 ? 0 : 11 - remainder
    if (digit1 !== parseInt(cnpj[12])) return false
    
    // Calcular segundo dígito verificador
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum = 0
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj[i]) * weights2[i]
    }
    remainder = sum % 11
    const digit2 = remainder < 2 ? 0 : 11 - remainder
    if (digit2 !== parseInt(cnpj[13])) return false
    
    return true
  }

  async consultarCEP(cep: string): Promise<{
    cep: string
    logradouro: string
    bairro: string
    cidade: string
    uf: string
    isValid: boolean
  }> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const cleanCEP = cep.replace(/[^0-9]/g, '')
    
    if (cleanCEP.length !== 8) {
      return {
        cep,
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        isValid: false
      }
    }
    
    // Simular consulta aos Correios
    const mockAddresses = [
      {
        cep: '14020000',
        logradouro: 'Praça das Bandeiras',
        bairro: 'Centro',
        cidade: 'Ribeirão Preto',
        uf: 'SP'
      },
      {
        cep: '14015000',
        logradouro: 'Avenida Presidente Vargas',
        bairro: 'Jardim Paulista',
        cidade: 'Ribeirão Preto',
        uf: 'SP'
      },
      {
        cep: '14010000',
        logradouro: 'Rua XV de Novembro',
        bairro: 'Centro',
        cidade: 'Ribeirão Preto',
        uf: 'SP'
      }
    ]
    
    const address = mockAddresses.find(addr => addr.cep === cleanCEP) || {
      cep: cleanCEP,
      logradouro: 'Rua Exemplo',
      bairro: 'Bairro Exemplo',
      cidade: 'Cidade Exemplo',
      uf: 'SP'
    }
    
    return {
      ...address,
      cep,
      isValid: true
    }
  }

  async gerarRelatorioPendencias(cpf: string): Promise<{
    cpf: string
    nome: string
    veiculos: Array<{
      placa: string
      modelo: string
      pendencias: Array<{
        tipo: string
        valor: number
        vencimento: string
      }>
    }>
    totalPendencias: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const validation = await this.validarCPF(cpf)
    if (!validation.isValid) {
      throw new Error('CPF inválido')
    }
    
    const veiculosProprietario = mockVehicles.filter(v => 
      v.cpf.replace(/[^0-9]/g, '') === cpf.replace(/[^0-9]/g, '')
    )
    
    const relatorio = {
      cpf,
      nome: validation.name || 'Proprietário',
      veiculos: veiculosProprietario.map(veiculo => ({
        placa: veiculo.placa,
        modelo: `${veiculo.marca} ${veiculo.modelo}`,
        pendencias: [
          ...(veiculo.ipva.situacao !== 'pago' ? [{
            tipo: 'IPVA',
            valor: veiculo.ipva.valor,
            vencimento: veiculo.ipva.dataVencimento
          }] : []),
          ...(veiculo.seguroObrigatorio.situacao !== 'pago' ? [{
            tipo: 'Seguro Obrigatório',
            valor: veiculo.seguroObrigatorio.valor,
            vencimento: veiculo.seguroObrigatorio.dataVencimento
          }] : []),
          ...veiculo.multas.filter(m => m.situacao === 'pendente').map(multa => ({
            tipo: 'Multa',
            valor: multa.valor,
            vencimento: multa.data
          }))
        ]
      })),
      totalPendencias: 0
    }
    
    // Calcular total de pendências
    relatorio.totalPendencias = relatorio.veiculos.reduce((total, veiculo) => 
      total + veiculo.pendencias.reduce((subtotal, pendencia) => 
        subtotal + pendencia.valor, 0
      ), 0
    )
    
    return relatorio
  }
}

export const detranAPI = DetranAPI.getInstance()
