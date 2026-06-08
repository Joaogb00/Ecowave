import { Request, Response } from "express";
import { GetResgateByUserService } from "../../services/Resgate/GetResgateByUserService";

class GetResgateByUserController{

    async handle(req: Request, res: Response){

        const usuarioId = req.user_id;

        const getResgateByUserService = new GetResgateByUserService();

        const recompensasResgatadas = await getResgateByUserService.execute({ usuarioId })

        return res.json(recompensasResgatadas)

    }

}

export { GetResgateByUserController }