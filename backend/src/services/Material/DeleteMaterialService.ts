import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface DeleteReq {
  id: string
}

class DeleteMaterialService {
  async execute({ id }: DeleteReq) {
    const materialExistente = await prismaClient.material.findFirst({
      where: { id }
    });

    if (!materialExistente) {
      throw new AppError("Material não encontrado", 404);
    }

    const materialDeletado = await prismaClient.material.delete({
      where: { id }
    });

    return {
      message: "Material deletado com sucesso",
      material: materialDeletado
    };
  }
}

export { DeleteMaterialService };