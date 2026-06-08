import { Request, Response } from "express";
import { GiveAdmService } from "../../services/Users/GiveAdmService";

class GiveAdmController {
    
    async handle(req: Request, res: Response){

        const { id } = req.params;

        const giveAdmService = new GiveAdmService()

        const NovoAdmin = await giveAdmService.execute({id})

        return res.json(NovoAdmin)

    }

}

export { GiveAdmController }