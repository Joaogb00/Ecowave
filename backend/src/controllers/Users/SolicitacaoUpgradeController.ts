import { Request, Response } from "express";
import { SolicitacaoUpgradeService } from "../../services/Users/SolicitacaoUpgradeService"; // Ajuste o caminho se necessário
import { AppError } from "../../middlewares/AppError";

class SolicitacaoUpgradeController {
  async aceitar(req: Request, res: Response) {
    const { id } = req.params;
    const solicitacaoUpgradeService = new SolicitacaoUpgradeService();

    try {
      const result = await solicitacaoUpgradeService.aceitar({ id });
      return res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor ao aceitar upgrade." });
    }
  }

  async recusar(req: Request, res: Response) {
    const { id } = req.params;
    const { justificativa } = req.body;
    const solicitacaoUpgradeService = new SolicitacaoUpgradeService();

    try {
      const result = await solicitacaoUpgradeService.recusar({ id, justificativa });
      return res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor ao recusar upgrade." });
    }
  }

  async listarPendentes(req: Request, res: Response) {
    const solicitacaoUpgradeService = new SolicitacaoUpgradeService();

    try {
      const result = await solicitacaoUpgradeService.listarPendentes();
      return res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor ao listar solicitações." });
    }
  }

  async statusPorUsuario(req: Request, res: Response) {
    const { userId } = req.params;
    const solicitacaoUpgradeService = new SolicitacaoUpgradeService();

    try {
      const result = await solicitacaoUpgradeService.statusPorUsuario(userId);
      return res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor ao buscar status." });
    }
  }
}

export { SolicitacaoUpgradeController };