import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface GetReq {
    id: string
}

class GetUniqueUserService {

    async execute({ id }: GetReq) {

        const UsuarioExistente = await prismaClient.usuario.findFirst({
            where: { id }
        });

        if (!UsuarioExistente) {
            throw new AppError("Usuario não existante", 404)
        } else {

            return {
                message: "Usuario encontrado",
                usuario: UsuarioExistente
            }

        }

    }

}

export { GetUniqueUserService }