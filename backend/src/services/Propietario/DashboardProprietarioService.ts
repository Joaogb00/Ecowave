import prismaClient from "../../prisma";
import { AppError } from "../../middlewares/AppError";

class DashboardProprietarioService {
  async execute(usuarioId: string) {
    const pontos = await prismaClient.pontoDeColeta.findMany({
      where: {
        criadoPorId: usuarioId,
      },
    });

    if (pontos.length === 0) {
      throw new AppError("Nenhum ponto de coleta encontrado", 404);
    }

    const pontosIds = pontos.map((ponto) => ponto.id);

    const totalReciclado = await prismaClient.registroReciclagem.aggregate({
      _sum: { pesoKg: true },
      where: { pontoColetaId: { in: pontosIds } },
    });

    const usuariosAtendidos = await prismaClient.registroReciclagem.findMany({
      where: { pontoColetaId: { in: pontosIds } },
      distinct: ["usuarioId"],
    });

    const pontosDistribuidos = await prismaClient.registroReciclagem.aggregate({
      _sum: { pontosGanhos: true },
      where: { pontoColetaId: { in: pontosIds } },
    });

    const ultimosRegistros = await prismaClient.registroReciclagem.findMany({
      where: { pontoColetaId: { in: pontosIds } },
      take: 10,
      orderBy: { criadoEm: "desc" },
      include: {
        usuario: true,
        material: true,
        pontoColeta: true,
      },
    });

    const co2Economizado = await prismaClient.registroReciclagem.aggregate({
      _sum: { co2Economizado: true },
      where: { pontoColetaId: { in: pontosIds } },
    });

    return {
      totalReciclado: totalReciclado._sum.pesoKg || 0,
      usuariosAtendidos: usuariosAtendidos.length,
      pontosDistribuidos: pontosDistribuidos._sum.pontosGanhos || 0,
      co2Economizado: co2Economizado._sum.co2Economizado || 0,
      pontos,
      ultimosRegistros,
    };
  }
}

export { DashboardProprietarioService };