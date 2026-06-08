import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export class PasswordRecoveryService {
  private CODE_LENGTH = 6;
  private CODE_EXP_MINUTES = 10;
  private BLOCK_MINUTES = 10;
  private MAX_ATTEMPTS = 5;

  private generateCode(): string {
    const min = Math.pow(10, this.CODE_LENGTH - 1);
    const max = Math.pow(10, this.CODE_LENGTH) - 1;
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return String(num);
  }

  private addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  async iniciarRecuperacao(email: string): Promise<void> {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new Error("Usuário não encontrado.");

    const code = this.generateCode();
    const expires = this.addMinutes(new Date(), this.CODE_EXP_MINUTES);

    // O código abaixo garante a atualização
    await prisma.usuario.update({
      where: { email },
      data: { 
        verificationCode: code, 
        verificationExpires: expires, 
        failedAttempts: 0,
        blockedUntil: null 
      },
    });

    await this.enviarEmailCodigo(email, code);
  }

  async reenviarCodigo(email: string): Promise<void> {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new Error("Usuário não encontrado.");

    const now = new Date();
    if (usuario.blockedUntil && usuario.blockedUntil.getTime() > now.getTime()) {
      throw new Error(`Recuperação bloqueada temporariamente.`);
    }

    const code = this.generateCode();
    const expires = this.addMinutes(now, this.CODE_EXP_MINUTES);

    await prisma.usuario.update({
      where: { email },
      data: { verificationCode: code, verificationExpires: expires, failedAttempts: 0 },
    });

    await this.enviarEmailCodigo(email, code);
  }

  async verificarCodigo(email: string, code: string): Promise<boolean> {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new Error('Código inválido.');

    const now = new Date();
    if (usuario.blockedUntil && usuario.blockedUntil.getTime() > now.getTime()) {
      throw new Error('Recuperação bloqueada temporariamente.');
    }

    if (!usuario.verificationCode || usuario.verificationExpires!.getTime() < now.getTime()) {
      throw new Error('Código expirado.');
    }

    if (usuario.verificationCode !== code) {
      const newAttempts = (usuario.failedAttempts || 0) + 1;
      let blockedUntil: Date | null = null;
      if (newAttempts >= this.MAX_ATTEMPTS) blockedUntil = this.addMinutes(now, this.BLOCK_MINUTES);

      await prisma.usuario.update({
        where: { email },
        data: { failedAttempts: newAttempts, blockedUntil },
      });
      throw new Error('Código incorreto.');
    }

    await prisma.usuario.update({
      where: { email },
      data: { failedAttempts: 0, blockedUntil: null },
    });

    return true;
  }

  async redefinirSenha(email: string, newPasswordHash: string): Promise<void> {
    await prisma.usuario.update({
      where: { email },
      data: {
        senha: newPasswordHash,
        verificationCode: null,
        verificationExpires: null,
        failedAttempts: 0,
        blockedUntil: null,
      },
    });
  }

  private async enviarEmailCodigo(email: string, code: string): Promise<void> {
    // CORREÇÃO: Estrutura try/catch correta adicionada aqui
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: '"Ecowave Suporte" <suporte@ecowave.com>',
        to: email,
        subject: 'Recuperação de Senha - Ecowave',
        text: `Seu código de verificação é: ${code}`,
      });
      console.log("E-mail enviado com sucesso para:", email);
    } catch (error) {
      console.error("ERRO DETALHADO DO NODEMAILER:", error);
      throw new Error("Falha ao enviar e-mail. Verifique o servidor de e-mail.");
    }
  }
}