import { Request, Response } from "express";
import { BecomeUserService } from "../../services/Users/BecomeUserService";

class BecomeUserController{

    async handle( req: Request, res: Response ){

        const id = req.user_id;

        const becomeUserService = new BecomeUserService()

        const usuario = await becomeUserService.execute({ id })

        return res.json(usuario)

    }

}

export { BecomeUserController }