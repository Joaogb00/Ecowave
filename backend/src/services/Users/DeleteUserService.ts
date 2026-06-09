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
        const p = prisma as any;

        // 1. Limpeza de históricos diretos vinculados ao usuário
        if (p.resgate) await p.resgate.deleteMany({ where: { usuarioId: id } });
        if (p.usuarioRecompensa) await p.usuarioRecompensa.deleteMany({ where: { usuarioId: id } });
        if (p.pedido) await p.pedido.deleteMany({ where: { usuarioId: id } });
        if (p.registroReciclagem) await p.registroReciclagem.deleteMany({ where: { usuarioId: id } });
        if (p.denuncia) await p.denuncia.deleteMany({ where: { usuarioId: id } });
        if (p.usuarioConquista) await p.usuarioConquista.deleteMany({ where: { usuarioId: id } });
        if (p.usuarioDesafio) await p.usuarioDesafio.deleteMany({ where: { usuarioId: id } });
        if (p.solicitacaoUpgrade) await p.solicitacaoUpgrade.deleteMany({ where: { userId: id } });

        // 2. Limpar os Pontos de Coleta criados por este Usuário e suas sub-tabelas
        if (p.pontoDeColeta) {
          const pontosDoUsuario = await p.pontoDeColeta.findMany({
            where: { criadoPorId: id },
            select: { id: true }
          });

          if (pontosDoUsuario.length > 0) {
            const pontosIds = pontosDoUsuario.map((item: any) => item.id);

            // CORREÇÃO: Limpando a tabela de vínculos de materiais do ponto (testando variações do nome gerado pelo Prisma)
            if (p.pontoColetaMateriais) await p.pontoColetaMateriais.deleteMany({ where: { pontoColetaId: { in: pontosIds } } });
            if (p.pontoColetaMaterial) await p.pontoColetaMaterial.deleteMany({ where: { pontoColetaId: { in: pontosIds } } });
            if (p.materialPonto) await p.materialPonto.deleteMany({ where: { pontoDeColetaId: { in: pontosIds } } });
            if (p.materialNoPonto) await p.materialNoPonto.deleteMany({ where: { pontoDeColetaId: { in: pontosIds } } });
            
            // Limpa os registros de reciclagem atrelados a esses pontos
            if (p.registroReciclagem) await p.registroReciclagem.deleteMany({ where: { pontoColetaId: { in: pontosIds } } });

            // Agora sim apaga os pontos de coleta com segurança, pois os materiais vinculados foram limpos
            await p.pontoDeColeta.deleteMany({ where: { criadoPorId: id } });
          }
        }

        // 3. Finalmente deleta o usuário da tabela principal
        await prisma.usuario.delete({
          where: { id }
        });
      }, {
        maxWait: 5000,
        timeout: 20000 // Mantém o fôlego estendido para segurança
      });

      return { message: "Usuário e todos os seus vínculos removidos com sucesso" };
    } catch (err: any) {
      console.error("--- ERRO NO PRISMA AO DELETAR ---");
      console.error(err);
      
      const metaInfo = err.meta?.field_name || err.meta?.target || "";
      const mensagemInformativa = `Não foi possível remover o usuário. Erro do Banco de Dados: ${err.message} ${metaInfo}`;
      
      throw new AppError(mensagemInformativa, 500);
    }
  }
}

export { DeleteUserService };