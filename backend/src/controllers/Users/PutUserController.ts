import { Request, Response } from "express";
import { PutUserService } from "../../services/Users/PutUserService";

class PutUserController {
  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, senha, papel, totalPontos } = req.body;
      
      // Captura APENAS o nome do arquivo, ex: "12345-foto.png"
      const fotoPerfil = req.file ? req.file.filename : undefined;

      const putUserService = new PutUserService();

      const result = await putUserService.execute({
        id,
        nome,
        email,
        senha,
        papel,
        totalPontos: totalPontos ? Number(totalPontos) : undefined,
        fotoPerfil
      });

      return res.json(result);
    } catch (err: any) {
      console.error("Erro no processamento:", err.message);
      return res.status(400).json({ error: err.message });
    }
  }
}

export { PutUserController };