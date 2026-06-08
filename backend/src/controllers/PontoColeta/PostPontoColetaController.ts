import { Request, Response } from "express";
import { PostPontoColetaService } from "../../services/PontoColeta/PostPontoColetaService";
import { AppError } from "../../middlewares/AppError";

class PostPontoColetaController {
    async handle(req: Request, res: Response) {
        try {
            // Captura o ID do usuário autenticado passado pelo middleware
            const criadoPorId = req.user_id; 
            
            const { 
                nome, 
                endereco, 
                CEP, 
                lat, 
                lng, 
                horarioAbertura, 
                horarioFechamento, 
                materiaisIds 
            } = req.body;

            // Validação básica de segurança para evitar payloads vazios
            if (!nome || !endereco || !lat || !lng) {
                return res.status(400).json({ error: "Campos obrigatórios ausentes." });
            }

            if (!materiaisIds || !Array.isArray(materiaisIds)) {
                return res.status(400).json({ error: "O campo materiaisIds deve ser um array." });
            }

            const postPontoColetaService = new PostPontoColetaService();

            const novoPonto = await postPontoColetaService.execute({
                nome,
                endereco,
                CEP,
                lat,
                lng,
                horarioAbertura,
                horarioFechamento,
                criadoPorId,
                materiaisIds
            });

            // Retorna o status 201 (Created) com o objeto criado com sucesso
            return res.status(201).json(novoPonto);
            
        } catch (error) {
            // Trata erros de regra de negócio disparados pelo Service (Ex: CEP duplicado)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            
            console.error(error);
            return res.status(500).json({ error: "Erro interno ao cadastrar ponto de coleta." });
        }
    }
}

export { PostPontoColetaController };