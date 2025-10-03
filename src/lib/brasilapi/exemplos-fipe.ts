// Exemplos de uso da FIPE - Brasil API
// Para testar funcionalidades de consulta veicular

import { fipeService } from '@/lib/brasilapi';

// ===== EXEMPLOS FIPE =====
export async function exemplosFipe() {
  console.log('🚗 === TESTANDO FIPE ===');

  try {
    // 1. Buscar marcas de carros
    console.log('\n1. Buscando marcas de carros...');
    const marcasCarros = await fipeService.getMarcas('carros');
    console.log(`✅ Encontradas ${marcasCarros.length} marcas de carros`);
    console.log('Primeiras 5 marcas:', marcasCarros.slice(0, 5));

    // 2. Buscar marcas de motos
    console.log('\n2. Buscando marcas de motos...');
    const marcasMotos = await fipeService.getMarcas('motos');
    console.log(`✅ Encontradas ${marcasMotos.length} marcas de motos`);
    console.log('Primeiras 3 marcas:', marcasMotos.slice(0, 3));

    // 3. Buscar tabelas FIPE disponíveis
    console.log('\n3. Buscando tabelas FIPE...');
    const tabelas = await fipeService.getTabelas();
    console.log(`✅ Encontradas ${tabelas.length} tabelas`);
    if (tabelas.length > 0) {
      console.log('Última tabela:', tabelas[0]);
    }

    // 4. Teste de formatação de valores
    const valorTeste = 'R$ 45.000,00';
    const valorFormatado = fipeService.formatarValor(valorTeste);
    const valorNumerico = fipeService.extrairValorNumerico(valorTeste);
    console.log('\n4. Teste de formatação:');
    console.log('💰 Valor original:', valorTeste);
    console.log('💰 Valor formatado:', valorFormatado);
    console.log('🔢 Valor numérico:', valorNumerico);

  } catch (error) {
    console.error('❌ Erro nos exemplos FIPE:', error);
  }
}

// Executar exemplos se chamado diretamente
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.exemplosFipe = exemplosFipe;
  console.log('📚 Exemplos FIPE carregados! Use window.exemplosFipe() para testar');
}

export default exemplosFipe;
