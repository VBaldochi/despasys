/* 
Exemplos de uso da integração Brasil API
Demonstra as principais funcionalidades disponíveis
*/

/*
import { 
  cepService, 
  cnpjService, 
  cpfService, 
  fipeService, 
  dddService, 
  bancoService, 
  feriadoService, 
  ibgeService,
  brasilApi,
  brasilApiUtils
} from '@/lib/brasilapi';
*/

import { 
  cepService, 
  cnpjService, 
  cpfService, 
  fipeService, 
  dddService, 
  bancoService, 
  feriadoService, 
  ibgeService,
  brasilApi 
} from './index';

// ===== EXEMPLOS FIPE =====
export async function exemplosFipe() {
  console.log('🚗 === TESTANDO FIPE ===');

  try {
    // 1. Buscar marcas de carros
    console.log('1. Buscando marcas de carros...');
    const marcasCarros = await fipeService.getMarcas('carros');
    console.log(`✅ Encontradas ${marcasCarros.length} marcas de carros`);
    console.log('Primeiras 5 marcas:', marcasCarros.slice(0, 5));

    // 2. Buscar marcas de motos
    console.log('2. Buscando marcas de motos...');
    const marcasMotos = await fipeService.getMarcas('motos');
    console.log(`✅ Encontradas ${marcasMotos.length} marcas de motos`);
    console.log('Primeiras 3 marcas:', marcasMotos.slice(0, 3));

    // 3. Buscar veículos de uma marca específica (ex: Honda)
    const marcaHonda = marcasCarros.find(m => 
      m.nome.toLowerCase().includes('honda')
    );
    
    if (marcaHonda) {
      console.log('3. Buscando veículos Honda...');
      const veiculosHonda = await fipeService.getVeiculos('carros', marcaHonda.codigo);
      console.log(`✅ Encontrados ${veiculosHonda.length} veículos Honda`);
      console.log('Primeiros 3 veículos:', veiculosHonda.slice(0, 3));

      // 4. Buscar preço de um veículo específico
      if (veiculosHonda.length > 0) {
        const primeiroVeiculo = veiculosHonda[0];
        console.log('4. Buscando preço do veículo...');
        console.log(`Veículo: ${primeiroVeiculo.nome}`);
        
        const preco = await fipeService.getPreco(primeiroVeiculo.codigoFipe);
        const precoInfo = Array.isArray(preco) ? preco[0] : preco;
        console.log('✅ Preço encontrado:', {
          valor: precoInfo.valor,
          modelo: precoInfo.modelo,
          anoModelo: precoInfo.anoModelo,
          combustivel: precoInfo.combustivel,
          mesReferencia: precoInfo.mesReferencia
        });

        // 5. Formatação de valor
        const valorFormatado = fipeService.formatarValor(precoInfo.valor);
        const valorNumerico = fipeService.extrairValorNumerico(precoInfo.valor);
        console.log('💰 Valor formatado:', valorFormatado);
        console.log('🔢 Valor numérico:', valorNumerico);
      }
    }

    // 6. Buscar tabelas FIPE disponíveis
    console.log('6. Buscando tabelas FIPE...');
    const tabelas = await fipeService.getTabelas();
    console.log(`✅ Encontradas ${tabelas.length} tabelas`);
    console.log('Última tabela:', tabelas[0]);

    // 7. Busca completa (serviço unificado)
    console.log('7. Testando busca completa...');
    const buscaCompleta = await fipeService.getBuscaCompleta('carros', 'Honda', 'Civic');
    console.log('✅ Busca completa:', {
      marca: buscaCompleta.marca?.nome,
      totalVeiculos: buscaCompleta.veiculo ? 1 : 0,
      totalPrecos: buscaCompleta.preco?.length || 0
    });

  } catch (error) {
    console.error('❌ Erro nos exemplos FIPE:', error);
  }
}

// =========== EXEMPLOS DE USO ===========

/**
 * Exemplo 1: Validação automática de documentos
 */
export async function exemploValidacaoAutomatica() {
  console.log('=== Validação Automática de Documentos ===\n');

  const documentos = [
    '01234567890',     // CPF
    '12345678000123',  // CNPJ
    '01310-100'        // CEP
  ];

  for (const documento of documentos) {
    try {
      const resultado = await brasilApi.validarDado(documento);
      console.log(`Documento: ${documento}`);
      console.log(`Tipo: ${resultado.tipo.toUpperCase()}`);
      console.log(`Válido: ${resultado.valido ? '✅' : '❌'}`);
      console.log(`Formatado: ${resultado.formatado}`);
      
      if (resultado.dados) {
        console.log('Dados encontrados:');
        if (resultado.tipo === 'cep') {
          const endereco = resultado.dados;
          console.log(`  - Endereço: ${endereco.street || 'N/A'}`);
          console.log(`  - Bairro: ${endereco.neighborhood || 'N/A'}`);
          console.log(`  - Cidade: ${endereco.city}`);
          console.log(`  - Estado: ${endereco.state}`);
        } else if (resultado.tipo === 'cpf') {
          const cpfInfo = resultado.dados;
          console.log(`  - Estado: ${cpfInfo.estado}`);
          console.log(`  - Região: ${cpfInfo.regiao}`);
        } else if (resultado.tipo === 'cnpj') {
          const empresa = resultado.dados;
          console.log(`  - Razão Social: ${empresa.razao_social}`);
          console.log(`  - Situação: ${empresa.descricao_situacao_cadastral}`);
        }
      }
      
      if (resultado.erro) {
        console.log(`Erro: ${resultado.erro}`);
      }
      
      console.log('---\n');
    } catch (error) {
      console.error(`Erro ao validar ${documento}:`, error);
    }
  }
}

