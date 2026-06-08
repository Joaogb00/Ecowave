import { Request, Response } from "express";
import { PutDenunciaService } from "../../services/Denuncia/PutDenunciaService";

class PutDenunciaController{

    async handle(req: Request, res: Response){

        const { id } = req.params;
        const { pontoColetaId,  descricao, titulo } = req.body;
        const usuarioId = req.user_id;

        const putDenunciaService = new PutDenunciaService();

        const denunciaEditada = await putDenunciaService.execute({
            id,
            usuarioId,
            pontoColetaId,
            titulo,
            descricao
        });

        return res.json(denunciaEditada);


    }

}

export { PutDenunciaController }