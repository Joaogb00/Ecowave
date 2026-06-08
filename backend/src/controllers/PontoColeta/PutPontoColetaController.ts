import { Request, Response } from "express";
import { PutPontoColetaService } from "../../services/PontoColeta/PutPontoColetaService";

class PutPontoColetaController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const userId = req.user_id;
        const { nome, endereco, CEP, horarioAbertura, horarioFechamento, materiaisIds } = req.body;

        try {
            const listaMateriais = Array.isArray(materiaisIds) ? materiaisIds : [];

            const putPontoColetaService = new PutPontoColetaService();

            const PontoEditado = await putPontoColetaService.execute({
                id,
                userId,
                nome,
                endereco,
                CEP,
                horarioAbertura,
                horarioFechamento,
                materiaisIds: listaMateriais
            });

            return res.json(PontoEditado);
        } catch (err: any) {
            return res.status(500).json({ 
                error: "Erro ao atualizar ponto", 
                message: err.message || "Erro desconhecido" 
            });
        }
    }
}

export { PutPontoColetaController };