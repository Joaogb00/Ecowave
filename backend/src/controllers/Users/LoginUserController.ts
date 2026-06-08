import { Request, Response } from "express";
import { LoginUserService } from "../../services/Users/LoginUserService";

class LoginUserController{

    async handle(req: Request, res: Response){

        const { email, senha } = req.body

        const loginUserService = new LoginUserService()

        const userLogado = await loginUserService.execute({
            email,
            senha
        })

        return res.json(userLogado)

    }

}

export { LoginUserController }