-- CreateTable
CREATE TABLE "solicitacoes_upgrade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "justificativa" TEXT,
    "dataSolicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitacoes_upgrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "solicitacoes_upgrade_userId_idx" ON "solicitacoes_upgrade"("userId");

-- CreateIndex
CREATE INDEX "solicitacoes_upgrade_status_idx" ON "solicitacoes_upgrade"("status");

-- AddForeignKey
ALTER TABLE "solicitacoes_upgrade" ADD CONSTRAINT "solicitacoes_upgrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
