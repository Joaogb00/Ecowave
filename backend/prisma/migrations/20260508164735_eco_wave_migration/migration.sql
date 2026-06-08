-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "papel" TEXT NOT NULL DEFAULT 'USUARIO',
    "totalPontos" INTEGER NOT NULL DEFAULT 0,
    "nivelId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveis" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "pontosMinimos" INTEGER NOT NULL,
    "icone" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "niveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materiais" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "fatorCO2" DOUBLE PRECISION NOT NULL,
    "pontosPorKg" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materiais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pontos_coleta" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "CEP" TEXT,
    "criadoPorId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEm" TIMESTAMP(3) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "horarioAbertura" TEXT NOT NULL DEFAULT '08:00',
    "horarioFechamento" TEXT NOT NULL DEFAULT '18:00',

    CONSTRAINT "pontos_coleta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ponto_coleta_materiais" (
    "id" TEXT NOT NULL,
    "pontoColetaId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,

    CONSTRAINT "ponto_coleta_materiais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_reciclagem" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "pontoColetaId" TEXT NOT NULL,
    "pesoKg" DOUBLE PRECISION NOT NULL,
    "co2Economizado" DOUBLE PRECISION,
    "pontosGanhos" DOUBLE PRECISION,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registros_reciclagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conquistas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "icone" TEXT,
    "pontosNecessarios" DOUBLE PRECISION NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conquistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_conquistas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "conquistaId" TEXT NOT NULL,
    "conquistadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_conquistas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "desafios" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "metaKg" DOUBLE PRECISION NOT NULL,
    "recompensaPontos" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "desafios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_desafios" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "desafioId" TEXT NOT NULL,
    "progressoKg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "concluido" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuario_desafios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recompensas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "pontosNecessarios" INTEGER NOT NULL,
    "empresaParceira" TEXT,
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEm" TIMESTAMP(3) NOT NULL,
    "imagem" TEXT,

    CONSTRAINT "recompensas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_recompensas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "recompensaId" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "resgatadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_recompensas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "denuncias" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "pontoColetaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT DEFAULT 'ABERTA',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "denuncias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "niveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pontos_coleta" ADD CONSTRAINT "pontos_coleta_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ponto_coleta_materiais" ADD CONSTRAINT "ponto_coleta_materiais_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materiais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ponto_coleta_materiais" ADD CONSTRAINT "ponto_coleta_materiais_pontoColetaId_fkey" FOREIGN KEY ("pontoColetaId") REFERENCES "pontos_coleta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_reciclagem" ADD CONSTRAINT "registros_reciclagem_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materiais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_reciclagem" ADD CONSTRAINT "registros_reciclagem_pontoColetaId_fkey" FOREIGN KEY ("pontoColetaId") REFERENCES "pontos_coleta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_reciclagem" ADD CONSTRAINT "registros_reciclagem_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_conquistas" ADD CONSTRAINT "usuario_conquistas_conquistaId_fkey" FOREIGN KEY ("conquistaId") REFERENCES "conquistas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_conquistas" ADD CONSTRAINT "usuario_conquistas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_desafios" ADD CONSTRAINT "usuario_desafios_desafioId_fkey" FOREIGN KEY ("desafioId") REFERENCES "desafios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_desafios" ADD CONSTRAINT "usuario_desafios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_recompensas" ADD CONSTRAINT "usuario_recompensas_recompensaId_fkey" FOREIGN KEY ("recompensaId") REFERENCES "recompensas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_recompensas" ADD CONSTRAINT "usuario_recompensas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "denuncias" ADD CONSTRAINT "denuncias_pontoColetaId_fkey" FOREIGN KEY ("pontoColetaId") REFERENCES "pontos_coleta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "denuncias" ADD CONSTRAINT "denuncias_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
