import { Request, Response } from "express";
import { DashboardAdminService } from "../../services/Admin/DashboardAdminService";

class DashboardAdminController{

    async handle(req: Request, res: Response){

        const dashboardAdminService = new DashboardAdminService();

        const dashboard = await dashboardAdminService.execute();

        return res.json(dashboard)

    }

}

export { DashboardAdminController }