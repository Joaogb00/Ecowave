import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface PostReq {
  nome: string;
  descricao: string;
  pontosNecessarios: number;
  empresaParceira: string;
  estoque: number;
  imagem: string; // URL da imagem
}

class PostRecompensaService {
  async execute({ nome, descricao, pontosNecessarios, empresaParceira, estoque, imagem }: PostReq) {
    // Busca apenas recompensas que ainda estão ativas (estoque > 0)
    const recompensaExistente = await prismaClient.recompensa.findFirst({
      where: { 
        nome,
        estoque: { gt: 0 } 
      },
    });

    if (recompensaExistente) {
      throw new AppError("Já existe uma recompensa ativa com este nome", 409);
    }

    // Se o código chegar aqui, significa que ou não existe, 
    // ou existe uma inativa (estoque 0).
    // O ideal seria fazer um 'upsert' (atualizar a inativa ou criar uma nova).
    
    const novaRecompensa = await prismaClient.recompensa.create({
      data: { nome, descricao, pontosNecessarios, empresaParceira, estoque, imagem },
    });

    return { message: "Recompensa criada com sucesso", recompensa: novaRecompensa };
  }
}

export { PostRecompensaService };