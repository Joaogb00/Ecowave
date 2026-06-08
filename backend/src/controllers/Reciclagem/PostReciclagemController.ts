import { Request, Response } from 'express';
import prismaClient from '../../prisma';

class PostReciclagemController {
  async handle(req: Request, res: Response) {
    const { usuarioId, materialId, pontoColetaId, pesoKg } = req.body;

    try {
      // 1. Validação dos campos obrigatórios enviados pelo Vue
      if (!usuarioId || !materialId || !pontoColetaId || !pesoKg) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
      }

      // 2. Busca o material para capturar o multiplicador correto
      const material = await prismaClient.material.findUnique({
        where: { id: materialId }
      });

      if (!material) {
        return res.status(404).json({ error: "Material não encontrado no sistema." });
      }

      // 3. Calcula os pontos obtidos com base no peso recolhido
      const valorDoMaterial = material.pontosPorKg ?? 10;
      const pontosGanhosCalculados = Math.round(pesoKg * valorDoMaterial);

      // 4. Transação Atômica com os nomes exatos do seu schema.prisma
      const [novoRegistro, usuarioAtualizado] = await prismaClient.$transaction([
        
        // A) Cria o histórico na tabela registros_reciclagem
        prismaClient.registroReciclagem.create({
          data: {
            usuarioId,
            materialId,
            pontoColetaId,
            pesoKg,
            pontosGanhos: pontosGanhosCalculados // Nome correto da coluna no seu schema
          }
        }),

        // B) Incrementa os créditos na coluna totalPontos do seu Usuario
        prismaClient.usuario.update({
          where: { id: usuarioId },
          data: {
            totalPontos: {
              increment: pontosGanhosCalculados // Campo correto identificado no schema
            }
          }
        })
      ]);

      // 5. Retorna a resposta de sucesso estruturada para o frontend
      return res.status(201).json({
        message: "Reciclagem registrada e créditos enviados com sucesso!",
        registro: novoRegistro,
        saldoAtualizado: usuarioAtualizado.totalPontos
      });

    } catch (error: any) {
      console.error("Erro interno no PostReciclagemController:", error);
      return res.status(500).json({ 
        error: "Erro ao processar o registro de pesagem no banco de dados.",
        details: error.message 
      });
    }
  }
}

export { PostReciclagemController };