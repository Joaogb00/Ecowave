import { Request, Response } from 'express';
import { PasswordRecoveryService } from '../../services/Users/PasswordRecoveryService';
import bcrypt from 'bcryptjs';

export class ResetPasswordController {
  async handle(req: Request, res: Response) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ error: 'E-mail e nova senha são obrigatórios.' });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(senha, salt);

      const service = new PasswordRecoveryService();
      await service.redefinirSenha(email, hash);

      return res.json({ message: 'Senha atualizada com sucesso.' });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}