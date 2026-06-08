import { Request, Response } from "express";
import { PutMaterialService } from "../../services/Material/PutMaterialService";

class PutMaterialController{

    async handle(req: Request, res: Response){

        const { id } = req.params;
        const { nome, fatorCO2, pontosPorKg } = req.body;

        const putMaterialService = new PutMaterialService;

        const materialEditado = await putMaterialService.execute({
            id,
            nome,
            fatorCO2,
            pontosPorKg
        });

        return res.json(materialEditado);

    }

}

export { PutMaterialController }