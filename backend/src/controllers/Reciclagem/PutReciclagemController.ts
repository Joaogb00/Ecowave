import { Request, Response } from "express";
import { PutReciclagemService } from "../../services/Reciclagem/PutReciclagemService";

class PutReciclagemController{

    async handle(req: Request, res: Response){

        const { id } = req.params;
        const { pesoKg, materialId, usuarioId, pontoColetaId } = req.body;

        const putReciclagemService = new PutReciclagemService();

        const registroEditado = await putReciclagemService.execute({
            id,
            usuarioId,
            materialId,
            pontoColetaId,
            pesoKg
        });

        return res.json(registroEditado);

    }


}

export { PutReciclagemController }