import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface PutReq {
  id: string;
  nome?: string;
  email?: string;
  senha?: string;
  totalPontos?: number;
  papel?: string;
  fotoPerfil?: string; // Aqui chegará o caminho do arquivo (path)
}

class PutUserService {
  async execute({ id, nome, email, senha, totalPontos, papel, fotoPerfil }: PutReq) {
    const usuarioExiste = await prismaClient.usuario.findUnique({
      where: { id: String(id) },
    });

    if (!usuarioExiste) {
      throw new AppError("Usuário não encontrado no banco de dados.", 404);
    }

    const dataToUpdate: any = {};

    if (nome) dataToUpdate.nome = nome;
    if (email) dataToUpdate.email = email;
    if (papel) dataToUpdate.papel = papel;
    if (fotoPerfil) dataToUpdate.fotoPerfil = fotoPerfil; // Salva o caminho do arquivo
    if (typeof totalPontos === "number") dataToUpdate.totalPontos = totalPontos;

    if (senha && senha.trim() !== "") {
      dataToUpdate.senha = await hash(senha, 8);
    }

    const updatedUser = await prismaClient.usuario.update({
      where: { id: String(id) },
      data: dataToUpdate,
    });

    return {
      message: "Dados atualizados com sucesso!",
      usuario: updatedUser,
    };
  }
}

export { PutUserService };