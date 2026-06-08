import { Request, Response } from 'express';
import { PasswordRecoveryService } from '../../services/Users/PasswordRecoveryService';

export class ReenviarCodigoController {
  async handle(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'E-mail é obrigatório.' });
    }

    const service = new PasswordRecoveryService();

    try {
      await service.reenviarCodigo(email);
      return res.json({
        message: 'Se o e-mail existir, um novo código foi enviado.',
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}