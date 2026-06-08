import prismaClient from "../../prisma";
import { AppError } from "../../middlewares/AppError";

interface GetByIdReq {
    usuarioId: string
}

class GetResgateByUserService {

    async execute({ usuarioId }: GetByIdReq) {

        const recompensasResgatadas = await prismaClient.usuarioRecompensa.findMany({
            where: { usuarioId },
            include:{
                usuario:{
                    select:{
                        nome: true,
                        email: true
                    }
                },
                recompensa:{
                    select:{
                        nome: true,
                        descricao: true,
                        empresaParceira:true,
                        pontosNecessarios: true
                    }
                }
            },
            orderBy: { resgatadoEm: 'desc' }
        })

        if (recompensasResgatadas.length <= 0) {
            throw new AppError("Nenhuma Recompensa resgatada", 404)
        }

        return {
            message: "recompensas encontradas",
            recompensas: recompensasResgatadas
        }

    }

}

export { GetResgateByUserService }