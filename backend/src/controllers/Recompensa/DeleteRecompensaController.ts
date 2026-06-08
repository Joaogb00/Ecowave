import { Request, Response } from "express";
import { DeleteRecompensaService } from "../../services/Recompensa/DeleteRecompensaService";

class DeleteRecompensaController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteRecompensaService = new DeleteRecompensaService();

    const recompensaRemovida = await deleteRecompensaService.execute({ id });

    return res.json(recompensaRemovida);
  }
}

export { DeleteRecompensaController };