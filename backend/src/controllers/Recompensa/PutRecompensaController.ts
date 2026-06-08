import { Request, Response } from "express";
import { PutRecompensaService } from "../../services/Recompensa/PutRecompensaService";

class PutRecompensaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, descricao, pontosNecessarios, empresaParceira, estoque, imagem } = req.body;

    const putRecompensaService = new PutRecompensaService();

    const recompensaEditada = await putRecompensaService.execute({
      id,
      nome,
      descricao,
      pontosNecessarios: Number(pontosNecessarios),
      empresaParceira,
      estoque: Number(estoque),
      imagem,
    });

    return res.json(recompensaEditada);
  }
}

export { PutRecompensaController };