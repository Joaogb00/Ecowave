import { Request, Response } from "express";
import { PostMaterialService } from "../../services/Material/PostMaterialService";

class PostMaterialController{

    async handle(req: Request, res: Response){

        const { nome, fatorCO2, pontosPorKg } = req.body;

        const postMaterialService = new PostMaterialService();

        const novoMaterial = await postMaterialService.execute({
            nome,
            fatorCO2,
            pontosPorKg
        });

        return res.json(novoMaterial)

    }

}

export { PostMaterialController }