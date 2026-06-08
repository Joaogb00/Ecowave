import { Request, Response } from "express";
import { GetDenunciaService } from "../../services/Denuncia/GetDenunciaService";

class GetDenunciaController{

    async handle(req: Request, res: Response){

        const getDenunciaService = new GetDenunciaService();

        const denuncias = await getDenunciaService.execute()

        return res.json(denuncias)

    }

}

export { GetDenunciaController }