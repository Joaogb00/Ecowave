import { Request, Response } from "express";
import { GetPontoByOwnerService } from "../../services/PontoColeta/GetPontoByOwnerService";

class GetPontoByOwnerController{

    async handle( req: Request, res: Response ){

        const id = req.user_id;

        const getPontoByOwnerService = new GetPontoByOwnerService();

        const pontos = await getPontoByOwnerService.execute({ id });

        return res.json(pontos);

    }

}

export { GetPontoByOwnerController }