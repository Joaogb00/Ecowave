import { Request, Response } from "express";
import { DashboardProprietarioService } from "../../services/Propietario/DashboardProprietarioService"; // Verifique o 'r' aqui

class DashboardProprietarioController {
  async handle(req: Request, res: Response) {
    const usuarioId = req.user_id;

    const dashboardService = new DashboardProprietarioService();
    const dashboard = await dashboardService.execute(usuarioId);

    return res.json(dashboard);
  }
}

export { DashboardProprietarioController };