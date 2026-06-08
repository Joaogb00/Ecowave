import prismaClient from "../../prisma";
import { AppError } from "../../middlewares/AppError";

interface AceitarSolicitacaoParams {
  id: string;
}

interface RecusarSolicitacaoParams {
  id: string;
  justificativa: string;
}

class SolicitacaoUpgradeService {
  async aceitar({ id }: AceitarSolicitacaoParams) {
    const solicitacao = await prismaClient.solicitacaoUpgrade.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada", 404);
    }

    if (solicitacao.status !== "PENDENTE") {
      throw new AppError("Solicitação já foi processada", 400);
    }

    // Atualizar status da solicitação para APROVADA
    await prismaClient.solicitacaoUpgrade.update({
      where: { id },
      data: { status: "APROVADA" },
    });

    // Atualizar papel do usuário para PROPRIETARIO
    const usuarioAtualizado = await prismaClient.usuario.update({
      where: { id: solicitacao.userId },
      data: { papel: "PROPRIETARIO" },
      select: {
        id: true,
        nome: true,
        email: true,
        papel: true,
      },
    });

    // Ativar pontos de coleta do usuário (se houver)
    await prismaClient.pontoDeColeta.updateMany({
      where: { criadoPorId: solicitacao.userId },
      data: { ativo: true },
    });

    return {
      message: "Upgrade aprovado com sucesso!",
      usuario: usuarioAtualizado,
    };
  }

  async recusar({ id, justificativa }: RecusarSolicitacaoParams) {
    const solicitacao = await prismaClient.solicitacaoUpgrade.findUnique({
      where: { id },
    });

    if (!solicitacao) {
      throw new AppError("Solicitação não encontrada", 404);
    }

    if (solicitacao.status !== "PENDENTE") {
      throw new AppError("Solicitação já foi processada", 400);
    }

    if (!justificativa || justificativa.trim() === "") {
      throw new AppError("Justificativa é obrigatória para recusa", 400);
    }

    // Atualizar status para RECUSADA e salvar justificativa
    const solicitacaoAtualizada = await prismaClient.solicitacaoUpgrade.update({
      where: { id },
      data: {
        status: "RECUSADA",
        justificativa: justificativa.trim(),
      },
    });

    return {
      message: "Solicitação recusada com sucesso.",
      solicitacao: solicitacaoAtualizada,
    };
  }

  async listarPendentes() {
    const solicitacoes = await prismaClient.solicitacaoUpgrade.findMany({
      where: { status: "PENDENTE" },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: { dataSolicitacao: "desc" },
    });

    return solicitacoes.map((s) => ({
      id: s.id,
      usuarioId: s.userId,
      usuarioNome: s.usuario.nome,
      usuarioEmail: s.usuario.email,
      status: s.status,
      dataSolicitacao: s.dataSolicitacao,
    }));
  }

  async statusPorUsuario(userId: string) {
    if (!userId) {
      throw new AppError("ID do usuário é obrigatório.", 400);
    }

    const possiveisCampos = ['userId', 'usuarioId', 'user_id', 'usuario_id'];
    let solicitacao = null;
    let erroUltimaTentativa = null;

    for (const campo of possiveisCampos) {
      try {
        solicitacao = await (prismaClient.solicitacaoUpgrade as any).findFirst({
          where: { [campo]: userId },
          orderBy: { dataSolicitacao: "desc" },
        });
        
        console.log(`✅ Sucesso! O campo de relação correto no seu Schema é: "${campo}"`);
        break; 
      } catch (err) {
        erroUltimaTentativa = err;
      }
    }

    if (!solicitacao && erroUltimaTentativa && !String(erroUltimaTentativa).includes("not found")) {
      console.error("❌ Todas as tentativas de mapeamento de coluna falharam no Prisma:");
      console.error(erroUltimaTentativa);
      throw new AppError("Erro de compatibilidade na coluna de usuário do banco de dados.", 500);
    }

    if (!solicitacao) {
      return { solicitacao: null };
    }

    return {
      solicitacao: {
        id: solicitacao.id,
        status: solicitacao.status,
        justificativa: solicitacao.justificativa ?? null,
        dataSolicitacao: solicitacao.dataSolicitacao,
      },
    };
  }
}

export { SolicitacaoUpgradeService };