/**
 * Exemplo 2: Validação completa de cliente
 */
export async function exemploValidacaoCliente() {
  console.log('=== Validação Completa de Cliente ===\n');

  const dadosCliente = {
    cpf: '12345678909',
    cnpj: '11222333000181', // CNPJ da Magazine Luiza (exemplo)
    cep: '01310-100'
  };

  try {
    const resultado = await brasilApi.validarCliente(dadosCliente);
    
    console.log(`Cliente válido: ${resultado.valido ? '✅' : '❌'}`);
    
    if (resultado.cpf) {
      console.log('\n📄 CPF:');
      console.log(`  - Formatado: ${resultado.cpf.formatado}`);
      console.log(`  - Estado: ${resultado.cpf.estado}`);
      console.log(`  - Região: ${resultado.cpf.regiao}`);
    }
    
    if (resultado.cnpj) {
      console.log('\n🏢 CNPJ:');
      console.log(`  - Razão Social: ${resultado.cnpj.razao_social}`);
      console.log(`  - Nome Fantasia: ${resultado.cnpj.nome_fantasia || 'N/A'}`);
      console.log(`  - Situação: ${resultado.cnpj.descricao_situacao_cadastral}`);
      console.log(`  - Porte: ${resultado.cnpj.descricao_porte}`);
    }
    
    if (resultado.endereco) {
      console.log('\n📍 Endereço:');
      console.log(`  - Logradouro: ${resultado.endereco.street || 'N/A'}`);
      console.log(`  - Bairro: ${resultado.endereco.neighborhood || 'N/A'}`);
      console.log(`  - Cidade: ${resultado.endereco.city}`);
      console.log(`  - Estado: ${resultado.endereco.state}`);
    }
    
    if (resultado.erros.length > 0) {
      console.log('\n❌ Erros encontrados:');
      resultado.erros.forEach(erro => console.log(`  - ${erro}`));
    }
    
  } catch (error) {
    console.error('Erro na validação do cliente:', error);
  }
}

/**
 * Exemplo 3: Consulta de veículo FIPE
 */
export async function exemploConsultaVeiculo() {
  console.log('=== Consulta de Veículo FIPE ===\n');

  try {
    const resultado = await brasilApi.consultarVeiculo('carros', 'FIAT', 'UNO');
    
    if (resultado.marca) {
      console.log(`🚗 Marca encontrada: ${resultado.marca.nome} (${resultado.marca.codigo})`);
    }
    
    if (resultado.veiculo) {
      console.log(`🚙 Veículo: ${resultado.veiculo.nome}`);
      console.log(`   Código FIPE: ${resultado.veiculo.codigoFipe}`);
    }
    
    if (resultado.preco && resultado.preco.length > 0) {
      const preco = resultado.preco[0];
      console.log('\n💰 Preço FIPE:');
      console.log(`  - Valor: ${resultado.valorFormatado}`);
      console.log(`  - Ano/Modelo: ${preco.anoModelo}`);
      console.log(`  - Combustível: ${preco.combustivel}`);
      console.log(`  - Mês Referência: ${preco.mesReferencia}`);
      console.log(`  - Valor Numérico: R$ ${resultado.valorNumerico?.toLocaleString('pt-BR')}`);
    } else {
      console.log('❌ Veículo não encontrado');
    }
    
  } catch (error) {
    console.error('Erro na consulta do veículo:', error);
  }
}

/**
 * Exemplo 4: Autocompletar endereço
 */
export async function exemploAutocompletarEndereco() {
  console.log('=== Autocompletar Endereço ===\n');

  const ceps = ['01310-100', '20040-020', '30112-000'];

  for (const cep of ceps) {
    try {
      const resultado = await brasilApi.autocompletarEndereco(cep);
      
      console.log(`CEP: ${cep}`);
      
      if (resultado.success && resultado.endereco) {
        console.log('✅ Endereço encontrado:');
        console.log(`  - Logradouro: ${resultado.endereco.logradouro}`);
        console.log(`  - Bairro: ${resultado.endereco.bairro}`);
        console.log(`  - Cidade: ${resultado.endereco.cidade}`);
        console.log(`  - Estado: ${resultado.endereco.estado}`);
      } else {
        console.log(`❌ ${resultado.erro}`);
      }
      
      console.log('---\n');
    } catch (error) {
      console.error(`Erro ao buscar CEP ${cep}:`, error);
    }
  }
}

