// src/services/Reciclagem/PostReciclagemService.ts
import prismaClient from "../../prisma";

interface IPostReciclagemRequest {
  pontoColetaId: string;
  materialId: string;
  usuarioId: string;
  pesoKg: number;
}

class PostReciclagemService {
  async execute({ pontoColetaId, materialId, usuarioId, pesoKg }: IPostReciclagemRequest) {
    // 1. Buscar material para saber quantos pontos ganha por kg
    const material = await prismaClient.material.findUnique({
      where: { id: materialId },
    });

    if (!material) {
      throw new Error("Material não encontrado");
    }

    // Usa o campo pontosPorKg do modelo Material
    const pontosPorKg = material.pontosPorKg ?? 10;
    const pontosGanhos = Math.round(pesoKg * pontosPorKg);

    // 2. Calcular CO2 economizado (opcional, se quiser usar fatorCO2)
    let co2Economizado: number | null = null;
    if (material.fatorCO2 != null) {
      co2Economizado = Number((pesoKg * material.fatorCO2).toFixed(3));
    }

    // 3. Criar registro de reciclagem
    // Nome correto do modelo: RegistroReciclagem → prismaClient.registroReciclagem
    const registro = await prismaClient.registroReciclagem.create({
      data: {
        usuarioId,
        materialId,
        pontoColetaId,
        pesoKg,
        co2Economizado,
      },
    });


    await prismaClient.usuario.update({
      where: { id: usuarioId },
      data: {
        totalPontos: {
          increment: pontosGanhos,
        },
      },
    });

    // 5. Retornar registro + informação de pontos ganhos
    return {
            message: "Registro feito com sucesso",
            registro: registro
        }

    }

}

export { PostReciclagemService };