import { Request, Response } from "express";
import { GetReciclagemByUserService } from "../../services/Reciclagem/GetReciclagemByUserService";

class GetReciclagemByUserController {
    
    async handle(req: Request, res: Response){

        const usuarioId = req.user_id;

        const getReciclagemByUserService = new GetReciclagemByUserService();

        const reciclagensFeitas = await getReciclagemByUserService.execute({ usuarioId });

        return res.json(reciclagensFeitas)

    }

}

export { GetReciclagemByUserController }