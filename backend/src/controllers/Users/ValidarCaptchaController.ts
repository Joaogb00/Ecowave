import { Request, Response } from 'express';

export class ValidarCaptchaController {
  async handle(req: Request, res: Response) {
    const { captchaToken } = req.body;

    if (!captchaToken) {
      return res.status(400).json({ error: 'Captcha não informado.' });
    }

    // Aqui você deveria validar de fato com o serviço de captcha (reCAPTCHA, hCaptcha, etc).
    // Para efeito de exemplo, vamos aceitar qualquer token não vazio.
    const captchaValido = true;

    if (!captchaValido) {
      return res.status(400).json({ error: 'Captcha inválido.' });
    }

    return res.json({ success: true });
  }
}