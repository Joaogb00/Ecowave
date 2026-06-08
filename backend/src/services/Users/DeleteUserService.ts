import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface DeleteReq {
  id: string;
}

class DeleteUserService {
  async execute({ id }: DeleteReq) {
    const usuarioExistente = await prismaClient.usuario.findFirst({
      where: { id }
    });

    if (!usuarioExistente) {
      throw new AppError("Usuário não encontrado", 404);
    }

    try {
      await prismaClient.$transaction(async (prisma) => {
        // 1. Limpeza de todas as tabelas dependentes (na ordem correta)
        await prisma.denuncia.deleteMany({ where: { usuarioId: id } });
        await prisma.usuarioConquista.deleteMany({ where: { usuarioId: id } });
        await prisma.usuarioDesafio.deleteMany({ where: { usuarioId: id } });
        await prisma.usuarioRecompensa.deleteMany({ where: { usuarioId: id } });
        await prisma.registroReciclagem.deleteMany({ where: { usuarioId: id } });
        
        // As solicitações de upgrade possuem um 'onDelete: Cascade' no seu schema, 
        // mas deletar manualmente não faz mal.
        await prisma.solicitacaoUpgrade.deleteMany({ where: { userId: id } });

        // 2. Pontos de coleta criados pelo usuário
        // Nota: se o usuário criou um ponto, precisamos ver se não há denúncias 
        // ou materiais vinculados a esse ponto antes.
        await prisma.pontoDeColeta.deleteMany({ where: { criadoPorId: id } });

        // 3. Finalmente, deleta o usuário
        await prisma.usuario.delete({
          where: { id }
        });
      });

      return { message: "Usuário e todos os seus vínculos removidos com sucesso" };
    } catch (err: any) {
      console.error("Erro ao deletar:", err);
      throw new AppError("Erro ao remover usuário. Ele possui registros vinculados que impedem a exclusão.", 500);
    }
  }
}

export { DeleteUserService };