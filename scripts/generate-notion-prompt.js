// Script para gerar prompt estruturado para IA do Notion
// Cria um caderno completo de gestão do projeto Lazuli

const fs = require('fs');
const path = require('path');

// Informações do projeto
const projectInfo = {
  cliente: "Lazuli - Consultoria Veicular",
  servicos: [
    "Licenciamento de veículos",
    "Transferência de propriedade", 
    "Primeiro registro",
    "Desbloqueio de veículos",
    "Consultoria automotiva"
  ],
  localizacao: "Franca-SP",
  contato: {
    whatsapp: "(16) 99999-9999",
    email: "contato@lazuli.com.br",
    endereco: "Franca - São Paulo"
  },
  tecnologias: [
    "Next.js 15",
    "React 18", 
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "NextAuth.js",
    "Prisma ORM",
    "SQLite"
  ],
  funcionalidades: [
    "Site institucional responsivo",
    "Sistema de orçamentos online",
    "Agendamento de consultas",
    "Dashboard administrativo",
    "Gestão de clientes",
    "Controle de processos",
    "Sistema de autenticação",
    "Calculadora de preços"
  ]
};

// Gerar data atual e prazo estimado
const hoje = new Date();
const prazoEstimado = new Date();
prazoEstimado.setDate(hoje.getDate() + 30); // 30 dias

const formatarData = (data) => {
  return data.toLocaleDateString('pt-BR');
};

// Template do prompt para Notion AI
const notionPrompt = `
Crie um caderno completo de gestão de projeto para desenvolvimento web com as seguintes especificações:

# 🚀 PROJETO: ${projectInfo.cliente}

## 📋 INFORMAÇÕES GERAIS
- **Cliente:** ${projectInfo.cliente}
- **Localização:** ${projectInfo.localizacao}
- **Data de Início:** ${formatarData(hoje)}
- **Prazo Estimado:** ${formatarData(prazoEstimado)}
- **Status:** Em Desenvolvimento

## 🎯 ESCOPO DO PROJETO

### Serviços do Cliente:
${projectInfo.servicos.map(servico => `- ${servico}`).join('\n')}

### Funcionalidades a Desenvolver:
${projectInfo.funcionalidades.map(func => `- ${func}`).join('\n')}

### Stack Tecnológica:
${projectInfo.tecnologias.map(tech => `- ${tech}`).join('\n')}

## 📞 CONTATOS
- **WhatsApp:** ${projectInfo.contato.whatsapp}
- **Email:** ${projectInfo.contato.email}
- **Endereço:** ${projectInfo.contato.endereco}

---

## 🗂️ ESTRUTURA DO CADERNO

Por favor, crie as seguintes páginas organizadas:

### 1. 📊 DASHBOARD DO PROJETO
- Visão geral do progresso
- Métricas principais
- Status atual das entregas
- Próximos passos

### 2. ⏱️ CRONOGRAMA & PRAZOS
- Timeline detalhada do projeto
- Marcos importantes
- Dependências entre tarefas
- Buffer para ajustes

### 3. ✅ TAREFAS & ENTREGAS
Database com:
- [ ] Tarefa
- [ ] Status (Não Iniciado, Em Progresso, Concluído)
- [ ] Responsável
- [ ] Prazo
- [ ] Prioridade
- [ ] Categoria

### 4. 🔧 DESENVOLVIMENTO TÉCNICO
- Estrutura do código
- Configurações realizadas
- Problemas técnicos resolvidos
- Documentação de APIs

### 5. 💬 COMUNICAÇÃO COM CLIENTE
- Histórico de conversas
- Feedback recebido
- Alterações solicitadas
- Aprovações pendentes

### 6. 🐛 BUGS & ISSUES
Database para rastreamento:
- [ ] Descrição
- [ ] Severidade
- [ ] Status
- [ ] Data de criação
- [ ] Resolução

### 7. 💰 FINANCEIRO
- Orçamento total
- Pagamentos programados
- Custos adicionais
- Controle de horas

### 8. 📝 REUNIÕES & NOTAS
- Atas de reuniões
- Decisões importantes
- Próximos passos definidos
- Pendências

### 9. 🚀 DEPLOY & PRODUÇÃO
- Checklist de deploy
- Configurações de servidor
- Domínio e hospedagem
- Monitoramento

### 10. 📚 DOCUMENTAÇÃO
- Manual do usuário
- Documentação técnica
- Guias de manutenção
- Credenciais de acesso

---

## 🎨 CONFIGURAÇÕES VISUAIS
- Use ícones apropriados para cada seção
- Cores: Azul para desenvolvimento, Verde para concluído, Amarelo para em progresso, Vermelho para urgente
- Crie templates reutilizáveis para tarefas recorrentes

## 🔄 AUTOMAÇÕES SUGERIDAS
- Notificações de prazo próximo
- Status automático baseado em progresso
- Templates para tipos de tarefa comuns
- Relatórios semanais automáticos

## 📋 CHECKLIST INICIAL DE SETUP
- [ ] Configurar propriedades das databases
- [ ] Criar templates de página
- [ ] Definir permissões de acesso
- [ ] Configurar notificações
- [ ] Importar dados existentes do projeto

Organize tudo de forma profissional e funcional para gestão eficiente do projeto ${projectInfo.cliente}.
`;

