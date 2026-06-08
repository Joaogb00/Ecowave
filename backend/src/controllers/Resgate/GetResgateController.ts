import { Request, Response } from "express";
import { GetResgateService } from "../../services/Resgate/GetResgateService";

class GetResgateController{

    async handle(req: Request, res: Response){

        const getResgateService = new GetResgateService()

        const registros = await getResgateService.execute();

        return res.json(registros)

    }

}

export { GetResgateController }