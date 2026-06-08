import { Request, Response } from "express";
import { GetRecompensaService } from "../../services/Recompensa/GetRecompensaService";

class GetRecompensaController {
  async handle(req: Request, res: Response) {
    const getRecompensaService = new GetRecompensaService();

    const recompensas = await getRecompensaService.execute();

    return res.json(recompensas);
  }
}

export { GetRecompensaController };