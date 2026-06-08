import { Request, Response } from 'express';
import { PasswordRecoveryService } from '../../services/Users/PasswordRecoveryService';

export class EsqueciSenhaController {
  async handle(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'E-mail é obrigatório.' });
    }

    const service = new PasswordRecoveryService();

    try {
      await service.iniciarRecuperacao(email);
      return res.json({
        message: 'Se o e-mail existir, um código foi enviado.',
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}