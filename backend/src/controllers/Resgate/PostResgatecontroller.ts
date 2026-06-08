import { Request, Response } from "express";
import { PostResgateService } from "../../services/Resgate/PostResgateService";

class PostResgateController {
    async handle(req: Request, res: Response) {
        const usuarioId = req.user_id;
        const { itens, endereco } = req.body; // Pega itens[] e endereco do corpo

        const postResgateService = new PostResgateService();

        const resultado = await postResgateService.execute({
            usuarioId,
            itens,
            endereco
        });

        return res.json(resultado);
    }
}

export { PostResgateController }