import { Request, Response } from "express";
import { PostPontoColetaService } from "../../services/PontoColeta/PostPontoColetaService";
import { AppError } from "../../middlewares/AppError";

class PostPontoColetaController {
    async handle(req: Request, res: Response) {
        try {
            // CORREÇÃO MÁGICA PARA O 403: Tenta pegar o ID de todas as formas que o middleware possa ter injetado
            const criadoPorId = req.user_id || (req as any).userId || (req as any).usuarioId; 
            
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

            // Se por algum motivo o ID do usuário não foi capturado no Token JWT pelo middleware
            if (!criadoPorId) {
                return res.status(403).json({ error: "Usuário não identificado ou permissões insuficientes para criar pontos." });
            }

            const postPontoColetaService = new PostPontoColetaService();

            const novoPonto = await postPontoColetaService.execute({
                nome,
                endereco,
                CEP,
                lat: Number(lat),
                lng: Number(lng),
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
            
            console.error("Erro interno no PostPontoColetaController:", error);
            return res.status(500).json({ error: "Erro interno ao cadastrar ponto de coleta." });
        }
    }
}

export { PostPontoColetaController };