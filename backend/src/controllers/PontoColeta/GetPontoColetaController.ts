import { Request, Response } from "express";
import { GetPontoColetaService } from "../../services/PontoColeta/GetPontoColetaService";

class GetPontoColetaController{

    async handle(req: Request, res: Response){

        const getPontoColetaService = new GetPontoColetaService();

        const pontos = await getPontoColetaService.execute();

        return res.json(pontos)

    }

}

export { GetPontoColetaController }