// Função para salvar o prompt
function salvarPrompt() {
  const nomeArquivo = `notion-prompt-lazuli-${hoje.toISOString().split('T')[0]}.txt`;
  const caminhoArquivo = path.join(__dirname, nomeArquivo);
  
  try {
    fs.writeFileSync(caminhoArquivo, notionPrompt, 'utf8');
    
    console.log('🎉 PROMPT PARA NOTION GERADO COM SUCESSO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📁 Arquivo salvo em: ${caminhoArquivo}`);
    console.log('');
    console.log('📋 INSTRUÇÕES:');
    console.log('1. Abra o Notion e crie um novo workspace ou página');
    console.log('2. Digite "@" e selecione "Ask AI"');
    console.log('3. Cole o conteúdo do arquivo gerado');
    console.log('4. A IA do Notion criará toda a estrutura automaticamente');
    console.log('');
    console.log('💡 DICA: Você também pode copiar o prompt abaixo diretamente:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log(notionPrompt);
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Pronto para criar seu caderno de gestão profissional!');
    
  } catch (error) {
    console.error('❌ Erro ao salvar arquivo:', error);
    console.log('');
    console.log('📋 COPIE O PROMPT ABAIXO DIRETAMENTE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(notionPrompt);
  }
}

// Executar
salvarPrompt();

// Função adicional para gerar checklist de entrega
function gerarChecklistEntrega() {
  const checklist = `
## 📋 CHECKLIST FINAL DE ENTREGA - LAZULI

### 🔧 DESENVOLVIMENTO
- [ ] Site responsivo em todos os dispositivos
- [ ] Todas as páginas funcionando corretamente
- [ ] Sistema de orçamentos operacional
- [ ] Agendamento de consultas implementado
- [ ] Dashboard admin completo
- [ ] Sistema de autenticação seguro
- [ ] Banco de dados configurado
- [ ] Testes de funcionalidade realizados

### 🎨 DESIGN & UX
- [ ] Design alinhado com identidade visual
- [ ] Cores e logos corretos (Franca-SP)
- [ ] Navegação intuitiva
- [ ] Formulários validados
- [ ] Feedback visual apropriado
- [ ] Animações suaves (Framer Motion)

### 📱 RESPONSIVIDADE
- [ ] Desktop (1920px+)
- [ ] Laptop (1024px - 1919px)
- [ ] Tablet (768px - 1023px)
- [ ] Mobile (320px - 767px)

### 🚀 PERFORMANCE
- [ ] Velocidade de carregamento otimizada
- [ ] Imagens otimizadas
- [ ] SEO básico implementado
- [ ] Meta tags configuradas

### 🔐 SEGURANÇA
- [ ] Autenticação funcionando
- [ ] Dados sensíveis protegidos
- [ ] Validação de formulários
- [ ] Sanitização de inputs

### 📚 DOCUMENTAÇÃO
- [ ] Credenciais de acesso entregues
- [ ] Manual básico de uso
- [ ] Documentação técnica
- [ ] Instruções de manutenção

### 🌐 DEPLOY
- [ ] Ambiente de produção configurado
- [ ] Domínio apontado corretamente
- [ ] SSL/HTTPS ativo
- [ ] Backup inicial realizado

### ✅ ENTREGA FINAL
- [ ] Apresentação para o cliente
- [ ] Treinamento básico
- [ ] Período de garantia definido
- [ ] Suporte pós-entrega acordado
`;

  console.log('\n📋 CHECKLIST DE ENTREGA ADICIONAL:');
  console.log(checklist);
}

// Executar checklist também
setTimeout(() => {
  gerarChecklistEntrega();
}, 1000);
