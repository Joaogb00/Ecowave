import { Request, Response } from "express";
import { BecomeOwnerService } from "../../services/Users/BecomeOwnerService";
import { AppError } from "../../middlewares/AppError";

class BecomeOwnerController {
  async handle(req: Request, res: Response) {
    // Pegando o ID do usuário logado através do middleware de autenticação
    const id = req.user_id; 

    const becomeOwnerService = new BecomeOwnerService();

    try {
      const result = await becomeOwnerService.execute({ id });
      return res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export { BecomeOwnerController };