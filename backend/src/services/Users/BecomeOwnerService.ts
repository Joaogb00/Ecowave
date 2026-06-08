import prismaClient from "../../prisma";
import { AppError } from "../../middlewares/AppError";

interface IdUser {
  id: string;
}

class BecomeOwnerService {
  async execute({ id }: IdUser) {
    if (!id) {
      throw new AppError("ID do usuário não identificado. Faça login novamente.", 401);
    }

    const user = await prismaClient.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    if (user.papel === "PROPRIETARIO") {
      throw new AppError("Esse usuário já é um proprietário", 409);
    }

    // Verificar se já tem solicitação pendente
    const solicitacaoPendente = await prismaClient.solicitacaoUpgrade.findFirst({
      where: {
        userId: id,
        status: "PENDENTE",
      },
    });

    if (solicitacaoPendente) {
      throw new AppError("Você já tem uma solicitação de upgrade pendente", 409);
    }

    // TENTATIVA DE GRAVAÇÃO NO BANCO
    try {
      // Tentativa 1: Criando sem passar a data (deixando o @default(now()) do Prisma agir)
      const novaSolicitacao = await prismaClient.solicitacaoUpgrade.create({
        data: {
          userId: id,
          status: "PENDENTE"
        },
      });

      return {
        message: "Solicitação de upgrade enviada com sucesso! Aguarde a análise da administração.",
        solicitacao: {
          id: novaSolicitacao.id,
          status: novaSolicitacao.status,
          dataSolicitacao: novaSolicitacao.dataSolicitacao || new Date(),
        },
      };

    } catch (firstError) {
      // Se a tentativa 1 falhar (porque seu banco exige o campo manual), tentamos a alternativa com a data:
      console.log("Tentativa 1 sem data falhou, tentando alternativa com dataSolicitacao manual...");
      
      try {
        const novaSolicitacaoComData = await prismaClient.solicitacaoUpgrade.create({
          data: {
            userId: id,
            status: "PENDENTE",
            dataSolicitacao: new Date() // Tentando com o campo explícito
          },
        });

        return {
          message: "Solicitação de upgrade enviada com sucesso! Aguarde a análise da administração.",
          solicitacao: {
            id: novaSolicitacaoComData.id,
            status: novaSolicitacaoComData.status,
            dataSolicitacao: novaSolicitacaoComData.dataSolicitacao,
          },
        };

      } catch (prismaError) {
        // Se ambos falharem, o erro real vai aparecer brilhando no seu terminal do VS Code
        console.error("❌ ERRO CRÍTICO DO PRISMA: Verifique as colunas da tabela SolicitacaoUpgrade.");
        console.error(prismaError);
        
        throw new AppError("Erro de consistência de dados no banco. Verifique o console do servidor.", 500);
      }
    }
  }
}

export { BecomeOwnerService };