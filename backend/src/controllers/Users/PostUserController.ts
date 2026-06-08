import { Request, Response } from "express";
import { PostUserService } from "../../services/Users/PostUserService";

class PostUserController {
  async handle(req: Request, res: Response) {
    const { nome, email, senha, papel } = req.body;

    const postUserService = new PostUserService();

    const NovoUsuario = await postUserService.execute({
      nome,
      email,
      senha,
      papel,
    });

    return res.json(NovoUsuario);
  }
}

export { PostUserController };