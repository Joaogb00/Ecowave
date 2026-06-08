import prismaClient from "../../prisma";
import { AppError } from "../../middlewares/AppError";

interface GetByIdReq {
    usuarioId: string
}

class GetReciclagemByUserService {

    async execute({ usuarioId }: GetByIdReq) {

        const reciclagensFeitas = await prismaClient.registroReciclagem.findMany({
            where: { usuarioId },
            include:{
                usuario:{
                    select:{
                        nome: true,
                        email: true
                    }
                },
                material:{
                    select:{
                        nome:true,
                        pontosPorKg: true,
                        fatorCO2: true,
                    }
                },
                pontoColeta:{
                    select:{
                        nome: true,
                        endereco: true,
                        horarioAbertura: true,
                        horarioFechamento: true,
                    }
                }

            },
            orderBy: { criadoEm: 'desc' }
        })

        if (reciclagensFeitas.length <= 0 ) {
            throw new AppError("Nenhuma reciclagem feita", 404)
        }

        return {
            message: "Reciclagens encontradas",
            reciclagens: reciclagensFeitas
        }
        
    }


}

export { GetReciclagemByUserService }