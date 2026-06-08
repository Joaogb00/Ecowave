import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface PutReq {
  id: string;
  nome: string;
  descricao: string;
  pontosNecessarios: number;
  empresaParceira: string;
  estoque: number;
  imagem: string;
}

class PutRecompensaService {
  async execute({ id, nome, descricao, pontosNecessarios, empresaParceira, estoque, imagem }: PutReq) {
    const recompensaExistente = await prismaClient.recompensa.findFirst({
      where: { id },
    });

    if (!recompensaExistente) {
      throw new AppError("Recompensa não encontrada", 404);
    }

    const recompensaEditada = await prismaClient.recompensa.update({
      where: { id },
      data: {
        nome,
        descricao,
        pontosNecessarios,
        empresaParceira,
        estoque,
        imagem,
      },
    });

    return {
      message: "Recompensa editada com sucesso",
      recompensa: recompensaEditada,
    };
  }
}

export { PutRecompensaService };