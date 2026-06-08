import { Request, Response } from 'express';
import { PasswordRecoveryService } from '../../services/Users/PasswordRecoveryService';

export class VerificarCodigoController {
  async handle(req: Request, res: Response) {
    console.log("Dados recebidos:", req.body); // Adicione isso!
    const { email, code } = req.body;

    if (!email || !code) {
      console.log("Erro: Falta email ou código"); // Adicione isso!
      return res.status(400).json({ error: 'E-mail e código são obrigatórios.' });
    }

    const service = new PasswordRecoveryService();

    try {
      await service.verificarCodigo(email, code);
      return res.json({ message: 'Código verificado com sucesso.' });
    } catch (err: any) {
      console.log("Erro na verificação:", err.message); // Adicione isso!
      return res.status(400).json({ error: err.message });
    }
  }
}