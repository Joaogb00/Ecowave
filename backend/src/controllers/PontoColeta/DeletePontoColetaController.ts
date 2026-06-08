import { Request, Response } from "express";
import { DeletePontoColetaService } from "../../services/PontoColeta/DeletePontoColetaService";

class DeletePontoColetaController{

    async handle(req: Request, res: Response){

        const { id } = req.params;
        
        const deletePontoColetaService = new DeletePontoColetaService;

        const pontoDeletado = await deletePontoColetaService.execute({ id });

        return res.json(pontoDeletado)


    }

}

export { DeletePontoColetaController }