import prismaClient from "../../prisma";

class DashboardAdminService {

  async execute() {

    /*
      TOTAL DE USUÁRIOS
    */
    const totalUsuarios =
      await prismaClient.usuario.count();

    /*
      TOTAL DE PONTOS DE COLETA
    */
    const totalPontos =
      await prismaClient.pontoDeColeta.count();

    /*
      TOTAL RECICLADO
    */
    const totalReciclado =
      await prismaClient.registroReciclagem.aggregate({

        _sum: {
          pesoKg: true
        }

      });

    /*
      TOTAL DE PONTOS DISTRIBUÍDOS
    */
    const pontosDistribuidos =
      await prismaClient.registroReciclagem.aggregate({

        _sum: {
          pontosGanhos: true
        }

      });

    /*
      TOTAL DE CO2 ECONOMIZADO
    */
    const co2Economizado =
      await prismaClient.registroReciclagem.aggregate({

        _sum: {
          co2Economizado: true
        }

      });

      const pontosColetas = await prismaClient.pontoDeColeta.findMany();



    /*
      ÚLTIMOS REGISTROS
    */
    const ultimosRegistros =
      await prismaClient.registroReciclagem.findMany({

        take: 10,

        orderBy: {
          criadoEm: 'desc'
        },

        include: {
          usuario: true,
          material: true,
          pontoColeta: true
        }

      });

    /*
      RETORNO FINAL
    */
    return {

      totalUsuarios,

      totalPontos,

      totalReciclado:
        totalReciclado._sum.pesoKg || 0,

      pontosDistribuidos:
        pontosDistribuidos._sum.pontosGanhos || 0,

      co2Economizado:
        co2Economizado._sum.co2Economizado || 0,

      pontosColetas,  

      ultimosRegistros

    };

  }

}

export { DashboardAdminService };