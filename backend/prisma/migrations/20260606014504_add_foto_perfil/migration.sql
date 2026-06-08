/*
  Warnings:

  - You are about to drop the column `criadoEm` on the `solicitacoes_upgrade` table. All the data in the column will be lost.
  - You are about to drop the column `dataSolicitacao` on the `solicitacoes_upgrade` table. All the data in the column will be lost.
  - You are about to drop the column `editadoEm` on the `solicitacoes_upgrade` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `solicitacoes_upgrade` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `solicitacoes_upgrade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "solicitacoes_upgrade" DROP CONSTRAINT "solicitacoes_upgrade_userId_fkey";

-- DropIndex
DROP INDEX "solicitacoes_upgrade_status_idx";

-- DropIndex
DROP INDEX "solicitacoes_upgrade_userId_idx";

-- AlterTable
ALTER TABLE "solicitacoes_upgrade" DROP COLUMN "criadoEm",
DROP COLUMN "dataSolicitacao",
DROP COLUMN "editadoEm",
DROP COLUMN "userId",
ADD COLUMN     "data_solicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "blockedUntil" TIMESTAMP(3),
ADD COLUMN     "failedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fotoPerfil" TEXT,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Em análise',
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verificationExpires" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "solicitacoes_upgrade" ADD CONSTRAINT "solicitacoes_upgrade_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
