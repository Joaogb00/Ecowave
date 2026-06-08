import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface DelReq {
  id: string;
}

class DeleteRecompensaService {
  async execute({ id }: DelReq) {
    // 1. Verifica se a recompensa existe
    const recompensaExistente = await prismaClient.recompensa.findUnique({
      where: { id },
    });

    if (!recompensaExistente) {
      throw new AppError("Recompensa não encontrada", 404);
    }

    try {
      // 2. Realiza a exclusão lógica (Inativa o item em vez de remover do banco)
      // Nota: Certifique-se de ter o campo 'ativo' no seu schema.prisma
      const recompensaInativada = await prismaClient.recompensa.update({
        where: { id },
        data: { 
           // Caso não tenha o campo ativo, você pode zerar o estoque como alternativa
           estoque: 0 
        },
      });

      return {
        message: "Recompensa inativada/removida com sucesso!",
        recompensa: recompensaInativada,
      };

    } catch (err: any) {
      // Log do erro original para debug no terminal
      console.error("Erro na exclusão de recompensa:", err);
      
      throw new AppError("Erro interno ao tentar processar a solicitação: " + err.message, 500);
    }
  }
}

export { DeleteRecompensaService };