import prismaClient from "../../prisma";

class GetRecompensaService {
  async execute() {
    // Filtramos apenas as recompensas que possuem estoque > 0
    const Recompensas = await prismaClient.recompensa.findMany({
      where: {
        estoque: {
          gt: 0 // "Greater Than" - busca apenas itens com estoque maior que zero
        }
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    if (Recompensas.length <= 0) {
      return {
        message: "Nenhuma recompensa cadastrada",
        recompensas: [],
      };
    }

    return {
      message: "Recompensas encontradas",
      recompensas: Recompensas,
    };
  }
}

export { GetRecompensaService };