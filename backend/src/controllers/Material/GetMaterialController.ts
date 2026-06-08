import { Request, Response } from "express";
import { GetMaterialService } from "../../services/Material/GetMaterialService";

class GetMaterialController {
  async handle(req: Request, res: Response) {
    const nomeIA = req.query.nome as string;

    const getMaterialService = new GetMaterialService();
    const resultado = await getMaterialService.execute(nomeIA);

    if (!resultado || (Array.isArray(resultado) && resultado.length === 0)) {
      return res.status(404).json({ message: "Material não identificado no sistema." });
    }

    return res.json(resultado);
  }
}

export { GetMaterialController };