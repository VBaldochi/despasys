import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Funções auxiliares
function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return Math.floor(random(min, max + 1));
}

function randomItem<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

function dateAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function dateFuture(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

const nomes = ['João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Souza', 'Juliana Lima', 'Rafael Pereira', 'Fernanda Alves', 'Lucas Rodrigues', 'Mariana Ferreira'];
const empresas = ['Auto Peças Central', 'Transportadora Rápida Ltda', 'Mecânica Silva & Irmãos', 'Logística Express', 'Comércio de Veículos SP'];
const marcas = ['Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 'Honda', 'Toyota', 'Hyundai'];
const modelos: Record<string, string[]> = {
  'Volkswagen': ['Gol', 'Polo', 'T-Cross'],
  'Chevrolet': ['Onix', 'Tracker', 'S10'],
  'Fiat': ['Argo', 'Cronos', 'Toro'],
  'Ford': ['Ka', 'EcoSport', 'Ranger'],
  'Honda': ['Civic', 'HR-V', 'City'],
  'Toyota': ['Corolla', 'Hilux', 'Yaris'],
  'Hyundai': ['HB20', 'Creta', 'Tucson']
};
const cores = ['Branco', 'Prata', 'Preto', 'Cinza', 'Vermelho', 'Azul'];

function gerarPlaca(): string {
  const l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const n = '0123456789';
  return `${l[randomInt(0,25)]}${l[randomInt(0,25)]}${l[randomInt(0,25)]}${n[randomInt(0,9)]}${l[randomInt(0,25)]}${n[randomInt(0,9)]}${n[randomInt(0,9)]}`;
}

function gerarCPF(): string {
  return `${randomInt(100000000, 999999999)}-${randomInt(10, 99)}`;
}

function gerarCNPJ(): string {
  return `${randomInt(10000000, 99999999)}/0001-${randomInt(10, 99)}`;
}

function gerarTelefone(): string {
  const ddds = ['11', '21', '31', '41', '51'];
  return `(${randomItem(ddds)}) 9${randomInt(90000000, 99999999)}`;
}

async function main() {
  console.log('🚀 Populando banco de dados...\n');

  // Usar primeiro tenant do banco
  const firstTenant = await prisma.tenant.findFirst();  
  if (!firstTenant) throw new Error('Nenhum tenant encontrado no banco');
  const tenantId = firstTenant.id;
  
  // Buscar usuário admin
  const admin = await prisma.user.findFirst({ where: { tenantId } });
  if (!admin) throw new Error('Usuário admin não encontrado');
  
  console.log(`📍 Usando tenant: ${firstTenant.name} (${tenantId})\n`);

  // 1. CLIENTES (50 clientes)
  console.log('👥 Criando clientes...');
  const clientes = [];
  for (let i = 0; i < 50; i++) {
    const isEmpresa = Math.random() > 0.7;
    const nome = isEmpresa ? randomItem(empresas) : randomItem(nomes);
    
    const cliente = await prisma.customer.create({
      data: {
        tenantId,
        name: nome,
        phone: gerarTelefone(),
        cpfCnpj: isEmpresa ? gerarCNPJ() : gerarCPF(),
        tipoCliente: isEmpresa ? 'JURIDICO' : 'FISICO',
        email: `${nome.toLowerCase().replace(/\s+/g, '.')}@email.com`,
        endereco: `Rua ${randomInt(1, 5000)}`,
        numero: `${randomInt(1, 500)}`,
        cidade: randomItem(['São Paulo', 'Rio de Janeiro', 'Belo Horizonte']),
        estado: randomItem(['SP', 'RJ', 'MG']),
        cep: `${randomInt(10000000, 99999999)}`.substring(0, 8),
        status: randomItem(['ATIVO', 'INATIVO']),
        razaoSocial: isEmpresa ? nome : undefined,
      }
    });
    clientes.push(cliente);
  }
  console.log(`✅ ${clientes.length} clientes\n`);

  // 2. VEÍCULOS (100 veículos)
  console.log('🚗 Criando veículos...');
  const veiculos = [];
  for (let i = 0; i < 100; i++) {
    const marca = randomItem(marcas);
    const veiculo = await prisma.veiculo.create({
      data: {
        tenantId,
        customerId: randomItem(clientes).id,
        placa: gerarPlaca(),
        renavam: `${randomInt(10000000000, 99999999999)}`,
        chassi: `${randomInt(10000000000000000, 99999999999999999)}`,
        marca,
        modelo: randomItem(modelos[marca]),
        ano: randomInt(2010, 2024),
        anoModelo: randomInt(2010, 2024),
        cor: randomItem(cores),
        combustivel: randomItem(['Gasolina', 'Etanol', 'Flex', 'Diesel']),
        categoria: 'Automóvel',
        status: randomItem(['ATIVO', 'VENDIDO', 'SINISTRADO', 'FURTO']),
      }
    });
    veiculos.push(veiculo);
  }
  console.log(`✅ ${veiculos.length} veículos\n`);

  // 3. PROCESSOS (80 processos)
  console.log('📋 Criando processos...');
  const processos = [];
  for (let i = 0; i < 80; i++) {
    const veiculo = randomItem(veiculos);
    const processo = await prisma.process.create({
      data: {
        tenantId,
        numero: `PROC-${new Date().getFullYear()}-${(i + 1).toString().padStart(5, '0')}`,
        customerId: veiculo.customerId,
        veiculoId: veiculo.id,
        responsavelId: admin.id,
        tipoServico: randomItem(['LICENCIAMENTO', 'TRANSFERENCIA', 'PRIMEIRO_EMPLACAMENTO', 'SEGUNDA_VIA', 'DESBLOQUEIO', 'ALTERACAO_CARACTERISTICAS']),
        titulo: `Processo ${randomItem(['Licenciamento', 'Transferência', 'Vistoria'])} ${veiculo.placa}`,
        descricao: `Processo para ${veiculo.marca} ${veiculo.modelo}`,
        status: randomItem(['AGUARDANDO_DOCUMENTOS', 'DOCUMENTOS_RECEBIDOS', 'EM_ANALISE', 'EM_PROCESSAMENTO', 'FINALIZADO', 'CANCELADO']),
        prioridade: randomItem(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']),
        dataInicio: dateAgo(randomInt(1, 180)),
        prazoLegal: dateFuture(randomInt(1, 30)),
        valorTotal: random(200, 1500),
        valorTaxas: random(100, 500),
        valorServico: random(100, 500),
        statusPagamento: randomItem(['PENDENTE', 'PARCIAL', 'PAGO', 'VENCIDO', 'CANCELADO']),
      }
    });
    processos.push(processo);
  }
  console.log(`✅ ${processos.length} processos\n`);

  // 4. AVALIAÇÕES (30)
  console.log('🔍 Criando avaliações...');
  for (let i = 0; i < 30; i++) {
    const veiculo = randomItem(veiculos);
    const cliente = clientes.find(c => c.id === veiculo.customerId);
    if (!cliente) continue;

    await prisma.evaluation.create({
      data: {
        tenantId,
        customerId: cliente.id,
        customerName: cliente.name,
        customerPhone: cliente.phone,
        vehicleBrand: veiculo.marca,
        vehicleModel: veiculo.modelo,
        vehicleYear: veiculo.ano.toString(),
        vehiclePlate: veiculo.placa,
        evaluationType: randomItem(['COMPLETA', 'BASICA', 'LAUDO', 'PERICIA']),
        purpose: randomItem(['Compra', 'Venda', 'Seguro', 'Financiamento']),
        status: randomItem(['REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
        requestedDate: dateAgo(randomInt(1, 60)),
        location: cliente.cidade || 'São Paulo',
        estimatedValue: random(20000, 100000),
      }
    });
  }
  console.log('✅ 30 avaliações\n');

  // 5. LICENCIAMENTOS (40)
  console.log('📝 Criando licenciamentos...');
  for (let i = 0; i < 40; i++) {
    const veiculo = randomItem(veiculos);
    const cliente = clientes.find(c => c.id === veiculo.customerId);
    if (!cliente) continue;

    const taxValue = random(150, 400);
    const serviceValue = 80;

    await prisma.licensing.create({
      data: {
        tenantId,
        customerId: cliente.id,
        customerName: cliente.name,
        vehiclePlate: veiculo.placa,
        vehicleBrand: veiculo.marca,
        vehicleModel: veiculo.modelo,
        vehicleYear: veiculo.ano.toString(),
        renavam: veiculo.renavam || `${randomInt(10000000000, 99999999999)}`,
        exercicio: new Date().getFullYear().toString(),
        expirationDate: new Date(`${new Date().getFullYear()}-12-31`),
        status: randomItem(['PENDING', 'DOCS_SENT', 'PROCESSING', 'COMPLETED', 'OVERDUE', 'CANCELLED']),
        taxValue,
        serviceValue,
        totalValue: taxValue + serviceValue,
      }
    });
  }
  console.log('✅ 40 licenciamentos\n');

  // 6. TRANSFERÊNCIAS (25)
  console.log('🔄 Criando transferências...');
  for (let i = 0; i < 25; i++) {
    const veiculo = randomItem(veiculos);
    const vendedor = clientes.find(c => c.id === veiculo.customerId);
    const comprador = randomItem(clientes);
    if (!vendedor || !comprador) continue;

    await prisma.transfer.create({
      data: {
        tenantId,
        buyerId: comprador.id,
        buyerName: comprador.name,
        buyerCpf: comprador.cpfCnpj,
        buyerPhone: comprador.phone,
        buyerAddress: `${comprador.endereco}, ${comprador.numero}`,
        sellerId: vendedor.id,
        sellerName: vendedor.name,
        sellerCpf: vendedor.cpfCnpj,
        sellerPhone: vendedor.phone,
        vehiclePlate: veiculo.placa,
        vehicleBrand: veiculo.marca,
        vehicleModel: veiculo.modelo,
        vehicleYear: veiculo.ano.toString(),
        chassisNumber: veiculo.chassi,
        renavam: veiculo.renavam || `${randomInt(10000000000, 99999999999)}`,
        transferValue: random(25000, 90000),
        serviceValue: 350,
        status: randomItem(['PENDING_DOCS', 'DOCS_RECEIVED', 'WAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'DETRAN_PROCESSING', 'COMPLETED', 'CANCELLED']),
        requestedDate: dateAgo(randomInt(1, 90)),
      }
    });
  }
  console.log('✅ 25 transferências\n');

  // 7. DESBLOQUEIOS (20)
  console.log('🔓 Criando desbloqueios...');
  for (let i = 0; i < 20; i++) {
    const veiculo = randomItem(veiculos);
    const cliente = clientes.find(c => c.id === veiculo.customerId);
    if (!cliente) continue;

    const unlockValue = random(500, 3000);
    const serviceValue = 250;

    await prisma.unlock.create({
      data: {
        tenantId,
        customerId: cliente.id,
        customerName: cliente.name,
        customerCpf: cliente.cpfCnpj,
        customerPhone: cliente.phone,
        vehiclePlate: veiculo.placa,
        vehicleBrand: veiculo.marca,
        vehicleModel: veiculo.modelo,
        vehicleYear: veiculo.ano.toString(),
        renavam: veiculo.renavam || `${randomInt(10000000000, 99999999999)}`,
        unlockType: randomItem(['JUDICIAL', 'MULTA', 'ROUBO_FURTO', 'RESTRICAO_AMBIENTAL', 'RESTRICAO_JUDICIAL', 'OUTROS']),
        blockReason: randomItem(['Multas pendentes', 'Bloqueio judicial', 'Restrição administrativa']),
        blockDate: dateAgo(randomInt(30, 365)),
        blockEntity: randomItem(['Detran', 'Polícia Federal', 'Receita Federal', 'Tribunal']),
        unlockValue,
        serviceValue,
        totalValue: unlockValue + serviceValue,
        status: randomItem(['ANALYSIS', 'PENDING_DOCS', 'PROCESSING', 'DETRAN_PROCESSING', 'COMPLETED', 'CANCELLED']),
        requestedDate: dateAgo(randomInt(1, 60)),
      }
    });
  }
  console.log('✅ 20 desbloqueios\n');

  // 8. REGISTROS (15)
  console.log('📋 Criando registros...');
  for (let i = 0; i < 15; i++) {
    const cliente = randomItem(clientes);
    const marca = randomItem(marcas);

    await prisma.registration.create({
      data: {
        tenantId,
        customerId: cliente.id,
        customerName: cliente.name,
        customerCpf: cliente.cpfCnpj,
        vehicleBrand: marca,
        vehicleModel: randomItem(modelos[marca]),
        vehicleYear: new Date().getFullYear().toString(),
        vehicleColor: randomItem(cores),
        vehicleType: 'Automóvel',
        isZeroKm: Math.random() > 0.5,
        status: randomItem(['PENDING_DOCS', 'DOCS_RECEIVED', 'IN_ANALYSIS', 'DETRAN_PROCESSING', 'COMPLETED', 'CANCELLED']),
        requestedDate: dateAgo(randomInt(1, 45)),
      }
    });
  }
  console.log('✅ 15 registros\n');

  // 9. LAUDOS TÉCNICOS (25)
  console.log('📄 Criando laudos técnicos...');
  for (let i = 0; i < 25; i++) {
    const veiculo = randomItem(veiculos);
    const cliente = clientes.find(c => c.id === veiculo.customerId);
    if (!cliente) continue;

    await prisma.technicalReport.create({
      data: {
        tenantId,
        customerName: cliente.name,
        customerPhone: cliente.phone,
        customerEmail: cliente.email,
        vehicleBrand: veiculo.marca,
        vehicleModel: veiculo.modelo,
        vehicleYear: veiculo.ano.toString(),
        vehiclePlate: veiculo.placa,
        chassisNumber: veiculo.chassi,
        reportType: randomItem(['VISTORIA', 'PERICIA', 'AVALIACAO', 'SINISTRO', 'TRANSFERENCIA']),
        purpose: randomItem(['COMPRA', 'VENDA', 'SEGURO', 'FINANCIAMENTO', 'JUDICIAL', 'ADMINISTRATIVO']),
        status: randomItem(['SOLICITADO', 'EM_ANALISE', 'EM_CAMPO', 'ELABORANDO', 'CONCLUIDO', 'CANCELADO']),
        priority: randomItem(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']),
        value: random(300, 1200),
        location: cliente.cidade || 'São Paulo',
        requestedDate: dateAgo(randomInt(1, 60)),
        findings: [],
        recommendations: [],
        attachments: [],
      }
    });
  }
  console.log('✅ 25 laudos técnicos\n');

  // 10. DESPESAS (60)
  console.log('💸 Criando despesas...');
  for (let i = 0; i < 60; i++) {
    const dataEmissao = dateAgo(randomInt(1, 120));
    const dataVencimento = new Date(dataEmissao);
    dataVencimento.setDate(dataVencimento.getDate() + 30);
    const isPago = Math.random() > 0.3;

    await prisma.despesa.create({
      data: {
        tenantId,
        fornecedor: randomItem(empresas),
        descricao: `Despesa ${randomItem(['Operacional', 'Administrativa', 'Marketing'])}`,
        categoria: randomItem(['OPERACIONAL', 'ADMINISTRATIVA', 'MARKETING', 'TECNOLOGIA', 'PESSOAL']),
        tipoDespesa: randomItem(['FIXA', 'VARIAVEL']),
        valor: random(100, 5000),
        dataEmissao,
        dataVencimento,
        dataPagamento: isPago ? dateAgo(randomInt(1, 100)) : null,
        status: isPago ? 'PAGO' : 'PENDENTE',
        recorrente: Math.random() > 0.7,
        formaPagamento: randomItem(['PIX', 'Transferência', 'Boleto', 'Cartão']),
      }
    });
  }
  console.log('✅ 60 despesas\n');

  // 11. RECEITAS (50)
  console.log('💰 Criando receitas...');
  for (let i = 0; i < 50; i++) {
    const cliente = randomItem(clientes);
    const processo = randomItem(processos);
    const dataEmissao = dateAgo(randomInt(1, 120));
    const dataVencimento = new Date(dataEmissao);
    dataVencimento.setDate(dataVencimento.getDate() + 15);
    const isPago = Math.random() > 0.2;

    await prisma.receita.create({
      data: {
        tenantId,
        numero: `NF-${new Date().getFullYear()}-${(i + 1).toString().padStart(5, '0')}`,
        customerId: cliente.id,
        customerName: cliente.name,
        processoId: processo.id,
        servico: processo.titulo,
        descricao: `Pagamento ref. ${processo.numero}`,
        valor: processo.valorTotal,
        dataEmissao,
        dataVencimento,
        dataPagamento: isPago ? dateAgo(randomInt(1, 100)) : null,
        status: isPago ? 'PAGO' : 'PENDENTE',
        metodoPagamento: isPago ? randomItem(['PIX', 'Cartão', 'Boleto', 'Dinheiro']) : null,
      }
    });
  }
  console.log('✅ 50 receitas\n');

  console.log('📊 RESUMO:');
  console.log(`👥 Clientes: ${clientes.length}`);
  console.log(`🚗 Veículos: ${veiculos.length}`);
  console.log(`📋 Processos: ${processos.length}`);
  console.log(`🔍 Avaliações: 30`);
  console.log(`📝 Licenciamentos: 40`);
  console.log(`🔄 Transferências: 25`);
  console.log(`🔓 Desbloqueios: 20`);
  console.log(`📋 Registros: 15`);
  console.log(`📄 Laudos Técnicos: 25`);
  console.log(`💸 Despesas: 60`);
  console.log(`💰 Receitas: 50`);
  console.log('\n✅ BANCO POPULADO COM SUCESSO! 🎉');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
