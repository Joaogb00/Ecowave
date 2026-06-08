import { Request, Response } from "express";
import { PostDenunciaService } from "../../services/Denuncia/PostDenunciaService";

class PostDenunciaController {
    
    async handle(req: Request, res: Response){

        const usuarioId = req.user_id

        // Removemos o 'titulo' da desestruturação do corpo da requisição
        const { pontoColetaId, descricao, titulo } = req.body;

        const postDenunciaService = new PostDenunciaService();

        // Passamos para o service apenas os campos que ele espera receber
        const novaDenuncia = await postDenunciaService.execute({
            usuarioId,
            pontoColetaId,
            descricao,
            titulo
        });

        return res.json(novaDenuncia);

    }

}

export { PostDenunciaController };