// Teste para encontrar as URLs corretas da Brasil API FIPE
const fetch = require('node-fetch');

async function testarUrls() {
  const urlsParaTestar = [
    'https://brasilapi.com.br/api/fipe/brands/v1/cars',
    'https://brasilapi.com.br/api/fipe/marcas/v1/carros', 
    'https://brasilapi.com.br/api/fipe/preco/v1/carros',
    'https://brasilapi.com.br/api/fipe/tabelas/v1',
    'https://brasilapi.com.br/api/fipe/tables/v1'
  ];

  for (const url of urlsParaTestar) {
    try {
      console.log(`\nTestando: ${url}`);
      const response = await fetch(url);
      console.log(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Sucesso! Primeiros itens:`, JSON.stringify(data.slice(0, 3), null, 2));
      } else {
        console.log(`❌ Erro: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ Erro de conexão: ${error.message}`);
    }
  }
}

testarUrls();