/**
 * Exemplo 5: Formatação inteligente
 */
export function exemploFormatacao() {
  console.log('=== Formatação Inteligente ===\n');

  const documentos = [
    '12345678909',      // CPF
    '12345678000123',   // CNPJ
    '01310100',         // CEP
    'abc123',           // Inválido
  ];

  documentos.forEach(doc => {
    const tipo = brasilApi.formatadores.detectarTipo(doc);
    const formatado = brasilApi.formularios.autoFormatar(doc);
    
    console.log(`Original: ${doc}`);
    console.log(`Tipo detectado: ${tipo}`);
    console.log(`Formatado: ${formatado}`);
    console.log('---');
  });
}

/**
 * Exemplo 6: Validações rápidas
 */
export async function exemploValidacoesRapidas() {
  console.log('=== Validações Rápidas ===\n');

  const cpf = '12345678909';
  const cnpj = '11222333000181';
  const cep = '01310-100';

  console.log(`CPF ${cpf} válido: ${brasilApi.validadores.cpf(cpf) ? '✅' : '❌'}`);
  console.log(`CNPJ ${cnpj} válido: ${await brasilApi.validadores.cnpj(cnpj) ? '✅' : '❌'}`);
  console.log(`CEP ${cep} válido: ${await brasilApi.validadores.cep(cep) ? '✅' : '❌'}`);
}

/**
 * Exemplo 7: Uso dos utilitários globais
 */
export async function exemploUtilitarios() {
  console.log('=== Utilitários Globais ===\n');

  // Constantes úteis
  console.log('Tipos de veículo:', brasilApiUtils.TIPOS_VEICULO);
  console.log('Estados do Brasil:', brasilApiUtils.ESTADOS_BRASIL.slice(0, 5), '...');

  // Validação completa de documento
  const documento = '12345678909';
  const resultado = await brasilApiUtils.validarDocumentoCompleto(documento);
  console.log(`\nDocumento ${documento}:`);
  console.log(`Válido: ${resultado.valido ? '✅' : '❌'}`);
  console.log(`Tipo: ${resultado.tipo}`);

  // Formatação inteligente
  const documentos = ['12345678909', '12345678000123', '01310100'];
  console.log('\nFormatação inteligente:');
  documentos.forEach(doc => {
    console.log(`${doc} → ${brasilApiUtils.formatarDocumento(doc)}`);
  });
}

/**
 * Exemplo 8: Validação em tempo real (para formulários)
 */
export function exemploValidacaoTempoReal() {
  console.log('=== Validação em Tempo Real ===\n');

  const cpfParcial = ['1', '12', '123', '1234567890', '12345678909'];
  
  console.log('Simulando digitação de CPF:');
  cpfParcial.forEach(cpf => {
    const resultado = brasilApi.formularios.validarCpfTempoReal(cpf);
    console.log(`"${cpf}" → Status: ${resultado.status}, Mensagem: ${resultado.mensagem}, Formatado: "${resultado.formatado}"`);
  });
}

// =========== FUNÇÃO PRINCIPAL PARA EXECUTAR TODOS OS EXEMPLOS ===========

export async function executarTodosExemplos() {
  console.log('🇧🇷 DEMONSTRAÇÃO COMPLETA DA INTEGRAÇÃO BRASIL API 🇧🇷\n');
  console.log('=========================================================\n');

  try {
    await exemploValidacaoAutomatica();
    await exemploValidacaoCliente();
    await exemploConsultaVeiculo();
    await exemploAutocompletarEndereco();
    exemploFormatacao();
    await exemploValidacoesRapidas();
    await exemploUtilitarios();
    exemploValidacaoTempoReal();
    
    console.log('\n✅ Todos os exemplos executados com sucesso!');
    console.log('\n📚 A integração Brasil API está funcionando perfeitamente!');
    console.log('🚀 Você pode usar essas funcionalidades em seus formulários e validações.');
    
  } catch (error) {
    console.error('❌ Erro durante a execução dos exemplos:', error);
  }
}

// Para executar os exemplos individualmente, descomente as linhas abaixo:
// exemploValidacaoAutomatica();
// exemploValidacaoCliente();
// exemploConsultaVeiculo();
// exemploAutocompletarEndereco();
// exemploFormatacao();
// exemploValidacoesRapidas();
// exemploUtilitarios();
// exemploValidacaoTempoReal();

// Para executar todos os exemplos:
// executarTodosExemplos();
