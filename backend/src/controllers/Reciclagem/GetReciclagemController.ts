import { Request, Response } from "express";
import { GetReciclagemService } from "../../services/Reciclagem/GetReciclagemService";

class GetReciclagemController{

    async handle(req: Request, res: Response){

        const getReciclagemService = new GetReciclagemService();

        const registros = await getReciclagemService.execute()

        return res.json(registros)

    }

}

export { GetReciclagemController }