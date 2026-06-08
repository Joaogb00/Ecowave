import { Request, Response } from "express";
import { DeleteDenunciaService } from "../../services/Denuncia/DeleteDenunciaService";

class DeleteDenunciaController{

    async handle(req: Request, res: Response){

        const { id } = req.params;

        const deleteDenunciaService = new DeleteDenunciaService();

        const denunciaDeletada = await deleteDenunciaService.execute({ id });

        return res.json(denunciaDeletada)

    }

}

export { DeleteDenunciaController }