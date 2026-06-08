import { Request, Response } from "express";

class UploadRecompensaImagemController {
  async handle(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum arquivo enviado" });
    }

    // Se estiver servindo /uploads como estático:
    const imageUrl = `/uploads/${req.file.filename}`;

    return res.json({
      message: "Imagem enviada com sucesso",
      imageUrl,
    });
  }
}

export { UploadRecompensaImagemController };