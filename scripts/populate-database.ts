import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Dados base para geração
const nomesBrasileiros = [
  'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Souza',
  'Juliana Lima', 'Rafael Pereira', 'Fernanda Alves', 'Lucas Rodrigues', 'Mariana Ferreira',
  'Bruno Martins', 'Camila Ribeiro', 'Felipe Carvalho', 'Beatriz Gomes', 'Gustavo Dias',
  'Larissa Rocha', 'Thiago Barbosa', 'Patricia Monteiro', 'Marcelo Castro', 'Gabriela Araújo',
  'Ricardo Cardoso', 'Renata Pinto', 'Diego Nascimento', 'Aline Moreira', 'Vitor Freitas',
  'Daniela Teixeira', 'Rodrigo Cavalcanti', 'Vanessa Correia', 'Eduardo Melo', 'Carla Nunes',
  'Anderson Batista', 'Tatiana Lopes', 'Leonardo Soares', 'Priscila Campos', 'Fabio Mendes',
  'Natalia Vieira', 'Alexandre Duarte', 'Luciana Rezende', 'Marcos Fonseca', 'Simone Cunha'
];

const empresas = [
  'Auto Peças Central', 'Transportadora Rápida Ltda', 'Mecânica Silva & Irmãos',
  'Logística Express', 'Comércio de Veículos SP', 'Oficina Premium',
  'Frota & Cia', 'Posto Combustível Estrela', 'Concessionária Auto Brasil',
  'Funilaria Moderna', 'Despachante Ágil', 'Centro Automotivo', 'Lavagem Premium',
  'Estacionamento Central', 'Guincho 24h', 'Seguradora Protege', 'Banco AutoCred',
  'Loja de Pneus Borracharia', 'Som e Acessórios', 'Vidraçaria Automotiva'
];

const marcasVeiculos = [
  'Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Toyota', 'Hyundai',
  'Renault', 'Nissan', 'Jeep', 'Peugeot', 'Citroen', 'BMW', 'Mercedes-Benz'
];

const modelosVeiculos: { [key: string]: string[] } = {
  'Volkswagen': ['Gol', 'Polo', 'T-Cross', 'Nivus', 'Virtus', 'Saveiro', 'Amarok'],
  'Chevrolet': ['Onix', 'Tracker', 'S10', 'Montana', 'Cruze', 'Spin'],
  'Fiat': ['Argo', 'Cronos', 'Mobi', 'Toro', 'Strada', 'Pulse', 'Fastback'],
  'Ford': ['Ka', 'EcoSport', 'Ranger', 'Territory', 'Maverick'],
  'Honda': ['Civic', 'City', 'HR-V', 'CR-V', 'WR-V'],
  'Toyota': ['Corolla', 'Yaris', 'Hilux', 'SW4', 'Corolla Cross'],
  'Hyundai': ['HB20', 'Creta', 'Tucson', 'ix35'],
  'Renault': ['Kwid', 'Sandero', 'Duster', 'Oroch', 'Captur'],
  'Nissan': ['Kicks', 'Versa', 'Frontier', 'Sentra'],
  'Jeep': ['Renegade', 'Compass', 'Commander'],
  'Peugeot': ['208', '2008', '3008'],
  'Citroen': ['C3', 'C4 Cactus'],
  'BMW': ['320i', 'X1', 'X3'],
  'Mercedes-Benz': ['Classe A', 'GLA', 'Sprinter']
};

const coresVeiculos = [
  'Branco', 'Prata', 'Preto', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Amarelo'
];

const estadosBrasileiros = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO'];

function gerarPlaca(): string {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  
  // Formato Mercosul: ABC1D23
  return `${letras[Math.floor(Math.random() * 26)]}${letras[Math.floor(Math.random() * 26)]}${letras[Math.floor(Math.random() * 26)]}${numeros[Math.floor(Math.random() * 10)]}${letras[Math.floor(Math.random() * 26)]}${numeros[Math.floor(Math.random() * 10)]}${numeros[Math.floor(Math.random() * 10)]}`;
}

function gerarRenavam(): string {
  return Math.floor(10000000000 + Math.random() * 90000000000).toString().substring(0, 11);
}

function gerarChassi(): string {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let chassi = '';
  for (let i = 0; i < 17; i++) {
    chassi += chars[Math.floor(Math.random() * chars.length)];
  }
  return chassi;
}

