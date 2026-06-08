import { Request, Response } from "express";
import { GetUniqueUserService } from "../../services/Users/GetUniqueUserService";

class GetUniqueUserController {

    async handle(req: Request, res: Response) {
        
        // MUDANÇA: Captura o ID que vem na URL (ex: /Usuario/b4bf2fd8...)
        // em vez de pegar o usuário autenticado.
        const id = req.params.id as string;

        const getUniqueUserService = new GetUniqueUserService();

        const User = await getUniqueUserService.execute({ id });

        return res.json(User);

    }

}

export { GetUniqueUserController }