import { Request, Response } from "express";
import { PostRecompensaService } from "../../services/Recompensa/PostRecompensaService";

class PostRecompensaController {
  async handle(req: Request, res: Response) {
    const { nome, descricao, pontosNecessarios, empresaParceira, estoque, imagem } = req.body;

    const postRecompensaService = new PostRecompensaService();

    const recompensaCriado = await postRecompensaService.execute({
      nome,
      descricao,
      pontosNecessarios: Number(pontosNecessarios),
      empresaParceira,
      estoque: Number(estoque),
      imagem,
    });

    return res.json(recompensaCriado);
  }
}

export { PostRecompensaController };