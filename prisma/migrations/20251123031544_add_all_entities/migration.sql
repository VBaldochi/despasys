-- CreateEnum
CREATE TYPE "public"."EvaluationType" AS ENUM ('COMPLETA', 'BASICA', 'LAUDO', 'PERICIA');

-- CreateEnum
CREATE TYPE "public"."EvaluationStatus" AS ENUM ('REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."RegistrationStatus" AS ENUM ('PENDING_DOCS', 'DOCS_RECEIVED', 'IN_ANALYSIS', 'DETRAN_PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."LicensingStatus" AS ENUM ('PENDING', 'DOCS_SENT', 'PROCESSING', 'COMPLETED', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."TransferStatus" AS ENUM ('PENDING_DOCS', 'DOCS_RECEIVED', 'WAITING_PAYMENT', 'PAYMENT_CONFIRMED', 'DETRAN_PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."UnlockType" AS ENUM ('JUDICIAL', 'MULTA', 'ROUBO_FURTO', 'RESTRICAO_AMBIENTAL', 'RESTRICAO_JUDICIAL', 'OUTROS');

-- CreateEnum
CREATE TYPE "public"."UnlockStatus" AS ENUM ('ANALYSIS', 'PENDING_DOCS', 'PROCESSING', 'DETRAN_PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('VISTORIA', 'PERICIA', 'AVALIACAO', 'SINISTRO', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "public"."ReportPurpose" AS ENUM ('COMPRA', 'VENDA', 'SEGURO', 'FINANCIAMENTO', 'JUDICIAL', 'ADMINISTRATIVO');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('SOLICITADO', 'EM_ANALISE', 'EM_CAMPO', 'ELABORANDO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "public"."ReportPriority" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "public"."TipoCliente" AS ENUM ('FISICO', 'JURIDICO');

-- CreateEnum
CREATE TYPE "public"."StatusCliente" AS ENUM ('ATIVO', 'INATIVO', 'SUSPENSO');

-- CreateEnum
CREATE TYPE "public"."StatusVeiculo" AS ENUM ('ATIVO', 'VENDIDO', 'SINISTRADO', 'FURTO');

-- CreateEnum
CREATE TYPE "public"."TipoServico" AS ENUM ('LICENCIAMENTO', 'TRANSFERENCIA', 'PRIMEIRO_EMPLACAMENTO', 'SEGUNDA_VIA', 'DESBLOQUEIO', 'ALTERACAO_CARACTERISTICAS', 'BAIXA_VEICULO', 'INCLUSAO_ALIENACAO', 'EXCLUSAO_ALIENACAO', 'MUDANCA_MUNICIPIO', 'MUDANCA_UF', 'REGULARIZACAO_MULTAS');

-- CreateEnum
CREATE TYPE "public"."PlanoTenant" AS ENUM ('DESPACHANTE_SOLO', 'ESCRITORIO_PEQUENO', 'ESCRITORIO_GRANDE');

-- CreateEnum
CREATE TYPE "public"."StatusTenant" AS ENUM ('ACTIVE', 'TRIAL', 'SUSPENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."StatusProcesso" AS ENUM ('AGUARDANDO_DOCUMENTOS', 'DOCUMENTOS_RECEBIDOS', 'EM_ANALISE', 'AGUARDANDO_PAGAMENTO', 'PAGAMENTO_CONFIRMADO', 'EM_PROCESSAMENTO', 'AGUARDANDO_VISTORIA', 'VISTORIA_REALIZADA', 'FINALIZADO', 'CANCELADO', 'ERRO');

-- CreateEnum
CREATE TYPE "public"."Prioridade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "public"."StatusPagamento" AS ENUM ('PENDENTE', 'PAGO', 'PARCIAL', 'VENCIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "public"."TipoDocumento" AS ENUM ('CPF', 'RG', 'CNH', 'ATPV', 'CRV', 'CRLV', 'COMPROVANTE_RESIDENCIA', 'LAUDO_VISTORIA', 'NOTA_FISCAL', 'PROCURACAO', 'OUTROS');

-- CreateEnum
CREATE TYPE "public"."StatusDocumento" AS ENUM ('PENDENTE', 'APROVADO', 'REJEITADO', 'EXPIRADO');

-- CreateEnum
CREATE TYPE "public"."TipoEvento" AS ENUM ('CRIACAO', 'ATUALIZACAO_STATUS', 'DOCUMENTO_ADICIONADO', 'DOCUMENTO_APROVADO', 'DOCUMENTO_REJEITADO', 'PAGAMENTO_RECEBIDO', 'VISTORIA_AGENDADA', 'VISTORIA_REALIZADA', 'PROCESSO_FINALIZADO', 'OBSERVACAO_ADICIONADA', 'SISTEMA');

-- CreateEnum
CREATE TYPE "public"."TipoTransacao" AS ENUM ('RECEITA', 'DESPESA');

-- CreateEnum
CREATE TYPE "public"."StatusTransacao" AS ENUM ('PENDENTE', 'PAGO', 'VENCIDO', 'CANCELADO', 'ESTORNADO');

-- CreateTable
CREATE TABLE "public"."tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "plan" "public"."PlanoTenant" NOT NULL DEFAULT 'DESPACHANTE_SOLO',
    "status" "public"."StatusTenant" NOT NULL DEFAULT 'TRIAL',
    "registroProfissional" TEXT,
    "cnpj" TEXT,
    "endereco" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "settings" JSONB,
    "stripeCustomerId" TEXT,
    "subscriptionId" TEXT,
    "subscriptionStatus" TEXT,
    "trialEndsAt" TIMESTAMP(3),
    "maxUsers" INTEGER NOT NULL DEFAULT 1,
    "maxCustomers" INTEGER NOT NULL DEFAULT 100,
    "maxProcesses" INTEGER NOT NULL DEFAULT 300,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "registroProfissional" TEXT,
    "telefone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."customers" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "cpfCnpj" TEXT NOT NULL,
    "tipoCliente" "public"."TipoCliente" NOT NULL DEFAULT 'FISICO',
    "endereco" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT DEFAULT 'SP',
    "cep" TEXT,
    "rg" TEXT,
    "orgaoEmissor" TEXT,
    "profissao" TEXT,
    "estadoCivil" TEXT,
    "razaoSocial" TEXT,
    "nomeFantasia" TEXT,
    "inscricaoEstadual" TEXT,
    "status" "public"."StatusCliente" NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."veiculos" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "renavam" TEXT,
    "chassi" TEXT,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "anoModelo" INTEGER NOT NULL,
    "cor" TEXT NOT NULL,
    "combustivel" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "status" "public"."StatusVeiculo" NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."processes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "veiculoId" TEXT,
    "responsavelId" TEXT NOT NULL,
    "tipoServico" "public"."TipoServico" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "status" "public"."StatusProcesso" NOT NULL DEFAULT 'AGUARDANDO_DOCUMENTOS',
    "prioridade" "public"."Prioridade" NOT NULL DEFAULT 'MEDIA',
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prazoLegal" TIMESTAMP(3),
    "dataFinalizacao" TIMESTAMP(3),
    "valorTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorTaxas" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorServico" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "statusPagamento" "public"."StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "notasInternas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documentos" (
    "id" TEXT NOT NULL,
    "processoId" TEXT NOT NULL,
    "tipo" "public"."TipoDocumento" NOT NULL,
    "nome" TEXT NOT NULL,
    "arquivo" TEXT NOT NULL,
    "tamanho" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "status" "public"."StatusDocumento" NOT NULL DEFAULT 'PENDENTE',
    "dataUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataExpiracao" TIMESTAMP(3),
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."timeline_events" (
    "id" TEXT NOT NULL,
    "processoId" TEXT NOT NULL,
    "tipo" "public"."TipoEvento" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "autor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transacoes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "processoId" TEXT,
    "customerId" TEXT,
    "tipo" "public"."TipoTransacao" NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" "public"."StatusTransacao" NOT NULL DEFAULT 'PENDENTE',
    "metodoPagamento" TEXT,
    "referenciaExterna" TEXT,
    "comprovante" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quotes" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "validUntil" TIMESTAMP(3) NOT NULL,
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."appointments" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "serviceType" TEXT NOT NULL,
    "appointmentType" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."evaluations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "vehicleBrand" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "evaluationType" "public"."EvaluationType" NOT NULL,
    "purpose" TEXT NOT NULL,
    "requestedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "estimatedValue" DOUBLE PRECISION,
    "finalValue" DOUBLE PRECISION,
    "status" "public"."EvaluationStatus" NOT NULL DEFAULT 'REQUESTED',
    "location" TEXT NOT NULL,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."registrations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerCpf" TEXT NOT NULL,
    "vehicleBrand" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" TEXT NOT NULL,
    "vehicleColor" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "chassisNumber" TEXT,
    "isZeroKm" BOOLEAN NOT NULL DEFAULT false,
    "invoice" TEXT,
    "invoiceDate" TIMESTAMP(3),
    "dealership" TEXT,
    "status" "public"."RegistrationStatus" NOT NULL DEFAULT 'PENDING_DOCS',
    "requestedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedDate" TIMESTAMP(3),
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."licensings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "vehicleBrand" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" TEXT NOT NULL,
    "renavam" TEXT NOT NULL,
    "exercicio" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "status" "public"."LicensingStatus" NOT NULL DEFAULT 'PENDING',
    "taxValue" DOUBLE PRECISION NOT NULL,
    "serviceValue" DOUBLE PRECISION NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "licensings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transfers" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "buyerId" TEXT,
    "buyerName" TEXT NOT NULL,
    "buyerCpf" TEXT NOT NULL,
    "buyerPhone" TEXT NOT NULL,
    "buyerAddress" TEXT,
    "sellerId" TEXT,
    "sellerName" TEXT NOT NULL,
    "sellerCpf" TEXT NOT NULL,
    "sellerPhone" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "vehicleBrand" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" TEXT NOT NULL,
    "chassisNumber" TEXT,
    "renavam" TEXT NOT NULL,
    "transferValue" DOUBLE PRECISION,
    "serviceValue" DOUBLE PRECISION NOT NULL,
    "status" "public"."TransferStatus" NOT NULL DEFAULT 'PENDING_DOCS',
    "requestedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedDate" TIMESTAMP(3),
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unlocks" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerCpf" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "vehicleBrand" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" TEXT NOT NULL,
    "renavam" TEXT NOT NULL,
    "unlockType" "public"."UnlockType" NOT NULL,
    "blockReason" TEXT NOT NULL,
    "blockDate" TIMESTAMP(3),
    "blockEntity" TEXT,
    "unlockValue" DOUBLE PRECISION NOT NULL,
    "serviceValue" DOUBLE PRECISION NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "status" "public"."UnlockStatus" NOT NULL DEFAULT 'ANALYSIS',
    "requestedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedDate" TIMESTAMP(3),
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unlocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."despesas" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fornecedor" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "tipoDespesa" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "recorrente" BOOLEAN NOT NULL DEFAULT false,
    "periodicidade" TEXT,
    "formaPagamento" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "despesas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."receitas" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT NOT NULL,
    "processoId" TEXT,
    "servico" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "metodoPagamento" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "receitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fluxo_caixa" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "origem" TEXT,
    "destino" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "metodoPagamento" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fluxo_caixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."technical_reports" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "vehicleBrand" TEXT NOT NULL,
    "vehicleModel" TEXT NOT NULL,
    "vehicleYear" TEXT NOT NULL,
    "vehiclePlate" TEXT NOT NULL,
    "chassisNumber" TEXT,
    "reportType" "public"."ReportType" NOT NULL,
    "purpose" "public"."ReportPurpose" NOT NULL,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'SOLICITADO',
    "requestedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "value" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "findings" TEXT[],
    "conclusion" TEXT,
    "recommendations" TEXT[],
    "attachments" TEXT[],
    "priority" "public"."ReportPriority" NOT NULL DEFAULT 'MEDIA',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technical_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_domain_key" ON "public"."tenants"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_stripeCustomerId_key" ON "public"."tenants"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_subscriptionId_key" ON "public"."tenants"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "public"."accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "public"."sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_token_key" ON "public"."verificationtokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "public"."verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "customers_cpfCnpj_tenantId_key" ON "public"."customers"("cpfCnpj", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_placa_tenantId_key" ON "public"."veiculos"("placa", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_renavam_tenantId_key" ON "public"."veiculos"("renavam", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "processes_numero_tenantId_key" ON "public"."processes"("numero", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "transacoes_numero_tenantId_key" ON "public"."transacoes"("numero", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "receitas_numero_tenantId_key" ON "public"."receitas"("numero", "tenantId");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customers" ADD CONSTRAINT "customers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."veiculos" ADD CONSTRAINT "veiculos_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."veiculos" ADD CONSTRAINT "veiculos_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."processes" ADD CONSTRAINT "processes_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."processes" ADD CONSTRAINT "processes_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."processes" ADD CONSTRAINT "processes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."processes" ADD CONSTRAINT "processes_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "public"."veiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documentos" ADD CONSTRAINT "documentos_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "public"."processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."timeline_events" ADD CONSTRAINT "timeline_events_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "public"."processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transacoes" ADD CONSTRAINT "transacoes_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transacoes" ADD CONSTRAINT "transacoes_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "public"."processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transacoes" ADD CONSTRAINT "transacoes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quotes" ADD CONSTRAINT "quotes_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointments" ADD CONSTRAINT "appointments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
