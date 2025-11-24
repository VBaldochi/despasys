import { prisma } from '../src/lib/prisma';

async function testMLIntegration() {
  console.log('🧪 Testando Integração ML...\n');

  try {
    // 1. Verificar tenant
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      console.error('❌ Nenhum tenant encontrado!');
      return;
    }

    console.log('✅ Tenant encontrado:');
    console.log(`   ID: ${tenant.id}`);
    console.log(`   Nome: ${tenant.name}`);
    console.log(`   Domain: ${tenant.domain}`);
    console.log('');

    // 2. Teste de health check ML API
    console.log('🔍 Testando ML API health...');
    const healthResponse = await fetch('http://localhost:8020/healthz');
    
    if (!healthResponse.ok) {
      console.error('❌ ML API não está respondendo!');
      console.log('   Certifique-se que a ML API está rodando na porta 8020');
      return;
    }

    const health = await healthResponse.json();
    console.log('✅ ML API está online:', health);
    console.log('');

    // 3. Verificar se modelo existe
    console.log(`🤖 Verificando modelo ML para tenant "${tenant.domain}"...`);
    
    // Gerar token de teste (mesmo formato que a ML API usa)
    const jwt = require('jsonwebtoken');
    const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
    const token = jwt.sign(
      { sub: '1', email: 'admin@demo.com' },
      NEXTAUTH_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' }
    );

    const modelResponse = await fetch(`http://localhost:8020/ml/model?tenant=${tenant.domain}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!modelResponse.ok) {
      console.error('❌ Erro ao verificar modelo:', await modelResponse.text());
      return;
    }

    const modelInfo = await modelResponse.json();
    
    if (modelInfo.model_available) {
      console.log('✅ Modelo ML treinado!');
      console.log(`   Model ID: ${modelInfo.model_id}`);
      console.log(`   Classes: ${modelInfo.classes.join(', ')}`);
      console.log(`   Atualizado: ${modelInfo.updated_at}`);
    } else {
      console.log('⚠️  Modelo ML ainda não foi treinado');
      console.log('');
      console.log('📚 Para treinar o modelo, execute:');
      console.log('');
      console.log('   $TOKEN = "' + token + '"');
      console.log('   $Url = "http://127.0.0.1:8020/ml/train/import?tenant=' + tenant.domain + '&fmt=csv"');
      console.log('   $CsvPath = ".\\reco-api\\dataset.csv"');
      console.log('   $http = [System.Net.Http.HttpClient]::new()');
      console.log('   $mp = [System.Net.Http.MultipartFormDataContent]::new()');
      console.log('   $fs = [System.IO.File]::OpenRead($CsvPath)');
      console.log('   $fc = New-Object System.Net.Http.StreamContent($fs)');
      console.log('   $fc.Headers.ContentType = \'text/csv\'');
      console.log('   $mp.Add($fc, "file", "dataset.csv")');
      console.log('   $req = [System.Net.Http.HttpRequestMessage]::new([System.Net.Http.HttpMethod]::Post, $Url)');
      console.log('   $req.Headers.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue(\'Bearer\', $TOKEN)');
      console.log('   $req.Content = $mp');
      console.log('   $resp = $http.SendAsync($req).Result');
      console.log('   $resp.StatusCode');
      console.log('   $resp.Content.ReadAsStringAsync().Result');
      console.log('   $fs.Dispose(); $mp.Dispose(); $http.Dispose()');
    }
    console.log('');

    console.log('📊 Resumo da Integração:');
    console.log('   ✅ Next.js: http://localhost:3001');
    console.log('   ✅ ML API: http://localhost:8020');
    console.log('   ✅ Tenant Domain: ' + tenant.domain);
    console.log('   ✅ Endpoints Next.js disponíveis:');
    console.log('      - POST /api/ml/train');
    console.log('      - POST /api/ml/train/import');
    console.log('      - POST /api/ml/predict');
    console.log('      - POST /api/ml/predict/batch');
    console.log('      - GET /api/ml/model');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMLIntegration();
