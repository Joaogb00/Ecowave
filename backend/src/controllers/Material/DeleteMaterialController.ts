import { Request, Response } from "express";
import { DeleteMaterialService } from "../../services/Material/DeleteMaterialService";

class DeleteMaterialController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteMaterialService = new DeleteMaterialService();

    const materialDeletado = await deleteMaterialService.execute({ id });

    return res.json(materialDeletado);
  }
}

export { DeleteMaterialController };