function gerarCPF(): string {
  const n = Math.floor(Math.random() * 999999999);
  return n.toString().padStart(9, '0') + '-' + Math.floor(Math.random() * 99).toString().padStart(2, '0');
}

function gerarCNPJ(): string {
  const n = Math.floor(Math.random() * 99999999);
  return n.toString().padStart(8, '0') + '/0001-' + Math.floor(Math.random() * 99).toString().padStart(2, '0');
}

function gerarTelefone(): string {
  const ddd = ['11', '21', '31', '41', '51', '61', '71', '81', '85', '92'][Math.floor(Math.random() * 10)];
  const numero = Math.floor(900000000 + Math.random() * 100000000);
  return `(${ddd}) 9${numero}`;
}

function gerarEmail(nome: string): string {
  const nomeLimpo = nome.toLowerCase().replace(/\s+/g, '.');
  const dominios = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br'];
  return `${nomeLimpo}@${dominios[Math.floor(Math.random() * dominios.length)]}`;
}

function dataPassada(diasAtras: number): Date {
  const data = new Date();
  data.setDate(data.getDate() - diasAtras);
  return data;
}

function dataFutura(diasFrente: number): Date {
  const data = new Date();
  data.setDate(data.getDate() + diasFrente);
  return data;
}

function randomValue(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

async function main() {
  console.log('🚀 Iniciando população do banco de dados...\n');

  const tenantId = 'tenant-default';

  // 1. CLIENTES (baseado no dataset - 751 registros com histórico)
  console.log('👥 Criando clientes...');
  const csvPath = path.join(__dirname, '../reco-api/dataset.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').slice(1); // Remove header

  const clientes = [];
  const clientesMap = new Map();

  for (let i = 0; i < Math.min(100, lines.length); i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const cols = line.split(',');
    const tipoCliente = cols[0]; // Cliente Final ou Parceiro
    const totalServicos = parseInt(cols[1]) || 0;
    const valorTotalGasto = parseFloat(cols[2]) || 0;

    const isEmpresa = tipoCliente === 'Parceiro';
    const nome = isEmpresa 
      ? empresas[Math.floor(Math.random() * empresas.length)]
      : nomesBrasileiros[Math.floor(Math.random() * nomesBrasileiros.length)];

    const cliente = await prisma.customer.create({
      data: {
        tenantId,
        tipoCliente: isEmpresa ? 'JURIDICO' : 'FISICO',
        status: totalServicos > 3 ? 'ATIVO' : totalServicos > 0 ? 'ATIVO' : 'INATIVO',
        name: nome,
        cpfCnpj: isEmpresa ? gerarCNPJ() : gerarCPF(),
        email: gerarEmail(nome),
        phone: gerarTelefone(),
        endereco: `Rua ${Math.floor(Math.random() * 5000)}`,
        numero: `${Math.floor(Math.random() * 500)}`,
        cidade: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'][Math.floor(Math.random() * 5)],
        estado: estadosBrasileiros[Math.floor(Math.random() * estadosBrasileiros.length)],
        cep: `${Math.floor(10000000 + Math.random() * 90000000)}`.substring(0, 8),
        rg: isEmpresa ? undefined : `${Math.floor(10000000 + Math.random() * 90000000)}`,
        razaoSocial: isEmpresa ? nome : undefined,
        nomeFantasia: isEmpresa ? nome : undefined,
        observacoes: totalServicos > 5 ? 'Cliente VIP - histórico excelente' : totalServicos > 2 ? 'Bom cliente' : undefined,
      }
    });

    clientes.push(cliente);
    clientesMap.set(i, { cliente, totalServicos, linha: cols });
  }
  console.log(`✅ ${clientes.length} clientes criados\n`);

  // 2. VEÍCULOS (2-3 por cliente)
  console.log('🚗 Criando veículos...');
  const veiculos = [];
  for (const cliente of clientes) {
    const numVeiculos = cliente.tipo === 'JURIDICA' ? Math.floor(randomValue(2, 5)) : Math.floor(randomValue(1, 3));
    
    for (let v = 0; v < numVeiculos; v++) {
      const marca = marcasVeiculos[Math.floor(Math.random() * marcasVeiculos.length)];
      const modelos = modelosVeiculos[marca];
      const modelo = modelos[Math.floor(Math.random() * modelos.length)];
      const anoFabricacao = Math.floor(randomValue(2010, 2024));
      
      const veiculo = await prisma.veiculo.create({
        data: {
          tenantId,
          customerId: cliente.id,
          placa: gerarPlaca(),
          renavam: gerarRenavam(),
          chassi: gerarChassi(),
          marca,
          modelo,
          anoFabricacao,
          anoModelo: anoFabricacao + (Math.random() > 0.5 ? 1 : 0),
          cor: coresVeiculos[Math.floor(Math.random() * coresVeiculos.length)],
          status: Math.random() > 0.2 ? 'ATIVO' : 'PENDENTE',
          combustivel: ['Gasolina', 'Etanol', 'Flex', 'Diesel'][Math.floor(Math.random() * 4)],
        }
      });
      veiculos.push({ veiculo, cliente });
    }
  }
  console.log(`✅ ${veiculos.length} veículos criados\n`);

  // 3. PROCESSOS (baseado no histórico do dataset)
  console.log('📋 Criando processos...');
  const processos = [];
  let processosCount = 0;

  for (const [idx, data] of clientesMap.entries()) {
    const { cliente, totalServicos, linha } = data;
    const targetService = linha[linha.length - 1].trim();
    
    // Criar processos históricos
    for (let p = 0; p < Math.min(totalServicos, 5); p++) {
      const diasAtras = Math.floor(randomValue(30, 730)); // últimos 2 anos
      const servicos = ['LICENCIAMENTO', 'TRANSFERENCIA', 'VISTORIA', 'EMPLACAMENTO'];
      const servico = p === 0 ? targetService : servicos[Math.floor(Math.random() * servicos.length)];
      
      const clienteVeiculos = veiculos.filter(v => v.cliente.id === cliente.id);
      if (clienteVeiculos.length === 0) continue;
      
      const veiculoSelecionado = clienteVeiculos[Math.floor(Math.random() * clienteVeiculos.length)];
      
      const processo = await prisma.process.create({
        data: {
          tenantId,
          customerId: cliente.id,
          veiculoId: veiculoSelecionado.veiculo.id,
          numeroProcesso: `PROC-${new Date().getFullYear()}-${(processosCount + 1).toString().padStart(6, '0')}`,
          tipo: 'VEICULO',
          status: Math.random() > 0.3 ? 'CONCLUIDO' : Math.random() > 0.5 ? 'EM_ANDAMENTO' : 'PENDENTE',
          prioridade: Math.random() > 0.7 ? 'ALTA' : 'NORMAL',
          descricao: `${servico} - ${veiculoSelecionado.veiculo.marca} ${veiculoSelecionado.veiculo.modelo}`,
          dataAbertura: dataPassada(diasAtras),
          dataPrevisao: dataPassada(diasAtras - 15),
          dataConclusao: Math.random() > 0.3 ? dataPassada(diasAtras - Math.floor(randomValue(5, 20))) : null,
          valorTotal: randomValue(150, 800),
        }
      });
      processos.push(processo);
      processosCount++;
    }
  }
  console.log(`✅ ${processos.length} processos criados\n`);

  // 4. AVALIAÇÕES
  console.log('🔍 Criando avaliações de veículos...');
  const avaliacoes = [];
  for (let i = 0; i < 30; i++) {
    const veiculo = veiculos[Math.floor(Math.random() * veiculos.length)];
    const tipo: any = ['COMPLETA', 'BASICA', 'LAUDO', 'PERICIA'][Math.floor(Math.random() * 4)];
    const status: any = ['REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 4)];
    
    const avaliacao = await prisma.evaluation.create({
      data: {
        tenantId,
        customerId: veiculo.cliente.id,
        customerName: veiculo.cliente.nome,
        customerPhone: veiculo.cliente.telefone || gerarTelefone(),
        vehicleBrand: veiculo.veiculo.marca,
        vehicleModel: veiculo.veiculo.modelo,
        vehicleYear: veiculo.veiculo.anoFabricacao.toString(),
        vehiclePlate: veiculo.veiculo.placa,
        evaluationType: tipo,
        purpose: ['Compra de veículo usado', 'Venda', 'Seguro', 'Financiamento'][Math.floor(Math.random() * 4)],
        status,
        requestedDate: dataPassada(Math.floor(randomValue(1, 90))),
        scheduledDate: status !== 'REQUESTED' ? dataFutura(Math.floor(randomValue(1, 15))) : null,
        completedDate: status === 'COMPLETED' ? dataPassada(Math.floor(randomValue(1, 30))) : null,
        estimatedValue: randomValue(30000, 120000),
        finalValue: status === 'COMPLETED' ? randomValue(28000, 115000) : null,
        location: veiculo.cliente.cidade || 'São Paulo',
        observations: tipo === 'LAUDO' ? 'Veículo em bom estado geral' : null,
      }
    });
    avaliacoes.push(avaliacao);
  }
  console.log(`✅ ${avaliacoes.length} avaliações criadas\n`);

  // 5. LICENCIAMENTOS
  console.log('📝 Criando licenciamentos...');
  const licenciamentos = [];
  for (let i = 0; i < 50; i++) {
    const veiculo = veiculos[Math.floor(Math.random() * veiculos.length)];
    const exercicio = new Date().getFullYear().toString();
    const status: any = ['PENDING', 'DOCS_SENT', 'PROCESSING', 'COMPLETED'][Math.floor(Math.random() * 4)];
    const taxValue = randomValue(150, 350);
    const serviceValue = 80;
    
    const licenciamento = await prisma.licensing.create({
      data: {
        tenantId,
        customerId: veiculo.cliente.id,
        customerName: veiculo.cliente.nome,
        vehiclePlate: veiculo.veiculo.placa,
        vehicleBrand: veiculo.veiculo.marca,
        vehicleModel: veiculo.veiculo.modelo,
        vehicleYear: veiculo.veiculo.anoFabricacao.toString(),
        renavam: veiculo.veiculo.renavam,
        exercicio,
        expirationDate: new Date(`${exercicio}-12-31`),
        paymentDate: status === 'COMPLETED' ? dataPassada(Math.floor(randomValue(1, 60))) : null,
        status,
        taxValue,
        serviceValue,
        totalValue: taxValue + serviceValue,
        paymentMethod: status === 'COMPLETED' ? ['PIX', 'Cartão', 'Boleto'][Math.floor(Math.random() * 3)] : null,
      }
    });
    licenciamentos.push(licenciamento);
  }
  console.log(`✅ ${licenciamentos.length} licenciamentos criados\n`);

  // 6. TRANSFERÊNCIAS
  console.log('🔄 Criando transferências...');
  const transferencias = [];
  for (let i = 0; i < 40; i++) {
    const veiculo = veiculos[Math.floor(Math.random() * veiculos.length)];
    const comprador = clientes[Math.floor(Math.random() * clientes.length)];
    const status: any = ['PENDING_DOCS', 'DOCS_RECEIVED', 'WAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'COMPLETED'][Math.floor(Math.random() * 5)];
    
    const transferencia = await prisma.transfer.create({
      data: {
        tenantId,
        buyerId: comprador.id,
        buyerName: comprador.nome,
        buyerCpf: comprador.cpfCnpj,
        buyerPhone: comprador.telefone || gerarTelefone(),
        buyerAddress: comprador.endereco || `Rua ${Math.floor(Math.random() * 5000)}`,
        sellerId: veiculo.cliente.id,
        sellerName: veiculo.cliente.nome,
        sellerCpf: veiculo.cliente.cpfCnpj,
        sellerPhone: veiculo.cliente.telefone || gerarTelefone(),
        vehiclePlate: veiculo.veiculo.placa,
        vehicleBrand: veiculo.veiculo.marca,
        vehicleModel: veiculo.veiculo.modelo,
        vehicleYear: veiculo.veiculo.anoFabricacao.toString(),
        chassisNumber: veiculo.veiculo.chassi,
        renavam: veiculo.veiculo.renavam,
        transferValue: randomValue(25000, 90000),
        serviceValue: 350,
        status,
        requestedDate: dataPassada(Math.floor(randomValue(1, 120))),
        completedDate: status === 'COMPLETED' ? dataPassada(Math.floor(randomValue(1, 60))) : null,
      }
    });
    transferencias.push(transferencia);
  }
  console.log(`✅ ${transferencias.length} transferências criadas\n`);

  // 7. DESBLOQUEIOS
  console.log('🔓 Criando desbloqueios...');
  const desbloqueios = [];
  const tiposDesbloqueio: any[] = ['JUDICIAL', 'MULTA', 'ROUBO_FURTO', 'RESTRICAO_AMBIENTAL', 'OUTROS'];
  
  for (let i = 0; i < 25; i++) {
    const veiculo = veiculos[Math.floor(Math.random() * veiculos.length)];
    const tipo = tiposDesbloqueio[Math.floor(Math.random() * tiposDesbloqueio.length)];
    const status: any = ['ANALYSIS', 'PENDING_DOCS', 'PROCESSING', 'COMPLETED'][Math.floor(Math.random() * 4)];
    const unlockValue = randomValue(500, 3000);
    const serviceValue = 250;
    
    const desbloqueio = await prisma.unlock.create({
      data: {
        tenantId,
        customerId: veiculo.cliente.id,
        customerName: veiculo.cliente.nome,
        customerCpf: veiculo.cliente.cpfCnpj,
        customerPhone: veiculo.cliente.telefone || gerarTelefone(),
        vehiclePlate: veiculo.veiculo.placa,
        vehicleBrand: veiculo.veiculo.marca,
        vehicleModel: veiculo.veiculo.modelo,
        vehicleYear: veiculo.veiculo.anoFabricacao.toString(),
        renavam: veiculo.veiculo.renavam,
        unlockType: tipo,
        blockReason: tipo === 'MULTA' ? 'Multas pendentes' : tipo === 'JUDICIAL' ? 'Bloqueio judicial' : 'Restrição administrativa',
        blockDate: dataPassada(Math.floor(randomValue(30, 365))),
        blockEntity: ['Detran', 'Polícia Federal', 'Receita Federal', 'Tribunal'][Math.floor(Math.random() * 4)],
        unlockValue,
        serviceValue,
        totalValue: unlockValue + serviceValue,
        status,
        requestedDate: dataPassada(Math.floor(randomValue(1, 90))),
        completedDate: status === 'COMPLETED' ? dataPassada(Math.floor(randomValue(1, 45))) : null,
      }
    });
    desbloqueios.push(desbloqueio);
  }
  console.log(`✅ ${desbloqueios.length} desbloqueios criados\n`);

  // 8. REGISTROS/EMPLACAMENTOS
  console.log('📋 Criando registros de veículos novos...');
  const registros = [];
  for (let i = 0; i < 20; i++) {
    const cliente = clientes[Math.floor(Math.random() * clientes.length)];
    const marca = marcasVeiculos[Math.floor(Math.random() * marcasVeiculos.length)];
    const modelos = modelosVeiculos[marca];
    const modelo = modelos[Math.floor(Math.random() * modelos.length)];
    const isZeroKm = Math.random() > 0.3;
    const status: any = ['PENDING_DOCS', 'DOCS_RECEIVED', 'IN_ANALYSIS', 'DETRAN_PROCESSING', 'COMPLETED'][Math.floor(Math.random() * 5)];
    
    const registro = await prisma.registration.create({
      data: {
        tenantId,
        customerId: cliente.id,
        customerName: cliente.nome,
        customerCpf: cliente.cpfCnpj,
        vehicleBrand: marca,
        vehicleModel: modelo,
        vehicleYear: new Date().getFullYear().toString(),
        vehicleColor: coresVeiculos[Math.floor(Math.random() * coresVeiculos.length)],
        vehicleType: 'Automóvel',
        chassisNumber: isZeroKm ? gerarChassi() : null,
        isZeroKm,
        invoice: isZeroKm ? `NF-${Math.floor(100000 + Math.random() * 900000)}` : null,
        invoiceDate: isZeroKm ? dataPassada(Math.floor(randomValue(1, 30))) : null,
        dealership: isZeroKm ? ['Concessionária Auto Brasil', 'Dealer Motors', 'Mega Veículos'][Math.floor(Math.random() * 3)] : null,
        status,
        requestedDate: dataPassada(Math.floor(randomValue(1, 60))),
        completedDate: status === 'COMPLETED' ? dataPassada(Math.floor(randomValue(1, 30))) : null,
      }
    });
    registros.push(registro);
  }
  console.log(`✅ ${registros.length} registros criados\n`);

  // 9. LAUDOS TÉCNICOS
  console.log('📄 Criando laudos técnicos...');
  const laudos = [];
  const tiposLaudo: any[] = ['VISTORIA', 'PERICIA', 'AVALIACAO', 'SINISTRO', 'TRANSFERENCIA'];
  const propositos: any[] = ['COMPRA', 'VENDA', 'SEGURO', 'FINANCIAMENTO', 'JUDICIAL'];
  
  for (let i = 0; i < 35; i++) {
    const veiculo = veiculos[Math.floor(Math.random() * veiculos.length)];
    const tipo = tiposLaudo[Math.floor(Math.random() * tiposLaudo.length)];
    const purpose = propositos[Math.floor(Math.random() * propositos.length)];
    const status: any = ['SOLICITADO', 'EM_ANALISE', 'EM_CAMPO', 'ELABORANDO', 'CONCLUIDO'][Math.floor(Math.random() * 5)];
    const priority: any = Math.random() > 0.7 ? 'ALTA' : Math.random() > 0.4 ? 'MEDIA' : 'BAIXA';
    
    const laudo = await prisma.technicalReport.create({
      data: {
        tenantId,
        customerName: veiculo.cliente.nome,
        customerPhone: veiculo.cliente.telefone || gerarTelefone(),
        customerEmail: veiculo.cliente.email,
        vehicleBrand: veiculo.veiculo.marca,
        vehicleModel: veiculo.veiculo.modelo,
        vehicleYear: veiculo.veiculo.anoFabricacao.toString(),
        vehiclePlate: veiculo.veiculo.placa,
        chassisNumber: veiculo.veiculo.chassi,
        reportType: tipo,
        purpose,
        status,
        priority,
        value: randomValue(300, 1200),
        location: veiculo.cliente.cidade || 'São Paulo',
        requestedDate: dataPassada(Math.floor(randomValue(1, 90))),
        scheduledDate: status !== 'SOLICITADO' ? dataFutura(Math.floor(randomValue(1, 15))) : null,
        completedDate: status === 'CONCLUIDO' ? dataPassada(Math.floor(randomValue(1, 45))) : null,
        findings: status === 'CONCLUIDO' ? [
          'Lataria em bom estado',
          'Pintura original',
          'Motor funcionando perfeitamente',
          'Documentação regular'
        ] : [],
        conclusion: status === 'CONCLUIDO' ? 'Veículo aprovado para uso' : null,
        recommendations: status === 'CONCLUIDO' ? ['Revisão em 10.000km', 'Troca de óleo'] : [],
        attachments: status === 'CONCLUIDO' ? ['fotos_veiculo.pdf', 'checklist_tecnico.pdf'] : [],
      }
    });
    laudos.push(laudo);
  }
  console.log(`✅ ${laudos.length} laudos técnicos criados\n`);

  // 10. DESPESAS
  console.log('💸 Criando despesas...');
  const despesas = [];
  const categoriasDespesa = ['OPERACIONAL', 'ADMINISTRATIVA', 'MARKETING', 'TECNOLOGIA', 'PESSOAL'];
  const tiposDespesa = ['FIXA', 'VARIAVEL'];
  
  for (let i = 0; i < 80; i++) {
    const categoria = categoriasDespesa[Math.floor(Math.random() * categoriasDespesa.length)];
    const dataEmissao = dataPassada(Math.floor(randomValue(1, 180)));
    const dataVencimento = new Date(dataEmissao);
    dataVencimento.setDate(dataVencimento.getDate() + 30);
    const isPago = Math.random() > 0.3;
    
    const despesa = await prisma.despesa.create({
      data: {
        tenantId,
        fornecedor: empresas[Math.floor(Math.random() * empresas.length)],
        descricao: `Despesa ${categoria.toLowerCase()} - ${Math.floor(Math.random() * 1000)}`,
        categoria,
        tipoDespesa: tiposDespesa[Math.floor(Math.random() * 2)],
        valor: randomValue(100, 5000),
        dataEmissao,
        dataVencimento,
        dataPagamento: isPago ? dataPassada(Math.floor(randomValue(1, 150))) : null,
        status: isPago ? 'PAGO' : new Date() > dataVencimento ? 'VENCIDO' : 'PENDENTE',
        recorrente: Math.random() > 0.7,
        periodicidade: Math.random() > 0.7 ? 'MENSAL' : null,
        formaPagamento: ['PIX', 'Transferência', 'Boleto', 'Cartão'][Math.floor(Math.random() * 4)],
      }
    });
    despesas.push(despesa);
  }
  console.log(`✅ ${despesas.length} despesas criadas\n`);

  // 11. RECEITAS
  console.log('💰 Criando receitas...');
  const receitas = [];
  
  for (let i = 0; i < processos.length; i++) {
    const processo = processos[i];
    if (processo.status === 'CONCLUIDO' && Math.random() > 0.2) {
      const numeroNF = `NF-${new Date().getFullYear()}-${(i + 1).toString().padStart(5, '0')}`;
      const dataEmissao = processo.dataConclusao || dataPassada(Math.floor(randomValue(1, 180)));
      const dataVencimento = new Date(dataEmissao);
      dataVencimento.setDate(dataVencimento.getDate() + 15);
      const isPago = Math.random() > 0.2;
      
      const receita = await prisma.receita.create({
        data: {
          tenantId,
          numero: numeroNF,
          customerId: processo.customerId,
          customerName: clientes.find(c => c.id === processo.customerId)?.nome || 'Cliente',
          processoId: processo.id,
          servico: processo.descricao || 'Serviço automotivo',
          descricao: `Pagamento ref. ${processo.numeroProcesso}`,
          valor: processo.valorTotal,
          dataEmissao,
          dataVencimento,
          dataPagamento: isPago ? dataPassada(Math.floor(randomValue(1, 150))) : null,
          status: isPago ? 'PAGO' : new Date() > dataVencimento ? 'VENCIDO' : 'PENDENTE',
          metodoPagamento: isPago ? ['PIX', 'Cartão', 'Boleto', 'Dinheiro'][Math.floor(Math.random() * 4)] : null,
        }
      });
      receitas.push(receita);
    }
  }
  console.log(`✅ ${receitas.length} receitas criadas\n`);

  // 12. FLUXO DE CAIXA
  console.log('📊 Criando lançamentos de fluxo de caixa...');
  const fluxoCaixa = [];
  
  // Lançamentos das receitas
  for (const receita of receitas) {
    if (receita.dataPagamento) {
      const lancamento = await prisma.fluxoCaixa.create({
        data: {
          tenantId,
          tipo: 'ENTRADA',
          descricao: receita.descricao,
          categoria: 'RECEITA_SERVICOS',
          origem: receita.customerName,
          valor: receita.valor,
          data: receita.dataPagamento,
          metodoPagamento: receita.metodoPagamento || 'PIX',
        }
      });
      fluxoCaixa.push(lancamento);
    }
  }
  
  // Lançamentos das despesas
  for (const despesa of despesas) {
    if (despesa.dataPagamento) {
      const lancamento = await prisma.fluxoCaixa.create({
        data: {
          tenantId,
          tipo: 'SAIDA',
          descricao: despesa.descricao,
          categoria: despesa.categoria,
          destino: despesa.fornecedor,
          valor: despesa.valor,
          data: despesa.dataPagamento,
          metodoPagamento: despesa.formaPagamento,
        }
      });
      fluxoCaixa.push(lancamento);
    }
  }
  console.log(`✅ ${fluxoCaixa.length} lançamentos de fluxo de caixa criados\n`);

  // Resumo final
  console.log('📈 RESUMO DA POPULAÇÃO DO BANCO:\n');
  console.log(`👥 Clientes: ${clientes.length}`);
  console.log(`🚗 Veículos: ${veiculos.length}`);
  console.log(`📋 Processos: ${processos.length}`);
  console.log(`🔍 Avaliações: ${avaliacoes.length}`);
  console.log(`📝 Licenciamentos: ${licenciamentos.length}`);
  console.log(`🔄 Transferências: ${transferencias.length}`);
  console.log(`🔓 Desbloqueios: ${desbloqueios.length}`);
  console.log(`📋 Registros: ${registros.length}`);
  console.log(`📄 Laudos Técnicos: ${laudos.length}`);
  console.log(`💸 Despesas: ${despesas.length}`);
  console.log(`💰 Receitas: ${receitas.length}`);
  console.log(`📊 Fluxo de Caixa: ${fluxoCaixa.length}`);
  console.log(`\n✅ POPULAÇÃO CONCLUÍDA COM SUCESSO! 🎉`);
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
